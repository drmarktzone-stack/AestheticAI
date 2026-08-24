import { Link } from "react-router-dom";
import { appMeta, emergencies, materials, protocols, regions } from "../data";
import "./Home.css";

const modules = [
  {
    to: "/materials",
    title: "חומרים",
    text: "HA, טוקסין, ביוסטימולטורים, אנזימים — שימושים, מישורים והערות מינון.",
    count: `${materials.length} ערכים`,
  },
  {
    to: "/regions",
    title: "אזורים ואנטומיה",
    text: "מטרות, danger zones, משטחי הזרקה ודגלי חירום לפי אזור.",
    count: `${regions.length} אזורים`,
  },
  {
    to: "/protocols",
    title: "פרוטוקולים",
    text: "מסלולי טיפול שלמים: הערכה → תכנון → הזרקה → מעקב.",
    count: `${protocols.length} פרוטוקולים`,
  },
  {
    to: "/emergency",
    title: "חירום",
    text: "זיהוי מהיר ופעולות מיידיות לחסימה וסקולרית, ראייה ואנפילקסיס.",
    count: `${emergencies.length} תרחישים`,
  },
];

export function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-brand">{appMeta.nameHe}</p>
          <h1>מדריך עבודה לרופא האסתטיקה — ליד המיטה.</h1>
          <p className="hero-lead">
            חומרים, אזורים, טכניקות, מינונים ופרוטוקולי חירום במקום אחד. התוכן הקליני
            באחריותך המלאה — הטיוטות כאן מחכות לאישור ולעריכה שלך.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/emergency">
              פתיחת חירום
            </Link>
            <Link className="btn ghost" to="/planner">
              מתכנן טיפול
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
        <h2>מודולים קליניים</h2>
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

      <section className="ownership">
        <h2>אחריות רפואית</h2>
        <p>
          היישום מיועד לרופאים מוסמכים בלבד. כל מינון, התוויה ופרוטוקול חייב להיות מאושר
          על ידך ומבוסס IFU / הנחיות מקצועיות לפני שימוש קליני. ערכי ברירת המחדל מסומנים
          כטיוטה עד שתאשר אותם.
        </p>
      </section>
    </div>
  );
}
