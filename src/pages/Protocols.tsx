import { Link, useParams } from "react-router-dom";
import {
  getMaterial,
  getProtocol,
  getRegion,
  getTechnique,
  protocols,
} from "../data";
import { CitationList } from "../components/CitationBlock";
import { EmptyState, PageHeader, ReviewFlag, Badge } from "../components/ui";
import { useLocale } from "../i18n";

export function ProtocolsPage() {
  const { locale } = useLocale();
  return (
    <div>
      <PageHeader
        eyebrow={locale === "he" ? "מסלולי טיפול" : "Treatment pathways"}
        title={locale === "he" ? "פרוטוקולים" : "Protocols"}
        lead={
          locale === "he"
            ? `${protocols.length} פרוטוקולים — כל אחד עם ציטוט לפרוטוקולים עולמיים (ACE, MD Codes, IFU).`
            : `${protocols.length} protocols — each cites global evidence (ACE, MD Codes, IFU).`
        }
        actions={
          <Link to="/evidence" className="btn ghost">
            {locale === "he" ? "מקורות עולמיים" : "Global evidence"}
          </Link>
        }
      />
      <div className="list-grid">
        {protocols.map((p) => (
          <Link key={p.id} to={`/protocols/${p.id}`} className="list-link">
            <div className="meta-row">
              {p.citationIds?.length ? (
                <Badge tone="accent">{p.citationIds.length} citations</Badge>
              ) : null}
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
  const { locale } = useLocale();
  const protocol = getProtocol(id ?? "");
  if (!protocol) {
    return (
      <div>
        <Link to="/protocols" className="back-link">
          ← {locale === "he" ? "חזרה לפרוטוקולים" : "Back to protocols"}
        </Link>
        <EmptyState text={locale === "he" ? "הפרוטוקול לא נמצא." : "Protocol not found."} />
      </div>
    );
  }

  return (
    <div>
      <Link to="/protocols" className="back-link">
        ← {locale === "he" ? "חזרה לפרוטוקולים" : "Back to protocols"}
      </Link>
      <PageHeader
        title={protocol.nameHe}
        lead={protocol.indication}
        actions={<ReviewFlag reviewed={protocol.reviewedByPhysician} />}
      />
      <div className="detail-grid two">
        <div>
          <section className="detail-panel">
            <h2>{locale === "he" ? "שלבים" : "Steps"}</h2>
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
            <h2>{locale === "he" ? "מסגרת מינון" : "Dosing framework"}</h2>
            <ul>
              {protocol.dosingFramework.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        </div>
        <div>
          <section className="detail-panel">
            <h2>{locale === "he" ? "אזורים" : "Regions"}</h2>
            <ul>
              {protocol.regionIds.map((rid) => (
                <li key={rid}>
                  <Link to={`/regions/${rid}`}>{getRegion(rid)?.nameHe ?? rid}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>{locale === "he" ? "חומרים" : "Materials"}</h2>
            <ul>
              {protocol.materialIds.length === 0 ? (
                <li>{locale === "he" ? "ללא הזרקה — device/threads" : "Non-injectable domain"}</li>
              ) : (
                protocol.materialIds.map((mid) => (
                  <li key={mid}>
                    <Link to={`/materials/${mid}`}>{getMaterial(mid)?.nameHe ?? mid}</Link>
                  </li>
                ))
              )}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>{locale === "he" ? "טכניקות" : "Techniques"}</h2>
            <ul>
              {protocol.techniqueIds.map((tid) => (
                <li key={tid}>
                  <Link to={`/techniques/${tid}`}>{getTechnique(tid)?.nameHe ?? tid}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>{locale === "he" ? "מעקב" : "Follow-up"}</h2>
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

      {protocol.sources.length > 0 && (
        <section className="detail-panel">
          <h2>{locale === "he" ? "מקורות מקומיים" : "Local sources"}</h2>
          <ul>
            {protocol.sources.map((s) => (
              <li key={s.label}>
                {s.citationId ? (
                  <Link to={`/evidence/${s.citationId}`}>{s.label}</Link>
                ) : (
                  s.label
                )}
                {s.note ? ` — ${s.note}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {protocol.citationIds?.length ? <CitationList ids={protocol.citationIds} /> : null}
    </div>
  );
}
