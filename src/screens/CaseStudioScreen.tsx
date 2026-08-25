import { useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useRTL } from "@/hooks/useRTL";
import { colors, radius, shadows } from "@/theme/colors";

type StudioView = "overview" | "atlas" | "plan" | "followUp";
type AtlasView = "front" | "threeQuarter" | "profile";
type PlanPhase = "now" | "next" | "maintain";

interface CaseStudioScreenProps {
  onOpenCamera: () => void;
  onOpenCheckIn: () => void;
}

interface NavItem {
  id: StudioView;
  labelKey: "studio.navOverview" | "studio.navAtlas" | "studio.navPlan" | "studio.navFollowUp";
  icon: AppIconName;
}

const navItems: NavItem[] = [
  { id: "overview", labelKey: "studio.navOverview", icon: "home" },
  { id: "atlas", labelKey: "studio.navAtlas", icon: "camera" },
  { id: "plan", labelKey: "studio.navPlan", icon: "spark" },
  { id: "followUp", labelKey: "studio.navFollowUp", icon: "heart" },
];

const atlasImages = {
  front: require("../../assets/studio-case-front.jpg"),
  threeQuarter: require("../../assets/studio-case-portrait.jpg"),
  profile: require("../../assets/studio-case-profile.jpg"),
} as const;

const atlasLabelKeys: Record<AtlasView, "studio.frontal" | "studio.threeQuarter" | "studio.profile"> = {
  front: "studio.frontal",
  threeQuarter: "studio.threeQuarter",
  profile: "studio.profile",
};

