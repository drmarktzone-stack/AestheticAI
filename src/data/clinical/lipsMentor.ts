import { USER_LIPS, asset } from "../../lib/assets";
import { L, type ClinicalMentorGuide } from "./types";

/**
 * Lips clinical mentor pack — trilingual educational draft.
 * Media: physician Bing pack under public/stitch/user/lips.
 * Not a substitute for IFU / physician judgment. Marked unreviewed.
 */
export const lipsMentor: ClinicalMentorGuide = {
  id: "lips-volume-definition",
  regionId: "lips",
  reviewedByPhysician: false,
  title: L(
    "שפתיים — נפח והגדרה",
    "الشفاه — الحجم والتعريف",
    "Lips — volume & definition",
  ),
  subtitle: L(
    "מדריך־מנטור קליני: חומרים, מינון, טכניקת הזרקה, סיבוכים וסימולציה מומחשת",
    "دليل سريري موجِّه: المواد، الجرعة، تقنية الحقن، المضاعفات ومحاكاة مرئية",
    "Clinical mentor guide: materials, dosing, injection technique, complications & visualized simulation",
  ),
  disclaimer: L(
    "טיוטה חינוכית לרופאים מוסמכים בלבד. כל מינון/חומר לפי IFU והשיקול הקליני שלך. לא הבטחת תוצאה.",
    "مسودة تعليمية للأطباء المرخصين فقط. الجرعة والمادة وفق نشرة الشركة وحكمك السريري. ليست ضماناً للنتيجة.",
    "Educational draft for licensed physicians only. Dose/product per IFU and your clinical judgment. Not an outcome guarantee.",
  ),
  protocolName: L(
    "פרוטוקול שפתיים — נפח מדורג",
    "بروتوكول الشفاه — حجم متدرج",
    "Lips protocol — staged volume",
  ),
  goals: {
    he: ["נפח טבעי", "הגדרת vermilion", "סימטריה", "שמירה על תנועה"],
    ar: ["حجم طبيعي", "تعريف الحدود", "تناظر", "الحفاظ على الحركة"],
    en: ["Natural volume", "Vermilion definition", "Symmetry", "Preserve motion"],
  },
  anatomy: {
    he: [
      "עורקי labial עליון/תחתון — מסלולים משתנים; הזרקה איטית ומודעת",
      "גבול vermilion, philtrum columns, oral commissures",
      "שכבות: רירית / שריר / שומן שטחי — התאמת עומק למטרה",
    ],
    ar: [
      "الشرايين الشفوية العلوية/السفلية — مسارات متغيرة؛ حقن بطيء وواعٍ",
      "حدود الـvermilion، أعمدة النثرة، زوايا الفم",
      "الطبقات: مخاطية / عضلة / دهون سطحية — عمق بحسب الهدف",
    ],
    en: [
      "Superior/inferior labial arteries — variable courses; slow, vessel-aware injection",
      "Vermilion border, philtrum columns, oral commissures",
      "Planes: mucosa / muscle / superficial fat — match depth to goal",
    ],
  },
  dangerZones: {
    he: [
      "הזרקה תוך־וסקולרית → איסכמיה / כאב / הלבנה",
      "עודף נפח בגבול → עיוות תנועה ו״נקניקיות״",
      "הרפס — סיכון התלקחות; ייעוץ מניעתי לפי מדיניות",
    ],
    ar: [
      "حقن داخل وعائي → نقص تروية / ألم / شحوب",
      "فرط الحجم على الحدود → تشوه الحركة",
      "الهربس — خطر إعادة التفعيل؛ وقاية حسب السياسة",
    ],
    en: [
      "Intravascular injection → ischemia / pain / blanching",
      "Overfill at border → motion distortion / sausage lip",
      "HSV — reactivation risk; prophylaxis per clinic policy",
    ],
  },
  materials: [
    {
      id: "ha-lips-soft",
      name: L("HA לשפתיים — רך/דינמי", "HA للشفاه — مرن/ديناميكي", "HA for lips — soft/dynamic"),
      role: L(
        "נפח עדין + אינטגרציה בתנועה; מתאים להידרציה והגדרה מתונה",
        "حجم لطيف وتكامل مع الحركة؛ مناسب للترطيب والتعريف المعتدل",
        "Gentle volume with motion integration; hydration and moderate definition",
      ),
      rheology: L("G′ נמוך־בינוני, קוהזיות בינונית (לפי מוצר)", "G′ منخفض-متوسط (حسب المنتج)", "Low–mid G′, mid cohesivity (product-specific)"),
      planes: L("תת־עורי / שומן שטחי", "تحت الجلد / دهون سطحية", "Subdermal / superficial fat"),
      dose: L(
        "תכנון מדורג; לעיתים 0.4–1.0 מ״ל לסשן לפי אנטומיה — לא כלל אצבע",
        "تخطيط متدرج؛ غالباً 0.4–1.0 مل للجلسة حسب التشريح — ليس قاعدة ثابتة",
        "Staged plan; often 0.4–1.0 ml/session by anatomy — not a fixed rule",
      ),
      pearls: {
        he: ["שמור יחס עליונה/תחתונה טבעי", "הסבר נפיחות יום 1–3"],
        ar: ["حافظ على نسبة طبيعية بين الشفتين", "اشرح التورم يوم 1–3"],
        en: ["Keep natural upper/lower ratio", "Counsel Day 1–3 edema"],
      },
      cautions: {
        he: ["IFU מחייב", "הימנע מתיקון יתר חד־פעמי"],
        ar: ["نشرة الشركة ملزمة", "تجنب التصحيح المفرط دفعة واحدة"],
        en: ["IFU is binding", "Avoid single-session overcorrection"],
      },
    },
    {
      id: "ha-lips-structure",
      name: L("HA לשפתיים — מבני/גבול", "HA للشفاه — هيكلي/حدود", "HA for lips — structural/border"),
      role: L(
        "הגדרת קו, תמיכת commissure, תיקון אסימטריה נקודתית",
        "تعريف الخط، دعم زوايا الفم، تصحيح عدم التناظر",
        "Border definition, commissure support, focal asymmetry correction",
      ),
      rheology: L("מעט יותר תמיכה ממוצר דינמי — לפי IFU", "دعم أعلى قليلاً — حسب النشرة", "Slightly more support than dynamic gels — per IFU"),
      planes: L("לאורך vermilion / נקודות מבניות", "على طول الحدود / نقاط هيكلية", "Along vermilion / structural points"),
      dose: L("נפחים קטנים לנקודה; בנה בהדרגה", "حجوم صغيرة لكل نقطة؛ بناء تدريجي", "Small aliquots per point; build gradually"),
      pearls: {
        he: ["גבול חד מדי = מראה לא טבעי", "בדוק תנועת דיבור/חיוך"],
        ar: ["حد حاد جداً = مظهر غير طبيعي", "افحص حركة الكلام/الابتسامة"],
        en: ["Over-sharp border looks unnatural", "Check speech/smile dynamics"],
      },
      cautions: {
        he: ["זהירות וסקולרית גבוהה ליד עורקים שפתיים"],
        ar: ["حذر وعائي مرتفع قرب الشرايين الشفوية"],
        en: ["High vascular vigilance near labial arteries"],
      },
    },
    {
      id: "hyaluronidase",
      name: L("היאלורונידאז (חירום/תיקון)", "هيالورونيداز (طوارئ/تصحيح)", "Hyaluronidase (emergency/correction)"),
      role: L(
        "פירוק HA בחסימה חשודה או תיקון יתר — לפי פרוטוקול חירום",
        "تفكيك HA عند اشتباه انسداد أو فرط التصحيح — وفق بروتوكول الطوارئ",
        "Degrade HA in suspected occlusion or overfill — per emergency protocol",
      ),
      rheology: L("אנזים — לא מילוי", "إنزيم — ليس حشوة", "Enzyme — not a filler"),
      planes: L("לפי פרוטוקול חירום מקומי", "وفق بروتوكول الطوارئ المحلي", "Per local emergency protocol"),
      dose: L("לפי פרוטוקול המרפאה + IFU האנזים", "وفق بروتوكول العيادة + نشرة الإنزيم", "Per clinic protocol + enzyme IFU"),
      pearls: {
        he: ["זהה מוקדם: כאב/הלבנה/livedo", "תעד הכל"],
        ar: ["تعرف مبكراً: ألم/شحوب/livedo", "وثّق كل شيء"],
        en: ["Recognize early: pain/blanching/livedo", "Document everything"],
      },
      cautions: {
        he: ["אל תדחה פינוי/ייעוץ בעין/ראייה"],
        ar: ["لا تؤخر الإحالة عند العين/الرؤية"],
        en: ["Do not delay escalation for eye/vision symptoms"],
      },
    },
  ],
  dosing: [
    {
      id: "body-lower",
      site: L("גוף שפה תחתונה", "جسم الشفة السفلية", "Lower lip body"),
      typical: L(
        "0.35–0.60 מ״ל לסשן (מדורג); אליקוטות 0.05–0.10 מ״ל לנקודה",
        "0.35–0.60 مل للجلسة؛ دفعات 0.05–0.10 مل/نقطة",
        "0.35–0.60 ml/session (staged); aliquots 0.05–0.10 ml/point",
      ),
      plane: L("תת־עורי / intramucosal לפי טכניקה", "تحت الجلد / مخاطي حسب التقنية", "Subdermal / intramucosal per technique"),
      note: L("בנה סימטריה לפני נפח נוסף", "ابنِ التناظر قبل حجم إضافي", "Build symmetry before extra volume"),
    },
    {
      id: "body-upper",
      site: L("גוף שפה עליונה", "جسم الشفة العلوية", "Upper lip body"),
      typical: L(
        "0.20–0.40 מ״ל לסשן; לרוב שמרני יותר מהתחתונה (~יחס 1:1.2–1.6)",
        "0.20–0.40 مل؛ غالباً أقل من السفلية (~نسبة 1:1.2–1.6)",
        "0.20–0.40 ml/session; often more conservative than lower (~ratio 1:1.2–1.6)",
      ),
      plane: L("שטחי־מבוקר", "سطحي مضبوط", "Controlled superficial"),
      note: L("שמור על תנועת דיבור", "حافظ على حركة الكلام", "Preserve speech dynamics"),
    },
    {
      id: "border",
      site: L("גבול vermilion", "حدود الـvermilion", "Vermilion border"),
      typical: L(
        "0.05–0.15 מ״ל לכל צד; מיקרו־אליקוטות 0.02–0.05 מ״ל",
        "0.05–0.15 مل لكل جانب؛ دفعات 0.02–0.05 مل",
        "0.05–0.15 ml per side; micro-aliquots 0.02–0.05 ml",
      ),
      plane: L("לאורך הגבול — זהירות יתר", "على طول الحدود — حذر شديد", "Along border — extreme caution"),
      note: L("הימנע מקו ״נקניק״", "تجنب مظهر السجق", "Avoid sausage border"),
    },
    {
      id: "commissure",
      site: L("קומיסורות", "زوايا الفم", "Oral commissures"),
      typical: L(
        "0.05–0.10 מ״ל לכל קומיסורה",
        "0.05–0.10 مل لكل زاوية",
        "0.05–0.10 ml per commissure",
      ),
      plane: L("לפי אנטומיית המטופל", "حسب تشريح المريض", "Per patient anatomy"),
      note: L("שקול השפעה על חיוך", "راعِ تأثير الابتسامة", "Consider smile vector"),
    },
    {
      id: "session-total",
      site: L("סה״כ סשן שפתיים (טיפוסי)", "مجموع جلسة الشفاه", "Typical lips session total"),
      typical: L(
        "0.5–1.2 מ״ל לסשן ראשון; השלמה במעקב אם נדרש",
        "0.5–1.2 مل للجلسة الأولى؛ إكمال في المتابعة إن لزم",
        "0.5–1.2 ml first session; top-up at follow-up if needed",
      ),
      plane: L("משולב לפי מפה", "مشترك حسب الخريطة", "Combined per map"),
      note: L("לא כלל אצבע — IFU + אנטומיה", "ليس قاعدة ثابتة — النشرة + التشريح", "Not a rule of thumb — IFU + anatomy"),
    },
  ],
  techniques: [
    {
      id: "linear-thread",
      name: L("Linear threading", "الحقن الخطي", "Linear threading"),
      when: L("הגדרת קו / מילוי אורכי מתון", "تعريف الخط / ملء طولي معتدل", "Border definition / moderate longitudinal fill"),
      steps: {
        he: [
          "תכנון נקודות על צילום/מפה",
          "החדרה איטית, שאיפה לפי מדיניות, הזרקה רטרוגרדית מבוקרת",
          "בדיקת סימטריה במנוחה ובתנועה",
        ],
        ar: [
          "تخطيط النقاط على صورة/خريطة",
          "إدخال بطيء وحقن رجوعي مضبوط",
          "فحص التناظر في الراحة والحركة",
        ],
        en: [
          "Map points on photo/diagram",
          "Slow entry; controlled retrograde deposition",
          "Check symmetry at rest and in motion",
        ],
      },
      pitfalls: {
        he: ["עודף לאורך הגבול", "חוסר הערכה דינמית"],
        ar: ["فرط على الحدود", "إهمال التقييم الديناميكي"],
        en: ["Overfill along border", "Skipping dynamic assessment"],
      },
      mediaId: "inj-still",
    },
    {
      id: "bolus-micro",
      name: L("Micro-bolus", "بلعة دقيقة", "Micro-bolus"),
      when: L("נפח ממוקד / תיקון אסימטריה", "حجم موضعي / تصحيح عدم التناظر", "Focal volume / asymmetry correction"),
      steps: {
        he: [
          "בחר נקודה לפי מפה",
          "אליקוטה קטנה, לחץ איטי, הערכה מיידית",
          "עצור מוקדם — השלם במעקב אם צריך",
        ],
        ar: [
          "اختر النقطة حسب الخريطة",
          "دفعة صغيرة وضغط بطيء ثم تقييم فوري",
          "توقف مبكراً — أكمل في المتابعة إن لزم",
        ],
        en: [
          "Select point from map",
          "Small aliquot, slow pressure, immediate assess",
          "Stop early — complete at follow-up if needed",
        ],
      },
      pitfalls: {
        he: ["בולוס גדול מדי", "התעלמות מכאב/הלבנה"],
        ar: ["بلعة كبيرة جداً", "تجاهل الألم/الشحوب"],
        en: ["Oversized bolus", "Ignoring pain/blanching"],
      },
      mediaId: "inj-still",
    },
  ],
  complications: [
    {
      id: "edema",
      name: L("נפיחות מוקדמת / המטומה קלה", "تورم مبكر / كدمة خفيفة", "Early edema / mild ecchymosis"),
      urgency: "moderate",
      signs: {
        he: ["נפיחות 24–72 שעות", "שטף דם מקומי"],
        ar: ["تورم 24–72 ساعة", "كدمة موضعیة"],
        en: ["Swelling 24–72h", "Local bruising"],
      },
      actions: {
        he: ["הסבר צפוי", "קירור לפי פרוטוקול", "מעקב יום 7"],
        ar: ["تثقيف متوقع", "تبريد وفق البروتوكول", "متابعة يوم 7"],
        en: ["Expected-course counseling", "Cooling per protocol", "Day-7 review"],
      },
    },
    {
      id: "occlusion",
      name: L("חשד לחסימה וסקולרית", "اشتباه انسداد وعائي", "Suspected vascular occlusion"),
      urgency: "critical",
      signs: {
        he: ["כאב חריג", "הלבנה / livedo", "שינוי תחושה או צבע מתקדם"],
        ar: ["ألم غير معتاد", "شحوب / livedo", "تغير حس أو لون متقدم"],
        en: ["Disproportionate pain", "Blanching / livedo", "Progressive color/sensation change"],
      },
      actions: {
        he: [
          "עצור הזרקה מייד",
          "הפעל פרוטוקול היאלורונידאז של המרפאה",
          "תעד, נטר, העבר לחירום/מומחה לפי ממצאים (במיוחד עין/ראייה)",
        ],
        ar: [
          "أوقف الحقن فوراً",
          "فعّل بروتوكول الهيالورونيداز",
          "وثّق وراقب وأحل للطوارئ/أخصائي حسب الموجودات (خاصة العين)",
        ],
        en: [
          "Stop injecting immediately",
          "Activate clinic hyaluronidase protocol",
          "Document, monitor, escalate (esp. eye/vision)",
        ],
      },
    },
    {
      id: "overfill",
      name: L("תיקון יתר / עיוות תנועה", "فرط التصحيح / تشوه الحركة", "Overfill / motion distortion"),
      urgency: "high",
      signs: {
        he: ["גבול לא טבעי", "הגבלה בחיוך/דיבור"],
        ar: ["حدود غير طبيعية", "تقييد الابتسامة/الكلام"],
        en: ["Unnatural border", "Smile/speech restriction"],
      },
      actions: {
        he: ["הערכה אחרי שקיעת נפיחות", "שקול המסה/היאלורונידאז ממוקד"],
        ar: ["قيّم بعد زوال التورم", "فكر بالتدليك/هيالورونيداز موضعي"],
        en: ["Reassess after edema settles", "Consider massage / focal hyaluronidase"],
      },
    },
  ],
  followUp: {
    he: [
      "יום 1: צילום + תסמינים (נפיחות/כאב/צבע)",
      "יום 7: הערכת תוצאה והחלטה על השלמה",
      "חודש 3–6: מעקב יציבות/ספיגה",
    ],
    ar: [
      "يوم 1: صورة + أعراض",
      "يوم 7: تقييم النتيجة وقرار الإكمال",
      "شهر 3–6: متابعة الاستقرار",
    ],
    en: [
      "Day 1: photo + symptoms (edema/pain/color)",
      "Day 7: result review and touch-up decision",
      "Month 3–6: stability / resorption follow-up",
    ],
  },
  media: [
    {
      id: "anatomy-front",
      kind: "image",
      src: USER_LIPS.anatomy[0],
      caption: L("מבט קדמי — בסיס קליני", "منظر أمامي — أساس سريري", "Frontal view — clinical baseline"),
    },
    {
      id: "anatomy-alt",
      kind: "image",
      src: USER_LIPS.anatomy[1],
      caption: L("אנטומיה — וריאציה", "تشريح — تباين", "Anatomy — variation"),
    },
    {
      id: "before",
      kind: "image",
      src: USER_LIPS.before,
      caption: L("לפני HA", "قبل HA", "Before HA"),
    },
    {
      id: "after",
      kind: "image",
      src: USER_LIPS.after,
      caption: L("אחרי HA", "بعد HA", "After HA"),
    },
    {
      id: "before-after",
      kind: "beforeAfter",
      src: USER_LIPS.beforeAfterGrid,
      caption: L("לפני / אחרי", "قبل / بعد", "Before / after"),
    },
    {
      id: "inj-still",
      kind: "image",
      src: USER_LIPS.clinical[0],
      caption: L("הקשר קליני / הזרקה", "سياق سريري / حقن", "Clinical context / injection"),
    },
    {
      id: "timeline",
      kind: "timeline",
      src: USER_LIPS.timeline[0].src,
      caption: L("טיימליין החלמה יום1→חודש6", "جدول التعافي يوم1→شهر6", "Recovery timeline Day1→Month6"),
    },
    {
      id: "timeline-grid",
      kind: "image",
      src: USER_LIPS.timelineGrid,
      caption: L("רצף מלא Day1–Month6", "التسلسل الكامل", "Full Day1–Month6 sequence"),
    },
    {
      id: "flow-anim",
      kind: "animation",
      src: asset("stitch/animation/frame-1.png"),
      caption: L("רצף אנימציית Flow (פריימים)", "تسلسل رسوم Flow", "Flow animation sequence (frames)"),
    },
  ],
};
