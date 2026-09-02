import { CLINICAL_TREATMENTS, getTreatment } from "../data/clinical/treatmentCatalog";
import type { Locale } from "../i18n/types";
import { regionPoly, SIM_REGIONS } from "./face/regions";
import type { AfterIntent, FaceFrame, RegionPlan, SimRegionId, TreatmentKind, Vec2 } from "./face/types";
import { lm } from "./face/types";
import { defaultIntent } from "./face/warp";
import type { FindingKind, ScanFinding, ScanPoint } from "./scanTypes";

export const CATALOG_TREATMENT_IDS = CLINICAL_TREATMENTS.map((item) => item.id);

const REGION_ALIASES: Record<string, SimRegionId> = {
  lips: "lips",
  lip: "lips",
  midface: "cheeks",
  "mid-face": "cheeks",
  cheeks: "cheeks",
  cheek: "cheeks",
  jaw: "jawline",
  jawline: "jawline",
  mandible: "jawline",
  chin: "chin",
  nose: "nose",
  nasal: "nose",
  temples: "temple",
  temple: "temple",
  periocular: "periocular",
  crows: "periocular",
  "crow's": "periocular",
  "crows-feet": "periocular",
  periorbital: "periocular",
  forehead: "forehead",
  frontalis: "forehead",
  glabella: "glabella",
  glabellar: "glabella",
  masseter: "masseter",
  neck: "neck",
  platysma: "neck",
};

export const SIM_TO_ZONES: Record<SimRegionId, string[]> = {
  lips: ["lips"],
  cheeks: ["cheek-l", "cheek-r"],
  jawline: ["jaw-l", "jaw-r"],
  chin: ["chin"],
  nose: ["nose"],
  temple: ["temple-l", "temple-r"],
  periocular: ["periocular-l", "periocular-r"],
  forehead: ["forehead"],
  glabella: ["glabella"],
  neck: ["neck"],
  masseter: ["masseter-l", "masseter-r"],
};

const DEFAULT_TREATMENT: Record<SimRegionId, Partial<Record<FindingKind, string>>> = {
  lips: { "volume-loss": "filler-lips-volume", fold: "filler-lips-definition", other: "filler-lips-volume" },
  cheeks: { "volume-loss": "filler-midface", fold: "filler-nasolabial", wrinkle: "filler-nasolabial" },
  jawline: { "volume-loss": "filler-jawline", hypertrophy: "toxin-masseter-slim", other: "filler-jawline" },
  chin: { "volume-loss": "filler-chin", other: "filler-chin" },
  nose: { "volume-loss": "filler-nose", other: "filler-nose" },
  temple: { "volume-loss": "filler-temples", other: "filler-temples" },
  periocular: { wrinkle: "toxin-crows", "volume-loss": "filler-tear-trough", fold: "filler-tear-trough" },
  forehead: { wrinkle: "toxin-forehead", other: "toxin-forehead" },
  glabella: { wrinkle: "toxin-glabella", other: "toxin-glabella" },
  neck: { wrinkle: "biostim-skin", fold: "biostim-skin", other: "toxin-cervical-dystonia" },
  masseter: { hypertrophy: "toxin-masseter-slim", other: "toxin-masseter-slim" },
};

