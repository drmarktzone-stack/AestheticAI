import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import { applyLayoutDirection, getStoredLocale, persistLocale } from "@/i18n/rtl";
import { resources } from "@/i18n/resources";
import {
  isSupportedLocale,
  type SupportedLocale,
} from "@/types/translations";

function resolveDeviceLocale(): SupportedLocale {
  const deviceTag = Localization.getLocales()[0]?.languageCode ?? "en";
  if (isSupportedLocale(deviceTag)) return deviceTag;
  return "en";
}

export async function initI18n(): Promise<void> {
  const stored = await getStoredLocale();
  const initialLocale = stored ?? resolveDeviceLocale();

  await applyLayoutDirection(initialLocale);

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: initialLocale,
      fallbackLng: "en",
      supportedLngs: ["en", "he", "ar"],
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      compatibilityJSON: "v4",
    });
  } else {
    await i18n.changeLanguage(initialLocale);
  }
}

export async function changeAppLanguage(locale: SupportedLocale): Promise<void> {
  await persistLocale(locale);
  const needsReload = await applyLayoutDirection(locale);
  await i18n.changeLanguage(locale);

  if (__DEV__ && needsReload) {
    // In dev, Expo Go may not reload automatically — user restarts manually.
    console.warn("[i18n] RTL direction changed. Reload the app to apply native mirroring.");
  }
}

export { i18n };
