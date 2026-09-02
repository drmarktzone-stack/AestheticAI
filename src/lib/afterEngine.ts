import type { FaceZone } from "../data/faceZones";
import { faceZones } from "../data/faceZones";
import { getTreatment } from "../data/clinical/treatmentCatalog";

export type AfterEngineInput = {
  source: HTMLImageElement | HTMLCanvasElement;
  treatmentIds: string[];
  zoneIds: string[];
  /** 0–100 global strength */
  strength?: number;
  maxWidth?: number;
};

/**
 * AestheticAI after engine — on-device educational preview.
 * Pixel smoothing and subtle volume only. Never a Delaunay / triangle-mesh warp.
 * Educational simulation; not a guaranteed clinical outcome.
 */
export async function generateAfterPreview(input: AfterEngineInput): Promise<HTMLCanvasElement> {
  const strength = input.strength ?? 84;
  const maxWidth = input.maxWidth ?? 960;
  const src = input.source;
  const srcW =
    "naturalWidth" in src && src.naturalWidth ? src.naturalWidth : src.width;
  const srcH =
    "naturalHeight" in src && src.naturalHeight ? src.naturalHeight : src.height;
  const ratio = srcW / Math.max(srcH, 1);
  const w = Math.min(maxWidth, srcW || maxWidth);
  const h = Math.max(1, Math.round(w / ratio));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(src, 0, 0, w, h);

  const treatments = input.treatmentIds.map((id) => getTreatment(id)).filter(Boolean);
  const zoneSet = new Set(
    input.zoneIds.length ? input.zoneIds : treatments.flatMap((t) => t!.zoneIds),
  );
  const zones = faceZones.filter((z) => zoneSet.has(z.id));
  const extra = extraFoldZones(input.treatmentIds);
  const allZones = [...zones, ...extra];
  const zonesFor = (treatmentId: string, zoneIds: string[]) =>
    allZones.filter((z) => zoneIds.includes(z.id) || (treatmentId === "filler-nasolabial" && z.id.startsWith("nlf")));

  for (const t of treatments) {
    if (!t) continue;
    if (t.family !== "filler") continue;
    const localZones = zonesFor(t.id, t.zoneIds);
    const intensity = (t.previewIntensity / 100) * (strength / 100);
    if (t.effect === "volume" || t.effect === "contour") {
      plumpVolume(ctx, w, h, localZones, intensity * (t.effect === "volume" ? 0.55 : 0.35));
    }
  }

  const imageData = ctx.getImageData(0, 0, w, h);
  const blur = boxBlurRgba(imageData.data, w, h, 5);
  boxBlurRgbaInPlace(blur, w, h, 3);

  for (const t of treatments) {
    if (!t) continue;
    const localZones = zonesFor(t.id, t.zoneIds);
    const intensity = (t.previewIntensity / 100) * (strength / 100);
    const flatten =
      t.family.startsWith("toxin") ||
      t.effect === "smooth" ||
      t.id.includes("nasolabial") ||
      t.id.includes("crows") ||
      t.id.includes("glabella") ||
      t.id.includes("forehead");
    for (const zone of localZones) {
      if (flatten) flattenWrinkles(imageData.data, blur, w, h, zone, intensity);
      else if (t.family === "filler" || t.family === "biostim") {
        highlightFill(imageData.data, w, h, zone, intensity);
      } else if (t.effect === "lift") {
        flattenWrinkles(imageData.data, blur, w, h, zone, intensity * 0.7);
        highlightFill(imageData.data, w, h, zone, intensity * 0.45);
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);

  finishPass(ctx, w, h, strength / 100);
  return canvas;
}

function extraFoldZones(treatmentIds: string[]): FaceZone[] {
  if (!treatmentIds.includes("filler-nasolabial")) return [];
  return [
    { id: "nlf-l", regionId: "cheeks", cx: 0.38, cy: 0.56, rx: 0.055, ry: 0.1, effect: "smooth" },
    { id: "nlf-r", regionId: "cheeks", cx: 0.62, cy: 0.56, rx: 0.055, ry: 0.1, effect: "smooth" },
  ];
}

function zoneRadii(zone: FaceZone, w: number, h: number): { cx: number; cy: number; rx: number; ry: number } {
  const expand =
    zone.regionId === "forehead" || zone.id === "forehead"
      ? { x: 1.7, y: 2.05 }
      : zone.regionId === "glabella" || zone.id === "glabella"
        ? { x: 1.85, y: 2.1 }
        : zone.regionId === "periocular"
          ? { x: 1.45, y: 1.35 }
          : zone.regionId === "cheeks" || zone.id.startsWith("nlf")
            ? { x: 1.25, y: 1.4 }
            : { x: 1.15, y: 1.15 };
  return {
    cx: zone.cx * w,
    cy: zone.cy * h,
    rx: zone.rx * w * expand.x,
    ry: zone.ry * h * expand.y,
  };
}

function plumpVolume(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  zones: FaceZone[],
  intensity: number,
) {
  if (!zones.length || intensity <= 0.02) return;
  const src = ctx.getImageData(0, 0, w, h);
  const out = ctx.createImageData(w, h);
  out.data.set(src.data);
  for (const zone of zones) {
    if (zone.effect === "smooth") continue;
    const { cx, cy, rx, ry } = zoneRadii(zone, w, h);
    const push = intensity * (zone.effect === "volume" ? 7 : 4);
    const x0 = Math.max(0, Math.floor(cx - rx));
    const x1 = Math.min(w - 1, Math.ceil(cx + rx));
    const y0 = Math.max(0, Math.floor(cy - ry));
    const y1 = Math.min(h - 1, Math.ceil(cy + ry));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        const dist = dx * dx + dy * dy;
        if (dist > 1) continue;
        const falloff = Math.pow(1 - dist, 1.5);
        const sample = bilinear(src.data, w, h, x - dx * push * falloff, y - dy * push * falloff * 0.8);
        const i = (y * w + x) * 4;
        out.data[i] = sample[0]!;
        out.data[i + 1] = sample[1]!;
        out.data[i + 2] = sample[2]!;
        out.data[i + 3] = sample[3]!;
      }
    }
  }
  ctx.putImageData(out, 0, 0);
}