const OVERRIDE_TREATMENT: Record<TreatmentKind, Partial<Record<SimRegionId, string>>> = {
  filler: {
    lips: "filler-lips-volume",
    cheeks: "filler-midface",
    jawline: "filler-jawline",
    chin: "filler-chin",
    nose: "filler-nose",
    temple: "filler-temples",
    periocular: "filler-tear-trough",
    forehead: "filler-temples",
    glabella: "filler-nasolabial",
    neck: "biostim-skin",
    masseter: "filler-jawline",
  },
  tightening: {
    cheeks: "biostim-skin",
    jawline: "biostim-skin",
    chin: "biostim-skin",
    temple: "biostim-skin",
    neck: "biostim-skin",
    periocular: "biostim-skin",
    forehead: "biostim-skin",
    lips: "biostim-skin",
    glabella: "biostim-skin",
    nose: "biostim-skin",
    masseter: "biostim-skin",
  },
  wrinkles: {
    glabella: "toxin-glabella",
    forehead: "toxin-forehead",
    periocular: "toxin-crows",
    neck: "biostim-skin",
    cheeks: "filler-nasolabial",
    lips: "filler-lips-definition",
    temple: "toxin-forehead",
    chin: "filler-chin",
    jawline: "filler-jawline",
    nose: "filler-nose",
    masseter: "toxin-masseter-slim",
  },
  "toxin-aesthetic": {
    glabella: "toxin-glabella",
    forehead: "toxin-forehead",
    periocular: "toxin-crows",
    masseter: "toxin-masseter-slim",
    neck: "toxin-cervical-dystonia",
    temple: "toxin-forehead",
    cheeks: "toxin-masseter-slim",
    lips: "toxin-crows",
    chin: "toxin-masseter-slim",
    jawline: "toxin-masseter-slim",
    nose: "toxin-crows",
  },
  "toxin-therapeutic": {
    masseter: "toxin-tmj",
    forehead: "toxin-migraine",
    glabella: "toxin-migraine",
    temple: "toxin-migraine",
    neck: "toxin-cervical-dystonia",
    periocular: "toxin-migraine",
    jawline: "toxin-tmj",
    cheeks: "toxin-tmj",
    chin: "toxin-tmj",
    lips: "toxin-tmj",
    nose: "toxin-migraine",
  },
};

export function normalizeRegionId(raw: string | undefined | null): SimRegionId | null {
  if (!raw) return null;
  const key = raw.toLowerCase().trim().replace(/_/g, "-");
  if (REGION_ALIASES[key]) return REGION_ALIASES[key]!;
  if (SIM_REGIONS.some((item) => item.id === key)) return key as SimRegionId;
  for (const [sim, zones] of Object.entries(SIM_TO_ZONES)) {
    if (zones.includes(key)) return sim as SimRegionId;
  }
  return null;
}

export function snapTreatmentIds(ids: string[] | undefined, regionId?: SimRegionId, kind?: FindingKind): string[] {
  const known = new Set(CATALOG_TREATMENT_IDS);
  const snapped = [...new Set((ids ?? []).filter((id) => known.has(id)))];
  if (snapped.length) return snapped;
  if (!regionId || !kind) return [];
  const fallback = DEFAULT_TREATMENT[regionId]?.[kind] ?? DEFAULT_TREATMENT[regionId]?.other;
  return fallback && known.has(fallback) ? [fallback] : [];
}

export function zoneIdsForRegion(regionId: SimRegionId): string[] {
  return SIM_TO_ZONES[regionId] ?? [regionId];
}

export function treatmentForOverride(regionId: SimRegionId, family: TreatmentKind): string | null {
  return OVERRIDE_TREATMENT[family][regionId] ?? null;
}

export function clampSeverity(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 2;
  return Math.max(0, Math.min(4, Math.round(n)));
}

export function clampPoint(point: ScanPoint): ScanPoint {
  return {
    x: Math.max(0, Math.min(1, point.x)),
    y: Math.max(0, Math.min(1, point.y)),
  };
}

export function sanitizeFinding(raw: Partial<ScanFinding> & { regionId?: string }, index: number): ScanFinding | null {
  const regionId = normalizeRegionId(raw.regionId);
  if (!regionId) return null;
  const kind = isFindingKind(raw.kind) ? raw.kind : "other";
  const points = Array.isArray(raw.points)
    ? raw.points
        .filter((p): p is ScanPoint => typeof p?.x === "number" && typeof p?.y === "number")
        .map(clampPoint)
    : [];
  const suggestedTreatmentIds = snapTreatmentIds(raw.suggestedTreatmentIds, regionId, kind);
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : `finding-${regionId}-${index}`,
    regionId,
    kind,
    labelHe: typeof raw.labelHe === "string" && raw.labelHe ? raw.labelHe : regionId,
    labelEn: typeof raw.labelEn === "string" && raw.labelEn ? raw.labelEn : regionId,
    labelAr: typeof raw.labelAr === "string" ? raw.labelAr : undefined,
    severity: clampSeverity(raw.severity),
    points,
    suggestedTreatmentIds,
    enabled: raw.enabled !== false,
    override: raw.override === true,
  };
}

