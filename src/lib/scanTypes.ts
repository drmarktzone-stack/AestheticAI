import type { SimRegionId } from "./face/types";

export type FindingKind = "wrinkle" | "fold" | "volume-loss" | "hypertrophy" | "other";

export type ScanPoint = { x: number; y: number };

export type ScanFinding = {
  id: string;
  regionId: SimRegionId;
  kind: FindingKind;
  labelHe: string;
  labelEn: string;
  labelAr?: string;
  severity: number;
  points: ScanPoint[];
  suggestedTreatmentIds: string[];
  enabled: boolean;
  override?: boolean;
};

export type AnalyzePayload = {
  findings: ScanFinding[];
  clinicalNote: string;
  source: "vertex" | "local";
};

export type VertexHealth = {
  ok: boolean;
  vertex: boolean;
};
