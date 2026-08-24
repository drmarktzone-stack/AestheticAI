import { refreshTimelineJob, startTimelineJob } from "../_shared/timeline-simulator/generate.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function configFromEnv() {
  return {
    replicateApiToken: Deno.env.get("REPLICATE_API_TOKEN") ?? undefined,
    replicateModelVersion: Deno.env.get("REPLICATE_TIMELINE_MODEL") ?? undefined,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing token", retryable: false } }, 401);
  }

  try {
    if (req.method === "POST") {
      const body = await req.json();
      const result = await startTimelineJob(body, configFromEnv());
      if (!result.success) {
        return json({ success: false, error: { code: "INVALID_REQUEST", message: result.error, retryable: false } }, 400);
      }
      return json({ success: true, job: result.job }, 202);
    }

    if (req.method === "GET") {
      const url = new URL(req.url);
      const jobId = url.searchParams.get("jobId");
      if (!jobId) {
        return json({ success: false, error: { code: "INVALID_REQUEST", message: "jobId required", retryable: false } }, 400);
      }
      const result = await refreshTimelineJob(jobId, configFromEnv());
      if (!result.success) {
        return json({ success: false, error: { code: "NOT_FOUND", message: result.error, retryable: false } }, 404);
      }
      return json({ success: true, job: result.job }, 200);
    }

    return json({ success: false, error: { code: "METHOD_NOT_ALLOWED", message: "POST or GET", retryable: false } }, 405);
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
