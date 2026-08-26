import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { CitationList } from "../components/CitationList";
import { DraftBadge, DemoBadge } from "../components/Chrome";
import { MediaFrame } from "../components/MediaFrame";
import { InjectionMap } from "../components/InjectionMap";
import { TeachingPlate, StillGallery } from "../components/TeachingPlate";
import { Spine } from "../components/Shell";
import { assembleJourney, JOURNEY_STEPS, type JourneyStepId } from "../data/clinical/journey";
import { pickL, pickList } from "../data/clinical/types";
import { entityName } from "../lib/entityName";
import { USER_LIPS } from "../lib/assets";
import { useLocale } from "../i18n/LocaleContext";
import { HomePage } from "./Home";

function isStep(value: string | undefined): value is JourneyStepId {
  return JOURNEY_STEPS.includes(value as JourneyStepId);
}

export function JourneyPage() {
  const { regionId = "lips", step } = useParams();
  const navigate = useNavigate();
  const { locale, strings, t } = useLocale();
  const journey = assembleJourney(regionId);

  if (!regionId) return <Navigate to="/journey/lips" replace />;
  if (!journey) return <HomePage />;

  const current: JourneyStepId = isStep(step) ? step : "region";
  const stepIndex = JOURNEY_STEPS.indexOf(current);
  const go = (next: JourneyStepId) => navigate(`/journey/${regionId}/${next}`);
  const {
    region,
    protocol,
    relatedProtocols,
    mentor,
    pack,
    treatments,
    materials,
    companies,
    techniques,
    emergencies,
    citations,
    stills,
    videos,
  } = journey;
  const hero = stills[0] ?? USER_LIPS.anatomy[0] ?? USER_LIPS.before;

  return (
    <div className="page">
      <Spine regionId={regionId} current={current} />
      <div className="opening" style={{ paddingTop: 0 }}>
        <div className="eyebrow">{t(strings.journey.title)}</div>
        <h1>{entityName(region, locale)}</h1>
        <p className="lead">
          {pack
            ? pickL(locale, pack.subtitle)
            : mentor
              ? pickL(locale, mentor.subtitle)
              : t(strings.home.lead)}
        </p>
        <div className="pill-row">
          <span className={`risk ${region.risk}`}>{t(strings.risk[region.risk])}</span>
          <DraftBadge label={t(strings.draft)} />
          {protocol ? <span className="chip">{entityName(protocol, locale)}</span> : null}
        </div>
      </div>

      <div className="chapter">
        <div className="stack">
          {current === "region" ? (
            <>
              <StillGallery stills={stills} alt={entityName(region, locale)} />
              {pack ? <TeachingPlate photo={hero} pack={pack} /> : <MediaFrame src={hero} alt={entityName(region, locale)} />}
              <section className="step-block">
                <h3>{t(strings.journey.goals)}</h3>
                <ul className="clinical">
                  {(mentor ? pickList(locale, mentor.goals) : region.goals).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="step-block">
                <h3>{t(strings.journey.anatomy)}</h3>
                <ul className="clinical">
                  {(mentor ? pickList(locale, mentor.anatomy) : region.anatomyNotes).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="step-block">
                <h3>{t(strings.journey.danger)}</h3>
                <ul className="clinical">
                  {(pack
                    ? pickList(locale, pack.dangerNotes)
                    : mentor
                      ? pickList(locale, mentor.dangerZones)
                      : region.dangerZones
                  ).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}

          {current === "protocol" && protocol ? (
            <>
              <MediaFrame src={hero} alt={entityName(protocol, locale)} />
              <section className="step-block">
                <div className="kicker">{t(strings.journey.protocolTitle)}</div>
                <h2>{entityName(protocol, locale)}</h2>
                <p className="muted">{protocol.indication}</p>
                <DraftBadge label={t(strings.draft)} />
              </section>
              <section className="step-block">
                <h3>{t(strings.journey.protocolSteps)}</h3>
                <ol className="clinical">
                  {protocol.steps.map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}.</strong> {item.detail}
                    </li>
                  ))}
                </ol>
              </section>
              <section className="step-block">
                <h3>{t(strings.journey.dosingFramework)}</h3>
                <ul className="clinical">
                  {protocol.dosingFramework.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="tiny">{t(strings.ifuWins)}</p>
              </section>
              {relatedProtocols.length > 1 ? (
                <section className="step-block">
                  <h3>{t(strings.journey.relatedProtocols)}</h3>
                  <ul className="clinical">
                    {relatedProtocols.map((item) => (
                      <li key={item.id}>{entityName(item, locale)}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
              <section className="step-block">
                <h3>{t(strings.journey.followUp)}</h3>
                <ul className="clinical">
                  {protocol.followUp.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="step-block">
                <h3>{t(strings.journey.redFlags)}</h3>
                <ul className="clinical">
                  {protocol.redFlags.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}

          {current === "materials" ? (
            <>
              {pack?.doseLines.length ? (
                <section className="step-block">
                  <h3>{t(strings.journey.typicalDose)}</h3>
                  <table className="dose-table">
                    <thead>
                      <tr>
                        <th>{t(strings.journey.map)}</th>
                        <th>{t(strings.planner.range)}</th>
                        <th>{t(strings.journey.planes)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pack.doseLines.map((line, index) => (
                        <tr key={`${pickL(locale, line.site)}-${index}`}>
                          <td>{pickL(locale, line.site)}</td>
                          <td className="range">{pickL(locale, line.range)}</td>
                          <td>{pickL(locale, line.plane)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="tiny">{t(strings.ifuWins)}</p>
                </section>
              ) : null}
              {(mentor?.materials ?? []).map((material) => (
                <section key={material.id} className="step-block">
                  <h3>{pickL(locale, material.name)}</h3>
                  <p className="muted">{pickL(locale, material.role)}</p>
                  <p>
                    <strong>{t(strings.journey.typicalDose)}:</strong> {pickL(locale, material.dose)}
                  </p>
                  <p className="tiny">
                    {t(strings.journey.rheology)}: {pickL(locale, material.rheology)} · {t(strings.journey.planes)}:{" "}
                    {pickL(locale, material.planes)}
                  </p>
                  <h4 className="kicker">{t(strings.journey.pearls)}</h4>
                  <ul className="clinical">
                    {pickList(locale, material.pearls).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
              {materials.map((material) => (
                <section key={material.id} className="step-block">
                  <h3>{entityName(material, locale)}</h3>
                  {material.brands?.length ? <p className="tiny">{material.brands.join(" · ")}</p> : null}
                  <p className="muted">{material.rheology}</p>
                  <ul className="clinical">
                    {material.doseNotes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="tiny">{t(strings.clinicianDecides)}</p>
                </section>
              ))}
              {treatments.map((treatment) => (
                <section key={treatment.id} className="step-block">
                  <div className="kicker">{treatment.categoryLabel[locale]}</div>
                  <h3>{treatment.title[locale]}</h3>
                  <p>
                    {treatment.material.name[locale]} · {treatment.material.brandExample}
                  </p>
                  <p className="range">
                    {treatment.dosing.rangeMin}–{treatment.dosing.rangeMax} {treatment.dosing.unit}
                  </p>
                  <p className="tiny">{treatment.dosing.aliquotNote[locale]}</p>
                </section>
              ))}
              <section className="step-block">
                <h3>{t(strings.journey.brandsInPlay)}</h3>
                <div className="house-grid">
                  {companies.map((company) => (
                    <Link key={company.id} className="family-item" to={`/house/${company.id}`}>
                      <span className="kicker">{t(strings.house.hq)}</span>
                      <strong>{company.name}</strong>
                      <span className="tiny">{company.whyRecommended[locale]}</span>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {current === "injection" ? (
            <>
              {pack ? <TeachingPlate photo={hero} pack={pack} /> : null}
              <InjectionMap
                photo={hero}
                selected={[region.id]}
                onToggle={() => undefined}
                dangerRegionIds={[region.id]}
              />
              {videos[0] ? (
                <MediaFrame src={videos[0].src} kind="video" alt={videos[0].title[locale]} />
              ) : (
                <MediaFrame src={stills[1] ?? stills[0]} alt={t(strings.journey.injectionTitle)} />
              )}
              {pack ? (
                <section className="step-block">
                  <h3>{t(strings.journey.technique)}</h3>
                  <ol className="clinical">
                    {pickList(locale, pack.techniqueSteps).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </section>
              ) : null}
              {(mentor?.techniques ?? []).map((technique) => (
                <section key={technique.id} className="step-block">
                  <h3>{pickL(locale, technique.name)}</h3>
                  <p className="muted">{pickL(locale, technique.when)}</p>
                  <ol className="clinical">
                    {pickList(locale, technique.steps).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </section>
              ))}
              {techniques.map((technique) => (
                <section key={technique.id} className="step-block">
                  <h3>{entityName(technique, locale)}</h3>
                  <p className="muted">{technique.summary}</p>
                  <ol className="clinical">
                    {technique.howTo.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </section>
              ))}
            </>
          ) : null}

          {current === "emergency" ? (
            <>
              {(mentor?.complications ?? []).map((item) => (
                <section key={item.id} className="step-block">
                  <div className="pill-row">
                    <span className={`risk ${item.urgency}`}>{t(strings.risk[item.urgency])}</span>
                    <DemoBadge label={t(strings.emergency.openAce)} />
                  </div>
                  <h3>{pickL(locale, item.name)}</h3>
                  <h4 className="kicker">{t(strings.journey.signs)}</h4>
                  <ul className="clinical">
                    {pickList(locale, item.signs).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <h4 className="kicker">{t(strings.journey.actions)}</h4>
                  <ol className="clinical">
                    {pickList(locale, item.actions).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                </section>
              ))}
              {emergencies.map((item) => (
                <section key={item.id} className="step-block">
                  <span className={`risk ${item.urgency}`}>{t(strings.risk[item.urgency])}</span>
                  <h3>{entityName(item, locale)}</h3>
                  <h4 className="kicker">{t(strings.emergency.recognition)}</h4>
                  <ul className="clinical">
                    {item.recognition.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <h4 className="kicker">{t(strings.emergency.immediate)}</h4>
                  <ol className="clinical">
                    {item.immediateActions.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                  <Link className="btn ghost" to={`/emergency/${item.id}`}>
                    {t(strings.journey.relatedEmergency)}
                  </Link>
                </section>
              ))}
            </>
          ) : null}

          <div className="cta-row">
            {stepIndex > 0 ? (
              <button type="button" className="btn ghost" onClick={() => go(JOURNEY_STEPS[stepIndex - 1]!)}>
                {t(strings.previous)}
              </button>
            ) : (
              <Link className="btn ghost" to="/">
                {t(strings.back)}
              </Link>
            )}
            {stepIndex < JOURNEY_STEPS.length - 1 ? (
              <button type="button" className="btn" onClick={() => go(JOURNEY_STEPS[stepIndex + 1]!)}>
                {t(strings.next)}
              </button>
            ) : (
              <Link className="btn" to="/planner">
                {t(strings.home.openPlanner)}
              </Link>
            )}
          </div>
        </div>

        <aside className="panel">
          <div className="kicker">{t(strings.journey.sources)}</div>
          <CitationList citations={citations} />
          <p className="tiny">{t(strings.clinicianDecides)}</p>
        </aside>
      </div>
    </div>
  );
}
