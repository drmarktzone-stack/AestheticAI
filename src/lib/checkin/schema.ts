import { z } from "zod";

export const CheckInLocaleSchema = z.enum(["en", "he", "ar"]);
export type CheckInLocale = z.infer<typeof CheckInLocaleSchema>;

export const SwellingLevelSchema = z.enum(["none", "mild", "moderate", "severe"]);
export const BruisingLevelSchema = z.enum(["none", "expected", "unexpected_spread"]);
export const AsymmetryLevelSchema = z.enum(["none", "mild", "severe"]);

export type SwellingLevel = z.infer<typeof SwellingLevelSchema>;
export type BruisingLevel = z.infer<typeof BruisingLevelSchema>;
export type AsymmetryLevel = z.infer<typeof AsymmetryLevelSchema>;

export const SymptomQuestionnaireSchema = z.object({
  painLevel: z.number().int().min(0).max(10),
  swelling: SwellingLevelSchema,
  bruising: BruisingLevelSchema,
  asymmetry: AsymmetryLevelSchema,
  fever: z.boolean(),
  systemicSymptoms: z.boolean(),
  visionChanges: z.boolean(),
  warmthOrDischarge: z.boolean(),
  notesEncrypted: z.string().max(32_000).optional(),
});

export const ImageSignalsSchema = z
  .object({
    reportedAsymmetryScore: z.number().min(0).max(1).optional(),
    reportedBruisingCoverage: z.number().min(0).max(1).optional(),
    lightingQuality: z.enum(["poor", "fair", "good"]).optional(),
  })
  .optional();

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

export const ClinicAlertsSuccessSchema = z.object({
  success: z.literal(true),
  alerts: z.array(ClinicAlertSchema),
});

export const CheckInApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    retryable: z.boolean(),
  }),
});

export const SubmitCheckInResponseSchema = z.discriminatedUnion("success", [
  SubmitCheckInSuccessSchema,
  CheckInApiErrorSchema,
]);

export const ClinicAlertsResponseSchema = z.discriminatedUnion("success", [
  ClinicAlertsSuccessSchema,
  CheckInApiErrorSchema,
]);

export type SymptomQuestionnaire = z.infer<typeof SymptomQuestionnaireSchema>;
export type DetectedRedFlag = z.infer<typeof DetectedRedFlagSchema>;
export type CheckInRecord = z.infer<typeof CheckInRecordSchema>;
export type ClinicAlert = z.infer<typeof ClinicAlertSchema>;

export const DEFAULT_SYMPTOMS: Omit<SymptomQuestionnaire, "notesEncrypted"> = {
  painLevel: 0,
  swelling: "none",
  bruising: "none",
  asymmetry: "none",
  fever: false,
  systemicSymptoms: false,
  visionChanges: false,
  warmthOrDischarge: false,
};

export interface SymptomFormState extends Omit<SymptomQuestionnaire, "notesEncrypted"> {
  notesPlain?: string;
}
