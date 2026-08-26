export interface FaceZone {
  id: string;
  regionId: string;
  /** normalized 0-1 on face canvas */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** simulation effect type */
  effect: "volume" | "contour" | "smooth" | "lift";
}

/** Generic frontal face template zones (percent of canvas) */
export const faceZones: FaceZone[] = [
  { id: "forehead", regionId: "forehead", cx: 0.5, cy: 0.18, rx: 0.16, ry: 0.07, effect: "smooth" },
  { id: "glabella", regionId: "glabella", cx: 0.5, cy: 0.28, rx: 0.08, ry: 0.04, effect: "smooth" },
  { id: "periocular-l", regionId: "periocular", cx: 0.38, cy: 0.34, rx: 0.07, ry: 0.05, effect: "smooth" },
  { id: "periocular-r", regionId: "periocular", cx: 0.62, cy: 0.34, rx: 0.07, ry: 0.05, effect: "smooth" },
  { id: "nose", regionId: "nose", cx: 0.5, cy: 0.44, rx: 0.04, ry: 0.08, effect: "volume" },
  { id: "cheek-l", regionId: "cheeks", cx: 0.32, cy: 0.48, rx: 0.1, ry: 0.08, effect: "volume" },
  { id: "cheek-r", regionId: "cheeks", cx: 0.68, cy: 0.48, rx: 0.1, ry: 0.08, effect: "volume" },
  { id: "lips", regionId: "lips", cx: 0.5, cy: 0.62, rx: 0.12, ry: 0.05, effect: "volume" },
  { id: "jaw-l", regionId: "jawline", cx: 0.28, cy: 0.72, rx: 0.08, ry: 0.06, effect: "contour" },
  { id: "jaw-r", regionId: "jawline", cx: 0.72, cy: 0.72, rx: 0.08, ry: 0.06, effect: "contour" },
  { id: "temple-l", regionId: "temple", cx: 0.22, cy: 0.32, rx: 0.06, ry: 0.08, effect: "volume" },
  { id: "temple-r", regionId: "temple", cx: 0.78, cy: 0.32, rx: 0.06, ry: 0.08, effect: "volume" },
  { id: "masseter-l", regionId: "masseter", cx: 0.24, cy: 0.58, rx: 0.06, ry: 0.09, effect: "contour" },
  { id: "masseter-r", regionId: "masseter", cx: 0.76, cy: 0.58, rx: 0.06, ry: 0.09, effect: "contour" },
  { id: "tmj-l", regionId: "tmj", cx: 0.2, cy: 0.42, rx: 0.045, ry: 0.05, effect: "smooth" },
  { id: "tmj-r", regionId: "tmj", cx: 0.8, cy: 0.42, rx: 0.045, ry: 0.05, effect: "smooth" },
  { id: "chin", regionId: "chin", cx: 0.5, cy: 0.78, rx: 0.07, ry: 0.05, effect: "volume" },
  { id: "neck", regionId: "neck", cx: 0.5, cy: 0.9, rx: 0.14, ry: 0.05, effect: "smooth" },
  { id: "migraine", regionId: "migraine", cx: 0.5, cy: 0.22, rx: 0.22, ry: 0.16, effect: "smooth" },
  { id: "axilla-l", regionId: "axilla", cx: 0.08, cy: 0.55, rx: 0.05, ry: 0.07, effect: "smooth" },
  { id: "axilla-r", regionId: "axilla", cx: 0.92, cy: 0.55, rx: 0.05, ry: 0.07, effect: "smooth" },
  { id: "palm-l", regionId: "body", cx: 0.1, cy: 0.88, rx: 0.06, ry: 0.05, effect: "smooth" },
  { id: "palm-r", regionId: "body", cx: 0.9, cy: 0.88, rx: 0.06, ry: 0.05, effect: "smooth" },
];

export const ZONE_LABELS: Record<string, { he: string; ar: string; en: string }> = {
  forehead: { he: "מצח", ar: "الجبهة", en: "Forehead" },
  glabella: { he: "גלאבלה", ar: "الجبينة", en: "Glabella" },
  "periocular-l": { he: "עין עורב שמאל", ar: "حول العين يسار", en: "Periocular L" },
  "periocular-r": { he: "עין עורב ימין", ar: "حول العين يمين", en: "Periocular R" },
  nose: { he: "אף", ar: "الأنف", en: "Nose" },
  "cheek-l": { he: "לחי שמאל", ar: "خد أيسر", en: "Cheek L" },
  "cheek-r": { he: "לחי ימין", ar: "خد أيمن", en: "Cheek R" },
  lips: { he: "שפתיים", ar: "الشفاه", en: "Lips" },
  "jaw-l": { he: "קו לסת שמאל", ar: "خط فك أيسر", en: "Jaw L" },
  "jaw-r": { he: "קו לסת ימין", ar: "خط فك أيمن", en: "Jaw R" },
  "temple-l": { he: "רקה שמאל", ar: "صدغ أيسر", en: "Temple L" },
  "temple-r": { he: "רקה ימין", ar: "صدغ أيمن", en: "Temple R" },
  "masseter-l": { he: "מסהטר שמאל", ar: "ماضغة يسرى", en: "Masseter L" },
  "masseter-r": { he: "מסהטר ימין", ar: "ماضغة يمنى", en: "Masseter R" },
  "tmj-l": { he: "TMJ שמאל", ar: "مفصل فك أيسر", en: "TMJ L" },
  "tmj-r": { he: "TMJ ימין", ar: "مفصل فك أيمن", en: "TMJ R" },
  chin: { he: "סנטר", ar: "الذقن", en: "Chin" },
  neck: { he: "צוואר", ar: "الرقبة", en: "Neck" },
  migraine: { he: "PREEMPT", ar: "PREEMPT", en: "PREEMPT" },
  "axilla-l": { he: "בית שחי שמאל", ar: "إبط أيسر", en: "Axilla L" },
  "axilla-r": { he: "בית שחי ימין", ar: "إبط أيمن", en: "Axilla R" },
  "palm-l": { he: "כף יד שמאל", ar: "راحة يسرى", en: "Palm L" },
  "palm-r": { he: "כף יד ימין", ar: "راحة يمنى", en: "Palm R" },
};

export function zonesForRegion(regionId: string): string[] {
  const ids = faceZones.filter((zone) => zone.regionId === regionId).map((zone) => zone.id);
  return ids.length ? ids : [regionId];
}

export interface InjectionPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface TechniquePath {
  id: string;
  techniqueId: string;
  /** SVG path on 100x100 viewBox */
  path: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const techniquePaths: TechniquePath[] = [
  {
    id: "linear-lips",
    techniqueId: "linear-threading",
    path: "M 38 62 L 62 62",
    start: { x: 62, y: 62 },
    end: { x: 38, y: 62 },
  },
  {
    id: "fan-cheek",
    techniqueId: "fanning",
    path: "M 35 48 L 42 52 M 35 48 L 40 44 M 35 48 L 38 54",
    start: { x: 35, y: 48 },
    end: { x: 42, y: 52 },
  },
  {
    id: "bolus-cheek",
    techniqueId: "bolus",
    path: "M 32 46 L 32 46",
    start: { x: 32, y: 46 },
    end: { x: 32, y: 46 },
  },
  {
    id: "toxin-glabella",
    techniqueId: "toxin-mapping",
    path: "M 46 26 L 46 26 M 50 26 L 50 26 M 54 26 L 54 26",
    start: { x: 50, y: 26 },
    end: { x: 54, y: 26 },
  },
];
