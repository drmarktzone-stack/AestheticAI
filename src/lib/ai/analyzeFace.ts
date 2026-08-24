import * as FileSystem from "expo-file-system/legacy";

import { env } from "@/config/env";
import { getSupabaseClientOrNull } from "@/lib/supabase/client";
import {
  FaceAnalysisApiResponseSchema,
  type AnalysisLocale,
  type FaceAnalysisApiResponse,
  type FaceAnalysisRequest,
  type FaceAnalysisResponse,
} from "@/lib/ai/schema";

export interface AnalyzeFaceFromUriInput {
  imageUri: string;
  locale: AnalysisLocale;
  mimeType?: FaceAnalysisRequest["mimeType"];
  captureMetadata?: FaceAnalysisRequest["captureMetadata"];
  /** Override endpoint (local Express dev server) */
  endpointUrl?: string;
}

export interface AnalyzeFaceResult {
  data: FaceAnalysisResponse;
  raw: FaceAnalysisApiResponse;
}

async function uriToBase64(uri: string): Promise<string> {
  return FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

async function withClientRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts) break;
      await new Promise((r) => setTimeout(r, 400 * 2 ** (attempt - 1)));
    }
  }
  throw lastError;
}

export async function analyzeFaceFromUri(
  input: AnalyzeFaceFromUriInput,
): Promise<AnalyzeFaceResult> {
  const imageBase64 = await uriToBase64(input.imageUri);

  const body: FaceAnalysisRequest = {
    imageBase64,
    locale: input.locale,
    mimeType: input.mimeType ?? "image/jpeg",
    captureMetadata: input.captureMetadata,
  };

  const endpoint =
    input.endpointUrl ??
    env.faceAnalysisUrl ??
    (env.supabaseUrl ? `${env.supabaseUrl}/functions/v1/analyze-face` : null);

  if (!endpoint) {
    throw new Error("Face analysis endpoint not configured");
  }

  const supabase = getSupabaseClientOrNull();
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;

  const raw = await withClientRetry(async () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    } else if (env.faceAnalysisApiKey) {
      headers.Authorization = `Bearer ${env.faceAnalysisApiKey}`;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const json: unknown = await res.json();
    const parsed = FaceAnalysisApiResponseSchema.safeParse(json);

    if (!parsed.success) {
      throw new Error(`Invalid API response shape: ${parsed.error.message}`);
    }

    if (!parsed.data.success) {
      const err = parsed.data;
      if (err.error.retryable) {
        throw new Error(err.error.message);
      }
      throw new Error(err.error.message);
    }

    return parsed.data;
  });

  return { data: raw.data, raw };
}
