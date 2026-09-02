import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(fileURLToPath(new URL("../dist", import.meta.url)));
const host = "0.0.0.0";
const port = Number(process.env.PORT || 8080);
const MAX_BODY = 8 * 1024 * 1024;

const CATALOG_TREATMENT_IDS = new Set([
  "filler-lips-volume",
  "filler-lips-definition",
  "filler-midface",
  "filler-jawline",
  "filler-temples",
  "filler-tear-trough",
  "filler-nasolabial",
  "filler-chin",
  "filler-nose",
  "biostim-skin",
  "toxin-glabella",
  "toxin-forehead",
  "toxin-crows",
  "toxin-masseter-slim",
  "toxin-tmj",
  "toxin-hyperhidrosis-axilla",
  "toxin-hyperhidrosis-palms",
  "toxin-migraine",
  "toxin-cervical-dystonia",
]);

const REGION_ALIASES = {
  lips: "lips",
  lip: "lips",
  midface: "cheeks",
  "mid-face": "cheeks",
  cheeks: "cheeks",
  cheek: "cheeks",
  "cheek-l": "cheeks",
  "cheek-r": "cheeks",
  jaw: "jawline",
  jawline: "jawline",
  "jaw-l": "jawline",
  "jaw-r": "jawline",
  chin: "chin",
  nose: "nose",
  temples: "temple",
  temple: "temple",
  "temple-l": "temple",
  "temple-r": "temple",
  periocular: "periocular",
  crows: "periocular",
  "crows-feet": "periocular",
  "periocular-l": "periocular",
  "periocular-r": "periocular",
  forehead: "forehead",
  glabella: "glabella",
  masseter: "masseter",
  "masseter-l": "masseter",
  "masseter-r": "masseter",
  neck: "neck",
};

const REGION_DEFAULT_TREATMENT = {
  lips: "filler-lips-volume",
  cheeks: "filler-midface",
  jawline: "filler-jawline",
  chin: "filler-chin",
  nose: "filler-nose",
  temple: "filler-temples",
  periocular: "toxin-crows",
  forehead: "toxin-forehead",
  glabella: "toxin-glabella",
  neck: "biostim-skin",
  masseter: "toxin-masseter-slim",
};

const KINDS = new Set(["wrinkle", "fold", "volume-loss", "hypertrophy", "other"]);
const IMAGE_MODELS = ["gemini-3.1-flash-image", "gemini-2.5-flash-image"];

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".task": "application/octet-stream",
  ".txt": "text/plain; charset=utf-8",
  ".wasm": "application/wasm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function vertexConfigured() {
  return Boolean(process.env.GOOGLE_CLOUD_PROJECT);
}

let genaiPromise = null;

