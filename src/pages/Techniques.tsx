import { Link, useParams } from "react-router-dom";
import { getTechnique, techniques } from "../data";
import { TechniqueSimulator } from "../components/visual/TechniqueSimulator";
import { EmptyState, PageHeader, ReviewFlag } from "../components/ui";
import { useLocale } from "../i18n";
import { entityName } from "../lib/entityName";
import "../components/visual/visual.css";

export function TechniquesPage() {
  const { pick, t, locale } = useLocale();
  return (
    <div>
      <PageHeader eyebrow={pick(t.nav.techniques)} title={pick(t.nav.techniques)} />
      <div className="list-grid">
        {techniques.map((tech) => (
          <Link key={tech.id} to={`/techniques/${tech.id}`} className="list-link">
            <div className="meta-row">
              <ReviewFlag reviewed={tech.reviewedByPhysician} />
            </div>
            <h2>{entityName(tech, locale)}</h2>
            <p>{tech.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TechniqueDetailPage() {
  const { id } = useParams();
  const { pick, t, locale } = useLocale();
  const technique = getTechnique(id ?? "");
  if (!technique) {
    return (
      <div>
        <Link to="/techniques" className="back-link">
          ← {pick(t.common.back)}
        </Link>
        <EmptyState text={pick(t.common.noResults)} />
      </div>
    );
  }

  return (
    <div>
      <Link to="/techniques" className="back-link">
        ← {pick(t.common.back)}
      </Link>
      <PageHeader
        eyebrow={technique.nameEn}
        title={entityName(technique, locale)}
        lead={technique.summary}
        actions={<ReviewFlag reviewed={technique.reviewedByPhysician} />}
      />
      <section className="detail-panel" style={{ marginBottom: "1rem" }}>
        <TechniqueSimulator techniqueId={technique.id} />
      </section>
      <div className="detail-grid two">
        <section className="detail-panel">
          <h2>When to use</h2>
          <ul>
            {technique.whenToUse.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <section className="detail-panel">
          <h2>Pitfalls</h2>
          <ul>
            {technique.pitfalls.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </div>
      <section className="detail-panel" style={{ marginTop: "1rem" }}>
        <h2>Steps</h2>
        <ul>
          {technique.howTo.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
