import { Link } from "react-router-dom";
import { STITCH, USER_LIPS } from "../lib/assets";
import { ClinicalVideo, ClinicalVideoGrid } from "../components/visual/ClinicalVideo";
import { featuredLipsVideos, injectionVideos } from "../lib/driveMedia";
import {
  COMPANIES,
  GLOBAL_CITATIONS,
  DOMAIN_PRODUCTS,
  materials,
  protocols,
} from "../data";
import { useLocale } from "../i18n";
import "./Home.css";

const PILLARS = [
  {
    to: "/world",
    he: "עולם האסתטיקה",
    ar: "عالم التجميل",
    en: "Aesthetic world",
    count: () => `${DOMAIN_PRODUCTS.length}+`,
    subHe: "threads · peels · hair · body · devices",
    subAr: "خيوط · تقشير · شعر · جسم · أجهزة",
    subEn: "threads · peels · hair · body · devices",
  },
  {
    to: "/companies",
    he: "חברות ומותגים",
    ar: "الشركات والعلامات",
    en: "Companies & brands",
    count: () => String(COMPANIES.length),
    subHe: "מוצרים · מאפיינים · למה מומלץ",
    subAr: "منتجات · خصائص · توصيات",
    subEn: "products · traits · why recommended",
  },
  {
    to: "/evidence",
    he: "מקורות עולמיים",
    ar: "مصادر عالمية",
    en: "Global evidence",
    count: () => String(GLOBAL_CITATIONS.length),
    subHe: "ACE · ASAPS · MD Codes · IFU",
    subAr: "ACE · ASAPS · MD Codes · IFU",
    subEn: "ACE · ASAPS · MD Codes · IFU",
  },
  {
    to: "/materials",
    he: "חומרים",
    ar: "المواد",
    en: "Materials",
    count: () => `${materials.length}+`,
    subHe: "HA · toxin · PN · frontier",
    subAr: "HA · توكسين · PN",
    subEn: "HA · toxin · PN · frontier",
  },
  {
    to: "/protocols",
    he: "פרוטוקולים",
    ar: "بروتوكولات",
    en: "Protocols",
    count: () => String(protocols.length),
    subHe: "עם ציטוט עולמי בכל מסלול",
    subAr: "مع استشهاد عالمي",
    subEn: "global citations on every pathway",
  },
];

const MODULES = [
  {
    to: "/atlas",
    he: "מפה מלאה — חיפוש על כל עולם האסתטיקה",
    ar: "خريطة كاملة — بحث في كل عالم التجميل",
    en: "Full atlas — search the entire aesthetic world",
  },
  {
    to: "/world",
    he: "עולם האסתטיקה — threads, peels, hair, body, devices",
    ar: "عالم التجميل — خيوط، تقشير، شعر، جسم، أجهزة",
    en: "Aesthetic world — threads, peels, hair, body, devices",
  },
  {
    to: "/companies",
    he: "חברות — כל המוצרים, מאפיינים, למה מומלץ",
    ar: "شركات — منتجات وخصائص وتوصيات",
    en: "Companies — all products, traits, why recommended",
  },
  {
    to: "/evidence",
    he: "פרוטוקולים עולמיים — ACE, MD Codes, IFU",
    ar: "بروتوكولات عالمية — ACE، MD Codes",
    en: "Global protocols — ACE, MD Codes, IFU",
  },
  {
    to: "/guide/lips",
    he: "מדריך מנטור — שפתיים",
    ar: "الدليل الموجِّه — الشفاه",
    en: "Mentor guide — Lips",
  },
  {
    to: "/guide/midface",
    he: "מדריך מנטור — מרכז פנים",
    ar: "الدليل الموجِّه — منتصف الوجه",
    en: "Mentor guide — Midface",
  },
  {
    to: "/consultation",
    he: "מתכנן חכם — העלאה, מינון, אחרי AI",
    ar: "مخطط ذكي — رفع، جرعة، بعد AI",
    en: "Smart planner — upload, dose, AI after",
  },
  {
    to: "/protocols",
    he: "פרוטוקולים קליניים + ציטוטים",
    ar: "بروتوكولات سريرية + استشهادات",
    en: "Clinical protocols + citations",
  },
  {
    to: "/simulation",
    he: "סימולציית מטופל",
    ar: "محاكاة المريض",
    en: "Patient simulation",
  },
  {
    to: "/library",
    he: "ספריית נכסים קליניים",
    ar: "مكتبة الأصول السريرية",
    en: "Clinical asset library",
  },
  {
    to: "/emergency",
    he: "פרוטוקולי חירום + ACE",
    ar: "بروتوكولات طوارئ + ACE",
    en: "Emergency protocols + ACE",
  },
  {
    to: "/materials",
    he: "חומרים — HA, טוקסין, PN, חזית",
    ar: "مواد — HA، توكسين، PN",
    en: "Materials — HA, toxin, PN, frontier",
  },
];

