/**
 * Client-side API contract — keep in sync with
 * supabase/functions/_shared/face-analysis/schema.ts
 */
import { z } from "zod";

export const AnalysisLocaleSchema = z.enum(["en", "he", "ar"]);
export type AnalysisLocale = z.infer<typeof AnalysisLocaleSchema>;

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

export const FaceAnalysisResponseSchema = z.object({
  symmetry: z.object({
    overallPercent: z.number(),
    leftHemispherePercent: z.number(),
    rightHemispherePercent: z.number(),
    deltaPercent: z.number(),
  }),
  wrinkles: z.object({
    overallDepthScore: z.number(),
    regions: z.array(
      z.object({
        id: z.string(),
        depthScore: z.number(),
        severity: z.string(),
        confidence: z.number(),
        landmarks: z.array(
          z.object({
            id: z.string(),
            x: z.number(),
            y: z.number(),
            region: z.string().optional(),
          }),
        ),
      }),
    ),
  }),
  skinQuality: z.object({
    hydration: z.number(),
    texture: z.number(),
    redness: z.number(),
    pigmentation: z.number(),
    overallScore: z.number(),
  }),
  landmarks: z.array(
    z.object({
      id: z.string(),
      x: z.number(),
      y: z.number(),
      region: z.string().optional(),
    }),
  ),
  clinicalTags: z.array(z.string()),
  analysisId: z.string().uuid(),
  analyzedAt: z.string(),
  locale: AnalysisLocaleSchema,
  summary: z.string(),
  recommendations: z.array(z.string()),
  model: z.string(),
  provider: z.enum(["openai", "replicate", "fallback"]),
  degraded: z.boolean(),
  disclaimer: z.string(),
});

export const FaceAnalysisApiResponseSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), data: FaceAnalysisResponseSchema }),
  z.object({
    success: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
      retryable: z.boolean(),
    }),
  }),
]);

export type FaceAnalysisRequest = z.infer<typeof FaceAnalysisRequestSchema>;
export type FaceAnalysisResponse = z.infer<typeof FaceAnalysisResponseSchema>;
export type FaceAnalysisApiResponse = z.infer<typeof FaceAnalysisApiResponseSchema>;
