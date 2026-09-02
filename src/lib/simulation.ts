import type { FaceZone } from "../data/faceZones";

function applyZoneEffect(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  zone: FaceZone,
  intensity: number,
) {
  const cx = zone.cx * w;
  const cy = zone.cy * h;
  const rx = zone.rx * w;
  const ry = zone.ry * h;

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const strength = intensity / 100;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const dist = dx * dx + dy * dy;
      if (dist > 1) continue;

      const falloff = 1 - dist;
      const i = (y * w + x) * 4;

      if (zone.effect === "volume") {
        const push = strength * falloff * 18;
        data[i] = Math.min(255, data[i]! + push * 0.4);
        data[i + 1] = Math.min(255, data[i + 1]! + push * 0.35);
        data[i + 2] = Math.min(255, data[i + 2]! + push * 0.3);
        if (zone.id === "lips") {
          data[i] = Math.min(255, data[i]! + push * 0.6);
          data[i + 1] = Math.max(0, data[i + 1]! - push * 0.1);
        }
      } else if (zone.effect === "contour") {
        const shade = strength * falloff * 12;
        data[i] = Math.max(0, data[i]! - shade * 0.2);
        data[i + 1] = Math.max(0, data[i + 1]! - shade * 0.15);
        data[i + 2] = Math.max(0, data[i + 2]! - shade * 0.1);
      } else if (zone.effect === "smooth") {
        const blend = strength * falloff * 0.15;
        const avg = (data[i]! + data[i + 1]! + data[i + 2]!) / 3;
        data[i] = data[i]! * (1 - blend) + avg * blend;
        data[i + 1] = data[i + 1]! * (1 - blend) + avg * blend;
        data[i + 2] = data[i + 2]! * (1 - blend) + avg * blend;
      } else if (zone.effect === "lift") {
        const lift = strength * falloff * 14;
        data[i] = Math.min(255, data[i]! + lift * 0.3);
        data[i + 1] = Math.min(255, data[i + 1]! + lift * 0.28);
        data[i + 2] = Math.min(255, data[i + 2]! + lift * 0.25);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function renderSimulatedImage(
  source: HTMLImageElement | HTMLCanvasElement,
  zones: FaceZone[],
  intensity: number,
  maxWidth = 640,
): HTMLCanvasElement {
  const ratio = source instanceof HTMLImageElement ? source.naturalWidth / source.naturalHeight : source.width / source.height;
  const w = Math.min(maxWidth, source instanceof HTMLImageElement ? source.naturalWidth : source.width);
  const h = Math.round(w / ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(source, 0, 0, w, h);

  for (const zone of zones) {
    applyZoneEffect(ctx, w, h, zone, intensity);
  }

  return canvas;
}

export function drawInjectionPoints(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  points: { x: number; y: number }[],
) {
  for (const p of points) {
    const x = p.x * w;
    const y = p.y * h;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(46, 139, 138, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "#f4fffd";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
