import express from "express";
import cors from "cors";
import { analyzeFaceImage, toProviderErrorResponse } from "../../supabase/functions/_shared/face-analysis/analyze.ts";
import {
  refreshTimelineJob,
  startTimelineJob,
} from "../../supabase/functions/_shared/timeline-simulator/generate.ts";
import { submitCheckInRecord, acknowledgeAlert, listClinicAlerts } from "../../supabase/functions/_shared/checkin/store.ts";
import { SubmitCheckInRequestSchema } from "../../supabase/functions/_shared/checkin/schema.ts";

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

const PORT = Number(process.env.PORT ?? 8787);
const API_KEY = process.env.FACE_ANALYSIS_API_KEY;

function requireApiKey(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (!API_KEY) {
    next();
    return;
  }
  const header = req.header("authorization");
  if (header !== `Bearer ${API_KEY}`) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid API key", retryable: false },
    });
    return;
  }
  next();
}

const timelineConfig = () => ({
  replicateApiToken: process.env.REPLICATE_API_TOKEN,
  replicateModelVersion: process.env.REPLICATE_TIMELINE_MODEL,
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "face-analysis-api" });
});

app.post("/v1/analyze-face", requireApiKey, async (req, res) => {
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

app.post("/v1/timeline/start", requireApiKey, async (req, res) => {
  try {
    const result = await startTimelineJob(req.body, timelineConfig());
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: { code: "INVALID_REQUEST", message: result.error, retryable: false },
      });
      return;
    }
    res.status(202).json({ success: true, job: result.job });
  } catch (error) {
    res.status(500).json(toProviderErrorResponse(error));
  }
});

app.get("/v1/timeline", requireApiKey, async (req, res) => {
  const jobId = req.query.jobId;
  if (typeof jobId !== "string" || !jobId) {
    res.status(400).json({
      success: false,
      error: { code: "INVALID_REQUEST", message: "jobId required", retryable: false },
    });
    return;
  }

  try {
    const result = await refreshTimelineJob(jobId, timelineConfig());
    if (!result.success) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: result.error, retryable: false },
      });
      return;
    }
    res.status(200).json({ success: true, job: result.job });
  } catch (error) {
    res.status(500).json(toProviderErrorResponse(error));
  }
});

app.post("/v1/checkin", requireApiKey, async (req, res) => {
  try {
    const parsed = SubmitCheckInRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: { code: "INVALID_REQUEST", message: parsed.error.message, retryable: false },
      });
      return;
    }

    const physicianId = process.env.DEFAULT_PHYSICIAN_ID ?? crypto.randomUUID();
    const { checkIn, alert } = submitCheckInRecord({
      request: parsed.data,
      physicianId,
    });

    res.status(alert ? 201 : 200).json({ success: true, checkIn, alert });
  } catch (error) {
    res.status(500).json(toProviderErrorResponse(error));
  }
});

app.get("/v1/clinic-alerts", requireApiKey, async (req, res) => {
  try {
    const physicianId = process.env.DEFAULT_PHYSICIAN_ID ?? crypto.randomUUID();
    const unacknowledgedOnly = req.query.unacknowledged === "true";
    let alerts = listClinicAlerts(physicianId);
    if (unacknowledgedOnly) {
      alerts = alerts.filter((a) => !a.acknowledged);
    }
    res.status(200).json({ success: true, alerts });
  } catch (error) {
    res.status(500).json(toProviderErrorResponse(error));
  }
});

app.patch("/v1/clinic-alerts", requireApiKey, async (req, res) => {
  try {
    const alertId = req.body?.alertId as string | undefined;
    if (!alertId) {
      res.status(400).json({
        success: false,
        error: { code: "INVALID_REQUEST", message: "alertId required", retryable: false },
      });
      return;
    }

    const physicianId = process.env.DEFAULT_PHYSICIAN_ID ?? crypto.randomUUID();
    const updated = acknowledgeAlert(alertId, physicianId);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Alert not found", retryable: false },
      });
      return;
    }

    res.status(200).json({ success: true, alert: updated });
  } catch (error) {
    res.status(500).json(toProviderErrorResponse(error));
  }
});

app.listen(PORT, () => {
  console.log(`Face analysis API listening on http://localhost:${PORT}`);
});
