import {
  FaceAnalysisModelOutputSchema,
  type AnalysisLocale,
  type FaceAnalysisModelOutput,
} from "./schema.ts";
import { ProviderError, isRetryableHttpStatus, withRetry } from "./retry.ts";
import { buildVisionSystemPrompt } from "./localize.ts";

/**
 * Replicate fallback using a vision LLM (e.g. LLaVA).
 * Set REPLICATE_FACE_MODEL env to override default model version.
 */
export async function analyzeWithReplicate(input: {
  apiToken: string;
  imageBase64: string;
  mimeType: string;
  locale: AnalysisLocale;
  modelVersion?: string;
}): Promise<FaceAnalysisModelOutput> {
  const modelVersion =
    input.modelVersion ??
    "yorickvp/llava-13b:80537d876159f380a1c574e6777653295449369a9cb1053795777273886caccf";

  return withRetry(async () => {
    const dataUri = `data:${input.mimeType};base64,${input.imageBase64}`;

    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${input.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: modelVersion.includes(":") ? modelVersion.split(":")[1] : modelVersion,
        input: {
          image: dataUri,
          prompt: `${buildVisionSystemPrompt(input.locale)} Return compact JSON only.`,
          max_tokens: 1800,
        },
      }),
    });

    if (!createRes.ok) {
      const body = await createRes.text();
      throw new ProviderError(
        `Replicate create failed: ${createRes.status}`,
        "PROVIDER_ERROR",
        isRetryableHttpStatus(createRes.status),
        createRes.status,
      );
    }

    const prediction = await createRes.json();
    const pollUrl = prediction?.urls?.get;
    if (!pollUrl) throw new ProviderError("Replicate missing poll URL", "PROVIDER_ERROR", false);

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const pollRes = await fetch(pollUrl, {
        headers: { Authorization: `Token ${input.apiToken}` },
      });
      const pollJson = await pollRes.json();
      if (pollJson.status === "succeeded") {
        const output = Array.isArray(pollJson.output) ? pollJson.output.join("") : pollJson.output;
        const text = typeof output === "string" ? output : JSON.stringify(output);
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}");
        if (jsonStart < 0 || jsonEnd < 0) {
          throw new ProviderError("Replicate output not JSON", "VALIDATION_ERROR", false);
        }
        const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
        const validated = FaceAnalysisModelOutputSchema.safeParse(parsed);
        if (!validated.success) {
          throw new ProviderError(validated.error.message, "VALIDATION_ERROR", false);
        }
        return validated.data;
      }
      if (pollJson.status === "failed" || pollJson.status === "canceled") {
        throw new ProviderError("Replicate prediction failed", "PROVIDER_ERROR", true);
      }
    }

    throw new ProviderError("Replicate prediction timed out", "TIMEOUT", true);
  }, { maxAttempts: 2 });
}
