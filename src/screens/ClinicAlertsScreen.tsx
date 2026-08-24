import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useRTL } from "@/hooks/useRTL";
import { acknowledgeClinicAlert, fetchClinicAlerts } from "@/lib/checkin/client";
import type { ClinicAlert } from "@/lib/checkin/schema";
import { colors } from "@/theme/colors";

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
      const data = await fetchClinicAlerts({ unacknowledgedOnly: false });
      setAlerts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errors.unknown"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    void load();
  };

  const handleAck = async (alertId: string) => {
    await acknowledgeClinicAlert(alertId);
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)),
    );
  };

  return (
    <ScreenContainer
      scroll
      style={undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={12}>
          <Text style={styles.back}>{t("common.cancel")}</Text>
        </Pressable>
        <Text style={[styles.title, { textAlign: textStart }]}>{t("clinicAlerts.title")}</Text>
        <Text style={[styles.subtitle, { textAlign: textStart }]}>{t("clinicAlerts.subtitle")}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : error ? (
        <Text style={[styles.error, { textAlign: textStart }]}>{error}</Text>
      ) : alerts.length === 0 ? (
        <Text style={[styles.empty, { textAlign: textStart }]}>{t("clinicAlerts.empty")}</Text>
      ) : (
        <View style={styles.list}>
          {alerts.map((alert) => (
            <View
              key={alert.id}
              style={[
                styles.alertCard,
                alert.maxSeverity === "critical" && styles.alertCritical,
                alert.acknowledged && styles.alertAck,
              ]}
            >
              <View style={[styles.alertHeader, { flexDirection: row }]}>
                <Text style={styles.alertSeverity}>
                  {t(`clinicAlerts.severity.${alert.maxSeverity}`)}
                </Text>
                <Text style={styles.alertTime}>
                  {new Date(alert.createdAt).toLocaleString()}
                </Text>
              </View>

              <Text style={[styles.alertPatient, { textAlign: textStart }]}>
                {t("clinicAlerts.patientRef", { id: alert.patientId.slice(0, 8) })}
              </Text>

              {alert.redFlags.map((flag) => (
                <Text key={flag.code} style={[styles.flagLine, { textAlign: textStart }]}>
                  • {t(`checkin.redFlag.codes.${flag.code}`)}
                </Text>
              ))}

              {!alert.acknowledged ? (
                <Pressable style={styles.ackBtn} onPress={() => void handleAck(alert.id)}>
                  <Text style={styles.ackBtnText}>{t("clinicAlerts.acknowledge")}</Text>
                </Pressable>
              ) : (
                <Text style={styles.ackLabel}>{t("clinicAlerts.acknowledged")}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      <Pressable style={styles.refreshBtn} onPress={onRefresh}>
        <Text style={styles.refreshText}>
          {refreshing ? t("common.loading") : t("common.retry")}
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6, marginBottom: 8 },
  back: { color: colors.accentSoft, fontSize: 15, fontWeight: "600" },
  title: { color: colors.ink, fontSize: 24, fontWeight: "600" },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  list: { gap: 12 },
  alertCard: {
    backgroundColor: "rgba(8,22,27,0.55)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.warn,
    padding: 14,
    gap: 8,
  },
  alertCritical: { borderColor: colors.danger },
  alertAck: { opacity: 0.65, borderColor: "rgba(232,241,239,0.15)" },
  alertHeader: { justifyContent: "space-between", alignItems: "center" },
  alertSeverity: { color: colors.danger, fontWeight: "700", fontSize: 13 },
  alertTime: { color: colors.muted, fontSize: 11 },
  alertPatient: { color: colors.inkSoft, fontSize: 13 },
  flagLine: { color: colors.ink, fontSize: 13, lineHeight: 18 },
  ackBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
  },
  ackBtnText: { color: "#f4fffd", fontWeight: "600", fontSize: 13 },
  ackLabel: { color: colors.muted, fontSize: 12, fontStyle: "italic" },
  empty: { color: colors.muted, fontSize: 14 },
  error: { color: colors.danger, fontSize: 13 },
  refreshBtn: { alignSelf: "center", padding: 12 },
  refreshText: { color: colors.accentSoft, fontWeight: "600" },
});