function isFindingKind(value: unknown): value is FindingKind {
  return value === "wrinkle" || value === "fold" || value === "volume-loss" || value === "hypertrophy" || value === "other";
}

export function findingLabel(finding: ScanFinding, locale: Locale): string {
  if (locale === "he") return finding.labelHe;
  if (locale === "ar") return finding.labelAr ?? finding.labelEn;
  return finding.labelEn;
}

export function familyToKind(family: string): TreatmentKind {
  if (family === "biostim") return "tightening";
  if (family === "filler") return "filler";
  if (family === "toxin-aesthetic") return "toxin-aesthetic";
  if (family === "toxin-therapeutic") return "toxin-therapeutic";
  return "wrinkles";
}

export function plansFromFindings(findings: ScanFinding[]): RegionPlan[] {
  const byRegion = new Map<SimRegionId, RegionPlan>();
  for (const finding of findings.filter((item) => item.enabled)) {
    const treatmentId = finding.suggestedTreatmentIds[0];
    const treatment = treatmentId ? getTreatment(treatmentId) : undefined;
    const kind = treatment ? familyToKind(treatment.family) : kindFromFinding(finding.kind);
    const intent: AfterIntent = defaultIntent(finding.regionId, kind);
    byRegion.set(finding.regionId, { regionId: finding.regionId, treatment: kind, intent });
  }
  return [...byRegion.values()];
}

function kindFromFinding(kind: FindingKind): TreatmentKind {
  if (kind === "volume-loss") return "filler";
  if (kind === "hypertrophy") return "toxin-aesthetic";
  if (kind === "fold") return "filler";
  if (kind === "wrinkle") return "wrinkles";
  return "filler";
}

export function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)];
}

export function enabledTreatmentIds(findings: ScanFinding[]): string[] {
  return uniqueIds(findings.filter((item) => item.enabled).flatMap((item) => item.suggestedTreatmentIds));
}

export function enabledZoneIds(findings: ScanFinding[]): string[] {
  return uniqueIds(
    findings.filter((item) => item.enabled).flatMap((item) => zoneIdsForRegion(item.regionId)),
  );
}

export function findingPath(finding: ScanFinding, landmarks: Vec2[]): Vec2[] {
  if (finding.points.length >= 2) return finding.points;
  const def = SIM_REGIONS.find((item) => item.id === finding.regionId);
  if (!def) return finding.points;
  return regionPoly(landmarks, def);
}

export function overrideFinding(
  regionId: SimRegionId,
  family: TreatmentKind,
  landmarks: Vec2[],
  locale: Locale,
): ScanFinding | null {
  const treatmentId = treatmentForOverride(regionId, family);
  if (!treatmentId) return null;
  const treatment = getTreatment(treatmentId);
  const def = SIM_REGIONS.find((item) => item.id === regionId);
  const points = def ? regionPoly(landmarks, def) : [];
  const kind: FindingKind =
    family === "filler" ? "volume-loss" : family === "tightening" ? "other" : family.includes("toxin") || family === "wrinkles" ? "wrinkle" : "other";
  const title = treatment?.title[locale] ?? regionId;
  return {
    id: `override-${regionId}`,
    regionId,
    kind: family === "toxin-therapeutic" && regionId === "masseter" ? "hypertrophy" : kind,
    labelHe: treatment?.title.he ?? title,
    labelEn: treatment?.title.en ?? title,
    labelAr: treatment?.title.ar,
    severity: 2,
    points,
    suggestedTreatmentIds: [treatmentId],
    enabled: true,
    override: true,
  };
}

function offset(point: Vec2, dx: number, dy: number): Vec2 {
  return { x: point.x + dx, y: point.y + dy };
}

function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export type InjectionMark = {
  x: number;
  y: number;
  label: string;
  treatmentId: string;
};

