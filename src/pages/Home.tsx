import { Link } from "react-router-dom";
import { STITCH, USER_LIPS } from "../lib/assets";
import { ClinicalVideo, ClinicalVideoGrid } from "../components/visual/ClinicalVideo";
import { featuredLipsVideos, injectionVideos } from "../lib/driveMedia";
import { useLocale } from "../i18n";
import "./Home.css";

const MODULES = [
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
    he: "עזרה ראשונה / חירום",
    ar: "الطوارئ",
    en: "Emergency",
  },
  {
    to: "/materials",
    he: "65+ חומרים — HA, טוקסין, PN, חזית",
    ar: "65+ مواد — HA، توكسين، PN",
    en: "65+ materials — HA, toxin, PN, frontier",
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
              ? "פרוטוקולים, חומרים, מינונים, סיבוכים והזרקה מומחשת — בעברית, ערבית ואנגלית."
              : locale === "ar"
                ? "بروتوكولات ومواد وجرعات ومضاعفات وحقن مرئي — بالعبرية والعربية والإنجليزية."
                : "Protocols, materials, dosing, complications and visualized injection — in Hebrew, Arabic and English."}
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/guide/lips">
              {locale === "he"
                ? "פתח מדריך שפתיים"
                : locale === "ar"
                  ? "افتح دليل الشفاه"
                  : "Open lips mentor"}
            </Link>
            <Link className="btn ghost" to="/consultation">
              {locale === "he"
                ? "מתכנן חכם + AI אחרי"
                : locale === "ar"
                  ? "مخطط ذكي + صورة بعد"
                  : "Smart planner + AI after"}
            </Link>
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
              ? "סקירה → חומר → מינון → הזרקה → סיבוך → סימולציה → תיעוד. כל שלב עם מדיה קלינית."
              : locale === "ar"
                ? "نظرة عامة → مادة → جرعة → حقن → مضاعفة → محاكاة → توثيق. كل خطوة مع وسائط سريرية."
                : "Overview → material → dose → injection → complication → simulation → documentation. Every step with clinical media."}
          </p>
          <Link className="btn primary" to="/guide/lips">
            {locale === "he" ? "התחל בשפתיים" : locale === "ar" ? "ابدأ بالشفاه" : "Start with lips"}
          </Link>
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
