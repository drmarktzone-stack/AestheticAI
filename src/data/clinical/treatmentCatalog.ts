import { STITCH, USER_LIPS, asset } from "../../lib/assets";
import type { Locale } from "../../i18n/types";

export type TreatmentFamily =
  | "filler"
  | "toxin-aesthetic"
  | "toxin-therapeutic"
  | "biostim";

export type DoseUnit = "ml" | "units";

export type ClinicalTreatment = {
  id: string;
  family: TreatmentFamily;
  /** Face/body zone ids used for map multi-select + after-engine */
  zoneIds: string[];
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  categoryLabel: Record<Locale, string>;
  image: string;
  /** Auto-matched injectables */
  material: {
    id: string;
    name: Record<Locale, string>;
    brandExample: string;
    rheology: Record<Locale, string>;
  };
  dosing: {
    unit: DoseUnit;
    /** Typical total for one bilateral/full treatment session */
    typicalTotal: number;
    rangeMin: number;
    rangeMax: number;
    /** Per mapped zone when multi-select expands */
    perZoneDefault: number;
    sitesTypical: number;
    plane: Record<Locale, string>;
    aliquotNote: Record<Locale, string>;
  };
  technique: Record<Locale, string>;
  education: Record<Locale, string[]>;
  effect: "volume" | "contour" | "smooth" | "lift";
  /** Intensity bias for after-preview engine 0–100 */
  previewIntensity: number;
};

const T = (
  he: string,
  ar: string,
  en: string,
): Record<Locale, string> => ({ he, ar, en });

/**
 * Educational clinical treatment catalog — numeric ranges are draft teaching values.
 * Always override with product IFU + physician judgment. Not for patient self-treatment.
 */
