import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { strings } from "./strings";
import type { Locale, LocaleStrings } from "./types";

const STORAGE_KEY = "protokol-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: LocaleStrings;
  pick: (localized: { he: string; ar: string; en: string }) => string;
  dir: "rtl" | "ltr";
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectInitial(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved === "he" || saved === "ar" || saved === "en") return saved;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("he")) return "he";
  if (lang.startsWith("ar")) return "ar";
  return "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitial);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const dir: "rtl" | "ltr" = locale === "en" ? "ltr" : "rtl";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const pick = useCallback(
    (localized: { he: string; ar: string; en: string }) => localized[locale],
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t: strings, pick, dir }),
    [locale, setLocale, pick, dir],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
