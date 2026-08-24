/**
 * Unified translation schema — all locale JSON files MUST conform to this shape.
 * Add new keys here first, then propagate to en.json, he.json, ar.json.
 */
export interface TranslationSchema {
  app: {
    name: string;
    tagline: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    save: string;
    language: string;
    disclaimer: string;
  };
  auth: {
    signIn: string;
    signOut: string;
    email: string;
    password: string;
    signInTitle: string;
    signInSubtitle: string;
    sessionExpired: string;
  };
  nav: {
    home: string;
    consultation: string;
    simulation: string;
    materials: string;
    regions: string;
    emergency: string;
  };
  home: {
    welcome: string;
    subtitle: string;
    startConsultation: string;
    openSimulation: string;
  };
  rtl: {
    directionChanged: string;
    restartRequired: string;
  };
  storage: {
    uploadSuccess: string;
    uploadError: string;
    accessDenied: string;
  };
  errors: {
    network: string;
    unauthorized: string;
    unknown: string;
  };
  setup: {
    supabaseReady: string;
    supabaseAuthenticated: string;
    supabaseNotConfigured: string;
  };
}

export type SupportedLocale = "en" | "he" | "ar";

export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ["en", "he", "ar"] as const;

export const RTL_LOCALES: readonly SupportedLocale[] = ["he", "ar"] as const;

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function isRtlLocale(locale: SupportedLocale): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}
