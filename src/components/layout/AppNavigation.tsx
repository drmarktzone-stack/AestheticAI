import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import { useRTL } from "@/hooks/useRTL";
import { colors, radius } from "@/theme/colors";

export type AppRoute = "home" | "timeline" | "checkin" | "clinicAlerts";

interface AppNavigationProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const items: Array<{ route: AppRoute; labelKey: "nav.home" | "nav.timeline" | "nav.checkin" | "nav.clinicAlerts"; icon: AppIconName }> = [
  { route: "home", labelKey: "nav.home", icon: "home" },
  { route: "timeline", labelKey: "nav.timeline", icon: "spark" },
  { route: "checkin", labelKey: "nav.checkin", icon: "heart" },
  { route: "clinicAlerts", labelKey: "nav.clinicAlerts", icon: "shield" },
];

export function AppNavigation({ activeRoute, onNavigate }: AppNavigationProps) {
  const { t } = useTranslation();
  const { row } = useRTL();

  return (
    <View style={[styles.wrap, { flexDirection: row }]} accessibilityRole="tablist">
      {items.map((item) => {
        const active = item.route === activeRoute;
        return (
          <Pressable
            key={item.route}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t(item.labelKey)}
            onPress={() => onNavigate(item.route)}
            style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.itemPressed]}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <AppIcon name={item.icon} color={active ? colors.background : colors.muted} size={19} strokeWidth={2} />
            </View>
            <Text numberOfLines={1} style={[styles.label, active && styles.labelActive]}>
              {t(item.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.glassStrong,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 4,
  },
  item: {
    flex: 1,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: radius.sm,
  },
  itemActive: { backgroundColor: "rgba(188, 162, 246, 0.12)" },
  itemPressed: { opacity: 0.76 },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: { backgroundColor: colors.accent },
  label: { color: colors.muted, fontSize: 10, fontWeight: "600", letterSpacing: 0.1 },
  labelActive: { color: colors.accentSoft },
});
