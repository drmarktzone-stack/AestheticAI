import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { env } from "@/config/env";
import { detectAnomalies, maxRedFlagSeverity } from "@/lib/checkin/detectAnomalies";
import { submitDailyCheckIn } from "@/lib/checkin/client";
import { encryptSymptomNotes } from "@/lib/privacy/symptomEncryption";
import { triggerRedFlagNotification } from "@/lib/notifications/checkInNotifications";
import { uploadMedicalImage } from "@/lib/supabase/storage";
import type {
  CheckInLocale,
  CheckInRecord,
  ClinicAlert,
  SymptomFormState,
} from "@/lib/checkin/schema";
import type { z } from "zod";
import type { ImageSignalsSchema } from "@/lib/checkin/schema";

type ImageSignals = z.infer<typeof ImageSignalsSchema>;

export function useDailyCheckIn(patientId: string) {
  const { i18n, t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<CheckInRecord | null>(null);
  const [lastAlert, setLastAlert] = useState<ClinicAlert | null>(null);

  const locale = i18n.language as CheckInLocale;

  const submit = useCallback(
    async (input: {
      photoUri: string;
      symptoms: SymptomFormState;
      imageSignals?: ImageSignals;
      checkInDay?: number;
    }) => {
      setSubmitting(true);
      setError(null);

      try {
        const notesEncrypted = input.symptoms.notesPlain
          ? await encryptSymptomNotes(input.symptoms.notesPlain)
          : undefined;

        const { notesPlain: _plain, ...structured } = input.symptoms;
        const symptomsPayload = { ...structured, notesEncrypted };

        const previewFlags = detectAnomalies({
          symptoms: symptomsPayload,
          imageSignals: input.imageSignals,
        });

        const fileName = `checkin-${Date.now()}.jpg`;
        const upload = await uploadMedicalImage({
          localUri: input.photoUri,
          patientId,
          fileName,
          contentType: "image/jpeg",
        });

        let photoStoragePath: string;
        if (upload.error || !upload.path) {
          if (!env.isConfigured) {
            photoStoragePath = `local-dev/${patientId}/${fileName}`;
          } else {
            throw new Error(upload.error ?? t("storage.uploadError"));
          }
        } else {
          photoStoragePath = upload.path;
        }

        const { checkIn, alert } = await submitDailyCheckIn({
          patientId,
          locale,
          photoStoragePath,
          symptoms: symptomsPayload,
          imageSignals: input.imageSignals,
          checkInDay: input.checkInDay,
        });

        setLastCheckIn(checkIn);
        setLastAlert(alert);

        if (alert) {
          await triggerRedFlagNotification({
            title: t("notifications.redFlag.title"),
            body: t("notifications.redFlag.body"),
            alertId: alert.id,
          });
        }

        return { checkIn, alert, previewFlags, maxSeverity: maxRedFlagSeverity(previewFlags) };
      } catch (e) {
        const message = e instanceof Error ? e.message : t("checkin.error");
        setError(message);
        throw e;
      } finally {
        setSubmitting(false);
      }
    },
    [locale, patientId, t],
  );

  const reset = useCallback(() => {
    setLastCheckIn(null);
    setLastAlert(null);
    setError(null);
  }, []);

  const previewFlags = useMemo(() => {
    return lastCheckIn?.redFlags ?? [];
  }, [lastCheckIn]);

  return {
    submit,
    submitting,
    error,
    lastCheckIn,
    lastAlert,
    previewFlags,
    reset,
  };
}
