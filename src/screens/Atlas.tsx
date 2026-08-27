import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { FaceAtlas, RegionChips } from "../components/FaceAtlas";
import { FACE_ATLAS_IDS, THERAPY_ATLAS_IDS } from "../data/clinical/regionPacks";
import { assembleJourney, atlasRegions } from "../data/clinical/journey";
import { pickL, pickList } from "../data/clinical/types";
import { entityName } from "../lib/entityName";
import { useLocale } from "../i18n/LocaleContext";

export function AtlasPage() {
  const { locale, strings, t } = useLocale();
  const [selected, setSelected] = useState("temple");
  const regions = atlasRegions();
  const journey = useMemo(() => assembleJourney(selected), [selected]);
  const region = journey?.region ?? regions.find((item) => item.id === selected) ?? regions[0];
  if (!region) return null;

  const anatomy = journey?.depth
    ? pickList(locale, journey.depth.anatomy)
    : region.anatomyNotes;
  const doseLines = journey?.pack?.doseLines ?? [];
  const ace = journey?.emergencies[0];
  const aceSigns = journey?.depth?.complications[0];

  return (
    <div className="page atlas-page">
      <p className="atlas-mark">
        <span>AestheticAI</span>
        <span>{t(strings.nav.workspace)}</span>
      </p>
      <section className="opening">
        <div className="eyebrow">{t(strings.atlas.kicker)}</div>
        <h1>{entityName(region, locale)}</h1>
        <p className="lead">
          {journey?.pack ? pickL(locale, journey.pack.subtitle) : t(strings.home.atlasLead)}
        </p>
      </section>

      <RegionChips selectedId={selected} onSelect={setSelected} ids={FACE_ATLAS_IDS} />

      <section className="atlas-depth">
        <FaceAtlas selectedId={selected} onSelect={setSelected} ids={FACE_ATLAS_IDS} />
        <div className="stack">
          <article className="step-block">
            <h3>{t(strings.atlas.layers)}</h3>
            <ul className="clinical">
              {anatomy.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          {doseLines.length ? (
            <article className="step-block">
              <h3>{t(strings.journey.typicalDose)}</h3>
              <table className="dose-table">
                <tbody>
                  {doseLines.map((line, index) => (
                    <tr key={`${pickL(locale, line.site)}-${index}`}>
                      <td>{pickL(locale, line.site)}</td>
                      <td>{pickL(locale, line.range)}</td>
                      <td>{pickL(locale, line.plane)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="tiny">{t(strings.clinicianDecides)}</p>
            </article>
          ) : null}
          <article className="step-block ace-block">
            <h3>{t(strings.atlas.ace)}</h3>
            {aceSigns ? (
              <>
                <p>
                  <strong>{pickL(locale, aceSigns.name)}</strong>
                </p>
                <ul className="clinical">
                  {pickList(locale, aceSigns.signs).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : ace ? (
              <p>{entityName(ace, locale)}</p>
            ) : null}
            <Link className="btn" to={ace ? `/emergency/${ace.id}` : "/emergency"}>
              {t(strings.emergency.openAce)}
            </Link>
          </article>
          <Link className="btn" to={`/journey/${region.id}`}>
            {t(strings.home.enterRegion)}
          </Link>
        </div>
      </section>

      <details className="atlas-door">
        <summary>{t(strings.home.therapyIndex)}</summary>
        <div className="therapy-row">
          {THERAPY_ATLAS_IDS.map((id, index) => {
            const item = regions.find((entry) => entry.id === id);
            if (!item) return null;
            return (
              <Link key={id} className="therapy-card" to={`/journey/${id}`}>
                <span className="therapy-num">{String(index + 1).padStart(2, "0")}</span>
                <strong>{entityName(item, locale)}</strong>
              </Link>
            );
          })}
        </div>
      </details>
    </div>
  );
}
