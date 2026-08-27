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
    { to: "/", label: strings.nav.simulate, end: true },
    { to: "/atlas", label: strings.nav.atlas, end: false },
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
