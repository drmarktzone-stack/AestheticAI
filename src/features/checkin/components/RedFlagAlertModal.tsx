import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useRTL } from "@/hooks/useRTL";
import type { DetectedRedFlag } from "@/lib/checkin/schema";
import { colors } from "@/theme/colors";

interface RedFlagAlertModalProps {
  visible: boolean;
  flags: DetectedRedFlag[];
  onDismiss: () => void;
  onContactClinic: () => void;
}

export function RedFlagAlertModal({
  visible,
  flags,
  onDismiss,
  onContactClinic,
}: RedFlagAlertModalProps) {
  const { t } = useTranslation();
  const { textStart } = useRTL();

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={[styles.title, { textAlign: textStart }]}>{t("checkin.redFlag.title")}</Text>
          <Text style={[styles.body, { textAlign: textStart }]}>{t("checkin.redFlag.message")}</Text>

          <View style={styles.flagList}>
            {flags.map((flag) => (
              <Text key={flag.code} style={[styles.flagItem, { textAlign: textStart }]}>
                • {t(`checkin.redFlag.codes.${flag.code}`)}
              </Text>
            ))}
          </View>

          <Text style={[styles.urgent, { textAlign: textStart }]}>{t("checkin.redFlag.urgent")}</Text>

          <Pressable style={styles.primary} onPress={onContactClinic}>
            <Text style={styles.primaryText}>{t("checkin.redFlag.contactClinic")}</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={onDismiss}>
            <Text style={styles.secondaryText}>{t("checkin.redFlag.acknowledge")}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  title: { color: colors.danger, fontSize: 20, fontWeight: "700" },
  body: { color: colors.inkSoft, fontSize: 15, lineHeight: 22 },
  flagList: { gap: 6, paddingVertical: 4 },
  flagItem: { color: colors.ink, fontSize: 14, lineHeight: 20 },
  urgent: { color: colors.warn, fontSize: 13, fontWeight: "600" },
  primary: {
    backgroundColor: colors.danger,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  secondary: { alignItems: "center", paddingVertical: 10 },
  secondaryText: { color: colors.muted, fontWeight: "600" },
});
