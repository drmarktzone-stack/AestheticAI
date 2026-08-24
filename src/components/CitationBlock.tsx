import { Link } from "react-router-dom";
import type { GlobalCitation } from "../data/types";
import { getCitation } from "../data";
import { useLocale } from "../i18n";
import { Badge } from "./ui";

const TYPE_LABEL: Record<string, { he: string; ar: string; en: string }> = {
  consensus: { he: "קונсенסוס", ar: "إجماع", en: "Consensus" },
  guideline: { he: "הנחיה", ar: "إرشاد", en: "Guideline" },
  society: { he: "אגודה", ar: "جمعية", en: "Society" },
  ifu: { he: "IFU", ar: "IFU", en: "IFU" },
  trial: { he: "מחקר", ar: "دراسة", en: "Trial" },
  training: { he: "הכשרה", ar: "تدريب", en: "Training" },
};

export function CitationCard({ citation }: { citation: GlobalCitation }) {
  const { locale, pick } = useLocale();
  const typeLabel = TYPE_LABEL[citation.type]?.[locale] ?? citation.type;

  return (
    <article className="citation-card">
      <div className="meta-row">
        <Badge tone="accent">{typeLabel}</Badge>
        {citation.year ? <Badge tone="neutral">{citation.year}</Badge> : null}
      </div>
      <h3>{pick(citation.title)}</h3>
      <p className="citation-issuer">{citation.issuer}</p>
      <p>{pick(citation.summary)}</p>
      <div className="citation-links">
        <Link to={`/evidence/${citation.id}`} className="citation-ref-link">
          {locale === "he" ? "פרטים מלאים" : locale === "ar" ? "تفاصيل" : "Full details"}
        </Link>
        {citation.url ? (
          <a href={citation.url} target="_blank" rel="noopener noreferrer">
            {locale === "he" ? "מקור חיצוני" : locale === "ar" ? "مصدر خارجي" : "External source"}
          </a>
        ) : null}
        {citation.doi ? (
          <a href={`https://doi.org/${citation.doi}`} target="_blank" rel="noopener noreferrer">
            DOI
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function CitationList({ ids }: { ids: string[] }) {
  const { locale } = useLocale();
  const citations = ids.map((id) => getCitation(id)).filter(Boolean) as GlobalCitation[];

  if (citations.length === 0) return null;

  return (
    <section className="detail-panel citation-panel">
      <h2>
        {locale === "he"
          ? "פרוטוקולים ומקורות עולמיים"
          : locale === "ar"
            ? "بروتوكولات ومصادر عالمية"
            : "Global protocols & evidence"}
      </h2>
      <div className="citation-list">
        {citations.map((c) => (
          <CitationCard key={c.id} citation={c} />
        ))}
      </div>
    </section>
  );
}
