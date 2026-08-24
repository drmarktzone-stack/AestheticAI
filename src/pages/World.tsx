import { Link, useParams } from "react-router-dom";
import {
  DOMAIN_META,
  DOMAIN_PRODUCTS,
  productsForDomain,
  getDomainProduct,
  getCompany,
  getMaterial,
} from "../data";
import type { AestheticDomainId } from "../data/types";
import { CitationList } from "../components/CitationBlock";
import { Badge, EmptyState, PageHeader, ReviewFlag } from "../components/ui";
import { useLocale } from "../i18n";
import "./World.css";

const DOMAIN_ORDER: AestheticDomainId[] = [
  "injectables",
  "threads",
  "peels",
  "hair",
  "body",
  "lipolytics",
  "devices",
  "combinations",
];

export function WorldPage() {
  const { locale, pick } = useLocale();

  const title =
    locale === "he" ? "עולם האסתטיקה" : locale === "ar" ? "عالم التجميل" : "Aesthetic world";
  const lead =
    locale === "he"
      ? "הזרקות, threads, peels, שיער, גוף, lipolytics, devices — כל התחומים עם מוצרים, מאפיינים ופרוטוקולים עולמיים."
      : locale === "ar"
        ? "حقن، خيوط، تقشير، شعر، جسم، أجهزة — جميع المجالات مع بروتوكولات عالمية."
        : "Injectables, threads, peels, hair, body, lipolytics, devices — full aesthetic medicine with global protocol citations.";

  return (
    <div className="world-page">
      <PageHeader eyebrow="Protokol" title={title} lead={lead} />

      <div className="world-stats">
        <div className="world-stat">
          <strong>{DOMAIN_PRODUCTS.length}</strong>
          <span>{locale === "he" ? "מוצרי domain" : "domain products"}</span>
        </div>
        <div className="world-stat">
          <strong>{DOMAIN_ORDER.length}</strong>
          <span>{locale === "he" ? "תחומים" : "domains"}</span>
        </div>
      </div>

      <div className="world-grid">
        {DOMAIN_ORDER.map((domain) => {
          const meta = DOMAIN_META[domain];
          const count =
            domain === "injectables"
              ? "65+"
              : domain === "combinations"
                ? "9+"
                : String(productsForDomain(domain).length);
          return (
            <Link
              key={domain}
              to={meta.route.startsWith("/world") ? meta.route : meta.route}
              className="world-domain-card"
            >
              <span className="world-domain-count">{count}</span>
              <h2>{pick(meta)}</h2>
              <span className="world-domain-arrow" aria-hidden="true">
                ←
              </span>
            </Link>
          );
        })}
      </div>

      <div className="world-quick-links">
        <Link to="/companies" className="btn ghost">
          {locale === "he" ? "כל החברות והמותגים" : "All companies & brands"}
        </Link>
        <Link to="/evidence" className="btn ghost">
          {locale === "he" ? "מקורות ופרוטוקולים עולמיים" : "Global evidence registry"}
        </Link>
        <Link to="/protocols" className="btn ghost">
          {locale === "he" ? "פרוטוקולים קליניים" : "Clinical protocols"}
        </Link>
      </div>
    </div>
  );
}

export function WorldDomainPage() {
  const { domain } = useParams();
  const { locale, pick } = useLocale();
  const domainId = domain as AestheticDomainId;
  const meta = DOMAIN_META[domainId];

  if (!meta) {
    return (
      <div>
        <Link to="/world" className="back-link">
          ← {locale === "he" ? "חזרה לעולם האסתטיקה" : "Back to aesthetic world"}
        </Link>
        <EmptyState text={locale === "he" ? "תחום לא נמצא." : "Domain not found."} />
      </div>
    );
  }

  const products = productsForDomain(domainId);

  return (
    <div className="world-page">
      <Link to="/world" className="back-link">
        ← {locale === "he" ? "חזרה לעולם האסתטיקה" : "Back to aesthetic world"}
      </Link>
      <PageHeader
        eyebrow={locale === "he" ? "תחום" : "Domain"}
        title={pick(meta)}
        lead={
          locale === "he"
            ? `${products.length} מוצרים/פרוטוקולים — מאפיינים, מינון, וציטוט לפרוטוקולים עולמיים.`
            : `${products.length} products/protocols with global citations.`
        }
      />

      {products.length === 0 ? (
        <EmptyState
          text={
            locale === "he"
              ? "אין מוצרים בתחום זה — ראה injectables."
              : "No products in this domain."
          }
        />
      ) : (
        <div className="list-grid">
          {products.map((p) => {
            const name =
              locale === "ar" ? p.nameAr : locale === "en" ? p.nameEn : p.nameHe;
            const chars = p.characteristics[locale];
            return (
              <Link key={p.id} to={`/world/${domainId}/${p.id}`} className="list-link">
                <div className="meta-row">
                  <Badge tone="accent">{domainId}</Badge>
                  <ReviewFlag reviewed={p.reviewedByPhysician} />
                </div>
                <h2>{name}</h2>
                <ul className="world-char-preview">
                  {chars.slice(0, 3).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className="world-why-preview">{pick(p.whyRecommended)}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function WorldProductDetailPage() {
  const { domain, productId } = useParams();
  const { locale, pick } = useLocale();
  const product = getDomainProduct(productId ?? "");

  if (!product || product.domain !== domain) {
    return (
      <div>
        <Link to={`/world/${domain}`} className="back-link">
          ← {locale === "he" ? "חזרה" : "Back"}
        </Link>
        <EmptyState text={locale === "he" ? "מוצר לא נמצא." : "Product not found."} />
      </div>
    );
  }

  const name =
    locale === "ar" ? product.nameAr : locale === "en" ? product.nameEn : product.nameHe;
  const company = product.companyId ? getCompany(product.companyId) : undefined;
  const material = product.materialId ? getMaterial(product.materialId) : undefined;

  return (
    <div className="world-page">
      <Link to={`/world/${domain}`} className="back-link">
        ← {locale === "he" ? "חזרה לתחום" : "Back to domain"}
      </Link>
      <PageHeader
        eyebrow={product.domain}
        title={name}
        lead={pick(product.whyRecommended)}
        actions={<ReviewFlag reviewed={product.reviewedByPhysician} />}
      />

      <div className="detail-grid two">
        <section className="detail-panel">
          <h2>{locale === "he" ? "מאפיינים" : locale === "ar" ? "خصائص" : "Characteristics"}</h2>
          <ul>
            {product.characteristics[locale].map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
        <section className="detail-panel">
          <h2>{locale === "he" ? "שימושים אופייניים" : "Typical uses"}</h2>
          <ul>
            {product.typicalUses.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="detail-panel">
        <h2>{locale === "he" ? "מסגרת מינון / פרוטוקול" : "Dosing / protocol notes"}</h2>
        <ul>
          {product.doseNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>

      {(company || material) && (
        <div className="detail-grid two">
          {company ? (
            <section className="detail-panel">
              <h2>{locale === "he" ? "חברה" : "Company"}</h2>
              <Link to={`/companies/${company.id}`}>{company.name}</Link>
            </section>
          ) : null}
          {material ? (
            <section className="detail-panel">
              <h2>{locale === "he" ? "חומר קשור" : "Related injectable"}</h2>
              <Link to={`/materials/${material.id}`}>{material.nameHe}</Link>
            </section>
          ) : null}
        </div>
      )}

      <CitationList ids={product.citationIds} />
    </div>
  );
}
