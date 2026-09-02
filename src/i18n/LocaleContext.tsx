import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { strings, type Strings } from "./strings";
import { isRtl, type Locale, type Localized } from "./types";

const STORAGE_KEY = "aestheticai.locale";

function readStored(): Locale {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "he" || value === "ar" || value === "en") return value;
  } catch {
    /* private mode */
  }
  return "he";
}

function applyDocument(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = isRtl(locale) ? "rtl" : "ltr";
  document.documentElement.dataset.locale = locale;
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  strings: Strings;
  t: (value: Localized) => string;
  dir: "rtl" | "ltr";
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof document === "undefined") return "he";
    const initial = readStored();
    applyDocument(initial);
    return initial;
  });

  useEffect(() => {
    applyDocument(locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const t = useCallback((value: Localized) => value[locale], [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      strings,
      t,
      dir: isRtl(locale) ? "rtl" : "ltr",
    }),
    [locale, setLocale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
