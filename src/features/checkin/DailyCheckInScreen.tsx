import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/components/ui/AppIcon";
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
import { colors, radius, shadows } from "@/theme/colors";

function deriveImageSignals(symptoms: SymptomFormState) {
  return {
    reportedAsymmetryScore: symptoms.asymmetry === "severe" ? 0.82 : symptoms.asymmetry === "mild" ? 0.35 : 0,
    reportedBruisingCoverage: symptoms.bruising === "unexpected_spread" ? 0.68 : symptoms.bruising === "expected" ? 0.25 : 0,
    lightingQuality: "good" as const,
  };
}

export function DailyCheckInScreen({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { row, textStart } = useRTL();
  const { patientId, loading: identityLoading } = usePatientIdentity();
  const { submit, submitting, error, lastCheckIn, lastAlert, reset } = useDailyCheckIn(patientId ?? "00000000-0000-4000-8000-000000000000");
  const { scheduleReminder, scheduled, permissionGranted, refreshPermission } = useCheckInNotifications();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomFormState>({ ...DEFAULT_SYMPTOMS, notesPlain: "" });
  const [showRedFlag, setShowRedFlag] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const liveFlags = useMemo(() => detectAnomalies({ symptoms: { ...symptoms, notesEncrypted: undefined }, imageSignals: deriveImageSignals(symptoms) }), [symptoms]);

  const handleSubmit = async () => {
    if (!photoUri || !patientId) return;
    reset();
    const result = await submit({ photoUri, symptoms, imageSignals: deriveImageSignals(symptoms) });
    setSubmitted(true);
    if (result.alert || result.previewFlags.length > 0) setShowRedFlag(true);
  };

  const handleEnableReminders = async () => {
    await refreshPermission();
    await scheduleReminder({ hour: 9, minute: 0 });
  };

  if (identityLoading) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centered}><ActivityIndicator color={colors.accent} /></View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.content}>
      <View style={[styles.topBar, { flexDirection: row }]}>
        <Pressable accessibilityRole="button" accessibilityLabel={t("common.cancel")} onPress={onClose} hitSlop={12} style={styles.backButton}>
          <AppIcon name={row === "row" ? "arrowLeft" : "arrowRight"} color={colors.inkSoft} size={18} />
        </Pressable>
        <View style={[styles.statusChip, { flexDirection: row }]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{t("nav.checkin")}</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={[styles.title, { textAlign: textStart }]}>{t("checkin.title")}</Text>
        <Text style={[styles.subtitle, { textAlign: textStart }]}>{t("checkin.subtitle")}</Text>
      </View>

      <View style={[styles.protocolStrip, { flexDirection: row }]}>
        <View style={styles.protocolIcon}><AppIcon name="shield" color={colors.sageSoft} size={19} /></View>
        <Text style={[styles.protocolText, { textAlign: textStart }]}>{t("checkin.notesEncryptedHint")}</Text>
      </View>

      <View style={styles.card}>
        <View style={[styles.cardHeading, { flexDirection: row }]}>
          <View>
            <Text style={[styles.cardKicker, { textAlign: textStart }]}>01 / {t("checkin.photoTitle")}</Text>
            <Text style={[styles.cardTitle, { textAlign: textStart }]}>{t("checkin.photoHint")}</Text>
          </View>
          <View style={styles.iconBadge}><AppIcon name="camera" color={colors.accentSoft} size={20} /></View>
        </View>
        <CheckInPhotoPicker photoUri={photoUri} onPhotoChange={setPhotoUri} disabled={submitting} />
      </View>

      <View style={styles.card}>
        <View style={[styles.cardHeading, { flexDirection: row }]}>
          <View>
            <Text style={[styles.cardKicker, { textAlign: textStart }]}>02 / {t("checkin.questionnaireTitle")}</Text>
            <Text style={[styles.cardTitle, { textAlign: textStart }]}>{t("checkin.questionnaireTitle")}</Text>
          </View>
          <View style={[styles.iconBadge, styles.heartBadge]}><AppIcon name="heart" color={colors.pearl} size={20} /></View>
        </View>
        <SymptomQuestionnaire value={symptoms} onChange={setSymptoms} disabled={submitting} />

        <View style={styles.notesGroup}>
          <Text style={[styles.notesLabel, { textAlign: textStart }]}>{t("checkin.notesLabel")}</Text>
          <TextInput
            accessibilityLabel={t("checkin.notesLabel")}
            style={[styles.notesInput, { textAlign: textStart }]}
            value={symptoms.notesPlain ?? ""}
            onChangeText={(notesPlain) => setSymptoms((value) => ({ ...value, notesPlain }))}
            placeholder={t("checkin.notesPlaceholder")}
            placeholderTextColor={colors.muted}
            multiline
            editable={!submitting}
            autoCorrect={false}
          />
        </View>
      </View>

      {liveFlags.length > 0 && !submitted ? (
        <View style={[styles.alertCard, { flexDirection: row }]}>
          <View style={styles.alertIcon}><AppIcon name="alert" color={colors.warn} size={19} /></View>
          <View style={styles.alertBody}>
            <Text style={[styles.alertTitle, { textAlign: textStart }]}>{t("checkin.previewFlags")}</Text>
            {liveFlags.map((flag) => <Text key={flag.code} style={[styles.alertItem, { textAlign: textStart }]}>• {t(`checkin.redFlag.codes.${flag.code}`)}</Text>)}
          </View>
        </View>
      ) : null}

      <View style={styles.submitArea}>
        <Pressable
          accessibilityRole="button"
          style={[styles.submitBtn, (!photoUri || submitting) && styles.submitDisabled]}
          disabled={!photoUri || submitting}
          onPress={() => void handleSubmit()}
        >
          {submitting ? <ActivityIndicator color={colors.background} /> : <><Text style={styles.submitText}>{t("checkin.submit")}</Text><AppIcon name={row === "row" ? "arrowRight" : "arrowLeft"} color={colors.background} size={19} strokeWidth={2.2} /></>}
        </Pressable>
        {error ? <Text style={[styles.error, { textAlign: textStart }]}>{error}</Text> : null}
        {submitted && lastCheckIn && !lastCheckIn.hasRedFlags ? <View style={[styles.success, { flexDirection: row }]}><AppIcon name="check" color={colors.sageSoft} size={16} strokeWidth={2.4} /><Text style={styles.successText}>{t("checkin.success")}</Text></View> : null}
      </View>

      <View style={[styles.reminderCard, { flexDirection: row }]}>
        <View style={styles.reminderIcon}><AppIcon name="calendar" color={colors.accentSoft} size={19} /></View>
        <View style={styles.reminderBody}>
          <Text style={[styles.reminderTitle, { textAlign: textStart }]}>{t("checkin.reminderTitle")}</Text>
          <Text style={[styles.reminderCopy, { textAlign: textStart }]}>{t("checkin.reminderBody")}</Text>
          <Pressable accessibilityRole="button" onPress={() => void handleEnableReminders()} style={styles.reminderBtn}>
            <Text style={styles.reminderBtnText}>{scheduled ? t("checkin.reminderScheduled") : t("checkin.enableReminder")}</Text>
            <AppIcon name={row === "row" ? "chevronRight" : "chevronLeft"} color={colors.accentSoft} size={15} />
          </Pressable>
          {permissionGranted === false ? <Text style={[styles.error, { textAlign: textStart }]}>{t("checkin.notificationDenied")}</Text> : null}
        </View>
      </View>

      <View style={[styles.disclaimer, { flexDirection: row }]}>
        <AppIcon name="info" color={colors.mutedStrong} size={16} />
        <Text style={[styles.disclaimerText, { textAlign: textStart }]}>{t("checkin.disclaimer")}</Text>
      </View>

      <RedFlagAlertModal visible={showRedFlag && (lastAlert !== null || liveFlags.length > 0)} flags={lastCheckIn?.redFlags ?? liveFlags} onDismiss={() => setShowRedFlag(false)} onContactClinic={() => setShowRedFlag(false)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 26, gap: 16 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  topBar: { alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 42, height: 42, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  statusChip: { alignItems: "center", gap: 7, backgroundColor: "rgba(139, 212, 187, 0.1)", paddingHorizontal: 11, paddingVertical: 8, borderRadius: radius.pill },
  statusDot: { width: 6, height: 6, borderRadius: radius.pill, backgroundColor: colors.sage },
  statusText: { color: colors.sageSoft, fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  hero: { gap: 8, paddingTop: 4 },
  title: { color: colors.ink, fontSize: 31, lineHeight: 38, fontWeight: "700", letterSpacing: -0.8 },
  subtitle: { color: colors.mutedStrong, fontSize: 15, lineHeight: 22, maxWidth: "94%" },
  protocolStrip: { gap: 10, alignItems: "center", padding: 13, borderRadius: radius.md, backgroundColor: "rgba(139, 212, 187, 0.07)", borderWidth: 1, borderColor: "rgba(139, 212, 187, 0.18)" },
  protocolIcon: { width: 32, height: 32, borderRadius: radius.pill, backgroundColor: "rgba(139, 212, 187, 0.12)", alignItems: "center", justifyContent: "center" },
  protocolText: { color: colors.sageSoft, fontSize: 12, lineHeight: 18, flex: 1 },
  card: { backgroundColor: colors.glassStrong, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 17, gap: 14, ...shadows.soft },
  cardHeading: { justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  cardKicker: { color: colors.accentSoft, fontSize: 10, fontWeight: "800", letterSpacing: 0.9, textTransform: "uppercase" },
  cardTitle: { color: colors.ink, fontSize: 17, lineHeight: 23, fontWeight: "700", marginTop: 3 },
  iconBadge: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surfaceElevated, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  heartBadge: { borderColor: "rgba(246, 237, 230, 0.2)" },
  notesGroup: { gap: 8, marginTop: 2 },
  notesLabel: { color: colors.inkSoft, fontSize: 13, fontWeight: "700" },
  notesInput: { minHeight: 88, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.sm, padding: 13, color: colors.ink, backgroundColor: "rgba(8, 9, 26, 0.32)", fontSize: 14, lineHeight: 20, textAlignVertical: "top" },
  alertCard: { alignItems: "flex-start", gap: 10, borderWidth: 1, borderColor: "rgba(244, 189, 108, 0.42)", borderRadius: radius.md, padding: 14, backgroundColor: "rgba(244, 189, 108, 0.10)" },
  alertIcon: { width: 30, height: 30, borderRadius: radius.pill, backgroundColor: "rgba(244, 189, 108, 0.15)", alignItems: "center", justifyContent: "center" },
  alertBody: { flex: 1, gap: 4 },
  alertTitle: { color: colors.warn, fontSize: 14, fontWeight: "800" },
  alertItem: { color: colors.inkSoft, fontSize: 12, lineHeight: 18 },
  submitArea: { gap: 10 },
  submitBtn: { minHeight: 55, borderRadius: radius.md, backgroundColor: colors.accent, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, paddingHorizontal: 16, ...shadows.glow },
  submitDisabled: { opacity: 0.42 },
  submitText: { color: colors.background, fontSize: 15, fontWeight: "800" },
  error: { color: colors.dangerSoft, fontSize: 12, lineHeight: 18 },
  success: { alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 8 },
  successText: { color: colors.sageSoft, fontSize: 13, fontWeight: "700" },
  reminderCard: { alignItems: "flex-start", gap: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 15 },
  reminderIcon: { marginTop: 1, width: 34, height: 34, borderRadius: radius.pill, backgroundColor: "rgba(188, 162, 246, 0.12)", alignItems: "center", justifyContent: "center" },
  reminderBody: { flex: 1, gap: 5 },
  reminderTitle: { color: colors.inkSoft, fontSize: 14, fontWeight: "800" },
  reminderCopy: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  reminderBtn: { minHeight: 36, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  reminderBtnText: { color: colors.accentSoft, fontSize: 12, fontWeight: "800" },
  disclaimer: { alignItems: "flex-start", gap: 8, padding: 13, borderRadius: radius.md, backgroundColor: "rgba(252, 250, 255, 0.035)" },
  disclaimerText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 18 },
});
