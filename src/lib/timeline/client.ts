import * as FileSystem from "expo-file-system/legacy";

import { env } from "@/config/env";
import { getSupabaseClientOrNull } from "@/lib/supabase/client";
import {
  TimelineApiResponseSchema,
  type ProcedureId,
  type TimelineJob,
  type TimelineLocale,
} from "@/lib/timeline/schema";

export interface StartTimelineFromUriInput {
  imageUri: string;
  procedureId: ProcedureId;
  locale: TimelineLocale;
  mimeType?: "image/jpeg" | "image/png" | "image/webp";
  endpointUrl?: string;
}

async function uriToBase64(uri: string): Promise<string> {
  return FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

function resolveTimelineEndpoints(custom?: string): { startUrl: string; pollUrl: string } {
  if (custom) {
    if (custom.endsWith("/start")) {
      const pollUrl = custom.replace(/\/start$/, "");
      return { startUrl: custom, pollUrl };
    }
    return { startUrl: custom, pollUrl: custom };
  }

  if (env.timelineSimulatorUrl) {
    if (env.timelineSimulatorUrl.endsWith("/start")) {
      const pollUrl = env.timelineSimulatorUrl.replace(/\/start$/, "");
      return { startUrl: env.timelineSimulatorUrl, pollUrl };
    }
    return { startUrl: env.timelineSimulatorUrl, pollUrl: env.timelineSimulatorUrl };
  }

  if (env.supabaseUrl) {
    const base = `${env.supabaseUrl}/functions/v1/timeline-simulator`;
    return { startUrl: base, pollUrl: base };
  }

  throw new Error("Timeline simulator endpoint not configured");
}

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const supabase = getSupabaseClientOrNull();
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  } else if (env.timelineSimulatorApiKey) {
    headers.Authorization = `Bearer ${env.timelineSimulatorApiKey}`;
  } else if (env.faceAnalysisApiKey) {
    headers.Authorization = `Bearer ${env.faceAnalysisApiKey}`;
  }

  return headers;
}

async function parseTimelineResponse(res: Response): Promise<TimelineJob> {
  const json: unknown = await res.json();
  const parsed = TimelineApiResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(`Invalid timeline API response: ${parsed.error.message}`);
  }

  if (!parsed.data.success) {
    throw new Error(parsed.data.error.message);
  }

  return parsed.data.job;
}

export async function startTimelineFromUri(
  input: StartTimelineFromUriInput,
): Promise<TimelineJob> {
  const imageBase64 = await uriToBase64(input.imageUri);
  const { startUrl } = resolveTimelineEndpoints(input.endpointUrl);
  const headers = await authHeaders();

  const res = await fetch(startUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      imageBase64,
      mimeType: input.mimeType ?? "image/jpeg",
      procedureId: input.procedureId,
      locale: input.locale,
    }),
  });

  return parseTimelineResponse(res);
}

export async function pollTimelineJob(
  jobId: string,
  endpointUrl?: string,
): Promise<TimelineJob> {
  const { pollUrl } = resolveTimelineEndpoints(endpointUrl);
  const url = `${pollUrl}?jobId=${encodeURIComponent(jobId)}`;
  const headers = await authHeaders();

  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  return parseTimelineResponse(res);
}
