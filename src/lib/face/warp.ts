import Delaunator from "delaunator";

import { regionPoly, SIM_REGIONS } from "./regions";
import type { AfterIntent, FaceFrame, RegionPlan, TreatmentKind, Vec2 } from "./types";
import { lm } from "./types";

function delaunayTris(points: Vec2[]): [number, number, number][] {
  const coords = new Float64Array(points.length * 2);
  points.forEach((p, i) => {
    coords[i * 2] = p.x;
    coords[i * 2 + 1] = p.y;
  });
  const del = new Delaunator(coords);
  const out: [number, number, number][] = [];
  for (let i = 0; i < del.triangles.length; i += 3) {
    out.push([del.triangles[i]!, del.triangles[i + 1]!, del.triangles[i + 2]!]);
  }
  return out;
}

function push(p: Vec2, from: Vec2, amount: number): void {
  const dx = p.x - from.x;
  const dy = p.y - from.y;
  const len = Math.hypot(dx, dy) || 1e-6;
  p.x += (dx / len) * amount;
  p.y += (dy / len) * amount;
}

function displace(src: Vec2[], plan: RegionPlan, strength: number): Vec2[] {
  const dst = src.map((p) => ({ x: p.x, y: p.y }));
  const s = strength;
  const midFace = mid3(lm(src, 1), lm(src, 33), lm(src, 263));
  const mouth = mid3(lm(src, 13), lm(src, 14), lm(src, 0));
  const faceW = Math.hypot(lm(src, 234).x - lm(src, 454).x, lm(src, 234).y - lm(src, 454).y) || 0.2;

  const move = (indices: number[], fn: (p: Vec2, i: number) => void) => {
    for (const i of indices) {
      const p = dst[i];
      if (p) fn(p, i);
    }
  };

  if (plan.regionId === "lips") {
    const outer = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 146, 91, 181, 84, 17, 314, 405, 321, 375];
    const upper = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308];
    const lower = [146, 91, 181, 84, 17, 314, 405, 321, 375, 95, 88, 178, 87, 14, 317, 402, 318, 324];
    if (plan.intent === "fuller" || plan.treatment === "filler") {
      move(outer, (p) => push(p, mouth, faceW * 0.12 * s));
      move(upper, (p) => {
        p.y -= faceW * 0.055 * s;
      });
      move(lower, (p) => {
        p.y += faceW * 0.065 * s;
      });
    }
    if (plan.intent === "evert") {
      move(upper, (p) => {
        p.y -= faceW * 0.04 * s;
        p.x += (p.x - mouth.x) * 0.08 * s;
      });
      move([13, 82, 312], (p) => {
        p.y -= faceW * 0.02 * s;
      });
    }
    if (plan.intent === "define") {
      move([61, 291], (p) => push(p, mouth, faceW * 0.02 * s));
      move([0, 17], (p) => push(p, mouth, faceW * 0.03 * s));
    }
  }

  if (plan.regionId === "cheeks") {
    const left = [50, 101, 118, 117, 123, 147, 205, 36, 142];
    const right = [280, 330, 347, 346, 352, 376, 425, 266, 371];
    const dir = plan.intent === "lift" ? -0.045 : 0.02;
    move([...left, ...right], (p) => {
      push(p, midFace, faceW * 0.05 * s);
      p.y += faceW * dir * s;
    });
  }

  if (plan.regionId === "jawline" || plan.regionId === "masseter") {
    const jaw = [172, 136, 150, 149, 176, 148, 377, 400, 378, 379, 365, 397];
    const gonion = [58, 288, 234, 454];
    if (plan.intent === "sharper" || plan.intent === "define") {
      const chin = lm(dst, 152);
      move(jaw, (p) => {
        p.y += faceW * 0.028 * s;
        p.x += (p.x < 0.5 ? -1 : 1) * faceW * 0.04 * s;
        p.y += (chin.y - p.y) * 0.18 * s;
      });
      move(gonion, (p) => {
        p.x += (p.x < 0.5 ? -1 : 1) * faceW * 0.055 * s;
      });
    }
    if (plan.intent === "slimmer" || plan.regionId === "masseter") {
      move([234, 227, 116, 123, 147, 213, 58, 172, 454, 447, 345, 352, 376, 288, 397], (p) => {
        p.x += (0.5 - p.x) * 0.28 * s;
      });
    }
  }

  if (plan.regionId === "chin") {
    move([152, 175, 199, 200, 18, 176, 148, 377, 400], (p) => {
      if (plan.intent === "project") p.y += faceW * 0.03 * s;
      if (plan.intent === "slimmer") p.x += (0.5 - p.x) * 0.2 * s;
      if (plan.intent === "fuller") push(p, midFace, faceW * 0.03 * s);
    });
  }

  if (plan.regionId === "nose") {
    move([1, 4, 5, 197, 6, 19, 94, 2], (p) => {
      p.x += (0.5 - p.x) * 0.12 * s;
      if (plan.intent === "refine") p.y -= faceW * 0.01 * s;
    });
  }

  if (plan.regionId === "temple") {
    move([21, 54, 162, 127, 234, 284, 251, 389, 356, 454], (p) => {
      push(p, midFace, faceW * 0.035 * s);
    });
  }

  if (plan.regionId === "glabella" || plan.intent === "less-frown") {
    move([9, 8, 107, 336, 66, 296], (p) => {
      p.y += faceW * 0.012 * s;
    });
    move([107, 66, 105], (p) => {
      p.x -= faceW * 0.02 * s;
    });
    move([336, 296, 334], (p) => {
      p.x += faceW * 0.02 * s;
    });
  }

  if (plan.regionId === "forehead" || plan.intent === "smoother") {
    move([10, 151, 109, 338, 67, 297], (p) => {
      p.y += faceW * 0.008 * s;
    });
  }

  if (plan.regionId === "periocular") {
    move([33, 133, 263, 362, 159, 386, 145, 374], (p) => {
      p.y += plan.intent === "lift" ? -faceW * 0.012 * s : faceW * 0.004 * s;
    });
  }

  if (plan.regionId === "neck" || plan.intent === "tighter") {
    move([176, 152, 400, 148, 377], (p) => {
      p.y -= faceW * 0.02 * s;
      p.x += (0.5 - p.x) * 0.08 * s;
    });
  }

  if (plan.treatment === "toxin-aesthetic" || plan.treatment === "wrinkles") {
    move([9, 107, 336, 10, 151], (p) => {
      p.y += faceW * 0.006 * s;
    });
  }

  if (plan.treatment === "tightening") {
    for (let i = 0; i < dst.length; i++) {
      const p = dst[i];
      if (!p) continue;
      p.x += (midFace.x - p.x) * 0.03 * s;
      p.y += (midFace.y - p.y) * 0.015 * s;
    }
  }

  return dst;
}

