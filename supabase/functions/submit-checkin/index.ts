import { SubmitCheckInRequestSchema } from "../_shared/checkin/schema.ts";
import { submitCheckInRecord } from "../_shared/checkin/store.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Missing token", retryable: false } },
      401,
    );
  }

  if (req.method !== "POST") {
    return json(
      { success: false, error: { code: "METHOD_NOT_ALLOWED", message: "POST only", retryable: false } },
      405,
    );
  }

  try {
    const body = await req.json();
    const parsed = SubmitCheckInRequestSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        {
          success: false,
          error: { code: "INVALID_REQUEST", message: parsed.error.message, retryable: false },
        },
        400,
      );
    }

    // In production: resolve physicianId from patient assignment via Supabase RLS
    const physicianId = Deno.env.get("DEFAULT_PHYSICIAN_ID") ?? crypto.randomUUID();

    const { checkIn, alert } = submitCheckInRecord({
      request: parsed.data,
      physicianId,
    });

    return json({ success: true, checkIn, alert }, alert ? 201 : 200);
  } catch (error) {
    return json(
      {
        success: false,
        error: {
          code: "INTERNAL",
          message: error instanceof Error ? error.message : "Internal error",
          retryable: true,
        },
      },
      500,
    );
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