function flattenWrinkles(
  data: Uint8ClampedArray,
  blur: Uint8ClampedArray,
  w: number,
  h: number,
  zone: FaceZone,
  intensity: number,
) {
  const { cx, cy, rx, ry } = zoneRadii(zone, w, h);
  const x0 = Math.max(0, Math.floor(cx - rx));
  const x1 = Math.min(w - 1, Math.ceil(cx + rx));
  const y0 = Math.max(0, Math.floor(cy - ry));
  const y1 = Math.min(h - 1, Math.ceil(cy + ry));
  const mixCap = 0.86;

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const dist = dx * dx + dy * dy;
      if (dist > 1) continue;
      const falloff = Math.pow(1 - dist, 1.05);
      const mix = Math.min(mixCap, intensity * falloff * 0.92);
      const i = (y * w + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const br = blur[i]!;
      const bg = blur[i + 1]!;
      const bb = blur[i + 2]!;
      let nr = r * (1 - mix) + br * mix;
      let ng = g * (1 - mix) + bg * mix;
      let nb = b * (1 - mix) + bb * mix;
      const origL = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const blurL = br * 0.2126 + bg * 0.7152 + bb * 0.0722;
      if (origL < blurL - 3) {
        const lift = (blurL - origL) * mix * 0.7;
        nr = Math.min(255, nr + lift);
        ng = Math.min(255, ng + lift * 0.96);
        nb = Math.min(255, nb + lift * 0.92);
      }
      data[i] = nr;
      data[i + 1] = ng;
      data[i + 2] = nb;
    }
  }
}

