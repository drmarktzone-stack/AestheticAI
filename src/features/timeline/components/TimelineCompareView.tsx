import { Image, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useRTL } from "@/hooks/useRTL";
import {
  interpolateMilestoneImages,
  milestoneIndexFromValue,
} from "@/features/timeline/components/TimelineScrubber";
import type { MilestoneId } from "@/lib/timeline/schema";
import { colors } from "@/theme/colors";

export interface TimelineCompareViewProps {
  baselineUri: string;
  scrubValue: number;
  milestoneImages: Partial<Record<MilestoneId, string>>;
}

export function TimelineCompareView({
  baselineUri,
  scrubValue,
  milestoneImages,
}: TimelineCompareViewProps) {
  const { t } = useTranslation();
  const { row, textStart } = useRTL();

  const { primary, secondary, blend } = interpolateMilestoneImages(scrubValue, milestoneImages);
  const primaryUri = milestoneImages[primary];
  const secondaryUri = secondary ? milestoneImages[secondary] : undefined;
  const activeMilestone = milestoneIndexFromValue(scrubValue);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.caption, { textAlign: textStart }]}>
        {t("timeline.compareCaption", { milestone: t(`timeline.milestonesShort.${activeMilestone}`) })}
      </Text>

      <View style={[styles.row, { flexDirection: row }]}>
        <View style={styles.panel}>
          <Text style={[styles.panelLabel, { textAlign: textStart }]}>{t("timeline.baseline")}</Text>
          <Image source={{ uri: baselineUri }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.divider} />

        <View style={styles.panel}>
          <Text style={[styles.panelLabel, { textAlign: textStart }]}>
            {t(`timeline.milestonesShort.${activeMilestone}`)}
          </Text>
          <View style={styles.imageStack}>
            {primaryUri ? (
              <Image
                source={{ uri: primaryUri }}
                style={[styles.image, secondaryUri ? { opacity: 1 - blend } : undefined]}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.image, styles.placeholder]}>
                <Text style={styles.placeholderText}>{t("timeline.pendingFrame")}</Text>
              </View>
            )}
            {secondaryUri ? (
              <Image
                source={{ uri: secondaryUri }}
                style={[styles.image, styles.overlay, { opacity: blend }]}
                resizeMode="cover"
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  caption: {
    color: colors.muted,
    fontSize: 13,
  },
  row: {
    gap: 10,
    alignItems: "stretch",
  },
  panel: {
    flex: 1,
    gap: 6,
  },
  panelLabel: {
    color: colors.accentSoft,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(232,241,239,0.12)",
    marginVertical: 20,
  },
  imageStack: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: 12,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.12)",
    borderStyle: "dashed",
  },
  placeholderText: {
    color: colors.muted,
    fontSize: 12,
    paddingHorizontal: 8,
    textAlign: "center",
  },
});
