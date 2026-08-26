import { asset } from "../../lib/assets";
import { L, type ClinicalMentorGuide } from "./types";

/**
 * Midface mentor pack — same clinical template as lips.
 * Educational draft; physician review required.
 */
export const midfaceMentor: ClinicalMentorGuide = {
  id: "midface-volume-restore",
  regionId: "cheeks",
  reviewedByPhysician: false,
  title: L(
    "מרכז פנים — שחזור נפח",
    "منتصف الوجه — استعادة الحجم",
    "Midface — volume restore",
  ),
  subtitle: L(
    "מדריך־מנטור: לחיים/קשת זיגומטית — חומרים, מינון, הזרקה, סיבוכים וסימולציה",
    "دليل موجِّه: الخدود/القوس الوجني — مواد وجرعة وحقن ومضاعفات ومحاكاة",
    "Mentor guide: cheeks/zygomatic arch — materials, dosing, injection, complications & simulation",
  ),
  disclaimer: L(
    "טיוטה חינוכית לרופאים מוסמכים. מינון/מוצר לפי IFU ושיקול קליני. לא הבטחת תוצאה.",
    "مسودة تعليمية للأطباء المرخصين. الجرعة/المنتج وفق النشرة والحكم السريري.",
    "Educational draft for licensed physicians. Dose/product per IFU and clinical judgment.",
  ),
  protocolName: L(
    "פרוטוקול Midface — תמיכה מבנית",
    "بروتوكول منتصف الوجه — دعم هيكلي",
    "Midface protocol — structural support",
  ),
  goals: {
    he: ["תמיכת לחי", "וקטור הרמה עדין", "שיפור מעבר עפעף־לחי", "פרופיל טבעי"],
    ar: ["دعم الخد", "متجه رفع لطيف", "تحسين انتقال الجفن-الخد", "مظهر جانبي طبيعي"],
    en: ["Cheek support", "Subtle lift vector", "Lid-cheek junction", "Natural profile"],
  },
  anatomy: {
    he: [
      "קשת זיגומטית, SOOF, מלר fat pads",
      "קרבה לכלי דם אינפראורביטליים — זהירות גבוהה",
      "שכבות: deep fat / periosteal לפי טכניקה",
    ],
    ar: [
      "القوس الوجني، SOOF، وسائد دهنية",
      "قرب الأوعية تحت الحجاج — حذر مرتفع",
      "طبقات: دهون عميقة / فوق العظم حسب التقنية",
    ],
    en: [
      "Zygomatic arch, SOOF, malar fat pads",
      "Proximity to infraorbital vessels — high caution",
      "Planes: deep fat / periosteal per technique",
    ],
  },
  dangerZones: {
    he: ["אינפראורביטל", "סיכון חסימה / פגיעה בראייה נדירה אך קריטית", "עודף שטחי → Tyndall / אי־סדירות"],
    ar: ["تحت الحجاج", "خطر انسداد / إصابة بصرية نادرة وحاسمة", "فرط سطحي → تيندال / عدم انتظام"],
    en: ["Infraorbital foramen region", "Occlusion / vision threat rare but critical", "Too superficial → Tyndall / irregularity"],
  },
  materials: [
    {
      id: "ha-voluma-class",
      name: L("HA מבני ללחיים", "HA هيكلي للخدود", "Structural HA for cheeks"),
      role: L(
        "תמיכת נפח עמוקה / הרמה עדינה — לפי ריאולוגיית המוצר",
        "دعم حجم عميق / رفع لطيف — حسب ريولوجيا المنتج",
        "Deep volume support / subtle lift — product rheology dependent",
      ),
      rheology: L("G′ גבוה יותר ממוצרי שפתיים", "G′ أعلى من منتجات الشفاه", "Higher G′ than lip products"),
      planes: L("עמוק / סופרא־פריאוסטאלי לפי תוכנית", "عميق / فوق العظم حسب الخطة", "Deep / supraperiosteal per plan"),
      dose: L("תכנון לפי צד ואסימטריה; מדורג", "تخطيط حسب الجانب وعدم التناظر؛ متدرج", "Plan by side/asymmetry; staged"),
      pearls: {
        he: ["הערך פרופיל + מבט קדמי", "התחל שמרני"],
        ar: ["قيّم الجانبي والأمامي", "ابدأ بتحفظ"],
        en: ["Assess profile + frontal", "Start conservative"],
      },
      cautions: {
        he: ["IFU מחייב", "זהירות אינפראורביטל"],
        ar: ["النشرة ملزمة", "حذر تحت الحجاج"],
        en: ["IFU binding", "Infraorbital caution"],
      },
    },
  ],
  dosing: [
    {
      id: "ck1",
      site: L("Zygomatic Arch (CK1)", "القوس الوجني (CK1)", "Zygomatic Arch (CK1)"),
      typical: L(
        "0.2–0.5 מ״ל לצד; בולוסים עמוקים 0.05–0.1 מ״ל לנקודה",
        "0.2–0.5 مل/جانب؛ بلعات عميقة 0.05–0.1 مل/نقطة",
        "0.2–0.5 ml/side; deep boluses 0.05–0.1 ml/point",
      ),
      plane: L("Supraperiosteal / deep", "فوق العظم / عميق", "Supraperiosteal / deep"),
      note: L("סמן על מפה לפני הזרקה", "علّم على الخريطة قبل الحقن", "Mark map before injecting"),
    },
    {
      id: "malar",
      site: L("Malar / mid-cheek", "المنطقة الوجنية", "Malar / mid-cheek"),
      typical: L(
        "0.3–0.8 מ״ל ללחי לפי חסר; סה״כ דו־צדדי לעיתים 1.0–2.0 מ״ל",
        "0.3–0.8 مل/خد؛ ثنائي الجانب غالباً 1.0–2.0 مل",
        "0.3–0.8 ml/cheek by deficit; bilateral often 1.0–2.0 ml",
      ),
      plane: L("Deep fat", "دهون عميقة", "Deep fat"),
      note: L("בדוק סימטריה בישיבה", "افحص التناظر جلوساً", "Check symmetry seated"),
    },
  ],
  techniques: [
    {
      id: "bolus-periosteal",
      name: L("Bolus עמוק / מחט", "بلعة عميقة / إبرة", "Deep bolus / needle"),
      when: L("תמיכה מבנית נקודתית", "دعم هيكلي نقطي", "Focal structural support"),
      steps: {
        he: ["מיפוי", "החדרה מבוקרת לעומק היעד", "אליקוטה + הערכה"],
        ar: ["تخطيط", "إدخال مضبوط للعمق", "دفعة + تقييم"],
        en: ["Map", "Controlled depth entry", "Aliquot + assess"],
      },
      pitfalls: {
        he: ["שטחי מדי", "נפח יתר חד־צדדי"],
        ar: ["سطحي جداً", "فرط حجم أحادي الجانب"],
        en: ["Too superficial", "Unilateral overfill"],
      },
      mediaId: "midface-inj",
    },
    {
      id: "cannula-fan",
      name: L("קנולה מניפה", "كانولا مروحية", "Cannula fan"),
      when: L("פיזור נפח / מעברים רכים", "توزيع الحجم / انتقالات ناعمة", "Volume blend / soft transitions"),
      steps: {
        he: ["נקודת כניסה בטוחה", "Fan מבוקר", "מישוש + מראה"],
        ar: ["نقطة دخول آمنة", "مروحة مضبوطة", "جس + مظهر"],
        en: ["Safe entry point", "Controlled fan", "Palpate + inspect"],
      },
      pitfalls: {
        he: ["מסלול לא מתוכנן ליד כלי דם"],
        ar: ["مسار غير مخطط قرب وعاء"],
        en: ["Unplanned path near vessels"],
      },
      mediaId: "midface-wide",
    },
  ],
  complications: [
    {
      id: "edema-mid",
      name: L("נפיחות / אסימטריה זמנית", "تورم / عدم تناظر مؤقت", "Edema / temporary asymmetry"),
      urgency: "moderate",
      signs: {
        he: ["נפיחות 48–72 שעות", "הבדל צדדים מוקדם"],
        ar: ["تورم 48–72 ساعة", "فرق مبكر بين الجانبين"],
        en: ["Edema 48–72h", "Early side difference"],
      },
      actions: {
        he: ["הסבר צפוי", "הערכה מחדש אחרי שקיעה"],
        ar: ["تثقيف متوقع", "إعادة تقييم بعد الزوال"],
        en: ["Expected-course counseling", "Reassess after settling"],
      },
    },
    {
      id: "occlusion-mid",
      name: L("חשד חסימה / איום ראייה", "اشتباه انسداد / تهديد بصري", "Suspected occlusion / vision threat"),
      urgency: "critical",
      signs: {
        he: ["כאב חריג", "הלבנה/livedo", "שינוי ראייה — חירום"],
        ar: ["ألم غير معتاد", "شحوب/livedo", "تغير الرؤية — طوارئ"],
        en: ["Severe pain", "Blanching/livedo", "Vision change — emergency"],
      },
      actions: {
        he: ["עצור", "פרוטוקול היאלורונידאז", "הסלמה מיידית"],
        ar: ["أوقف", "بروتوكول هيالورونيداز", "تصعيد فوري"],
        en: ["Stop", "Hyaluronidase protocol", "Immediate escalation"],
      },
    },
  ],
  followUp: {
    he: ["יום 1 צילום", "יום 7 הערכה", "חודש 3 יציבות"],
    ar: ["يوم 1 صورة", "يوم 7 تقييم", "شهر 3 استقرار"],
    en: ["Day 1 photo", "Day 7 review", "Month 3 stability"],
  },
  media: [
    {
      id: "midface-wide",
      kind: "image",
      src: asset("stitch/clinical/midface-1.png"),
      caption: L("Midface — מבט רחב", "منتصف الوجه — منظر واسع", "Midface — wide view"),
    },
    {
      id: "midface-close",
      kind: "image",
      src: asset("stitch/clinical/midface-close.png"),
      caption: L("תקריב לחי", "لقطة مقربة للخد", "Cheek close-up"),
    },
    {
      id: "midface-inj",
      kind: "image",
      src: asset("stitch/clinical/injection.png"),
      caption: L("הדגמת הזרקה", "عرض الحقن", "Injection demo"),
    },
    {
      id: "before-after",
      kind: "beforeAfter",
      src: asset("stitch/clinical/before-after.png"),
      caption: L("לפני / אחרי", "قبل / بعد", "Before / after"),
    },
  ],
};
