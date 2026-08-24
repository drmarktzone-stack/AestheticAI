import { useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/components/ui/AppIcon";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ProcedurePicker } from "@/features/timeline/components/ProcedurePicker";
import { TimelineCompareView } from "@/features/timeline/components/TimelineCompareView";
import { TimelineScrubber } from "@/features/timeline/components/TimelineScrubber";
import { useTimelineJob } from "@/hooks/useTimelineJob";
import { useRTL } from "@/hooks/useRTL";
import { activeProcessingMilestone, milestoneImageMap, type ProcedureId } from "@/lib/timeline/schema";
import { colors, radius, shadows } from "@/theme/colors";

export function TimelineSimulatorScreen({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { row, textStart } = useRTL();
  const { start, reset, loading, polling, error, job } = useTimelineJob();

  const [baselineUri, setBaselineUri] = useState<string | null>(null);
  const [procedureId, setProcedureId] = useState<ProcedureId>("lip_filler");
  const [scrubValue, setScrubValue] = useState(1);

  const milestoneImages = useMemo(() => (job ? milestoneImageMap(job) : {}), [job]);
  const progressMessage = useMemo(() => {
    if (!job) return t("timeline.loading.queued");
    if (job.status === "completed") return t("timeline.loading.done");
    if (job.status === "failed") return t("timeline.loading.failed");
    const active = activeProcessingMilestone(job);
    if (active) return t(`timeline.loading.${active}`);
    if (job.progress >= 90) return t("timeline.loading.finalizing");
    return t("timeline.loading.queued");
  }, [job, t]);

  const pickBaseline = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.92,
      allowsEditing: true,
      aspect: [3, 4],
    });

    if (!result.canceled && result.assets[0]) {
      setBaselineUri(result.assets[0].uri);
      reset();
      setScrubValue(1);
    }
  };

  const runSimulation = async () => {
    if (!baselineUri) return;
    reset();
    await start({ imageUri: baselineUri, procedureId });
  };

  const busy = loading || polling;
  const hasResults = Object.keys(milestoneImages).length > 0;
  const canRun = Boolean(baselineUri) && !busy;

  return (
    <ScreenContainer style={styles.content}>
      <View style={[styles.topBar, { flexDirection: row }]}>
        <Pressable accessibilityRole="button" onPress={onClose} hitSlop={12} style={styles.backButton}>
          <AppIcon name={row === "row" ? "arrowLeft" : "arrowRight"} color={colors.inkSoft} size={18} />
        </Pressable>
        <View style={[styles.statusChip, { flexDirection: row }]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{t("nav.simulation")}</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={[styles.title, { textAlign: textStart }]}>{t("timeline.title")}</Text>
        <Text style={[styles.subtitle, { textAlign: textStart }]}>{t("timeline.subtitle")}</Text>
      </View>

      <View style={styles.stepRow}>
        <View style={[styles.stepToken, baselineUri && styles.stepTokenComplete]}><Text style={styles.stepNumber}>01</Text></View>
        <View style={styles.stepLine} />
        <View style={[styles.stepToken, busy && styles.stepTokenComplete]}><Text style={styles.stepNumber}>02</Text></View>
        <View style={styles.stepLine} />
        <View style={[styles.stepToken, hasResults && styles.stepTokenComplete]}><Text style={styles.stepNumber}>03</Text></View>
      </View>

      <View style={styles.card}>
        <View style={[styles.cardHeading, { flexDirection: row }]}>
          <View>
            <Text style={[styles.cardKicker, { textAlign: textStart }]}>01 / {t("timeline.baseline")}</Text>
            <Text style={[styles.cardTitle, { textAlign: textStart }]}>{t("timeline.baselinePhoto")}</Text>
          </View>
          <View style={styles.iconBadge}><AppIcon name="camera" color={colors.accentSoft} size={20} /></View>
        </View>

        <Pressable accessibilityRole="button" onPress={() => void pickBaseline()} disabled={busy} style={({ pressed }) => [styles.imageWell, pressed && !busy && styles.pressed]}>
          {baselineUri ? (
            <Image source={{ uri: baselineUri }} style={styles.preview} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderContent}>
              <View style={styles.placeholderIcon}><AppIcon name="camera" color={colors.accentSoft} size={24} /></View>
              <Text style={styles.placeholderTitle}>{t("timeline.pickPhoto")}</Text>
              <Text style={styles.placeholderCopy}>3:4 · {t("camera.guide.ready")}</Text>
            </View>
          )}
          {baselineUri ? <View style={styles.photoPill}><AppIcon name="check" color={colors.background} size={13} strokeWidth={2.4} /><Text style={styles.photoPillText}>{t("timeline.baseline")}</Text></View> : null}
        </Pressable>

        <Pressable onPress={() => void pickBaseline()} disabled={busy} style={[styles.textAction, busy && styles.disabled]}>
          <Text style={styles.textActionText}>{baselineUri ? t("timeline.changePhoto") : t("timeline.pickPhoto")}</Text>
          <AppIcon name={row === "row" ? "arrowRight" : "arrowLeft"} color={colors.accentSoft} size={16} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={[styles.cardHeading, { flexDirection: row }]}>
          <View>
            <Text style={[styles.cardKicker, { textAlign: textStart }]}>02 / {t("timeline.procedureLabel")}</Text>
            <Text style={[styles.cardTitle, { textAlign: textStart }]}>{t("timeline.procedureLabel")}</Text>
          </View>
          <View style={styles.iconBadge}><AppIcon name="spark" color={colors.pearl} size={20} /></View>
        </View>

        <ProcedurePicker value={procedureId} onChange={setProcedureId} disabled={busy} />
        <Pressable
          accessibilityRole="button"
          style={[styles.primaryBtn, !canRun && styles.primaryBtnDisabled]}
          onPress={() => void runSimulation()}
          disabled={!canRun}
        >
          {busy ? (
            <View style={[styles.loadingRow, { flexDirection: row }]}>
              <ActivityIndicator color={colors.background} size="small" />
              <Text style={styles.primaryBtnText}>{progressMessage}</Text>
            </View>
          ) : (
            <View style={[styles.loadingRow, { flexDirection: row }]}>
              <Text style={styles.primaryBtnText}>{t("timeline.generate")}</Text>
              <AppIcon name={row === "row" ? "arrowRight" : "arrowLeft"} color={colors.background} size={19} strokeWidth={2.2} />
            </View>
          )}
        </Pressable>

        {job ? <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${job.progress}%` }]} /></View> : null}
        {error ? <Text style={[styles.errorText, { textAlign: textStart }]}>{error}</Text> : null}
        {job?.status === "partial" ? <Text style={[styles.warnText, { textAlign: textStart }]}>{t("timeline.partial")}</Text> : null}
      </View>

      {baselineUri && (hasResults || busy) ? (
        <View style={[styles.card, styles.resultsCard]}>
          <View style={[styles.cardHeading, { flexDirection: row }]}>
            <View>
              <Text style={[styles.cardKicker, { textAlign: textStart }]}>03 / {t("timeline.compareCaption", { milestone: "" })}</Text>
              <Text style={[styles.cardTitle, { textAlign: textStart }]}>{t("timeline.title")}</Text>
            </View>
            <View style={[styles.iconBadge, styles.resultIconBadge]}><AppIcon name="chart" color={colors.sageSoft} size={20} /></View>
          </View>
          <TimelineCompareView baselineUri={baselineUri} scrubValue={scrubValue} milestoneImages={milestoneImages} />
          <TimelineScrubber value={scrubValue} onChange={setScrubValue} disabled={!hasResults} />
        </View>
      ) : null}

      <View style={[styles.disclaimer, { flexDirection: row }]}>
        <AppIcon name="info" color={colors.mutedStrong} size={16} />
        <Text style={[styles.disclaimerText, { textAlign: textStart }]}>{t("timeline.disclaimer")}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 26, gap: 16 },
  topBar: { alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 42, height: 42, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  statusChip: { alignItems: "center", gap: 7, backgroundColor: "rgba(188, 162, 246, 0.11)", paddingHorizontal: 11, paddingVertical: 8, borderRadius: radius.pill },
  statusDot: { width: 6, height: 6, borderRadius: radius.pill, backgroundColor: colors.accent },
  statusText: { color: colors.accentSoft, fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  hero: { gap: 8, paddingTop: 4 },
  title: { color: colors.ink, fontSize: 31, lineHeight: 38, fontWeight: "700", letterSpacing: -0.8 },
  subtitle: { color: colors.mutedStrong, fontSize: 15, lineHeight: 22, maxWidth: "94%" },
  stepRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  stepToken: { width: 29, height: 29, borderRadius: radius.pill, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  stepTokenComplete: { backgroundColor: colors.accent, borderColor: colors.accent },
  stepNumber: { color: colors.inkSoft, fontSize: 10, fontWeight: "800" },
  stepLine: { height: 1, flex: 1, backgroundColor: colors.borderStrong },
  card: { backgroundColor: colors.glassStrong, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 17, gap: 14, ...shadows.soft },
  resultsCard: { borderColor: "rgba(139, 212, 187, 0.22)" },
  cardHeading: { justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  cardKicker: { color: colors.accentSoft, fontSize: 10, fontWeight: "800", letterSpacing: 0.9, textTransform: "uppercase" },
  cardTitle: { color: colors.ink, fontSize: 18, lineHeight: 24, fontWeight: "700", marginTop: 3 },
  iconBadge: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surfaceElevated, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  resultIconBadge: { backgroundColor: "rgba(139, 212, 187, 0.11)", borderColor: "rgba(139, 212, 187, 0.2)" },
  imageWell: { width: "100%", aspectRatio: 1.18, borderRadius: radius.md, overflow: "hidden", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  preview: { width: "100%", height: "100%" },
  pressed: { opacity: 0.84 },
  placeholderContent: { alignItems: "center", gap: 8 },
  placeholderIcon: { width: 46, height: 46, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(188, 162, 246, 0.12)", borderWidth: 1, borderColor: "rgba(188, 162, 246, 0.25)" },
  placeholderTitle: { color: colors.inkSoft, fontSize: 14, fontWeight: "700" },
  placeholderCopy: { color: colors.muted, fontSize: 11 },
  photoPill: { position: "absolute", top: 12, right: 12, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: colors.sage, paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill },
  photoPillText: { color: colors.background, fontSize: 11, fontWeight: "800" },
  textAction: { minHeight: 36, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5 },
  textActionText: { color: colors.accentSoft, fontSize: 13, fontWeight: "800" },
  primaryBtn: { minHeight: 54, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  primaryBtnDisabled: { opacity: 0.42 },
  loadingRow: { alignItems: "center", justifyContent: "center", gap: 9 },
  primaryBtnText: { color: colors.background, fontSize: 15, fontWeight: "800" },
  progressTrack: { height: 6, backgroundColor: "rgba(252, 250, 255, 0.10)", borderRadius: radius.pill, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: radius.pill, backgroundColor: colors.sage },
  errorText: { color: colors.dangerSoft, fontSize: 13, lineHeight: 19 },
  warnText: { color: colors.warn, fontSize: 13, lineHeight: 19 },
  disabled: { opacity: 0.45 },
  disclaimer: { alignItems: "flex-start", gap: 8, padding: 13, borderRadius: radius.md, backgroundColor: "rgba(252, 250, 255, 0.035)" },
  disclaimerText: { color: colors.muted, fontSize: 12, lineHeight: 18, flex: 1 },
});
