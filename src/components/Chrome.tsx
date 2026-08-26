import { NavLink } from "react-router-dom";

import { LOCALES } from "../i18n";
import { useLocale } from "../i18n/LocaleContext";

export function LanguageSwitcher() {
  const { locale, setLocale, strings, t } = useLocale();

  return (
    <div className="lang-switch" role="group" aria-label={t(strings.language)}>
      {LOCALES.map((item) => (
        <button
          key={item.id}
          type="button"
          className="lang-btn"
          aria-pressed={locale === item.id}
          onClick={() => setLocale(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M18 46 L32 14 L46 46"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M24 34 H40" stroke="#6B5CA5" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function DemoBadge({ label }: { label: string }) {
  return <span className="badge demo">{label}</span>;
}

export function DraftBadge({ label }: { label: string }) {
  return <span className="badge draft">{label}</span>;
}

export function StatusBanner({
  tone,
  children,
}: {
  tone: "loading" | "error" | "success" | "empty";
  children: string;
}) {
  return (
    <div className={`status ${tone}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}

export function ShellNav() {
  const { strings, t } = useLocale();
  const items = [
    { to: "/", label: strings.nav.world, end: true },
    { to: "/journey", label: strings.nav.journey, end: false },
    { to: "/planner", label: strings.nav.planner, end: false },
    { to: "/emergency", label: strings.nav.emergency, end: false, emergency: true },
  ] as const;

  return (
    <nav className="nav-links" aria-label={t(strings.appName)}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={"emergency" in item && item.emergency ? "nav-link emergency" : "nav-link"}
        >
          {t(item.label)}
        </NavLink>
      ))}
    </nav>
  );
}
