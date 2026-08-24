import { LIBRARY_SECTIONS } from "../lib/assets";
import "./Library.css";

export function LibraryPage() {
  return (
    <div className="library">
      <header className="library-header">
        <h1>ספריית נכסים קליניים</h1>
        <p>
          ארכיון חזותי מאושר לשימוש קליני — סימולציות, טכניקות הזרקה ותהליכי
          החלמה מדורגים לפי אזורי טיפול.
        </p>
      </header>

      <div className="library-layout">
        <nav className="library-nav" aria-label="קטגוריות אנטומיות">
          <p>קטגוריות אנטומיות</p>
          {LIBRARY_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>

        <div className="library-main">
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
