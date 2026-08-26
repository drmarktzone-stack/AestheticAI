import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaceAtlas } from "../components/FaceAtlas";
import { CitationList } from "../components/CitationList";
import { DraftBadge, DemoBadge } from "../components/Chrome";
import { atlasRegions, stillsForRegion } from "../data/clinical/journey";
import { FACE_ATLAS_IDS, THERAPY_ATLAS_IDS } from "../data/clinical/regionPacks";
import { REGION_DEFAULT_PROTOCOL } from "../data/clinical/protocolMap";
import { COMPANIES, getCitation, getProtocol } from "../data";
import { entityName } from "../lib/entityName";
import { LIBRARY_SECTIONS } from "../lib/assets";
import { useLocale } from "../i18n/LocaleContext";

const FAMILIES = ["filler", "tightening", "wrinkles", "toxin-aesthetic", "toxin-therapeutic"] as const;

const HOUSE_IDS = ["allergan-abbvie", "galderma", "merz", "teoxane", "ibsa"];

export function HomePage() {
  const { locale, strings, t } = useLocale();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("lips");
  const regions = atlasRegions();
  const region = regions.find((item) => item.id === selected) ?? regions[0];
  const protocol = region ? getProtocol(REGION_DEFAULT_PROTOCOL[region.id] ?? "") : undefined;
  const citations = (protocol?.citationIds ?? [])
    .map((id) => getCitation(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 2);
  const previewStills = region ? stillsForRegion(region.id).slice(0, 3) : [];

  const familyLinks = useMemo(
    () =>
      FAMILIES.map((id) => ({
        id,
        label: strings.family[id],
        to:
          id === "toxin-therapeutic"
            ? "/journey/tmj"
            : id === "tightening"
              ? "/journey/neck"
              : id === "wrinkles"
                ? "/journey/glabella"
                : "/planner",
      })),
    [strings],
  );

  const houses = HOUSE_IDS.map((id) => COMPANIES.find((company) => company.id === id)).filter(
    (company): company is NonNullable<typeof company> => Boolean(company),
  );

  if (!region) return null;

  return (
    <div className="page">
      <section className="opening">
        <div className="eyebrow">{t(strings.home.eyebrow)}</div>
        <h1 className="display">{t(strings.home.atlasAnatomical)}</h1>
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
        <FaceAtlas selectedId={selected} onSelect={setSelected} ids={FACE_ATLAS_IDS} />
        <aside className="panel">
          <div className="kicker">{t(strings.home.citedProtocol)}</div>
          <h2>{entityName(region, locale)}</h2>
          <p className="muted">{t(strings.home.atlasLead)}</p>
          <div className="pill-row">
            <span className={`risk ${region.risk}`}>{t(strings.risk[region.risk])}</span>
            <DraftBadge label={t(strings.draft)} />
          </div>
          {protocol ? (
            <div className="protocol-card" style={{ border: 0, padding: 0 }}>
              <strong>{entityName(protocol, locale)}</strong>
              <span className="tiny">{protocol.indication}</span>
            </div>
          ) : null}
          <ul className="clinical">
            {region.goals.slice(0, 4).map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
          <CitationList citations={citations} />
          <div className="preview-strip">
            {previewStills.map((src) => (
              <figure key={src}>
                <img src={src} alt="" />
                <figcaption>
                  <DemoBadge label={t(strings.demo)} />
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="cta-row">
            <button type="button" className="btn" onClick={() => navigate(`/journey/${region.id}`)}>
              {t(strings.home.enterRegion)}
            </button>
            <button type="button" className="btn ghost" onClick={() => navigate("/planner")}>
              {t(strings.home.openPlanner)}
            </button>
          </div>
        </aside>
      </section>

      <section className="index-block">
        <div className="index-head">
          <div className="kicker">{t(strings.home.therapyIndex)}</div>
          <h2>{t(strings.family["toxin-therapeutic"])}</h2>
          <p className="muted">{t(strings.home.therapeuticNote)}</p>
        </div>
        <div className="therapy-row">
          {THERAPY_ATLAS_IDS.map((id, index) => {
            const item = regions.find((entry) => entry.id === id);
            if (!item) return null;
            return (
              <Link
                key={id}
                className={`therapy-card${selected === id ? " selected" : ""}`}
                to={`/journey/${id}`}
              >
                <span className="therapy-num">{String(index + 1).padStart(2, "0")}</span>
                <strong>{entityName(item, locale)}</strong>
                <span className={`risk ${item.risk}`}>{t(strings.risk[item.risk])}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="gallery-rail" aria-label={t(strings.home.galleryTitle)}>
        <div className="index-head">
          <div className="kicker">{t(strings.demoMedia)}</div>
          <h2>{t(strings.home.galleryTitle)}</h2>
        </div>
        <div className="rail">
          {LIBRARY_SECTIONS.flatMap((section) =>
            section.items.slice(0, 2).map((item) => ({
              src: item.src,
              title: item.title,
            })),
          ).map((item) => (
            <figure key={item.src} className="rail-card">
              <img src={item.src} alt={item.title} />
              <figcaption>
                <DemoBadge label={t(strings.demo)} />
                <span>{item.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="family-strip" aria-label={t(strings.home.familiesTitle)}>
        {familyLinks.map((family) => (
          <Link key={family.id} className="family-item" to={family.to}>
            <span className="kicker">{t(strings.home.familiesTitle)}</span>
            <strong>{t(family.label)}</strong>
          </Link>
        ))}
      </section>

      <section className="index-block">
        <div className="index-head">
          <div className="kicker">{t(strings.house.directory)}</div>
          <h2>{t(strings.house.title)}</h2>
        </div>
        <div className="partner-grid">
          {houses.map((company) => (
            <Link key={company.id} className="partner-card" to={`/house/${company.id}`}>
              <span className="kicker">{company.hq}</span>
              <h3>{company.name}</h3>
              <p className="tiny">{company.whyRecommended[locale]}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