export function injectionMarks(
  landmarks: Vec2[],
  treatmentId: string,
  sitesTypical: number,
  doseLabel: string,
): InjectionMark[] {
  const sites = injectionSites(landmarks, treatmentId, Math.max(1, sitesTypical));
  return sites.map((point) => ({ ...point, label: doseLabel, treatmentId }));
}

function injectionSites(landmarks: Vec2[], treatmentId: string, count: number): Vec2[] {
  const take = (points: Vec2[]) => {
    if (points.length >= count) return points.slice(0, count);
    if (!points.length) return points;
    const extra: Vec2[] = [...points];
    while (extra.length < count) {
      const i = extra.length % Math.max(points.length, 1);
      const a = points[i]!;
      const b = points[(i + 1) % points.length]!;
      extra.push(lerp(a, b, 0.5));
    }
    return extra.slice(0, count);
  };

  switch (treatmentId) {
    case "toxin-glabella":
      return take([
        offset(lm(landmarks, 9), 0, 0.012),
        offset(lm(landmarks, 55), -0.01, 0.008),
        offset(lm(landmarks, 285), 0.01, 0.008),
        offset(lm(landmarks, 107), -0.018, 0),
        offset(lm(landmarks, 336), 0.018, 0),
      ]);
    case "toxin-forehead":
      return take([
        offset(lm(landmarks, 109), 0, 0.03),
        offset(lm(landmarks, 10), 0, 0.04),
        offset(lm(landmarks, 338), 0, 0.03),
        offset(lm(landmarks, 67), 0, 0.05),
        offset(lm(landmarks, 297), 0, 0.05),
        offset(lm(landmarks, 151), 0, 0.02),
      ]);
    case "toxin-crows":
      return take([
        offset(lm(landmarks, 33), -0.045, -0.01),
        offset(lm(landmarks, 130), -0.05, 0.01),
        offset(lm(landmarks, 226), -0.04, 0.03),
        offset(lm(landmarks, 263), 0.045, -0.01),
        offset(lm(landmarks, 359), 0.05, 0.01),
        offset(lm(landmarks, 446), 0.04, 0.03),
      ]);
    case "toxin-masseter-slim":
    case "toxin-tmj":
      return take([
        offset(lm(landmarks, 234), 0.02, 0.06),
        offset(lm(landmarks, 132), 0.02, 0.04),
        offset(lm(landmarks, 172), 0.015, 0.02),
        offset(lm(landmarks, 454), -0.02, 0.06),
        offset(lm(landmarks, 361), -0.02, 0.04),
        offset(lm(landmarks, 397), -0.015, 0.02),
      ]);
    case "filler-lips-volume":
    case "filler-lips-definition":
      return take([
        lm(landmarks, 61),
        lm(landmarks, 37),
        lm(landmarks, 0),
        lm(landmarks, 267),
        lm(landmarks, 291),
        lm(landmarks, 84),
        lm(landmarks, 17),
        lm(landmarks, 314),
      ]);
    case "filler-midface":
      return take([
        offset(lm(landmarks, 50), -0.02, -0.01),
        offset(lm(landmarks, 118), 0.01, 0.02),
        offset(lm(landmarks, 280), 0.02, -0.01),
        offset(lm(landmarks, 347), -0.01, 0.02),
      ]);
    case "filler-jawline":
      return take([
        lm(landmarks, 172),
        lm(landmarks, 136),
        lm(landmarks, 150),
        lm(landmarks, 397),
        lm(landmarks, 365),
        lm(landmarks, 379),
      ]);
    case "filler-temples":
      return take([offset(lm(landmarks, 21), 0.01, 0.02), offset(lm(landmarks, 251), -0.01, 0.02)]);
    case "filler-tear-trough":
      return take([
        offset(lm(landmarks, 133), 0.01, 0.035),
        offset(lm(landmarks, 362), -0.01, 0.035),
        offset(lm(landmarks, 145), 0, 0.03),
        offset(lm(landmarks, 374), 0, 0.03),
      ]);
    case "filler-nasolabial":
      return take([
        lerp(lm(landmarks, 48), lm(landmarks, 61), 0.35),
        lerp(lm(landmarks, 48), lm(landmarks, 61), 0.7),
        lerp(lm(landmarks, 278), lm(landmarks, 291), 0.35),
        lerp(lm(landmarks, 278), lm(landmarks, 291), 0.7),
      ]);
    case "filler-chin":
      return take([lm(landmarks, 152), offset(lm(landmarks, 175), -0.02, 0), offset(lm(landmarks, 175), 0.02, 0)]);
    case "filler-nose":
      return take([lm(landmarks, 6), lm(landmarks, 1), lm(landmarks, 4), lm(landmarks, 19)]);
    case "biostim-skin":
      return take([
        offset(lm(landmarks, 50), 0, 0.04),
        offset(lm(landmarks, 118), 0.03, 0.06),
        offset(lm(landmarks, 280), 0, 0.04),
        offset(lm(landmarks, 347), -0.03, 0.06),
        offset(lm(landmarks, 172), 0.02, 0),
        offset(lm(landmarks, 397), -0.02, 0),
      ]);
    default: {
      const region = treatmentRegion(treatmentId);
      const def = SIM_REGIONS.find((item) => item.id === region);
      if (!def) return [];
      const poly = regionPoly(landmarks, def);
      if (!poly.length) return [];
      const c = {
        x: poly.reduce((s, p) => s + p.x, 0) / poly.length,
        y: poly.reduce((s, p) => s + p.y, 0) / poly.length,
      };
      return take([c, ...poly.filter((_, i) => i % Math.max(1, Math.floor(poly.length / count)) === 0)]);
    }
  }
}

