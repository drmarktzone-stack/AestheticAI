export type Locale = "he" | "ar" | "en";

export type Localized = Record<Locale, string>;

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "he", label: "HE" },
  { id: "ar", label: "AR" },
  { id: "en", label: "EN" },
];

export function isRtl(locale: Locale): boolean {
  return locale !== "en";
}

export function L(he: string, ar: string, en: string): Localized {
  return { he, ar, en };
}
