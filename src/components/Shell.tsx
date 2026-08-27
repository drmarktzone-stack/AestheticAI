import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { LanguageSwitcher, ShellNav } from "./Chrome";
import { useLocale } from "../i18n/LocaleContext";

export function Shell() {
  const { strings, t } = useLocale();
  const { pathname } = useLocation();
  const space =
    pathname === "/" || pathname.startsWith("/planner")
      ? "sim"
      : pathname.startsWith("/emergency")
        ? "ace"
        : "atlas";

  return (
    <div className="app-shell" data-space={space}>
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-name">{t(strings.appName)}</span>
        </Link>
        <ShellNav />
        <div className="topbar-tools">
          <LanguageSwitcher />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer-note">
        <span>
          {t(strings.physicianOnly)} {t(strings.clinicianDecides)}
        </span>
        <span>AestheticAI. Physician use only.</span>
      </footer>
    </div>
  );
}

export function Spine({
  regionId,
  current,
}: {
  regionId?: string;
  current: "world" | "region" | "protocol" | "materials" | "injection" | "emergency";
}) {
  const { strings, t } = useLocale();
  const base = regionId ? `/journey/${regionId}` : "/atlas";
  const items = [
    { id: "world" as const, to: "/atlas", label: strings.nav.atlas },
    { id: "region" as const, to: `${base}/region`, label: strings.spine.region },
    { id: "protocol" as const, to: `${base}/protocol`, label: strings.spine.protocol },
    { id: "materials" as const, to: `${base}/materials`, label: strings.spine.materials },
    { id: "injection" as const, to: `${base}/injection`, label: strings.spine.injection },
    { id: "emergency" as const, to: `${base}/emergency`, label: strings.spine.emergency },
  ];

  return (
    <div className="spine" aria-label={t(strings.journey.title)}>
      {items.map((item) => (
        <NavLink key={item.id} to={item.to} className={current === item.id ? "current" : undefined}>
          {t(item.label)}
        </NavLink>
      ))}
    </div>
  );
}
