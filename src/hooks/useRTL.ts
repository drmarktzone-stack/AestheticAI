import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { isRtlLocale, type SupportedLocale } from "@/types/translations";

function resolveLocale(language: string | undefined): SupportedLocale {
  const base = language?.split("-")[0];
  return base === "he" || base === "ar" ? base : "en";
}

/**
 * Layout helpers that follow the active i18n locale. This keeps RTL accurate
 * on web immediately and remains compatible with native's layout reload flow.
 */
export function useRTL() {
  const { i18n } = useTranslation();
  const locale = resolveLocale(i18n.resolvedLanguage ?? i18n.language);
  const isRTL = isRtlLocale(locale);

  return useMemo(
    () => ({
      isRTL,
      writingDirection: isRTL ? ("rtl" as const) : ("ltr" as const),
      row: isRTL ? ("row-reverse" as const) : ("row" as const),
      rowReverse: isRTL ? ("row" as const) : ("row-reverse" as const),
      textStart: isRTL ? ("right" as const) : ("left" as const),
      textEnd: isRTL ? ("left" as const) : ("right" as const),
    }),
    [isRTL],
  );
}
