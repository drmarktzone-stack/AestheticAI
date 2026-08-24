import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getMaterial,
  materialClassLabel,
  materials,
  noveltyLabel,
  planeLabel,
} from "../data";
import type { MaterialClass, MaterialNovelty } from "../data/types";
import { EmptyState, PageHeader, ReviewFlag, SearchField, Badge } from "../components/ui";
import { useLocale } from "../i18n";
import "./Materials.css";

const CLASS_FILTERS: (MaterialClass | "all")[] = [
  "all",
  "ha",
  "toxin",
  "biostimulator",
  "caha",
  "hybrid",
  "pn",
  "regenerative",
  "enzyme",
];

const NOVELTY_FILTERS: (MaterialNovelty | "all")[] = ["all", "frontier", "emerging", "established"];

export function MaterialsPage() {
  const { locale } = useLocale();
  const [q, setQ] = useState("");
  const [classFilter, setClassFilter] = useState<MaterialClass | "all">("all");
  const [noveltyFilter, setNoveltyFilter] = useState<MaterialNovelty | "all">("all");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return materials.filter((m) => {
      if (classFilter !== "all" && m.class !== classFilter) return false;
      if (noveltyFilter !== "all" && m.novelty !== noveltyFilter) return false;
      if (!s) return true;
      const hay = [
        m.nameHe,
        m.nameEn,
        m.nameAr ?? "",
        materialClassLabel[m.class] ?? "",
        ...(m.brands ?? []),
        m.gPrime ?? "",
        ...(m.typicalUses ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(s) || m.nameHe.includes(q);
    });
  }, [q, classFilter, noveltyFilter]);

  const title =
    locale === "he" ? "חומרים ותכשירים" : locale === "ar" ? "المواد والمستحضرات" : "Materials";
  const lead =
    locale === "he"
      ? `${materials.length} מוצרים — HA, טוקסין, ביוסטימ, PN, היברידיים וחומרי חזית. מינונים מספריים + IFU.`
      : locale === "ar"
        ? `${materials.length} منتج — HA، توكسين، محفزات، PN، هجينة ومواد متقدمة.`
        : `${materials.length} products — HA, toxin, biostim, PN, hybrids & frontier. Numeric dosing + IFU.`;

  return (
    <div>
      <PageHeader
        eyebrow={locale === "he" ? "ספרייה קלינית" : locale === "ar" ? "مكتبة سريرية" : "Clinical library"}
        title={title}
        lead={lead}
        actions={
          <SearchField
            value={q}
            onChange={setQ}
            placeholder={
              locale === "he"
                ? "חיפוש מותג / מוצר / G′"
                : locale === "ar"
                  ? "بحث علامة / منتج"
                  : "Search brand / product / G′"
            }
          />
        }
      />

      <div className="mat-filters" role="tablist">
        {CLASS_FILTERS.map((c) => (
          <button
            key={c}
            type="button"
            className={classFilter === c ? "active" : ""}
            onClick={() => setClassFilter(c)}
          >
            {c === "all"
              ? locale === "he"
                ? "הכל"
                : locale === "ar"
                  ? "الكل"
                  : "All"
              : materialClassLabel[c]}
          </button>
        ))}
      </div>

      <div className="mat-novelty-filters">
        {NOVELTY_FILTERS.map((n) => (
          <button
            key={n}
            type="button"
            className={`mat-nov ${noveltyFilter === n ? "active" : ""} ${n === "frontier" ? "frontier" : ""}`}
            onClick={() => setNoveltyFilter(n)}
          >
            {n === "all"
              ? locale === "he"
                ? "כל הרמות"
                : "All tiers"
              : noveltyLabel[n]}
          </button>
        ))}
      </div>

      <p className="mat-count">
        {filtered.length} / {materials.length}{" "}
        {locale === "he" ? "מוצרים" : locale === "ar" ? "منتجات" : "products"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState text={locale === "he" ? "לא נמצאו חומרים." : "No materials found."} />
      ) : (
        <div className="list-grid">
          {filtered.map((m) => (
            <Link key={m.id} to={`/materials/${m.id}`} className="list-link">
              <div className="meta-row">
                <Badge tone="accent">{materialClassLabel[m.class]}</Badge>
                {m.novelty === "frontier" ? (
                  <Badge tone="warn">{noveltyLabel.frontier}</Badge>
                ) : m.novelty === "emerging" ? (
                  <Badge tone="neutral">{noveltyLabel.emerging}</Badge>
                ) : null}
                <ReviewFlag reviewed={m.reviewedByPhysician} />
              </div>
              <h2>{locale === "ar" && m.nameAr ? m.nameAr : m.nameHe}</h2>
              <p className="mat-brands">{m.brands?.slice(0, 3).join(" · ")}</p>
              <p>{m.typicalUses.slice(0, 3).join(" · ")}</p>
              {m.gPrime ? <p className="mat-gprime">{m.gPrime}</p> : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function MaterialDetailPage() {
  const { locale } = useLocale();
  const { id } = useParams();
  const material = getMaterial(id ?? "");

  if (!material) {
    return (
      <div>
        <Link to="/materials" className="back-link">
          ← {locale === "he" ? "חזרה לחומרים" : "Back to materials"}
        </Link>
        <EmptyState text={locale === "he" ? "החומר לא נמצא." : "Material not found."} />
      </div>
    );
  }

  const displayName =
    locale === "ar" && material.nameAr ? material.nameAr : material.nameHe;

  return (
    <div>
      <Link to="/materials" className="back-link">
        ← {locale === "he" ? "חזרה לחומרים" : "Back to materials"}
      </Link>
      <PageHeader
        eyebrow={material.nameEn}
        title={displayName}
        lead={[material.rheology, material.gPrime, material.concentration].filter(Boolean).join(" · ")}
        actions={
          <div className="meta-row">
            <Badge tone="accent">{materialClassLabel[material.class]}</Badge>
            {material.novelty ? (
              <Badge tone={material.novelty === "frontier" ? "warn" : "neutral"}>
                {noveltyLabel[material.novelty]}
              </Badge>
            ) : null}
            <ReviewFlag reviewed={material.reviewedByPhysician} />
          </div>
        }
      />

      {material.brands?.length ? (
        <section className="detail-panel mat-brands-panel">
          <h2>{locale === "he" ? "מותגים / שמות מסחר" : "Brands / trade names"}</h2>
          <p>{material.brands.join(" · ")}</p>
        </section>
      ) : null}

      <div className="detail-grid two">
        <div>
          <section className="detail-panel">
            <h2>{locale === "he" ? "שימושים אופייניים" : "Typical uses"}</h2>
            <ul>
              {material.typicalUses.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>{locale === "he" ? "מסגרת מינון (מספרים)" : "Dosing framework (numeric)"}</h2>
            <ul>
              {material.doseNotes.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>{locale === "he" ? "פנינים קליניות" : "Clinical pearls"}</h2>
            <ul>
              {material.pearls.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        </div>
        <div>
          <section className="detail-panel">
            <h2>{locale === "he" ? "מישורי הזרקה" : "Injection planes"}</h2>
            <ul>
              {material.planes.map((p) => (
                <li key={p}>{planeLabel[p]}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>{locale === "he" ? "קונטרה־אינדיקציות" : "Contraindications"}</h2>
            <ul>
              {material.contraindications.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>{locale === "he" ? "מקורות" : "Sources"}</h2>
            <ul>
              {material.sources.map((s) => (
                <li key={s.label}>
                  {s.label}
                  {s.note ? ` — ${s.note}` : ""}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
