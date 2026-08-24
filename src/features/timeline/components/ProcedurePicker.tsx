import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useRTL } from "@/hooks/useRTL";
import { PROCEDURE_IDS, type ProcedureId } from "@/lib/timeline/schema";
import { colors } from "@/theme/colors";

export interface ProcedurePickerProps {
  value: ProcedureId;
  onChange: (id: ProcedureId) => void;
  disabled?: boolean;
}

export function ProcedurePicker({ value, onChange, disabled = false }: ProcedurePickerProps) {
  const { t } = useTranslation();
  const { row, textStart } = useRTL();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { textAlign: textStart }]}>{t("timeline.procedureLabel")}</Text>
      <View style={[styles.list, { flexDirection: row }]}>
        {PROCEDURE_IDS.map((id) => {
          const selected = id === value;
          return (
            <Pressable
              key={id}
              disabled={disabled}
              onPress={() => onChange(id)}
              style={[
                styles.chip,
                selected && styles.chipSelected,
                disabled && styles.chipDisabled,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {t(`timeline.procedures.${id}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  title: {
    color: colors.inkSoft,
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.2)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(8,22,27,0.45)",
  },
  chipSelected: {
    borderColor: colors.accent,
    backgroundColor: "rgba(46,139,138,0.25)",
  },
  chipDisabled: { opacity: 0.5 },
  chipText: {
    color: colors.inkSoft,
    fontSize: 13,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: colors.ink,
    fontWeight: "600",
  },
});
