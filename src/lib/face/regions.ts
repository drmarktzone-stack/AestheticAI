import { centroid, lm, pointInPoly, type SimRegionId, type Vec2 } from "./types";

export type RegionDef = {
  id: SimRegionId;
  atlasId: string;
  hull: number[];
  extra?: "neck";
};

export const SIM_REGIONS: RegionDef[] = [
  {
    id: "lips",
    atlasId: "lips",
    hull: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146],
  },
  {
    id: "glabella",
    atlasId: "glabella",
    hull: [9, 107, 66, 105, 63, 70, 46, 53, 52, 65, 55, 8, 285, 295, 282, 283, 276, 300, 293, 334, 296, 336],
  },
  {
    id: "forehead",
    atlasId: "forehead",
    hull: [10, 109, 67, 103, 54, 21, 162, 71, 68, 104, 69, 108, 151, 337, 299, 333, 298, 301, 284, 251, 389, 356, 454],
  },
  {
    id: "periocular",
    atlasId: "periocular",
    hull: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 130, 226, 247, 30, 29, 27, 28, 56, 190, 263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466, 359, 446, 467, 260, 259, 257, 258, 286, 414],
  },
  {
    id: "nose",
    atlasId: "nose",
    hull: [168, 193, 245, 188, 174, 236, 134, 220, 45, 4, 1, 19, 94, 2, 98, 327, 326, 97, 275, 440, 344, 278, 439, 241, 237, 44, 274],
  },
  {
    id: "cheeks",
    atlasId: "cheeks",
    hull: [50, 101, 118, 117, 116, 123, 147, 187, 205, 36, 203, 142, 100, 120, 280, 330, 347, 346, 345, 352, 376, 411, 425, 266, 423, 371, 329, 348],
  },
  {
    id: "temple",
    atlasId: "temple",
    hull: [21, 54, 103, 67, 70, 63, 105, 162, 127, 234, 93, 132, 58, 284, 251, 389, 356, 454, 323, 361, 288, 300, 293, 334],
  },
  {
    id: "jawline",
    atlasId: "jawline",
    hull: [58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 435, 361, 401, 323, 454],
  },
  {
    id: "chin",
    atlasId: "chin",
    hull: [175, 199, 208, 32, 140, 176, 148, 152, 377, 400, 378, 262, 428, 200, 18, 17],
  },
  {
    id: "neck",
    atlasId: "neck",
    hull: [176, 149, 150, 136, 172, 152, 377, 400, 378, 379, 365],
    extra: "neck",
  },
  {
    id: "masseter",
    atlasId: "masseter",
    hull: [234, 227, 116, 123, 147, 213, 192, 214, 135, 172, 58, 132, 93, 454, 447, 345, 352, 376, 433, 416, 434, 364, 397, 288, 361, 323],
  },
];

export function regionPoly(landmarks: Vec2[], def: RegionDef): Vec2[] {
  const poly = def.hull.map((index) => lm(landmarks, index));
  if (def.extra === "neck") {
    const chin = lm(landmarks, 152);
    const left = lm(landmarks, 176);
    const right = lm(landmarks, 400);
    const drop = 0.16;
    return [
      left,
      { x: left.x, y: Math.min(0.99, left.y + drop) },
      { x: chin.x, y: Math.min(0.99, chin.y + drop + 0.04) },
      { x: right.x, y: Math.min(0.99, right.y + drop) },
      right,
      chin,
    ];
  }
  return poly;
}

export function hitRegion(landmarks: Vec2[], nx: number, ny: number): SimRegionId | null {
  const hits: { id: SimRegionId; area: number }[] = [];
  for (const def of SIM_REGIONS) {
    const poly = regionPoly(landmarks, def);
    if (poly.length < 3) continue;
    if (pointInPoly(nx, ny, poly)) {
      const c = centroid(poly);
      const area = poly.reduce((sum, p, i) => {
        const q = poly[(i + 1) % poly.length]!;
        return sum + p.x * q.y - q.x * p.y;
      }, 0);
      hits.push({ id: def.id, area: Math.abs(area) + dist2(c, { x: nx, y: ny }) * 0.01 });
    }
  }
  hits.sort((a, b) => a.area - b.area);
  return hits[0]?.id ?? nearestRegion(landmarks, nx, ny);
}

function nearestRegion(landmarks: Vec2[], nx: number, ny: number): SimRegionId | null {
  let best: SimRegionId | null = null;
  let bestD = 0.09;
  for (const def of SIM_REGIONS) {
    const c = centroid(regionPoly(landmarks, def));
    const d = Math.hypot(c.x - nx, c.y - ny);
    if (d < bestD) {
      bestD = d;
      best = def.id;
    }
  }
  return best;
}

function dist2(a: Vec2, b: Vec2): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

export function regionCenter(landmarks: Vec2[], id: SimRegionId): Vec2 {
  const def = SIM_REGIONS.find((item) => item.id === id);
  if (!def) return { x: 0.5, y: 0.5 };
  return centroid(regionPoly(landmarks, def));
}
