import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  pollTimelineJob,
  startTimelineFromUri,
  type ProcedureId,
  type StartTimelineFromUriInput,
  type TimelineJob,
  type TimelineLocale,
} from "@/lib/timeline";
import { isTerminalJobStatus } from "@/lib/timeline/schema";

const POLL_MS = 2500;

export function useTimelineJob() {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<TimelineJob | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
    setPolling(false);
  }, []);

  const refresh = useCallback(async (jobId: string) => {
    const next = await pollTimelineJob(jobId);
    setJob(next);
    return next;
  }, []);

  const startPolling = useCallback(
    (jobId: string) => {
      stopPolling();
      setPolling(true);

      pollTimer.current = setInterval(() => {
        void pollTimelineJob(jobId)
          .then((next) => {
            setJob(next);
            if (isTerminalJobStatus(next.status)) {
              stopPolling();
            }
          })
          .catch(() => {
            /* keep polling on transient errors */
          });
      }, POLL_MS);
    },
    [stopPolling],
  );

  useEffect(() => () => stopPolling(), [stopPolling]);

  const start = useCallback(
    async (
      input: Omit<StartTimelineFromUriInput, "locale"> & { locale?: TimelineLocale; procedureId: ProcedureId },
    ) => {
      setLoading(true);
      setError(null);
      stopPolling();

      try {
        const locale = input.locale ?? (i18n.language as TimelineLocale);
        const initial = await startTimelineFromUri({ ...input, locale });
        setJob(initial);

        if (!isTerminalJobStatus(initial.status)) {
          startPolling(initial.jobId);
        }

        return initial;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Timeline generation failed";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [i18n.language, startPolling, stopPolling],
  );

  const reset = useCallback(() => {
    stopPolling();
    setJob(null);
    setError(null);
  }, [stopPolling]);

  return {
    start,
    refresh,
    reset,
    loading,
    polling,
    error,
    job,
  };
}
