import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { MedicalAestheticCamera } from "@/features/camera/components/MedicalAestheticCamera";
import type { CaptureStage, MedicalCameraCaptureResult } from "@/features/camera/types";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useRTL } from "@/hooks/useRTL";
import { colors } from "@/theme/colors";

interface CameraCaptureScreenProps {
  onClose: () => void;
}

export function CameraCaptureScreen({ onClose }: CameraCaptureScreenProps) {
  const { t } = useTranslation();
  const { textStart } = useRTL();
  const [stage, setStage] = useState<CaptureStage>("before");
  const [ghostUri, setGhostUri] = useState<string | null>(null);
  const [lastCapture, setLastCapture] = useState<MedicalCameraCaptureResult | null>(null);
  const [showCamera, setShowCamera] = useState(true);

  const handleCapture = useCallback(
    (result: MedicalCameraCaptureResult) => {
      setLastCapture(result);
      if (result.photo.stage === "before") {
        setGhostUri(result.localUri);
        setStage("after");
        setShowCamera(false);
      } else {
        setShowCamera(false);
      }
    },
    [],
  );

  if (showCamera) {
    return (
      <MedicalAestheticCamera
        stage={stage}
        ghostImageUri={ghostUri}
        onCapture={handleCapture}
        onClose={onClose}
      />
    );
  }

  return (
    <ScreenContainer>
      <Text style={[styles.title, { textAlign: textStart }]}>{t("camera.result.saved")}</Text>
      {lastCapture ? (
        <View style={styles.card}>
          <Text style={[styles.row, { textAlign: textStart }]}>
            {t("camera.result.score")}: {lastCapture.photo.alignmentScore}
          </Text>
          <Text style={[styles.row, { textAlign: textStart }]}>
            {t("camera.result.lighting")}: {lastCapture.photo.lighting}
          </Text>
          <Text style={[styles.row, { textAlign: textStart }]}>
            {lastCapture.photo.stage} · {lastCapture.photo.timestamp}
          </Text>
        </View>
      ) : null}
      <View style={styles.actions}>
        {stage === "after" && lastCapture?.photo.stage === "before" ? (
          <Pressable style={styles.primary} onPress={() => setShowCamera(true)}>
            <Text style={styles.primaryText}>{t("camera.stage.after")}</Text>
          </Pressable>
        ) : null}
        <Pressable
          style={styles.ghost}
          onPress={() => {
            setStage("before");
            setGhostUri(null);
            setLastCapture(null);
            setShowCamera(true);
          }}
        >
          <Text style={styles.ghostText}>{t("camera.stage.before")}</Text>
        </Pressable>
        <Pressable style={styles.ghost} onPress={onClose}>
          <Text style={styles.ghostText}>{t("common.cancel")}</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "rgba(8,22,27,0.55)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.1)",
    padding: 16,
    gap: 8,
  },
  row: {
    color: colors.inkSoft,
    fontSize: 15,
  },
  actions: { gap: 10 },
  primary: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryText: { color: "#f4fffd", fontWeight: "700" },
  ghost: {
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.2)",
    borderRadius: 999,
  },
  ghostText: { color: colors.inkSoft, fontWeight: "600" },
});
