export type MaterialClass =
  | "ha"
  | "toxin"
  | "biostimulator"
  | "caha"
  | "hybrid"
  | "pn"
  | "regenerative"
  | "enzyme"
  | "other";

export type MaterialNovelty = "established" | "emerging" | "frontier";

export type TissuePlane =
  | "intradermal"
  | "subdermal"
  | "superficial-fat"
  | "deep-fat"
  | "periosteal"
  | "intramuscular";

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export interface SourceRef {
  label: string;
  note?: string;
  /** Link to global citation registry */
  citationId?: string;
  url?: string;
}

export type CitationType =
  | "guideline"
  | "consensus"
  | "society"
  | "ifu"
  | "trial"
  | "training";

export interface GlobalCitation {
  id: string;
  type: CitationType;
  issuer: string;
  year?: number;
  title: { he: string; ar: string; en: string };
  summary: { he: string; ar: string; en: string };
  url?: string;
  doi?: string;
  pmid?: string;
  /** Related protocol/material/domain ids */
  tags?: string[];
}

export interface AestheticCompany {
  id: string;
  name: string;
  hq: string;
  website?: string;
  focus: string[];
  productIds: string[];
  description: { he: string; ar: string; en: string };
  differentiators: { he: string[]; ar: string[]; en: string[] };
  whyRecommended: { he: string; ar: string; en: string };
  citationIds: string[];
  reviewedByPhysician: boolean;
}

export type AestheticDomainId =
  | "injectables"
  | "threads"
  | "peels"
  | "hair"
  | "body"
  | "devices"
  | "lipolytics"
  | "combinations";

export interface DomainProduct {
  id: string;
  domain: AestheticDomainId;
  companyId?: string;
  nameHe: string;
  nameAr: string;
  nameEn: string;
  characteristics: { he: string[]; ar: string[]; en: string[] };
  whyRecommended: { he: string; ar: string; en: string };
  typicalUses: string[];
  doseNotes: string[];
  citationIds: string[];
  materialId?: string;
  reviewedByPhysician: boolean;
}

export interface Material {
  id: string;
  nameHe: string;
  nameAr?: string;
  nameEn: string;
  class: MaterialClass;
  /** Manufacturer / trade names */
  brands?: string[];
  /** Storage modulus guidance where published */
  gPrime?: string;
  concentration?: string;
  /** established = mainstream · emerging = growing adoption · frontier = very new / niche */
  novelty?: MaterialNovelty;
  rheology?: string;
  typicalUses: string[];
  planes: TissuePlane[];
  doseNotes: string[];
  contraindications: string[];
  pearls: string[];
  sources: SourceRef[];
  reviewedByPhysician: boolean;
}

export interface InjectionRegion {
  id: string;
  nameHe: string;
  nameAr?: string;
  nameEn: string;
  goals: string[];
  anatomyNotes: string[];
  dangerZones: string[];
  preferredPlanes: TissuePlane[];
  techniqueHints: string[];
  materialHints: string[];
  risk: RiskLevel;
  emergencyFlags: string[];
  sources: SourceRef[];
  reviewedByPhysician: boolean;
}

export interface Technique {
  id: string;
  nameHe: string;
  nameAr?: string;
  nameEn: string;
  summary: string;
  whenToUse: string[];
  howTo: string[];
  pitfalls: string[];
  reviewedByPhysician: boolean;
}

export interface ProtocolStep {
  title: string;
  detail: string;
}

export interface Protocol {
  id: string;
  nameHe: string;
  nameAr?: string;
  nameEn?: string;
  indication: string;
  regionIds: string[];
  materialIds: string[];
  techniqueIds: string[];
  steps: ProtocolStep[];
  dosingFramework: string[];
  followUp: string[];
  redFlags: string[];
  sources: SourceRef[];
  /** Global protocol / guideline citations */
  citationIds?: string[];
  reviewedByPhysician: boolean;
}

export interface EmergencyProtocol {
  id: string;
  nameHe: string;
  urgency: RiskLevel;
  recognition: string[];
  immediateActions: string[];
  medsAndTools: string[];
  escalation: string[];
  documentation: string[];
  /** Global emergency protocol citations (ACE, etc.) */
  citationIds?: string[];
  reviewedByPhysician: boolean;
}
