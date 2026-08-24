import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ProcedurePicker } from "@/features/timeline/components/ProcedurePicker";
import { TimelineCompareView } from "@/features/timeline/components/TimelineCompareView";
import { TimelineScrubber } from "@/features/timeline/components/TimelineScrubber";
import { useTimelineJob } from "@/hooks/useTimelineJob";
import { useRTL } from "@/hooks/useRTL";
import {
  activeProcessingMilestone,
  milestoneImageMap,
  type ProcedureId,
} from "@/lib/timeline/schema";
import { colors } from "@/theme/colors";

export function TimelineSimulatorScreen({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { textStart } = useRTL();
  const { start, reset, loading, polling, error, job } = useTimelineJob();

  const [baselineUri, setBaselineUri] = useState<string | null>(null);
  const [procedureId, setProcedureId] = useState<ProcedureId>("lip_filler");
  const [scrubValue, setScrubValue] = useState(1);

  const milestoneImages = useMemo(
    () => (job ? milestoneImageMap(job) : {}),
    [job],
  );

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

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={12}>
          <Text style={styles.back}>{t("common.cancel")}</Text>
        </Pressable>
        <Text style={[styles.title, { textAlign: textStart }]}>{t("timeline.title")}</Text>
        <Text style={[styles.subtitle, { textAlign: textStart }]}>{t("timeline.subtitle")}</Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.sectionTitle, { textAlign: textStart }]}>
          {t("timeline.baselinePhoto")}
        </Text>

        {baselineUri ? (
          <Image source={{ uri: baselineUri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Text style={styles.previewPlaceholderText}>{t("timeline.pickPhoto")}</Text>
          </View>
        )}

        <Pressable style={styles.secondaryBtn} onPress={pickBaseline} disabled={busy}>
          <Text style={styles.secondaryBtnText}>
            {baselineUri ? t("timeline.changePhoto") : t("timeline.pickPhoto")}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <ProcedurePicker value={procedureId} onChange={setProcedureId} disabled={busy} />

        <Pressable
          style={[styles.primaryBtn, (!baselineUri || busy) && styles.primaryBtnDisabled]}
          onPress={() => void runSimulation()}
          disabled={!baselineUri || busy}
        >
          {busy ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#f4fffd" size="small" />
              <Text style={styles.primaryBtnText}>{progressMessage}</Text>
            </View>
          ) : (
            <Text style={styles.primaryBtnText}>{t("timeline.generate")}</Text>
          )}
        </Pressable>

        {job ? (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${job.progress}%` }]} />
          </View>
        ) : null}

        {error ? (
          <Text style={[styles.errorText, { textAlign: textStart }]}>{error}</Text>
        ) : null}

        {job?.status === "partial" ? (
          <Text style={[styles.warnText, { textAlign: textStart }]}>{t("timeline.partial")}</Text>
        ) : null}
      </View>

      {baselineUri && (hasResults || busy) ? (
        <View style={styles.card}>
          <TimelineCompareView
            baselineUri={baselineUri}
            scrubValue={scrubValue}
            milestoneImages={milestoneImages}
          />

          <TimelineScrubber
            value={scrubValue}
            onChange={setScrubValue}
            disabled={!hasResults}
          />
        </View>
      ) : null}

      <Text style={[styles.disclaimer, { textAlign: textStart }]}>{t("timeline.disclaimer")}</Text>
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
  sectionTitle: {
    color: colors.inkSoft,
    fontSize: 14,
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  previewPlaceholder: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.15)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  previewPlaceholderText: {
    color: colors.muted,
    fontSize: 14,
  },
  secondaryBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.22)",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryBtnText: { color: colors.inkSoft, fontWeight: "600" },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  primaryBtnDisabled: { opacity: 0.55 },
  primaryBtnText: { color: "#f4fffd", fontWeight: "600", fontSize: 15 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(232,241,239,0.12)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accentSoft,
  },
  errorText: { color: colors.danger, fontSize: 13 },
  warnText: { color: colors.warn, fontSize: 13 },
  disclaimer: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
