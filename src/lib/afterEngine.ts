import type { FaceZone } from "../data/faceZones";
import { faceZones } from "../data/faceZones";
import { getTreatment } from "../data/clinical/treatmentCatalog";

export type AfterEngineInput = {
  source: HTMLImageElement;
  treatmentIds: string[];
  zoneIds: string[];
  /** 0–100 global strength */
  strength?: number;
  maxWidth?: number;
};

/**
 * Protokol After Engine — on-device clinical preview morph.
 * Educational simulation only; not a guaranteed clinical outcome.
 * Uses multi-pass warp + tone + soft focus tailored by treatment family.
 */
export async function generateAfterPreview(input: AfterEngineInput): Promise<HTMLCanvasElement> {
  const strength = input.strength ?? 62;
  const maxWidth = input.maxWidth ?? 900;
  const src = input.source;
  const ratio = src.naturalWidth / Math.max(src.naturalHeight, 1);
  const w = Math.min(maxWidth, src.naturalWidth || maxWidth);
  const h = Math.round(w / ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(src, 0, 0, w, h);

  const treatments = input.treatmentIds.map((id) => getTreatment(id)).filter(Boolean);
  const zoneSet = new Set(
    input.zoneIds.length
      ? input.zoneIds
      : treatments.flatMap((t) => t!.zoneIds),
  );
  const zones = faceZones.filter((z) => zoneSet.has(z.id));

  // Pass 1: displacement warp for volume / contour treatments
  for (const t of treatments) {
    if (!t) continue;
    const localZones = zones.filter((z) => t.zoneIds.includes(z.id));
    const intensity = (t.previewIntensity / 100) * (strength / 100);
    if (t.family === "filler" || t.family === "biostim") {
      warpVolume(ctx, w, h, localZones, intensity * (t.effect === "volume" ? 1 : 0.7));
    }
  }

  // Pass 2: pixel tone / smooth for toxin & polish
  const imageData = ctx.getImageData(0, 0, w, h);
  for (const t of treatments) {
    if (!t) continue;
    const localZones = zones.filter((z) => t.zoneIds.includes(z.id));
    const intensity = (t.previewIntensity / 100) * (strength / 100) * 100;
    for (const zone of localZones) {
      toneZone(imageData.data, w, h, zone, intensity, t.effect, t.family);
    }
  }
  ctx.putImageData(imageData, 0, 0);

  // Pass 3: subtle clinical finish (clarity + warmth)
  finishPass(ctx, w, h, strength / 100);

  return canvas;
}

function warpVolume(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  zones: FaceZone[],
  intensity: number,
) {
  if (!zones.length || intensity <= 0.01) return;
  const src = ctx.getImageData(0, 0, w, h);
  const out = ctx.createImageData(w, h);
  out.data.set(src.data);

  for (const zone of zones) {
    const cx = zone.cx * w;
    const cy = zone.cy * h;
    const rx = zone.rx * w * 1.15;
    const ry = zone.ry * h * 1.15;
    const push = intensity * (zone.effect === "volume" ? 14 : 9);

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
        const falloff = Math.pow(1 - dist, 1.35);
        // Sample from slightly inward → outward plump illusion
        const sx = x - dx * push * falloff;
        const sy = y - dy * push * falloff * 0.85;
        const sample = bilinear(src.data, w, h, sx, sy);
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

function toneZone(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  zone: FaceZone,
  intensity: number,
  effect: FaceZone["effect"],
  family: string,
) {
  const cx = zone.cx * w;
  const cy = zone.cy * h;
  const rx = zone.rx * w;
  const ry = zone.ry * h;
  const strength = intensity / 100;
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
      const falloff = 1 - dist;
      const i = (y * w + x) * 4;

      if (effect === "volume" || family === "filler") {
        const push = strength * falloff * 22;
        data[i] = Math.min(255, data[i]! + push * 0.55);
        data[i + 1] = Math.min(255, data[i + 1]! + push * 0.4);
        data[i + 2] = Math.min(255, data[i + 2]! + push * 0.32);
        if (zone.id === "lips") {
          data[i] = Math.min(255, data[i]! + push * 0.45);
          data[i + 1] = Math.max(0, data[i + 1]! - push * 0.08);
        }
      } else if (effect === "smooth" || family.startsWith("toxin")) {
        const blend = strength * falloff * 0.28;
        const avg = (data[i]! + data[i + 1]! + data[i + 2]!) / 3;
        data[i] = data[i]! * (1 - blend) + avg * blend + strength * falloff * 6;
        data[i + 1] = data[i + 1]! * (1 - blend) + avg * blend + strength * falloff * 5;
        data[i + 2] = data[i + 2]! * (1 - blend) + avg * blend + strength * falloff * 4;
      } else if (effect === "contour") {
        const shade = strength * falloff * 16;
        // Edge darken + center lift = sharper contour
        const edge = Math.abs(Math.sqrt(dist) - 0.65);
        const edgeW = Math.max(0, 1 - edge * 4);
        data[i] = Math.max(0, data[i]! - shade * edgeW * 0.35 + shade * (1 - edgeW) * 0.2);
        data[i + 1] = Math.max(0, data[i + 1]! - shade * edgeW * 0.28 + shade * (1 - edgeW) * 0.18);
        data[i + 2] = Math.max(0, data[i + 2]! - shade * edgeW * 0.22 + shade * (1 - edgeW) * 0.15);
      } else if (effect === "lift") {
        const lift = strength * falloff * 12;
        data[i] = Math.min(255, data[i]! + lift * 0.35);
        data[i + 1] = Math.min(255, data[i + 1]! + lift * 0.32);
        data[i + 2] = Math.min(255, data[i + 2]! + lift * 0.28);
      }
    }
  }
}

function finishPass(ctx: CanvasRenderingContext2D, w: number, h: number, s: number) {
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  ctx.fillStyle = `rgba(255, 248, 240, ${0.08 * s})`;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
