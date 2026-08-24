import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getMaterial,
  materialClassLabel,
  materials,
  planeLabel,
} from "../data";
import { EmptyState, PageHeader, ReviewFlag, SearchField, Badge } from "../components/ui";

export function MaterialsPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return materials;
    return materials.filter(
      (m) =>
        m.nameHe.includes(q) ||
        m.nameEn.toLowerCase().includes(s) ||
        materialClassLabel[m.class].includes(q),
    );
  }, [q]);

  return (
    <div>
      <PageHeader
        eyebrow="ספרייה"
        title="חומרים"
        lead="סוגי חומרים, שימושים אופייניים, מישורי הזרקה ומסגרת מינון — לאישורך לפני שימוש."
        actions={<SearchField value={q} onChange={setQ} placeholder="חיפוש חומר / מחלקה" />}
      />
      {filtered.length === 0 ? (
        <EmptyState text="לא נמצאו חומרים." />
      ) : (
        <div className="list-grid">
          {filtered.map((m) => (
            <Link key={m.id} to={`/materials/${m.id}`} className="list-link">
              <div className="meta-row">
                <Badge tone="accent">{materialClassLabel[m.class]}</Badge>
                <ReviewFlag reviewed={m.reviewedByPhysician} />
              </div>
              <h2>{m.nameHe}</h2>
              <p>{m.typicalUses.join(" · ")}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function MaterialDetailPage() {
  const { id } = useParams();
  const material = getMaterial(id ?? "");
  if (!material) {
    return (
      <div>
        <Link to="/materials" className="back-link">
          ← חזרה לחומרים
        </Link>
        <EmptyState text="החומר לא נמצא." />
      </div>
    );
  }

  return (
    <div>
      <Link to="/materials" className="back-link">
        ← חזרה לחומרים
      </Link>
      <PageHeader
        eyebrow={material.nameEn}
        title={material.nameHe}
        lead={material.rheology}
        actions={<ReviewFlag reviewed={material.reviewedByPhysician} />}
      />
      <div className="detail-grid two">
        <div>
          <section className="detail-panel">
            <h2>שימושים אופייניים</h2>
            <ul>
              {material.typicalUses.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>מסגרת מינון / תיעוד</h2>
            <ul>
              {material.doseNotes.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>פנינים קליניות</h2>
            <ul>
              {material.pearls.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        </div>
        <div>
          <section className="detail-panel">
            <h2>מישורי הזרקה</h2>
            <ul>
              {material.planes.map((p) => (
                <li key={p}>{planeLabel[p]}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>קונטרה־אינדיקציות</h2>
            <ul>
              {material.contraindications.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>מקורות</h2>
            <ul>
              {material.sources.map((s) => (
                <li key={s.label}>
                  {s.label}
                  {s.note ? ` — ${s.note}` : ""}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
