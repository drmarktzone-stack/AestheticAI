import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, SafeAreaView, StyleSheet, Text, View, type LayoutRectangle } from "react-native";
import { CameraView } from "expo-camera";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/components/ui/AppIcon";
import { AlignmentGuide } from "@/features/camera/components/AlignmentGuide";
import { FaceMeshOverlay } from "@/features/camera/components/FaceMeshOverlay";
import { GhostImageOverlay } from "@/features/camera/components/GhostImageOverlay";
import { useCameraPermissionsFlow } from "@/features/camera/hooks/useCameraPermissionsFlow";
import { useHeadAlignment } from "@/features/camera/hooks/useHeadAlignment";
import type { AestheticPhotoMetadata, CaptureStage, MedicalAestheticCameraProps, MedicalCameraCaptureResult } from "@/features/camera/types";
import { inferLightingFromExif } from "@/features/camera/utils/alignment";
import { createCaptureId } from "@/features/camera/utils/id";
import { useRTL } from "@/hooks/useRTL";
import { colors, radius } from "@/theme/colors";

export function MedicalAestheticCamera({ stage, ghostImageUri, onCapture, onClose }: MedicalAestheticCameraProps) {
  const { t } = useTranslation();
  const { row, textStart } = useRTL();
  const cameraRef = useRef<CameraView>(null);
  const { permission, isReady, ensurePermission, markReady } = useCameraPermissionsFlow();
  const alignment = useHeadAlignment(Boolean(permission?.granted && isReady));

  const [previewLayout, setPreviewLayout] = useState<LayoutRectangle | null>(null);
  const [ghostEnabled, setGhostEnabled] = useState(Boolean(ghostImageUri));
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const picture = await cameraRef.current.takePictureAsync({ quality: 1, exif: true, skipProcessing: false });
      if (!picture?.uri) return;
      const metadata: AestheticPhotoMetadata = {
        id: createCaptureId(), uri: picture.uri, width: picture.width, height: picture.height, timestamp: new Date().toISOString(), stage,
        orientation: { pitch: alignment.pitch, yaw: alignment.yaw, roll: alignment.roll }, alignmentScore: alignment.score,
        lighting: inferLightingFromExif(picture.exif as Record<string, unknown> | undefined), ghostReferenceUri: ghostEnabled ? ghostImageUri ?? undefined : undefined,
        ghostModeEnabled: ghostEnabled, devicePlatform: Platform.OS,
      };
      onCapture({ photo: metadata, localUri: picture.uri });
    } finally {
      setIsCapturing(false);
    }
  }, [alignment.pitch, alignment.roll, alignment.score, alignment.yaw, ghostEnabled, ghostImageUri, isCapturing, onCapture, stage]);

  if (!permission) {
    return <View style={styles.center}><ActivityIndicator color={colors.accent} /><Text style={styles.message}>{t("common.loading")}</Text></View>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionRoot}>
        <View style={styles.permissionAura} />
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}><AppIcon name="camera" color={colors.background} size={25} /></View>
          <Text style={[styles.permissionTitle, { textAlign: textStart }]}>{t("camera.title")}</Text>
          <Text style={[styles.message, { textAlign: textStart }]}>{t("camera.permission.message")}</Text>
          <Pressable accessibilityRole="button" style={styles.primaryBtn} onPress={() => void ensurePermission()}>
            <Text style={styles.primaryBtnText}>{t("camera.permission.grant")}</Text><AppIcon name={row === "row" ? "arrowRight" : "arrowLeft"} color={colors.background} size={18} />
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.ghostBtn} onPress={onClose}><Text style={styles.ghostBtnText}>{t("common.cancel")}</Text></Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const canCapture = alignment.isAligned && !isCapturing && isReady;

  return (
    <View style={styles.root}>
      <View style={styles.preview} onLayout={(event) => setPreviewLayout(event.nativeEvent.layout)}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" mode="picture" mute onCameraReady={markReady} />
        <View style={styles.previewTint} />
        <GhostImageOverlay uri={ghostImageUri ?? ""} visible={ghostEnabled && Boolean(ghostImageUri)} />
        <FaceMeshOverlay layout={previewLayout} alignment={alignment} />
        <AlignmentGuide alignment={alignment} stage={stage} ghostEnabled={ghostEnabled} />

        <SafeAreaView style={styles.cameraHeader}>
          <View style={[styles.cameraHeaderRow, { flexDirection: row }]}>
            <Pressable accessibilityRole="button" accessibilityLabel={t("common.cancel")} style={styles.roundControl} onPress={onClose}>
              <AppIcon name={row === "row" ? "arrowLeft" : "arrowRight"} color={colors.ink} size={19} />
            </Pressable>
            <View style={[styles.stageChip, { flexDirection: row }]}>
              <View style={[styles.stageDot, stage === "after" && styles.stageDotAfter]} />
              <Text style={styles.stageText}>{t(`camera.stage.${stage}`)}</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <SafeAreaView style={styles.controlPanel}>
        <View style={[styles.qualityRow, { flexDirection: row }]}>
          <View style={[styles.qualityPill, alignment.isAligned && styles.qualityPillReady]}>
            <AppIcon name={alignment.isAligned ? "check" : "scan"} color={alignment.isAligned ? colors.sageSoft : colors.accentSoft} size={14} strokeWidth={2.3} />
            <Text style={[styles.qualityText, alignment.isAligned && styles.qualityTextReady]}>{alignment.isAligned ? t("camera.guide.ready") : t("camera.guide.adjustDistance")}</Text>
          </View>
          <Text style={styles.scoreText}>{alignment.score}%</Text>
        </View>

        <View style={[styles.toolbar, { flexDirection: row }]}>
          <Pressable accessibilityRole="button" style={styles.toolControl} onPress={onClose}>
            <AppIcon name="home" color={colors.inkSoft} size={19} />
          </Pressable>
          {ghostImageUri ? (
            <Pressable accessibilityRole="button" accessibilityLabel={t("camera.ghost.toggle")} style={[styles.toolControl, ghostEnabled && styles.toolControlActive]} onPress={() => setGhostEnabled((value) => !value)}>
              <AppIcon name="scan" color={ghostEnabled ? colors.accentSoft : colors.inkSoft} size={19} />
            </Pressable>
          ) : <View style={styles.toolControlPlaceholder} />}
          <Pressable accessibilityRole="button" accessibilityLabel={t("camera.capture")} style={[styles.captureOuter, !canCapture && styles.captureOuterDisabled]} disabled={!canCapture} onPress={() => void handleCapture()}>
            <View style={styles.captureInner}>
              {isCapturing ? <ActivityIndicator color={colors.background} /> : <AppIcon name="camera" color={colors.background} size={25} strokeWidth={2.1} />}
            </View>
          </Pressable>
          <View style={styles.toolControlPlaceholder} />
          <View style={styles.stageLegend}><Text style={styles.stageLegendText}>{t("camera.capture")}</Text></View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  preview: { flex: 1, backgroundColor: colors.black, overflow: "hidden" },
  previewTint: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(8, 9, 26, 0.08)" },
  cameraHeader: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 18, paddingTop: 4 },
  cameraHeaderRow: { alignItems: "center", justifyContent: "space-between" },
  roundControl: { width: 42, height: 42, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(8, 9, 26, 0.62)", borderWidth: 1, borderColor: "rgba(252, 250, 255, 0.18)" },
  stageChip: { alignItems: "center", gap: 7, backgroundColor: "rgba(8, 9, 26, 0.66)", paddingHorizontal: 11, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: "rgba(252, 250, 255, 0.14)" },
  stageDot: { width: 7, height: 7, borderRadius: radius.pill, backgroundColor: colors.accent },
  stageDotAfter: { backgroundColor: colors.sage },
  stageText: { color: colors.ink, fontSize: 11, fontWeight: "800" },
  controlPanel: { backgroundColor: colors.glassStrong, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 12, gap: 10 },
  qualityRow: { justifyContent: "space-between", alignItems: "center", gap: 8 },
  qualityPill: { flex: 1, minHeight: 31, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: "rgba(188, 162, 246, 0.10)" },
  qualityPillReady: { backgroundColor: "rgba(139, 212, 187, 0.12)" },
  qualityText: { color: colors.accentSoft, fontSize: 11, fontWeight: "700", flexShrink: 1 },
  qualityTextReady: { color: colors.sageSoft },
  scoreText: { color: colors.inkSoft, fontSize: 12, fontWeight: "800" },
  toolbar: { alignItems: "center", justifyContent: "space-between" },
  toolControl: { width: 42, height: 42, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface },
  toolControlActive: { backgroundColor: "rgba(188, 162, 246, 0.15)", borderColor: "rgba(188, 162, 246, 0.45)" },
  toolControlPlaceholder: { width: 42, height: 42 },
  captureOuter: { width: 66, height: 66, borderRadius: radius.pill, backgroundColor: "rgba(188, 162, 246, 0.25)", borderWidth: 2, borderColor: colors.accent, padding: 5, alignItems: "center", justifyContent: "center" },
  captureOuterDisabled: { opacity: 0.45 },
  captureInner: { width: "100%", height: "100%", borderRadius: radius.pill, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  stageLegend: { width: 42, alignItems: "center" },
  stageLegendText: { color: colors.muted, fontSize: 9, fontWeight: "700", textAlign: "center" },
  center: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  permissionRoot: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 22 },
  permissionAura: { position: "absolute", width: 320, height: 320, borderRadius: 160, backgroundColor: "rgba(125, 102, 205, 0.18)", top: 110 },
  permissionCard: { width: "100%", maxWidth: 420, alignItems: "center", gap: 14, padding: 24, borderRadius: radius.xl, backgroundColor: colors.glassStrong, borderWidth: 1, borderColor: colors.border },
  permissionIcon: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  permissionTitle: { color: colors.ink, fontSize: 24, fontWeight: "700", alignSelf: "stretch" },
  message: { color: colors.mutedStrong, fontSize: 15, lineHeight: 22, alignSelf: "stretch" },
  primaryBtn: { minHeight: 52, width: "100%", marginTop: 6, borderRadius: radius.md, backgroundColor: colors.accent, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  primaryBtnText: { color: colors.background, fontSize: 15, fontWeight: "800" },
  ghostBtn: { minHeight: 40, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
  ghostBtnText: { color: colors.mutedStrong, fontSize: 13, fontWeight: "700" },
});
