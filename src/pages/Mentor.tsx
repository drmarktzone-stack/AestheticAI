import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getMentorByRegion, type MentorSectionId } from "../data/clinical";
import { AnimationReel } from "../components/visual/AnimationReel";
import { TimelineScrubber } from "../components/visual/TimelineScrubber";
import { useLocale } from "../i18n";
import { pickL, pickList } from "../data/clinical/types";
import "./Mentor.css";

const SECTIONS: { id: MentorSectionId; he: string; ar: string; en: string }[] = [
  { id: "overview", he: "סקירה", ar: "نظرة عامة", en: "Overview" },
  { id: "materials", he: "חומרים", ar: "المواد", en: "Materials" },
  { id: "dosing", he: "מינון", ar: "الجرعة", en: "Dosing" },
  { id: "technique", he: "הזרקה", ar: "الحقن", en: "Injection" },
  { id: "complications", he: "סיבוכים", ar: "المضاعفات", en: "Complications" },
  { id: "simulation", he: "סימולציה", ar: "المحاكاة", en: "Simulation" },
  { id: "document", he: "תיעוד", ar: "توثيق", en: "Document" },
];

const CUES: Record<
  MentorSectionId,
  { now: { he: string; ar: string; en: string }; why: { he: string; ar: string; en: string }; dont: { he: string; ar: string; en: string } }
> = {
  overview: {
    now: {
      he: "הבן אנטומיה, מטרות ואזורי סכנה לפני בחירת חומר.",
      ar: "افهم التشريح والأهداف ومناطق الخطر قبل اختيار المادة.",
      en: "Lock anatomy, goals and danger zones before choosing product.",
    },
    why: {
      he: "בלי מפה — אין פרוטוקול בטוח.",
      ar: "بدون خريطة — لا بروتوكول آمن.",
      en: "Without a map there is no safe protocol.",
    },
    dont: {
      he: "אל תדלג ישר למינון.",
      ar: "لا تقفز مباشرة إلى الجرعة.",
      en: "Do not jump straight to dosing.",
    },
  },
  materials: {
    now: {
      he: "בחר חומר לפי תפקיד קליני וריאולוגיה — לא לפי מותג בלבד.",
      ar: "اختر المادة حسب الدور السريري والريولوجيا — لا حسب العلامة فقط.",
      en: "Choose by clinical role and rheology — not brand alone.",
    },
    why: {
      he: "חומר לא מתאים = סיכון ומראה לא טבעי.",
      ar: "مادة غير مناسبة = خطر ومظهر غير طبيعي.",
      en: "Wrong product = risk and unnatural result.",
    },
    dont: {
      he: "אל תערבב הנחיות IFU בין מוצרים.",
      ar: "لا تخلط نشرات المنتجات.",
      en: "Do not mix IFU guidance across products.",
    },
  },
  dosing: {
    now: {
      he: "תכנן אליקוטות לפי אתר ושכבה; העדף מדורג.",
      ar: "خطط الدفعات حسب الموقع والطبقة؛ فضّل التدرج.",
      en: "Plan aliquots by site and plane; prefer staged dosing.",
    },
    why: {
      he: "תיקון יתר קשה יותר מחוסר זמני.",
      ar: "فرط التصحيح أصعب من نقص مؤقت.",
      en: "Overfill is harder to undo than underfill.",
    },
    dont: {
      he: "אין כלל אצבע גלובלי במקום IFU.",
      ar: "لا قاعدة عامة بدل نشرة الشركة.",
      en: "No global rule-of-thumb replaces IFU.",
    },
  },
  technique: {
    now: {
      he: "צפה בהדגמה, סמן נקודות, הזרק לאט עם מודעות וסקולרית.",
      ar: "شاهد العرض، علّم النقاط، احقن ببطء مع وعي وعائي.",
      en: "Watch the demo, mark points, inject slowly with vessel awareness.",
    },
    why: {
      he: "הטכניקה היא שכבת הבטיחות האמיתית.",
      ar: "التقنية هي طبقة الأمان الحقيقية.",
      en: "Technique is the real safety layer.",
    },
    dont: {
      he: "אל תתעלם מכאב/הלבנה.",
      ar: "لا تتجاهل الألم/الشحوب.",
      en: "Never ignore pain or blanching.",
    },
  },
  complications: {
    now: {
      he: "זהה סימנים מוקדמים והפעל פרוטוקול חירום מיד.",
      ar: "تعرف العلامات المبكرة وفعّل بروتوكول الطوارئ فوراً.",
      en: "Recognize early signs and activate emergency protocol immediately.",
    },
    why: {
      he: "דקות קובעות תוצאה.",
      ar: "الدقائق تحدد النتيجة.",
      en: "Minutes determine outcome.",
    },
    dont: {
      he: "אל תחכה שזה יעבור לבד בחסימה חשודה.",
      ar: "لا تنتظر الزوال التلقائي عند اشتباه انسداد.",
      en: "Do not wait it out in suspected occlusion.",
    },
  },
  simulation: {
    now: {
      he: "הראה למטופל טיימליין ולפני/אחרי לפני החלטה.",
      ar: "اعرض للمريض الجدول وقبل/بعد قبل القرار.",
      en: "Show timeline and before/after before deciding.",
    },
    why: {
      he: "הסכמה מושכלת מורידה אי־הבנות.",
      ar: "الموافقة المستنيرة تقلل سوء الفهم.",
      en: "Informed consent reduces misunderstanding.",
    },
    dont: {
      he: "אל תבטיח תוצאה זהה לתמונה.",
      ar: "لا تضمن نتيجة مطابقة للصورة.",
      en: "Do not promise an identical photo result.",
    },
  },
  document: {
    now: {
      he: "תעד חומר, לוט, נפח לאזור, והסכמה.",
      ar: "وثّق المادة والدفعة والحجم لكل منطقة والموافقة.",
      en: "Document product, lot, volume per zone, and consent.",
    },
    why: {
      he: "תיעוד = בטיחות משפטית וקלינית.",
      ar: "التوثيق = أمان سريري وقانوني.",
      en: "Documentation is clinical and legal safety.",
    },
    dont: {
      he: "אל תשאיר שדות קריטיים ריקים.",
      ar: "لا تترك الحقول الحاسمة فارغة.",
      en: "Do not leave critical fields blank.",
    },
  },
};

