import {
  MILESTONE_ORDER,
  StartTimelineRequestSchema,
  TimelineJobSchema,
  type MilestoneId,
  type StartTimelineRequest,
  type TimelineJob,
} from "./schema.ts";
import {
  aggregateStatus,
  computeProgress,
  getJob,
  saveJob,
  updateJob,
} from "./jobStore.ts";
import { pollPrediction, startImg2ImgPrediction } from "./replicateImg2Img.ts";

export interface TimelineConfig {
  replicateApiToken?: string;
  replicateModelVersion?: string;
}

function createInitialJob(request: StartTimelineRequest): TimelineJob {
  const now = new Date().toISOString();
  return {
    jobId: crypto.randomUUID(),
    procedureId: request.procedureId,
    locale: request.locale,
    status: "queued",
    progress: 0,
    milestones: MILESTONE_ORDER.map((id) => ({
      id,
      status: "queued" as const,
    })),
    createdAt: now,
    updatedAt: now,
    degraded: false,
  };
}

async function kickoffPredictions(
  job: TimelineJob,
  request: StartTimelineRequest,
  config: TimelineConfig,
): Promise<TimelineJob> {
  if (!config.replicateApiToken) {
    return updateJob(job.jobId, {
      status: "failed",
      progress: 0,
      milestones: job.milestones.map((m) => ({
        ...m,
        status: "failed",
        error: "REPLICATE_API_TOKEN not configured",
      })),
    })!;
  }

  let current = updateJob(job.jobId, { status: "processing" })!;

  for (const milestoneId of MILESTONE_ORDER) {
    current = updateJob(job.jobId, (j) => ({
      ...j,
      milestones: j.milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: "processing" } : m,
      ),
    }))!;

    try {
      const started = await startImg2ImgPrediction({
        apiToken: config.replicateApiToken,
        imageBase64: request.imageBase64,
        mimeType: request.mimeType,
        procedureId: request.procedureId,
        locale: request.locale,
        milestoneId,
        modelVersion: config.replicateModelVersion,
      });

      current = updateJob(job.jobId, (j) => ({
        ...j,
        milestones: j.milestones.map((m) =>
          m.id === milestoneId
            ? { ...m, status: "processing", predictionId: started.predictionId }
            : m,
        ),
        progress: computeProgress(j),
      }))!;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Start failed";
      current = updateJob(job.jobId, (j) => ({
        ...j,
        milestones: j.milestones.map((m) =>
          m.id === milestoneId ? { ...m, status: "failed", error: message } : m,
        ),
      }))!;
    }
  }

  return current;
}

export async function startTimelineJob(
  raw: unknown,
  config: TimelineConfig,
): Promise<{ success: true; job: TimelineJob } | { success: false; error: string }> {
  const parsed = StartTimelineRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const job = createInitialJob(parsed.data);
  saveJob(job);

  const kickoff = kickoffPredictions(job, parsed.data, config);
  // Keep edge worker alive until Replicate predictions are submitted
  const edgeRuntime = (globalThis as { EdgeRuntime?: { waitUntil: (p: Promise<unknown>) => void } })
    .EdgeRuntime;
  if (edgeRuntime?.waitUntil) {
    edgeRuntime.waitUntil(kickoff);
  } else {
    void kickoff;
  }

  const validated = TimelineJobSchema.safeParse(getJob(job.jobId));
  if (!validated.success) {
    return { success: false, error: "Job validation failed" };
  }

  return { success: true, job: validated.data };
}

export async function refreshTimelineJob(
  jobId: string,
  config: TimelineConfig,
): Promise<{ success: true; job: TimelineJob } | { success: false; error: string }> {
  const existing = getJob(jobId);
  if (!existing) {
    return { success: false, error: "Job not found" };
  }

  if (!config.replicateApiToken) {
    return { success: false, error: "REPLICATE_API_TOKEN not configured" };
  }

  let job = existing;

  for (const milestone of job.milestones) {
    if (milestone.status !== "processing" || !milestone.predictionId) continue;

    const pollUrl = `https://api.replicate.com/v1/predictions/${milestone.predictionId}`;
    const result = await pollPrediction({
      apiToken: config.replicateApiToken,
      pollUrl,
    });

    job = updateJob(job.jobId, (j) => ({
      ...j,
      milestones: j.milestones.map((m) => {
        if (m.id !== milestone.id) return m;
        if (result.status === "succeeded") {
          return { ...m, status: "succeeded", imageUrl: result.imageUrl, error: undefined };
        }
        if (result.status === "failed") {
          return { ...m, status: "failed", error: result.error ?? "Failed" };
        }
        return m;
      }),
    }))!;

    job = updateJob(job.jobId, (j) => ({
      ...j,
      progress: computeProgress(j),
      status: aggregateStatus(j),
    }))!;
  }

  const validated = TimelineJobSchema.safeParse(getJob(jobId));
  if (!validated.success) {
    return { success: false, error: "Job validation failed" };
  }

  return { success: true, job: validated.data };
}

export function getMilestoneIds(): MilestoneId[] {
  return [...MILESTONE_ORDER];
}
