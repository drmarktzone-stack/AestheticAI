import { z } from "zod";

export const TimelineLocaleSchema = z.enum(["en", "he", "ar"]);
export type TimelineLocale = z.infer<typeof TimelineLocaleSchema>;

export const MilestoneIdSchema = z.enum(["day1", "day7", "month3", "month6"]);
export type MilestoneId = z.infer<typeof MilestoneIdSchema>;

export const MILESTONE_ORDER: MilestoneId[] = ["day1", "day7", "month3", "month6"];

export const ProcedureIdSchema = z.enum([
  "lip_filler",
  "botox_forehead",
  "rhinoplasty",
  "cheek_filler",
  "jawline_contour",
]);
export type ProcedureId = z.infer<typeof ProcedureIdSchema>;

export const PROCEDURE_IDS: ProcedureId[] = [
  "lip_filler",
  "botox_forehead",
  "rhinoplasty",
  "cheek_filler",
  "jawline_contour",
];

export const MilestoneStatusSchema = z.object({
  id: MilestoneIdSchema,
  status: z.enum(["queued", "processing", "succeeded", "failed"]),
  imageUrl: z.string().url().optional(),
  error: z.string().optional(),
  predictionId: z.string().optional(),
});

export const TimelineJobSchema = z.object({
  jobId: z.string().uuid(),
  procedureId: ProcedureIdSchema,
  locale: TimelineLocaleSchema,
  status: z.enum(["queued", "processing", "completed", "failed", "partial"]),
  progress: z.number().min(0).max(100),
  milestones: z.array(MilestoneStatusSchema).length(4),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  degraded: z.boolean().default(false),
});

export const StartTimelineRequestSchema = z.object({
  imageBase64: z.string().min(100).max(12_000_000),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]).default("image/jpeg"),
  procedureId: ProcedureIdSchema,
  locale: TimelineLocaleSchema.default("en"),
});

export const TimelineApiSuccessSchema = z.object({
  success: z.literal(true),
  job: TimelineJobSchema,
});

export const TimelineApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    retryable: z.boolean(),
  }),
});

export const TimelineApiResponseSchema = z.discriminatedUnion("success", [
  TimelineApiSuccessSchema,
  TimelineApiErrorSchema,
]);

export type TimelineJob = z.infer<typeof TimelineJobSchema>;
export type TimelineApiResponse = z.infer<typeof TimelineApiResponseSchema>;
export type StartTimelineRequest = z.infer<typeof StartTimelineRequestSchema>;

export function isTerminalJobStatus(status: TimelineJob["status"]): boolean {
  return status === "completed" || status === "failed" || status === "partial";
}

export function milestoneImageMap(job: TimelineJob): Partial<Record<MilestoneId, string>> {
  const map: Partial<Record<MilestoneId, string>> = {};
  for (const m of job.milestones) {
    if (m.status === "succeeded" && m.imageUrl) {
      map[m.id] = m.imageUrl;
    }
  }
  return map;
}

export function activeProcessingMilestone(job: TimelineJob): MilestoneId | null {
  const processing = job.milestones.find((m) => m.status === "processing");
  if (processing) return processing.id;
  const queued = job.milestones.find((m) => m.status === "queued");
  return queued?.id ?? null;
}
