import { z } from "zod";

export const CheckInLocaleSchema = z.enum(["en", "he", "ar"]);
export type CheckInLocale = z.infer<typeof CheckInLocaleSchema>;

export const SwellingLevelSchema = z.enum(["none", "mild", "moderate", "severe"]);
export const BruisingLevelSchema = z.enum(["none", "expected", "unexpected_spread"]);
export const AsymmetryLevelSchema = z.enum(["none", "mild", "severe"]);

export const SymptomQuestionnaireSchema = z.object({
  painLevel: z.number().int().min(0).max(10),
  swelling: SwellingLevelSchema,
  bruising: BruisingLevelSchema,
  asymmetry: AsymmetryLevelSchema,
  fever: z.boolean(),
  systemicSymptoms: z.boolean(),
  visionChanges: z.boolean(),
  warmthOrDischarge: z.boolean(),
  /** Encrypted client-side before transmission — server stores as opaque blob */
  notesEncrypted: z.string().max(32_000).optional(),
});

export const ImageSignalsSchema = z
  .object({
    reportedAsymmetryScore: z.number().min(0).max(1).optional(),
    reportedBruisingCoverage: z.number().min(0).max(1).optional(),
    lightingQuality: z.enum(["poor", "fair", "good"]).optional(),
  })
  .optional();

export const SubmitCheckInRequestSchema = z.object({
  patientId: z.string().uuid(),
  locale: CheckInLocaleSchema.default("en"),
  photoStoragePath: z.string().min(1).max(512),
  symptoms: SymptomQuestionnaireSchema,
  imageSignals: ImageSignalsSchema,
  checkInDay: z.number().int().min(1).max(365).optional(),
});

export const RedFlagSeveritySchema = z.enum(["high", "critical"]);
export type RedFlagSeverity = z.infer<typeof RedFlagSeveritySchema>;

export const RedFlagCodeSchema = z.enum([
  "severe_asymmetry",
  "unexpected_bruising",
  "systemic_pain",
  "fever_infection",
  "vision_changes",
  "severe_swelling",
  "image_asymmetry_signal",
  "image_bruising_signal",
]);
export type RedFlagCode = z.infer<typeof RedFlagCodeSchema>;

export const DetectedRedFlagSchema = z.object({
  code: RedFlagCodeSchema,
  severity: RedFlagSeveritySchema,
});

export const CheckInRecordSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  physicianId: z.string().uuid(),
  photoStoragePath: z.string(),
  symptomsSummary: SymptomQuestionnaireSchema.omit({ notesEncrypted: true }),
  notesEncrypted: z.string().optional(),
  redFlags: z.array(DetectedRedFlagSchema),
  hasRedFlags: z.boolean(),
  maxSeverity: RedFlagSeveritySchema.nullable(),
  checkInDay: z.number().int().nullable(),
  locale: CheckInLocaleSchema,
  createdAt: z.string().datetime(),
});

export const ClinicAlertSchema = z.object({
  id: z.string().uuid(),
  checkInId: z.string().uuid(),
  patientId: z.string().uuid(),
  physicianId: z.string().uuid(),
  redFlags: z.array(DetectedRedFlagSchema),
  maxSeverity: RedFlagSeveritySchema,
  acknowledged: z.boolean(),
  locale: CheckInLocaleSchema,
  createdAt: z.string().datetime(),
});

export const SubmitCheckInSuccessSchema = z.object({
  success: z.literal(true),
  checkIn: CheckInRecordSchema,
  alert: ClinicAlertSchema.nullable(),
});

export type SymptomQuestionnaire = z.infer<typeof SymptomQuestionnaireSchema>;
export type SubmitCheckInRequest = z.infer<typeof SubmitCheckInRequestSchema>;
export type DetectedRedFlag = z.infer<typeof DetectedRedFlagSchema>;
export type CheckInRecord = z.infer<typeof CheckInRecordSchema>;
export type ClinicAlert = z.infer<typeof ClinicAlertSchema>;
