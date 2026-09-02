import type { GlobalCitation } from "../types";

const C = (
  he: string,
  ar: string,
  en: string,
): { he: string; ar: string; en: string } => ({ he, ar, en });

/**
 * Global aesthetic medicine protocol & evidence registry.
 * Educational references — verify current edition + local regulation.
 */
export const GLOBAL_CITATIONS: GlobalCitation[] = [
  {
    id: "ace-vo-2023",
    type: "consensus",
    issuer: "Aesthetic Complications Expert (ACE) Group",
    year: 2023,
    title: C(
      "ACE — ניהול חסימה וסקולרית לאחר מילוי HA",
      "ACE — إدارة انسداد وعائي بعد HA",
      "ACE — HA filler vascular occlusion management",
    ),
    summary: C(
      "קונсенסוס עולמי: זיהוי מוקדם (כאב, הלבנה, livedo), היאלורונידאז מיידי, נитroglycerin/topical, הסלמה — מקור מרכזי לחירום filler.",
      "إجماع عالمي: التعرف المبكر، هيالورونيداز فوري، تصعيد — مرجع طوارئ الفيلر.",
      "Global consensus: early recognition, immediate hyaluronidase, escalation — core filler emergency reference.",
    ),
    url: "https://www.aestheticcomplications.com/",
    tags: ["emergency", "vascular-occlusion", "hyaluronidase", "filler"],
  },
  {
    id: "ace-hylenex-protocol",
    type: "guideline",
    issuer: "ACE Group / Aesthetic Complications",
    year: 2020,
    title: C(
      "פרוטוקול היאלורונידאז — ACE",
      "بروتوكول هيالورونيداز — ACE",
      "Hyaluronidase protocol — ACE",
    ),
    summary: C(
      "150–600 U hyaluronidase לאזור; חזרה q15–60min; תיעוד; לא מפעיל על CaHA/PLLA/PCL.",
      "150–600 وحدة؛ إعادة كل 15–60 دقيقة؛ لا يذيب CaHA/PLLA.",
      "150–600 U per area; repeat q15–60min; does not dissolve CaHA/PLLA/PCL.",
    ),
    tags: ["emergency", "hyaluronidase"],
  },
  {
    id: "preempt-migraine",
    type: "trial",
    issuer: "Allergan / PREEMPT trial",
    year: 2010,
    title: C(
      "PREEMPT — בוטוקס למיגרנה כרונית (155 U / 31 אתרים)",
      "PREEMPT — بوتوكس للشقيقة المزمنة",
      "PREEMPT — Botox for chronic migraine (155 U / 31 sites)",
    ),
    summary: C(
      "פרוטוקול מוכח: 155 יחידות onabotulinumtoxinA, 31 אתרי PREEMPT, כל 12 שבועות — התוויה רפואית, לא אסתטיקה.",
      "155 وحدة، 31 موقع PREEMPT — استطباب طبي.",
      "155 onabotulinumtoxinA units, 31 PREEMPT sites q12 weeks — medical indication.",
    ),
    doi: "10.1111/j.1526-4610.2010.01674.x",
    tags: ["toxin-therapeutic", "migraine", "botox"],
  },
  {
    id: "asaps-safety",
    type: "society",
    issuer: "ASAPS (American Society for Aesthetic Plastic Surgery)",
    title: C(
      "ASAPS — הנחיות בטיחות לטיפולים אסתטיים",
      "ASAPS — إرشادات السلامة",
      "ASAPS — aesthetic treatment safety guidelines",
    ),
    summary: C(
      "מסגרת בטיחות: הכשרה, חדר מתאים, חירום, תיעוד, הסכמה מדעת — לכל הזרקות ופרוצדורות.",
      "إطار السلامة: تدريب، طوارئ، موافقة — لجميع الحقن.",
      "Safety framework: training, emergency kit, informed consent — all injectables.",
    ),
    url: "https://www.surgery.org/",
    tags: ["safety", "general"],
  },
  {
    id: "isaps-guidelines",
    type: "society",
    issuer: "ISAPS (International Society of Aesthetic Plastic Surgery)",
    title: C(
      "ISAPS — סטנדרטים בינלאומיים לרפואה אסתטית",
      "ISAPS — معايير دولية",
      "ISAPS — international aesthetic medicine standards",
    ),
    summary: C(
      "סטנדרטים גלובליים: רופא מוסמך, מוצר מאושר, מניעת סיבוכים, הפניה כירurgית כשצריך.",
      "معايير عالمية: طبيب مرخص، منتج معتمد.",
      "Global standards: licensed physician, approved products, complication prevention.",
    ),
    url: "https://www.isaps.org/",
    tags: ["safety", "general"],
  },
  {
    id: "md-codes",
    type: "training",
    issuer: "Allergan Aesthetics / Galderma (MD Codes / FACE)",
    title: C(
      "MD Codes / FACE — מיפוי אנטומי גלובלי להזרקות",
      "MD Codes / FACE — التخطيط التشريحي",
      "MD Codes / FACE — global anatomic injection mapping",
    ),
    summary: C(
      "מערכת הדרכה עולמית: נקודות אנטומיות, וקטורים, שכבות — בסיס לפרוטוקולי midface, jaw, lips.",
      "نظام تدريب عالمي: نقاط تشريحية، متجهات.",
      "Global training system: anatomic points, vectors, planes — midface/jaw/lips basis.",
    ),
    tags: ["technique", "midface", "lips", "jawline"],
  },
  {
    id: "galderma-gain",
    type: "training",
    issuer: "Galderma",
    title: C(
      "GAIN — Galderma Injection Academy Network",
      "GAIN — أكاديمية حقن Galderma",
      "GAIN — Galderma Injection Academy Network",
    ),
    summary: C(
      "פרוטוקולי Restylane/Sculptra/Dysport: שכבות, rheology, סדר טיפולים — הכשרה מומלצת.",
      "بروتوكولات Restylane/Sculptra/Dysport.",
      "Restylane/Sculptra/Dysport protocols: planes, rheology, staging.",
    ),
    tags: ["restylane", "sculptra", "dysport", "training"],
  },
  {
    id: "tyndall-consensus",
    type: "consensus",
    issuer: "Aesthetic Medicine literature consensus",
    year: 2018,
    title: C(
      "Tyndall effect — זיהוי וטיפול",
      "تأثير Tyndall — التعرف والعلاج",
      "Tyndall effect — recognition & management",
    ),
    summary: C(
      "הזרקה שטחית מדי → גוון כחלחל; טיפול: hyaluronidase ממוקד, massage, המתנה; מניעה: עומק נכון.",
      "حقن سطحي → لون مزرق؛ علاج: هيالورونيداز.",
      "Superficial HA → bluish hue; treat with targeted hyaluronidase; prevent with correct plane.",
    ),
    tags: ["complication", "filler"],
  },
  {
    id: "combined-treatment-timing",
    type: "consensus",
    issuer: "Multi-society aesthetic consensus",
    title: C(
      "תזמון שילוב טיפולים (toxin + filler + peel + device)",
      "توقيت دمج العلاجات",
      "Combined treatment timing (toxin + filler + peel + device)",
    ),
    summary: C(
      "כלל מקובל: toxin לפני filler ב-2 שבועות; peel/laser לפני filler — המתנה 2–4 שבועות; threads — רווח מ-filler עמוק.",
      "توكسين قبل الفيلر بأسبوعين؛ تقشير/ليزر — انتظار 2–4 أسابيع.",
      "Common: toxin 2 weeks before filler; peel/laser wait 2–4 weeks before filler; thread spacing from deep filler.",
    ),
    tags: ["combinations", "general"],
  },
  {
    id: "profhilo-bap",
    type: "ifu",
    issuer: "IBSA / Profhilo",
    title: C(
      "Profhilo BAP — Bio Aesthetic Points (10-point face / 5-point neck)",
      "Profhilo BAP — نقاط Bio Aesthetic",
      "Profhilo BAP — Bio Aesthetic Points protocol",
    ),
    summary: C(
      "2 ml Profhilo; 10 נקודות פנים / 5 צוואר; 2 מפגשים ~4 שבועות — bio-remodeling, לא volumizer.",
      "2 مل؛ 10 نقاط وجه؛ جلستان.",
      "2 ml; 10 face / 5 neck points; 2 sessions ~4 weeks apart — bio-remodeling not volumizing.",
    ),
    tags: ["profhilo", "skin-quality"],
  },
  {
    id: "sculptra-dilution",
    type: "ifu",
    issuer: "Galderma / Sculptra",
    title: C(
      "Sculptra — הכנה, dilution, massage",
      "Sculptra — التحضير والتخفيف",
      "Sculptra — reconstitution, dilution, massage",
    ),
    summary: C(
      "8–12 ml מים סטריליים לבקבוק; המתנה; microdepot subdermal; massage 5-5-5 post-treatment.",
      "8–12 مل ماء؛ تدليك 5-5-5.",
      "8–12 ml SWFI per vial; subdermal microdepots; 5-5-5 massage protocol.",
    ),
    tags: ["sculptra", "biostim"],
  },
  {
    id: "kybella-fda",
    type: "ifu",
    issuer: "Allergan / FDA label — Kybella (deoxycholic acid)",
    title: C(
      "Kybella — חומצה דיאוקסיכולית submental",
      "Kybella — حمض الديوoksycholic",
      "Kybella — deoxycholic acid submental fat",
    ),
    summary: C(
      "0.2 ml/injection, ≤50 injections/session, ≤6 sessions q≥1 month — submental fat reduction.",
      "0.2 مل/حقنة؛ حتى 6 جلسات.",
      "0.2 ml/injection, max 50 points/session, up to 6 sessions — submental contour.",
    ),
    tags: ["lipolytics", "body", "chin"],
  },
  {
    id: "pdo-thread-consensus",
    type: "consensus",
    issuer: "International thread lift literature / IMCAS",
    title: C(
      "PDO / PLLA threads — וקטורים, עומק, סיבוכים",
      "خيوط PDO / PLLA — المتجهات والمضاعفات",
      "PDO / PLLA threads — vectors, depth, complications",
    ),
    summary: C(
      "SASP / UASP / OASP vectors; SVM layer; סיבוכים: asymmetry, thread exposure, nerve — הכשרה חובה.",
      "متجهات SASP/UASP؛ طبقة SVM؛ مضاعفات.",
      "SASP/UASP/OASP vectors; SVM plane; complications: asymmetry, exposure — training mandatory.",
    ),
    tags: ["threads"],
  },
  {
    id: "peel-depth-brooks",
    type: "guideline",
    issuer: "Brooks / peel classification literature",
    title: C(
      "סיווג עומק פiling — superficial / medium / deep",
      "تصنيف عمق التقشير",
      "Peel depth classification — superficial / medium / deep",
    ),
    summary: C(
      "Superficial: AHA/BHA; Medium: TCA 10–35%; Deep: phenol — Fitzpatrick & downtime critical.",
      "سطحي/متوسط/عميق — Fitzpatrick حاسم.",
      "Superficial AHA/BHA; medium TCA; deep phenol — Fitzpatrick typing & downtime critical.",
    ),
    tags: ["peels"],
  },
  {
    id: "hair-meso-consensus",
    type: "consensus",
    issuer: "Hair restoration aesthetic consensus",
    title: C(
      "Mesotherapy / PRP / exosomes — נשירה אנדrogenetic",
      "Mesotherapy / PRP / exosomes — تساقط الشعر",
      "Mesotherapy / PRP / exosomes — androgenetic alopecia",
    ),
    summary: C(
      "PRP: 3–4 sessions q4–6 weeks; meso: minoxidil/peptides/PN; exosomes — evidence evolving; adjuvant to transplant.",
      "PRP: 3–4 جلسات؛ exosomes — أدلة متطورة.",
      "PRP 3–4 sessions q4–6 weeks; meso cocktails; exosomes evidence evolving.",
    ),
    tags: ["hair"],
  },
  {
    id: "hyperhidrosis-botox",
    type: "ifu",
    issuer: "Multiple toxin IFUs (Botox/Dysport)",
    title: C(
      "הזעת יתר — פרוטוקול תוך־עורי (axilla ~50 U Botox-class)",
      "فرط التعرق — بروتوكول داخل الأدمة",
      "Hyperhidrosis — intradermal protocol (axilla ~50 U Botox-class)",
    ),
    summary: C(
      "Minor starch-iodine map; grid intradermal; duration 4–9 months; palmar pain management.",
      "اختبار Minor؛ شبكة داخل الأدمة.",
      "Minor test mapping; intradermal grid; 4–9 month effect.",
    ),
    tags: ["toxin-therapeutic", "body"],
  },
  {
    id: "tmj-botox-consensus",
    type: "consensus",
    issuer: "OMFS / pain medicine literature",
    title: C(
      "TMJ / bruxism — botulinum masseter ± temporalis",
      "TMJ / صرير — بوتولينوم ماضغة",
      "TMJ / bruxism — masseter ± temporalis botulinum",
    ),
    summary: C(
      "25–40 U/side masseter (ona-class); assess dental/occlusal; night guard adjunct.",
      "25–40 وحدة/جانب؛ جبيرة ليلية.",
      "25–40 U/side masseter; dental assessment; night guard adjunct.",
    ),
    tags: ["toxin-therapeutic", "tmj"],
  },
  {
    id: "ellanse-protocol",
    type: "ifu",
    issuer: "Sinclair / Ellansé",
    title: C(
      "Ellansé — S/M/L/E+ duration grades",
      "Ellansé — درجات المدة S/M/L/E+",
      "Ellansé — S/M/L/E+ duration grades",
    ),
    summary: C(
      "PCL microspheres; duration set at syringe prep; 1–2 syringes/session; no enzyme reversal.",
      "PCL؛ المدة عند التحضير؛ لا إنزيم.",
      "PCL microspheres; duration at preparation; no enzymatic reversal.",
    ),
    tags: ["ellanse", "biostim"],
  },
  {
    id: "rejuran-protocol",
    type: "ifu",
    issuer: "PharmaResearch / Rejuran",
    title: C(
      "Rejuran PN — Healer / I / S / HB protocols",
      "Rejuran PN — بروتوكولات Healer/I/S/HB",
      "Rejuran PN — Healer / I / S / HB protocols",
    ),
    summary: C(
      "0.2–0.5 ml per point; 2–4 sessions; periorbital uses Rejuran I; skin quality Healer.",
      "0.2–0.5 مل/نقطة؛ 2–4 جلسات.",
      "0.2–0.5 ml/point; 2–4 sessions; variant by depth/indication.",
    ),
    tags: ["pn", "rejuran"],
  },
  {
    id: "hifu-safety",
    type: "guideline",
    issuer: "Energy device safety literature / manufacturer IFU",
    title: C(
      "HIFU / RF / laser — Fitzpatrick, cooling, burns",
      "HIFU / RF / laser — Fitzpatrick والحروق",
      "HIFU / RF / laser — Fitzpatrick, cooling, burn prevention",
    ),
    summary: C(
      "Type IV–VI: lower settings; test patch; eye shields; know endpoint (bronze micro-crust vs burn).",
      "Fitzpatrick IV–VI: إعدادات أقل.",
      "Fitzpatrick IV–VI: reduced settings; test patch; endpoint recognition.",
    ),
    tags: ["devices"],
  },
  {
    id: "imcas-filler-complications",
    type: "consensus",
    issuer: "IMCAS / aesthetic complications faculty",
    title: C(
      "IMCAS — סיבוכי filler: granuloma, biofilm, migration",
      "IMCAS — مضاعفات الفيلر",
      "IMCAS — filler complications: granuloma, biofilm, migration",
    ),
    summary: C(
      "Delayed nodules: culture vs steroid vs hyaluronidase vs surgical; biofilm suspicion → antibiotics protocol.",
      "عقد متأخرة: مضاد حيوي/ستيرoid/جراحة.",
      "Delayed nodules: rule biofilm; antibiotics/steroid/hyaluronidase/surgical pathway.",
    ),
    tags: ["complication", "filler"],
  },
  {
    id: "toxin-unit-conversion",
    type: "guideline",
    issuer: "Manufacturer IFUs — NOT interchangeable",
    title: C(
      "המרת יחידות טוקסין — אין 1:1 בין מותגים",
      "تحويل وحدات التوكسين — لا 1:1",
      "Toxin unit conversion — NOT 1:1 across brands",
    ),
    summary: C(
      "Botox : Dysport often ~1:2.5 glabella; Xeomin/Jeuveau/Daxxify/Letybo — IFU tables only.",
      "Botox : Dysport ~1:2.5؛ كل علامة لها جدول.",
      "Botox:Dysport ~1:2.5 glabella class; each brand has own IFU table.",
    ),
    tags: ["toxin", "general"],
  },
  {
    id: "male-aesthetics-consensus",
    type: "consensus",
    issuer: "Global aesthetic medicine consensus",
    title: C(
      "אסתטיקה גברית — מינון שמרני, קונטור jaw/chin",
      "تجميل الرجال — جرعات محافظة",
      "Male aesthetics — conservative dosing, jaw/chin contour",
    ),
    summary: C(
      "מצch: שמור arch; toxin: פחות units; filler: projection jaw/chin; avoid over-lip.",
      "جبهة: حافظ على القوس؛ فك/ذقن.",
      "Forehead: preserve brow arch; less toxin; jaw/chin projection focus.",
    ),
    tags: ["general", "jawline"],
  },
];

export function getCitation(id: string) {
  return GLOBAL_CITATIONS.find((c) => c.id === id);
}

export function citationsForTag(tag: string) {
  return GLOBAL_CITATIONS.filter((c) => c.tags?.includes(tag));
}
