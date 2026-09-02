import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { DemoBadge } from "../components/Chrome";
import { PlanTable, type PlanRow } from "../components/PlanTable";
import { ScanOverlay } from "../components/ScanOverlay";
import { atlasRegions } from "../data/clinical/journey";
import { getTreatment } from "../data/clinical/treatmentCatalog";
import { entityName } from "../lib/entityName";
import { generateAfterPreview } from "../lib/afterEngine";
import {
  enabledTreatmentIds,
  enabledZoneIds,
  injectionMarks,
  localAnalyze,
  overrideFinding,
  uniqueIds,
} from "../lib/clinicalScan";
import { buildDosePlan, type DoseLine } from "../lib/doseEngine";
import {
  alignFace,
  defaultIntent,
  hitRegion,
  intentsFor,
  SIM_REGIONS,
  type AfterIntent,
  type FaceFrame,
  type SimRegionId,
  type TreatmentKind,
} from "../lib/face";
import type { ScanFinding } from "../lib/scanTypes";
import { analyzeFace, fetchVertexHealth, simulateAfter } from "../lib/vertexApi";
import { useLocale } from "../i18n/LocaleContext";
import type { Localized } from "../i18n/types";

const TREATMENTS: TreatmentKind[] = [
  "filler",
  "tightening",
  "wrinkles",
  "toxin-aesthetic",
  "toxin-therapeutic",
];

type Status = "idle" | "loading" | "noface" | "scanning" | "ready" | "warping";
type AfterSource = "vertex" | "local" | null;

function formatDose(line: DoseLine | undefined): string {
  if (!line) return "—";
  const unit = line.unit === "ml" ? "ml" : "U";
  return `${line.calculated} ${unit}`;
}

function perSiteLabel(line: DoseLine): string {
  const n = Math.max(line.sitesTypical, 1);
  if (line.unit === "ml") return `${Number((line.calculated / n).toFixed(2))} ml`;
  return `${Math.max(1, Math.round(line.calculated / n))} U`;
}

async function localAfter(frame: FaceFrame, findings: ScanFinding[]): Promise<string> {
  const treatmentIds = enabledTreatmentIds(findings);
  if (!treatmentIds.length) return frame.image.toDataURL("image/jpeg", 0.9);
  try {
    const canvas = await generateAfterPreview({
      source: frame.image,
      treatmentIds,
      zoneIds: enabledZoneIds(findings),
      strength: 84,
      maxWidth: Math.max(frame.width, 960),
    });
    return canvas.toDataURL("image/jpeg", 0.92);
  } catch {
    return frame.image.toDataURL("image/jpeg", 0.9);
  }
}