async function getGenAI() {
  if (!vertexConfigured()) return null;
  if (!genaiPromise) {
    genaiPromise = import("@google/genai")
      .then(({ GoogleGenAI }) => {
        return new GoogleGenAI({
          vertexai: true,
          project: process.env.GOOGLE_CLOUD_PROJECT,
          location: process.env.GOOGLE_CLOUD_LOCATION || "global",
        });
      })
      .catch((err) => {
        genaiPromise = null;
        throw err;
      });
  }
  return genaiPromise;
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

function readJsonBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error("PAYLOAD_TOO_LARGE"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(Object.assign(new Error("BAD_JSON"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function parseDataUrl(image) {
  if (typeof image !== "string" || !image.startsWith("data:")) return null;
  const match = image.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) return null;
  const mimeType = match[1] === "image/jpg" ? "image/jpeg" : match[1];
  return { mimeType, data: match[2].replace(/\s/g, "") };
}

function normalizeRegionId(raw) {
  if (typeof raw !== "string") return null;
  const key = raw.toLowerCase().trim().replace(/_/g, "-");
  return REGION_ALIASES[key] || null;
}

function snapTreatments(ids, regionId) {
  const list = Array.isArray(ids) ? ids.filter((id) => CATALOG_TREATMENT_IDS.has(id)) : [];
  if (list.length) return [...new Set(list)];
  const fallback = REGION_DEFAULT_TREATMENT[regionId];
  return fallback ? [fallback] : [];
}

function clampSeverity(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 2;
  return Math.max(0, Math.min(4, Math.round(n)));
}

function sanitizeFindings(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  raw.forEach((item, index) => {
    const regionId = normalizeRegionId(item?.regionId);
    if (!regionId) return;
    const kind = KINDS.has(item?.kind) ? item.kind : "other";
    const points = Array.isArray(item?.points)
      ? item.points
          .filter((p) => typeof p?.x === "number" && typeof p?.y === "number")
          .map((p) => ({
            x: Math.max(0, Math.min(1, p.x)),
            y: Math.max(0, Math.min(1, p.y)),
          }))
      : [];
    out.push({
      id: typeof item?.id === "string" && item.id ? item.id : `finding-${regionId}-${index}`,
      regionId,
      kind,
      labelHe: typeof item?.labelHe === "string" ? item.labelHe : regionId,
      labelEn: typeof item?.labelEn === "string" ? item.labelEn : regionId,
      severity: clampSeverity(item?.severity),
      points,
      suggestedTreatmentIds: snapTreatments(item?.suggestedTreatmentIds, regionId),
    });
  });
  return out;
}

function analyzeSchema(Type) {
  const point = {
    type: Type.OBJECT,
    properties: {
      x: { type: Type.NUMBER },
      y: { type: Type.NUMBER },
    },
    required: ["x", "y"],
  };
  return {
    type: Type.OBJECT,
    properties: {
      clinicalNote: { type: Type.STRING },
      findings: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            regionId: { type: Type.STRING },
            kind: { type: Type.STRING, enum: [...KINDS] },
            labelHe: { type: Type.STRING },
            labelEn: { type: Type.STRING },
            severity: { type: Type.INTEGER },
            points: { type: Type.ARRAY, items: point },
            suggestedTreatmentIds: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "id",
            "regionId",
            "kind",
            "labelHe",
            "labelEn",
            "severity",
            "points",
            "suggestedTreatmentIds",
          ],
        },
      },
    },
    required: ["findings", "clinicalNote"],
  };
}

function analyzePrompt(locale) {
  const ids = [...CATALOG_TREATMENT_IDS].join(", ");
  return [
    "You are an educational clinical decision-support assistant for licensed aesthetic physicians.",
    "Analyze this ALIGNED frontal face photograph (canonical frame, normalized 0-1 coordinates).",
    "Detect wrinkles, folds, volume loss, and hypertrophy. Mark them precisely on THIS photo.",
    "regionId MUST be one of: lips, midface, cheeks, jaw, chin, nose, temples, periocular, forehead, glabella, masseter, neck.",
    `suggestedTreatmentIds MUST be a subset of: ${ids}.`,
    "Do NOT invent numeric doses, millilitres, or units. Region choice only — dosing is applied from a protocol catalog.",
    "severity is Merz-like 0-4. points are 4-16 normalized {x,y} along the wrinkle polyline, fold band, or region polygon.",
    "kind is wrinkle | fold | volume-loss | hypertrophy | other.",
    "clinicalNote: short educational note, no guaranteed outcome language.",
    `Respond in JSON. Labels: labelHe Hebrew, labelEn English. Physician locale hint: ${locale}.`,
  ].join(" ");
}

function simulatePrompt(findings, treatmentIds, locale) {
  const regions = findings
    .map((f) => `${f.regionId} (${f.kind}, severity ${f.severity}): ${f.labelEn || f.labelHe}`)
    .join("; ");
  return [
    "Medical photography edit of THIS same patient. Photoreal. Preserve identity, lighting, hair, background, camera, skin tone, and pose.",
    "Edit ONLY the listed regions as described. Do not beautify the whole face. No makeup, no identity change, no extra people, no text, no watermarks.",
    "Toxin / wrinkle regions (glabella, crow's feet, forehead): smoother dynamic lines, same person.",
    "Volume regions (midface, lips, chin, jaw, temples): subtle educational volume as planned, not overfill.",
    `Planned regions: ${regions || "none"}. Treatment ids (catalog): ${treatmentIds.join(", ") || "none"}.`,
    "Educational clinical illustration — not a guaranteed clinical result.",
    `Locale hint: ${locale}.`,
  ].join(" ");
}

function errorCode(err) {
  const msg = String(err?.message || err || "");
  return msg.slice(0, 180);
}

function isFaceBlock(err, response) {
  const reason = String(response?.candidates?.[0]?.finishReason || "");
  const msg = String(err?.message || err || "").toLowerCase();
  if (/SAFETY|IMAGE_SAFETY|PROHIBITED|BLOCK/i.test(reason)) return true;
  if (msg.includes("safety") || msg.includes("blocked") || msg.includes("prohibited")) return true;
  if (msg.includes("image") && (msg.includes("person") || msg.includes("face") || msg.includes("policy"))) return true;
  return false;
}

function firstImageDataUrl(response) {
  const parts = response?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    const inline = part.inlineData || part.inline_data;
    if (inline?.data) {
      const mime = inline.mimeType || inline.mime_type || "image/png";
      return `data:${mime};base64,${inline.data}`;
    }
  }
  return null;
}

