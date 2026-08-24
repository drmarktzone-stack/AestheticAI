import {
  CLINICAL_DISCLAIMER,
  FaceAnalysisRequestSchema,
  FaceAnalysisResponseSchema,
  type AnalysisLocale,
  type FaceAnalysisApiResponse,
  type FaceAnalysisModelOutput,
  type FaceAnalysisRequest,
} from "./schema.ts";
import {
  buildFallbackRecommendations,
  buildFallbackSummary,
  localizeReport,
} from "./localize.ts";
import { analyzeWithOpenAiVision } from "./openai.ts";
import { analyzeWithReplicate } from "./replicate.ts";
import { ProviderError } from "./retry.ts";

export interface AnalyzeFaceConfig {
  openAiApiKey?: string;
  replicateApiToken?: string;
  openAiModel?: string;
  replicateModelVersion?: string;
}

function createFallbackCore(): FaceAnalysisModelOutput {
  return {
    symmetry: {
      overallPercent: 50,
      leftHemispherePercent: 50,
      rightHemispherePercent: 50,
      deltaPercent: 0,
    },
    wrinkles: {
      overallDepthScore: 0,
      regions: [
        { id: "forehead", depthScore: 0, severity: "none", confidence: 0, landmarks: [] },
        { id: "nasolabial", depthScore: 0, severity: "none", confidence: 0, landmarks: [] },
        { id: "crow_feet", depthScore: 0, severity: "none", confidence: 0, landmarks: [] },
      ],
    },
    skinQuality: {
      hydration: 50,
      texture: 50,
      redness: 50,
      pigmentation: 50,
      overallScore: 50,
    },
    landmarks: [],
    clinicalTags: ["analysis_degraded"],
    summaryEn: "Automated analysis unavailable. Manual clinical assessment required.",
    recommendationsEn: [
      "Repeat capture with standardized lighting and alignment.",
      "Review symmetry and skin findings manually.",
    ],
  };
}

async function translateText(
  apiKey: string,
  text: string,
  locale: AnalysisLocale,
): Promise<string> {
  if (locale === "en") return text;

  const target = locale === "he" ? "Hebrew" : "Arabic";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `Translate clinical aesthetic medicine text to ${target}. Preserve clinical tone. Return translation only.`,
        },
        { role: "user", content: text },
      ],
    }),
  });

  if (!res.ok) return text;
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  return typeof content === "string" && content.trim() ? content.trim() : text;
}

async function translateList(
  apiKey: string,
  items: string[],
  locale: AnalysisLocale,
): Promise<string[]> {
  if (locale === "en") return items;
  return Promise.all(items.map((item) => translateText(apiKey, item, locale)));
}

export async function analyzeFaceImage(
  rawRequest: unknown,
  config: AnalyzeFaceConfig,
): Promise<FaceAnalysisApiResponse> {
  const parsed = FaceAnalysisRequestSchema.safeParse(rawRequest);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "INVALID_REQUEST",
        message: parsed.error.message,
        retryable: false,
      },
    };
  }

  const request: FaceAnalysisRequest = parsed.data;
  let modelOutput: FaceAnalysisModelOutput | null = null;
  let provider: "openai" | "replicate" | "fallback" = "fallback";
  let modelName = "none";
  let degraded = false;

  try {
    if (config.openAiApiKey) {
      modelOutput = await analyzeWithOpenAiVision({
        apiKey: config.openAiApiKey,
        imageBase64: request.imageBase64,
        mimeType: request.mimeType,
        locale: "en",
        model: config.openAiModel,
      });
      provider = "openai";
      modelName = config.openAiModel ?? "gpt-4o";
    } else if (config.replicateApiToken) {
      modelOutput = await analyzeWithReplicate({
        apiToken: config.replicateApiToken,
        imageBase64: request.imageBase64,
        mimeType: request.mimeType,
        locale: "en",
        modelVersion: config.replicateModelVersion,
      });
      provider = "replicate";
      modelName = config.replicateModelVersion ?? "llava-13b";
    } else {
      return {
        success: false,
        error: {
          code: "PROVIDER_ERROR",
          message: "No AI provider configured (OPENAI_API_KEY or REPLICATE_API_TOKEN)",
          retryable: false,
        },
      };
    }
  } catch (primaryError) {
    try {
      if (config.replicateApiToken && config.openAiApiKey) {
        modelOutput = await analyzeWithReplicate({
          apiToken: config.replicateApiToken,
          imageBase64: request.imageBase64,
          mimeType: request.mimeType,
          locale: "en",
          modelVersion: config.replicateModelVersion,
        });
        provider = "replicate";
        modelName = config.replicateModelVersion ?? "llava-13b";
      } else {
        throw primaryError;
      }
    } catch {
      modelOutput = createFallbackCore();
      provider = "fallback";
      modelName = "fallback-v1";
      degraded = true;
    }
  }

  const apiKey = config.openAiApiKey ?? "";
  const localized = degraded
    ? {
        summary: buildFallbackSummary(request.locale),
        recommendations: buildFallbackRecommendations(request.locale),
      }
    : await localizeReport(
        modelOutput,
        request.locale,
        (text, locale) => translateText(apiKey, text, locale),
        (items, locale) => translateList(apiKey, items, locale),
      );

  const { summaryEn: _summaryEn, recommendationsEn: _recommendationsEn, ...coreFields } =
    modelOutput;

  const responseCandidate = {
    ...coreFields,
    analysisId: crypto.randomUUID(),
    analyzedAt: new Date().toISOString(),
    locale: request.locale,
    summary: localized.summary,
    recommendations: localized.recommendations,
    model: modelName,
    provider,
    degraded,
    disclaimer: CLINICAL_DISCLAIMER[request.locale],
  };

  const validated = FaceAnalysisResponseSchema.safeParse(responseCandidate);

  if (!validated.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: validated.error.message,
        retryable: false,
      },
    };
  }

  return { success: true, data: validated.data };
}

export function toProviderErrorResponse(error: unknown): FaceAnalysisApiResponse {
  if (error instanceof ProviderError) {
    return {
      success: false,
      error: {
        code: error.code as "PROVIDER_ERROR" | "TIMEOUT" | "VALIDATION_ERROR",
        message: error.message,
        retryable: error.retryable,
      },
    };
  }
  return {
    success: false,
    error: {
      code: "INTERNAL",
      message: error instanceof Error ? error.message : "Internal error",
      retryable: true,
    },
  };
}
