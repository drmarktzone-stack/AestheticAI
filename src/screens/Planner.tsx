import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { CitationList } from "../components/CitationList";
import { DemoBadge, DraftBadge, StatusBanner } from "../components/Chrome";
import { InjectionMap } from "../components/InjectionMap";
import { CLINICAL_TREATMENTS, type TreatmentFamily } from "../data/clinical/treatmentCatalog";
import { atlasRegions, protocolForTreatment } from "../data/clinical/journey";
import { faceZones, zonesForRegion } from "../data/faceZones";
import { getCitation } from "../data";
import { buildDosePlan } from "../lib/doseEngine";
import { generateAfterPreview } from "../lib/afterEngine";
import { entityName } from "../lib/entityName";
import { USER_LIPS } from "../lib/assets";
import { useLocale } from "../i18n/LocaleContext";
import type { Localized } from "../i18n/types";

type PhotoState = "empty" | "loading" | "error" | "success";
type AfterState = "empty" | "loading" | "error" | "success";
type PlannerType = "filler" | "tightening" | "wrinkles" | "toxin-aesthetic" | "toxin-therapeutic";

const TYPE_FILTER: Record<PlannerType, (family: TreatmentFamily, id: string) => boolean> = {
  filler: (family) => family === "filler",
  tightening: (family) => family === "biostim",
  wrinkles: (family, id) =>
    family === "toxin-aesthetic" && ["toxin-glabella", "toxin-forehead", "toxin-crows"].includes(id),
  "toxin-aesthetic": (family) => family === "toxin-aesthetic",
  "toxin-therapeutic": (family) => family === "toxin-therapeutic",
};

const PLANNER_TYPES = Object.keys(TYPE_FILTER) as PlannerType[];

