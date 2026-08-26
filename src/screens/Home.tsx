import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaceAtlas } from "../components/FaceAtlas";
import { DraftBadge } from "../components/Chrome";
import { atlasRegions } from "../data/clinical/journey";
import { REGION_DEFAULT_PROTOCOL } from "../data/clinical/protocolMap";
import { getProtocol } from "../data";
import { entityName } from "../lib/entityName";
import { useLocale } from "../i18n/LocaleContext";

const FAMILIES = ["filler", "tightening", "wrinkles", "toxin-aesthetic", "toxin-therapeutic"] as const;

export function HomePage() {
  const { locale, strings, t } = useLocale();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("lips");
  const regions = atlasRegions();
  const region = regions.find((item) => item.id === selected) ?? regions[0];
  const protocol = region ? getProtocol(REGION_DEFAULT_PROTOCOL[region.id] ?? "") : undefined;

  const familyLinks = useMemo(
    () =>
      FAMILIES.map((id) => ({
        id,
        label: strings.family[id],
        to: id === "toxin-therapeutic" ? "/journey/tmj" : id === "tightening" ? "/journey/cheeks" : "/planner",
      })),
    [strings],
  );

  if (!region) return null;

  return (
    <div className="page">
      <section className="opening">
        <div className="eyebrow">{t(strings.home.eyebrow)}</div>
        <h1 className="display">{t(strings.home.title)}</h1>
        <p className="lead">{t(strings.home.lead)}</p>
        <div className="cta-row">
          <Link className="btn" to={`/journey/${region.id}`}>
            {t(strings.home.enterRegion)}
          </Link>
          <Link className="btn ghost" to="/planner">
            {t(strings.home.openPlanner)}
          </Link>
        </div>
      </section>

      <section className="atlas-stage">
        <FaceAtlas selectedId={selected} onSelect={setSelected} />
        <aside className="panel">
          <div className="kicker">{t(strings.home.atlasTitle)}</div>
          <h2>{entityName(region, locale)}</h2>
          <p className="muted">{t(strings.home.atlasLead)}</p>
          <div className="pill-row">
            <span className={`risk ${region.risk}`}>{t(strings.risk[region.risk])}</span>
            <DraftBadge label={t(strings.draft)} />
          </div>
          <ul className="clinical">
            {region.goals.slice(0, 4).map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
          {protocol ? (
            <p className="tiny">
              {t(strings.spine.protocol)}: {entityName(protocol, locale)}
            </p>
          ) : null}
          <div className="cta-row">
            <button type="button" className="btn" onClick={() => navigate(`/journey/${region.id}`)}>
              {t(strings.home.enterRegion)}
            </button>
          </div>
        </aside>
      </section>

      <section className="family-strip" aria-label={t(strings.home.familiesTitle)}>
        {familyLinks.map((family) => (
          <Link key={family.id} className="family-item" to={family.to}>
            <span className="kicker">{t(strings.home.familiesTitle)}</span>
            <strong>{t(family.label)}</strong>
          </Link>
        ))}
      </section>
      <p className="tiny" style={{ marginTop: "1rem" }}>
        {t(strings.home.therapeuticNote)}
      </p>
    </div>
  );
}
