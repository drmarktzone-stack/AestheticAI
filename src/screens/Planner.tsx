import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { CitationList } from "../components/CitationList";
import { DemoBadge, DraftBadge, StatusBanner } from "../components/Chrome";
import { InjectionMap } from "../components/InjectionMap";
import { CLINICAL_TREATMENTS, type TreatmentFamily } from "../data/clinical/treatmentCatalog";
import { atlasRegions, protocolForTreatment } from "../data/clinical/journey";
import { TREATMENT_PROTOCOL } from "../data/clinical/protocolMap";
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

export function PlannerPage() {
  const { locale, strings, t } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoState, setPhotoState] = useState<PhotoState>("empty");
  const [zones, setZones] = useState<string[]>(["lips"]);
  const [types, setTypes] = useState<PlannerType[]>(["filler"]);
  const [afterState, setAfterState] = useState<AfterState>("empty");
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [strength, setStrength] = useState(58);

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

  return (
    <div className="page">
      <section className="opening">
        <div className="eyebrow">{t(strings.nav.planner)}</div>
        <h1>{t(strings.planner.title)}</h1>
        <p className="lead">{t(strings.planner.lead)}</p>
        <p className="tiny">{t(strings.planner.liveAiOff)}</p>
      </section>

      <div className="planner-grid">
        <div className="stack">
          <section className="step-block">
            <h3>{t(strings.planner.stepPhoto)}</h3>
            <div className="cta-row">
              <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
                {t(strings.planner.upload)}
              </button>
              <button type="button" className="btn ghost" onClick={() => loadUrl(USER_LIPS.before)}>
                {t(strings.planner.useDemo)}
              </button>
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
            {photoState === "success" ? (
              <StatusBanner tone="success">{t(strings.planner.photoReady)}</StatusBanner>
            ) : null}
          </section>

          <section className="step-block">
            <h3>{t(strings.planner.stepRegions)}</h3>
            <p className="tiny">{t(strings.planner.markHint)}</p>
            <div className="chip-row">
              {atlasRegions().map((region) => {
                const ids = zonesForRegion(region.id);
                const active = ids.some((zoneId) => zones.includes(zoneId));
                return (
                  <button
                    key={region.id}
                    type="button"
                    className="chip"
                    aria-pressed={active}
                    onClick={() => {
                      setZones((current) => {
                        const has = ids.some((zoneId) => current.includes(zoneId));
                        return has
                          ? current.filter((zoneId) => !ids.includes(zoneId))
                          : [...current, ...ids];
                      });
                    }}
                  >
                    {entityName(region, locale)}
                  </button>
                );
              })}
            </div>
            {photo ? (
              <InjectionMap photo={photo} selected={zones} onToggle={toggleZone} />
            ) : (
              <StatusBanner tone="empty">{t(strings.planner.photoEmpty)}</StatusBanner>
            )}
          </section>
        </div>

        <div className="stack">
          <section className="step-block">
            <h3>{t(strings.planner.stepTypes)}</h3>
            <p className="tiny">{t(strings.planner.typesHint)}</p>
            <div className="chip-row">
              {(Object.keys(TYPE_FILTER) as PlannerType[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  className="chip"
                  aria-pressed={types.includes(id)}
                  onClick={() => toggleType(id)}
                >
                  {t(typeLabels[id])}
                </button>
              ))}
            </div>
          </section>

          <section className="step-block">
            <h3>{t(strings.planner.stepPlan)}</h3>
            {!canPlan ? (
              <StatusBanner tone="empty">{t(strings.planner.noSelection)}</StatusBanner>
            ) : (
              <>
                <StatusBanner tone="success">{t(strings.planner.planReady)}</StatusBanner>
                <p className="tiny">{t(strings.clinicianDecides)}</p>
                <table className="dose-table">
                  <thead>
                    <tr>
                      <th>{t(strings.planner.stepTypes)}</th>
                      <th>{t(strings.journey.materialsTitle)}</th>
                      <th>{t(strings.planner.calculated)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.lines.map((line) => (
                      <tr key={line.treatmentId}>
                        <td>
                          {line.title}
                          <div className="tiny">{TREATMENT_PROTOCOL[line.treatmentId]}</div>
                        </td>
                        <td>
                          {line.materialName}
                          <div className="tiny">{line.brandExample}</div>
                        </td>
                        <td className="range">
                          {line.calculated} {line.unit}
                          <div className="tiny">
                            {t(strings.planner.range)} {line.rangeMin}–{line.rangeMax}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="range">
                  {t(strings.planner.totalMl)}: {plan.totalsByUnit.ml} · {t(strings.planner.totalUnits)}:{" "}
                  {plan.totalsByUnit.units}
                </p>
                <h4 className="kicker">{t(strings.planner.protocolCite)}</h4>
                {resolvedProtocols.map((protocol) => (
                  <p key={protocol.id}>
                    <Link to={`/journey/${protocol.regionIds[0] ?? "lips"}/protocol`}>
            {protocol.nameHe}
            {locale !== "he" ? ` · ${entityName(protocol, locale)}` : ""}
                    </Link>
                  </p>
                ))}
                <CitationList citations={citations} />
              </>
            )}
          </section>

          <section className="step-block">
            <h3>{t(strings.planner.afterTitle)}</h3>
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
            <button type="button" className="btn orchid" disabled={!canPlan} onClick={() => void runAfter()}>
              {t(strings.planner.generateAfter)}
            </button>
            {afterState === "empty" ? <StatusBanner tone="empty">{t(strings.demoNotResult)}</StatusBanner> : null}
            {afterState === "loading" ? <StatusBanner tone="loading">{t(strings.planner.afterLoading)}</StatusBanner> : null}
            {afterState === "error" ? (
              <StatusBanner tone="error">{t(strings.planner.afterError)}</StatusBanner>
            ) : null}
            {afterState === "success" ? (
              <StatusBanner tone="success">{t(strings.planner.afterSuccess)}</StatusBanner>
            ) : null}
            {photo && afterUrl ? (
              <div className="compare">
                <figure className="media-frame">
                  <img src={photo} alt={t(strings.planner.before)} />
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
          </section>
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
