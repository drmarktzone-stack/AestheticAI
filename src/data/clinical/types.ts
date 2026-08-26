import type { Locale } from "../../i18n/types";

export type L3 = Record<Locale, string>;
export type L3List = Record<Locale, string[]>;

export const L = (he: string, ar: string, en: string): L3 => ({ he, ar, en });

export function pickL(locale: Locale, value: L3): string {
  return value[locale];
}

export function pickList(locale: Locale, value: L3List): string[] {
  return value[locale];
}

export type MentorSectionId =
  | "overview"
  | "materials"
  | "dosing"
  | "technique"
  | "complications"
  | "simulation"
  | "document";

export interface MentorMedia {
  id: string;
  kind: "image" | "timeline" | "animation" | "beforeAfter";
  src: string;
  poster?: string;
  caption: L3;
}

export interface MentorMaterial {
  id: string;
  name: L3;
  role: L3;
  rheology: L3;
  planes: L3;
  dose: L3;
  pearls: L3List;
  cautions: L3List;
}

export interface MentorDosePoint {
  id: string;
  site: L3;
  typical: L3;
  plane: L3;
  note: L3;
}

export interface MentorTechnique {
  id: string;
  name: L3;
  when: L3;
  steps: L3List;
  pitfalls: L3List;
  mediaId?: string;
}

export interface MentorComplication {
  id: string;
  name: L3;
  urgency: "moderate" | "high" | "critical";
  signs: L3List;
  actions: L3List;
}

export interface ClinicalMentorGuide {
  id: string;
  regionId: string;
  title: L3;
  subtitle: L3;
  disclaimer: L3;
  goals: L3List;
  anatomy: L3List;
  dangerZones: L3List;
  materials: MentorMaterial[];
  dosing: MentorDosePoint[];
  techniques: MentorTechnique[];
  complications: MentorComplication[];
  followUp: L3List;
  media: MentorMedia[];
  protocolName: L3;
  reviewedByPhysician: boolean;
}
