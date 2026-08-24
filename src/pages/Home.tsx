import { Link } from "react-router-dom";
import { AnimationReel } from "../components/visual/AnimationReel";
import { TimelineScrubber } from "../components/visual/TimelineScrubber";
import { STITCH } from "../lib/assets";
import { useLocale } from "../i18n";
import "./Home.css";

const MODULES = [
  { to: "/consultation", he: "ייעוץ קליני", key: "consultation" as const },
  { to: "/simulation", he: "סימולציית מטופל", key: "simulation" as const },
  { to: "/library", he: "ספריית נכסים קליניים", key: "library" as const },
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
          <img src={STITCH.cinematicClinic} alt="" className="hero-img" />
          <div className="hero-veil" />
        </div>

        <div className="hero-content">
          <h1 className="hero-brand">
            {locale === "en" ? "Protokol" : pick(t.appName)}
          </h1>
          <p className="hero-title">
            {locale === "he"
              ? "מצוינות קלינית באסתטיקה רפואית."
              : pick(t.home.heroTitle)}
          </p>
          <p className="hero-lead">
            {locale === "he"
              ? "סימולציות, טיימליין החלמה, ספריית נכסים וייעוץ מקצועי — לרופאים בלבד."
              : pick(t.home.heroLead)}
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/simulation">
              {locale === "he" ? "פתח סימולציה" : pick(t.home.openSimulation)}
            </Link>
            <Link className="btn ghost" to="/library">
              {locale === "he" ? "ספריית נכסים" : "Clinical library"}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-feature" aria-label="סימולציית Flow">
        <div className="home-feature-copy">
          <p className="home-kicker">Google Flow · Stitch</p>
          <h2>סימולציה רפואית בתנועה</h2>
          <p>
            אנימציות קליניות וסטוריבורדים שיצרת ב-Flow — משולבים כרצף סימולציה
            חי בתוך המערכת, לצד טיימליין החלמה יום 1 / יום 7 / חודש 3 / חודש 6.
          </p>
          <Link className="btn primary" to="/simulation">
            כניסה לסימולטור
          </Link>
        </div>
        <div className="home-feature-media">
          <AnimationReel />
        </div>
      </section>

      <section className="home-timeline-band" aria-label="טיימליין החלמה">
        <div className="home-timeline-copy">
          <p className="home-kicker">Recovery timeline</p>
          <h2>טיימליין שפתיים — HA filler</h2>
          <p>
            צילומים קליניים מדורגים מהארכיון שלך. גרור את הסרגל או הפעל ניגון
            אוטומטי להצגת תוצאה מול מטופל.
          </p>
        </div>
        <div className="home-timeline-media">
          <TimelineScrubber />
        </div>
      </section>

      <section className="home-gallery" aria-label="תצוגה קלינית">
        <div className="home-gallery-head">
          <h2>ארכיון קליני</h2>
          <Link to="/library">לספרייה המלאה ←</Link>
        </div>
        <div className="home-gallery-row">
          <figure>
            <img src={STITCH.injection} alt="" />
            <figcaption>הזרקה — מבט קליני</figcaption>
          </figure>
          <figure>
            <img src={STITCH.midface[0]} alt="" />
            <figcaption>Midface</figcaption>
          </figure>
          <figure>
            <img src={STITCH.beforeAfter} alt="" />
            <figcaption>לפני / אחרי</figcaption>
          </figure>
          <figure>
            <img src={STITCH.treatment} alt="" />
            <figcaption>סביבת טיפול</figcaption>
          </figure>
        </div>
      </section>

      <section className="modules">
        <div className="modules-inner">
          {MODULES.map((m) => (
            <Link key={m.to} to={m.to} className="module-row">
              <h2>
                {locale === "he"
                  ? m.he
                  : m.key in t.nav
                    ? pick(t.nav[m.key as keyof typeof t.nav])
                    : m.he}
              </h2>
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
