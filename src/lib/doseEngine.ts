import {
  CLINICAL_TREATMENTS,
  getTreatment,
  type ClinicalTreatment,
  type DoseUnit,
} from "../data/clinical/treatmentCatalog";
import type { Locale } from "../i18n/types";

export type DoseLine = {
  treatmentId: string;
  title: string;
  materialName: string;
  brandExample: string;
  unit: DoseUnit;
  /** Calculated session total for selected overlapping zones */
  calculated: number;
  rangeMin: number;
  rangeMax: number;
  plane: string;
  aliquotNote: string;
  zoneIds: string[];
  sitesTypical: number;
};

export type DosePlan = {
  lines: DoseLine[];
  totalsByUnit: { ml: number; units: number };
  materials: { id: string; name: string; brandExample: string }[];
  education: string[];
};

/**
 * Auto-match materials + numeric dose plan from multi-selected clinical treatments
 * and optional zone overrides. Educational engine — IFU always wins.
 */
export function buildDosePlan(
  selectedTreatmentIds: string[],
  selectedZoneIds: string[],
  locale: Locale,
): DosePlan {
  const selected = selectedTreatmentIds
    .map((id) => getTreatment(id))
    .filter((t): t is ClinicalTreatment => Boolean(t));

  const lines: DoseLine[] = selected.map((t) => {
    const overlap = t.zoneIds.filter((z) => selectedZoneIds.includes(z));
    const zonesForCalc = overlap.length > 0 ? overlap : t.zoneIds;
    // Scale by how many of the treatment's zones are active (multi-select aware)
    const ratio = Math.max(zonesForCalc.length, 1) / Math.max(t.zoneIds.length, 1);
    let calculated = Number((t.dosing.typicalTotal * ratio).toFixed(t.dosing.unit === "ml" ? 2 : 0));
    if (t.dosing.unit === "units") {
      calculated = Math.round(t.dosing.typicalTotal * ratio);
    }
    // Clamp into educational range
    calculated = Math.min(t.dosing.rangeMax, Math.max(t.dosing.rangeMin * 0.5, calculated));

    return {
      treatmentId: t.id,
      title: t.title[locale],
      materialName: t.material.name[locale],
      brandExample: t.material.brandExample,
      unit: t.dosing.unit,
      calculated,
      rangeMin: t.dosing.rangeMin,
      rangeMax: t.dosing.rangeMax,
      plane: t.dosing.plane[locale],
      aliquotNote: t.dosing.aliquotNote[locale],
      zoneIds: zonesForCalc,
      sitesTypical: Math.max(1, Math.round(t.dosing.sitesTypical * ratio)),
    };
  });

  const totalsByUnit = lines.reduce(
    (acc, line) => {
      if (line.unit === "ml") acc.ml += line.calculated;
      else acc.units += line.calculated;
      return acc;
    },
    { ml: 0, units: 0 },
  );
  totalsByUnit.ml = Number(totalsByUnit.ml.toFixed(2));

  const materialMap = new Map<string, { id: string; name: string; brandExample: string }>();
  for (const t of selected) {
    materialMap.set(t.material.id, {
      id: t.material.id,
      name: t.material.name[locale],
      brandExample: t.material.brandExample,
    });
  }

  const education = selected.flatMap((t) => t.education[locale]);

  return {
    lines,
    totalsByUnit,
    materials: [...materialMap.values()],
    education,
  };
}

/** Zones implied by selected clinical images (union) */
export function zonesFromTreatments(treatmentIds: string[]): string[] {
  const set = new Set<string>();
  for (const id of treatmentIds) {
    const t = getTreatment(id);
    if (!t) continue;
    for (const z of t.zoneIds) set.add(z);
  }
  return [...set];
}

export function treatmentIdsForZones(zoneIds: string[]): string[] {
  return CLINICAL_TREATMENTS.filter((t) => t.zoneIds.some((z) => zoneIds.includes(z))).map(
    (t) => t.id,
  );
}
