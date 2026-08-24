export type MaterialClass =
  | "ha"
  | "toxin"
  | "biostimulator"
  | "caha"
  | "enzyme"
  | "other";

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
}

export interface Material {
  id: string;
  nameHe: string;
  nameEn: string;
  class: MaterialClass;
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
  indication: string;
  regionIds: string[];
  materialIds: string[];
  techniqueIds: string[];
  steps: ProtocolStep[];
  dosingFramework: string[];
  followUp: string[];
  redFlags: string[];
  sources: SourceRef[];
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
  reviewedByPhysician: boolean;
}