function treatmentRegion(treatmentId: string): SimRegionId {
  const treatment = getTreatment(treatmentId);
  const zone = treatment?.zoneIds[0];
  return normalizeRegionId(zone) ?? "cheeks";
}

function pathOf(landmarks: Vec2[], indices: number[]): Vec2[] {
  return indices.map((index) => lm(landmarks, index));
}

function luminanceAt(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  nx: number,
  ny: number,
): number {
  const x = Math.max(0, Math.min(w - 1, Math.round(nx * w)));
  const y = Math.max(0, Math.min(h - 1, Math.round(ny * h)));
  const i = (y * w + x) * 4;
  return (data[i]! * 0.2126 + data[i + 1]! * 0.7152 + data[i + 2]! * 0.0722);
}

function pathContrast(data: Uint8ClampedArray, w: number, h: number, points: Vec2[]): number {
  if (points.length < 2) return 0;
  const samples: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    for (let t = 0; t <= 8; t++) {
      const p = lerp(a, b, t / 8);
      samples.push(luminanceAt(data, w, h, p.x, p.y));
    }
  }
  if (samples.length < 2) return 0;
  const mean = samples.reduce((s, v) => s + v, 0) / samples.length;
  const variance = samples.reduce((s, v) => s + (v - mean) ** 2, 0) / samples.length;
  return Math.sqrt(variance);
}

function severityFromContrast(contrast: number): number {
  if (contrast < 6) return 1;
  if (contrast < 12) return 2;
  if (contrast < 22) return 3;
  return 4;
}

