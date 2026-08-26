import { Link, useParams } from "react-router-dom";

import { CitationList } from "../components/CitationList";
import { DraftBadge } from "../components/Chrome";
import { getCitation, getCompany, getMaterial } from "../data";
import { entityName } from "../lib/entityName";
import { useLocale } from "../i18n/LocaleContext";

export function HousePage() {
  const { id = "" } = useParams();
  const { locale, strings, t } = useLocale();
  const company = getCompany(id);

  if (!company) {
    return (
      <div className="page">
        <p>{t(strings.empty)}</p>
        <Link to="/">{t(strings.back)}</Link>
      </div>
    );
  }

  const products = company.productIds
    .map((productId) => getMaterial(productId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const citations = company.citationIds
    .map((citationId) => getCitation(citationId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="page">
      <section className="opening">
        <div className="eyebrow">{t(strings.house.title)}</div>
        <h1>{company.name}</h1>
        <p className="lead">{company.description[locale]}</p>
        <DraftBadge label={t(strings.draft)} />
      </section>
      <div className="chapter">
        <div className="stack">
          <section className="step-block">
            <h3>{t(strings.house.why)}</h3>
            <p>{company.whyRecommended[locale]}</p>
            <p className="tiny">
              {t(strings.house.hq)}: {company.hq}
            </p>
            {company.website ? (
              <a href={company.website} target="_blank" rel="noreferrer">
                {t(strings.house.website)}
              </a>
            ) : null}
          </section>
          <section className="step-block">
            <h3>{t(strings.house.products)}</h3>
            {products.map((product) => (
              <article key={product.id} className="citation">
                <strong>{entityName(product, locale)}</strong>
                <p className="tiny">{product.brands?.join(" · ")}</p>
                <ul className="clinical">
                  {product.typicalUses.slice(0, 4).map((use) => (
                    <li key={use}>{use}</li>
                  ))}
                </ul>
                <p className="muted">{product.doseNotes[0]}</p>
              </article>
            ))}
          </section>
        </div>
        <aside className="panel">
          <CitationList citations={citations} />
        </aside>
      </div>
    </div>
  );
}
