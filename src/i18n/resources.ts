import type { ResourceLanguage } from "i18next";

import ar from "@/locales/ar.json";
import en from "@/locales/en.json";
import he from "@/locales/he.json";
import type { TranslationSchema } from "@/types/translations";

/** Compile-time guard: locale files must match TranslationSchema */
const enResource = en satisfies TranslationSchema;
const heResource = he satisfies TranslationSchema;
const arResource = ar satisfies TranslationSchema;

export const resources = {
  en: { translation: enResource },
  he: { translation: heResource },
  ar: { translation: arResource },
} satisfies Record<string, ResourceLanguage>;

export type AppResources = typeof resources;

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: AppResources["en"];
  }
}

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: AppResources["en"];
  }
}
