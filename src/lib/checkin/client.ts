import { env } from "@/config/env";
import { getSupabaseClientOrNull } from "@/lib/supabase/client";
import {
  ClinicAlertsResponseSchema,
  SubmitCheckInResponseSchema,
  type CheckInLocale,
  type CheckInRecord,
  type ClinicAlert,
  type SymptomQuestionnaire,
} from "@/lib/checkin/schema";
import type { z } from "zod";
import type { ImageSignalsSchema } from "@/lib/checkin/schema";

type ImageSignals = z.infer<typeof ImageSignalsSchema>;

export interface SubmitCheckInInput {
  patientId: string;
  locale: CheckInLocale;
  photoStoragePath: string;
  symptoms: SymptomQuestionnaire;
  imageSignals?: ImageSignals;
  checkInDay?: number;
  endpointUrl?: string;
}

function resolveCheckInEndpoint(custom?: string): string {
  if (custom) return custom;
  if (env.checkInUrl) return env.checkInUrl;
  if (env.supabaseUrl) return `${env.supabaseUrl}/functions/v1/submit-checkin`;
  throw new Error("Check-in endpoint not configured");
}

function resolveAlertsEndpoint(custom?: string): string {
  if (custom) return custom;
  if (env.clinicAlertsUrl) return env.clinicAlertsUrl;
  if (env.supabaseUrl) return `${env.supabaseUrl}/functions/v1/clinic-alerts`;
  throw new Error("Clinic alerts endpoint not configured");
}

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const supabase = getSupabaseClientOrNull();
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  } else if (env.checkInApiKey) {
    headers.Authorization = `Bearer ${env.checkInApiKey}`;
  } else if (env.faceAnalysisApiKey) {
    headers.Authorization = `Bearer ${env.faceAnalysisApiKey}`;
  }

  return headers;
}

export async function submitDailyCheckIn(
  input: SubmitCheckInInput,
): Promise<{ checkIn: CheckInRecord; alert: ClinicAlert | null }> {
  const endpoint = resolveCheckInEndpoint(input.endpointUrl);
  const headers = await authHeaders();

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      patientId: input.patientId,
      locale: input.locale,
      photoStoragePath: input.photoStoragePath,
      symptoms: input.symptoms,
      imageSignals: input.imageSignals,
      checkInDay: input.checkInDay,
    }),
  });

  const json: unknown = await res.json();
  const parsed = SubmitCheckInResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Invalid check-in response: ${parsed.error.message}`);
  }
  if (!parsed.data.success) {
    throw new Error(parsed.data.error.message);
  }

  return { checkIn: parsed.data.checkIn, alert: parsed.data.alert };
}

export async function fetchClinicAlerts(options?: {
  unacknowledgedOnly?: boolean;
  endpointUrl?: string;
}): Promise<ClinicAlert[]> {
  const base = resolveAlertsEndpoint(options?.endpointUrl);
  const query = options?.unacknowledgedOnly ? "?unacknowledged=true" : "";
  const headers = await authHeaders();

  const res = await fetch(`${base}${query}`, { method: "GET", headers });
  const json: unknown = await res.json();
  const parsed = ClinicAlertsResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Invalid alerts response: ${parsed.error.message}`);
  }
  if (!parsed.data.success) {
    throw new Error(parsed.data.error.message);
  }

  return parsed.data.alerts;
}

export async function acknowledgeClinicAlert(
  alertId: string,
  endpointUrl?: string,
): Promise<ClinicAlert> {
  const endpoint = resolveAlertsEndpoint(endpointUrl);
  const headers = await authHeaders();

  const res = await fetch(endpoint, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ alertId }),
  });

  const json: unknown = await res.json();
  if (
    typeof json === "object" &&
    json !== null &&
    "success" in json &&
    json.success === true &&
    "alert" in json
  ) {
    return json.alert as ClinicAlert;
  }

  throw new Error("Failed to acknowledge alert");
}