export const CLINICAL_TREATMENTS: ClinicalTreatment[] = [
  // ——— FILLER ———
  {
    id: "filler-lips-volume",
    family: "filler",
    zoneIds: ["lips"],
    title: T("מילוי שפתיים — נפח", "ملء الشفاه — حجم", "Lip filler — volume"),
    subtitle: T("HA דינמי לנפח טבעי", "HA ديناميكي لحجم طبيعي", "Dynamic HA for natural volume"),
    categoryLabel: T("פילר", "فيلر", "Filler"),
    image: USER_LIPS.beforeAfterGrid,
    material: {
      id: "restylane-kysse",
      name: T("HA שפתיים — רך/דינמי", "HA شفاه — مرن", "HA lips — soft/dynamic"),
      brandExample: "e.g. Restylane Kysse / Juvéderm Volbella class",
      rheology: T("G′ נמוך־בינוני", "G′ منخفض-متوسط", "Low–mid G′"),
    },
    dosing: {
      unit: "ml",
      typicalTotal: 0.8,
      rangeMin: 0.4,
      rangeMax: 1.2,
      perZoneDefault: 0.8,
      sitesTypical: 8,
      plane: T("תת־עורי / intramucosal", "تحت الجلد / مخاطي", "Subdermal / intramucosal"),
      aliquotNote: T(
        "אליקוטות 0.05–0.1 מ״ל לנקודה; עליונה ~0.3 מ״ל · תחתונה ~0.5 מ״ל (מדורג)",
        "دفعات 0.05–0.1 مل/نقطة؛ علوية ~0.3 · سفلية ~0.5 (متدرج)",
        "Aliquots 0.05–0.1 ml/point; upper ~0.3 · lower ~0.5 ml (staged)",
      ),
    },
    technique: T("Linear threading + micro-bolus", "حقن خطي + بلعة دقيقة", "Linear threading + micro-bolus"),
    education: {
      he: [
        "יחס עליונה:תחתונה נפוץ ~1:1.2–1.6 לפי מבנה הפנים",
        "נפיחות יום 1–3 צפויה — אל תתקן יתר באותו סשן",
        "סכנה: עורקי labial — הזרקה איטית, מודעות וסקולרית",
      ],
      ar: [
        "نسبة علوية:سفلية شائعة ~1:1.2–1.6 حسب الوجه",
        "تورم يوم 1–3 متوقع — لا تفرط في التصحيح بنفس الجلسة",
        "خطر: الشرايين الشفوية — حقن بطيء وواعٍ",
      ],
      en: [
        "Common upper:lower ratio ~1:1.2–1.6 by facial structure",
        "Day 1–3 edema expected — avoid same-session overcorrection",
        "Risk: labial arteries — slow, vessel-aware injection",
      ],
    },
    effect: "volume",
    previewIntensity: 55,
  },
  {
    id: "filler-lips-definition",
    family: "filler",
    zoneIds: ["lips"],
    title: T("הגדרת שפתיים / גבול", "تعريف الشفاه / الحدود", "Lip border definition"),
    subtitle: T("מיקרו־נפח ל־vermillion", "حجم دقيق للحدود", "Micro-volume for vermillion"),
    categoryLabel: T("פילר", "فيلر", "Filler"),
    image: USER_LIPS.anatomy[0],
    material: {
      id: "belotero-lips",
      name: T("HA שפתיים — מבני", "HA شفاه — هيكلي", "HA lips — structural"),
      brandExample: "e.g. Restylane Refyne / Juvederm Ultra class",
      rheology: T("תמיכה מעט גבוהה יותר", "دعم أعلى قليلاً", "Slightly higher support"),
    },
    dosing: {
      unit: "ml",
      typicalTotal: 0.4,
      rangeMin: 0.2,
      rangeMax: 0.6,
      perZoneDefault: 0.4,
      sitesTypical: 6,
      plane: T("לאורך vermilion", "على طول الحدود", "Along vermillion"),
      aliquotNote: T(
        "0.02–0.05 מ״ל לנקודה לאורך הגבול; סה״כ לרוב ≤0.5 מ״ל",
        "0.02–0.05 مل/نقطة على الحدود؛ غالباً ≤0.5 مل",
        "0.02–0.05 ml/point along border; usually ≤0.5 ml total",
      ),
    },
    technique: T("Serial puncture / fine linear", "وخز متسلسل / خطي دقيق", "Serial puncture / fine linear"),
    education: {
      he: ["הימנע מקו ״נקניק״", "בדוק דיבור וחיוך לפני סיום"],
      ar: ["تجنب مظهر السجق", "افحص الكلام والابتسامة"],
      en: ["Avoid sausage border", "Check speech and smile before finish"],
    },
    effect: "contour",
    previewIntensity: 40,
  },
  {
    id: "filler-midface",
    family: "filler",
    zoneIds: ["cheek-l", "cheek-r"],
    title: T("מילוי לחיים / מרכז פנים", "ملء الخدود / منتصف الوجه", "Midface / cheek filler"),
    subtitle: T("נפח מבני — קשת זיגומטית", "حجم هيكلي — القوس الوجني", "Structural volume — zygomatic arch"),
    categoryLabel: T("פילר", "فيلر", "Filler"),
    image: STITCH.midface[0],
    material: {
      id: "juvederm-voluma",
      name: T("HA נפח גבוה (midface)", "HA عالي الحجم", "High G′ HA (midface)"),
      brandExample: "e.g. Juvéderm Voluma / Restylane Lyft class",
      rheology: T("G′ גבוה, הרמה", "G′ مرتفع، رفع", "High G′, lift"),
    },
    dosing: {
      unit: "ml",
      typicalTotal: 1.5,
      rangeMin: 0.8,
      rangeMax: 2.5,
      perZoneDefault: 0.75,
      sitesTypical: 4,
      plane: T("עמוק / סופרה־פריאוסטאלי באזורים נבחרים", "عميق / فوق العظم", "Deep / selected supraperiosteal"),
      aliquotNote: T(
        "0.2–0.5 מ״ל ללחי; בולוסים עמוקים 0.05–0.1 מ״ל; סה״כ דו־צדדי לעיתים 1–2 מ״ל",
        "0.2–0.5 مل/خد؛ بلعات عميقة 0.05–0.1؛ ثنائي الجانب غالباً 1–2 مل",
        "0.2–0.5 ml/cheek; deep boluses 0.05–0.1 ml; bilateral often 1–2 ml",
      ),
    },
    technique: T("Deep bolus + fanning", "بلعة عميقة + مروحة", "Deep bolus + fanning"),
    education: {
      he: ["מפה כלי דם אינפראורביטליים", "העדף מדורג על פני מילוי יתר"],
      ar: ["خطّط الأوعية تحت الحجاج", "فضّل التدرج على الإفراط"],
      en: ["Map infraorbital vessels", "Prefer staging over overfill"],
    },
    effect: "volume",
    previewIntensity: 50,
  },
  {
    id: "filler-jawline",
    family: "filler",
    zoneIds: ["jaw-l", "jaw-r"],
    title: T("קונטור קו לסת", "تحديد خط الفك", "Jawline contour"),
    subtitle: T("הגדרת זווית וקו", "تعريف الزاوية والخط", "Angle & line definition"),
    categoryLabel: T("פילר", "فيلر", "Filler"),
    image: STITCH.side[1],
    material: {
      id: "juvederm-volux",
      name: T("HA קשיח לקונטור", "HA صلب للتحديد", "Firm HA for contour"),
      brandExample: "e.g. Restylane Lyft / Volux class",
      rheology: T("G′ גבוה, הקרנה", "G′ مرتفع", "High G′, projection"),
    },
    dosing: {
      unit: "ml",
      typicalTotal: 1.2,
      rangeMin: 0.6,
      rangeMax: 2.0,
      perZoneDefault: 0.6,
      sitesTypical: 6,
      plane: T("עמוק לאורך mandibular border", "عميق على حافة الفك", "Deep along mandibular border"),
      aliquotNote: T(
        "0.3–0.7 מ״ל לצד; נקודות בזווית הלסת 0.1–0.2 מ״ל",
        "0.3–0.7 مل/جانب؛ نقاط زاوية الفك 0.1–0.2 مل",
        "0.3–0.7 ml/side; gonial angle points 0.1–0.2 ml",
      ),
    },
    technique: T("Linear deep + angle boluses", "خطي عميق + بلعات الزاوية", "Deep linear + angle boluses"),
    education: {
      he: ["הערך אסימטריה של masseter לפני מילוי", "תעד פרופיל צד"],
      ar: ["قيّم عدم تناظر الماضغة قبل الملء", "وثّق الملف الجانبي"],
      en: ["Assess masseter asymmetry before fill", "Document lateral profile"],
    },
    effect: "contour",
    previewIntensity: 48,
  },
  {
    id: "filler-temples",
    family: "filler",
    zoneIds: ["temple-l", "temple-r"],
    title: T("מילוי רקות", "ملء الصدغين", "Temple filler"),
    subtitle: T("שחזור נפח רקתי", "استعادة حجم الصدغ", "Temporal volume restore"),
    categoryLabel: T("פילר", "فيلر", "Filler"),
    image: STITCH.temple,
    material: {
      id: "restylane-lyft",
      name: T("HA לרקות", "HA للصدغ", "HA for temples"),
      brandExample: "e.g. Voluma / Lyft class",
      rheology: T("תמיכה בינונית־גבוהה", "دعم متوسط-مرتفع", "Mid–high support"),
    },
    dosing: {
      unit: "ml",
      typicalTotal: 1.0,
      rangeMin: 0.5,
      rangeMax: 2.0,
      perZoneDefault: 0.5,
      sitesTypical: 2,
      plane: T("עמוק (interfascial / לפי הכשרה)", "عميق حسب التدريب", "Deep (interfascial / per training)"),
      aliquotNote: T(
        "0.3–0.8 מ״ל לרקה; זהירות וסקולרית גבוהה",
        "0.3–0.8 مل/صدغ؛ حذر وعائي مرتفع",
        "0.3–0.8 ml/temple; high vascular vigilance",
      ),
    },
    technique: T("Deep depot / cannula per protocol", "مستودع عميق / كانيولا", "Deep depot / cannula per protocol"),
    education: {
      he: ["אזור סיכון גבוה — הכשרה ספציפית", "הזרקה איטית מאוד"],
      ar: ["منطقة خطر عالية — تدريب خاص", "حقن بطيء جداً"],
      en: ["High-risk zone — specific training", "Very slow injection"],
    },
    effect: "volume",
    previewIntensity: 42,
  },
  {
    id: "filler-tear-trough",
    family: "filler",
    zoneIds: ["periocular-l", "periocular-r"],
    title: T("מיצוק / מילוי דמעות (tear trough)", "تحسين تحت العين", "Tear trough / under-eye"),
    subtitle: T("תיקון שקעים עדין", "تصحيح التجاويف بلطف", "Gentle hollow correction"),
    categoryLabel: T("פילר · מיצוק", "فيلر · شد", "Filler · firming"),
    image: STITCH.periocular,
    material: {
      id: "teosyal-redensity-2",
      name: T("HA רך מאוד — periocular", "HA ناعم جداً", "Very soft HA — periocular"),
      brandExample: "e.g. Redensity / Volbella class",
      rheology: T("G′ נמוך, הידרופיליות מבוקרת", "G′ منخفض", "Low G′, controlled hydrophilia"),
    },
    dosing: {
      unit: "ml",
      typicalTotal: 0.4,
      rangeMin: 0.2,
      rangeMax: 0.8,
      perZoneDefault: 0.2,
      sitesTypical: 4,
      plane: T("עמוק מעל orbital rim / לפי טכניקה", "عميق فوق الحافة", "Deep above orbital rim / per technique"),
      aliquotNote: T(
        "0.1–0.3 מ״ל לעין; מיקרו־אליקוטות ≤0.05 מ״ל",
        "0.1–0.3 مل/عين؛ دفعات ≤0.05 مل",
        "0.1–0.3 ml/eye; micro-aliquots ≤0.05 ml",
      ),
    },
    technique: T("Supraperiosteal micro-bolus / cannula", "بلعة دقيقة / كانيولا", "Supraperiosteal micro-bolus / cannula"),
    education: {
      he: ["סיכון לנפיחות מאוחרת — שמרנות קיצונית", "אל תזרוק שטחי מדי"],
      ar: ["خطر تورم متأخر — تحفظ شديد", "لا تحقن سطحياً أكثر من اللازم"],
      en: ["Delayed edema risk — extreme conservatism", "Avoid overly superficial placement"],
    },
    effect: "smooth",
    previewIntensity: 35,
  },
  {
    id: "filler-nasolabial",
    family: "filler",
    zoneIds: ["cheek-l", "cheek-r", "lips"],
    title: T("קמטי נזולביאל / קפלים", "الطيات الأنفية الشفوية", "Nasolabial folds"),
    subtitle: T("ריכוך קפל — לא מחיקה מלאה", "تخفيف الطية — لا محو كامل", "Soften fold — not full erase"),
    categoryLabel: T("פילר · קמטים", "فيلر · تجاعيد", "Filler · wrinkles"),
    image: STITCH.midface[1],
    material: {
      id: "restylane-defyne",
      name: T("HA בינוני לקפלים", "HA متوسط للطيات", "Mid HA for folds"),
      brandExample: "e.g. Restylane / Juvederm Ultra Plus class",
      rheology: T("G′ בינוני", "G′ متوسط", "Mid G′"),
    },
    dosing: {
      unit: "ml",
      typicalTotal: 0.8,
      rangeMin: 0.4,
      rangeMax: 1.5,
      perZoneDefault: 0.35,
      sitesTypical: 4,
      plane: T("תת־עורי עמוק / שומן שטחי", "تحت الجلد العميق", "Deep subdermal / superficial fat"),
      aliquotNote: T(
        "0.2–0.5 מ״ל לצד; שקול תמיכת midface לפני מילוי הקפל",
        "0.2–0.5 مل/جانب؛ فكّر بدعم منتصف الوجه أولاً",
        "0.2–0.5 ml/side; consider midface support before fold fill",
      ),
    },
    technique: T("Linear threading retrograde", "حقن خطي رجوعي", "Retrograde linear threading"),
    education: {
      he: ["מילוי יתר בקפל → מראה כבד", "בדוק facial artery path"],
      ar: ["الإفراط في الطية → مظهر ثقيل", "افحص مسار الشريان الوجهي"],
      en: ["Overfill looks heavy", "Respect facial artery course"],
    },
    effect: "smooth",
    previewIntensity: 38,
  },
  {
    id: "filler-chin",
    family: "filler",
    zoneIds: ["chin"],
    title: T("מילוי סנטר — הטלה", "ملء الذقن — بروز", "Chin filler — projection"),
    subtitle: T("pogonion / pre-jowl", "الذقن / أمام الفك", "Pogonion / pre-jowl"),
    categoryLabel: T("פילר", "فيلر", "Filler"),
    image: STITCH.profile,
    material: {
      id: "juvederm-volux",
      name: T("HA קשיח לסנטר", "HA صلب للذقن", "Firm HA for chin"),
      brandExample: "e.g. Juvéderm Volux / Restylane Lyft class",
      rheology: T("G′ גבוה, הקרנה", "G′ مرتفع", "High G′, projection"),
    },
    dosing: {
      unit: "ml",
      typicalTotal: 0.7,
      rangeMin: 0.4,
      rangeMax: 1.2,
      perZoneDefault: 0.7,
      sitesTypical: 3,
      plane: T("עמוק / פריאוסטאלי", "عميق / فوق العظم", "Deep / periosteal"),
      aliquotNote: T(
        "0.2–0.6 מ״ל בפגוניון; הימנע מלחץ על mental foramen",
        "0.2–0.6 مل في الذقن؛ تجنّب الثقب الذقني",
        "0.2–0.6 ml at pogonion; avoid pressure on the mental foramen",
      ),
    },
    technique: T("Deep bolus / linear pogonion", "بلعة عميقة / خط الذقن", "Deep bolus / linear pogonion"),
    education: {
      he: ["הערך פרופיל לפני נפח", "Kybella הוא פרוטוקול נפרד לשומן"],
      ar: ["قيّم الجانب قبل الحجم", "Kybella بروتوكول منفصل للدهن"],
      en: ["Assess profile before volume", "Kybella is a separate fat protocol"],
    },
    effect: "volume",
    previewIntensity: 46,
  },
  {
    id: "filler-nose",
    family: "filler",
    zoneIds: ["nose"],
    title: T("מילוי אף שמרני", "فيلر أنف محافظ", "Conservative nose filler"),
    subtitle: T("סיכון קריטי — הכשרה ייעודית", "خطر حرج — تدريب خاص", "Critical risk — dedicated training"),
    categoryLabel: T("פילר · סיכון גבוה", "فيلر · خطر مرتفع", "Filler · high risk"),
    image: STITCH.profile,
    material: {
      id: "restylane-lyft",
      name: T("HA קוהזיבי נמוך־נפח", "HA متماسك منخفض الحجم", "Cohesive low-volume HA"),
      brandExample: "e.g. Restylane Lyft / Teosyal RHA 2 class — IFU + training",
      rheology: T("קוהזיה גבוהה, נפח זעיר", "تماسك عالٍ، حجم ضئيل", "High cohesion, tiny volume"),
    },
    dosing: {
      unit: "ml",
      typicalTotal: 0.3,
      rangeMin: 0.15,
      rangeMax: 0.4,
      perZoneDefault: 0.3,
      sitesTypical: 4,
      plane: T("עמוק / פריאוסטאלי בגשר", "عميق / فوق العظم في الجسر", "Deep / periosteal on dorsum"),
      aliquotNote: T(
        "אליקוטות ≤0.05 מ״ל; hyaluronidase מוכן; שקול הימנעות",
        "دفعات ≤0.05 مل؛ هيالورونيداز جاهز",
        "Aliquots ≤0.05 ml; hyaluronidase ready; consider avoiding",
      ),
    },
    technique: T("Micro-aliquot, very slow", "دفعات دقيقة وبطيئة جداً", "Micro-aliquot, very slow"),
    education: {
      he: ["סיכון עיוורון — נתיב ACE", "אין CaHA / PLLA באף"],
      ar: ["خطر العمى — مسار ACE", "لا CaHA / PLLA في الأنف"],
      en: ["Blindness risk — ACE pathway", "No CaHA / PLLA in the nose"],
    },
    effect: "contour",
    previewIntensity: 28,
  },
  {
    id: "biostim-skin",
    family: "biostim",
    zoneIds: ["cheek-l", "cheek-r", "jaw-l", "jaw-r"],
    title: T("מיצוק עור / ביוסטימולציה", "شد الجلد / تحفيز حيوي", "Skin firming / biostimulation"),
    subtitle: T("PLLA / CaHA מדולל — איכות עור", "PLLA / CaHA مخفف", "Dilute PLLA / CaHA — skin quality"),
    categoryLabel: T("מיצוק", "شد", "Firming"),
    image: STITCH.treatment,
    material: {
      id: "sculptra",
      name: T("ביוסטימולטור (PLLA/CaHA)", "محفز حيوي", "Biostimulator (PLLA/CaHA)"),
      brandExample: "e.g. Sculptra / Radiesse diluted class",
      rheology: T("תלוי דילול ופרוטוקול", "حسب التخفيف", "Dilution / protocol dependent"),
    },
    dosing: {
      unit: "ml",
      typicalTotal: 2.0,
      rangeMin: 1.0,
      rangeMax: 4.0,
      perZoneDefault: 0.5,
      sitesTypical: 10,
      plane: T("תת־עורי — לפי פרוטוקול מוצר", "تحت الجلد — حسب النشرة", "Subdermal — per product protocol"),
      aliquotNote: T(
        "נפחי דילול לפי IFU; לרוב כמה מ״ל מוזרקים כשכבה דקה — לא בולוס עמוק בפנים שטחיות",
        "أحجام التخفيف وفق النشرة",
        "Dilution volumes per IFU; thin-layer placement — not superficial facial deep bolus",
      ),
    },
    technique: T("Cannula fanning / grid", "مروحة كانيولا / شبكة", "Cannula fanning / grid"),
    education: {
      he: ["תוצאה הדרגתית על פני שבועות", "מספר סשנים נפוץ"],
      ar: ["نتيجة تدريجية خلال أسابيع", "عدة جلسات شائعة"],
      en: ["Gradual result over weeks", "Multi-session plans common"],
    },
    effect: "lift",
    previewIntensity: 30,
  },

  // ——— AESTHETIC TOXIN ———
  {
    id: "toxin-glabella",
    family: "toxin-aesthetic",
    zoneIds: ["glabella"],
    title: T("בוטוקס קמטי גלאבלה", "بوتوكس تجاعيد الجبين", "Botox — glabellar lines"),
    subtitle: T("11s / procerus + corrugators", "خطوط الغضب", "11s / procerus + corrugators"),
    categoryLabel: T("בוטוקס · קמטים", "بوتوكس · تجاعيد", "Botox · wrinkles"),
    image: STITCH.extreme,
    material: {
      id: "botox",
      name: T("Botulinum toxin A", "ذيفان البوتولينوم A", "Botulinum toxin A"),
      brandExample: "e.g. Botox / Dysport / Xeomin — units NOT 1:1",
      rheology: T("תוך־שרירי", "داخل العضل", "Intramuscular"),
    },
    dosing: {
      unit: "units",
      typicalTotal: 20,
      rangeMin: 12,
      rangeMax: 40,
      perZoneDefault: 20,
      sitesTypical: 5,
      plane: T("תוך־שרירי — corrugator / procerus", "داخل العضل", "IM — corrugator / procerus"),
      aliquotNote: T(
        "לרוב 4–6 נקודות; ~4 יח׳/נקודה (Botox-label class) — המר מותג לפי IFU",
        "غالباً 4–6 نقاط؛ ~4 وحدات/نقطة — تحويل العلامة وفق النشرة",
        "Often 4–6 points; ~4 U/point (onabotulinumtoxinA-class) — convert brands per IFU",
      ),
    },
    technique: T("Standard 5-point glabella map", "خريطة 5 نقاط", "Standard 5-point glabella map"),
    education: {
      he: ["שמור מרווח מ־frontalis כדי למנוע brow ptosis", "יחידות אינן חופפות בין מותגים"],
      ar: ["أبقِ مسافة عن الجبهة لتجنب تدلي الحاجب", "الوحدات غير متكافئة بين العلامات"],
      en: ["Respect frontalis margin to avoid brow ptosis", "Units are not interchangeable across brands"],
    },
    effect: "smooth",
    previewIntensity: 45,
  },
  {
    id: "toxin-forehead",
    family: "toxin-aesthetic",
    zoneIds: ["forehead"],
    title: T("בוטוקס מצח (frontalis)", "بوتوكس الجبهة", "Botox — forehead"),
    subtitle: T("קמטי אופק במצח", "تجاعيد أفقية", "Horizontal forehead lines"),
    categoryLabel: T("בוטוקס · קמטים", "بوتوكس · تجاعيد", "Botox · wrinkles"),
    image: asset("stitch/clinical/extreme.png"),
    material: {
      id: "botox",
      name: T("Botulinum toxin A", "ذيفان البوتولينوم A", "Botulinum toxin A"),
      brandExample: "Brand-specific unit conversion required",
      rheology: T("תוך־שרירי — frontalis", "داخل العضل — الجبهة", "IM — frontalis"),
    },
    dosing: {
      unit: "units",
      typicalTotal: 12,
      rangeMin: 6,
      rangeMax: 20,
      perZoneDefault: 12,
      sitesTypical: 4,
      plane: T("תוך־שרירי שטחי יחסית", "داخل العضل السطحي نسبياً", "Relatively superficial IM"),
      aliquotNote: T(
        "לרוב 2–4 יח׳/נקודה × 4–6 נקודות; הימנע ממינון יתר תחתון",
        "غالباً 2–4 وحدات/نقطة × 4–6 نقاط",
        "Often 2–4 U/point × 4–6 points; avoid excess in lower forehead",
      ),
    },
    technique: T("Grid with brow-safety margin", "شبكة مع هامش سلامة الحاجب", "Grid with brow-safety margin"),
    education: {
      he: ["שילוב עם גלאבלה דורש איזון", "נשים/מצח קצר — מינון שמרני יותר"],
      ar: ["الدمج مع الجبينة يحتاج توازناً", "النساء/جبهة قصيرة — جرعة أكثر تحفظاً"],
      en: ["Combine with glabella carefully", "Short forehead / female — more conservative"],
    },
    effect: "smooth",
    previewIntensity: 40,
  },
  {
    id: "toxin-crows",
    family: "toxin-aesthetic",
    zoneIds: ["periocular-l", "periocular-r"],
    title: T("בוטוקס עין עורב", "بوتوكس أقدام الغراب", "Botox — crow's feet"),
    subtitle: T("Orbicularis oculi lateral", "العضلة الدائرية الجانبية", "Lateral orbicularis oculi"),
    categoryLabel: T("בוטוקס · קמטים", "بوتوكس · تجاعيد", "Botox · wrinkles"),
    image: STITCH.periocular,
    material: {
      id: "botox",
      name: T("Botulinum toxin A", "ذيفان البوتولينوم A", "Botulinum toxin A"),
      brandExample: "Brand-specific units",
      rheology: T("תוך־שרירי שטחי", "داخل العضل السطحي", "Superficial IM"),
    },
    dosing: {
      unit: "units",
      typicalTotal: 18,
      rangeMin: 8,
      rangeMax: 30,
      perZoneDefault: 9,
      sitesTypical: 6,
      plane: T("שטחי לטרלי לעין", "سطحي جانبي للعين", "Superficial lateral to eye"),
      aliquotNote: T(
        "~3–5 יח׳/נקודה × 3 נקודות לצד (סה״כ ~12–24 יח׳ דו־צדדי)",
        "~3–5 وحدات/نقطة × 3 نقاط/جانب",
        "~3–5 U/point × 3 points/side (≈12–24 U bilateral)",
      ),
    },
    technique: T("3-point lateral canthal pattern", "نمط 3 نقاط جانبي", "3-point lateral canthal pattern"),
    education: {
      he: ["שמור מרחק מ־orbital rim", "הימנע מהזרקה מדיאלית מדי"],
      ar: ["أبقِ مسافة عن الحافة الحجاجية", "تجنب الحقن الإنسي المفرط"],
      en: ["Stay off orbital rim", "Avoid overly medial injections"],
    },
    effect: "smooth",
    previewIntensity: 42,
  },
  {
    id: "toxin-masseter-slim",
    family: "toxin-aesthetic",
    zoneIds: ["masseter-l", "masseter-r"],
    title: T("בוטוקס מסהטר — עיצוב לסת", "بوتوكس الماضغة — نحت الفك", "Masseter Botox — jaw slim"),
    subtitle: T("הקטנת היפרטרופיה אסתטית", "تقليل التضخم التجميلي", "Aesthetic hypertrophy reduction"),
    categoryLabel: T("בוטוקס · עיצוב", "بوتوكس · نحت", "Botox · contour"),
    image: STITCH.side[0],
    material: {
      id: "botox",
      name: T("Botulinum toxin A", "ذيفان البوتولينوم A", "Botulinum toxin A"),
      brandExample: "Higher unit loads — brand conversion critical",
      rheology: T("תוך־שרירי עמוק — masseter", "داخل العضل العميق", "Deep IM — masseter"),
    },
    dosing: {
      unit: "units",
      typicalTotal: 50,
      rangeMin: 24,
      rangeMax: 80,
      perZoneDefault: 25,
      sitesTypical: 6,
      plane: T("שליש תחתון של masseter", "الثلث السفلي للماضغة", "Lower third of masseter"),
      aliquotNote: T(
        "לרוב 20–40 יח׳/צד (onabotulinumtoxinA-class); 3 נקודות/צד",
        "غالباً 20–40 وحدة/جانب؛ 3 نقاط/جانب",
        "Often 20–40 U/side (onabotulinumtoxinA-class); 3 points/side",
      ),
    },
    technique: T("3-point masseter map", "خريطة 3 نقاط للماضغة", "3-point masseter map"),
    education: {
      he: ["שקול גם התוויה טיפולית (TMJ/ברוקסיזם)", "תוצאה מלאה ~6–8 שבועות"],
      ar: ["فكّر أيضاً بالاستطباب العلاجي", "نتيجة كاملة ~6–8 أسابيع"],
      en: ["May overlap therapeutic TMJ/bruxism indication", "Full effect ~6–8 weeks"],
    },
    effect: "contour",
    previewIntensity: 44,
  },

  // ——— THERAPEUTIC BOTULINUM ———
  {
    id: "toxin-tmj",
    family: "toxin-therapeutic",
    zoneIds: ["masseter-l", "masseter-r", "tmj-l", "tmj-r"],
    title: T("בוטוקס טיפולי — כאבי TMJ / ברוקסיזם", "بوتوكس علاجي — ألم المفصل / صرير", "Therapeutic Botox — TMJ / bruxism"),
    subtitle: T("הפחתת עומס שרירי לעיסה", "تقليل حمل عضلات المضغ", "Reduce masticatory muscle load"),
    categoryLabel: T("בוטוקס טיפולי", "بوتوكس علاجي", "Therapeutic botox"),
    image: STITCH.injection,
    material: {
      id: "botox",
      name: T("Botulinum toxin A — טיפולי", "ذيفان بوتولينوم — علاجي", "Botulinum toxin A — therapeutic"),
      brandExample: "Per neurology/OMFS protocol + IFU",
      rheology: T("תוך־שרירי — masseter ± temporalis", "داخل العضل", "IM — masseter ± temporalis"),
    },
    dosing: {
      unit: "units",
      typicalTotal: 60,
      rangeMin: 30,
      rangeMax: 100,
      perZoneDefault: 25,
      sitesTypical: 6,
      plane: T("masseter עמוק; שקול temporalis לפי ממצאים", "ماضغة عميقة ± صدغية", "Deep masseter; ± temporalis by findings"),
      aliquotNote: T(
        "Masseter: לעיתים 25–40 יח׳/צד; Temporalis: 10–20 יח׳/צד לפי פרוטוקול — לא כלל אצבע",
        "الماضغة: غالباً 25–40 وحدة/جانب؛ الصدغية 10–20 حسب البروتوكول",
        "Masseter: often 25–40 U/side; temporalis 10–20 U/side per protocol — not a rule of thumb",
      ),
    },
    technique: T("Therapeutic masseter ± temporalis map", "خريطة علاجية", "Therapeutic masseter ± temporalis map"),
    education: {
      he: [
        "הערך נעילת לסת, כאב לילי, שחיקת שיניים",
        "שלב עם סד לילה / פיזיותרפיה לפי הצורך",
        "יחידות גבוהות יותר מאסתטיקה — תעד התוויה רפואית",
      ],
      ar: [
        "قيّم صرير الليل وألم المفصل",
        "ادمج مع جبيرة ليلية / علاج طبيعي عند الحاجة",
        "جرعات أعلى من التجميل — وثّق الاستطباب الطبي",
      ],
      en: [
        "Assess locking, nocturnal pain, tooth wear",
        "Combine with night guard / PT as indicated",
        "Often higher units than aesthetic — document medical indication",
      ],
    },
    effect: "contour",
    previewIntensity: 35,
  },
  {
    id: "toxin-hyperhidrosis-axilla",
    family: "toxin-therapeutic",
    zoneIds: ["axilla-l", "axilla-r"],
    title: T("בוטוקס — הזעת יתר בית שחי", "بوتوكس — فرط تعرق الإبط", "Botox — axillary hyperhidrosis"),
    subtitle: T("חסימת בלוטות זיעה אקסילריות", "حصر الغدد العرقية", "Block axillary sweat glands"),
    categoryLabel: T("בוטוקס טיפולי", "بوتوكس علاجي", "Therapeutic botox"),
    image: STITCH.treatment,
    material: {
      id: "botox",
      name: T("Botulinum toxin A — hyperhidrosis", "ذيفان — فرط التعرق", "Botulinum toxin A — hyperhidrosis"),
      brandExample: "Approved hyperhidrosis labels vary by brand/region",
      rheology: T("תוך־עורי רשת", "داخل الأدمة — شبكة", "Intradermal grid"),
    },
    dosing: {
      unit: "units",
      typicalTotal: 100,
      rangeMin: 50,
      rangeMax: 100,
      perZoneDefault: 50,
      sitesTypical: 20,
      plane: T("תוך־עורי — רשת על שדה הזעה", "داخل الأدمة على حقل التعرق", "Intradermal — grid over sweat field"),
      aliquotNote: T(
        "לרוב ~50 יח׳/בית שחי (onabotulinumtoxinA-class) מחולקות ל־10–20 נקודות",
        "غالباً ~50 وحدة/إبط موزعة على 10–20 نقطة",
        "Often ~50 U/axilla (onabotulinumtoxinA-class) across 10–20 points",
      ),
    },
    technique: T("Minor starch-iodine map + intradermal grid", "تخطيط اليود + شبكة", "Starch-iodine map + intradermal grid"),
    education: {
      he: ["בדיקת Minor למיפוי שדה", "משך השפעה לרוב 4–9 חודשים", "לא הזרקה לפנים — אזור גוף"],
      ar: ["اختبار Minor لرسم الحقل", "التأثير غالباً 4–9 أشهر", "ليس للوجه — منطقة جسم"],
      en: ["Minor test to map field", "Effect often 4–9 months", "Body site — not facial"],
    },
    effect: "smooth",
    previewIntensity: 20,
  },
  {
    id: "toxin-hyperhidrosis-palms",
    family: "toxin-therapeutic",
    zoneIds: ["palm-l", "palm-r"],
    title: T("בוטוקס — הזעת יתר כפות ידיים", "بوتوكس — فرط تعرق الراحتين", "Botox — palmar hyperhidrosis"),
    subtitle: T("הפחתת הזעה פלמרית", "تقليل تعرق الراحة", "Reduce palmar sweating"),
    categoryLabel: T("בוטוקס טיפולי", "بوتوكس علاجي", "Therapeutic botox"),
    image: STITCH.treatment,
    material: {
      id: "botox",
      name: T("Botulinum toxin A — palmar HH", "ذيفان — راحة اليد", "Botulinum toxin A — palmar HH"),
      brandExample: "Regional approval / pain management plan required",
      rheology: T("תוך־עורי פלמרי", "داخل أدمة الراحة", "Palmar intradermal"),
    },
    dosing: {
      unit: "units",
      typicalTotal: 100,
      rangeMin: 50,
      rangeMax: 150,
      perZoneDefault: 50,
      sitesTypical: 30,
      plane: T("תוך־עורי — כף יד", "داخل الأدمة — الراحة", "Intradermal — palm"),
      aliquotNote: T(
        "לרוב 40–60 יח׳/כף (משתנה); הרדמה/שיכוך כאב חשובים",
        "غالباً 40–60 وحدة/راحة؛ التخدير مهم",
        "Often 40–60 U/palm (variable); anesthesia / analgesia important",
      ),
    },
    technique: T("Dense palmar grid", "شبكة كثيفة للراحة", "Dense palmar grid"),
    education: {
      he: ["כאב הזרקה גבוה — תכנון הרדמה", "סיכון לחולשת אחיזה זמנית"],
      ar: ["ألم الحقن مرتفع — خطط للتخدير", "خطر ضعف قبضة مؤقت"],
      en: ["Injection pain high — plan anesthesia", "Transient grip weakness risk"],
    },
    effect: "smooth",
    previewIntensity: 15,
  },
  {
    id: "toxin-migraine",
    family: "toxin-therapeutic",
    zoneIds: ["migraine", "forehead", "glabella", "temple-l", "temple-r"],
    title: T("בוטוקס טיפולי — מיגרנה כרונית", "بوتوكس علاجي — الشقيقة المزمنة", "Therapeutic Botox — chronic migraine"),
    subtitle: T("פרוטוקול PREEMPT-style (חינוכי)", "بروتوكول PREEMPT تعليمي", "PREEMPT-style protocol (educational)"),
    categoryLabel: T("בוטוקס טיפולי", "بوتوكس علاجي", "Therapeutic botox"),
    image: STITCH.profile,
    material: {
      id: "botox",
      name: T("Botulinum toxin A — migraine", "ذيفان — الشقيقة", "Botulinum toxin A — migraine"),
      brandExample: "OnabotulinumtoxinA migraine label where approved",
      rheology: T("מפת נקודות ראש/צוואר", "خريطة الرأس/العنق", "Head/neck point map"),
    },
    dosing: {
      unit: "units",
      typicalTotal: 155,
      rangeMin: 155,
      rangeMax: 195,
      perZoneDefault: 25,
      sitesTypical: 31,
      plane: T("לפי מפת PREEMPT (שרירים מוגדרים)", "وفق خريطة PREEMPT", "Per PREEMPT muscle map"),
      aliquotNote: T(
        "פרוטוקול קלאסי: 155 יח׳ / 31 אתרים (5 יח׳/אתר); עד 195 עם אתרים נוספים — לפי התוויה מאושרת",
        "البروتوكول الكلاسيكي: 155 وحدة / 31 موقعاً",
        "Classic protocol: 155 U / 31 sites (5 U/site); up to 195 with optional sites — per approved indication",
      ),
    },
    technique: T("Fixed-site PREEMPT mapping", "تخطيط PREEMPT ثابت", "Fixed-site PREEMPT mapping"),
    education: {
      he: ["רק למיגרנה כרונית לפי קריטריונים", "דורש הכשרה נוירולוגית/כאב", "לא ״בוטוקס יופי״ רגיל"],
      ar: ["للشقيقة المزمنة وفق المعايير فقط", "يتطلب تدريباً عصبياً/ألم", "ليس بوتوكس تجميل عادي"],
      en: ["Chronic migraine criteria only", "Requires headache/neuro training", "Not routine aesthetic botox"],
    },
    effect: "smooth",
    previewIntensity: 25,
  },
  {
    id: "toxin-cervical-dystonia",
    family: "toxin-therapeutic",
    zoneIds: ["neck"],
    title: T("בוטוקס טיפולי — דיסטוניה צווארית", "بوتوكس علاجي — خلل التوتر الرقبي", "Therapeutic Botox — cervical dystonia"),
    subtitle: T("התאמת שרירים צוואריים", "ضبط عضلات الرقبة", "Cervical muscle pattern dosing"),
    categoryLabel: T("בוטוקס טיפולי", "بوتوكس علاجي", "Therapeutic botox"),
    image: STITCH.side[1],
    material: {
      id: "botox",
      name: T("Botulinum toxin A — CD", "ذيفان — خلل التوتر", "Botulinum toxin A — CD"),
      brandExample: "Specialty neurology dosing",
      rheology: T("תוך־שרירי צוואר", "داخل عضلات الرقبة", "Cervical IM"),
    },
    dosing: {
      unit: "units",
      typicalTotal: 120,
      rangeMin: 80,
      rangeMax: 250,
      perZoneDefault: 120,
      sitesTypical: 8,
      plane: T("לפי דפוס דיסטוניה (EMG מודרך לעיתים)", "حسب نمط الخلل (أحياناً EMG)", "Per dystonia pattern (often EMG-guided)"),
      aliquotNote: T(
        "מינון אישי רחב (עשרות–מאות יח׳) לפי שרירים מעורבים — רק מומחה",
        "جرعة فردية واسعة حسب العضلات — للمتخصص فقط",
        "Highly individualized (tens–hundreds of U) by involved muscles — specialist only",
      ),
    },
    technique: T("Pattern-based cervical injection", "حقن رقبي حسب النمط", "Pattern-based cervical injection"),
    education: {
      he: ["לא לביצוע ללא הכשרה ייעודית", "סיכון לדיספגיה / חולשת צוואר"],
      ar: ["لا يُنفَّذ دون تدريب مخصص", "خطر عسر البلع / ضعف الرقبة"],
      en: ["Do not perform without dedicated training", "Dysphagia / neck weakness risk"],
    },
    effect: "smooth",
    previewIntensity: 18,
  },
];

export const TREATMENT_FAMILIES: {
  id: TreatmentFamily | "all";
  label: Record<Locale, string>;
}[] = [
  { id: "all", label: T("הכל", "الكل", "All") },
  { id: "filler", label: T("פילר / מילוי", "فيلر / ملء", "Filler") },
  { id: "toxin-aesthetic", label: T("בוטוקס אסתטי", "بوتوكس تجميلي", "Aesthetic botox") },
  { id: "toxin-therapeutic", label: T("בוטוקס טיפולי", "بوتوكس علاجي", "Therapeutic botox") },
  { id: "biostim", label: T("מיצוק / ביוסטימ", "شد / محفز", "Firming / biostim") },
];

export function treatmentsByFamily(family: TreatmentFamily | "all") {
  if (family === "all") return CLINICAL_TREATMENTS;
  return CLINICAL_TREATMENTS.filter((t) => t.family === family);
}

export function getTreatment(id: string) {
  return CLINICAL_TREATMENTS.find((t) => t.id === id);
}