export function HomePage() {
  const { locale, strings, t } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const runRef = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [frame, setFrame] = useState<FaceFrame | null>(null);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [injectUrl, setInjectUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [findings, setFindings] = useState<ScanFinding[]>([]);
  const [clinicalNote, setClinicalNote] = useState("");
  const [vertexLive, setVertexLive] = useState(false);
  const [afterSource, setAfterSource] = useState<AfterSource>(null);
  const [afterBlocked, setAfterBlocked] = useState(false);
  const [selected, setSelected] = useState<SimRegionId | null>(null);
  const [treatment, setTreatment] = useState<TreatmentKind>("filler");
  const [intent, setIntent] = useState<AfterIntent>("fuller");
  const [cameraOn, setCameraOn] = useState(false);
  const regions = atlasRegions();

  const treatmentLabels: Record<TreatmentKind, Localized> = {
    filler: strings.family.filler,
    tightening: strings.family.tightening,
    wrinkles: strings.family.wrinkles,
    "toxin-aesthetic": strings.family["toxin-aesthetic"],
    "toxin-therapeutic": strings.family["toxin-therapeutic"],
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (selected) setIntent(defaultIntent(selected, treatment));
  }, [selected, treatment]);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  function resetSession() {
    setAfterUrl(null);
    setInjectUrl(null);
    setFindings([]);
    setClinicalNote("");
    setSelected(null);
    setAfterSource(null);
    setAfterBlocked(false);
  }

  async function paintAfter(aligned: FaceFrame, nextFindings: ScanFinding[], tryVertex: boolean, token: number) {
    const localUrl = await localAfter(aligned, nextFindings);
    if (token !== runRef.current) return;
    setAfterUrl(localUrl);
    setAfterSource("local");
    if (!tryVertex) return;
    const enabled = nextFindings.filter((item) => item.enabled);
    const sim = await simulateAfter({
      image: aligned.image.toDataURL("image/jpeg", 0.92),
      findings: enabled,
      treatmentIds: enabledTreatmentIds(enabled),
      locale,
    });
    if (token !== runRef.current) return;
    if (sim.ok) {
      setAfterUrl(sim.after);
      setAfterSource("vertex");
      setAfterBlocked(false);
    } else if (sim.code === "FACE_EDIT_BLOCKED") {
      setAfterBlocked(true);
    }
  }

  async function ingest(source: ImageBitmap | HTMLImageElement | HTMLCanvasElement) {
    const token = ++runRef.current;
    setStatus("loading");
    resetSession();
    try {
      const aligned = await alignFace(source);
      if (token !== runRef.current) return;
      if (!aligned) {
        setFrame(null);
        setBeforeUrl(null);
        setStatus("noface");
        return;
      }
      const jpeg = aligned.image.toDataURL("image/jpeg", 0.92);
      setFrame(aligned);
      setBeforeUrl(jpeg);
      setInjectUrl(jpeg);
      setStatus("scanning");

      const health = await fetchVertexHealth();
      if (token !== runRef.current) return;
      setVertexLive(health.vertex);

      let nextFindings: ScanFinding[] = localAnalyze(aligned);
      let note = "";
      if (health.vertex) {
        const remote = await analyzeFace({ image: jpeg, locale });
        if (token !== runRef.current) return;
        if (remote.ok && remote.data.findings.length) {
          nextFindings = remote.data.findings.map((item, index) => ({
            ...item,
            id: item.id || `vertex-${item.regionId}-${index}`,
            enabled: true,
          }));
          note = remote.data.clinicalNote;
        }
      }
      setFindings(nextFindings);
      setClinicalNote(note);
      setStatus("warping");
      await paintAfter(aligned, nextFindings, health.vertex, token);
      if (token !== runRef.current) return;
      setStatus("ready");
    } catch {
      if (token !== runRef.current) return;
      setFrame(null);
      setBeforeUrl(null);
      setStatus("noface");
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    stopCamera();
    const bitmap = await createImageBitmap(file);
    await ingest(bitmap);
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch {
      setStatus("noface");
    }
  }

  async function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    stopCamera();
    await ingest(canvas);
  }

  function onStageClick(event: MouseEvent<HTMLDivElement>) {
    if (!frame || (status !== "ready" && status !== "warping")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const ny = (event.clientY - rect.top) / Math.max(rect.height, 1);
    const id = hitRegion(frame.landmarks, nx, ny);
    if (id) setSelected(id);
  }

  async function generate() {
    if (!frame) return;
    const token = ++runRef.current;
    setStatus("warping");
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => window.setTimeout(resolve, 30));
    });
    const merged = selected
      ? (() => {
          const next = overrideFinding(selected, treatment, frame.landmarks, locale);
          if (!next) return findings;
          return [...findings.filter((item) => item.regionId !== selected), next];
        })()
      : findings;
    if (selected) setFindings(merged);
    try {
      await paintAfter(frame, merged, vertexLive, token);
      if (token !== runRef.current) return;
      setStatus("ready");
    } catch {
      if (token !== runRef.current) return;
      setStatus("ready");
    }
  }

  const selectedDef = SIM_REGIONS.find((item) => item.id === selected);
  const selectedRegion = selectedDef
    ? regions.find((item) => item.id === selectedDef.atlasId)
    : undefined;
  const atlasLink = selectedDef ? `/journey/${selectedDef.atlasId}` : "/atlas";
  const intentOptions = selected ? intentsFor(selected) : [];

  const dosePlan = useMemo(
    () => buildDosePlan(enabledTreatmentIds(findings), enabledZoneIds(findings), locale),
    [findings, locale],
  );

  const injectMarks = useMemo(() => {
    if (!frame) return [];
    return dosePlan.lines.flatMap((line) =>
      injectionMarks(frame.landmarks, line.treatmentId, line.sitesTypical, perSiteLabel(line)),
    );
  }, [dosePlan.lines, frame]);

  const tableRows: PlanRow[] = useMemo(() => {
    const byTreatment = new Map(dosePlan.lines.map((line) => [line.treatmentId, line]));
    return findings.map((finding) => {
      const treatmentId = finding.suggestedTreatmentIds[0];
      const line = treatmentId ? byTreatment.get(treatmentId) : undefined;
      const catalog = treatmentId ? getTreatment(treatmentId) : undefined;
      const regionDef = SIM_REGIONS.find((item) => item.id === finding.regionId);
      const regionEntity = regionDef
        ? regions.find((item) => item.id === regionDef.atlasId)
        : undefined;
      return {
        finding,
        region: regionEntity
          ? entityName(regionEntity, locale)
          : finding.regionId,
        treatment: catalog?.title[locale] ?? line?.title ?? "—",
        material: line?.materialName ?? catalog?.material.name[locale] ?? "—",
        dose: formatDose(line),
        plane: line?.plane ?? catalog?.dosing.plane[locale] ?? "—",
      };
    });
  }, [dosePlan.lines, findings, locale, regions]);

  const education = uniqueIds(dosePlan.education).slice(0, 3);

  return (
    <div className="sim-page">
      <div className="sim-copy">
        <p className="eyebrow">{t(strings.nav.simulate)}</p>
        <h1>{t(strings.sim.title)}</h1>
        <p className="lead">{t(strings.sim.lead)}</p>
      </div>

      {cameraOn ? (
        <div className="sim-rig">
          <div className="sim-frame">
            <video ref={videoRef} autoPlay playsInline muted className="sim-video" />
            <div className="sim-frame-meta">
              <DemoBadge label={t(strings.sim.demoLabel)} />
            </div>
          </div>
        </div>
      ) : (
        <div className="sim-plates">
          <SimPlate
            kicker={t(strings.sim.scanPanel)}
            demo={t(strings.sim.demoLabel)}
            emptyTitle={t(strings.sim.title)}
            emptyLead={t(strings.sim.lead)}
            src={beforeUrl}
            alt={t(strings.sim.scanPanel)}
            onClick={onStageClick}
          >
            {frame && beforeUrl ? (
              <ScanOverlay
                landmarks={frame.landmarks}
                findings={findings}
                mode="scan"
                selected={selected}
                onSelectRegion={setSelected}
              />
            ) : null}
          </SimPlate>
          <SimPlate
            kicker={t(strings.sim.injectPanel)}
            demo={t(strings.sim.demoLabel)}
            emptyTitle={t(strings.sim.injectPanel)}
            emptyLead={t(strings.sim.lead)}
            src={injectUrl}
            alt={t(strings.sim.injectPanel)}
          >
            {frame && injectUrl ? (
              <ScanOverlay
                landmarks={frame.landmarks}
                findings={findings}
                mode="inject"
                selected={selected}
                marks={injectMarks}
                onSelectRegion={setSelected}
              />
            ) : null}
          </SimPlate>
          <SimPlate
            kicker={t(strings.sim.afterPanel)}
            demo={t(strings.sim.demoLabel)}
            emptyTitle={t(strings.sim.afterPanel)}
            emptyLead={t(strings.sim.afterIdle)}
            src={afterUrl ?? (status === "scanning" || status === "warping" ? beforeUrl : null)}
            alt={t(strings.sim.after)}
          />
        </div>
      )}

      {status === "loading" ? <p className="sim-status">{t(strings.sim.aligning)}</p> : null}
      {status === "scanning" ? <p className="sim-status">{t(strings.sim.scanning)}</p> : null}
      {status === "noface" ? <p className="sim-status error">{t(strings.sim.noFace)}</p> : null}
      {status === "warping" ? <p className="sim-status">{t(strings.sim.generating)}</p> : null}
      {status === "ready" && !selected && findings.length === 0 ? (
        <p className="sim-status">{t(strings.sim.tapFace)}</p>
      ) : null}
      {frame && !vertexLive ? <p className="sim-status">{t(strings.sim.degraded)}</p> : null}
      {afterBlocked && afterSource === "local" && status === "ready" ? (
        <p className="sim-status">{t(strings.sim.faceBlocked)}</p>
      ) : null}

      <div className="sim-dock">
        <div className="sim-actions">
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            {t(strings.sim.upload)}
          </button>
          {cameraOn ? (
            <button type="button" className="btn" onClick={() => void capture()}>
              {t(strings.sim.capture)}
            </button>
          ) : (
            <button type="button" className="btn ghost" onClick={() => void startCamera()}>
              {t(strings.sim.camera)}
            </button>
          )}
          {frame ? (
            <button type="button" className="btn ghost" onClick={() => fileRef.current?.click()}>
              {t(strings.sim.retryPhoto)}
            </button>
          ) : null}
          {frame ? (
            <button type="button" className="btn" disabled={status === "warping" || status === "scanning"} onClick={() => void generate()}>
              {t(strings.sim.regenerate)}
            </button>
          ) : null}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={(event) => void onFile(event.target.files?.[0])}
        />

        {selected && selectedRegion ? (
          <div className="sim-plan">
            <div>
              <div className="kicker">{t(strings.sim.override)}</div>
              <strong>{entityName(selectedRegion, locale)}</strong>
            </div>
            <div>
              <div className="kicker">{t(strings.sim.treatment)}</div>
              <div className="chip-row">
                {TREATMENTS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="chip"
                    aria-pressed={treatment === id}
                    onClick={() => setTreatment(id)}
                  >
                    {t(treatmentLabels[id])}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="kicker">{t(strings.sim.expect)}</div>
              <div className="chip-row">
                {intentOptions.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="chip"
                    aria-pressed={intent === id}
                    onClick={() => setIntent(id)}
                  >
                    {t(strings.sim.intent[id])}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="btn" disabled={status === "warping"} onClick={() => void generate()}>
              {t(strings.sim.generate)}
            </button>
            <Link className="btn ghost" to={atlasLink}>
              {t(strings.sim.openAtlas)}
            </Link>
          </div>
        ) : null}

        {findings.length ? (
          <div className="sim-plan-block">
            <div className="kicker">{t(strings.sim.planTitle)}</div>
            <PlanTable
              rows={tableRows}
              locale={locale}
              onToggle={(id, enabled) => {
                setFindings((current) => current.map((item) => (item.id === id ? { ...item, enabled } : item)));
              }}
            />
            {clinicalNote ? <p className="sim-note">{clinicalNote}</p> : null}
            <p className="sim-note">
              {t(strings.ifuWins)} {t(strings.clinicianDecides)}
            </p>
            {education.length ? (
              <ul className="sim-edu">
                {education.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SimPlate({
  kicker,
  demo,
  emptyTitle,
  emptyLead,
  src,
  alt,
  onClick,
  children,
}: {
  kicker: string;
  demo: string;
  emptyTitle: string;
  emptyLead: string;
  src: string | null;
  alt: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  children?: ReactNode;
}) {
  return (
    <figure className="sim-plate">
      <figcaption>
        <span className="kicker">{kicker}</span>
      </figcaption>
      <div className={`sim-frame${src ? " has-face" : ""}`} onClick={onClick} role="presentation">
        {src ? (
          <>
            <img className="sim-before" src={src} alt={alt} />
            {children}
          </>
        ) : (
          <div className="sim-empty">
            <strong>{emptyTitle}</strong>
            <span>{emptyLead}</span>
          </div>
        )}
        <div className="sim-frame-meta">
          <DemoBadge label={demo} />
        </div>
      </div>
    </figure>
  );
}
