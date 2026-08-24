import { NavLink } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "../i18n";
import "./Shell.css";

export function Shell({ children }: { children: React.ReactNode }) {
  const { pick, t } = useLocale();

  const links = [
    { to: "/", label: pick(t.nav.home), end: true },
    { to: "/consultation", label: pick(t.nav.consultation) },
    { to: "/simulation", label: pick(t.nav.simulation) },
    { to: "/materials", label: pick(t.nav.materials) },
    { to: "/regions", label: pick(t.nav.regions) },
    { to: "/techniques", label: pick(t.nav.techniques) },
    { to: "/protocols", label: pick(t.nav.protocols) },
    { to: "/emergency", label: pick(t.nav.emergency) },
    { to: "/planner", label: pick(t.nav.planner) },
  ];

  return (
    <div className="shell">
      <div className="shell-atmosphere" aria-hidden="true" />
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">{pick(t.appName).charAt(0)}</span>
          <span className="brand-text">
            <strong>{pick(t.appName)}</strong>
            <small>{pick(t.tagline)}</small>
          </span>
        </NavLink>
        <div className="topbar-actions">
          <LanguageSwitcher />
          <nav className="nav" aria-label="Main navigation">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <p>{pick(t.ownership)}</p>
      </footer>
    </div>
  );
}