async function handleAnalyze(req, res) {
  if (!vertexConfigured()) {
    sendJson(res, 503, { error: "Vertex unavailable", code: "VERTEX_UNAVAILABLE" });
    return;
  }
  let body;
  try {
    body = await readJsonBody(req, MAX_BODY);
  } catch (err) {
    sendJson(res, err.status || 400, { error: "Bad request", code: "BAD_REQUEST" });
    return;
  }
  const parsed = parseDataUrl(body.image);
  if (!parsed) {
    sendJson(res, 400, { error: "image data URL required", code: "BAD_REQUEST" });
    return;
  }
  const locale = body.locale === "ar" || body.locale === "en" ? body.locale : "he";
  try {
    const ai = await getGenAI();
    if (!ai) {
      sendJson(res, 503, { error: "Vertex unavailable", code: "VERTEX_UNAVAILABLE" });
      return;
    }
    const { Type } = await import("@google/genai");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: analyzePrompt(locale) },
            { inlineData: { mimeType: parsed.mimeType, data: parsed.data } },
          ],
        },
      ],
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: analyzeSchema(Type),
      },
    });
    const text = response.text || "{}";
    let parsedJson = {};
    try {
      parsedJson = JSON.parse(text);
    } catch {
      parsedJson = {};
    }
    sendJson(res, 200, {
      findings: sanitizeFindings(parsedJson.findings),
      clinicalNote: typeof parsedJson.clinicalNote === "string" ? parsedJson.clinicalNote : "",
    });
  } catch (err) {
    console.error("analyze failed", errorCode(err));
    sendJson(res, 503, { error: "Vertex unavailable", code: "VERTEX_UNAVAILABLE" });
  }
}

