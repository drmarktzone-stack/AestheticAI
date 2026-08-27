export type Vec2 = { x: number; y: number };

export type FaceFrame = {
  width: number;
  height: number;
  image: HTMLCanvasElement;
  landmarks: Vec2[];
};

export type SimRegionId =
  | "lips"
  | "cheeks"
  | "jawline"
  | "chin"
  | "nose"
  | "temple"
  | "periocular"
  | "forehead"
  | "glabella"
  | "neck"
  | "masseter";

export type TreatmentKind =
  | "filler"
  | "tightening"
  | "wrinkles"
  | "toxin-aesthetic"
  | "toxin-therapeutic";

export type AfterIntent =
  | "fuller"
  | "evert"
  | "define"
  | "lift"
  | "fill"
  | "sharper"
  | "slimmer"
  | "project"
  | "refine"
  | "smoother"
  | "less-frown"
  | "tighter"
  | "relax";

export type RegionPlan = {
  regionId: SimRegionId;
  treatment: TreatmentKind;
  intent: AfterIntent;
};

export const FRAME_W = 960;
export const FRAME_H = 1200;

export function dist(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export function mid(a: Vec2, b: Vec2): Vec2 {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function pointInPoly(x: number, y: number, poly: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const pi = poly[i];
    const pj = poly[j];
    if (!pi || !pj) continue;
    const intersect =
      pi.y > y !== pj.y > y && x < ((pj.x - pi.x) * (y - pi.y)) / (pj.y - pi.y || 1e-6) + pi.x;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function centroid(poly: Vec2[]): Vec2 {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  const n = Math.max(poly.length, 1);
  return { x: x / n, y: y / n };
}

export function lm(landmarks: Vec2[], index: number): Vec2 {
  return landmarks[index] ?? { x: 0.5, y: 0.5 };
}
