import { Link, useParams } from "react-router-dom";

import { CitationList } from "../components/CitationList";
import { DemoBadge, DraftBadge } from "../components/Chrome";
import { emergencies, getCitation, getEmergency } from "../data";
import { STITCH } from "../lib/assets";
import { entityName } from "../lib/entityName";
import { useLocale } from "../i18n/LocaleContext";

export function EmergencyPage() {
  const { id } = useParams();
  const { locale, strings, t } = useLocale();
  const selected = id ? getEmergency(id) : emergencies[0];
  const list = emergencies;

  if (!selected) {
    return (
      <div className="page">
        <p>{t(strings.empty)}</p>
      </div>
    );
  }

  const citations = (selected.citationIds ?? [])
    .map((citationId) => getCitation(citationId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const ischemia = selected.id === "vascular-occlusion";

  return (
    <div className="page ace-page">
      <div className="ace-banner">{t(strings.emergency.activeBanner)}</div>
      <section className="opening">
        <div className="eyebrow">{t(strings.emergency.openAce)}</div>
        <h1>{ischemia ? t(strings.emergency.ischemiaTitle) : entityName(selected, locale)}</h1>
        <p className="lead">{ischemia ? t(strings.emergency.ischemiaLead) : t(strings.emergency.lead)}</p>
      </section>
      {ischemia ? (
        <figure className="ace-dx">
          <img src={STITCH.treatment} alt={t(strings.emergency.immediateDx)} />
          <figcaption>
            <DemoBadge label={t(strings.demoMedia)} />
            <strong>{t(strings.emergency.immediateDx)}</strong>
          </figcaption>
        </figure>
      ) : null}
      <div className="chapter">
        <div className="stack">
          <div className="chip-row">
            {list.map((item) => (
              <Link
                key={item.id}
                className={`chip${item.id === selected.id ? " active" : ""}`}
                to={`/emergency/${item.id}`}
              >
                {entityName(item, locale)}
              </Link>
            ))}
          </div>
          <article className="step-block ace-block">
            <span className={`risk ${selected.urgency}`}>{t(strings.risk[selected.urgency])}</span>
            <h2>{entityName(selected, locale)}</h2>
            <DraftBadge label={t(strings.draft)} />
            <section>
              <h3>{t(strings.emergency.recognition)}</h3>
              <ul className="clinical">
                {selected.recognition.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>{t(strings.emergency.immediate)}</h3>
              <ol className="clinical">
                {selected.immediateActions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </section>
            <section>
              <h3>{t(strings.emergency.kit)}</h3>
              <ul className="clinical">
                {selected.medsAndTools.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>{t(strings.emergency.escalation)}</h3>
              <ul className="clinical">
                {selected.escalation.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>{t(strings.emergency.documentation)}</h3>
              <ul className="clinical">
                {selected.documentation.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          </article>
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
