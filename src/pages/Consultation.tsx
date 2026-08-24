import { useEffect, useMemo, useRef, useState } from "react";
import {
  CLINICAL_TREATMENTS,
  TREATMENT_FAMILIES,
  type TreatmentFamily,
} from "../data/clinical/treatmentCatalog";
import { ZONE_LABELS } from "../data/faceZones";
import { FaceMap } from "../components/visual/FaceMap";
import { buildDosePlan, zonesFromTreatments } from "../lib/doseEngine";
import { generateAfterPreview } from "../lib/afterEngine";
import { STITCH } from "../lib/assets";
import { useLocale } from "../i18n";
import "../components/visual/visual.css";
import "./Consultation.css";

const STEPS = ["photo", "treatments", "zones", "plan", "after"] as const;

export function ConsultationPage() {
  const { locale, pick, t } = useLocale();
  const [step, setStep] = useState(0);
  const [family, setFamily] = useState<TreatmentFamily | "all">("all");
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([
    "filler-lips-volume",
  ]);
  const [selectedZones, setSelectedZones] = useState<string[]>(["lips"]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(STITCH.profile);
  const [photoName, setPhotoName] = useState<string>("");
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [aiStrength, setAiStrength] = useState(65);
  const [notes, setNotes] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const stepLabels = [
    locale === "he" ? "העלאת תמונה" : locale === "ar" ? "رفع صورة" : "Upload photo",
    locale === "he" ? "בחירת טיפולים" : locale === "ar" ? "اختيار العلاجات" : "Select treatments",
    locale === "he" ? "סימון אזורים" : locale === "ar" ? "تحديد المناطق" : "Mark zones",
    locale === "he" ? "חומרים ומינונים" : locale === "ar" ? "المواد والجرعات" : "Materials & doses",
    locale === "he" ? "תמונת אחרי (AI)" : locale === "ar" ? "صورة بعد (AI)" : "After image (AI)",
  ];

  const catalog = useMemo(
    () =>
      family === "all"
        ? CLINICAL_TREATMENTS
        : CLINICAL_TREATMENTS.filter((x) => x.family === family),
    [family],
  );

  const dosePlan = useMemo(
    () => buildDosePlan(selectedTreatments, selectedZones, locale),
    [selectedTreatments, selectedZones, locale],
  );

  const toggleTreatment = (id: string) => {
    setSelectedTreatments((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      // Auto-suggest zones from selected clinical images (keep manual extras)
      const implied = zonesFromTreatments(next);
      setSelectedZones((zones) => {
        const kept = zones.filter((z) => implied.includes(z) || !zonesFromTreatments(prev).includes(z));
        return [...new Set([...kept, ...implied])];
      });
      setAfterUrl(null);
      return next;
    });
  };

  const toggleZone = (id: string) => {
    setSelectedZones((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setAfterUrl(null);
  };

  const onUpload = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl((old) => {
      if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
      return url;
    });
    setPhotoName(file.name);
    setAfterUrl(null);
  };

  const runAfterEngine = async () => {
    if (!photoUrl || !selectedTreatments.length) return;
    setGenerating(true);
    try {
      const img = imgRef.current ?? new Image();
      if (!imgRef.current) {
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("image load failed"));
          img.src = photoUrl;
        });
      } else if (!img.complete) {
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });
      }
      const canvas = await generateAfterPreview({
        source: img,
        treatmentIds: selectedTreatments,
        zoneIds: selectedZones,
        strength: aiStrength,
      });
      setAfterUrl(canvas.toDataURL("image/jpeg", 0.92));
    } catch {
      setAfterUrl(null);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (step === 4 && photoUrl && selectedTreatments.length && !afterUrl && !generating) {
      void runAfterEngine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const exportPlan = () => {
    const lines = [
      `Protokol — ${pick(t.consultation.title)}`,
      `Photo: ${photoName || "template"}`,
      "",
      "TREATMENTS (multi-select):",
      ...selectedTreatments.map((id) => {
        const tr = CLINICAL_TREATMENTS.find((x) => x.id === id);
        return `- ${tr?.title[locale] ?? id}`;
      }),
      "",
      "ZONES:",
      ...selectedZones.map((z) => `- ${ZONE_LABELS[z]?.[locale] ?? z}`),
      "",
      "AUTO MATERIALS:",
      ...dosePlan.materials.map((m) => `- ${m.name} (${m.brandExample})`),
      "",
      "DOSE PLAN (educational):",
      ...dosePlan.lines.map(
        (l) =>
          `- ${l.title}: ${l.calculated} ${l.unit} (range ${l.rangeMin}–${l.rangeMax} ${l.unit}) | ${l.plane}`,
      ),
      "",
      `TOTAL: ${dosePlan.totalsByUnit.ml} ml HA/biostim · ${dosePlan.totalsByUnit.units} toxin units`,
      "",
      `Notes: ${notes || "—"}`,
      pick(t.common.disclaimer),
    ];
    void navigator.clipboard.writeText(lines.join("\n"));
  };

  const canNext =
    (step === 0 && Boolean(photoUrl)) ||
    (step === 1 && selectedTreatments.length > 0) ||
    (step === 2 && selectedZones.length > 0) ||
    step === 3 ||
    step === 4;

  return (
    <div className="smart-consult">
      <header className="smart-consult-head">
        <p className="smart-kicker">
          {locale === "he"
            ? "מתכנן קליני חכם"
            : locale === "ar"
              ? "مخطط سريري ذكي"
              : "Smart clinical planner"}
        </p>
        <h1>
          {locale === "he"
            ? "העלאה · בחירה מרובה · חומר אוטומטי · מינון · תמונת אחרי"
            : locale === "ar"
              ? "رفع · اختيار متعدد · مادة تلقائية · جرعة · صورة بعد"
              : "Upload · multi-select · auto material · dose · after image"}
        </h1>
        <p>
          {locale === "he"
            ? "המטופל/הרופא בוחרים תמונות קליניות (פילר, קמטים, מיצוק, בוטוקס טיפולי), מסמנים אזורים — המערכת מתאימה חומר, מחשבת מינונים מספריים ומייצרת תצוגת אחרי באמצעות מנוע AI מקומי."
            : locale === "ar"
              ? "اختيار صور سريرية متعددة وتحديد المناطق — تُطابق المادة وتحسب الجرعات وتُنشئ معاينة بعد العلاج."
              : "Multi-select clinical images and zones — the system matches materials, calculates numeric doses, and generates an after preview with the on-device AI engine."}
        </p>
      </header>

      <div className="consult-steps" role="tablist">
        {STEPS.map((id, i) => (
          <button
            key={id}
            type="button"
            className={`consult-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            onClick={() => setStep(i)}
          >
            {i + 1}. {stepLabels[i]}
          </button>
        ))}
      </div>

      {/* hidden source for after engine */}
      {photoUrl ? (
        <img ref={imgRef} src={photoUrl} alt="" className="smart-hidden-img" crossOrigin="anonymous" />
      ) : null}

      {step === 0 && (
        <section className="smart-panel">
          <h2>{stepLabels[0]}</h2>
          <p className="smart-lead">
            {locale === "he"
              ? "העלה תמונת פנים קדמית של המטופל (תאורה אחידה, ללא פילטר)."
              : locale === "ar"
                ? "ارفع صورة أمامية للمريض (إضاءة متساوية)."
                : "Upload a frontal patient photo (even lighting, no filter)."}
          </p>
          <div className="smart-upload">
            <label className="btn primary upload-btn">
              {pick(t.common.uploadPhoto)}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
              />
            </label>
            {photoName ? <span className="smart-file">{photoName}</span> : null}
          </div>
          <figure className="smart-photo-frame">
            {photoUrl ? <img src={photoUrl} alt="" /> : null}
          </figure>
        </section>
      )}

      {step === 1 && (
        <section className="smart-panel">
          <h2>{stepLabels[1]}</h2>
          <p className="smart-lead">
            {locale === "he"
              ? "בחירה מרובה חובה: סמן כל התמונות הקליניות הרלוונטיות — מילוי, קמטים, מיצוק, ובוטוקס טיפולי (TMJ, הזעת יתר ועוד)."
              : locale === "ar"
                ? "اختيار متعدد: حدّد كل الصور السريرية — فيلر، تجاعيد، شد، وبوتوكس علاجي."
                : "Multi-select required: pick every relevant clinical image — filler, wrinkles, firming, and therapeutic botox."}
          </p>
          <div className="smart-family-tabs">
            {TREATMENT_FAMILIES.map((f) => (
              <button
                key={f.id}
                type="button"
                className={family === f.id ? "active" : ""}
                onClick={() => setFamily(f.id)}
              >
                {f.label[locale]}
              </button>
            ))}
          </div>
          <div className="smart-treat-grid">
            {catalog.map((tr) => {
              const on = selectedTreatments.includes(tr.id);
              return (
                <button
                  key={tr.id}
                  type="button"
                  className={`smart-treat-card ${on ? "is-on" : ""}`}
                  onClick={() => toggleTreatment(tr.id)}
                  aria-pressed={on}
                >
                  <img src={tr.image} alt="" />
                  <span className="smart-treat-tag">{tr.categoryLabel[locale]}</span>
                  <strong>{tr.title[locale]}</strong>
                  <em>{tr.subtitle[locale]}</em>
                  <span className="smart-treat-dose">
                    {tr.dosing.typicalTotal} {tr.dosing.unit} · {tr.dosing.rangeMin}–{tr.dosing.rangeMax}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="smart-selected-count">
            {locale === "he"
              ? `נבחרו ${selectedTreatments.length} טיפולים`
              : locale === "ar"
                ? `تم اختيار ${selectedTreatments.length}`
                : `${selectedTreatments.length} treatments selected`}
          </p>
        </section>
      )}

      {step === 2 && (
        <section className="smart-panel">
          <h2>{stepLabels[2]}</h2>
          <p className="smart-lead">
            {locale === "he"
              ? "סמן/בטל אזורים על המפה (בחירה מרובה). האזורים מתעדכנים אוטומטית לפי התמונות הקליניות שבחרת."
              : locale === "ar"
                ? "حدّد المناطق على الخريطة (اختيار متعدد)."
                : "Toggle zones on the map (multi-select). Zones auto-follow your clinical image choices."}
          </p>
          <FaceMap selectedZoneIds={selectedZones} onToggleZone={toggleZone} />
        </section>
      )}

      {step === 3 && (
        <section className="smart-panel">
          <h2>{stepLabels[3]}</h2>
          <p className="smart-lead">
            {locale === "he"
              ? "התאמה אוטומטית של חומר הזרקה + חישוב כמויות מספריות לפי האזורים והתמונות שנבחרו. ערכי הוראה — IFU והשיקול שלך קובעים."
              : locale === "ar"
                ? "مطابقة تلقائية للمادة وحساب جرعات رقمية — تعليمية وفق النشرة وحكمك."
                : "Auto-matched injectables + numeric dose math from selections. Educational — IFU and your judgment govern."}
          </p>

          <div className="smart-materials">
            <h3>
              {locale === "he" ? "חומרים מותאמים" : locale === "ar" ? "مواد مطابقة" : "Matched materials"}
            </h3>
            <ul>
              {dosePlan.materials.map((m) => (
                <li key={m.id}>
                  <strong>{m.name}</strong>
                  <span>{m.brandExample}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="smart-dose-table-wrap">
            <table className="smart-dose-table">
              <thead>
                <tr>
                  <th>{locale === "he" ? "טיפול" : locale === "ar" ? "علاج" : "Treatment"}</th>
                  <th>{locale === "he" ? "מינון מחושב" : locale === "ar" ? "جرعة محسوبة" : "Calculated"}</th>
                  <th>{locale === "he" ? "טווח" : locale === "ar" ? "المدى" : "Range"}</th>
                  <th>{locale === "he" ? "שכבה" : locale === "ar" ? "المستوى" : "Plane"}</th>
                  <th>{locale === "he" ? "אליקוטות" : locale === "ar" ? "الدفعات" : "Aliquots"}</th>
                </tr>
              </thead>
              <tbody>
                {dosePlan.lines.map((line) => (
                  <tr key={line.treatmentId}>
                    <td>
                      <strong>{line.title}</strong>
                      <div className="smart-mat-sub">{line.materialName}</div>
                    </td>
                    <td className="num">
                      {line.calculated} {line.unit}
                    </td>
                    <td className="num">
                      {line.rangeMin}–{line.rangeMax} {line.unit}
                    </td>
                    <td>{line.plane}</td>
                    <td>{line.aliquotNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="smart-totals">
            <div>
              <span>{locale === "he" ? "סה״כ פילר/ביוסטימ" : locale === "ar" ? "مجموع الفيلر" : "Total filler/biostim"}</span>
              <strong>{dosePlan.totalsByUnit.ml} ml</strong>
            </div>
            <div>
              <span>{locale === "he" ? "סה״כ יחידות טוקסין" : locale === "ar" ? "مجموع وحدات التوكسين" : "Total toxin units"}</span>
              <strong>{dosePlan.totalsByUnit.units} U</strong>
            </div>
          </div>

          <div className="smart-edu">
            <h3>{locale === "he" ? "תוכן לימודי" : locale === "ar" ? "محتوى تعليمي" : "Teaching points"}</h3>
            <ul>
              {dosePlan.education.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>

          <label className="smart-notes">
            {locale === "he" ? "הערות רופא" : locale === "ar" ? "ملاحظات الطبيب" : "Physician notes"}
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </label>
        </section>
      )}

      {step === 4 && (
        <section className="smart-panel">
          <h2>{stepLabels[4]}</h2>
          <p className="smart-lead">
            {locale === "he"
              ? "מנוע Protokol After Engine מייצר תצוגת אחרי מדויקת ככל האפשר על בסיס התמונה, האזורים והטיפולים — סימולציה חינוכית, לא הבטחת תוצאה."
              : locale === "ar"
                ? "محرك Protokol After يُنشئ معاينة بعد العلاج — محاكاة تعليمية وليست ضماناً."
                : "Protokol After Engine builds a realistic after preview from the photo, zones and treatments — educational simulation, not an outcome guarantee."}
          </p>

          <label className="smart-slider">
            <span>
              {locale === "he" ? "עוצמת AI" : locale === "ar" ? "شدة AI" : "AI strength"}
              <b>{aiStrength}%</b>
            </span>
            <input
              type="range"
              min={20}
              max={90}
              value={aiStrength}
              onChange={(e) => {
                setAiStrength(Number(e.target.value));
                setAfterUrl(null);
              }}
            />
          </label>

          <div className="smart-ba">
            <figure>
              <img src={photoUrl ?? undefined} alt="" />
              <figcaption>{pick(t.common.before)}</figcaption>
            </figure>
            <figure>
              {generating ? (
                <div className="smart-generating">
                  {locale === "he" ? "מייצר תמונת אחרי…" : locale === "ar" ? "جارٍ إنشاء الصورة…" : "Generating after image…"}
                </div>
              ) : afterUrl ? (
                <img src={afterUrl} alt="" />
              ) : (
                <div className="smart-generating">—</div>
              )}
              <figcaption>{pick(t.common.after)}</figcaption>
            </figure>
          </div>

          <div className="smart-after-actions">
            <button type="button" className="btn primary" onClick={() => void runAfterEngine()} disabled={generating}>
              {locale === "he"
                ? "הרץ מנוע AI מחדש"
                : locale === "ar"
                  ? "أعد تشغيل محرك AI"
                  : "Re-run AI engine"}
            </button>
            {afterUrl ? (
              <a className="btn ghost" href={afterUrl} download="protokol-after.jpg">
                {locale === "he" ? "הורד תמונת אחרי" : locale === "ar" ? "تنزيل صورة بعد" : "Download after"}
              </a>
            ) : null}
            <button type="button" className="btn ghost" onClick={exportPlan}>
              {locale === "he" ? "העתק תוכנית מינון" : locale === "ar" ? "نسخ خطة الجرعة" : "Copy dose plan"}
            </button>
          </div>
        </section>
      )}

      <div className="consult-nav">
        <button type="button" className="btn ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          {pick(t.common.back)}
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            className="btn primary"
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
          >
            {locale === "he" ? "המשך" : locale === "ar" ? "متابعة" : "Continue"}
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={exportPlan}>
            {locale === "he" ? "סיים ותעד" : locale === "ar" ? "إنهاء وتوثيق" : "Finish & document"}
          </button>
        )}
      </div>
    </div>
  );
}
