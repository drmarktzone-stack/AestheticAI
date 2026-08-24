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
    timeline: string;
    checkin: string;
    clinicAlerts: string;
    materials: string;
    regions: string;
    emergency: string;
    camera: string;
  };
  home: {
    welcome: string;
    subtitle: string;
    startConsultation: string;
    openSimulation: string;
    openTimeline: string;
    openCheckIn: string;
    openClinicAlerts: string;
    openCamera: string;
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
  analysis: {
    title: string;
    run: string;
    running: string;
    symmetry: string;
    skin: string;
    wrinkles: string;
    degraded: string;
    error: string;
  };
  camera: {
    title: string;
    capture: string;
    permission: {
      message: string;
      grant: string;
    };
    stage: {
      before: string;
      after: string;
    };
    ghost: {
      toggle: string;
      active: string;
    };
    guide: {
      ready: string;
      adjustPitch: string;
      adjustYaw: string;
      adjustRoll: string;
      adjustDistance: string;
    };
    metrics: {
      pitch: string;
      yaw: string;
      roll: string;
      score: string;
    };
    result: {
      saved: string;
      score: string;
      lighting: string;
    };
  };
  timeline: {
    title: string;
    subtitle: string;
    baselinePhoto: string;
    pickPhoto: string;
    changePhoto: string;
    procedureLabel: string;
    generate: string;
    baseline: string;
    compareCaption: string;
    pendingFrame: string;
    partial: string;
    disclaimer: string;
    procedures: {
      lip_filler: string;
      botox_forehead: string;
      rhinoplasty: string;
      cheek_filler: string;
      jawline_contour: string;
    };
    milestones: {
      day1: string;
      day7: string;
      month3: string;
      month6: string;
    };
    milestonesShort: {
      day1: string;
      day7: string;
      month3: string;
      month6: string;
    };
    loading: {
      queued: string;
      day1: string;
      day7: string;
      month3: string;
      month6: string;
      finalizing: string;
      done: string;
      failed: string;
    };
  };
  checkin: {
    title: string;
    subtitle: string;
    photoTitle: string;
    photoHint: string;
    takePhoto: string;
    choosePhoto: string;
    questionnaireTitle: string;
    painLevel: string;
    swelling: string;
    bruising: string;
    asymmetry: string;
    fever: string;
    systemicSymptoms: string;
    visionChanges: string;
    warmthOrDischarge: string;
    notesLabel: string;
    notesPlaceholder: string;
    notesEncryptedHint: string;
    previewFlags: string;
    submit: string;
    success: string;
    error: string;
    disclaimer: string;
    reminderTitle: string;
    reminderBody: string;
    enableReminder: string;
    reminderScheduled: string;
    notificationDenied: string;
    levels: {
      swelling: {
        none: string;
        mild: string;
        moderate: string;
        severe: string;
      };
      bruising: {
        none: string;
        expected: string;
        unexpected_spread: string;
      };
      asymmetry: {
        none: string;
        mild: string;
        severe: string;
      };
    };
    redFlag: {
      title: string;
      message: string;
      urgent: string;
      contactClinic: string;
      acknowledge: string;
      codes: {
        severe_asymmetry: string;
        unexpected_bruising: string;
        systemic_pain: string;
        fever_infection: string;
        vision_changes: string;
        severe_swelling: string;
        image_asymmetry_signal: string;
        image_bruising_signal: string;
      };
    };
  };
  clinicAlerts: {
    title: string;
    subtitle: string;
    empty: string;
    acknowledge: string;
    acknowledged: string;
    patientRef: string;
    severity: {
      high: string;
      critical: string;
    };
  };
  notifications: {
    reminder: {
      title: string;
      body: string;
    };
    redFlag: {
      title: string;
      body: string;
    };
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
