import { useState } from "react";
import { Link } from "react-router-dom";

import { FaceAtlas, RegionChips } from "../components/FaceAtlas";
import { FACE_ATLAS_IDS, THERAPY_ATLAS_IDS } from "../data/clinical/regionPacks";
import { atlasRegions } from "../data/clinical/journey";
import { entityName } from "../lib/entityName";
import { useLocale } from "../i18n/LocaleContext";

export function AtlasPage() {
  const { locale, strings, t } = useLocale();
  const [selected, setSelected] = useState("lips");
  const regions = atlasRegions();
  const region = regions.find((item) => item.id === selected) ?? regions[0];
  if (!region) return null;

  return (
    <div className="page atlas-page">
      <section className="opening">
        <div className="eyebrow">{t(strings.nav.atlas)}</div>
        <h1>{t(strings.home.atlasAnatomical)}</h1>
        <p className="lead">{t(strings.home.atlasLead)}</p>
      </section>
      <section className="atlas-stage atlas-hero">
        <RegionChips selectedId={selected} onSelect={setSelected} ids={FACE_ATLAS_IDS} />
        <FaceAtlas selectedId={selected} onSelect={setSelected} ids={FACE_ATLAS_IDS} />
        <aside className="panel">
          <div className="kicker">{t(strings.nav.atlas)}</div>
          <h2>{entityName(region, locale)}</h2>
          <p className="muted">{t(strings.home.atlasLead)}</p>
          <Link className="btn" to={`/journey/${region.id}`}>
            {t(strings.home.enterRegion)}
          </Link>
        </aside>
      </section>
      <section className="index-block">
        <div className="index-head">
          <div className="kicker">{t(strings.home.therapyIndex)}</div>
          <h2>{t(strings.family["toxin-therapeutic"])}</h2>
        </div>
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
      </section>
      <p className="tiny" style={{ marginTop: "1.5rem" }}>
        <Link to="/house">{t(strings.nav.houses)}</Link>
      </p>
    </div>
  );
}