function mid3(a: Vec2, b: Vec2, c: Vec2): Vec2 {
  return { x: (a.x + b.x + c.x) / 3, y: (a.y + b.y + c.y) / 3 };
}

function barycentric(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): [number, number, number] | null {
  const v0x = bx - ax;
  const v0y = by - ay;
  const v1x = cx - ax;
  const v1y = cy - ay;
  const v2x = px - ax;
  const v2y = py - ay;
  const den = v0x * v1y - v1x * v0y;
  if (Math.abs(den) < 1e-12) return null;
  const v = (v2x * v1y - v1x * v2y) / den;
  const w = (v0x * v2y - v2x * v0y) / den;
  const u = 1 - v - w;
  if (u < -0.01 || v < -0.01 || w < -0.01) return null;
  return [u, v, w];
}

function sample(data: Uint8ClampedArray, w: number, h: number, x: number, y: number): [number, number, number, number] {
  const x0 = Math.max(0, Math.min(w - 1, Math.floor(x)));
  const y0 = Math.max(0, Math.min(h - 1, Math.floor(y)));
  const x1 = Math.min(w - 1, x0 + 1);
  const y1 = Math.min(h - 1, y0 + 1);
  const fx = x - x0;
  const fy = y - y0;
  const i00 = (y0 * w + x0) * 4;
  const i10 = (y0 * w + x1) * 4;
  const i01 = (y1 * w + x0) * 4;
  const i11 = (y1 * w + x1) * 4;
  const mix = (a: number, b: number, t: number) => a * (1 - t) + b * t;
  return [0, 1, 2, 3].map((c) =>
    mix(mix(data[i00 + c]!, data[i10 + c]!, fx), mix(data[i01 + c]!, data[i11 + c]!, fx), fy),
  ) as [number, number, number, number];
}

