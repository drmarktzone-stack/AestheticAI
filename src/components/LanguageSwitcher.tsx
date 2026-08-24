import { useLocale, type Locale } from "../i18n";

const labels: Record<Locale, string> = {
  he: "HE",
  ar: "AR",
  en: "EN",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {(["he", "ar", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          className={locale === l ? "active" : ""}
          onClick={() => setLocale(l)}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
