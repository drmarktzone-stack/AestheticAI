import {
  FaceAnalysisModelOutputSchema,
  OPENAI_FACE_ANALYSIS_JSON_SCHEMA,
  type AnalysisLocale,
  type FaceAnalysisModelOutput,
} from "./schema.ts";
import { ProviderError, isRetryableHttpStatus, withRetry } from "./retry.ts";
import { buildVisionSystemPrompt } from "./localize.ts";

export interface OpenAiVisionInput {
  apiKey: string;
  imageBase64: string;
  mimeType: string;
  locale: AnalysisLocale;
  model?: string;
}

export async function analyzeWithOpenAiVision(input: OpenAiVisionInput): Promise<FaceAnalysisModelOutput> {
  const model = input.model ?? "gpt-4o";

  return withRetry(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${input.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          response_format: {
            type: "json_schema",
            json_schema: OPENAI_FACE_ANALYSIS_JSON_SCHEMA,
          },
          messages: [
            {
              role: "system",
              content: buildVisionSystemPrompt(input.locale),
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this clinical aesthetic facial photograph and populate all schema fields.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${input.mimeType};base64,${input.imageBase64}`,
                    detail: "high",
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new ProviderError(
          `OpenAI error: ${response.status} ${body.slice(0, 300)}`,
          "PROVIDER_ERROR",
          isRetryableHttpStatus(response.status),
          response.status,
        );
      }

      const json = await response.json();
      const content = json?.choices?.[0]?.message?.content;
      if (typeof content !== "string") {
        throw new ProviderError("OpenAI returned empty content", "PROVIDER_ERROR", true);
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(content);
      } catch {
        throw new ProviderError("OpenAI returned non-JSON content", "VALIDATION_ERROR", false);
      }

      const validated = FaceAnalysisModelOutputSchema.safeParse(parsed);
      if (!validated.success) {
        throw new ProviderError(
          `Schema validation failed: ${validated.error.message}`,
          "VALIDATION_ERROR",
          false,
        );
      }

      return validated.data;
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new ProviderError("OpenAI request timed out", "TIMEOUT", true);
      }
      throw new ProviderError(
        error instanceof Error ? error.message : "Unknown OpenAI error",
        "PROVIDER_ERROR",
        true,
      );
    } finally {
      clearTimeout(timeout);
    }
  });
}
