import { Link, useParams } from "react-router-dom";
import {
  getMaterial,
  getProtocol,
  getRegion,
  getTechnique,
  protocols,
} from "../data";
import { EmptyState, PageHeader, ReviewFlag } from "../components/ui";

export function ProtocolsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="מסלולי טיפול"
        title="פרוטוקולים"
        lead="מסגרות עבודה שלמות לפי אינדיקציה — לאישור והתאמה למרפאה שלך."
      />
      <div className="list-grid">
        {protocols.map((p) => (
          <Link key={p.id} to={`/protocols/${p.id}`} className="list-link">
            <div className="meta-row">
              <ReviewFlag reviewed={p.reviewedByPhysician} />
            </div>
            <h2>{p.nameHe}</h2>
            <p>{p.indication}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ProtocolDetailPage() {
  const { id } = useParams();
  const protocol = getProtocol(id ?? "");
  if (!protocol) {
    return (
      <div>
        <Link to="/protocols" className="back-link">
          ← חזרה לפרוטוקולים
        </Link>
        <EmptyState text="הפרוטוקול לא נמצא." />
      </div>
    );
  }

  return (
    <div>
      <Link to="/protocols" className="back-link">
        ← חזרה לפרוטוקולים
      </Link>
      <PageHeader
        title={protocol.nameHe}
        lead={protocol.indication}
        actions={<ReviewFlag reviewed={protocol.reviewedByPhysician} />}
      />
      <div className="detail-grid two">
        <div>
          <section className="detail-panel">
            <h2>שלבים</h2>
            <ul>
              {protocol.steps.map((s) => (
                <li key={s.title}>
                  <strong>{s.title}: </strong>
                  {s.detail}
                </li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>מסגרת מינון</h2>
            <ul>
              {protocol.dosingFramework.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        </div>
        <div>
          <section className="detail-panel">
            <h2>אזורים</h2>
            <ul>
              {protocol.regionIds.map((rid) => (
                <li key={rid}>
                  <Link to={`/regions/${rid}`}>{getRegion(rid)?.nameHe ?? rid}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>חומרים</h2>
            <ul>
              {protocol.materialIds.map((mid) => (
                <li key={mid}>
                  <Link to={`/materials/${mid}`}>{getMaterial(mid)?.nameHe ?? mid}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>טכניקות</h2>
            <ul>
              {protocol.techniqueIds.map((tid) => (
                <li key={tid}>
                  <Link to={`/techniques/${tid}`}>{getTechnique(tid)?.nameHe ?? tid}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>מעקב</h2>
            <ul>
              {protocol.followUp.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>Red flags</h2>
            <ul>
              {protocol.redFlags.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
