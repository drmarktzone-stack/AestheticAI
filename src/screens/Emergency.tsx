import { Link, useParams } from "react-router-dom";

import { CitationList } from "../components/CitationList";
import { DraftBadge } from "../components/Chrome";
import { Spine } from "../components/Shell";
import { emergencies, getCitation, getEmergency } from "../data";
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

  return (
    <div className="page">
      <Spine current="emergency" />
      <section className="opening">
        <div className="eyebrow">{t(strings.emergency.openAce)}</div>
        <h1>{t(strings.emergency.title)}</h1>
        <p className="lead">{t(strings.emergency.lead)}</p>
      </section>
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
