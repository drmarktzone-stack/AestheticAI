export type Locale = "he" | "ar" | "en";

export type Localized = Record<Locale, string>;

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "ar", label: "AR" },
  { id: "he", label: "HE" },
];

export function isRtl(locale: Locale): boolean {
  return locale !== "en";
}

export function L(he: string, ar: string, en: string): Localized {
  return { he, ar, en };
}
