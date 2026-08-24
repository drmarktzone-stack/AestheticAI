export type Locale = "he" | "ar" | "en";

export type Localized = Record<Locale, string>;

export interface LocaleStrings {
  appName: Localized;
  tagline: Localized;
  ownership: Localized;
  nav: {
    home: Localized;
    materials: Localized;
    regions: Localized;
    techniques: Localized;
    protocols: Localized;
    emergency: Localized;
    planner: Localized;
    simulation: Localized;
    consultation: Localized;
  };
  common: {
    search: Localized;
    back: Localized;
    draft: Localized;
    approved: Localized;
    risk: Record<string, Localized>;
    planes: Record<string, Localized>;
    materialClass: Record<string, Localized>;
    disclaimer: Localized;
    simulationDisclaimer: Localized;
    uploadPhoto: Localized;
    before: Localized;
    after: Localized;
    intensity: Localized;
    addPoint: Localized;
    clearPoints: Localized;
    exportPlan: Localized;
    selectRegion: Localized;
    selectTechnique: Localized;
    startConsultation: Localized;
    nextStep: Localized;
    prevStep: Localized;
    noResults: Localized;
  };
  home: {
    heroTitle: Localized;
    heroLead: Localized;
    openEmergency: Localized;
    openPlanner: Localized;
    openSimulation: Localized;
    modulesTitle: Localized;
    ownershipTitle: Localized;
    ownershipBody: Localized;
    uniqueTitle: Localized;
    uniqueItems: Localized[];
  };
  simulation: {
    title: Localized;
    lead: Localized;
    zones: Localized;
    preview: Localized;
    compare: Localized;
  };
  consultation: {
    title: Localized;
    lead: Localized;
    stepAssess: Localized;
    stepPlan: Localized;
    stepSimulate: Localized;
    stepDocument: Localized;
  };
}
