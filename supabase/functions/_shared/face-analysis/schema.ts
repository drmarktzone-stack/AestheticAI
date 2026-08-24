import { z } from "zod";

export const AnalysisLocaleSchema = z.enum(["en", "he", "ar"]);
export type AnalysisLocale = z.infer<typeof AnalysisLocaleSchema>;

export const WrinkleRegionIdSchema = z.enum([
  "forehead",
  "nasolabial",
  "crow_feet",
  "glabella",
  "perioral",
]);

export const SeveritySchema = z.enum(["none", "mild", "moderate", "marked"]);

export const LandmarkPointSchema = z.object({
  id: z.string().min(1).max(64),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  region: z.string().max(64).optional(),
});

export const WrinkleRegionSchema = z.object({
  id: WrinkleRegionIdSchema,
  depthScore: z.number().min(0).max(10),
  severity: SeveritySchema,
  confidence: z.number().min(0).max(1),
  landmarks: z.array(LandmarkPointSchema).max(24),
});

export const FaceAnalysisCoreSchema = z.object({
  symmetry: z.object({
    overallPercent: z.number().min(0).max(100),
    leftHemispherePercent: z.number().min(0).max(100),
    rightHemispherePercent: z.number().min(0).max(100),
    deltaPercent: z.number().min(0).max(100),
  }),
  wrinkles: z.object({
    overallDepthScore: z.number().min(0).max(10),
    regions: z.array(WrinkleRegionSchema).min(1).max(8),
  }),
  skinQuality: z.object({
    hydration: z.number().min(0).max(100),
    texture: z.number().min(0).max(100),
    redness: z.number().min(0).max(100),
    pigmentation: z.number().min(0).max(100),
    overallScore: z.number().min(0).max(100),
  }),
  landmarks: z.array(LandmarkPointSchema).max(64),
  clinicalTags: z.array(z.string().min(1).max(80)).max(20),
});

/** Raw model output before localization merge */
export const FaceAnalysisModelOutputSchema = FaceAnalysisCoreSchema.extend({
  summaryEn: z.string().min(8).max(2000),
  recommendationsEn: z.array(z.string().min(3).max(500)).max(10),
});

export const FaceAnalysisResponseSchema = FaceAnalysisCoreSchema.extend({
  analysisId: z.string().uuid(),
  analyzedAt: z.string().datetime(),
  locale: AnalysisLocaleSchema,
  summary: z.string().min(8).max(2000),
  recommendations: z.array(z.string().min(3).max(500)).max(10),
  model: z.string().min(1).max(80),
  provider: z.enum(["openai", "replicate", "fallback"]),
  degraded: z.boolean(),
  disclaimer: z.string().min(8).max(500),
});

export const FaceAnalysisSuccessSchema = z.object({
  success: z.literal(true),
  data: FaceAnalysisResponseSchema,
});

export const FaceAnalysisErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.enum([
      "INVALID_REQUEST",
      "UNAUTHORIZED",
      "RATE_LIMITED",
      "PROVIDER_ERROR",
      "VALIDATION_ERROR",
      "TIMEOUT",
      "INTERNAL",
    ]),
    message: z.string(),
    retryable: z.boolean(),
  }),
});

export const FaceAnalysisApiResponseSchema = z.discriminatedUnion("success", [
  FaceAnalysisSuccessSchema,
  FaceAnalysisErrorSchema,
]);

export const FaceAnalysisRequestSchema = z.object({
  imageBase64: z.string().min(100).max(12_000_000),
  locale: AnalysisLocaleSchema.default("en"),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]).default("image/jpeg"),
  captureMetadata: z
    .object({
      stage: z.enum(["before", "after"]).optional(),
      alignmentScore: z.number().min(0).max(100).optional(),
      timestamp: z.string().datetime().optional(),
    })
    .optional(),
});

export type FaceAnalysisRequest = z.infer<typeof FaceAnalysisRequestSchema>;
export type FaceAnalysisResponse = z.infer<typeof FaceAnalysisResponseSchema>;
export type FaceAnalysisApiResponse = z.infer<typeof FaceAnalysisApiResponseSchema>;
export type FaceAnalysisModelOutput = z.infer<typeof FaceAnalysisModelOutputSchema>;

/** OpenAI strict JSON schema (subset) */
export const OPENAI_FACE_ANALYSIS_JSON_SCHEMA = {
  name: "face_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "symmetry",
      "wrinkles",
      "skinQuality",
      "landmarks",
      "clinicalTags",
      "summaryEn",
      "recommendationsEn",
    ],
    properties: {
      symmetry: {
        type: "object",
        additionalProperties: false,
        required: [
          "overallPercent",
          "leftHemispherePercent",
          "rightHemispherePercent",
          "deltaPercent",
        ],
        properties: {
          overallPercent: { type: "number" },
          leftHemispherePercent: { type: "number" },
          rightHemispherePercent: { type: "number" },
          deltaPercent: { type: "number" },
        },
      },
      wrinkles: {
        type: "object",
        additionalProperties: false,
        required: ["overallDepthScore", "regions"],
        properties: {
          overallDepthScore: { type: "number" },
          regions: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "depthScore", "severity", "confidence", "landmarks"],
              properties: {
                id: {
                  type: "string",
                  enum: ["forehead", "nasolabial", "crow_feet", "glabella", "perioral"],
                },
                depthScore: { type: "number" },
                severity: { type: "string", enum: ["none", "mild", "moderate", "marked"] },
                confidence: { type: "number" },
                landmarks: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["id", "x", "y"],
                    properties: {
                      id: { type: "string" },
                      x: { type: "number" },
                      y: { type: "number" },
                      region: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      skinQuality: {
        type: "object",
        additionalProperties: false,
        required: ["hydration", "texture", "redness", "pigmentation", "overallScore"],
        properties: {
          hydration: { type: "number" },
          texture: { type: "number" },
          redness: { type: "number" },
          pigmentation: { type: "number" },
          overallScore: { type: "number" },
        },
      },
      landmarks: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "x", "y"],
          properties: {
            id: { type: "string" },
            x: { type: "number" },
            y: { type: "number" },
            region: { type: "string" },
          },
        },
      },
      clinicalTags: { type: "array", items: { type: "string" } },
      summaryEn: { type: "string" },
      recommendationsEn: { type: "array", items: { type: "string" } },
    },
  },
} as const;

export const CLINICAL_DISCLAIMER: Record<AnalysisLocale, string> = {
  en: "AI-assisted visual estimate for physician review only — not a diagnosis.",
  he: "הערכה ויזואלית AI לסקירת רופא בלבד — לא אבחנה.",
  ar: "تقدير بصري بمساعدة الذكاء الاصطناعي لمراجعة الطبيب فقط — ليس تشخيصاً.",
};
