import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useRTL } from "@/hooks/useRTL";
import { colors, radius, shadows } from "@/theme/colors";

interface HomeScreenProps {
  onOpenCamera: () => void;
  onOpenTimeline: () => void;
  onOpenCheckIn: () => void;
  onOpenClinicAlerts: () => void;
}

interface FeatureCardProps {
  icon: AppIconName;
  title: string;
  copy: string;
  tone: "iris" | "pearl" | "sage";
  onPress: () => void;
  direction: "row" | "row-reverse";
  textAlign: "left" | "right" | "center";
}

function FeatureCard({ icon, title, copy, tone, onPress, direction, textAlign }: FeatureCardProps) {
  const toneStyles = {
    iris: { icon: colors.accentSoft, line: "rgba(188, 162, 246, 0.35)" },
    pearl: { icon: colors.pearl, line: "rgba(246, 237, 230, 0.32)" },
    sage: { icon: colors.sageSoft, line: "rgba(139, 212, 187, 0.34)" },
  } as const;
  const activeTone = toneStyles[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.featureCard, pressed && styles.pressed]}
    >
      <View style={[styles.featureTop, { flexDirection: direction }]}>
        <View style={[styles.featureIcon, { borderColor: activeTone.line }]}>
          <AppIcon name={icon} color={activeTone.icon} size={22} />
        </View>
        <View style={styles.featureArrow}>
          <AppIcon name={direction === "row" ? "arrowRight" : "arrowLeft"} color={colors.mutedStrong} size={18} />
        </View>
      </View>
      <Text style={[styles.featureTitle, { textAlign }]}>{title}</Text>
      <Text style={[styles.featureCopy, { textAlign }]}>{copy}</Text>
    </Pressable>
  );
}

