import { Link } from "react-router-dom";
import { useLocale } from "../i18n";
import "./Home.css";

const MODULES = [
  { to: "/consultation", he: "ייעוץ קליני", key: "consultation" as const },
  { to: "/simulation", he: "סימולציית מטופל", key: "simulation" as const },
  { to: "/materials", he: "חומרים ותכשירים", key: "materials" as const },
  { to: "/regions", he: "אזורי הזרקה", key: "regions" as const },
  { to: "/protocols", he: "פרוטוקולים טיפוליים", key: "protocols" as const },
  { to: "/emergency", he: "עזרה ראשונה", key: "emergency" as const },
];

export function HomePage() {
  const { pick, t, locale } = useLocale();

  return (
    <div className="home">
      <section className="hero" aria-label={pick(t.appName)}>
        <div className="hero-media" aria-hidden="true">
          <img
            src={`${import.meta.env.BASE_URL}stitch/hero-clinic.png`}
            alt=""
            className="hero-img"
          />
          <div className="hero-veil" />
        </div>

        <div className="hero-content">
          <h1 className="hero-brand">{pick(t.appName)}</h1>
          <p className="hero-title">
            {locale === "he"
              ? "מצוינות קלינית באסתטיקה רפואית."
              : pick(t.home.heroTitle)}
          </p>
          <p className="hero-lead">
            {locale === "he"
              ? "הפלטפורמה המתקדמת לניהול פרוטוקולים, סימולציות וייעוץ מקצועי לרופאים בלבד."
              : pick(t.home.heroLead)}
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/consultation">
              {pick(t.common.startConsultation)}
            </Link>
            <Link className="btn ghost" to="/simulation">
              {pick(t.home.openSimulation)}
            </Link>
          </div>
        </div>
      </section>

      <section className="modules">
        <div className="modules-inner">
          {MODULES.map((m) => (
            <Link key={m.to} to={m.to} className="module-row">
              <h2>{locale === "he" ? m.he : pick(t.nav[m.key])}</h2>
              <span className="module-arrow" aria-hidden="true">
                ←
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
