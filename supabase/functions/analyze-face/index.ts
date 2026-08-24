import { analyzeFaceImage, toProviderErrorResponse } from "../_shared/face-analysis/analyze.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: { code: "INVALID_REQUEST", message: "POST only", retryable: false } }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Missing bearer token", retryable: false },
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const result = await analyzeFaceImage(body, {
      openAiApiKey: Deno.env.get("OPENAI_API_KEY") ?? undefined,
      replicateApiToken: Deno.env.get("REPLICATE_API_TOKEN") ?? undefined,
      openAiModel: Deno.env.get("OPENAI_VISION_MODEL") ?? "gpt-4o",
      replicateModelVersion: Deno.env.get("REPLICATE_FACE_MODEL") ?? undefined,
    });

    const status = result.success ? 200 : result.error.code === "INVALID_REQUEST" ? 400 : 502;
    return new Response(JSON.stringify(result), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const err = toProviderErrorResponse(error);
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
