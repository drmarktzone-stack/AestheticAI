import { isCitationIncomplete } from "../lib/citations";
import { useLocale } from "../i18n/LocaleContext";
import type { GlobalCitation } from "../data/types";

export function CitationList({ citations }: { citations: GlobalCitation[] }) {
  const { locale, strings, t } = useLocale();
  if (!citations.length) {
    return <p className="tiny">{t(strings.empty)}</p>;
  }

  return (
    <div>
      {citations.map((citation) => {
        const incomplete = isCitationIncomplete(citation);
        const href = citation.url ?? (citation.doi ? `https://doi.org/${citation.doi}` : undefined);
        return (
          <article key={citation.id} className="citation">
            <strong>{citation.title[locale]}</strong>
            <span className="tiny">
              {citation.issuer}
              {citation.year ? ` · ${citation.year}` : ""} · {citation.type}
            </span>
            <p className="muted">{citation.summary[locale]}</p>
            {href ? (
              <a href={href} target="_blank" rel="noreferrer">
                {href}
              </a>
            ) : null}
            {incomplete ? <span className="badge warn">{t(strings.incompleteCitation)}</span> : null}
          </article>
        );
      })}
    </div>
  );
}