export function localAnalyze(frame: FaceFrame): ScanFinding[] {
  const ctx = frame.image.getContext("2d", { willReadFrequently: true });
  const pixels = ctx?.getImageData(0, 0, frame.width, frame.height);
  const data = pixels?.data;
  const w = frame.width;
  const h = frame.height;
  const lmks = frame.landmarks;
  const contrast = (points: Vec2[]) => (data ? pathContrast(data, w, h, points) : 10);

  const glabella = pathOf(lmks, [107, 9, 336, 8, 55, 285]);
  const forehead = pathOf(lmks, [109, 10, 338, 67, 151, 297]);
  const crowsL = pathOf(lmks, [33, 130, 226, 247, 30]);
  const crowsR = pathOf(lmks, [263, 359, 446, 467, 260]);
  const nlfL = [lm(lmks, 48), lerp(lm(lmks, 48), lm(lmks, 61), 0.45), lm(lmks, 61)];
  const nlfR = [lm(lmks, 278), lerp(lm(lmks, 278), lm(lmks, 291), 0.45), lm(lmks, 291)];
  const cheekL = pathOf(lmks, [50, 101, 118, 205]);
  const cheekR = pathOf(lmks, [280, 330, 347, 425]);
  const lips = pathOf(lmks, [61, 0, 291, 17]);
  const masseterL = pathOf(lmks, [234, 132, 172, 136]);
  const masseterR = pathOf(lmks, [454, 361, 397, 365]);

  const faceW = Math.hypot(lm(lmks, 234).x - lm(lmks, 454).x, lm(lmks, 234).y - lm(lmks, 454).y);
  const eyeW = Math.hypot(lm(lmks, 33).x - lm(lmks, 263).x, lm(lmks, 33).y - lm(lmks, 263).y) || 0.2;
  const masseterWide = faceW / eyeW > 1.85;

  const findings: ScanFinding[] = [
    {
      id: "local-glabella",
      regionId: "glabella",
      kind: "wrinkle",
      labelHe: "קמטי גלאבלה",
      labelEn: "Glabellar lines",
      labelAr: "خطوط الجبين",
      severity: severityFromContrast(contrast(glabella)),
      points: glabella,
      suggestedTreatmentIds: ["toxin-glabella"],
      enabled: true,
    },
    {
      id: "local-forehead",
      regionId: "forehead",
      kind: "wrinkle",
      labelHe: "קמטי מצח",
      labelEn: "Forehead lines",
      labelAr: "تجاعيد الجبهة",
      severity: severityFromContrast(contrast(forehead)),
      points: forehead,
      suggestedTreatmentIds: ["toxin-forehead"],
      enabled: true,
    },
    {
      id: "local-crows",
      regionId: "periocular",
      kind: "wrinkle",
      labelHe: "קמטי עין עורב",
      labelEn: "Crow’s feet",
      labelAr: "أقدام الغراب",
      severity: severityFromContrast((contrast(crowsL) + contrast(crowsR)) / 2),
      points: [...crowsL, ...crowsR],
      suggestedTreatmentIds: ["toxin-crows"],
      enabled: true,
    },
    {
      id: "local-nlf",
      regionId: "cheeks",
      kind: "fold",
      labelHe: "קפל נזולביאלי",
      labelEn: "Nasolabial fold",
      labelAr: "الطية الأنفية الشفوية",
      severity: severityFromContrast((contrast(nlfL) + contrast(nlfR)) / 2),
      points: [...nlfL, ...nlfR],
      suggestedTreatmentIds: ["filler-nasolabial"],
      enabled: true,
    },
    {
      id: "local-midface",
      regionId: "cheeks",
      kind: "volume-loss",
      labelHe: "אובדן נפח במרכז הפנים",
      labelEn: "Midface volume loss",
      labelAr: "فقد حجم منتصف الوجه",
      severity: Math.max(1, Math.min(4, severityFromContrast((contrast(cheekL) + contrast(cheekR)) / 2) - 1)),
      points: [...cheekL, ...cheekR],
      suggestedTreatmentIds: ["filler-midface"],
      enabled: true,
    },
    {
      id: "local-lips",
      regionId: "lips",
      kind: "volume-loss",
      labelHe: "נפח שפתיים",
      labelEn: "Lip volume",
      labelAr: "حجم الشفاه",
      severity: Math.max(1, severityFromContrast(contrast(lips)) - 1),
      points: lips,
      suggestedTreatmentIds: ["filler-lips-volume"],
      enabled: true,
    },
    {
      id: "local-masseter",
      regionId: "masseter",
      kind: "hypertrophy",
      labelHe: "היפרטרופיה של מסהטר",
      labelEn: "Masseter hypertrophy",
      labelAr: "تضخم الماضغة",
      severity: masseterWide ? 3 : 1,
      points: [...masseterL, ...masseterR],
      suggestedTreatmentIds: ["toxin-masseter-slim"],
      enabled: masseterWide,
    },
  ];

  return findings
    .map((item, index) => sanitizeFinding(item, index))
    .filter((item): item is ScanFinding => Boolean(item));
}
