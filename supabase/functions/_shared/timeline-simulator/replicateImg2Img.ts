import { buildMilestonePrompts } from "./prompts.ts";
import type { MilestoneId, ProcedureId, TimelineLocale } from "./schema.ts";
import { withRetry, ProviderError, isRetryableHttpStatus } from "../face-analysis/retry.ts";

const DEFAULT_MODEL =
  "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768dd89054a40f3755276d4055fc2b1e50970c646";

export interface StartPredictionResult {
  predictionId: string;
  pollUrl: string;
}

export async function startImg2ImgPrediction(input: {
  apiToken: string;
  imageBase64: string;
  mimeType: string;
  procedureId: ProcedureId;
  locale: TimelineLocale;
  milestoneId: MilestoneId;
  modelVersion?: string;
}): Promise<StartPredictionResult> {
  const prompts = buildMilestonePrompts(input.procedureId, input.locale);
  const milestone = prompts[input.milestoneId];
  const dataUri = `data:${input.mimeType};base64,${input.imageBase64}`;

  return withRetry(async () => {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${input.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: (input.modelVersion ?? DEFAULT_MODEL).split(":").pop(),
        input: {
          image: dataUri,
          prompt: milestone.prompt,
          prompt_strength: milestone.strength,
          num_inference_steps: 28,
          guidance_scale: 7,
          negative_prompt:
            "cartoon, anime, deformed, blurry, different person, extra limbs, watermark",
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new ProviderError(
        `Replicate start failed: ${res.status} ${body.slice(0, 200)}`,
        "PROVIDER_ERROR",
        isRetryableHttpStatus(res.status),
        res.status,
      );
    }

    const json = await res.json();
    const predictionId = json?.id as string | undefined;
    const pollUrl = json?.urls?.get as string | undefined;
    if (!predictionId || !pollUrl) {
      throw new ProviderError("Invalid Replicate prediction response", "PROVIDER_ERROR", false);
    }
    return { predictionId, pollUrl };
  });
}

export async function pollPrediction(input: {
  apiToken: string;
  pollUrl: string;
}): Promise<{ status: "processing" | "succeeded" | "failed"; imageUrl?: string; error?: string }> {
  const res = await fetch(input.pollUrl, {
    headers: { Authorization: `Token ${input.apiToken}` },
  });

  if (!res.ok) {
    return { status: "failed", error: `Poll HTTP ${res.status}` };
  }

  const json = await res.json();
  if (json.status === "succeeded") {
    const output = json.output;
    const imageUrl = Array.isArray(output) ? output[0] : output;
    if (typeof imageUrl === "string" && imageUrl.startsWith("http")) {
      return { status: "succeeded", imageUrl };
    }
    return { status: "failed", error: "Missing output URL" };
  }

  if (json.status === "failed" || json.status === "canceled") {
    return { status: "failed", error: json.error ?? "Prediction failed" };
  }

  return { status: "processing" };
}