export function MentorPage() {
  const { regionId = "lips" } = useParams();
  const { locale, pick, t } = useLocale();
  const guide = getMentorByRegion(regionId);
  const [section, setSection] = useState<MentorSectionId>("overview");

  const sectionLabel = useMemo(
    () => (id: MentorSectionId) => {
      const s = SECTIONS.find((x) => x.id === id)!;
      return s[locale];
    },
    [locale],
  );

  if (!guide) {
    return <Navigate to="/guide/lips" replace />;
  }

  const mediaById = (id?: string) => guide.media.find((m) => m.id === id);

  return (
    <div className="mentor">
      <header className="mentor-top">
        <div>
          <p className="mentor-kicker">{pick(t.appName)} · {pick(t.tagline)}</p>
          <h1>{pickL(locale, guide.title)}</h1>
          <p className="mentor-sub">{pickL(locale, guide.subtitle)}</p>
        </div>
        <div className="mentor-top-actions">
          <Link className="btn ghost" to="/simulation">
            {sectionLabel("simulation")}
          </Link>
          <Link className="btn primary" to="/consultation">
            {pick(t.common.startConsultation)}
          </Link>
        </div>
      </header>

      <p className="mentor-disclaimer">{pickL(locale, guide.disclaimer)}</p>

      <div className="mentor-cue" role="note">
        <div>
          <span>NOW</span>
          <p>{CUES[section].now[locale]}</p>
        </div>
        <div>
          <span>WHY</span>
          <p>{CUES[section].why[locale]}</p>
        </div>
        <div>
          <span>DON&apos;T</span>
          <p>{CUES[section].dont[locale]}</p>
        </div>
      </div>

      <nav className="mentor-tabs" aria-label="Mentor sections">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={section === s.id ? "active" : ""}
            onClick={() => setSection(s.id)}
          >
            {s[locale]}
          </button>
        ))}
      </nav>

      <div className="mentor-grid">
        <div className="mentor-main">
          {section === "overview" && (
            <section className="mentor-panel">
              <h2>{pickL(locale, guide.protocolName)}</h2>
              <div className="mentor-two">
                <div>
                  <h3>{locale === "he" ? "מטרות" : locale === "ar" ? "الأهداف" : "Goals"}</h3>
                  <ul>
                    {pickList(locale, guide.goals).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <h3>{locale === "he" ? "אנטומיה" : locale === "ar" ? "التشريح" : "Anatomy"}</h3>
                  <ul>
                    {pickList(locale, guide.anatomy).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <h3 className="danger">
                    {locale === "he" ? "אזורי סכנה" : locale === "ar" ? "مناطق الخطر" : "Danger zones"}
                  </h3>
                  <ul>
                    {pickList(locale, guide.dangerZones).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <figure className="mentor-media">
                  <img src={guide.media[0].src} alt="" />
                  <figcaption>{pickL(locale, guide.media[0].caption)}</figcaption>
                </figure>
              </div>
            </section>
          )}

          {section === "materials" && (
            <section className="mentor-panel">
              <h2>{sectionLabel("materials")}</h2>
              <div className="mentor-cards">
                {guide.materials.map((m) => (
                  <article key={m.id} className="mentor-card">
                    <h3>{pickL(locale, m.name)}</h3>
                    <p className="role">{pickL(locale, m.role)}</p>
                    <dl>
                      <div>
                        <dt>{locale === "he" ? "ריאולוגיה" : locale === "ar" ? "الريولوجيا" : "Rheology"}</dt>
                        <dd>{pickL(locale, m.rheology)}</dd>
                      </div>
                      <div>
                        <dt>{locale === "he" ? "שכבה" : locale === "ar" ? "المستوى" : "Plane"}</dt>
                        <dd>{pickL(locale, m.planes)}</dd>
                      </div>
                      <div>
                        <dt>{locale === "he" ? "מינון" : locale === "ar" ? "الجرعة" : "Dose"}</dt>
                        <dd>{pickL(locale, m.dose)}</dd>
                      </div>
                    </dl>
                    <h4>{locale === "he" ? "פנינים" : locale === "ar" ? "نصائح" : "Pearls"}</h4>
                    <ul>
                      {pickList(locale, m.pearls).map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <h4>{locale === "he" ? "זהירות" : locale === "ar" ? "تحذيرات" : "Cautions"}</h4>
                    <ul>
                      {pickList(locale, m.cautions).map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          )}

          {section === "dosing" && (
            <section className="mentor-panel">
              <h2>{sectionLabel("dosing")}</h2>
              <table className="mentor-table">
                <thead>
                  <tr>
                    <th>{locale === "he" ? "אתר" : locale === "ar" ? "الموقع" : "Site"}</th>
                    <th>{locale === "he" ? "מינון טיפוסי" : locale === "ar" ? "جرعة نمطية" : "Typical"}</th>
                    <th>{locale === "he" ? "שכבה" : locale === "ar" ? "المستوى" : "Plane"}</th>
                    <th>{locale === "he" ? "הערה" : locale === "ar" ? "ملاحظة" : "Note"}</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.dosing.map((d) => (
                    <tr key={d.id}>
                      <td>{pickL(locale, d.site)}</td>
                      <td>{pickL(locale, d.typical)}</td>
                      <td>{pickL(locale, d.plane)}</td>
                      <td>{pickL(locale, d.note)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <figure className="mentor-media wide">
                <img src={mediaById("anatomy-alt")?.src ?? mediaById("anatomy-front")?.src} alt="" />
                <figcaption>
                  {pickL(
                    locale,
                    (mediaById("anatomy-alt") ?? mediaById("anatomy-front"))!.caption,
                  )}
                </figcaption>
              </figure>
            </section>
          )}

          {section === "technique" && (
            <section className="mentor-panel">
              <h2>{sectionLabel("technique")}</h2>
              <div className="mentor-two">
                <div className="mentor-tech-list">
                  {guide.techniques.map((tech) => (
                    <article key={tech.id} className="mentor-card">
                      <h3>{pickL(locale, tech.name)}</h3>
                      <p className="role">{pickL(locale, tech.when)}</p>
                      <h4>{locale === "he" ? "שלבים" : locale === "ar" ? "الخطوات" : "Steps"}</h4>
                      <ol>
                        {pickList(locale, tech.steps).map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ol>
                      <h4>{locale === "he" ? "מלכודות" : locale === "ar" ? "أخطاء شائعة" : "Pitfalls"}</h4>
                      <ul>
                        {pickList(locale, tech.pitfalls).map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
                <div className="mentor-tech-media">
                  <figure className="mentor-media">
                    <img src={mediaById("inj-still")?.src} alt="" />
                    <figcaption>{pickL(locale, mediaById("inj-still")!.caption)}</figcaption>
                  </figure>
                  <AnimationReel />
                  <p className="mentor-media-note">
                    {locale === "he"
                      ? "רצף Flow להמחשת פעולה — החלף ב־MP4 כשיסופק."
                      : locale === "ar"
                        ? "تسلسل Flow لتوضيح الإجراء — يُستبدل بـ MP4 عند التوفر."
                        : "Flow frame sequence for procedure demo — replace with MP4 when provided."}
                  </p>
                </div>
              </div>
            </section>
          )}

          {section === "complications" && (
            <section className="mentor-panel">
              <h2>{sectionLabel("complications")}</h2>
              <div className="mentor-cards">
                {guide.complications.map((c) => (
                  <article key={c.id} className={`mentor-card urgency-${c.urgency}`}>
                    <div className="urgency-tag">{c.urgency}</div>
                    <h3>{pickL(locale, c.name)}</h3>
                    <h4>{locale === "he" ? "סימנים" : locale === "ar" ? "العلامات" : "Signs"}</h4>
                    <ul>
                      {pickList(locale, c.signs).map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <h4>{locale === "he" ? "פעולות" : locale === "ar" ? "الإجراءات" : "Actions"}</h4>
                    <ul>
                      {pickList(locale, c.actions).map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <Link className="btn primary" to="/emergency">
                {pick(t.nav.emergency)}
              </Link>
            </section>
          )}

          {section === "simulation" && (
            <section className="mentor-panel">
              <h2>{sectionLabel("simulation")}</h2>
              <div className="mentor-two">
                <div>
                  <h3>
                    {locale === "he"
                      ? "טיימליין החלמה"
                      : locale === "ar"
                        ? "جدول التعافي"
                        : "Recovery timeline"}
                  </h3>
                  <TimelineScrubber autoPlay />
                </div>
                <div>
                  <h3>
                    {locale === "he" ? "לפני / אחרי" : locale === "ar" ? "قبل / بعد" : "Before / after"}
                  </h3>
                  <figure className="mentor-media">
                    <img src={mediaById("before-after")?.src} alt="" />
                    <figcaption>{pickL(locale, mediaById("before-after")!.caption)}</figcaption>
                  </figure>
                  <Link className="btn primary" to="/simulation" style={{ marginTop: "1rem" }}>
                    {locale === "he"
                      ? "פתח סימולטור מלא"
                      : locale === "ar"
                        ? "افتح المحاكي الكامل"
                        : "Open full simulator"}
                  </Link>
                </div>
              </div>
              <h3 style={{ marginTop: "2rem" }}>
                {locale === "he" ? "מעקב" : locale === "ar" ? "المتابعة" : "Follow-up"}
              </h3>
              <ul>
                {pickList(locale, guide.followUp).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          )}

          {section === "document" && (
            <section className="mentor-panel">
              <h2>{sectionLabel("document")}</h2>
              <p className="mentor-sub">
                {locale === "he"
                  ? "ייצוא תיעוד ייעוץ לשפתיים — חומר, מינון, אזהרות."
                  : locale === "ar"
                    ? "تصدير توثيق استشارة الشفاه — المادة والجرعة والتحذيرات."
                    : "Export lips consult documentation — material, dose, warnings."}
              </p>
              <Link className="btn primary" to="/consultation">
                {pick(t.common.startConsultation)}
              </Link>
            </section>
          )}
        </div>

        <aside className="mentor-rail">
          <p className="mentor-kicker">
            {locale === "he" ? "מדיה קלינית" : locale === "ar" ? "وسائط سريرية" : "Clinical media"}
          </p>
          {guide.media.map((m) => (
            <figure key={m.id} className="mentor-rail-item">
              <img src={m.src} alt="" loading="lazy" />
              <figcaption>{pickL(locale, m.caption)}</figcaption>
            </figure>
          ))}
          {!guide.reviewedByPhysician && (
            <p className="mentor-draft">{pick(t.common.draft)}</p>
          )}
        </aside>
      </div>
    </div>
  );
}

export function MentorIndexPage() {
  return <Navigate to="/guide/lips" replace />;
}