function highlightFill(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  zone: FaceZone,
  intensity: number,
) {
  const { cx, cy, rx, ry } = zoneRadii(zone, w, h);
  const x0 = Math.max(0, Math.floor(cx - rx));
  const x1 = Math.min(w - 1, Math.ceil(cx + rx));
  const y0 = Math.max(0, Math.floor(cy - ry));
  const y1 = Math.min(h - 1, Math.ceil(cy + ry));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const dist = dx * dx + dy * dy;
      if (dist > 1) continue;
      const falloff = Math.pow(1 - dist, 1.6);
      const lift = intensity * falloff * 14;
      const i = (y * w + x) * 4;
      data[i] = Math.min(255, data[i]! + lift * 0.5);
      data[i + 1] = Math.min(255, data[i + 1]! + lift * 0.4);
      data[i + 2] = Math.min(255, data[i + 2]! + lift * 0.32);
    }
  }
}

function boxBlurRgba(src: Uint8ClampedArray, w: number, h: number, radius: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(src);
  boxBlurRgbaInPlace(out, w, h, radius);
  return out;
}

function boxBlurRgbaInPlace(data: Uint8ClampedArray, w: number, h: number, radius: number) {
  if (radius < 1) return;
  const tmp = new Uint8ClampedArray(data.length);
  blurAxis(data, tmp, w, h, radius, true);
  blurAxis(tmp, data, w, h, radius, false);
}

function blurAxis(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  w: number,
  h: number,
  radius: number,
  horizontal: boolean,
) {
  const n = radius * 2 + 1;
  if (horizontal) {
    for (let y = 0; y < h; y++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let k = -radius; k <= radius; k++) {
        const x = clamp(k, 0, w - 1);
        const i = (y * w + x) * 4;
        r += src[i]!;
        g += src[i + 1]!;
        b += src[i + 2]!;
      }
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        dst[i] = r / n;
        dst[i + 1] = g / n;
        dst[i + 2] = b / n;
        dst[i + 3] = 255;
        const iOut = (y * w + clamp(x - radius, 0, w - 1)) * 4;
        const iIn = (y * w + clamp(x + radius + 1, 0, w - 1)) * 4;
        r += src[iIn]! - src[iOut]!;
        g += src[iIn + 1]! - src[iOut + 1]!;
        b += src[iIn + 2]! - src[iOut + 2]!;
      }
    }
    return;
  }
  for (let x = 0; x < w; x++) {
    let r = 0;
    let g = 0;
    let b = 0;
    for (let k = -radius; k <= radius; k++) {
      const y = clamp(k, 0, h - 1);
      const i = (y * w + x) * 4;
      r += src[i]!;
      g += src[i + 1]!;
      b += src[i + 2]!;
    }
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * 4;
      dst[i] = r / n;
      dst[i + 1] = g / n;
      dst[i + 2] = b / n;
      dst[i + 3] = 255;
      const iOut = (clamp(y - radius, 0, h - 1) * w + x) * 4;
      const iIn = (clamp(y + radius + 1, 0, h - 1) * w + x) * 4;
      r += src[iIn]! - src[iOut]!;
      g += src[iIn + 1]! - src[iOut + 1]!;
      b += src[iIn + 2]! - src[iOut + 2]!;
    }
  }
}

function bilinear(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x: number,
  y: number,
): [number, number, number, number] {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(w - 1, x0 + 1);
  const y1 = Math.min(h - 1, y0 + 1);
  const fx = x - x0;
  const fy = y - y0;
  const i00 = (clamp(y0, 0, h - 1) * w + clamp(x0, 0, w - 1)) * 4;
  const i10 = (clamp(y0, 0, h - 1) * w + x1) * 4;
  const i01 = (y1 * w + clamp(x0, 0, w - 1)) * 4;
  const i11 = (y1 * w + x1) * 4;
  const mix = (a: number, b: number, t: number) => a * (1 - t) + b * t;
  return [0, 1, 2, 3].map((c) =>
    mix(mix(data[i00 + c]!, data[i10 + c]!, fx), mix(data[i01 + c]!, data[i11 + c]!, fx), fy),
  ) as [number, number, number, number];
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function finishPass(ctx: CanvasRenderingContext2D, w: number, h: number, s: number) {
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  ctx.fillStyle = `rgba(255, 250, 244, ${0.05 * s})`;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
