import { acknowledgeAlert, listClinicAlerts } from "../_shared/checkin/store.ts";

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

  try {
    const physicianId = Deno.env.get("DEFAULT_PHYSICIAN_ID") ?? crypto.randomUUID();

    if (req.method === "GET") {
      const url = new URL(req.url);
      const unacknowledgedOnly = url.searchParams.get("unacknowledged") === "true";
      let alerts = listClinicAlerts(physicianId);
      if (unacknowledgedOnly) {
        alerts = alerts.filter((a) => !a.acknowledged);
      }
      return json({ success: true, alerts }, 200);
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const alertId = body?.alertId as string | undefined;
      if (!alertId) {
        return json(
          {
            success: false,
            error: { code: "INVALID_REQUEST", message: "alertId required", retryable: false },
          },
          400,
        );
      }
      const updated = acknowledgeAlert(alertId, physicianId);
      if (!updated) {
        return json(
          { success: false, error: { code: "NOT_FOUND", message: "Alert not found", retryable: false } },
          404,
        );
      }
      return json({ success: true, alert: updated }, 200);
    }

    return json(
      { success: false, error: { code: "METHOD_NOT_ALLOWED", message: "GET or PATCH", retryable: false } },
      405,
    );
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