export function HomePage() {
  const { pick, t, locale } = useLocale();

  return (
    <div className="home">
      <section className="hero" aria-label={pick(t.appName)}>
        <div className="hero-media" aria-hidden="true">
          <img src={STITCH.cinematicClinic} alt="" className="hero-img" />
          <div className="hero-veil" />
        </div>

        <div className="hero-content">
          <h1 className="hero-brand">{pick(t.appName)}</h1>
          <p className="hero-title">
            {locale === "he"
              ? "מדריך־מנטור קליני לרופאי אסתטיקה."
              : locale === "ar"
                ? "دليل سريري موجِّه لأطباء التجميل."
                : "Clinical mentor guide for aesthetic physicians."}
          </p>
          <p className="hero-lead">
            {locale === "he"
              ? "פרוטוקולים, חומרים, חברות, עולם אסתטיקה מלא, מינונים, סיבוכים והזרקה מומחשת — בעברית, ערבית ואנגלית."
              : locale === "ar"
                ? "بروتوكولات ومواد وشركات وعالم تجميل كامل وجرعات ومضاعفات — بالعبرية والعربية والإنجليزية."
                : "Protocols, materials, companies, full aesthetic world, dosing, complications and visualized injection — in Hebrew, Arabic and English."}
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/atlas">
              {locale === "he"
                ? "מפת עולם האסתטיקה המלאה"
                : locale === "ar"
                  ? "خريطة عالم التجميل الكاملة"
                  : "Full aesthetic world atlas"}
            </Link>
            <Link className="btn ghost" to="/companies">
              {locale === "he"
                ? "חברות ומוצרים"
                : locale === "ar"
                  ? "الشركات والمنتجات"
                  : "Companies & products"}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-pillars" aria-label="Integrated aesthetic modules">
        <div className="home-pillars-inner">
          <header className="home-pillars-head">
            <p className="home-kicker">
              {locale === "he" ? "משולב באתר" : locale === "ar" ? "مدمج في الموقع" : "Integrated in the site"}
            </p>
            <h2>
              {locale === "he"
                ? "כל עולם האסתטיקה — מקום אחד."
                : locale === "ar"
                  ? "عالم التجميل كاملاً — في مكان واحد."
                  : "The full aesthetic world — one place."}
            </h2>
          </header>
          <div className="home-pillars-grid">
            {PILLARS.map((p) => (
              <Link key={p.to} to={p.to} className="home-pillar">
                <span className="home-pillar-count">{p.count()}</span>
                <strong>{p[locale]}</strong>
                <span className="home-pillar-sub">
                  {locale === "he" ? p.subHe : locale === "ar" ? p.subAr : p.subEn}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-feature">
        <div className="home-feature-copy">
          <p className="home-kicker">
            {locale === "he" ? "מנטור קליני" : locale === "ar" ? "موجِّه سريري" : "Clinical mentor"}
          </p>
          <h2>
            {locale === "he"
              ? "לא גלריה. מסלול החלטה."
              : locale === "ar"
                ? "ليس معرضاً. مسار قرار."
                : "Not a gallery. A decision path."}
          </h2>
          <p>
            {locale === "he"
              ? "עולם אסתטיקה → חברה → חומר → פרוטוקול עולמי → מינון → הזרקה → חירום ACE."
              : locale === "ar"
                ? "عالم تجميل → شركة → مادة → بروتوكول عالمي → جرعة → حقن → طوارئ ACE."
                : "Aesthetic world → company → material → global protocol → dose → injection → ACE emergency."}
          </p>
          <div className="home-feature-actions">
            <Link className="btn primary" to="/guide/lips">
              {locale === "he" ? "התחל בשפתיים" : locale === "ar" ? "ابدأ بالشفاه" : "Start with lips"}
            </Link>
            <Link className="btn ghost" to="/evidence">
              {locale === "he" ? "מקורות עולמיים" : "Global evidence"}
            </Link>
          </div>
        </div>
        <div className="home-feature-media">
          <img src={USER_LIPS.anatomy[0]} alt="" />
        </div>
      </section>

      <section className="home-videos" aria-label="Clinical videos">
        <div className="home-videos-inner">
          <header className="home-videos-head">
            <p className="home-kicker">
              {locale === "he" ? "מדיה קלינית" : locale === "ar" ? "وسائط سريرية" : "Clinical media"}
            </p>
            <h2>
              {locale === "he"
                ? "הזרקה מומחשת — לא רק טקסט."
                : locale === "ar"
                  ? "حقن مرئي — وليس نصاً فقط."
                  : "Visualized injection — not text alone."}
            </h2>
            <p>
              {locale === "he"
                ? "סרטוני סימולציה ואנימציה רפואית מתיקיית המדיה שלך — שפתיים, מרכז פנים וטוקסין."
                : locale === "ar"
                  ? "فيديوهات محاكاة ورسوم طبية من مجلد الوسائط — الشفاه ومنتصف الوجه والتوكسين."
                  : "Simulation and medical animation videos from your media folder — lips, midface and toxin."}
            </p>
          </header>
          <div className="home-videos-stage">
            <ClinicalVideo video={featuredLipsVideos()[0]} autoPlay />
            <ClinicalVideoGrid videos={injectionVideos().slice(0, 4)} />
          </div>
          <div className="home-videos-actions">
            <Link className="btn primary" to="/guide/lips#technique">
              {locale === "he"
                ? "צפה בהזרקת שפתיים"
                : locale === "ar"
                  ? "شاهد حقن الشفاه"
                  : "Watch lips injection"}
            </Link>
            <Link className="btn ghost" to="/library">
              {locale === "he" ? "ספרייה מלאה" : locale === "ar" ? "المكتبة الكاملة" : "Full library"}
            </Link>
          </div>
        </div>
      </section>

      <section className="modules">
        <div className="modules-inner">
          {MODULES.map((m) => (
            <Link key={m.to} to={m.to} className="module-row">
              <h2>{m[locale]}</h2>
              <span className="module-arrow" aria-hidden="true">
                ←
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
