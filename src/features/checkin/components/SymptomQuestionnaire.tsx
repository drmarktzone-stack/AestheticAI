import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useRTL } from "@/hooks/useRTL";
import type { SymptomFormState } from "@/lib/checkin/schema";
import type {
  AsymmetryLevel,
  BruisingLevel,
  SwellingLevel,
} from "@/lib/checkin/schema";
import { colors } from "@/theme/colors";

interface SymptomQuestionnaireProps {
  value: SymptomFormState;
  onChange: (next: SymptomFormState) => void;
  disabled?: boolean;
}

function OptionRow<T extends string>({
  label,
  options,
  value,
  onSelect,
  disabled,
  labelKeyPrefix,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onSelect: (v: T) => void;
  disabled?: boolean;
  labelKeyPrefix: string;
}) {
  const { t } = useTranslation();
  const { row, textStart } = useRTL();

  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { textAlign: textStart }]}>{label}</Text>
      <View style={[styles.options, { flexDirection: row }]}>
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <Pressable
              key={opt}
              disabled={disabled}
              onPress={() => onSelect(opt)}
              style={[styles.chip, selected && styles.chipSelected, disabled && styles.disabled]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {t(`${labelKeyPrefix}.${opt}` as never)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
  disabled,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const { textStart } = useRTL();

  return (
    <Pressable
      disabled={disabled}
      onPress={onToggle}
      style={[styles.toggleRow, disabled && styles.disabled]}
    >
      <Text style={[styles.fieldLabel, { textAlign: textStart, flex: 1 }]}>{label}</Text>
      <View style={[styles.toggle, value && styles.toggleOn]}>
        <Text style={styles.toggleText}>{value ? "✓" : ""}</Text>
      </View>
    </Pressable>
  );
}

export function SymptomQuestionnaire({ value, onChange, disabled }: SymptomQuestionnaireProps) {
  const { t } = useTranslation();
  const { textStart } = useRTL();

  const patch = (partial: Partial<SymptomFormState>) => onChange({ ...value, ...partial });

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { textAlign: textStart }]}>{t("checkin.questionnaireTitle")}</Text>

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { textAlign: textStart }]}>
          {t("checkin.painLevel", { level: value.painLevel })}
        </Text>
        <View style={styles.painRow}>
          {Array.from({ length: 11 }, (_, i) => (
            <Pressable
              key={i}
              disabled={disabled}
              onPress={() => patch({ painLevel: i })}
              style={[
                styles.painDot,
                value.painLevel === i && styles.painDotActive,
                i >= 8 && styles.painDotHigh,
              ]}
            >
              <Text style={styles.painDotText}>{i}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <OptionRow<SwellingLevel>
        label={t("checkin.swelling")}
        options={["none", "mild", "moderate", "severe"] as const}
        value={value.swelling}
        onSelect={(swelling) => patch({ swelling })}
        disabled={disabled}
        labelKeyPrefix="checkin.levels.swelling"
      />

      <OptionRow<BruisingLevel>
        label={t("checkin.bruising")}
        options={["none", "expected", "unexpected_spread"] as const}
        value={value.bruising}
        onSelect={(bruising) => patch({ bruising })}
        disabled={disabled}
        labelKeyPrefix="checkin.levels.bruising"
      />

      <OptionRow<AsymmetryLevel>
        label={t("checkin.asymmetry")}
        options={["none", "mild", "severe"] as const}
        value={value.asymmetry}
        onSelect={(asymmetry) => patch({ asymmetry })}
        disabled={disabled}
        labelKeyPrefix="checkin.levels.asymmetry"
      />

      <ToggleRow
        label={t("checkin.fever")}
        value={value.fever}
        onToggle={() => patch({ fever: !value.fever })}
        disabled={disabled}
      />
      <ToggleRow
        label={t("checkin.systemicSymptoms")}
        value={value.systemicSymptoms}
        onToggle={() => patch({ systemicSymptoms: !value.systemicSymptoms })}
        disabled={disabled}
      />
      <ToggleRow
        label={t("checkin.visionChanges")}
        value={value.visionChanges}
        onToggle={() => patch({ visionChanges: !value.visionChanges })}
        disabled={disabled}
      />
      <ToggleRow
        label={t("checkin.warmthOrDischarge")}
        value={value.warmthOrDischarge}
        onToggle={() => patch({ warmthOrDischarge: !value.warmthOrDischarge })}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  title: { color: colors.ink, fontSize: 16, fontWeight: "600" },
  field: { gap: 8 },
  fieldLabel: { color: colors.inkSoft, fontSize: 14, fontWeight: "500" },
  options: { flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.2)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    borderColor: colors.accent,
    backgroundColor: "rgba(46,139,138,0.22)",
  },
  chipText: { color: colors.inkSoft, fontSize: 12 },
  chipTextSelected: { color: colors.ink, fontWeight: "600" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  toggle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  toggleText: { color: colors.ink, fontWeight: "700", fontSize: 14 },
  painRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  painDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  painDotActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  painDotHigh: { borderColor: colors.danger },
  painDotText: { color: colors.inkSoft, fontSize: 11 },
  disabled: { opacity: 0.5 },
});
