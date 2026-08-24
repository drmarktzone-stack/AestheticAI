import { useCallback, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/components/ui/AppIcon";
import { MedicalAestheticCamera } from "@/features/camera/components/MedicalAestheticCamera";
import type { CaptureStage, MedicalCameraCaptureResult } from "@/features/camera/types";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useFaceAnalysis } from "@/hooks/useFaceAnalysis";
import { useRTL } from "@/hooks/useRTL";
import { colors, radius, shadows } from "@/theme/colors";

interface CameraCaptureScreenProps { onClose: () => void; }

export function CameraCaptureScreen({ onClose }: CameraCaptureScreenProps) {
  const { t } = useTranslation();
  const { row, textStart } = useRTL();
  const { analyze, loading: analyzing, error: analysisError, result: analysis } = useFaceAnalysis();
  const [stage, setStage] = useState<CaptureStage>("before");
  const [ghostUri, setGhostUri] = useState<string | null>(null);
  const [lastCapture, setLastCapture] = useState<MedicalCameraCaptureResult | null>(null);
  const [showCamera, setShowCamera] = useState(true);

  const handleCapture = useCallback((result: MedicalCameraCaptureResult) => {
    setLastCapture(result);
    if (result.photo.stage === "before") { setGhostUri(result.localUri); setStage("after"); }
    setShowCamera(false);
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!lastCapture) return;
    await analyze({ imageUri: lastCapture.localUri, captureMetadata: { stage: lastCapture.photo.stage, alignmentScore: lastCapture.photo.alignmentScore, timestamp: lastCapture.photo.timestamp } });
  }, [analyze, lastCapture]);

  if (showCamera) return <MedicalAestheticCamera stage={stage} ghostImageUri={ghostUri} onCapture={handleCapture} onClose={onClose} />;

  const lightingReady = lastCapture?.photo.lighting === "optimal" || lastCapture?.photo.lighting === "adequate";

  return (
    <ScreenContainer style={styles.content}>
      <View style={[styles.topBar, { flexDirection: row }]}>
        <Pressable accessibilityRole="button" onPress={onClose} hitSlop={12} style={styles.backButton}><AppIcon name={row === "row" ? "arrowLeft" : "arrowRight"} color={colors.inkSoft} size={18} /></Pressable>
        <View style={[styles.statusChip, { flexDirection: row }]}><View style={styles.statusDot} /><Text style={styles.statusText}>{t(`camera.stage.${lastCapture?.photo.stage ?? stage}`)}</Text></View>
      </View>

      <View style={styles.hero}><Text style={[styles.title, { textAlign: textStart }]}>{t("camera.result.saved")}</Text><Text style={[styles.subtitle, { textAlign: textStart }]}>{t("camera.title")}</Text></View>

      {lastCapture ? (
        <View style={styles.photoCard}>
          <Image source={{ uri: lastCapture.localUri }} style={styles.photo} resizeMode="cover" />
          <View style={[styles.photoStage, { flexDirection: row }]}><AppIcon name="check" color={colors.background} size={14} strokeWidth={2.5} /><Text style={styles.photoStageText}>{t(`camera.stage.${lastCapture.photo.stage}`)}</Text></View>
        </View>
      ) : null}

      {lastCapture ? (
        <View style={styles.metricsCard}>
          <View style={[styles.metric, { borderRightWidth: row === "row" ? 1 : 0, borderLeftWidth: row === "row-reverse" ? 1 : 0 }]}><Text style={styles.metricValue}>{lastCapture.photo.alignmentScore}%</Text><Text style={styles.metricLabel}>{t("camera.result.score")}</Text></View>
          <View style={styles.metric}><View style={[styles.lightingDot, lightingReady && styles.lightingDotReady]} /><Text style={styles.metricValue}>{lastCapture.photo.lighting}</Text><Text style={styles.metricLabel}>{t("camera.result.lighting")}</Text></View>
        </View>
      ) : null}

      <View style={styles.actionCard}>
        <View style={[styles.actionHeading, { flexDirection: row }]}><View style={styles.analysisIcon}><AppIcon name="spark" color={colors.background} size={20} /></View><View style={styles.analysisHeadingText}><Text style={[styles.cardTitle, { textAlign: textStart }]}>{t("analysis.title")}</Text><Text style={[styles.cardCopy, { textAlign: textStart }]}>{t("common.disclaimer")}</Text></View></View>
        <Pressable accessibilityRole="button" style={[styles.primary, analyzing && styles.primaryDisabled]} onPress={() => void runAnalysis()} disabled={analyzing || !lastCapture}>
          {analyzing ? <ActivityIndicator color={colors.background} /> : <><Text style={styles.primaryText}>{t("analysis.run")}</Text><AppIcon name={row === "row" ? "arrowRight" : "arrowLeft"} color={colors.background} size={19} strokeWidth={2.2} /></>}
        </Pressable>
        {analysisError ? <View style={styles.errorBox}><AppIcon name="alert" color={colors.dangerSoft} size={17} /><Text style={[styles.errorText, { textAlign: textStart }]}>{t("analysis.error")}: {analysisError}</Text></View> : null}
      </View>

      {analysis ? (
        <View style={styles.resultsCard}>
          <View style={[styles.resultsHeader, { flexDirection: row }]}><Text style={[styles.cardTitle, { textAlign: textStart }]}>{t("analysis.title")}</Text><View style={styles.resultBadge}><AppIcon name="chart" color={colors.sageSoft} size={18} /></View></View>
          {analysis.degraded ? <View style={styles.degraded}><AppIcon name="info" color={colors.warn} size={16} /><Text style={styles.degradedText}>{t("analysis.degraded")}</Text></View> : null}
          <View style={styles.analysisMetrics}>
            <View style={styles.analysisMetric}><Text style={styles.analysisMetricValue}>{analysis.symmetry.overallPercent}%</Text><Text style={styles.analysisMetricLabel}>{t("analysis.symmetry")}</Text></View>
            <View style={styles.analysisMetric}><Text style={styles.analysisMetricValue}>{analysis.skinQuality.overallScore}/100</Text><Text style={styles.analysisMetricLabel}>{t("analysis.skin")}</Text></View>
            <View style={styles.analysisMetric}><Text style={styles.analysisMetricValue}>{analysis.wrinkles.overallDepthScore}/10</Text><Text style={styles.analysisMetricLabel}>{t("analysis.wrinkles")}</Text></View>
          </View>
          <Text style={[styles.summary, { textAlign: textStart }]}>{analysis.summary}</Text>
        </View>
      ) : null}

      <View style={styles.secondaryActions}>
        {stage === "after" && lastCapture?.photo.stage === "before" ? <Pressable style={styles.secondaryBtn} onPress={() => setShowCamera(true)}><Text style={styles.secondaryText}>{t("camera.stage.after")}</Text><AppIcon name="camera" color={colors.accentSoft} size={16} /></Pressable> : null}
        <Pressable style={styles.secondaryBtn} onPress={() => { setStage("before"); setGhostUri(null); setLastCapture(null); setShowCamera(true); }}><Text style={styles.secondaryText}>{t("camera.stage.before")}</Text><AppIcon name="camera" color={colors.accentSoft} size={16} /></Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 26, gap: 16 },
  topBar: { alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 42, height: 42, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  statusChip: { alignItems: "center", gap: 7, backgroundColor: "rgba(139, 212, 187, 0.1)", paddingHorizontal: 11, paddingVertical: 8, borderRadius: radius.pill },
  statusDot: { width: 6, height: 6, borderRadius: radius.pill, backgroundColor: colors.sage },
  statusText: { color: colors.sageSoft, fontSize: 11, fontWeight: "800" },
  hero: { gap: 6, paddingTop: 3 },
  title: { color: colors.ink, fontSize: 31, lineHeight: 38, fontWeight: "700", letterSpacing: -0.8 },
  subtitle: { color: colors.mutedStrong, fontSize: 14, lineHeight: 20 },
  photoCard: { height: 330, borderRadius: radius.xl, overflow: "hidden", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  photo: { width: "100%", height: "100%" },
  photoStage: { position: "absolute", top: 13, right: 13, alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.sage },
  photoStageText: { color: colors.background, fontSize: 11, fontWeight: "800" },
  metricsCard: { flexDirection: "row", borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  metric: { flex: 1, minHeight: 80, alignItems: "center", justifyContent: "center", gap: 4, borderColor: colors.border },
  metricValue: { color: colors.ink, fontSize: 18, fontWeight: "800", textTransform: "capitalize" },
  metricLabel: { color: colors.muted, fontSize: 10, fontWeight: "700", textAlign: "center" },
  lightingDot: { width: 7, height: 7, borderRadius: radius.pill, backgroundColor: colors.warn },
  lightingDotReady: { backgroundColor: colors.sage },
  actionCard: { padding: 17, gap: 14, borderRadius: radius.lg, backgroundColor: colors.glassStrong, borderWidth: 1, borderColor: colors.borderStrong, ...shadows.glow },
  actionHeading: { alignItems: "center", gap: 11 },
  analysisIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  analysisHeadingText: { flex: 1, gap: 3 },
  cardTitle: { color: colors.ink, fontSize: 17, fontWeight: "800" },
  cardCopy: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  primary: { minHeight: 52, borderRadius: radius.md, backgroundColor: colors.accent, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  primaryDisabled: { opacity: 0.5 },
  primaryText: { color: colors.background, fontSize: 15, fontWeight: "800" },
  errorBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 11, borderRadius: radius.sm, backgroundColor: "rgba(255, 138, 148, 0.10)" },
  errorText: { color: colors.dangerSoft, fontSize: 12, lineHeight: 18, flex: 1 },
  resultsCard: { padding: 17, gap: 14, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: "rgba(139, 212, 187, 0.22)" },
  resultsHeader: { justifyContent: "space-between", alignItems: "center" },
  resultBadge: { width: 34, height: 34, borderRadius: radius.md, backgroundColor: "rgba(139, 212, 187, 0.12)", alignItems: "center", justifyContent: "center" },
  degraded: { flexDirection: "row", alignItems: "center", gap: 7, padding: 10, borderRadius: radius.sm, backgroundColor: "rgba(244, 189, 108, 0.1)" },
  degradedText: { color: colors.warn, fontSize: 12, fontWeight: "700", flex: 1 },
  analysisMetrics: { flexDirection: "row", gap: 8 },
  analysisMetric: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 10, paddingHorizontal: 5, borderRadius: radius.sm, backgroundColor: colors.surfaceElevated },
  analysisMetricValue: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  analysisMetricLabel: { color: colors.muted, fontSize: 9, fontWeight: "700", textAlign: "center" },
  summary: { color: colors.inkSoft, fontSize: 13, lineHeight: 20 },
  secondaryActions: { gap: 9 },
  secondaryBtn: { minHeight: 48, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  secondaryText: { color: colors.accentSoft, fontSize: 13, fontWeight: "800" },
});
