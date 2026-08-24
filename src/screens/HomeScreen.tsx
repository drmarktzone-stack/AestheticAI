import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useAuth } from "@/providers/AuthProvider";
import { useRTL } from "@/hooks/useRTL";
import { colors } from "@/theme/colors";

export function HomeScreen({
  onOpenCamera,
  onOpenTimeline,
  onOpenCheckIn,
  onOpenClinicAlerts,
}: {
  onOpenCamera: () => void;
  onOpenTimeline: () => void;
  onOpenCheckIn: () => void;
  onOpenClinicAlerts: () => void;
}) {
  const { t } = useTranslation();
  const { row, textStart } = useRTL();
  const { isConfigured, session } = useAuth();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.brand, { textAlign: textStart }]}>{t("app.name")}</Text>
        <Text style={[styles.tagline, { textAlign: textStart }]}>{t("app.tagline")}</Text>
      </View>

      <LanguageSwitcher />

      <View style={styles.card}>
        <Text style={[styles.title, { textAlign: textStart }]}>{t("home.welcome")}</Text>
        <Text style={[styles.body, { textAlign: textStart }]}>{t("home.subtitle")}</Text>

        <View style={[styles.actions, { flexDirection: row }]}>
          <Pressable style={styles.actionPrimary} onPress={onOpenCheckIn}>
            <Text style={styles.actionPrimaryText}>{t("home.openCheckIn")}</Text>
          </Pressable>
          <Pressable style={styles.actionGhost} onPress={onOpenCamera}>
            <Text style={styles.actionGhostText}>{t("home.openCamera")}</Text>
          </Pressable>
          <Pressable style={styles.actionGhost} onPress={onOpenTimeline}>
            <Text style={styles.actionGhostText}>{t("home.openTimeline")}</Text>
          </Pressable>
          <Pressable style={styles.actionGhost} onPress={onOpenClinicAlerts}>
            <Text style={styles.actionGhostText}>{t("home.openClinicAlerts")}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={[styles.metaLabel, { textAlign: textStart }]}>
          {isConfigured
            ? session
              ? t("setup.supabaseAuthenticated")
              : t("setup.supabaseReady")
            : t("setup.supabaseNotConfigured")}
        </Text>
        <Text style={[styles.disclaimer, { textAlign: textStart }]}>{t("common.disclaimer")}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: 4 },
  brand: {
    fontSize: 36,
    color: colors.ink,
    fontWeight: "300",
  },
  tagline: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  card: {
    backgroundColor: "rgba(8,22,27,0.55)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.1)",
    padding: 16,
    gap: 12,
  },
  title: { color: colors.ink, fontSize: 20, fontWeight: "600" },
  body: { color: colors.inkSoft, fontSize: 15, lineHeight: 22 },
  actions: { gap: 8, flexWrap: "wrap" },
  actionPrimary: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  actionPrimaryText: { color: "#f4fffd", fontWeight: "600" },
  actionGhost: {
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.22)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  actionGhostText: { color: colors.inkSoft, fontWeight: "600" },
  metaLabel: { color: colors.accentSoft, fontSize: 13 },
  disclaimer: { color: colors.muted, fontSize: 13, lineHeight: 20 },
});
