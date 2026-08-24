import { NavLink } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "../i18n";
import "./Shell.css";

const NAV = [
  { to: "/world", he: "עולם אסתטיקה", ar: "عالم التجميل", en: "Aesthetic world" },
  { to: "/companies", he: "חברות", ar: "شركات", en: "Companies" },
  { to: "/materials", he: "חומרים", ar: "مواد", en: "Materials" },
  { to: "/protocols", he: "פרוטוקולים", ar: "بروتوكولات", en: "Protocols" },
  { to: "/evidence", he: "מקורות עולמיים", ar: "مصادر عالمية", en: "Global evidence" },
  { to: "/consultation", he: "מתכנן חכם", ar: "مخطط ذكي", en: "Smart planner" },
  { to: "/guide/lips", he: "מנטור", ar: "موجِّه", en: "Mentor" },
  { to: "/emergency", he: "חירום", ar: "طوارئ", en: "Emergency" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { pick, t, locale } = useLocale();

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand" end>
            {pick(t.appName)}
          </NavLink>
          <nav className="topbar-nav" aria-label="Main">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {item[locale]}
              </NavLink>
            ))}
          </nav>
          <div className="topbar-mid">
            <LanguageSwitcher />
          </div>
          <NavLink to="/guide/lips" className="doctor-enter">
            {locale === "en"
              ? "Physician enter"
              : locale === "ar"
                ? "دخول الأطباء"
                : "כניסת רופאים"}
          </NavLink>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span>{pick(t.appName)}</span>
            <p>{pick(t.ownership)}</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <NavLink to="/world">עולם אסתטיקה</NavLink>
            <NavLink to="/evidence">Global evidence</NavLink>
            <NavLink to="/companies">Companies</NavLink>
            <a href="#terms">תנאי שימוש</a>
            <a href="#privacy">מדיניות פרטיות</a>
            <a href="#contact">צרו קשר</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
