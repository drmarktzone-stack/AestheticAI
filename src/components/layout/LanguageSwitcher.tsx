import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { changeAppLanguage } from "@/i18n";
import { useRTL } from "@/hooks/useRTL";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/translations";
import { colors } from "@/theme/colors";

const LABELS: Record<SupportedLocale, string> = {
  he: "עב",
  ar: "عر",
  en: "EN",
};

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { row } = useRTL();
  const current = i18n.language as SupportedLocale;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t("common.language")}</Text>
      <View style={[styles.row, { flexDirection: row }]}>
        {SUPPORTED_LOCALES.map((locale) => (
          <Pressable
            key={locale}
            accessibilityRole="button"
            accessibilityState={{ selected: current === locale }}
            onPress={() => void changeAppLanguage(locale)}
            style={[styles.chip, current === locale && styles.chipActive]}
          >
            <Text style={[styles.chipText, current === locale && styles.chipTextActive]}>
              {LABELS[locale]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { color: colors.muted, fontSize: 12 },
  row: { gap: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.14)",
    backgroundColor: "rgba(8,22,27,0.45)",
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: "rgba(46,139,138,0.25)",
  },
  chipText: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: colors.ink },
});
