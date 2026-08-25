import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  COMPANIES,
  DOMAIN_META,
  DOMAIN_PRODUCTS,
  GLOBAL_CITATIONS,
  materials,
  protocols,
  emergencies,
} from "../data";
import { Badge, PageHeader, SearchField } from "../components/ui";
import { useLocale } from "../i18n";
import "./Atlas.css";

type AtlasHit = {
  kind: "company" | "material" | "domain" | "protocol" | "evidence" | "emergency";
  id: string;
  title: string;
  subtitle: string;
  to: string;
};

export function AtlasPage() {
  const { locale, pick } = useLocale();
  const [q, setQ] = useState("");

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    const out: AtlasHit[] = [];

    for (const c of COMPANIES) {
      const hay = [c.name, c.hq, ...c.focus, pick(c.description), pick(c.whyRecommended)]
        .join(" ")
        .toLowerCase();
      if (!s || hay.includes(s)) {
        out.push({
          kind: "company",
          id: c.id,
          title: c.name,
          subtitle: pick(c.whyRecommended),
          to: `/companies/${c.id}`,
        });
      }
    }

    for (const m of materials) {
      const hay = [m.nameHe, m.nameEn, m.nameAr ?? "", ...(m.brands ?? []), ...m.typicalUses]
        .join(" ")
        .toLowerCase();
      if (!s || hay.includes(s) || m.nameHe.includes(q)) {
        out.push({
          kind: "material",
          id: m.id,
          title: locale === "en" ? m.nameEn : m.nameHe,
          subtitle: (m.brands ?? []).slice(0, 3).join(" · ") || m.typicalUses.slice(0, 2).join(" · "),
          to: `/materials/${m.id}`,
        });
      }
    }

    for (const d of DOMAIN_PRODUCTS) {
      const name = locale === "ar" ? d.nameAr : locale === "en" ? d.nameEn : d.nameHe;
      const hay = [name, d.domain, ...d.typicalUses, pick(d.whyRecommended)].join(" ").toLowerCase();
      if (!s || hay.includes(s)) {
        out.push({
          kind: "domain",
          id: d.id,
          title: name,
          subtitle: `${d.domain} · ${pick(d.whyRecommended)}`,
          to: `/world/${d.domain}/${d.id}`,
        });
      }
    }

    for (const p of protocols) {
      const hay = [p.nameHe, p.nameEn ?? "", p.indication].join(" ").toLowerCase();
      if (!s || hay.includes(s) || p.nameHe.includes(q)) {
        out.push({
          kind: "protocol",
          id: p.id,
          title: p.nameHe,
          subtitle: p.indication,
          to: `/protocols/${p.id}`,
        });
      }
    }

    for (const e of GLOBAL_CITATIONS) {
      const hay = [pick(e.title), pick(e.summary), e.issuer, ...(e.tags ?? [])].join(" ").toLowerCase();
      if (!s || hay.includes(s)) {
        out.push({
          kind: "evidence",
          id: e.id,
          title: pick(e.title),
          subtitle: e.issuer,
          to: `/evidence/${e.id}`,
        });
      }
    }

    for (const em of emergencies) {
      const hay = [em.nameHe, ...em.recognition].join(" ").toLowerCase();
      if (!s || hay.includes(s) || em.nameHe.includes(q)) {
        out.push({
          kind: "emergency",
          id: em.id,
          title: em.nameHe,
          subtitle: em.recognition[0] ?? "",
          to: `/emergency/${em.id}`,
        });
      }
    }

    return out;
  }, [q, locale, pick]);

  const kindLabel: Record<AtlasHit["kind"], string> = {
    company: locale === "he" ? "חברה" : "Company",
    material: locale === "he" ? "חומר" : "Material",
    domain: locale === "he" ? "תחום" : "Domain",
    protocol: locale === "he" ? "פרוטוקול" : "Protocol",
    evidence: locale === "he" ? "מקור עולמי" : "Evidence",
    emergency: locale === "he" ? "חירום" : "Emergency",
  };

  const stats = [
    { n: COMPANIES.length, l: locale === "he" ? "חברות" : "companies", to: "/companies" },
    { n: materials.length, l: locale === "he" ? "חומרים" : "materials", to: "/materials" },
    { n: DOMAIN_PRODUCTS.length, l: locale === "he" ? "מוצרי domain" : "domain products", to: "/world" },
    { n: protocols.length, l: locale === "he" ? "פרוטוקולים" : "protocols", to: "/protocols" },
    { n: GLOBAL_CITATIONS.length, l: locale === "he" ? "מקורות" : "citations", to: "/evidence" },
    { n: emergencies.length, l: locale === "he" ? "חירום" : "emergencies", to: "/emergency" },
  ];

  return (
    <div className="atlas-page">
      <PageHeader
        eyebrow="Protokol Atlas"
        title={locale === "he" ? "מפת עולם האסתטיקה" : "Aesthetic world atlas"}
        lead={
          locale === "he"
            ? "חיפוש אחד על כל החברות, המוצרים, התחומים, הפרוטוקולים והמקורות העולמיים."
            : "One search across companies, products, domains, protocols and global evidence."
        }
        actions={
          <SearchField
            value={q}
            onChange={setQ}
            placeholder={
              locale === "he"
                ? "חיפוש: Allergan, Sculptra, ACE, threads, TMJ…"
                : "Search: Allergan, Sculptra, ACE, threads, TMJ…"
            }
          />
        }
      />

      <div className="atlas-stats">
        {stats.map((s) => (
          <Link key={s.to} to={s.to} className="atlas-stat">
            <strong>{s.n}</strong>
            <span>{s.l}</span>
          </Link>
        ))}
      </div>

      <div className="atlas-domains">
        {Object.entries(DOMAIN_META).map(([id, meta]) => (
          <Link key={id} to={meta.route} className="atlas-domain-chip">
            {pick(meta)}
          </Link>
        ))}
      </div>

      <p className="atlas-count">
        {hits.length}{" "}
        {locale === "he" ? "תוצאות בכל עולם האסתטיקה" : "results across the aesthetic world"}
      </p>

      <div className="atlas-results">
        {hits.slice(0, 80).map((h) => (
          <Link key={`${h.kind}-${h.id}`} to={h.to} className="atlas-hit">
            <Badge tone={h.kind === "emergency" ? "danger" : "accent"}>{kindLabel[h.kind]}</Badge>
            <h2>{h.title}</h2>
            <p>{h.subtitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
