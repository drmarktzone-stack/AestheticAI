import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { CheckInPhotoPicker } from "@/features/checkin/components/CheckInPhotoPicker";
import { RedFlagAlertModal } from "@/features/checkin/components/RedFlagAlertModal";
import { SymptomQuestionnaire } from "@/features/checkin/components/SymptomQuestionnaire";
import { useCheckInNotifications } from "@/hooks/useCheckInNotifications";
import { useDailyCheckIn } from "@/hooks/useDailyCheckIn";
import { usePatientIdentity } from "@/hooks/usePatientIdentity";
import { useRTL } from "@/hooks/useRTL";
import { detectAnomalies } from "@/lib/checkin/detectAnomalies";
import { DEFAULT_SYMPTOMS, type SymptomFormState } from "@/lib/checkin/schema";
import { colors } from "@/theme/colors";

function deriveImageSignals(symptoms: SymptomFormState) {
  return {
    reportedAsymmetryScore: symptoms.asymmetry === "severe" ? 0.82 : symptoms.asymmetry === "mild" ? 0.35 : 0,
    reportedBruisingCoverage:
      symptoms.bruising === "unexpected_spread" ? 0.68 : symptoms.bruising === "expected" ? 0.25 : 0,
    lightingQuality: "good" as const,
  };
}

export function DailyCheckInScreen({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { textStart } = useRTL();
  const { patientId, loading: identityLoading } = usePatientIdentity();
  const { submit, submitting, error, lastCheckIn, lastAlert, reset } = useDailyCheckIn(
    patientId ?? "00000000-0000-4000-8000-000000000000",
  );
  const { scheduleReminder, scheduled, permissionGranted, refreshPermission } =
    useCheckInNotifications();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomFormState>({ ...DEFAULT_SYMPTOMS, notesPlain: "" });
  const [showRedFlag, setShowRedFlag] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const liveFlags = useMemo(
    () =>
      detectAnomalies({
        symptoms: { ...symptoms, notesEncrypted: undefined },
        imageSignals: deriveImageSignals(symptoms),
      }),
    [symptoms],
  );

  const handleSubmit = async () => {
    if (!photoUri || !patientId) return;

    reset();
    const result = await submit({
      photoUri,
      symptoms,
      imageSignals: deriveImageSignals(symptoms),
    });

    setSubmitted(true);
    if (result.alert || result.previewFlags.length > 0) {
      setShowRedFlag(true);
    }
  };

  const handleEnableReminders = async () => {
    await refreshPermission();
    await scheduleReminder({ hour: 9, minute: 0 });
  };

  if (identityLoading) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={12}>
          <Text style={styles.back}>{t("common.cancel")}</Text>
        </Pressable>
        <Text style={[styles.title, { textAlign: textStart }]}>{t("checkin.title")}</Text>
        <Text style={[styles.subtitle, { textAlign: textStart }]}>{t("checkin.subtitle")}</Text>
      </View>

      <View style={styles.card}>
        <CheckInPhotoPicker
          photoUri={photoUri}
          onPhotoChange={setPhotoUri}
          disabled={submitting}
        />
      </View>

      <View style={styles.card}>
        <SymptomQuestionnaire value={symptoms} onChange={setSymptoms} disabled={submitting} />

        <Text style={[styles.notesLabel, { textAlign: textStart }]}>{t("checkin.notesLabel")}</Text>
        <TextInput
          style={[styles.notesInput, { textAlign: textStart }]}
          value={symptoms.notesPlain ?? ""}
          onChangeText={(notesPlain) => setSymptoms((s) => ({ ...s, notesPlain }))}
          placeholder={t("checkin.notesPlaceholder")}
          placeholderTextColor={colors.muted}
          multiline
          editable={!submitting}
          secureTextEntry={false}
          autoCorrect={false}
        />
        <Text style={[styles.encryptedHint, { textAlign: textStart }]}>
          {t("checkin.notesEncryptedHint")}
        </Text>
      </View>

      {liveFlags.length > 0 && !submitted ? (
        <View style={[styles.warnCard, { borderColor: colors.warn }]}>
          <Text style={[styles.warnTitle, { textAlign: textStart }]}>{t("checkin.previewFlags")}</Text>
          {liveFlags.map((f) => (
            <Text key={f.code} style={[styles.warnItem, { textAlign: textStart }]}>
              • {t(`checkin.redFlag.codes.${f.code}`)}
            </Text>
          ))}
        </View>
      ) : null}

      <Pressable
        style={[styles.submitBtn, (!photoUri || submitting) && styles.submitDisabled]}
        disabled={!photoUri || submitting}
        onPress={() => void handleSubmit()}
      >
        {submitting ? (
          <ActivityIndicator color="#f4fffd" />
        ) : (
          <Text style={styles.submitText}>{t("checkin.submit")}</Text>
        )}
      </Pressable>

      {error ? <Text style={[styles.error, { textAlign: textStart }]}>{error}</Text> : null}

      {submitted && lastCheckIn && !lastCheckIn.hasRedFlags ? (
        <Text style={[styles.success, { textAlign: textStart }]}>{t("checkin.success")}</Text>
      ) : null}

      <View style={styles.card}>
        <Text style={[styles.reminderTitle, { textAlign: textStart }]}>
          {t("checkin.reminderTitle")}
        </Text>
        <Text style={[styles.reminderBody, { textAlign: textStart }]}>
          {t("checkin.reminderBody")}
        </Text>
        <Pressable style={styles.reminderBtn} onPress={() => void handleEnableReminders()}>
          <Text style={styles.reminderBtnText}>
            {scheduled ? t("checkin.reminderScheduled") : t("checkin.enableReminder")}
          </Text>
        </Pressable>
        {permissionGranted === false ? (
          <Text style={[styles.error, { textAlign: textStart }]}>{t("checkin.notificationDenied")}</Text>
        ) : null}
      </View>

      <Text style={[styles.disclaimer, { textAlign: textStart }]}>{t("checkin.disclaimer")}</Text>

      <RedFlagAlertModal
        visible={showRedFlag && (lastAlert !== null || liveFlags.length > 0)}
        flags={lastCheckIn?.redFlags ?? liveFlags}
        onDismiss={() => setShowRedFlag(false)}
        onContactClinic={() => setShowRedFlag(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6 },
  back: { color: colors.accentSoft, fontSize: 15, fontWeight: "600" },
  title: { color: colors.ink, fontSize: 24, fontWeight: "600" },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  card: {
    backgroundColor: "rgba(8,22,27,0.55)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.1)",
    padding: 16,
    gap: 12,
  },
  notesLabel: { color: colors.inkSoft, fontSize: 14, fontWeight: "500" },
  notesInput: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.15)",
    borderRadius: 12,
    padding: 12,
    color: colors.ink,
    fontSize: 14,
  },
  encryptedHint: { color: colors.muted, fontSize: 12 },
  warnCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
    backgroundColor: "rgba(192,149,74,0.12)",
  },
  warnTitle: { color: colors.warn, fontWeight: "600" },
  warnItem: { color: colors.inkSoft, fontSize: 13 },
  submitBtn: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: "#f4fffd", fontWeight: "700", fontSize: 15 },
  error: { color: colors.danger, fontSize: 13 },
  success: { color: colors.accentSoft, fontSize: 14, fontWeight: "600" },
  reminderTitle: { color: colors.ink, fontSize: 15, fontWeight: "600" },
  reminderBody: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  reminderBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  reminderBtnText: { color: colors.accentSoft, fontWeight: "600" },
  disclaimer: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
});
