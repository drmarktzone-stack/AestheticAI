import type { AnalysisLocale, FaceAnalysisModelOutput } from "./schema.ts";

const LOCALE_NAMES: Record<AnalysisLocale, string> = {
  en: "English",
  he: "Hebrew",
  ar: "Arabic",
};

export function localeInstruction(locale: AnalysisLocale): string {
  return `Write summaryEn and recommendationsEn in ${LOCALE_NAMES[locale]}. Use clinical aesthetic medicine terminology appropriate for a licensed physician audience.`;
}

export function buildVisionSystemPrompt(locale: AnalysisLocale): string {
  return [
    "You are a clinical aesthetic imaging assistant for licensed physicians.",
    "Analyze the provided facial photograph conservatively.",
    "Return ONLY JSON matching the schema.",
    "Use normalized landmark coordinates (0-1) relative to image width/height.",
    "Estimate symmetry as left vs right hemisphere balance percentage.",
    "Score wrinkles 0-10 depth per region: forehead, nasolabial, crow_feet, glabella, perioral.",
    "Score skin quality 0-100: hydration, texture, redness, pigmentation.",
    "clinicalTags must be snake_case machine tags (e.g. midface_volume_loss, periorbital_wrinkling).",
    "Do NOT diagnose medical conditions. Do NOT recommend specific drug doses.",
    localeInstruction(locale),
  ].join(" ");
}

export async function localizeReport(
  core: FaceAnalysisModelOutput,
  locale: AnalysisLocale,
  translate: (text: string, target: AnalysisLocale) => Promise<string>,
  translateList: (items: string[], target: AnalysisLocale) => Promise<string[]>,
): Promise<{ summary: string; recommendations: string[] }> {
  if (locale === "en") {
    return { summary: core.summaryEn, recommendations: core.recommendationsEn };
  }

  const [summary, recommendations] = await Promise.all([
    translate(core.summaryEn, locale),
    translateList(core.recommendationsEn, locale),
  ]);

  return { summary, recommendations };
}

export function buildFallbackSummary(locale: AnalysisLocale): string {
  const map: Record<AnalysisLocale, string> = {
    en: "Automated analysis unavailable. Manual clinical assessment required.",
    he: "ניתוח אוטומטי לא זמין. נדרשת הערכה קלינית ידנית.",
    ar: "التحليل الآلي غير متاح. يلزم تقييم سريري يدوي.",
  };
  return map[locale];
}

export function buildFallbackRecommendations(locale: AnalysisLocale): string[] {
  const map: Record<AnalysisLocale, string[]> = {
    en: ["Repeat capture with standardized lighting and alignment.", "Review symmetry and skin findings manually."],
    he: ["חזור על הצילום בתאורה ויישור סטנדרטיים.", "סקור ידנית סימטריה וממצאי עור."],
    ar: ["أعد الالتقاط بإضاءة ومحاذاة معيارية.", "راجع التماثل وم findings الجلد يدوياً."],
  };
  return map[locale];
}
