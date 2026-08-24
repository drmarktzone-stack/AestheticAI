import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRegion, planeLabel, regions } from "../data";
import {
  EmptyState,
  PageHeader,
  ReviewFlag,
  RiskBadge,
  SearchField,
} from "../components/ui";

export function RegionsPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return regions;
    return regions.filter(
      (r) => r.nameHe.includes(q) || r.nameEn.toLowerCase().includes(q.toLowerCase()),
    );
  }, [q]);

  return (
    <div>
      <PageHeader
        eyebrow="אנטומיה קלינית"
        title="אזורי הזרקה"
        lead="מטרות, danger zones, משטחים מועדפים ודגלי חירום לפי אזור."
        actions={<SearchField value={q} onChange={setQ} placeholder="חיפוש אזור" />}
      />
      <div className="list-grid">
        {filtered.map((r) => (
          <Link key={r.id} to={`/regions/${r.id}`} className="list-link">
            <div className="meta-row">
              <RiskBadge risk={r.risk} />
              <ReviewFlag reviewed={r.reviewedByPhysician} />
            </div>
            <h2>{r.nameHe}</h2>
            <p>{r.goals.join(" · ")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function RegionDetailPage() {
  const { id } = useParams();
  const region = getRegion(id ?? "");
  if (!region) {
    return (
      <div>
        <Link to="/regions" className="back-link">
          ← חזרה לאזורים
        </Link>
        <EmptyState text="האזור לא נמצא." />
      </div>
    );
  }

  return (
    <div>
      <Link to="/regions" className="back-link">
        ← חזרה לאזורים
      </Link>
      <PageHeader
        eyebrow={region.nameEn}
        title={region.nameHe}
        actions={
          <div className="meta-row">
            <RiskBadge risk={region.risk} />
            <ReviewFlag reviewed={region.reviewedByPhysician} />
          </div>
        }
      />
      <div className="detail-grid two">
        <div>
          <section className="detail-panel">
            <h2>מטרות</h2>
            <ul>
              {region.goals.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>אנטומיה</h2>
            <ul>
              {region.anatomyNotes.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>טכניקה — כיוונים</h2>
            <ul>
              {region.techniqueHints.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        </div>
        <div>
          <section className="detail-panel">
            <h2>Danger zones</h2>
            <ul>
              {region.dangerZones.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>מישורים מועדפים</h2>
            <ul>
              {region.preferredPlanes.map((p) => (
                <li key={p}>{planeLabel[p]}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>דגלי חירום</h2>
            <ul>
              {region.emergencyFlags.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>חומרים רלוונטיים</h2>
            <ul>
              {region.materialHints.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
