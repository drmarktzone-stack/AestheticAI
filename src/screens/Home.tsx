import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { DemoBadge } from "../components/Chrome";
import { atlasRegions } from "../data/clinical/journey";
import { entityName } from "../lib/entityName";
import {
  alignFace,
  defaultIntent,
  hitRegion,
  intentsFor,
  regionCenter,
  renderAfter,
  SIM_REGIONS,
  type AfterIntent,
  type FaceFrame,
  type RegionPlan,
  type SimRegionId,
  type TreatmentKind,
} from "../lib/face";
import { useLocale } from "../i18n/LocaleContext";
import type { Localized } from "../i18n/types";

const TREATMENTS: TreatmentKind[] = [
  "filler",
  "tightening",
  "wrinkles",
  "toxin-aesthetic",
  "toxin-therapeutic",
];

type Status = "idle" | "loading" | "noface" | "ready" | "warping";

export function HomePage() {
  const { locale, strings, t } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [frame, setFrame] = useState<FaceFrame | null>(null);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<SimRegionId | null>(null);
  const [treatment, setTreatment] = useState<TreatmentKind>("filler");
  const [intent, setIntent] = useState<AfterIntent>("fuller");
  const [plans, setPlans] = useState<RegionPlan[]>([]);
  const [split, setSplit] = useState(100);
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

  async function ingest(source: ImageBitmap | HTMLImageElement | HTMLCanvasElement) {
    setStatus("loading");
    setAfterUrl(null);
    setPlans([]);
    setSelected(null);
    setSplit(100);
    try {
      const aligned = await alignFace(source);
      if (!aligned) {
        setFrame(null);
        setBeforeUrl(null);
        setStatus("noface");
        return;
      }
      setFrame(aligned);
      setBeforeUrl(aligned.image.toDataURL("image/jpeg", 0.92));
      setStatus("ready");
    } catch {
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

  function onStageClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!frame || status !== "ready") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const ny = (event.clientY - rect.top) / Math.max(rect.height, 1);
    const id = hitRegion(frame.landmarks, nx, ny);
    if (id) setSelected(id);
  }

  async function generate() {
    if (!frame || !selected) return;
    setStatus("warping");
    const plan: RegionPlan = { regionId: selected, treatment, intent };
    const merged = [...plans.filter((item) => item.regionId !== selected), plan];
    setPlans(merged);
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => window.setTimeout(resolve, 30));
    });
    try {
      const canvas = renderAfter(frame, merged);
      setAfterUrl(canvas.toDataURL("image/jpeg", 0.9));
      setSplit(48);
      setStatus("ready");
    } catch {
      setStatus("ready");
    }
  }

  const selectedDef = SIM_REGIONS.find((item) => item.id === selected);
  const selectedRegion = selectedDef
    ? regions.find((item) => item.id === selectedDef.atlasId)
    : undefined;
  const atlasLink = selectedDef ? `/journey/${selectedDef.atlasId}` : "/atlas";
  const intentOptions = selected ? intentsFor(selected) : [];

  const markers = useMemo(() => {
    if (!frame) return [];
    return SIM_REGIONS.map((def) => ({
      id: def.id,
      ...regionCenter(frame.landmarks, def.id),
      label: entityName(regions.find((item) => item.id === def.atlasId) ?? { nameHe: def.id, nameEn: def.id }, locale),
    }));
  }, [frame, locale, regions]);

  return (
    <div className="sim-page">
      <div className="sim-copy">
        <p className="eyebrow">{t(strings.nav.simulate)}</p>
        <h1>{t(strings.sim.title)}</h1>
        <p className="lead">{t(strings.sim.lead)}</p>
      </div>

      <div className="sim-rig">
        <div
          className={`sim-frame${frame ? " has-face" : ""}`}
          onClick={onStageClick}
          role="presentation"
        >
          {cameraOn ? (
            <video ref={videoRef} autoPlay playsInline muted className="sim-video" />
          ) : beforeUrl ? (
            <>
              <img className="sim-before" src={beforeUrl} alt={t(strings.sim.before)} />
              {afterUrl ? (
                <img
                  className="sim-after"
                  src={afterUrl}
                  alt={t(strings.sim.after)}
                  style={{ clipPath: `inset(0 0 0 ${split}%)` }}
                />
              ) : null}
              <svg className="sim-marks" viewBox="0 0 100 100" preserveAspectRatio="none">
                {markers.map((mark) => (
                  <g
                    key={mark.id}
                    className={selected === mark.id ? "on" : undefined}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelected(mark.id);
                    }}
                  >
                    <circle cx={mark.x * 100} cy={mark.y * 100} r={selected === mark.id ? 2.1 : 1.35} />
                  </g>
                ))}
              </svg>
            </>
          ) : (
            <div className="sim-empty">
              <strong>{t(strings.sim.title)}</strong>
              <span>{t(strings.sim.lead)}</span>
            </div>
          )}
          <div className="sim-frame-meta">
            <DemoBadge label={t(strings.sim.demoLabel)} />
            {afterUrl ? (
              <div className="sim-slider">
                <span>{t(strings.sim.before)}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={split}
                  onChange={(event) => setSplit(Number(event.target.value))}
                  onClick={(event) => event.stopPropagation()}
                />
                <span>{t(strings.sim.after)}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {status === "loading" ? <p className="sim-status">{t(strings.sim.aligning)}</p> : null}
      {status === "noface" ? <p className="sim-status error">{t(strings.sim.noFace)}</p> : null}
      {status === "warping" ? <p className="sim-status">{t(strings.sim.generating)}</p> : null}
      {status === "ready" && !selected ? <p className="sim-status">{t(strings.sim.tapFace)}</p> : null}

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
              <div className="kicker">{t(strings.sim.tapFace)}</div>
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
      </div>
    </div>
  );
}
