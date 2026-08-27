import { detectFace } from "./detect";
import { FRAME_H, FRAME_W, dist, lm, type FaceFrame, type Vec2 } from "./types";

const L_EYE = 33;
const R_EYE = 263;
const CHIN = 152;

function affineFromThree(src: [Vec2, Vec2, Vec2], dst: [Vec2, Vec2, Vec2]): [number, number, number, number, number, number] {
  const [s0, s1, s2] = src;
  const [d0, d1, d2] = dst;
  const A = [
    [s0.x, s0.y, 1, 0, 0, 0],
    [0, 0, 0, s0.x, s0.y, 1],
    [s1.x, s1.y, 1, 0, 0, 0],
    [0, 0, 0, s1.x, s1.y, 1],
    [s2.x, s2.y, 1, 0, 0, 0],
    [0, 0, 0, s2.x, s2.y, 1],
  ];
  const b = [d0.x, d0.y, d1.x, d1.y, d2.x, d2.y];
  const x = solve6(A, b);
  return [x[0]!, x[1]!, x[2]!, x[3]!, x[4]!, x[5]!];
}

function solve6(A: number[][], b: number[]): number[] {
  const M = A.map((row, i) => [...row, b[i]!]);
  const n = 6;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r]![col]!) > Math.abs(M[pivot]![col]!)) pivot = r;
    }
    const tmp = M[col]!;
    M[col] = M[pivot]!;
    M[pivot] = tmp;
    const div = M[col]![col] || 1e-12;
    for (let c = col; c <= n; c++) M[col]![c]! /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r]![col]!;
      for (let c = col; c <= n; c++) M[r]![c]! -= f * M[col]![c]!;
    }
  }
  return M.map((row) => row[n]!);
}

function applyAffine(m: [number, number, number, number, number, number], p: Vec2): Vec2 {
  return {
    x: m[0] * p.x + m[1] * p.y + m[2],
    y: m[3] * p.x + m[4] * p.y + m[5],
  };
}

export async function alignFace(source: HTMLImageElement | ImageBitmap | HTMLCanvasElement): Promise<FaceFrame | null> {
  const probe = document.createElement("canvas");
  const maxSide = 1400;
  const sw =
    "naturalWidth" in source && source.naturalWidth
      ? source.naturalWidth
      : source.width;
  const sh =
    "naturalHeight" in source && source.naturalHeight
      ? source.naturalHeight
      : source.height;
  const scale = Math.min(1, maxSide / Math.max(sw, sh));
  probe.width = Math.max(1, Math.round(sw * scale));
  probe.height = Math.max(1, Math.round(sh * scale));
  const pctx = probe.getContext("2d");
  if (!pctx) return null;
  pctx.drawImage(source, 0, 0, probe.width, probe.height);

  const detected = await detectFace(probe);
  if (!detected) return null;

  const left = lm(detected, L_EYE);
  const right = lm(detected, R_EYE);
  const chin = lm(detected, CHIN);
  if (dist(left, right) < 0.04) return null;

  const src: [Vec2, Vec2, Vec2] = [
    { x: left.x * probe.width, y: left.y * probe.height },
    { x: right.x * probe.width, y: right.y * probe.height },
    { x: chin.x * probe.width, y: chin.y * probe.height },
  ];
  const dst: [Vec2, Vec2, Vec2] = [
    { x: FRAME_W * 0.34, y: FRAME_H * 0.38 },
    { x: FRAME_W * 0.66, y: FRAME_H * 0.38 },
    { x: FRAME_W * 0.5, y: FRAME_H * 0.84 },
  ];
  const m = affineFromThree(src, dst);

  const frame = document.createElement("canvas");
  frame.width = FRAME_W;
  frame.height = FRAME_H;
  const ctx = frame.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#111115";
  ctx.fillRect(0, 0, FRAME_W, FRAME_H);
  ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(probe, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const aligned = await detectFace(frame);
  if (!aligned) return null;

  return { width: FRAME_W, height: FRAME_H, image: frame, landmarks: aligned };
}

export function transformPoint(m: [number, number, number, number, number, number], p: Vec2): Vec2 {
  return applyAffine(m, p);
}
