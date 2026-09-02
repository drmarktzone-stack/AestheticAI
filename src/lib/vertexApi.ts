import { sanitizeFinding } from "./clinicalScan";
import type { Locale } from "../i18n/types";
import type { AnalyzePayload, ScanFinding, VertexHealth } from "./scanTypes";

export type VertexErrorCode = "VERTEX_UNAVAILABLE" | "FACE_EDIT_BLOCKED" | "BAD_REQUEST" | "NETWORK";

type AnalyzeOk = { ok: true; data: AnalyzePayload };
type AnalyzeFail = { ok: false; code: VertexErrorCode };
type SimulateOk = { ok: true; after: string };
type SimulateFail = { ok: false; code: VertexErrorCode };

const HEALTH_TIMEOUT_MS = 2500;

function apiUrl(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

async function readJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function codeFromBody(body: Record<string, unknown>, fallback: VertexErrorCode): VertexErrorCode {
  const code = body.code;
  if (code === "VERTEX_UNAVAILABLE" || code === "FACE_EDIT_BLOCKED" || code === "BAD_REQUEST") return code;
  return fallback;
}

export async function fetchVertexHealth(): Promise<VertexHealth> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), HEALTH_TIMEOUT_MS);
  try {
    const res = await fetch(apiUrl("/api/health"), { method: "GET", signal: ctrl.signal });
    if (!res.ok) return { ok: false, vertex: false };
    const body = await readJson(res);
    return { ok: body.ok === true, vertex: body.vertex === true };
  } catch {
    return { ok: false, vertex: false };
  } finally {
    window.clearTimeout(timer);
  }
}

export async function analyzeFace(input: {
  image: string;
  locale: Locale;
}): Promise<AnalyzeOk | AnalyzeFail> {
  try {
    const res = await fetch(apiUrl("/api/analyze"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: input.image, locale: input.locale }),
    });
    const body = await readJson(res);
    if (res.status === 503) return { ok: false, code: "VERTEX_UNAVAILABLE" };
    if (!res.ok) return { ok: false, code: codeFromBody(body, "VERTEX_UNAVAILABLE") };
    const findings = Array.isArray(body.findings)
      ? body.findings
          .map((item, index) => sanitizeFinding(item as Partial<ScanFinding>, index))
          .filter((item): item is ScanFinding => Boolean(item))
      : [];
    if (!findings.length) return { ok: false, code: "VERTEX_UNAVAILABLE" };
    return {
      ok: true,
      data: {
        findings: findings.map((item) => ({ ...item, enabled: item.enabled !== false })),
        clinicalNote: typeof body.clinicalNote === "string" ? body.clinicalNote : "",
        source: "vertex",
      },
    };
  } catch {
    return { ok: false, code: "NETWORK" };
  }
}

export async function simulateAfter(input: {
  image: string;
  findings: ScanFinding[];
  treatmentIds: string[];
  locale: Locale;
}): Promise<SimulateOk | SimulateFail> {
  try {
    const res = await fetch(apiUrl("/api/simulate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: input.image,
        findings: input.findings.map((finding) => ({
          id: finding.id,
          regionId: finding.regionId,
          kind: finding.kind,
          labelHe: finding.labelHe,
          labelEn: finding.labelEn,
          labelAr: finding.labelAr,
          severity: finding.severity,
          points: finding.points,
          suggestedTreatmentIds: finding.suggestedTreatmentIds,
        })),
        treatmentIds: input.treatmentIds,
        locale: input.locale,
      }),
    });
    const body = await readJson(res);
    if (res.status === 422) return { ok: false, code: "FACE_EDIT_BLOCKED" };
    if (res.status === 503) return { ok: false, code: "VERTEX_UNAVAILABLE" };
    if (!res.ok) return { ok: false, code: codeFromBody(body, "FACE_EDIT_BLOCKED") };
    const after = body.after;
    if (typeof after !== "string" || !after.startsWith("data:image/")) {
      return { ok: false, code: "FACE_EDIT_BLOCKED" };
    }
    return { ok: true, after };
  } catch {
    return { ok: false, code: "NETWORK" };
  }
}