function landmarkShift(from: Vec2, to: Vec2, w: number, h: number): number {
  return Math.hypot((to.x - from.x) * w, (to.y - from.y) * h);
}

function warpMesh(src: ImageData, from: Vec2[], to: Vec2[], w: number, h: number): ImageData {
  const out = new ImageData(w, h);
  out.data.set(src.data);
  const tris = delaunayTris(from);

  for (const [ia, ib, ic] of tris) {
    const da = to[ia];
    const db = to[ib];
    const dc = to[ic];
    const sa = from[ia];
    const sb = from[ib];
    const sc = from[ic];
    if (!da || !db || !dc || !sa || !sb || !sc) continue;
    if (
      landmarkShift(sa, da, w, h) < 0.45 &&
      landmarkShift(sb, db, w, h) < 0.45 &&
      landmarkShift(sc, dc, w, h) < 0.45
    ) {
      continue;
    }
    const ax = da.x * w;
    const ay = da.y * h;
    const bx = db.x * w;
    const by = db.y * h;
    const cx = dc.x * w;
    const cy = dc.y * h;
    const minX = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
    const maxX = Math.min(w - 1, Math.ceil(Math.max(ax, bx, cx)));
    const minY = Math.max(0, Math.floor(Math.min(ay, by, cy)));
    const maxY = Math.min(h - 1, Math.ceil(Math.max(ay, by, cy)));
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const bc = barycentric(x + 0.5, y + 0.5, ax, ay, bx, by, cx, cy);
        if (!bc) continue;
        const [u, v, ww] = bc;
        const sx = (u * sa.x + v * sb.x + ww * sc.x) * w;
        const sy = (u * sa.y + v * sb.y + ww * sc.y) * h;
        const pix = sample(src.data, w, h, sx, sy);
        const i = (y * w + x) * 4;
        out.data[i] = pix[0];
        out.data[i + 1] = pix[1];
        out.data[i + 2] = pix[2];
        out.data[i + 3] = 255;
      }
    }
  }
  return out;
}

function texturePass(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  landmarks: Vec2[],
  plan: RegionPlan,
  strength: number,
) {
  const def = SIM_REGIONS.find((item) => item.id === plan.regionId);
  if (!def) return;
  const poly = regionPoly(landmarks, def);
  const xs = poly.map((p) => p.x * w);
  const ys = poly.map((p) => p.y * h);
  const minX = Math.max(0, Math.floor(Math.min(...xs)));
  const maxX = Math.min(w - 1, Math.ceil(Math.max(...xs)));
  const minY = Math.max(0, Math.floor(Math.min(...ys)));
  const maxY = Math.min(h - 1, Math.ceil(Math.max(...ys)));
  const c = { x: xs.reduce((a, b) => a + b, 0) / xs.length, y: ys.reduce((a, b) => a + b, 0) / ys.length };
  const smooth =
    plan.treatment === "wrinkles" ||
    plan.treatment === "toxin-aesthetic" ||
    plan.intent === "smoother" ||
    plan.intent === "less-frown" ||
    plan.intent === "relax";
  const gloss = plan.regionId === "lips" && (plan.intent === "fuller" || plan.intent === "evert" || plan.treatment === "filler");
  const lift = plan.intent === "fill" || plan.intent === "fuller" || plan.treatment === "filler";

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!pointInScaled(x, y, poly, w, h)) continue;
      const dx = (x - c.x) / (w * 0.2);
      const dy = (y - c.y) / (h * 0.2);
      const fall = Math.max(0, 1 - (dx * dx + dy * dy));
      const i = (y * w + x) * 4;
      if (smooth) {
        const avg = (data[i]! + data[i + 1]! + data[i + 2]!) / 3;
        const t = 0.42 * strength * fall;
        data[i] = data[i]! * (1 - t) + avg * t + 12 * t;
        data[i + 1] = data[i + 1]! * (1 - t) + avg * t + 10 * t;
        data[i + 2] = data[i + 2]! * (1 - t) + avg * t + 9 * t;
      }
      if (gloss) {
        data[i] = Math.min(255, data[i]! + 32 * strength * fall);
        data[i + 1] = Math.min(255, data[i + 1]! + 10 * strength * fall);
        data[i + 2] = Math.max(0, data[i + 2]! - 8 * strength * fall);
      }
      if (lift && plan.regionId !== "lips") {
        data[i] = Math.min(255, data[i]! + 12 * strength * fall);
        data[i + 1] = Math.min(255, data[i + 1]! + 10 * strength * fall);
        data[i + 2] = Math.min(255, data[i + 2]! + 8 * strength * fall);
      }
      if (plan.intent === "sharper" || plan.intent === "slimmer") {
        const edge = Math.abs(Math.sqrt(dx * dx + dy * dy) - 0.65);
        const e = Math.max(0, 1 - edge * 5) * 10 * strength;
        data[i] = Math.max(0, data[i]! - e);
        data[i + 1] = Math.max(0, data[i + 1]! - e * 0.85);
        data[i + 2] = Math.max(0, data[i + 2]! - e * 0.7);
      }
    }
  }
}

