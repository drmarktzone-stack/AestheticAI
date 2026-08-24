import { Link, useParams } from "react-router-dom";
import { getTechnique, techniques } from "../data";
import { EmptyState, PageHeader, ReviewFlag } from "../components/ui";

export function TechniquesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="ביצוע"
        title="טכניקות הזרקה"
        lead="Linear threading, fanning, bolus, microdroplets ומיפוי טוקסין — מתי ואיך."
      />
      <div className="list-grid">
        {techniques.map((t) => (
          <Link key={t.id} to={`/techniques/${t.id}`} className="list-link">
            <div className="meta-row">
              <ReviewFlag reviewed={t.reviewedByPhysician} />
            </div>
            <h2>{t.nameHe}</h2>
            <p>{t.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TechniqueDetailPage() {
  const { id } = useParams();
  const technique = getTechnique(id ?? "");
  if (!technique) {
    return (
      <div>
        <Link to="/techniques" className="back-link">
          ← חזרה לטכניקות
        </Link>
        <EmptyState text="הטכניקה לא נמצאה." />
      </div>
    );
  }

  return (
    <div>
      <Link to="/techniques" className="back-link">
        ← חזרה לטכניקות
      </Link>
      <PageHeader
        eyebrow={technique.nameEn}
        title={technique.nameHe}
        lead={technique.summary}
        actions={<ReviewFlag reviewed={technique.reviewedByPhysician} />}
      />
      <div className="detail-grid two">
        <section className="detail-panel">
          <h2>מתי להשתמש</h2>
          <ul>
            {technique.whenToUse.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <section className="detail-panel">
          <h2>מלכודות</h2>
          <ul>
            {technique.pitfalls.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </div>
      <section className="detail-panel" style={{ marginTop: "1rem" }}>
        <h2>שלבי ביצוע</h2>
        <ul>
          {technique.howTo.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
