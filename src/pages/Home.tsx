import { Link } from "react-router-dom";
import { emergencies, materials, protocols, regions } from "../data";
import { useLocale } from "../i18n";
import "./Home.css";

export function HomePage() {
  const { pick, t } = useLocale();

  const modules = [
    {
      to: "/consultation",
      title: pick(t.nav.consultation),
      text: pick(t.consultation.lead),
      count: "4 steps",
    },
    {
      to: "/simulation",
      title: pick(t.nav.simulation),
      text: pick(t.simulation.lead),
      count: pick(t.common.before) + " / " + pick(t.common.after),
    },
    {
      to: "/materials",
      title: pick(t.nav.materials),
      text: "HA, toxin, biostimulators, enzymes",
      count: `${materials.length}`,
    },
    {
      to: "/regions",
      title: pick(t.nav.regions),
      text: "Danger zones · planes · emergency flags",
      count: `${regions.length}`,
    },
    {
      to: "/protocols",
      title: pick(t.nav.protocols),
      text: pick(t.consultation.stepAssess) + " → " + pick(t.consultation.stepDocument),
      count: `${protocols.length}`,
    },
    {
      to: "/emergency",
      title: pick(t.nav.emergency),
      text: "Vascular · vision · anaphylaxis",
      count: `${emergencies.length}`,
    },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-brand">{pick(t.appName)}</p>
          <h1>{pick(t.home.heroTitle)}</h1>
          <p className="hero-lead">{pick(t.home.heroLead)}</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/consultation">
              {pick(t.common.startConsultation)}
            </Link>
            <Link className="btn ghost" to="/simulation">
              {pick(t.home.openSimulation)}
            </Link>
            <Link className="btn ghost" to="/emergency">
              {pick(t.home.openEmergency)}
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="face-map">
            <span className="node n1" />
            <span className="node n2" />
            <span className="node n3" />
            <span className="node n4" />
            <span className="node n5" />
          </div>
        </div>
      </section>

      <section className="modules">
        <h2>{pick(t.home.modulesTitle)}</h2>
        <div className="module-grid">
          {modules.map((m, i) => (
            <Link key={m.to} to={m.to} className="module" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="module-top">
                <h3>{m.title}</h3>
                <span>{m.count}</span>
              </div>
              <p>{m.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="ownership unique-section">
        <h2>{pick(t.home.uniqueTitle)}</h2>
        <ul className="unique-list">
          {t.home.uniqueItems.map((item) => (
            <li key={item.en}>{pick(item)}</li>
          ))}
        </ul>
      </section>

      <section className="ownership">
        <h2>{pick(t.home.ownershipTitle)}</h2>
        <p>{pick(t.home.ownershipBody)}</p>
      </section>
    </div>
  );
}
