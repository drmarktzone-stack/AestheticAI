import { Link, useParams } from "react-router-dom";
import { GLOBAL_CITATIONS, getCitation, citationsForTag } from "../data";
import { Badge, EmptyState, PageHeader, SearchField } from "../components/ui";
import { useLocale } from "../i18n";
import { useMemo, useState } from "react";
import "./Evidence.css";

const TYPE_LABEL: Record<string, { he: string; ar: string; en: string }> = {
  consensus: { he: "קונсенסוס", ar: "إجماع", en: "Consensus" },
  guideline: { he: "הנחיה", ar: "إرشاد", en: "Guideline" },
  society: { he: "אגודה", ar: "جمعية", en: "Society" },
  ifu: { he: "IFU", ar: "IFU", en: "IFU" },
  trial: { he: "מחקר", ar: "دراسة", en: "Trial" },
  training: { he: "הכשרה", ar: "تدريب", en: "Training" },
};

const TAG_FILTERS = [
  "all",
  "emergency",
  "filler",
  "toxin",
  "threads",
  "peels",
  "hair",
  "devices",
  "biostim",
  "general",
];

export function EvidencePage() {
  const { locale, pick } = useLocale();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");

  const filtered = useMemo(() => {
    let list = tag === "all" ? GLOBAL_CITATIONS : citationsForTag(tag);
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter((c) => {
      const hay = [
        pick(c.title),
        pick(c.summary),
        c.issuer,
        ...(c.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(s);
    });
  }, [q, tag, pick]);

  const title =
    locale === "he"
      ? "פרוטוקולים ומקורות עולמיים"
      : locale === "ar"
        ? "بروتوكولات ومصادر عالمية"
        : "Global protocols & evidence";
  const lead =
    locale === "he"
      ? `${GLOBAL_CITATIONS.length} מקורות — ACE, ASAPS, ISAPS, MD Codes, IFU, קונсенסוסים. חובה לציין בכל פרוטוקול.`
      : `${GLOBAL_CITATIONS.length} references — ACE, ASAPS, ISAPS, MD Codes, IFU, consensus. Cited in every protocol.`;

  return (
    <div className="evidence-page">
      <PageHeader
        eyebrow="Evidence registry"
        title={title}
        lead={lead}
        actions={
          <SearchField
            value={q}
            onChange={setQ}
            placeholder={locale === "he" ? "חיפוש ACE / IFU / tag" : "Search ACE / IFU / tag"}
          />
        }
      />

      <div className="evidence-tags" role="tablist">
        {TAG_FILTERS.map((t) => (
          <button
            key={t}
            type="button"
            className={tag === t ? "active" : ""}
            onClick={() => setTag(t)}
          >
            {t === "all"
              ? locale === "he"
                ? "הכל"
                : "All"
              : t}
          </button>
        ))}
      </div>

      <p className="evidence-count">
        {filtered.length} / {GLOBAL_CITATIONS.length}
      </p>

      <div className="evidence-grid">
        {filtered.map((c) => (
          <Link key={c.id} to={`/evidence/${c.id}`} className="evidence-card">
            <div className="meta-row">
              <Badge tone="accent">{TYPE_LABEL[c.type]?.[locale] ?? c.type}</Badge>
              {c.year ? <Badge tone="neutral">{c.year}</Badge> : null}
            </div>
            <h2>{pick(c.title)}</h2>
            <p className="evidence-issuer">{c.issuer}</p>
            <p>{pick(c.summary)}</p>
            {c.tags?.length ? (
              <div className="evidence-tag-row">
                {c.tags.slice(0, 4).map((tg) => (
                  <span key={tg} className="evidence-tag">
                    {tg}
                  </span>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function EvidenceDetailPage() {
  const { id } = useParams();
  const { locale, pick } = useLocale();
  const citation = getCitation(id ?? "");

  if (!citation) {
    return (
      <div>
        <Link to="/evidence" className="back-link">
          ← {locale === "he" ? "חזרה למקורות" : "Back to evidence"}
        </Link>
        <EmptyState text={locale === "he" ? "מקור לא נמצא." : "Citation not found."} />
      </div>
    );
  }

  return (
    <div className="evidence-page">
      <Link to="/evidence" className="back-link">
        ← {locale === "he" ? "חזרה למקורות" : "Back to evidence"}
      </Link>
      <PageHeader
        eyebrow={TYPE_LABEL[citation.type]?.[locale] ?? citation.type}
        title={pick(citation.title)}
        lead={citation.issuer}
      />

      <section className="detail-panel">
        <h2>{locale === "he" ? "תקציר" : locale === "ar" ? "ملخص" : "Summary"}</h2>
        <p>{pick(citation.summary)}</p>
      </section>

      <div className="detail-grid two">
        {citation.year ? (
          <section className="detail-panel">
            <h2>{locale === "he" ? "שנה" : "Year"}</h2>
            <p>{citation.year}</p>
          </section>
        ) : null}
        {citation.tags?.length ? (
          <section className="detail-panel">
            <h2>Tags</h2>
            <div className="evidence-tag-row">
              {citation.tags.map((tg) => (
                <span key={tg} className="evidence-tag">
                  {tg}
                </span>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <section className="detail-panel">
        <h2>{locale === "he" ? "קישורים" : "Links"}</h2>
        <ul className="evidence-links">
          {citation.url ? (
            <li>
              <a href={citation.url} target="_blank" rel="noopener noreferrer">
                {citation.url}
              </a>
            </li>
          ) : null}
          {citation.doi ? (
            <li>
              <a href={`https://doi.org/${citation.doi}`} target="_blank" rel="noopener noreferrer">
                DOI: {citation.doi}
              </a>
            </li>
          ) : null}
          {citation.pmid ? (
            <li>
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${citation.pmid}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                PubMed: {citation.pmid}
              </a>
            </li>
          ) : null}
          {!citation.url && !citation.doi && !citation.pmid ? (
            <li>{locale === "he" ? "ראה IFU / הכשרה יצרן" : "See manufacturer IFU / training"}</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