export function HomeScreen({ onOpenCamera, onOpenTimeline, onOpenCheckIn, onOpenClinicAlerts }: HomeScreenProps) {
  const { t } = useTranslation();
  const { row, textStart } = useRTL();

  return (
    <ScreenContainer style={styles.content}>
      <View style={[styles.topBar, { flexDirection: row }]}>
        <View style={styles.brandLockup}>
          <Text style={styles.brand}>PROTOKOL</Text>
          <View style={styles.brandDot} />
        </View>
        <LanguageSwitcher />
      </View>

      <ImageBackground
        source={require("../../assets/protokol-aura-hero.png")}
        imageStyle={styles.heroImage}
        style={styles.hero}
      >
        <View style={styles.heroShade} />
        <View style={styles.heroContent}>
          <View style={[styles.eyebrowRow, { flexDirection: row }]}>
            <View style={styles.eyebrowSpark}>
              <AppIcon name="spark" color={colors.accentSoft} size={14} />
            </View>
            <Text style={[styles.eyebrow, { textAlign: textStart }]}>{t("home.eyebrow")}</Text>
          </View>
          <Text style={[styles.heroTitle, { textAlign: textStart }]}>{t("home.welcome")}</Text>
          <Text style={[styles.heroCopy, { textAlign: textStart }]}>{t("home.subtitle")}</Text>
        </View>
      </ImageBackground>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionEyebrow, { textAlign: textStart }]}>{t("home.currentStep")}</Text>
      </View>

      <View style={styles.nextStepCard}>
        <View style={[styles.nextStepTop, { flexDirection: row }]}>
          <View style={styles.nextStepIcon}>
            <AppIcon name="heart" color={colors.background} size={21} strokeWidth={2.1} />
          </View>
          <View style={styles.onTrack}>
            <AppIcon name="check" color={colors.sageSoft} size={13} strokeWidth={2.2} />
            <Text style={styles.onTrackText}>{t("home.onTrack")}</Text>
          </View>
        </View>
        <Text style={[styles.nextStepCopy, { textAlign: textStart }]}>{t("home.currentStepCopy")}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenCheckIn}
          style={({ pressed }) => [styles.primaryAction, pressed && styles.primaryPressed]}
        >
          <Text style={styles.primaryActionText}>{t("home.primaryAction")}</Text>
          <AppIcon name={row === "row" ? "arrowRight" : "arrowLeft"} color={colors.background} size={19} strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={styles.journeyBlock}>
        <View style={[styles.journeyHeading, { flexDirection: row }]}>
          <Text style={[styles.sectionTitle, { textAlign: textStart }]}>{t("home.journeyTitle")}</Text>
          <Text style={styles.todayText}>{t("home.today")}</Text>
        </View>
        <View style={[styles.journeyRail, { flexDirection: row }]}>
          <View style={styles.journeyStep}>
            <View style={[styles.stepMark, styles.stepDone]}><AppIcon name="check" color={colors.background} size={13} strokeWidth={2.4} /></View>
            <Text style={styles.stepLabel}>{t("home.journeyPreparing")}</Text>
          </View>
          <View style={[styles.railLine, styles.railLineDone]} />
          <View style={styles.journeyStep}>
            <View style={[styles.stepMark, styles.stepCurrent]}><View style={styles.currentDot} /></View>
            <Text style={[styles.stepLabel, styles.stepLabelCurrent]}>{t("home.journeyTreatment")}</Text>
          </View>
          <View style={styles.railLine} />
          <View style={styles.journeyStep}>
            <View style={styles.stepMark} />
            <Text style={styles.stepLabel}>{t("home.journeyRecovery")}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { textAlign: textStart }]}>{t("home.exploreTitle")}</Text>
      </View>

      <View style={styles.featureGrid}>
        <FeatureCard
          icon="spark"
          title={t("home.simulationTitle")}
          copy={t("home.simulationCopy")}
          tone="iris"
          onPress={onOpenTimeline}
          direction={row}
          textAlign={textStart}
        />
        <FeatureCard
          icon="camera"
          title={t("home.captureTitle")}
          copy={t("home.captureCopy")}
          tone="pearl"
          onPress={onOpenCamera}
          direction={row}
          textAlign={textStart}
        />
        <FeatureCard
          icon="shield"
          title={t("home.teamTitle")}
          copy={t("home.teamCopy")}
          tone="sage"
          onPress={onOpenClinicAlerts}
          direction={row}
          textAlign={textStart}
        />
      </View>

      <View style={[styles.safetyCard, { flexDirection: row }]}>
        <View style={styles.safetyIcon}><AppIcon name="info" color={colors.accentSoft} size={18} /></View>
        <View style={styles.safetyBody}>
          <Text style={[styles.safetyTitle, { textAlign: textStart }]}>{t("home.safetyTitle")}</Text>
          <Text style={[styles.safetyCopy, { textAlign: textStart }]}>{t("home.safetyCopy")}</Text>
          <Pressable accessibilityRole="button" style={styles.readGuide}>
            <Text style={styles.readGuideText}>{t("home.readProtocol")}</Text>
            <AppIcon name={row === "row" ? "chevronRight" : "chevronLeft"} color={colors.accentSoft} size={15} />
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 26, gap: 18 },
  topBar: { alignItems: "center", justifyContent: "space-between" },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 7 },
  brand: { color: colors.ink, fontSize: 15, fontWeight: "800", letterSpacing: 2.8 },
  brandDot: { width: 6, height: 6, borderRadius: radius.pill, backgroundColor: colors.accent },
  hero: { minHeight: 356, borderRadius: radius.xl, overflow: "hidden", justifyContent: "flex-end", ...shadows.soft },
  heroImage: { borderRadius: radius.xl, opacity: 0.96 },
  heroShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(7, 8, 24, 0.20)" },
  heroContent: { padding: 24, gap: 10 },
  eyebrowRow: { alignItems: "center", gap: 8 },
  eyebrowSpark: { width: 24, height: 24, borderRadius: radius.pill, backgroundColor: "rgba(188, 162, 246, 0.16)", alignItems: "center", justifyContent: "center" },
  eyebrow: { color: colors.accentSoft, fontSize: 10, lineHeight: 15, fontWeight: "800", letterSpacing: 1.1, flexShrink: 1 },
  heroTitle: { color: colors.ink, fontSize: 36, lineHeight: 42, fontWeight: "700", letterSpacing: -1.1, maxWidth: "82%" },
  heroCopy: { color: colors.inkSoft, fontSize: 15, lineHeight: 22, maxWidth: "86%" },
  sectionHeader: { marginTop: 2 },
  sectionEyebrow: { color: colors.accentSoft, fontSize: 12, fontWeight: "800", letterSpacing: 0.9, textTransform: "uppercase" },
  sectionTitle: { color: colors.ink, fontSize: 20, lineHeight: 26, fontWeight: "700", letterSpacing: -0.3 },
  nextStepCard: { backgroundColor: colors.glassStrong, borderColor: colors.borderStrong, borderWidth: 1, padding: 18, borderRadius: radius.lg, gap: 14, ...shadows.glow },
  nextStepTop: { alignItems: "center", justifyContent: "space-between" },
  nextStepIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  onTrack: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(139, 212, 187, 0.12)", paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill },
  onTrackText: { color: colors.sageSoft, fontSize: 11, fontWeight: "700" },
  nextStepCopy: { color: colors.ink, fontSize: 17, lineHeight: 24, fontWeight: "600" },
  primaryAction: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, borderRadius: radius.md, backgroundColor: colors.accent },
  primaryPressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
  primaryActionText: { color: colors.background, fontSize: 15, fontWeight: "800" },
  journeyBlock: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 18 },
  journeyHeading: { alignItems: "center", justifyContent: "space-between" },
  todayText: { color: colors.sageSoft, fontSize: 12, fontWeight: "700", backgroundColor: "rgba(139, 212, 187, 0.12)", paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill },
  journeyRail: { alignItems: "flex-start", justifyContent: "space-between" },
  journeyStep: { width: 74, alignItems: "center", gap: 8 },
  stepMark: { width: 25, height: 25, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surfaceElevated, alignItems: "center", justifyContent: "center" },
  stepDone: { borderColor: colors.sage, backgroundColor: colors.sage },
  stepCurrent: { borderColor: colors.accent, backgroundColor: "rgba(188, 162, 246, 0.16)" },
  currentDot: { width: 9, height: 9, borderRadius: radius.pill, backgroundColor: colors.accent },
  railLine: { height: 1, flex: 1, marginTop: 12, backgroundColor: colors.borderStrong },
  railLineDone: { backgroundColor: colors.sage },
  stepLabel: { color: colors.muted, fontSize: 11, fontWeight: "600", textAlign: "center" },
  stepLabelCurrent: { color: colors.inkSoft },
  featureGrid: { gap: 10 },
  featureCard: { minHeight: 150, padding: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, gap: 10 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  featureTop: { alignItems: "center", justifyContent: "space-between" },
  featureIcon: { width: 40, height: 40, borderWidth: 1, backgroundColor: colors.surfaceElevated, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  featureArrow: { width: 32, height: 32, borderRadius: radius.pill, backgroundColor: "rgba(252, 250, 255, 0.06)", alignItems: "center", justifyContent: "center" },
  featureTitle: { color: colors.ink, fontSize: 17, fontWeight: "700", letterSpacing: -0.2 },
  featureCopy: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  safetyCard: { alignItems: "flex-start", gap: 12, padding: 16, borderRadius: radius.md, backgroundColor: "rgba(188, 162, 246, 0.08)", borderWidth: 1, borderColor: "rgba(188, 162, 246, 0.17)" },
  safetyIcon: { marginTop: 1, width: 29, height: 29, borderRadius: radius.pill, backgroundColor: "rgba(188, 162, 246, 0.14)", alignItems: "center", justifyContent: "center" },
  safetyBody: { flex: 1, gap: 5 },
  safetyTitle: { color: colors.inkSoft, fontSize: 14, fontWeight: "700" },
  safetyCopy: { color: colors.mutedStrong, fontSize: 12, lineHeight: 18 },
  readGuide: { minHeight: 36, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  readGuideText: { color: colors.accentSoft, fontSize: 12, fontWeight: "800" },
});
