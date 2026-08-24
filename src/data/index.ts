import { materials } from "./materials";
import { regions } from "./regions";
import { techniques } from "./techniques";
import { emergencies, protocols } from "./protocols";

export * from "./types";
export * from "./faceZones";
export { materials, regions, techniques, emergencies, protocols };
export * from "./world";

export const appMeta = {
  nameHe: "פרוטוקול",
  nameEn: "Protokol",
  tagline: "מדריך קליני לרופאי אסתטיקה",
  ownership:
    "התוכן הקליני באחריות הרופא המשתמש. ערכי ברירת המחדל הם טיוטות עבודה לאישור — לא הנחיות מוכנות לשימוש.",
};

export function getMaterial(id: string) {
  return materials.find((m) => m.id === id);
}

export function getRegion(id: string) {
  return regions.find((r) => r.id === id);
}

export function getTechnique(id: string) {
  return techniques.find((t) => t.id === id);
}

export function getProtocol(id: string) {
  return protocols.find((p) => p.id === id);
}

export function getEmergency(id: string) {
  return emergencies.find((e) => e.id === id);
}

export const materialClassLabel: Record<string, string> = {
  ha: "חומצה היאלורונית",
  toxin: "טוקסין",
  biostimulator: "ביוסטימולטור",
  caha: "CaHA",
  hybrid: "היברידי (HA+CaHA/PDLLA)",
  pn: "פולינucleotides (PN/PDRN)",
  regenerative: "רегенרטיבי (exosomes)",
  enzyme: "אנזים",
  other: "אחר",
};

export const noveltyLabel: Record<string, string> = {
  established: "מבוסס",
  emerging: "חדש / בצמיחה",
  frontier: "חזית — רוב הרופאים עדיין לא מכירים",
};

export const riskLabel: Record<string, string> = {
  low: "נמוך",
  moderate: "בינוני",
  high: "גבוה",
  critical: "קריטי",
};

export const planeLabel: Record<string, string> = {
  intradermal: "תוך־עורי",
  subdermal: "תת־עורי",
  "superficial-fat": "שומן שטחי",
  "deep-fat": "שומן עמוק",
  periosteal: "פריאוסטאלי",
  intramuscular: "תוך־שרירי",
};
