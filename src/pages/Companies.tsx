import { Link, useParams } from "react-router-dom";
import {
  COMPANIES,
  getCompany,
  getMaterial,
  companyForProduct,
} from "../data";
import { CitationList } from "../components/CitationBlock";
import { Badge, EmptyState, PageHeader, ReviewFlag } from "../components/ui";
import { useLocale } from "../i18n";
import "./Companies.css";

export function CompaniesPage() {
  const { locale, pick } = useLocale();

  const title =
    locale === "he" ? "חברות ומותגים" : locale === "ar" ? "الشركات والعلامات" : "Companies & brands";
  const lead =
    locale === "he"
      ? `${COMPANIES.length} חברות מובילות — מוצרים, מאפיינים, ולמה מומלץ. עם ציטוט לפרוטוקולים עולמיים.`
      : locale === "ar"
        ? `${COMPANIES.length} شركات رائدة — منتجات وخصائص وتوصيات مع بروتوكولات عالمية.`
        : `${COMPANIES.length} leading companies — products, traits, recommendations, global protocol citations.`;

  return (
    <div className="companies-page">
      <PageHeader eyebrow="Aesthetic world" title={title} lead={lead} />
      <div className="list-grid">
        {COMPANIES.map((c) => (
          <Link key={c.id} to={`/companies/${c.id}`} className="list-link company-card">
            <div className="meta-row">
              <Badge tone="accent">{c.productIds.length} products</Badge>
              <ReviewFlag reviewed={c.reviewedByPhysician} />
            </div>
            <h2>{c.name}</h2>
            <p className="company-hq">{c.hq}</p>
            <p>{pick(c.description)}</p>
            <p className="company-focus">{c.focus.slice(0, 4).join(" · ")}</p>
            <p className="company-why">{pick(c.whyRecommended)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CompanyDetailPage() {
  const { id } = useParams();
  const { locale, pick } = useLocale();
  const company = getCompany(id ?? "");

  if (!company) {
    return (
      <div>
        <Link to="/companies" className="back-link">
          ← {locale === "he" ? "חזרה לחברות" : "Back to companies"}
        </Link>
        <EmptyState text={locale === "he" ? "החברה לא נמצאה." : "Company not found."} />
      </div>
    );
  }

  const diffs = company.differentiators[locale];

  return (
    <div className="companies-page">
      <Link to="/companies" className="back-link">
        ← {locale === "he" ? "חזרה לחברות" : "Back to companies"}
      </Link>
      <PageHeader
        eyebrow={company.hq}
        title={company.name}
        lead={pick(company.description)}
        actions={<ReviewFlag reviewed={company.reviewedByPhysician} />}
      />

      {company.website ? (
        <p className="company-website">
          <a href={company.website} target="_blank" rel="noopener noreferrer">
            {company.website}
          </a>
        </p>
      ) : null}

      <div className="detail-grid two">
        <section className="detail-panel">
          <h2>{locale === "he" ? "תחומי מיקוד" : locale === "ar" ? "مجالات التركيز" : "Focus areas"}</h2>
          <ul>
            {company.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
        <section className="detail-panel highlight-panel">
          <h2>{locale === "he" ? "למה מומלץ" : locale === "ar" ? "لماذا موصى به" : "Why recommended"}</h2>
          <p>{pick(company.whyRecommended)}</p>
        </section>
      </div>

      <section className="detail-panel">
        <h2>{locale === "he" ? "מאפיינים ייחודיים" : locale === "ar" ? "خصائص مميزة" : "Differentiators"}</h2>
        <ul>
          {diffs.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="detail-panel">
        <h2>
          {locale === "he"
            ? `מוצרים (${company.productIds.length})`
            : locale === "ar"
              ? `المنتجات (${company.productIds.length})`
              : `Products (${company.productIds.length})`}
        </h2>
        {company.productIds.length === 0 ? (
          <p>
            {locale === "he"
              ? "שכבת devices — ראה עולם אסתטיקה / Devices"
              : "Device layer — see World / Devices"}
          </p>
        ) : (
          <div className="company-products">
            {company.productIds.map((pid) => {
              const mat = getMaterial(pid);
              return (
                <Link key={pid} to={`/materials/${pid}`} className="company-product-link">
                  <strong>{mat?.nameHe ?? pid}</strong>
                  {mat ? (
                    <span>
                      {mat.nameEn}
                      {mat.gPrime ? ` · ${mat.gPrime}` : ""}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <CitationList ids={company.citationIds} />
    </div>
  );
}

/** Helper exported for Materials detail */
export function CompanyLinkForProduct({ materialId }: { materialId: string }) {
  const { locale, pick } = useLocale();
  const company = companyForProduct(materialId);
  if (!company) return null;

  return (
    <section className="detail-panel company-link-panel">
      <h2>{locale === "he" ? "יצרן / חברה" : locale === "ar" ? "الشركة المصنعة" : "Manufacturer"}</h2>
      <Link to={`/companies/${company.id}`} className="company-inline-link">
        <strong>{company.name}</strong>
      </Link>
      <p>{pick(company.whyRecommended)}</p>
    </section>
  );
}
