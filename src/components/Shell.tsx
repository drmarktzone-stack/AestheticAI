import { NavLink } from "react-router-dom";
import { appMeta } from "../data";
import "./Shell.css";

const links = [
  { to: "/", label: "בית", end: true },
  { to: "/materials", label: "חומרים" },
  { to: "/regions", label: "אזורים" },
  { to: "/techniques", label: "טכניקות" },
  { to: "/protocols", label: "פרוטוקולים" },
  { to: "/emergency", label: "חירום" },
  { to: "/planner", label: "מתכנן" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <div className="shell-atmosphere" aria-hidden="true" />
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">פ</span>
          <span className="brand-text">
            <strong>{appMeta.nameHe}</strong>
            <small>{appMeta.tagline}</small>
          </span>
        </NavLink>
        <nav className="nav" aria-label="ניווט ראשי">
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
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <p>{appMeta.ownership}</p>
      </footer>
    </div>
  );
}
