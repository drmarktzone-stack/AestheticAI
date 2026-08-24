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
  { id: "glabella", regionId: "glabella", cx: 0.5, cy: 0.28, rx: 0.08, ry: 0.04, effect: "smooth" },
  { id: "periocular-l", regionId: "periocular", cx: 0.38, cy: 0.34, rx: 0.07, ry: 0.05, effect: "smooth" },
  { id: "periocular-r", regionId: "periocular", cx: 0.62, cy: 0.34, rx: 0.07, ry: 0.05, effect: "smooth" },
  { id: "cheek-l", regionId: "cheeks", cx: 0.32, cy: 0.48, rx: 0.1, ry: 0.08, effect: "volume" },
  { id: "cheek-r", regionId: "cheeks", cx: 0.68, cy: 0.48, rx: 0.1, ry: 0.08, effect: "volume" },
  { id: "lips", regionId: "lips", cx: 0.5, cy: 0.62, rx: 0.12, ry: 0.05, effect: "volume" },
  { id: "jaw-l", regionId: "jawline", cx: 0.28, cy: 0.72, rx: 0.08, ry: 0.06, effect: "contour" },
  { id: "jaw-r", regionId: "jawline", cx: 0.72, cy: 0.72, rx: 0.08, ry: 0.06, effect: "contour" },
  { id: "temple-l", regionId: "temple", cx: 0.22, cy: 0.32, rx: 0.06, ry: 0.08, effect: "volume" },
  { id: "temple-r", regionId: "temple", cx: 0.78, cy: 0.32, rx: 0.06, ry: 0.08, effect: "volume" },
];

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
