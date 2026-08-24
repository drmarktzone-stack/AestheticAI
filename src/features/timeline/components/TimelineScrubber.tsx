import { useMemo } from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { useTranslation } from "react-i18next";

import { useRTL } from "@/hooks/useRTL";
import { MILESTONE_ORDER, type MilestoneId } from "@/lib/timeline/schema";
import { colors } from "@/theme/colors";

const MAX_INDEX = MILESTONE_ORDER.length - 1;

export interface TimelineScrubberProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function TimelineScrubber({ value, onChange, disabled = false }: TimelineScrubberProps) {
  const { t } = useTranslation();
  const { isRTL, textStart, row } = useRTL();
  const trackWidth = useMemo(() => ({ current: 0 }), []);

  const normalized = clamp(value, 0, MAX_INDEX);
  const displayRatio = isRTL ? 1 - normalized / MAX_INDEX : normalized / MAX_INDEX;

  const updateFromX = (x: number) => {
    if (trackWidth.current <= 0) return;
    const ratio = clamp(x / trackWidth.current, 0, 1);
    const logicalRatio = isRTL ? 1 - ratio : ratio;
    onChange(logicalRatio * MAX_INDEX);
  };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (evt) => updateFromX(evt.nativeEvent.locationX),
        onPanResponderMove: (evt) => updateFromX(evt.nativeEvent.locationX),
      }),
    [disabled, isRTL],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  const milestoneLabels = MILESTONE_ORDER.map((id) => ({
    id,
    label: t(`timeline.milestones.${id}`),
  }));

  return (
    <View style={styles.wrap}>
      <View
        style={[styles.track, disabled && styles.trackDisabled]}
        onLayout={onLayout}
        {...pan.panHandlers}
      >
        <View style={styles.trackLine} />
        {MILESTONE_ORDER.map((id, index) => {
          const pos = isRTL ? 1 - index / MAX_INDEX : index / MAX_INDEX;
          return (
            <View
              key={id}
              style={[
                styles.tick,
                { left: `${pos * 100}%`, marginLeft: -6 },
                index <= Math.round(normalized) && styles.tickActive,
              ]}
            />
          );
        })}
        <View
          style={[
            styles.thumb,
            { left: `${displayRatio * 100}%`, marginLeft: -10 },
            disabled && styles.thumbDisabled,
          ]}
        />
      </View>

      <View style={[styles.labels, { flexDirection: row }]}>
        {milestoneLabels.map(({ id, label }, index) => {
          const pos = isRTL ? MAX_INDEX - index : index;
          const active = Math.round(normalized) === pos;
          return (
            <Text
              key={id}
              style={[
                styles.label,
                { textAlign: textStart },
                active && styles.labelActive,
              ]}
              numberOfLines={2}
            >
              {label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

export function milestoneIndexFromValue(value: number): MilestoneId {
  const index = clamp(Math.round(value), 0, MAX_INDEX);
  return MILESTONE_ORDER[index]!;
}

export function interpolateMilestoneImages(
  value: number,
  images: Partial<Record<MilestoneId, string>>,
): { primary: MilestoneId; secondary: MilestoneId | null; blend: number } {
  const clamped = clamp(value, 0, MAX_INDEX);
  const lower = Math.floor(clamped);
  const upper = Math.min(MAX_INDEX, lower + 1);
  const blend = clamped - lower;

  const primaryId = MILESTONE_ORDER[lower]!;
  const secondaryId = lower === upper ? null : MILESTONE_ORDER[upper]!;

  if (!secondaryId || blend < 0.02 || !images[secondaryId]) {
    return { primary: primaryId, secondary: null, blend: 0 };
  }

  return { primary: primaryId, secondary: secondaryId, blend };
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  track: {
    height: 44,
    justifyContent: "center",
    position: "relative",
  },
  trackDisabled: { opacity: 0.45 },
  trackLine: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(232,241,239,0.18)",
  },
  tick: {
    position: "absolute",
    top: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(232,241,239,0.25)",
    borderWidth: 2,
    borderColor: colors.surfaceElevated,
  },
  tickActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  thumb: {
    position: "absolute",
    top: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.ink,
    elevation: 2,
  },
  thumbDisabled: { backgroundColor: colors.muted },
  labels: {
    justifyContent: "space-between",
    gap: 4,
  },
  label: {
    flex: 1,
    fontSize: 11,
    lineHeight: 14,
    color: colors.muted,
  },
  labelActive: {
    color: colors.accentSoft,
    fontWeight: "600",
  },
});
