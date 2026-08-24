import express from "express";
import cors from "cors";
import { analyzeFaceImage, toProviderErrorResponse } from "../../supabase/functions/_shared/face-analysis/analyze.ts";

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

const PORT = Number(process.env.PORT ?? 8787);
const API_KEY = process.env.FACE_ANALYSIS_API_KEY;

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "face-analysis-api" });
});

app.post("/v1/analyze-face", async (req, res) => {
  if (API_KEY) {
    const header = req.header("authorization");
    if (header !== `Bearer ${API_KEY}`) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid API key", retryable: false },
      });
      return;
    }
  }

  try {
    const result = await analyzeFaceImage(req.body, {
      openAiApiKey: process.env.OPENAI_API_KEY,
      replicateApiToken: process.env.REPLICATE_API_TOKEN,
      openAiModel: process.env.OPENAI_VISION_MODEL ?? "gpt-4o",
      replicateModelVersion: process.env.REPLICATE_FACE_MODEL,
    });

    res.status(result.success ? 200 : 502).json(result);
  } catch (error) {
    res.status(500).json(toProviderErrorResponse(error));
  }
});

app.listen(PORT, () => {
  console.log(`Face analysis API listening on http://localhost:${PORT}`);
});
