import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutRectangle,
} from "react-native";
import { CameraView } from "expo-camera";
import { useTranslation } from "react-i18next";

import { AlignmentGuide } from "@/features/camera/components/AlignmentGuide";
import { FaceMeshOverlay } from "@/features/camera/components/FaceMeshOverlay";
import { GhostImageOverlay } from "@/features/camera/components/GhostImageOverlay";
import { useCameraPermissionsFlow } from "@/features/camera/hooks/useCameraPermissionsFlow";
import { useHeadAlignment } from "@/features/camera/hooks/useHeadAlignment";
import type {
  AestheticPhotoMetadata,
  CaptureStage,
  MedicalAestheticCameraProps,
  MedicalCameraCaptureResult,
} from "@/features/camera/types";
import { inferLightingFromExif } from "@/features/camera/utils/alignment";
import { createCaptureId } from "@/features/camera/utils/id";
import { useRTL } from "@/hooks/useRTL";
import { colors } from "@/theme/colors";

export function MedicalAestheticCamera({
  stage,
  ghostImageUri,
  onCapture,
  onClose,
}: MedicalAestheticCameraProps) {
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
      const picture = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
        skipProcessing: false,
      });

      if (!picture?.uri) return;

      const metadata: AestheticPhotoMetadata = {
        id: createCaptureId(),
        uri: picture.uri,
        width: picture.width,
        height: picture.height,
        timestamp: new Date().toISOString(),
        stage,
        orientation: {
          pitch: alignment.pitch,
          yaw: alignment.yaw,
          roll: alignment.roll,
        },
        alignmentScore: alignment.score,
        lighting: inferLightingFromExif(picture.exif as Record<string, unknown> | undefined),
        ghostReferenceUri: ghostEnabled ? ghostImageUri ?? undefined : undefined,
        ghostModeEnabled: ghostEnabled,
        devicePlatform: Platform.OS,
      };

      const result: MedicalCameraCaptureResult = {
        photo: metadata,
        localUri: picture.uri,
      };
      onCapture(result);
    } finally {
      setIsCapturing(false);
    }
  }, [
    alignment.pitch,
    alignment.roll,
    alignment.score,
    alignment.yaw,
    ghostEnabled,
    ghostImageUri,
    isCapturing,
    onCapture,
    stage,
  ]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.message}>{t("common.loading")}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={[styles.message, { textAlign: textStart }]}>{t("camera.permission.message")}</Text>
        <Pressable style={styles.primaryBtn} onPress={() => void ensurePermission()}>
          <Text style={styles.primaryBtnText}>{t("camera.permission.grant")}</Text>
        </Pressable>
        <Pressable style={styles.ghostBtn} onPress={onClose}>
          <Text style={styles.ghostBtnText}>{t("common.cancel")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View
        style={styles.preview}
        onLayout={(e) => setPreviewLayout(e.nativeEvent.layout)}
      >
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="front"
          mode="picture"
          mute
          onCameraReady={markReady}
        />
        <GhostImageOverlay uri={ghostImageUri ?? ""} visible={ghostEnabled && Boolean(ghostImageUri)} />
        <FaceMeshOverlay layout={previewLayout} alignment={alignment} />
        <AlignmentGuide alignment={alignment} stage={stage} ghostEnabled={ghostEnabled} />
      </View>

      <View style={[styles.toolbar, { flexDirection: row }]}>
        <Pressable style={styles.toolBtn} onPress={onClose}>
          <Text style={styles.toolBtnText}>{t("common.cancel")}</Text>
        </Pressable>

        {ghostImageUri ? (
          <Pressable
            style={[styles.toolBtn, ghostEnabled && styles.toolBtnActive]}
            onPress={() => setGhostEnabled((v) => !v)}
          >
            <Text style={styles.toolBtnText}>{t("camera.ghost.toggle")}</Text>
          </Pressable>
        ) : null}

        <Pressable
          style={[
            styles.captureBtn,
            (!alignment.isAligned || isCapturing) && styles.captureBtnDisabled,
          ]}
          disabled={!alignment.isAligned || isCapturing || !isReady}
          onPress={() => void handleCapture()}
        >
          {isCapturing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.captureText}>{t("camera.capture")}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  preview: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  message: {
    color: colors.inkSoft,
    fontSize: 16,
    lineHeight: 24,
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(232,241,239,0.1)",
  },
  toolBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.2)",
  },
  toolBtnActive: {
    borderColor: colors.accent,
    backgroundColor: "rgba(46,139,138,0.2)",
  },
  toolBtnText: {
    color: colors.inkSoft,
    fontWeight: "600",
    fontSize: 13,
  },
  captureBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  captureBtnDisabled: {
    opacity: 0.45,
  },
  captureText: {
    color: "#f4fffd",
    fontWeight: "700",
    fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryBtnText: {
    color: "#f4fffd",
    fontWeight: "700",
  },
  ghostBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ghostBtnText: {
    color: colors.muted,
  },
});