function StatusPill({ icon, label, tone = "orchid" }: { icon: AppIconName; label: string; tone?: "orchid" | "sage" | "stone" }) {
  const toneStyle = tone === "sage" ? styles.pillSage : tone === "stone" ? styles.pillStone : styles.pillOrchid;
  const iconColor = tone === "sage" ? colors.sage : tone === "stone" ? colors.mutedStrong : colors.accent;
  return <View style={[styles.pill, toneStyle]}><AppIcon name={icon} color={iconColor} size={13} strokeWidth={2.2} /><Text style={[styles.pillText, { color: iconColor }]}>{label}</Text></View>;
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function CaseStudioScreen({ onOpenCamera, onOpenCheckIn }: CaseStudioScreenProps) {
  const { t } = useTranslation();
  const { row, textStart, writingDirection } = useRTL();
  const { width } = useWindowDimensions();
  const desktop = width >= 980;
  const [view, setView] = useState<StudioView>("overview");
  const [atlasView, setAtlasView] = useState<AtlasView>("front");
  const [planPhase, setPlanPhase] = useState<PlanPhase>("now");

  const planContent = useMemo(() => ({
    now: { label: t("studio.planNow"), title: t("studio.planNowTitle"), copy: t("studio.planNowCopy"), number: "01" },
    next: { label: t("studio.planNext"), title: t("studio.planNextTitle"), copy: t("studio.planNextCopy"), number: "02" },
    maintain: { label: t("studio.planMaintain"), title: t("studio.planMaintainTitle"), copy: t("studio.planMaintainCopy"), number: "03" },
  }), [t]);
  const selectedPlan = planContent[planPhase];

  const renderAtlas = (expanded = false) => (
    <View style={[styles.atlasCard, expanded && styles.atlasExpanded]}>
      <View style={[styles.cardHeader, { flexDirection: row }]}>
        <View style={styles.cardHeaderCopy}>
          <SectionLabel>{t("studio.atlasTitle")}</SectionLabel>
          <Text style={[styles.cardTitle, { textAlign: textStart }]}>{t("studio.atlasCopy")}</Text>
        </View>
        <StatusPill icon="check" label={t("studio.standardized")} tone="sage" />
      </View>
      <View style={[styles.atlasLayout, !desktop && styles.atlasLayoutMobile, { flexDirection: desktop ? row : "column" }]}>
        <View style={styles.heroImageFrame}>
          <Image source={atlasImages[atlasView]} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.imageBadge}><Text style={styles.imageBadgeText}>{t(atlasLabelKeys[atlasView])}</Text></View>
          <View style={styles.imageFooter}><AppIcon name="scan" color={colors.white} size={14} /><Text style={styles.imageFooterText}>{t("studio.demo")}</Text></View>
        </View>
        <View style={styles.atlasSide}>
          <View style={styles.atlasTabs}>
            {(["front", "threeQuarter", "profile"] as AtlasView[]).map((item) => {
              const active = atlasView === item;
              return <Pressable key={item} accessibilityRole="button" onPress={() => setAtlasView(item)} style={[styles.atlasTab, active && styles.atlasTabActive]}><Image source={atlasImages[item]} style={styles.tabImage} resizeMode="cover" /><View style={styles.tabLabelWrap}><Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t(atlasLabelKeys[item])}</Text><Text style={styles.tabMeta}>4:5</Text></View></Pressable>;
            })}
          </View>
          <View style={styles.atlasNote}><View style={styles.atlasNoteMark}><AppIcon name="info" color={colors.accent} size={17} /></View><Text style={[styles.atlasNoteText, { textAlign: textStart }]}>{t("studio.assistantDraft")}</Text></View>
          <Pressable accessibilityRole="button" onPress={onOpenCamera} style={[styles.secondaryAction, { flexDirection: row }]}><Text style={styles.secondaryActionText}>{t("studio.startCapture")}</Text><AppIcon name={row === "row" ? "arrowRight" : "arrowLeft"} color={colors.accent} size={17} /></Pressable>
        </View>
      </View>
    </View>
  );

  const renderPlan = (expanded = false) => (
    <View style={[styles.planCard, expanded && styles.planExpanded]}>
      <View style={[styles.cardHeader, { flexDirection: row }]}>
        <View style={styles.cardHeaderCopy}><SectionLabel>{t("studio.planTitle")}</SectionLabel><Text style={[styles.cardTitle, { textAlign: textStart }]}>{t("studio.reviewed")}</Text></View>
        <StatusPill icon="shield" label={t("studio.reviewed")} tone="orchid" />
      </View>
      <View style={[styles.planRail, { flexDirection: desktop ? row : "column" }]}>
        {(["now", "next", "maintain"] as PlanPhase[]).map((phase) => {
          const item = planContent[phase];
          const active = phase === planPhase;
          return <Pressable key={phase} accessibilityRole="button" onPress={() => setPlanPhase(phase)} style={[styles.planStep, active && styles.planStepActive]}><View style={[styles.planNumber, active && styles.planNumberActive]}><Text style={[styles.planNumberText, active && styles.planNumberTextActive]}>{item.number}</Text></View><Text style={[styles.planStepLabel, active && styles.planStepLabelActive]}>{item.label}</Text></Pressable>;
        })}
      </View>
      <View style={styles.planDetail}><Text style={styles.planDetailEyebrow}>{selectedPlan.label}</Text><Text style={[styles.planDetailTitle, { textAlign: textStart }]}>{selectedPlan.title}</Text><Text style={[styles.planDetailCopy, { textAlign: textStart }]}>{selectedPlan.copy}</Text></View>
    </View>
  );

  const renderFollowUp = (expanded = false) => (
    <View style={[styles.followCard, expanded && styles.followExpanded]}>
      <View style={[styles.cardHeader, { flexDirection: row }]}><View style={styles.cardHeaderCopy}><SectionLabel>{t("studio.followUpTitle")}</SectionLabel><Text style={[styles.cardTitle, { textAlign: textStart }]}>{t("studio.followUpCopy")}</Text></View><View style={styles.calendarIcon}><AppIcon name="calendar" color={colors.accent} size={21} /></View></View>
      <View style={[styles.followTimeline, { flexDirection: row }]}><View style={styles.followNodeDone}><AppIcon name="check" color={colors.white} size={13} strokeWidth={2.6} /></View><View style={styles.followLine} /><View style={styles.followNodeActive}><View style={styles.followNodeInner} /></View><View style={styles.followLineMuted} /><View style={styles.followNode} /></View>
      <View style={[styles.followFooter, { flexDirection: row }]}><View><Text style={[styles.followDate, { textAlign: textStart }]}>{t("studio.day14")}</Text><Text style={[styles.followMeta, { textAlign: textStart }]}>{t("studio.privacy")}</Text></View><Pressable accessibilityRole="button" onPress={onOpenCheckIn} style={styles.followButton}><Text style={styles.followButtonText}>{t("studio.checkIn")}</Text><AppIcon name={row === "row" ? "arrowRight" : "arrowLeft"} color={colors.white} size={16} /></Pressable></View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { direction: writingDirection }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.page, desktop && styles.pageDesktop]} showsVerticalScrollIndicator={false}>
        <View style={[styles.topBar, { flexDirection: row }]}>
          <View style={[styles.brandLine, { flexDirection: row }]}><View style={styles.brandMark}><View style={styles.brandCore} /></View><Text style={styles.brand}>{t("studio.brand")}</Text></View>
          <View style={[styles.topActions, { flexDirection: row }]}><StatusPill icon="shield" label={t("studio.privacy")} tone="stone" /><LanguageSwitcher /></View>
        </View>

        <View style={[styles.caseHeader, desktop && styles.caseHeaderDesktop, { flexDirection: desktop ? row : "column" }]}>
          <View style={styles.caseTitleWrap}><View style={[styles.demoLine, { flexDirection: row }]}><View style={styles.demoDot} /><Text style={styles.demoText}>{t("studio.demo")}</Text></View><Text style={[styles.caseTitle, { textAlign: textStart }]}>{t("studio.patientName")}</Text><Text style={[styles.caseMeta, { textAlign: textStart }]}>{t("studio.patientMeta")}</Text></View>
          <View style={[styles.caseStatus, { flexDirection: row }]}><View style={styles.statusPulse} /><View><Text style={[styles.statusEyebrow, { textAlign: textStart }]}>{t("studio.caseCanvas")}</Text><Text style={[styles.statusTitle, { textAlign: textStart }]}>{t("studio.nextReview")}</Text></View></View>
        </View>

        <View style={[styles.workbench, desktop && styles.workbenchDesktop, { flexDirection: desktop ? row : "column" }]}>
          <View style={[styles.navRail, desktop ? styles.navRailDesktop : styles.navRailMobile, { flexDirection: desktop ? "column" : row }]}>
            {navItems.map((item) => {
              const active = view === item.id;
              return <Pressable key={item.id} accessibilityRole="button" onPress={() => setView(item.id)} style={[styles.navItem, active && styles.navItemActive, desktop ? styles.navItemDesktop : styles.navItemMobile]}><AppIcon name={item.icon} color={active ? colors.white : colors.mutedStrong} size={18} strokeWidth={2} /><Text numberOfLines={1} style={[styles.navText, active && styles.navTextActive]}>{t(item.labelKey)}</Text></Pressable>;
            })}
          </View>

          <View style={styles.mainCanvas}>
            {view === "overview" ? <>
              <View style={[styles.briefCard, { flexDirection: desktop ? row : "column" }]}>
                <View style={styles.briefLead}><SectionLabel>{t("studio.briefTitle")}</SectionLabel><Text style={[styles.briefGoal, { textAlign: textStart }]}>{t("studio.briefGoal")}</Text><Text style={[styles.briefQuote, { textAlign: textStart }]}>{t("studio.briefQuote")}</Text></View>
                <View style={styles.briefNote}><View style={styles.briefNoteIcon}><AppIcon name="heart" color={colors.accent} size={19} /></View><Text style={[styles.briefNoteText, { textAlign: textStart }]}>{t("studio.briefNote")}</Text></View>
              </View>
              {renderAtlas()}
              {renderPlan()}
            </> : null}
            {view === "atlas" ? renderAtlas(true) : null}
            {view === "plan" ? renderPlan(true) : null}
            {view === "followUp" ? renderFollowUp(true) : null}
          </View>

          {view === "overview" ? <View style={styles.contextRail}>{renderFollowUp()}<View style={styles.queueCard}><View style={[styles.queueHeader, { flexDirection: row }]}><View style={styles.queueIcon}><AppIcon name="spark" color={colors.white} size={18} /></View><Text style={styles.queueTitle}>{t("studio.careQueue")}</Text></View><Text style={[styles.queueCopy, { textAlign: textStart }]}>{t("studio.careQueueCopy")}</Text><Pressable accessibilityRole="button" style={[styles.queueAction, { flexDirection: row }]}><Text style={styles.queueActionText}>{t("studio.sendReview")}</Text><AppIcon name={row === "row" ? "arrowRight" : "arrowLeft"} color={colors.accent} size={16} /></Pressable></View><Text style={[styles.demoNotice, { textAlign: textStart }]}>{t("studio.demoNotice")}</Text></View> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  page: { width: "100%", maxWidth: 1520, alignSelf: "center", paddingHorizontal: 18, paddingVertical: 18, gap: 20 },
  pageDesktop: { paddingHorizontal: 36, paddingVertical: 28, gap: 28 },
  topBar: { alignItems: "center", justifyContent: "space-between", gap: 12 },
  brandLine: { alignItems: "center", gap: 10 },
  brandMark: { width: 28, height: 28, borderRadius: 9, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" },
  brandCore: { width: 11, height: 11, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.pearl },
  brand: { color: colors.ink, fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  topActions: { alignItems: "center", gap: 10 },
  pill: { minHeight: 28, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9, borderRadius: radius.pill },
  pillOrchid: { backgroundColor: "#E8E4F4" },
  pillSage: { backgroundColor: colors.sageSoft },
  pillStone: { backgroundColor: colors.surfaceElevated },
  pillText: { fontSize: 10, fontWeight: "800" },
  caseHeader: { gap: 16, paddingTop: 12, paddingBottom: 4 },
  caseHeaderDesktop: { alignItems: "flex-end", justifyContent: "space-between" },
  caseTitleWrap: { gap: 5 },
  demoLine: { alignItems: "center", gap: 6 },
  demoDot: { width: 7, height: 7, borderRadius: radius.pill, backgroundColor: colors.accent },
  demoText: { color: colors.accent, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  caseTitle: { color: colors.ink, fontSize: 42, lineHeight: 48, fontWeight: "700", letterSpacing: -1.5 },
  caseMeta: { color: colors.mutedStrong, fontSize: 15, lineHeight: 21 },
  caseStatus: { alignItems: "center", gap: 10, padding: 13, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, minWidth: 215 },
  statusPulse: { width: 10, height: 10, borderRadius: radius.pill, backgroundColor: colors.sage, shadowColor: colors.sage, shadowOpacity: 0.6, shadowRadius: 6, elevation: 3 },
  statusEyebrow: { color: colors.muted, fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  statusTitle: { color: colors.inkSoft, fontSize: 13, fontWeight: "700", marginTop: 2 },
  workbench: { gap: 18, alignItems: "flex-start" },
  workbenchDesktop: { gap: 26 },
  navRail: { gap: 6 },
  navRailDesktop: { width: 154, paddingTop: 2 },
  navRailMobile: { width: "100%", justifyContent: "space-between", padding: 5, borderRadius: radius.md, backgroundColor: "rgba(255, 255, 255, 0.65)", borderWidth: 1, borderColor: colors.border },
  navItem: { gap: 8, alignItems: "center", borderRadius: radius.sm },
  navItemDesktop: { minHeight: 46, flexDirection: "row", paddingHorizontal: 10 },
  navItemMobile: { flex: 1, minHeight: 50, justifyContent: "center" },
  navItemActive: { backgroundColor: colors.ink },
  navText: { color: colors.mutedStrong, fontSize: 11, fontWeight: "700" },
  navTextActive: { color: colors.white },
  mainCanvas: { flex: 1, minWidth: 0, gap: 18 },
  contextRail: { width: 278, gap: 14 },
  briefCard: { backgroundColor: colors.ink, borderRadius: radius.xl, overflow: "hidden", minHeight: 230 },
  briefLead: { flex: 1, gap: 9, padding: 24, justifyContent: "center" },
  sectionLabel: { color: colors.accentSoft, fontSize: 10, fontWeight: "800", letterSpacing: 1.1, textTransform: "uppercase" },
  briefGoal: { color: "#D6D0C8", fontSize: 12, fontWeight: "700", marginTop: 2 },
  briefQuote: { color: colors.white, fontSize: 26, lineHeight: 34, fontWeight: "500", letterSpacing: -0.6 },
  briefNote: { width: 250, justifyContent: "space-between", padding: 20, backgroundColor: "#EEE8E0" },
  briefNoteIcon: { width: 36, height: 36, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  briefNoteText: { color: colors.inkSoft, fontSize: 13, lineHeight: 19, fontWeight: "600" },
  atlasCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 18, gap: 17, ...shadows.soft },
  atlasExpanded: { minHeight: 560 },
  cardHeader: { justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  cardHeaderCopy: { flex: 1, gap: 5 },
  cardTitle: { color: colors.ink, fontSize: 18, lineHeight: 25, fontWeight: "600", maxWidth: 520 },
  atlasLayout: { gap: 16 },
  atlasLayoutMobile: { gap: 14 },
  heroImageFrame: { flex: 1, minHeight: 320, borderRadius: radius.md, overflow: "hidden", backgroundColor: colors.surfaceElevated },
  heroImage: { width: "100%", height: "100%" },
  imageBadge: { position: "absolute", top: 12, left: 12, paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: "rgba(27, 26, 24, 0.75)" },
  imageBadgeText: { color: colors.white, fontSize: 10, fontWeight: "800" },
  imageFooter: { position: "absolute", bottom: 12, left: 12, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: "rgba(27, 26, 24, 0.7)" },
  imageFooterText: { color: colors.white, fontSize: 10, fontWeight: "800", letterSpacing: 0.4 },
  atlasSide: { width: 210, gap: 10 },
  atlasTabs: { gap: 8 },
  atlasTab: { minHeight: 70, padding: 6, flexDirection: "row", alignItems: "center", gap: 9, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.backgroundRaised },
  atlasTabActive: { borderColor: colors.accent, backgroundColor: "#F0EDF9" },
  tabImage: { width: 46, height: 56, borderRadius: 7 },
  tabLabelWrap: { gap: 2 },
  tabLabel: { color: colors.inkSoft, fontSize: 12, fontWeight: "700" },
  tabLabelActive: { color: colors.accentStrong },
  tabMeta: { color: colors.muted, fontSize: 10 },
  atlasNote: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 11, borderRadius: radius.sm, backgroundColor: "#F5F2FB" },
  atlasNoteMark: { width: 23, height: 23, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  atlasNoteText: { flex: 1, color: colors.accentStrong, fontSize: 11, lineHeight: 16, fontWeight: "600" },
  secondaryAction: { minHeight: 40, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, borderRadius: radius.sm, borderWidth: 1, borderColor: "#CBC1E6", backgroundColor: colors.white },
  secondaryActionText: { color: colors.accent, fontSize: 12, fontWeight: "800" },
  planCard: { padding: 18, borderRadius: radius.lg, backgroundColor: "#EEE9E3", gap: 17 },
  planExpanded: { minHeight: 460 },
  planRail: { gap: 8 },
  planStep: { flex: 1, minHeight: 95, gap: 8, padding: 13, borderRadius: radius.md, backgroundColor: "rgba(255, 255, 255, 0.50)" },
  planStepActive: { backgroundColor: colors.white, ...shadows.soft },
  planNumber: { width: 26, height: 26, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: "#D7D0C7" },
  planNumberActive: { backgroundColor: colors.accent },
  planNumberText: { color: colors.inkSoft, fontSize: 10, fontWeight: "800" },
  planNumberTextActive: { color: colors.white },
  planStepLabel: { color: colors.mutedStrong, fontSize: 13, fontWeight: "700" },
  planStepLabelActive: { color: colors.ink },
  planDetail: { gap: 6, paddingTop: 4 },
  planDetailEyebrow: { color: colors.accent, fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
  planDetailTitle: { color: colors.ink, fontSize: 21, fontWeight: "700", letterSpacing: -0.4 },
  planDetailCopy: { color: colors.mutedStrong, fontSize: 14, lineHeight: 21, maxWidth: 640 },
  followCard: { padding: 16, gap: 15, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  followExpanded: { minHeight: 350 },
  calendarIcon: { width: 38, height: 38, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: "#EEEAF8" },
  followTimeline: { alignItems: "center", paddingVertical: 5 },
  followNode: { width: 16, height: 16, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.white },
  followNodeDone: { width: 18, height: 18, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: colors.sage },
  followNodeActive: { width: 18, height: 18, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: "#E5DFF7", borderWidth: 1, borderColor: colors.accent },
  followNodeInner: { width: 7, height: 7, borderRadius: radius.pill, backgroundColor: colors.accent },
  followLine: { height: 1, flex: 1, backgroundColor: colors.sage },
  followLineMuted: { height: 1, flex: 1, backgroundColor: colors.borderStrong },
  followFooter: { alignItems: "flex-end", justifyContent: "space-between", gap: 10 },
  followDate: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  followMeta: { color: colors.muted, fontSize: 10, marginTop: 2 },
  followButton: { minHeight: 36, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, borderRadius: radius.sm, backgroundColor: colors.ink },
  followButtonText: { color: colors.white, fontSize: 11, fontWeight: "800" },
  queueCard: { padding: 16, gap: 12, borderRadius: radius.lg, backgroundColor: "#E7E2F5" },
  queueHeader: { alignItems: "center", gap: 8 },
  queueIcon: { width: 30, height: 30, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent },
  queueTitle: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  queueCopy: { color: colors.inkSoft, fontSize: 13, lineHeight: 19 },
  queueAction: { minHeight: 35, alignItems: "center", justifyContent: "space-between", paddingTop: 5 },
  queueActionText: { color: colors.accentStrong, fontSize: 12, fontWeight: "800" },
  demoNotice: { color: colors.muted, fontSize: 10, lineHeight: 15, paddingHorizontal: 3 },
});