async function handleSimulate(req, res) {
  if (!vertexConfigured()) {
    sendJson(res, 503, { error: "Vertex unavailable", code: "VERTEX_UNAVAILABLE" });
    return;
  }
  let body;
  try {
    body = await readJsonBody(req, MAX_BODY);
  } catch (err) {
    sendJson(res, err.status || 400, { error: "Bad request", code: "BAD_REQUEST" });
    return;
  }
  const parsed = parseDataUrl(body.image);
  if (!parsed) {
    sendJson(res, 400, { error: "image data URL required", code: "BAD_REQUEST" });
    return;
  }
  const locale = body.locale === "ar" || body.locale === "en" ? body.locale : "he";
  const findings = sanitizeFindings(body.findings);
  const treatmentIds = snapTreatments(body.treatmentIds, findings[0]?.regionId);
  let lastBlock = false;
  try {
    const ai = await getGenAI();
    if (!ai) {
      sendJson(res, 503, { error: "Vertex unavailable", code: "VERTEX_UNAVAILABLE" });
      return;
    }
    for (const model of IMAGE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [
                { text: simulatePrompt(findings, treatmentIds, locale) },
                { inlineData: { mimeType: parsed.mimeType, data: parsed.data } },
              ],
            },
          ],
          config: {
            temperature: 0.2,
            responseModalities: ["TEXT", "IMAGE"],
          },
        });
        if (isFaceBlock(null, response)) {
          lastBlock = true;
          continue;
        }
        const after = firstImageDataUrl(response);
        if (after) {
          sendJson(res, 200, { after });
          return;
        }
        lastBlock = true;
      } catch (err) {
        if (isFaceBlock(err)) {
          lastBlock = true;
          continue;
        }
        const msg = String(err?.message || "");
        if (/NOT_FOUND|404|not found/i.test(msg)) continue;
        console.error("simulate failed", errorCode(err));
        lastBlock = lastBlock || isFaceBlock(err);
      }
    }
    if (lastBlock) {
      sendJson(res, 422, { error: "Photoreal face edit blocked", code: "FACE_EDIT_BLOCKED" });
      return;
    }
    sendJson(res, 503, { error: "Vertex unavailable", code: "VERTEX_UNAVAILABLE" });
  } catch (err) {
    console.error("simulate failed", errorCode(err));
    if (isFaceBlock(err)) {
      sendJson(res, 422, { error: "Photoreal face edit blocked", code: "FACE_EDIT_BLOCKED" });
      return;
    }
    sendJson(res, 503, { error: "Vertex unavailable", code: "VERTEX_UNAVAILABLE" });
  }
}

function insideDist(filePath) {
  const resolved = resolve(filePath);
  return resolved === dist || resolved.startsWith(dist + sep);
}

function requestedFile(urlPath) {
  const raw = decodeURIComponent((urlPath || "/").split("?")[0] || "/");
  const relative = raw === "/" ? "index.html" : raw.replace(/^\/+/, "");
  return normalize(join(dist, relative));
}

async function existingFile(filePath) {
  if (!insideDist(filePath)) return null;
  try {
    const info = await stat(filePath);
    if (info.isFile()) return filePath;
    if (info.isDirectory()) {
      const index = join(filePath, "index.html");
      if (insideDist(index) && (await stat(index)).isFile()) return index;
    }
  } catch {
    return null;
  }
  return null;
}

async function handleStatic(req, res) {
  const filePath = requestedFile(req.url || "/");
  const found = (await existingFile(filePath)) ?? (await existingFile(join(dist, "index.html")));
  if (!found) {
    sendText(res, 404, "Not found");
    return;
  }
  const body = await readFile(found);
  res.writeHead(200, {
    "Content-Type": types[extname(found)] || "application/octet-stream",
    "Cache-Control": found.endsWith("index.html") ? "no-store" : "public, max-age=31536000, immutable",
  });
  res.end(body);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const path = url.pathname;

  try {
    if (path === "/api/health" && req.method === "GET") {
      sendJson(res, 200, { ok: true, vertex: vertexConfigured() });
      return;
    }
    if (path === "/api/analyze" && req.method === "POST") {
      await handleAnalyze(req, res);
      return;
    }
    if (path === "/api/simulate" && req.method === "POST") {
      await handleSimulate(req, res);
      return;
    }
    if (path.startsWith("/api/")) {
      sendJson(res, 404, { error: "Not found", code: "NOT_FOUND" });
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      sendText(res, 405, "Method not allowed");
      return;
    }
    await handleStatic(req, res);
  } catch (err) {
    console.error("request failed", errorCode(err));
    if (!res.headersSent) sendText(res, 500, "Server error");
  }
});

server.headersTimeout = 120000;
server.requestTimeout = 120000;
server.timeout = 120000;

server.listen(port, host, () => {
  console.log(`AestheticAI listening on http://${host}:${port}`);
});
