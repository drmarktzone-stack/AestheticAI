import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import type { AlignmentMetrics, CaptureStage } from "@/features/camera/types";
import { useRTL } from "@/hooks/useRTL";
import { colors } from "@/theme/colors";

interface AlignmentGuideProps {
  alignment: AlignmentMetrics;
  stage: CaptureStage;
  ghostEnabled: boolean;
}

function AlignmentGuideComponent({ alignment, stage, ghostEnabled }: AlignmentGuideProps) {
  const { t } = useTranslation();
  const { textStart } = useRTL();

  const hint = !alignment.isAligned
    ? alignment.pitchScore < 70
      ? t("camera.guide.adjustPitch")
      : alignment.yawScore < 70
        ? t("camera.guide.adjustYaw")
        : alignment.rollScore < 70
          ? t("camera.guide.adjustRoll")
          : t("camera.guide.adjustDistance")
    : t("camera.guide.ready");

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.row}>
        <Text style={[styles.stage, { textAlign: textStart }]}>
          {stage === "before" ? t("camera.stage.before") : t("camera.stage.after")}
        </Text>
        {ghostEnabled ? (
          <Text style={styles.ghostBadge}>{t("camera.ghost.active")}</Text>
        ) : null}
      </View>
      <Text style={[styles.hint, { textAlign: textStart }, alignment.isAligned && styles.hintOk]}>
        {hint}
      </Text>
      <View style={styles.metrics}>
        <Metric label={t("camera.metrics.pitch")} value={alignment.pitchScore} />
        <Metric label={t("camera.metrics.yaw")} value={alignment.yawScore} />
        <Metric label={t("camera.metrics.roll")} value={alignment.rollScore} />
        <Metric label={t("camera.metrics.score")} value={alignment.score} />
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export const AlignmentGuide = memo(AlignmentGuideComponent);

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 56,
    left: 16,
    right: 16,
    gap: 6,
    zIndex: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stage: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
    backgroundColor: "rgba(8,22,27,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  ghostBadge: {
    color: colors.accentSoft,
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(46,139,138,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hint: {
    color: "#f0d3a0",
    fontSize: 15,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 6,
  },
  hintOk: {
    color: "#b9e0c8",
  },
  metrics: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  metric: {
    backgroundColor: "rgba(8,22,27,0.65)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 56,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 10,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
  },
});
