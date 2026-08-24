import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/components/ui/AppIcon";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useRTL } from "@/hooks/useRTL";
import { acknowledgeClinicAlert, fetchClinicAlerts } from "@/lib/checkin/client";
import type { ClinicAlert } from "@/lib/checkin/schema";
import { colors, radius, shadows } from "@/theme/colors";

export function ClinicAlertsScreen({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { textStart, row } = useRTL();
  const [alerts, setAlerts] = useState<ClinicAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setAlerts(await fetchClinicAlerts({ unacknowledgedOnly: false }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t("errors.unknown"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => { void load(); }, [load]);
  const onRefresh = () => { setRefreshing(true); void load(); };
  const handleAck = async (alertId: string) => {
    await acknowledgeClinicAlert(alertId);
    setAlerts((previous) => previous.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)));
  };

  const activeCount = alerts.filter((alert) => !alert.acknowledged).length;

  return (
    <ScreenContainer style={styles.content}>
      <View style={[styles.topBar, { flexDirection: row }]}>
        <Pressable accessibilityRole="button" accessibilityLabel={t("common.cancel")} onPress={onClose} hitSlop={12} style={styles.backButton}>
          <AppIcon name={row === "row" ? "arrowLeft" : "arrowRight"} color={colors.inkSoft} size={18} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onRefresh} style={styles.refreshButton}>
          {refreshing ? <ActivityIndicator color={colors.accentSoft} size="small" /> : <AppIcon name="chart" color={colors.accentSoft} size={18} />}
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Text style={[styles.kicker, { textAlign: textStart }]}>{t("nav.clinicAlerts")}</Text>
        <Text style={[styles.title, { textAlign: textStart }]}>{t("clinicAlerts.title")}</Text>
        <Text style={[styles.subtitle, { textAlign: textStart }]}>{t("clinicAlerts.subtitle")}</Text>
      </View>

      <View style={[styles.summaryCard, { flexDirection: row }]}>
        <View style={styles.summaryIcon}><AppIcon name="shield" color={colors.background} size={22} /></View>
        <View style={styles.summaryBody}>
          <Text style={[styles.summaryLabel, { textAlign: textStart }]}>{t("nav.clinicAlerts")}</Text>
          <Text style={[styles.summaryValue, { textAlign: textStart }]}>{activeCount}</Text>
        </View>
        <View style={styles.summaryTail}><Text style={styles.summaryTailText}>{activeCount === 1 ? "ITEM" : "ITEMS"}</Text></View>
      </View>

      {loading ? (
        <View style={styles.stateCard}><ActivityIndicator color={colors.accent} /><Text style={styles.stateText}>{t("common.loading")}</Text></View>
      ) : error ? (
        <View style={styles.errorCard}><AppIcon name="alert" color={colors.dangerSoft} size={20} /><Text style={[styles.errorText, { textAlign: textStart }]}>{error}</Text><Pressable onPress={onRefresh} style={styles.retryButton}><Text style={styles.retryText}>{t("common.retry")}</Text></Pressable></View>
      ) : alerts.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}><AppIcon name="check" color={colors.sageSoft} size={27} strokeWidth={2.2} /></View>
          <Text style={[styles.emptyTitle, { textAlign: textStart }]}>{t("clinicAlerts.empty")}</Text>
          <Text style={[styles.emptyCopy, { textAlign: textStart }]}>{t("checkin.reminderBody")}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {alerts.map((alert) => {
            const critical = alert.maxSeverity === "critical";
            return (
              <View key={alert.id} style={[styles.alertCard, critical ? styles.alertCritical : styles.alertHigh, alert.acknowledged && styles.alertAck]}>
                <View style={[styles.alertHeader, { flexDirection: row }]}>
                  <View style={[styles.severityBadge, critical ? styles.severityCritical : styles.severityHigh]}>
                    <AppIcon name={critical ? "alert" : "info"} color={critical ? colors.dangerSoft : colors.warn} size={14} />
                    <Text style={[styles.severityText, critical ? styles.severityTextCritical : styles.severityTextHigh]}>{t(`clinicAlerts.severity.${alert.maxSeverity}`)}</Text>
                  </View>
                  <Text style={styles.alertTime}>{new Date(alert.createdAt).toLocaleString()}</Text>
                </View>
                <View style={styles.patientRow}><AppIcon name="heart" color={colors.mutedStrong} size={15} /><Text style={[styles.alertPatient, { textAlign: textStart }]}>{t("clinicAlerts.patientRef", { id: alert.patientId.slice(0, 8) })}</Text></View>
                <View style={styles.flagList}>
                  {alert.redFlags.map((flag) => <View key={flag.code} style={[styles.flagRow, { flexDirection: row }]}><View style={[styles.flagDot, critical && styles.flagDotCritical]} /><Text style={[styles.flagLine, { textAlign: textStart }]}>{t(`checkin.redFlag.codes.${flag.code}`)}</Text></View>)}
                </View>
                {!alert.acknowledged ? (
                  <Pressable accessibilityRole="button" style={[styles.ackBtn, critical && styles.ackBtnCritical]} onPress={() => void handleAck(alert.id)}>
                    <Text style={[styles.ackBtnText, critical && styles.ackBtnTextCritical]}>{t("clinicAlerts.acknowledge")}</Text><AppIcon name="check" color={critical ? colors.background : colors.accentSoft} size={16} strokeWidth={2.4} />
                  </Pressable>
                ) : <View style={styles.acknowledged}><AppIcon name="check" color={colors.sageSoft} size={15} strokeWidth={2.3} /><Text style={styles.ackLabel}>{t("clinicAlerts.acknowledged")}</Text></View>}
              </View>
            );
          })}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 26, gap: 16 },
  topBar: { justifyContent: "space-between", alignItems: "center" },
  backButton: { width: 42, height: 42, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  refreshButton: { width: 42, height: 42, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  hero: { gap: 7, paddingTop: 4 },
  kicker: { color: colors.accentSoft, fontSize: 10, fontWeight: "800", letterSpacing: 1.1, textTransform: "uppercase" },
  title: { color: colors.ink, fontSize: 31, lineHeight: 38, fontWeight: "700", letterSpacing: -0.8 },
  subtitle: { color: colors.mutedStrong, fontSize: 15, lineHeight: 22 },
  summaryCard: { alignItems: "center", gap: 12, padding: 16, borderRadius: radius.lg, backgroundColor: colors.glassStrong, borderWidth: 1, borderColor: colors.borderStrong, ...shadows.glow },
  summaryIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  summaryBody: { flex: 1, gap: 2 },
  summaryLabel: { color: colors.mutedStrong, fontSize: 12, fontWeight: "700" },
  summaryValue: { color: colors.ink, fontSize: 28, lineHeight: 33, fontWeight: "800" },
  summaryTail: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: "rgba(188, 162, 246, 0.12)" },
  summaryTailText: { color: colors.accentSoft, fontSize: 9, fontWeight: "800", letterSpacing: 0.7 },
  list: { gap: 11 },
  alertCard: { borderRadius: radius.lg, padding: 16, gap: 13, borderWidth: 1, backgroundColor: colors.glassStrong, ...shadows.soft },
  alertHigh: { borderColor: "rgba(244, 189, 108, 0.38)" },
  alertCritical: { borderColor: "rgba(255, 138, 148, 0.46)" },
  alertAck: { opacity: 0.65, borderColor: colors.border },
  alertHeader: { justifyContent: "space-between", alignItems: "center", gap: 8 },
  severityBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill },
  severityHigh: { backgroundColor: "rgba(244, 189, 108, 0.12)" },
  severityCritical: { backgroundColor: "rgba(255, 138, 148, 0.13)" },
  severityText: { fontSize: 11, fontWeight: "800" },
  severityTextHigh: { color: colors.warn },
  severityTextCritical: { color: colors.dangerSoft },
  alertTime: { color: colors.muted, fontSize: 10, fontWeight: "600" },
  patientRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  alertPatient: { color: colors.inkSoft, fontSize: 13, fontWeight: "700" },
  flagList: { gap: 6, padding: 11, borderRadius: radius.sm, backgroundColor: "rgba(8, 9, 26, 0.28)" },
  flagRow: { alignItems: "flex-start", gap: 8 },
  flagDot: { width: 6, height: 6, marginTop: 6, borderRadius: radius.pill, backgroundColor: colors.warn },
  flagDotCritical: { backgroundColor: colors.danger },
  flagLine: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, flex: 1 },
  ackBtn: { minHeight: 43, alignSelf: "stretch", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderRadius: radius.sm, borderWidth: 1, borderColor: "rgba(188, 162, 246, 0.35)", backgroundColor: "rgba(188, 162, 246, 0.09)" },
  ackBtnCritical: { backgroundColor: colors.danger, borderColor: colors.danger },
  ackBtnText: { color: colors.accentSoft, fontSize: 13, fontWeight: "800" },
  ackBtnTextCritical: { color: colors.background },
  acknowledged: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 3 },
  ackLabel: { color: colors.sageSoft, fontSize: 12, fontWeight: "800" },
  stateCard: { minHeight: 190, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", gap: 12 },
  stateText: { color: colors.mutedStrong, fontSize: 13 },
  emptyCard: { minHeight: 220, alignItems: "center", justifyContent: "center", gap: 10, padding: 22, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  emptyIcon: { width: 56, height: 56, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(139, 212, 187, 0.12)" },
  emptyTitle: { color: colors.inkSoft, fontSize: 16, fontWeight: "800" },
  emptyCopy: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  errorCard: { gap: 10, padding: 16, borderRadius: radius.md, backgroundColor: "rgba(255, 138, 148, 0.10)", borderWidth: 1, borderColor: "rgba(255, 138, 148, 0.28)" },
  errorText: { color: colors.dangerSoft, fontSize: 13, lineHeight: 19 },
  retryButton: { alignSelf: "flex-start", paddingVertical: 7 },
  retryText: { color: colors.accentSoft, fontSize: 13, fontWeight: "800" },
});