function pointInScaled(x: number, y: number, poly: Vec2[], w: number, h: number): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const pi = poly[i];
    const pj = poly[j];
    if (!pi || !pj) continue;
    const yi = pi.y * h;
    const yj = pj.y * h;
    const xi = pi.x * w;
    const xj = pj.x * w;
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || 1e-6) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function renderAfter(frame: FaceFrame, plans: RegionPlan[], strength = 0.92): HTMLCanvasElement {
  const srcW = frame.width;
  const srcH = frame.height;
  const maxW = 420;
  const scale = srcW > maxW ? maxW / srcW : 1;
  const w = Math.max(1, Math.round(srcW * scale));
  const h = Math.max(1, Math.round(srcH * scale));

  const work = document.createElement("canvas");
  work.width = w;
  work.height = h;
  const wctx = work.getContext("2d", { willReadFrequently: true });
  if (!wctx) return frame.image;
  wctx.imageSmoothingQuality = "high";
  wctx.drawImage(frame.image, 0, 0, w, h);
  const src = wctx.getImageData(0, 0, w, h);

  const from = frame.landmarks.map((p) => ({ x: p.x, y: p.y }));
  let to = from;
  for (const plan of plans) {
    to = displace(to, plan, strength);
  }
  const warped = warpMesh(src, from, to, w, h);
  for (const plan of plans) {
    texturePass(warped.data, w, h, to, plan, strength);
  }
  wctx.putImageData(warped, 0, 0);

  const out = document.createElement("canvas");
  out.width = srcW;
  out.height = srcH;
  const octx = out.getContext("2d");
  if (!octx) return frame.image;
  octx.imageSmoothingQuality = "high";
  octx.drawImage(work, 0, 0, srcW, srcH);
  return out;
}

export function defaultIntent(regionId: RegionPlan["regionId"], treatment: TreatmentKind): AfterIntent {
  if (regionId === "lips") return treatment === "filler" ? "fuller" : "define";
  if (regionId === "cheeks") return treatment === "filler" ? "fill" : "lift";
  if (regionId === "jawline") return treatment === "filler" ? "sharper" : "slimmer";
  if (regionId === "chin") return treatment === "filler" ? "project" : "slimmer";
  if (regionId === "nose") return "refine";
  if (regionId === "temple") return "fill";
  if (regionId === "glabella") return "less-frown";
  if (regionId === "forehead" || regionId === "periocular") return "smoother";
  if (regionId === "neck") return "tighter";
  if (regionId === "masseter") return treatment === "toxin-therapeutic" ? "relax" : "slimmer";
  return "refine";
}

export function intentsFor(regionId: RegionPlan["regionId"]): AfterIntent[] {
  switch (regionId) {
    case "lips":
      return ["fuller", "evert", "define"];
    case "cheeks":
      return ["fill", "lift"];
    case "jawline":
      return ["sharper", "slimmer"];
    case "chin":
      return ["project", "slimmer"];
    case "nose":
      return ["refine"];
    case "temple":
      return ["fill"];
    case "glabella":
      return ["less-frown", "smoother"];
    case "forehead":
    case "periocular":
      return ["smoother", "lift"];
    case "neck":
      return ["tighter"];
    case "masseter":
      return ["slimmer", "relax"];
    default:
      return ["refine"];
  }
}
