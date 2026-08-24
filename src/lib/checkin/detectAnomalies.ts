import type { DetectedRedFlag, RedFlagCode, RedFlagSeverity, SymptomQuestionnaire } from "@/lib/checkin/schema";
import type { z } from "zod";
import type { ImageSignalsSchema } from "@/lib/checkin/schema";

type ImageSignals = z.infer<typeof ImageSignalsSchema>;

interface AnomalyRule {
  code: RedFlagCode;
  severity: RedFlagSeverity;
  evaluate: (input: {
    symptoms: SymptomQuestionnaire;
    imageSignals?: ImageSignals;
  }) => boolean;
}

const ANOMALY_RULES: AnomalyRule[] = [
  {
    code: "severe_asymmetry",
    severity: "critical",
    evaluate: ({ symptoms }) => symptoms.asymmetry === "severe",
  },
  {
    code: "unexpected_bruising",
    severity: "high",
    evaluate: ({ symptoms }) => symptoms.bruising === "unexpected_spread",
  },
  {
    code: "systemic_pain",
    severity: "critical",
    evaluate: ({ symptoms }) => symptoms.systemicSymptoms || symptoms.painLevel >= 8,
  },
  {
    code: "fever_infection",
    severity: "critical",
    evaluate: ({ symptoms }) => symptoms.fever || symptoms.warmthOrDischarge,
  },
  {
    code: "vision_changes",
    severity: "critical",
    evaluate: ({ symptoms }) => symptoms.visionChanges,
  },
  {
    code: "severe_swelling",
    severity: "high",
    evaluate: ({ symptoms }) => symptoms.swelling === "severe",
  },
  {
    code: "image_asymmetry_signal",
    severity: "high",
    evaluate: ({ imageSignals }) => (imageSignals?.reportedAsymmetryScore ?? 0) >= 0.75,
  },
  {
    code: "image_bruising_signal",
    severity: "high",
    evaluate: ({ imageSignals }) => (imageSignals?.reportedBruisingCoverage ?? 0) >= 0.6,
  },
];

const SEVERITY_RANK: Record<RedFlagSeverity, number> = {
  high: 1,
  critical: 2,
};

export function detectAnomalies(input: {
  symptoms: SymptomQuestionnaire;
  imageSignals?: ImageSignals;
}): DetectedRedFlag[] {
  const flags: DetectedRedFlag[] = [];
  for (const rule of ANOMALY_RULES) {
    if (rule.evaluate(input)) {
      flags.push({ code: rule.code, severity: rule.severity });
    }
  }
  return flags.sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);
}

export function maxRedFlagSeverity(flags: DetectedRedFlag[]): RedFlagSeverity | null {
  if (flags.length === 0) return null;
  return flags.reduce<RedFlagSeverity>(
    (max, f) => (SEVERITY_RANK[f.severity] > SEVERITY_RANK[max] ? f.severity : max),
    "high",
  );
}

export function hasCriticalRedFlags(flags: DetectedRedFlag[]): boolean {
  return flags.some((f) => f.severity === "critical");
}