export function PlannerPage() {
  const { locale, strings, t } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoState, setPhotoState] = useState<PhotoState>("empty");
  const [zones, setZones] = useState<string[]>(["lips"]);
  const [types, setTypes] = useState<PlannerType[]>(["filler", "toxin-aesthetic"]);
  const [afterState, setAfterState] = useState<AfterState>("empty");
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [strength, setStrength] = useState(58);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      imageRef.current = image;
      setPhoto(USER_LIPS.before);
      setPhotoState("success");
    };
    image.onerror = () => setPhotoState("error");
    image.src = USER_LIPS.before;
  }, []);

  const typeLabels: Record<PlannerType, Localized> = {
    filler: strings.family.filler,
    tightening: strings.family.tightening,
    wrinkles: strings.family.wrinkles,
    "toxin-aesthetic": strings.family["toxin-aesthetic"],
    "toxin-therapeutic": strings.family["toxin-therapeutic"],
  };

  const selectedTreatments = useMemo(
    () =>
      CLINICAL_TREATMENTS.filter((treatment) =>
        types.some((type) => TYPE_FILTER[type](treatment.family, treatment.id)),
      ).filter((treatment) =>
        treatment.zoneIds.some(
          (zone) =>
            zones.includes(zone) ||
            zones.includes(treatment.zoneIds[0] ?? "") ||
            faceZones.some((mapped) => mapped.id === zone && zones.includes(mapped.regionId)),
        ),
      ),
    [types, zones],
  );

  const treatmentIds = selectedTreatments.map((treatment) => treatment.id);
  const plan = useMemo(
    () => buildDosePlan(treatmentIds, zones, locale),
    [treatmentIds, zones, locale],
  );

  const resolvedProtocols = unique(
    treatmentIds
      .map((id) => protocolForTreatment(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    (item) => item.id,
  );

  const citations = unique(
    resolvedProtocols
      .flatMap((protocol) => protocol.citationIds ?? [])
      .map((id) => getCitation(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    (item) => item.id,
  );

  function loadUrl(url: string) {
    setPhotoState("loading");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      imageRef.current = image;
      setPhoto(url);
      setPhotoState("success");
      setAfterState("empty");
      setAfterUrl(null);
    };
    image.onerror = () => {
      setPhotoState("error");
    };
    image.src = url;
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    loadUrl(URL.createObjectURL(file));
  }

  function toggleType(id: PlannerType) {
    setTypes((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleZone(id: string) {
    setZones((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleRegion(regionId: string) {
    const ids = zonesForRegion(regionId);
    setZones((current) => {
      const has = ids.some((zoneId) => current.includes(zoneId));
      return has ? current.filter((zoneId) => !ids.includes(zoneId)) : [...current, ...ids];
    });
  }

  async function runAfter() {
    if (!imageRef.current || !treatmentIds.length) {
      setAfterState("error");
      return;
    }
    setAfterState("loading");
    try {
      const canvas = await generateAfterPreview({
        source: imageRef.current,
        treatmentIds,
        zoneIds: zones,
        strength,
      });
      setAfterUrl(canvas.toDataURL("image/jpeg", 0.86));
      setAfterState("success");
    } catch {
      setAfterState("error");
    }
  }

  const canPlan = photoState === "success" && zones.length > 0 && types.length > 0 && plan.lines.length > 0;
  const regions = atlasRegions();
  const canvasSrc = afterUrl ?? photo;

  function regionNamesFor(zoneIds: string[]): string {
    const ids = unique(
      zoneIds.map((zoneId) => faceZones.find((zone) => zone.id === zoneId)?.regionId ?? zoneId),
      (id) => id,
    );
    return ids
      .map((id) => {
        const region = regions.find((item) => item.id === id);
        return region ? entityName(region, locale) : id;
      })
      .join(" · ");
  }

  function formatDose(unit: string, value: number): string {
    return unit === "units" ? `U ${value}` : `ml ${value}`;
  }

  return (
    <div className="page">
      <section className="opening">
        <div className="eyebrow">{t(strings.nav.planner)}</div>
        <h1>{t(strings.planner.title)}</h1>
        <p className="lead">{t(strings.planner.lead)}</p>
        <p className="tiny">{t(strings.planner.liveAiOff)}</p>
      </section>

      <ol className="planner-steps" aria-label={t(strings.planner.title)}>
        {[
          strings.planner.stepPhoto,
          strings.planner.stepRegions,
          strings.planner.stepTypes,
          strings.planner.stepPlan,
          strings.planner.stepAfter,
        ].map((label, index) => {
          const done =
            (index === 0 && photoState === "success") ||
            (index === 1 && zones.length > 0) ||
            (index === 2 && types.length > 0) ||
            (index === 3 && canPlan) ||
            (index === 4 && afterState === "success");
          const current =
            (index === 0 && photoState !== "success") ||
            (index === 4 && canPlan && afterState !== "success");
          return (
            <li key={index} className={done ? "done" : current ? "current" : undefined}>
              <span>{index + 1}</span>
              {t(label)}
            </li>
          );
        })}
      </ol>

      <div className="planner-workspace">
        <div className="stack">
          <div className="canvas-toolbar">
            <button type="button" className="btn ghost" onClick={() => fileRef.current?.click()}>
              {t(strings.planner.uploadSource)}
            </button>
            <button type="button" className="btn ghost" onClick={() => loadUrl(USER_LIPS.before)}>
              {t(strings.planner.useDemo)}
            </button>
            <span className="badge demo">{t(strings.planner.illustrativeAfter)}</span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(event) => onFile(event.target.files?.[0])}
          />
          {photoState === "empty" ? <StatusBanner tone="empty">{t(strings.planner.photoEmpty)}</StatusBanner> : null}
          {photoState === "loading" ? <StatusBanner tone="loading">{t(strings.loading)}</StatusBanner> : null}
          {photoState === "error" ? <StatusBanner tone="error">{t(strings.planner.photoError)}</StatusBanner> : null}
          {canvasSrc ? (
            <>
              <InjectionMap
                photo={canvasSrc}
                selected={zones}
                onToggle={toggleZone}
                onToggleRegion={toggleRegion}
              />
              <div className="canvas-meta">
                <span>{t(strings.planner.canvasMeta)}</span>
                <span>ZOOM 100%</span>
              </div>
            </>
          ) : (
            <StatusBanner tone="empty">{t(strings.planner.photoEmpty)}</StatusBanner>
          )}
          {afterUrl ? (
            <div className="compare">
              <figure className="media-frame">
                <img src={photo ?? ""} alt={t(strings.planner.before)} />
                <figcaption className="caption">
                  <DemoBadge label={t(strings.planner.before)} />
                </figcaption>
              </figure>
              <figure className="media-frame">
                <img src={afterUrl} alt={t(strings.planner.after)} />
                <figcaption className="caption">
                  <DemoBadge label={t(strings.demo)} />
                  <DraftBadge label={t(strings.demoNotResult)} />
                </figcaption>
              </figure>
            </div>
          ) : null}
        </div>

        <div className="stack">
          <section className="step-block">
            <h3>{t(strings.planner.markRegions)}</h3>
            <p className="tiny">{t(strings.planner.markHint)}</p>
            <div className="chip-row">
              {regions.map((region) => {
                const ids = zonesForRegion(region.id);
                const active = ids.some((zoneId) => zones.includes(zoneId));
                return (
                  <button
                    key={region.id}
                    type="button"
                    className="chip"
                    aria-pressed={active}
                    onClick={() => toggleRegion(region.id)}
                  >
                    {entityName(region, locale)}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="step-block">
            <h3>{t(strings.planner.modality)}</h3>
            <p className="tiny">{t(strings.planner.typesHint)}</p>
            <div className="check-list">
              {PLANNER_TYPES.map((id) => (
                <label key={id} className="check-row">
                  <input
                    type="checkbox"
                    checked={types.includes(id)}
                    onChange={() => toggleType(id)}
                  />
                  <span>{t(typeLabels[id])}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="step-block">
            <h3>{t(strings.planner.formulation)}</h3>
            {!canPlan ? (
              <StatusBanner tone="empty">{t(strings.planner.noSelection)}</StatusBanner>
            ) : (
              <>
                <p className="tiny">{t(strings.clinicianDecides)}</p>
                <table className="dose-table">
                  <thead>
                    <tr>
                      <th>{t(strings.planner.colDose)}</th>
                      <th>{t(strings.planner.colMaterial)}</th>
                      <th>{t(strings.planner.colRegion)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.lines.map((line) => (
                      <tr key={line.treatmentId}>
                        <td className="range">
                          {formatDose(line.unit, line.calculated)}
                          <div className="tiny">
                            {t(strings.planner.range)} {line.rangeMin}–{line.rangeMax}
                          </div>
                        </td>
                        <td>
                          {line.materialName}
                          <div className="tiny">{line.brandExample}</div>
                        </td>
                        <td>{regionNamesFor(line.zoneIds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="tiny">
                  {t(strings.planner.totalMl)}: {plan.totalsByUnit.ml} · {t(strings.planner.totalUnits)}:{" "}
                  {plan.totalsByUnit.units}
                </p>
              </>
            )}
          </section>

          <section className="step-block">
            <label className="tiny" htmlFor="strength">
              {t(strings.planner.intensity)}: {strength}
            </label>
            <input
              id="strength"
              type="range"
              min={20}
              max={90}
              value={strength}
              onChange={(event) => setStrength(Number(event.target.value))}
            />
            <button
              type="button"
              className="btn"
              disabled={!canPlan || afterState === "loading"}
              onClick={() => void runAfter()}
            >
              {afterState === "error" ? t(strings.planner.retryAfter) : t(strings.planner.applyCanvas)}
            </button>
            {afterState === "empty" ? <StatusBanner tone="empty">{t(strings.planner.afterIdle)}</StatusBanner> : null}
            {afterState === "loading" ? <StatusBanner tone="loading">{t(strings.planner.afterLoading)}</StatusBanner> : null}
            {afterState === "error" ? <StatusBanner tone="error">{t(strings.planner.afterError)}</StatusBanner> : null}
            {afterState === "success" ? (
              <StatusBanner tone="success">{t(strings.planner.afterSuccess)}</StatusBanner>
            ) : null}
          </section>

          {resolvedProtocols.length ? (
            <section className="step-block">
              <h3>{t(strings.planner.resolved)}</h3>
              <div className="protocol-list">
                {resolvedProtocols.map((protocol) => (
                  <Link
                    key={protocol.id}
                    className="protocol-card"
                    to={`/journey/${protocol.regionIds[0] ?? "lips"}/protocol`}
                  >
                    <span className="kicker">{t(strings.planner.resolved)}</span>
                    <strong>{entityName(protocol, locale)}</strong>
                    <span className="tiny">{protocol.indication}</span>
                    <span className="tiny orchid-text">{t(strings.planner.openProtocol)}</span>
                  </Link>
                ))}
              </div>
              <CitationList citations={citations} />
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function unique<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}
