import { Link, useParams } from "react-router-dom";
import { emergencies, getEmergency } from "../data";
import { CitationList } from "../components/CitationBlock";
import {
  EmptyState,
  PageHeader,
  ReviewFlag,
  RiskBadge,
  Badge,
} from "../components/ui";
import { useLocale } from "../i18n";
import "./Emergency.css";

export function EmergencyPage() {
  const { locale } = useLocale();
  return (
    <div>
      <PageHeader
        eyebrow={locale === "he" ? "גישה מהירה" : "Quick access"}
        title={locale === "he" ? "פרוטוקולי חירום" : "Emergency protocols"}
        lead={
          locale === "he"
            ? "זיהוי → פעולה מיידית → אסקלציה → תיעוד. כל פרוטוקול מצוטט ל-ACE / ASAPS."
            : "Recognition → immediate action → escalation → documentation. Cited to ACE / ASAPS."
        }
        actions={
          <Link to="/evidence" className="btn ghost">
            ACE evidence
          </Link>
        }
      />
      <div className="emergency-banner">
        שינוי ראייה, חשד לחסימה וסקולרית או אנפילקסיס — הפעל מיד את הפרוטוקול המאושר שלך.
        היישום מסייע בארגון; ההחלטה הקלינית שלך בלבד.
      </div>
      <div className="list-grid">
        {emergencies.map((e) => (
          <Link key={e.id} to={`/emergency/${e.id}`} className="list-link emergency-link">
            <div className="meta-row">
              <RiskBadge risk={e.urgency} />
              {e.citationIds?.length ? (
                <Badge tone="accent">{e.citationIds.length} ACE</Badge>
              ) : null}
              <ReviewFlag reviewed={e.reviewedByPhysician} />
            </div>
            <h2>{e.nameHe}</h2>
            <p>{e.recognition[0]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function EmergencyDetailPage() {
  const { id } = useParams();
  const { locale } = useLocale();
  const item = getEmergency(id ?? "");
  if (!item) {
    return (
      <div>
        <Link to="/emergency" className="back-link">
          ← חזרה לחירום
        </Link>
        <EmptyState text="התרחיש לא נמצא." />
      </div>
    );
  }

  return (
    <div>
      <Link to="/emergency" className="back-link">
        ← חזרה לחירום
      </Link>
      <PageHeader
        title={item.nameHe}
        actions={
          <div className="meta-row">
            <RiskBadge risk={item.urgency} />
            <ReviewFlag reviewed={item.reviewedByPhysician} />
          </div>
        }
      />
      <div className="detail-grid two">
        <section className="detail-panel">
          <h2>זיהוי</h2>
          <ul>
            {item.recognition.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <section className="detail-panel urgent">
          <h2>פעולות מיידיות</h2>
          <ul>
            {item.immediateActions.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </div>
      <div className="detail-grid two" style={{ marginTop: "1rem" }}>
        <section className="detail-panel">
          <h2>כלים / תרופות</h2>
          <ul>
            {item.medsAndTools.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <section className="detail-panel">
          <h2>אסקלציה</h2>
          <ul>
            {item.escalation.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </div>
      <section className="detail-panel" style={{ marginTop: "1rem" }}>
        <h2>{locale === "he" ? "תיעוד" : "Documentation"}</h2>
        <ul>
          {item.documentation.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      {item.citationIds?.length ? <CitationList ids={item.citationIds} /> : null}
    </div>
  );
}
