import { NavLink } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "../i18n";
import "./Shell.css";

export function Shell({ children }: { children: React.ReactNode }) {
  const { pick, t, locale } = useLocale();

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand" end>
            {pick(t.appName)}
          </NavLink>
          <div className="topbar-mid">
            <LanguageSwitcher />
          </div>
          <NavLink to="/consultation" className="doctor-enter">
            {locale === "en"
              ? "Doctor login"
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
            <a href="#terms">תנאי שימוש</a>
            <a href="#privacy">מדיניות פרטיות</a>
            <a href="#contact">צרו קשר</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
