import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useRTL } from "@/hooks/useRTL";
import { colors } from "@/theme/colors";

const primary = colors.accent;
const line = colors.surfaceElevated;
import {
  MOBILE_CITATIONS,
  MOBILE_COMPANIES,
  MOBILE_DOMAINS,
  citationById,
  type MobileCompany,
} from "@/data/aestheticWorld";

type Tab = "companies" | "domains" | "evidence";

export function AestheticWorldScreen({ onClose }: { onClose: () => void }) {
  const { i18n } = useTranslation();
  const { textStart, row } = useRTL();
  const isHe = i18n.language === "he" || i18n.language === "ar";
  const [tab, setTab] = useState<Tab>("companies");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<MobileCompany | null>(null);

  const companies = useMemo(() => {
    const s = q.trim().toLowerCase();
    return MOBILE_COMPANIES.filter((c) => {
      if (!s) return true;
      return (
        c.name.toLowerCase().includes(s) ||
        c.focus.join(" ").toLowerCase().includes(s) ||
        c.productNames.join(" ").toLowerCase().includes(s)
      );
    });
  }, [q]);

  const domains = useMemo(() => {
    const s = q.trim().toLowerCase();
    return MOBILE_DOMAINS.filter((d) => {
      if (!s) return true;
      return (
        d.nameHe.includes(q) ||
        d.nameEn.toLowerCase().includes(s) ||
        d.domain.includes(s)
      );
    });
  }, [q]);

  const evidence = useMemo(() => {
    const s = q.trim().toLowerCase();
    return MOBILE_CITATIONS.filter((c) => {
      if (!s) return true;
      return (
        c.titleHe.includes(q) ||
        c.titleEn.toLowerCase().includes(s) ||
        c.issuer.toLowerCase().includes(s)
      );
    });
  }, [q]);

  if (selected) {
    return (
      <ScreenContainer>
        <Pressable onPress={() => setSelected(null)} style={styles.back}>
          <Text style={styles.backText}>{isHe ? "← חזרה לחברות" : "← Back to companies"}</Text>
        </Pressable>
        <ScrollView>
          <Text style={[styles.h1, { textAlign: textStart }]}>{selected.name}</Text>
          <Text style={[styles.why, { textAlign: textStart }]}>
            {isHe ? selected.whyHe : selected.whyEn}
          </Text>
          <Text style={[styles.section, { textAlign: textStart }]}>
            {isHe ? "מיקוד" : "Focus"}
          </Text>
          {selected.focus.map((f) => (
            <Text key={f} style={[styles.li, { textAlign: textStart }]}>
              • {f}
            </Text>
          ))}
          <Text style={[styles.section, { textAlign: textStart }]}>
            {isHe ? "מוצרים" : "Products"}
          </Text>
          {selected.productNames.map((p) => (
            <Text key={p} style={[styles.li, { textAlign: textStart }]}>
              • {p}
            </Text>
          ))}
          <Text style={[styles.section, { textAlign: textStart }]}>
            {isHe ? "פרוטוקולים עולמיים" : "Global protocols"}
          </Text>
          {selected.citationIds.map((id) => {
            const c = citationById(id);
            if (!c) return null;
            return (
              <View key={id} style={styles.citeCard}>
                <Text style={[styles.citeTitle, { textAlign: textStart }]}>
                  {isHe ? c.titleHe : c.titleEn}
                </Text>
                <Text style={[styles.citeIssuer, { textAlign: textStart }]}>{c.issuer}</Text>
                <Text style={[styles.citeBody, { textAlign: textStart }]}>
                  {isHe ? c.summaryHe : c.summaryEn}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={[styles.top, { flexDirection: row }]}>
        <Pressable onPress={onClose}>
          <Text style={styles.backText}>{isHe ? "סגור" : "Close"}</Text>
        </Pressable>
        <Text style={[styles.brand, { textAlign: textStart }]}>
          {isHe ? "עולם האסתטיקה" : "Aesthetic world"}
        </Text>
      </View>

      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder={isHe ? "חיפוש חברה / מוצר / ACE…" : "Search company / product / ACE…"}
        placeholderTextColor={colors.muted}
        style={[styles.search, { textAlign: textStart }]}
      />

      <View style={[styles.tabs, { flexDirection: row }]}>
        {(
          [
            ["companies", isHe ? "חברות" : "Companies"],
            ["domains", isHe ? "תחומים" : "Domains"],
            ["evidence", isHe ? "מקורות" : "Evidence"],
          ] as const
        ).map(([id, label]) => (
          <Pressable
            key={id}
            onPress={() => setTab(id)}
            style={[styles.tab, tab === id && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView>
        {tab === "companies" &&
          companies.map((c) => (
            <Pressable key={c.id} style={styles.card} onPress={() => setSelected(c)}>
              <Text style={[styles.cardTitle, { textAlign: textStart }]}>{c.name}</Text>
              <Text style={[styles.cardSub, { textAlign: textStart }]}>
                {c.productNames.slice(0, 4).join(" · ")}
              </Text>
              <Text style={[styles.cardWhy, { textAlign: textStart }]}>
                {isHe ? c.whyHe : c.whyEn}
              </Text>
            </Pressable>
          ))}

        {tab === "domains" &&
          domains.map((d) => (
            <View key={d.id} style={styles.card}>
              <Text style={[styles.badge, { textAlign: textStart }]}>{d.domain}</Text>
              <Text style={[styles.cardTitle, { textAlign: textStart }]}>
                {isHe ? d.nameHe : d.nameEn}
              </Text>
              <Text style={[styles.cardWhy, { textAlign: textStart }]}>
                {isHe ? d.whyHe : d.whyEn}
              </Text>
            </View>
          ))}

        {tab === "evidence" &&
          evidence.map((c) => (
            <View key={c.id} style={styles.card}>
              <Text style={[styles.cardTitle, { textAlign: textStart }]}>
                {isHe ? c.titleHe : c.titleEn}
              </Text>
              <Text style={[styles.citeIssuer, { textAlign: textStart }]}>{c.issuer}</Text>
              <Text style={[styles.cardSub, { textAlign: textStart }]}>
                {isHe ? c.summaryHe : c.summaryEn}
              </Text>
            </View>
          ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  top: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  brand: {
    fontSize: 20,
    fontWeight: "700",
    color: primary,
    flex: 1,
  },
  back: { marginBottom: 12 },
  backText: { color: primary, fontWeight: "600" },
  search: {
    borderWidth: 1,
    borderColor: line,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.ink,
    marginBottom: 12,
  },
  tabs: { gap: 8, marginBottom: 12 },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: line,
  },
  tabActive: { backgroundColor: primary, borderColor: primary },
  tabText: { color: colors.inkSoft, fontWeight: "600", fontSize: 13 },
  tabTextActive: { color: "#fff" },
  card: {
    borderWidth: 1,
    borderColor: line,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    backgroundColor: colors.surface,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.ink, marginBottom: 4 },
  cardSub: { fontSize: 13, color: colors.inkSoft, marginBottom: 6 },
  cardWhy: { fontSize: 13, color: primary, fontStyle: "italic" },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    color: primary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  h1: { fontSize: 22, fontWeight: "700", color: colors.ink, marginBottom: 8 },
  why: { fontSize: 15, color: primary, marginBottom: 16, lineHeight: 22 },
  section: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
    marginTop: 12,
    marginBottom: 6,
  },
  li: { fontSize: 14, color: colors.inkSoft, marginBottom: 4 },
  citeCard: {
    borderWidth: 1,
    borderColor: line,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  citeTitle: { fontSize: 14, fontWeight: "700", color: colors.ink },
  citeIssuer: { fontSize: 12, color: colors.inkSoft, marginVertical: 4 },
  citeBody: { fontSize: 13, color: colors.inkSoft, lineHeight: 18 },
});
