import { Link, useParams } from "react-router-dom";
import { emergencies, getEmergency } from "../data";
import {
  EmptyState,
  PageHeader,
  ReviewFlag,
  RiskBadge,
} from "../components/ui";
import "./Emergency.css";

export function EmergencyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="גישה מהירה"
        title="פרוטוקולי חירום"
        lead="זיהוי → פעולה מיידית → אסקלציה → תיעוד. עדכן לפי פרוטוקול המרפאה שאישרת."
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
        <h2>תיעוד</h2>
        <ul>
          {item.documentation.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
