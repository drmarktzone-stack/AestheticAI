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

export const StartTimelineSuccessSchema = z.object({
  success: z.literal(true),
  job: TimelineJobSchema,
});

export const PollTimelineSuccessSchema = z.object({
  success: z.literal(true),
  job: TimelineJobSchema,
});

export const TimelineErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    retryable: z.boolean(),
  }),
});

export type TimelineJob = z.infer<typeof TimelineJobSchema>;
export type StartTimelineRequest = z.infer<typeof StartTimelineRequestSchema>;

export const PROCEDURE_LABELS: Record<
  ProcedureId,
  Record<TimelineLocale, string>
> = {
  lip_filler: {
    en: "Lip filler",
    he: "מילוי שפתיים",
    ar: "حشو الشفاه",
  },
  botox_forehead: {
    en: "Botox forehead",
    he: "בוטוקס מצח",
    ar: "بوتوكس الجبهة",
  },
  rhinoplasty: {
    en: "Rhinoplasty (simulation)",
    he: "סימולציית אף",
    ar: "محاكاة تجميل الأنف",
  },
  cheek_filler: {
    en: "Cheek filler",
    he: "מילוי לחיים",
    ar: "حشو الخدود",
  },
  jawline_contour: {
    en: "Jawline contour",
    he: "קונטור קו לסת",
    ar: "نحت خط الفك",
  },
};

export const MILESTONE_LABELS: Record<
  MilestoneId,
  Record<TimelineLocale, string>
> = {
  day1: {
    en: "Day 1 — post-procedure",
    he: "יום 1 — לאחר הטיפול",
    ar: "اليوم 1 — بعد الإجراء",
  },
  day7: {
    en: "Day 7 — optimal healed",
    he: "יום 7 — תוצאה מיטבית",
    ar: "اليوم 7 — نتيجة مثالية",
  },
  month3: {
    en: "Month 3 — stable",
    he: "חודש 3 — יציב",
    ar: "الشهر 3 — مستقر",
  },
  month6: {
    en: "Month 6 — absorption baseline",
    he: "חודש 6 — בסיס ספיגה",
    ar: "الشهر 6 — خط أساس الامتصاص",
  },
};
