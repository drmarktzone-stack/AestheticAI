import { ClinicalVideoGrid } from "../components/visual/ClinicalVideo";
import { LIBRARY_SECTIONS } from "../lib/assets";
import { DRIVE_IMAGES, DRIVE_VIDEOS, injectionVideos } from "../lib/driveMedia";
import { useLocale } from "../i18n";
import "./Library.css";

export function LibraryPage() {
  const { locale } = useLocale();
  const videoNav = [
    { id: "videos-injection", label: { he: "סרטוני הזרקה", ar: "فيديوهات الحقن", en: "Injection videos" } },
    { id: "videos-all", label: { he: "כל הסרטונים", ar: "كل الفيديوهات", en: "All videos" } },
    { id: "drive-stills", label: { he: "תמונות Drive", ar: "صور Drive", en: "Drive stills" } },
  ];

  return (
    <div className="library">
      <header className="library-header">
        <h1>
          {locale === "he"
            ? "ספריית נכסים קליניים"
            : locale === "ar"
              ? "مكتبة الأصول السريرية"
              : "Clinical asset library"}
        </h1>
        <p>
          {locale === "he"
            ? "ארכיון חזותי מאושר — סרטוני הזרקה, סימולציות ותהליכי החלמה לפי אזור."
            : locale === "ar"
              ? "أرشيف بصري معتمد — فيديوهات حقن ومحاكاة ومراحل تعافٍ حسب المنطقة."
              : "Approved visual archive — injection videos, simulations and recovery by region."}
        </p>
      </header>

      <div className="library-layout">
        <nav className="library-nav" aria-label="Categories">
          <p>
            {locale === "he" ? "קטגוריות" : locale === "ar" ? "الفئات" : "Categories"}
          </p>
          {videoNav.map((n) => (
            <a key={n.id} href={`#${n.id}`}>
              {n.label[locale]}
            </a>
          ))}
          {LIBRARY_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>

        <div className="library-main">
          <section id="videos-injection" className="library-section">
            <h2>
              {locale === "he"
                ? "סרטוני הזרקה וסימולציה"
                : locale === "ar"
                  ? "فيديوهات الحقن والمحاكاة"
                  : "Injection & simulation videos"}
            </h2>
            <ClinicalVideoGrid videos={injectionVideos()} />
          </section>

          <section id="videos-all" className="library-section">
            <h2>
              {locale === "he" ? "כל סרטוני Drive" : locale === "ar" ? "كل فيديوهات Drive" : "All Drive videos"}
            </h2>
            <ClinicalVideoGrid videos={DRIVE_VIDEOS} />
          </section>

          <section id="drive-stills" className="library-section">
            <h2>
              {locale === "he" ? "תמונות Drive" : locale === "ar" ? "صور Drive" : "Drive stills"}
            </h2>
            <div className="library-grid">
              {DRIVE_IMAGES.map((item) => (
                <figure key={item.id} className="library-item">
                  <img src={item.src} alt={item.title[locale]} loading="lazy" />
                  <figcaption>
                    <strong>{item.title[locale]}</strong>
                    <span>{item.tag[locale]}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {LIBRARY_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="library-section">
              <h2>{section.title}</h2>
              <div className="library-grid">
                {section.items.map((item) => (
                  <figure key={item.title} className="library-item">
                    <img src={item.src} alt={item.title} loading="lazy" />
                    <figcaption>
                      <strong>{item.title}</strong>
                      <span>{item.tag}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
