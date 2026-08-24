import type { MilestoneId, ProcedureId, TimelineLocale } from "./schema.ts";

interface MilestonePrompt {
  prompt: string;
  strength: number;
}

type PromptMap = Record<MilestoneId, MilestonePrompt>;

const BASE_QUALITY =
  "clinical aesthetic portrait, same identity, same pose, photorealistic, neutral studio lighting, front-facing";

function procedureContext(procedureId: ProcedureId): string {
  const map: Record<ProcedureId, string> = {
    lip_filler: "lip filler procedure",
    botox_forehead: "forehead botulinum toxin treatment",
    rhinoplasty: "rhinoplasty nasal refinement",
    cheek_filler: "cheek dermal filler volumization",
    jawline_contour: "jawline contour filler",
  };
  return map[procedureId];
}

export function buildMilestonePrompts(
  procedureId: ProcedureId,
  _locale: TimelineLocale,
): PromptMap {
  const ctx = procedureContext(procedureId);

  return {
    day1: {
      prompt: `${BASE_QUALITY}, ${ctx}, day 1 post-procedure, subtle swelling, mild erythema, early healing`,
      strength: 0.42,
    },
    day7: {
      prompt: `${BASE_QUALITY}, ${ctx}, day 7 healed optimal aesthetic outcome, natural balanced result`,
      strength: 0.38,
    },
    month3: {
      prompt: `${BASE_QUALITY}, ${ctx}, month 3 stable maintained aesthetic result`,
      strength: 0.34,
    },
    month6: {
      prompt: `${BASE_QUALITY}, ${ctx}, month 6 gradual filler absorption baseline, subtle natural appearance`,
      strength: 0.3,
    },
  };
}
