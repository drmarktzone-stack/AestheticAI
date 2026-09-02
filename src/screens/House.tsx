import { Link, useParams } from "react-router-dom";

import { CitationList } from "../components/CitationList";
import { DraftBadge } from "../components/Chrome";
import { COMPANIES, getCitation, getCompany, getMaterial } from "../data";
import { entityName } from "../lib/entityName";
import { useLocale } from "../i18n/LocaleContext";

const FEATURED_IDS = ["allergan-abbvie", "galderma", "merz", "teoxane", "ibsa"];

export function HousePage() {
  const { id } = useParams();
  const { locale, strings, t } = useLocale();

  const featured = FEATURED_IDS.map((houseId) => COMPANIES.find((company) => company.id === houseId)).filter(
    (company): company is NonNullable<typeof company> => Boolean(company),
  );
  const rest = COMPANIES.filter((company) => !FEATURED_IDS.includes(company.id));

  if (!id) {
    return (
      <div className="page">
        <section className="opening">
          <div className="eyebrow">{t(strings.house.directory)}</div>
          <h1>{t(strings.house.title)}</h1>
          <p className="lead">{t(strings.ifuWins)}</p>
        </section>
        <div className="partner-grid">
          {featured.map((company) => (
            <Link key={company.id} className="partner-card" to={`/house/${company.id}`}>
              <span className="kicker">{company.hq}</span>
              <h3>{company.name}</h3>
              <p className="tiny">{company.description[locale]}</p>
              <span className="tiny">{company.whyRecommended[locale]}</span>
            </Link>
          ))}
        </div>
        {rest.length ? (
          <section className="index-block">
            <div className="index-head">
              <div className="kicker">{t(strings.journey.brandsInPlay)}</div>
            </div>
            <div className="house-strip">
              {rest.map((company) => (
                <Link key={company.id} className="family-item" to={`/house/${company.id}`}>
                  <span className="kicker">{company.hq}</span>
                  <strong>{company.name}</strong>
                  <span className="tiny">{company.whyRecommended[locale]}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  const company = getCompany(id);

  if (!company) {
    return (
      <div className="page">
        <p>{t(strings.empty)}</p>
        <Link to="/house">{t(strings.back)}</Link>
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
