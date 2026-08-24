import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { analyzeFaceFromUri, type AnalyzeFaceFromUriInput } from "@/lib/ai/analyzeFace";
import type { FaceAnalysisResponse } from "@/lib/ai/schema";
import type { AnalysisLocale } from "@/lib/ai/schema";

export function useFaceAnalysis() {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FaceAnalysisResponse | null>(null);

  const analyze = useCallback(
    async (input: Omit<AnalyzeFaceFromUriInput, "locale"> & { locale?: AnalysisLocale }) => {
      setLoading(true);
      setError(null);
      try {
        const locale = input.locale ?? (i18n.language as AnalysisLocale);
        const { data } = await analyzeFaceFromUri({ ...input, locale });
        setResult(data);
        return data;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Analysis failed";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [i18n.language],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { analyze, loading, error, result, reset };
}
