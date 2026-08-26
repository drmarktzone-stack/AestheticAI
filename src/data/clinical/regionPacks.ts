import { L, type L3, type L3List } from "./types";

export type TeachPoint = {
  id: string;
  x: number;
  y: number;
  label: L3;
  dose: L3;
  danger?: boolean;
};

export type DoseLine = {
  site: L3;
  range: L3;
  plane: L3;
};

export type RegionPack = {
  regionId: string;
  subtitle: L3;
  injectionPoints: TeachPoint[];
  dangerNotes: L3List;
  techniqueSteps: L3List;
  doseLines: DoseLine[];
};

const packs: RegionPack[] = [
  {
    regionId: "lips",
    subtitle: L("נפח והגדרה מדורגת", "حجم وتعريف متدرج", "Staged volume and definition"),
    injectionPoints: [
      { id: "ul", x: 50, y: 58, label: L("שפה עליונה", "الشفة العلوية", "Upper lip"), dose: L("~0.3 מ״ל", "~0.3 مل", "~0.3 ml") },
      { id: "ll", x: 50, y: 66, label: L("שפה תחתונה", "الشفة السفلية", "Lower lip"), dose: L("~0.5 מ״ל", "~0.5 مل", "~0.5 ml") },
      { id: "com-l", x: 38, y: 62, label: L("קומיסורה", "زاوية الفم", "Commissure"), dose: L("0.05 מ״ל", "0.05 مل", "0.05 ml") },
      { id: "com-r", x: 62, y: 62, label: L("קומיסורה", "زاوية الفم", "Commissure"), dose: L("0.05 מ״ל", "0.05 مل", "0.05 ml") },
      { id: "labial", x: 50, y: 62, label: L("עורק שפתי", "الشريان الشفوي", "Labial artery"), dose: L("סכנה", "خطر", "Danger"), danger: true },
    ],
    dangerNotes: {
      he: ["עורקי labial משתנים — הזרקה איטית", "גבול נקניקייה מתיקון יתר", "איסכמיה: כאב + הלבנה"],
      ar: ["شرايين شفوية متغيرة", "حد سجقي من الإفراط", "نقص تروية: ألم وشحوب"],
      en: ["Variable labial arteries — slow injection", "Sausage border from overfill", "Ischemia: pain + blanching"],
    },
    techniqueSteps: {
      he: ["הערך יחס עליונה:תחתונה", "Linear threading + micro-bolus", "בדוק דיבור וחיוך לפני סיום"],
      ar: ["قيّم النسبة بين الشفتين", "حقن خطي + بلعة دقيقة", "افحص الكلام والابتسامة"],
      en: ["Assess upper:lower ratio", "Linear threading + micro-bolus", "Check speech and smile before finish"],
    },
    doseLines: [
      { site: L("סשן ראשון", "الجلسة الأولى", "First session"), range: L("0.4–1.0 מ״ל", "0.4–1.0 مل", "0.4–1.0 ml"), plane: L("תת־עורי", "تحت الجلد", "Subdermal") },
    ],
  },
  {
    regionId: "cheeks",
    subtitle: L("תמיכת midface", "دعم منتصف الوجه", "Midface support"),
    injectionPoints: [
      { id: "ck-l", x: 32, y: 48, label: L("לחי שמאל", "خد أيسر", "Left cheek"), dose: L("0.3–0.5 מ״ל", "0.3–0.5 مل", "0.3–0.5 ml") },
      { id: "ck-r", x: 68, y: 48, label: L("לחי ימין", "خد أيمن", "Right cheek"), dose: L("0.3–0.5 מ״ל", "0.3–0.5 مل", "0.3–0.5 ml") },
      { id: "infra", x: 50, y: 40, label: L("אינפראורביטל", "تحت الحجاج", "Infraorbital"), dose: L("סכנה", "خطر", "Danger"), danger: true },
    ],
    dangerNotes: {
      he: ["מפה כלי דם אינפראורביטליים", "העדף מדורג על פני מילוי יתר", "ראייה = חירום"],
      ar: ["خطّط الأوعية تحت الحجاج", "فضّل التدرج", "تغيّر البصر = طوارئ"],
      en: ["Map infraorbital vessels", "Prefer staging over overfill", "Vision change = emergency"],
    },
    techniqueSteps: {
      he: ["עוגנים עמוקים periosteal", "ואז פיזור שומן שטחי", "השוואת צדדים בישיבה"],
      ar: ["مرتكزات عميقة", "ثم توزيع سطحي", "وازن الجانبين جلوساً"],
      en: ["Deep periosteal anchors", "Then superficial fat fill", "Compare sides sitting"],
    },
    doseLines: [
      { site: L("דו־צדדי", "ثنائي الجانب", "Bilateral"), range: L("0.8–2.5 מ״ל", "0.8–2.5 مل", "0.8–2.5 ml"), plane: L("עמוק / פריאוסטאלי", "عميق / فوق العظم", "Deep / periosteal") },
    ],
  },
  {
    regionId: "jawline",
    subtitle: L("הגדרת mandibular border", "تعريف حافة الفك", "Mandibular border definition"),
    injectionPoints: [
      { id: "ang-l", x: 28, y: 72, label: L("זווית לסת", "زاوية الفك", "Gonial angle"), dose: L("0.3–0.5 מ״ל", "0.3–0.5 مل", "0.3–0.5 ml") },
      { id: "ang-r", x: 72, y: 72, label: L("זווית לסת", "زاوية الفك", "Gonial angle"), dose: L("0.3–0.5 מ״ל", "0.3–0.5 مل", "0.3–0.5 ml") },
      { id: "body", x: 50, y: 78, label: L("גוף הלסת", "جسم الفك", "Mandibular body"), dose: L("0.2–0.4 מ״ל", "0.2–0.4 مل", "0.2–0.4 ml") },
    ],
    dangerNotes: {
      he: ["כלי דם צוואריים בקצה", "פארותיד / עצב פנים סמוכים", "אל תזרוק עמוק באזור לא מוכר"],
      ar: ["أوعية رقبة عند الحافة", "الغدة النكفية / العصب الوجهي", "لا تحقن عميقاً في منطقة مجهولة"],
      en: ["Cervical vessels at the edge", "Parotid / facial nerve nearby", "Do not inject deep in unfamiliar planes"],
    },
    techniqueSteps: {
      he: ["קו ליניארי לאורך הגבול", "בולוס בזווית", "הערך סימטריה בישיבה"],
      ar: ["خط على الحافة", "بلعة في الزاوية", "قيّم التناظر جلوساً"],
      en: ["Linear along the border", "Bolus at the angle", "Assess symmetry sitting"],
    },
    doseLines: [
      { site: L("לצד", "لكل جانب", "Per side"), range: L("0.5–1.0 מ״ל", "0.5–1.0 مل", "0.5–1.0 ml"), plane: L("עמוק", "عميق", "Deep") },
    ],
  },
  {
    regionId: "chin",
    subtitle: L("הטלה וקונטור", "بروز وتحديد", "Projection and contour"),
    injectionPoints: [
      { id: "pog", x: 50, y: 78, label: L("פגוניון", "الذقن", "Pogonion"), dose: L("0.2–0.6 מ״ל", "0.2–0.6 مل", "0.2–0.6 ml") },
      { id: "pre-l", x: 44, y: 80, label: L("pre-jowl", "أمام الفك", "Pre-jowl"), dose: L("0.1–0.2 מ״ל", "0.1–0.2 مل", "0.1–0.2 ml") },
      { id: "pre-r", x: 56, y: 80, label: L("pre-jowl", "أمام الفك", "Pre-jowl"), dose: L("0.1–0.2 מ״ל", "0.1–0.2 مل", "0.1–0.2 ml") },
      { id: "mental", x: 42, y: 76, label: L("mental foramen", "الثقبة الذقنية", "Mental foramen"), dose: L("סכנה", "خطر", "Danger"), danger: true },
    ],
    dangerNotes: {
      he: ["עצב מנטלי", "עודף הטלה", "Kybella: עצב מנדיבולרי שולי"],
      ar: ["العصب الذقني", "فرط البروز", "Kybella: العصب الفكي الهامشي"],
      en: ["Mental nerve", "Over-projection", "Kybella: marginal mandibular nerve"],
    },
    techniqueSteps: {
      he: ["הערך פרופיל", "בולוס עמוק / ליניארי", "אל תמחק pre-jowl יתר"],
      ar: ["قيّم الجانب", "بلعة عميقة", "لا تفرط أمام الفك"],
      en: ["Assess profile", "Deep bolus / linear", "Do not over-erase pre-jowl"],
    },
    doseLines: [
      { site: L("סנטר HA", "ذقن HA", "Chin HA"), range: L("0.4–1.0 מ״ל", "0.4–1.0 مل", "0.4–1.0 ml"), plane: L("פריאוסטאלי", "فوق العظم", "Periosteal") },
      { site: L("pre-jowl / צד", "أمام الفك / جانب", "Pre-jowl / side"), range: L("0.1–0.3 מ״ל", "0.1–0.3 مل", "0.1–0.3 ml"), plane: L("עמוק", "عميق", "Deep") },
    ],
  },
  {
    regionId: "nose",
    subtitle: L("שמרני — סיכון קריטי", "محافظ — خطر حرج", "Conservative — critical risk"),
    injectionPoints: [
      { id: "dorsum", x: 50, y: 44, label: L("גשר", "الجسر", "Dorsum"), dose: L("≤0.1 מ״ל", "≤0.1 مل", "≤0.1 ml") },
      { id: "tip", x: 50, y: 54, label: L("קצה", "الذبابة", "Tip"), dose: L("≤0.1 מ״ל", "≤0.1 مل", "≤0.1 ml") },
      { id: "ang", x: 46, y: 40, label: L("angular", "الزاوي", "Angular a."), dose: L("סכנה", "خطر", "Danger"), danger: true },
    ],
    dangerNotes: {
      he: ["סיכון עיוורון — hyaluronidase מוכן", "עור דק בגשר", "שקול הימנעות ללא הכשרה"],
      ar: ["خطر العمى — هيالورونيداز جاهز", "جلد رقيق", "تجنّب دون تدريب"],
      en: ["Blindness risk — hyaluronidase ready", "Thin dorsal skin", "Consider avoiding without training"],
    },
    techniqueSteps: {
      he: ["אליקוטות ≤0.05 מ״ל", "הזרקה איטית מאוד", "נטר צבע וראייה במרפאה"],
      ar: ["دفعات ≤0.05 مل", "حقن بطيء جداً", "راقب اللون والبصر"],
      en: ["Aliquots ≤0.05 ml", "Very slow injection", "Monitor colour and vision in clinic"],
    },
    doseLines: [
      { site: L("סשן שלם", "جلسة كاملة", "Whole session"), range: L("0.2–0.4 מ״ל", "0.2–0.4 مل", "0.2–0.4 ml"), plane: L("עמוק", "عميق", "Deep") },
    ],
  },
  {
    regionId: "temple",
    subtitle: L("מילוי שקע רקתי", "ملء التقعر الصدغي", "Temporal hollow fill"),
    injectionPoints: [
      { id: "t-l", x: 22, y: 32, label: L("רקה", "الصدغ", "Temple"), dose: L("0.3–0.8 מ״ל", "0.3–0.8 مل", "0.3–0.8 ml") },
      { id: "t-r", x: 78, y: 32, label: L("רקה", "الصدغ", "Temple"), dose: L("0.3–0.8 מ״ל", "0.3–0.8 مل", "0.3–0.8 ml") },
      { id: "stv", x: 20, y: 28, label: L("temporal vessels", "أوعية صدغية", "Temporal vessels"), dose: L("סכנה", "خطر", "Danger"), danger: true },
    ],
    dangerNotes: {
      he: ["סיכון וסקולרי משמעותי", "עיוורון נדיר אך מדווח", "רק לאחר הכשרה ייעודית"],
      ar: ["خطر وعائي كبير", "عمى نادر موثّق", "بعد تدريب خاص فقط"],
      en: ["Significant vascular risk", "Rare but reported blindness", "Dedicated training only"],
    },
    techniqueSteps: {
      he: ["שכבה עמוקה / פריאוסטאלית לפי טכניקה", "הזרקה איטית", "השוואת מסגרת הפנים"],
      ar: ["مستوى عميق حسب التقنية", "حقن بطيء", "وازن إطار الوجه"],
      en: ["Deep / periosteal plane per technique", "Slow injection", "Compare facial frame"],
    },
    doseLines: [
      { site: L("לצד", "لكل جانب", "Per side"), range: L("0.3–1.0 מ״ל", "0.3–1.0 مل", "0.3–1.0 ml"), plane: L("עמוק", "عميق", "Deep") },
    ],
  },
  {
    regionId: "periocular",
    subtitle: L("עין עורב / tear trough", "حول العين / الدموع", "Crow's feet / tear trough"),
    injectionPoints: [
      { id: "cf-l", x: 36, y: 34, label: L("עין עורב", "أقدام الغراب", "Crow's feet"), dose: L("6–12 יח׳", "6–12 و", "6–12 U") },
      { id: "cf-r", x: 64, y: 34, label: L("עין עורב", "أقدام الغراب", "Crow's feet"), dose: L("6–12 יח׳", "6–12 و", "6–12 U") },
      { id: "tt", x: 50, y: 40, label: L("שקע דמעות", "تحت العين", "Tear trough"), dose: L("0.1–0.3 מ״ל/עין", "0.1–0.3 مل/عين", "0.1–0.3 ml/eye") },
    ],
    dangerNotes: {
      he: ["פטיוזיס מטוקסין", "טינדינג ממילוי שטחי", "נפיחות מאוחרת ב־tear trough"],
      ar: ["تدلي جفن من التوكسين", "تيندال من فيلر سطحي", "تورم متأخر تحت العين"],
      en: ["Toxin ptosis", "Tyndall from superficial filler", "Delayed edema in tear trough"],
    },
    techniqueSteps: {
      he: ["טוקסין לפי אנימציה", "מילוי — סופרה־פריאוסטאלי / קנולה", "שמרנות קיצונית"],
      ar: ["توكسين حسب الحركة", "فيلر فوق العظم / كانيولا", "تحفظ شديد"],
      en: ["Toxin by animation", "Filler — supraperiosteal / cannula", "Extreme conservatism"],
    },
    doseLines: [
      { site: L("טוקסין לעין", "توكسين/عين", "Toxin per eye"), range: L("6–12 יח׳ ona", "6–12 و", "6–12 U ona"), plane: L("תוך־שרירי", "عضلي", "IM") },
      { site: L("HA trough", "HA تحت العين", "HA trough"), range: L("0.2–0.8 מ״ל", "0.2–0.8 مل", "0.2–0.8 ml"), plane: L("עמוק", "عميق", "Deep") },
    ],
  },
  {
    regionId: "forehead",
    subtitle: L("קמטים אופקיים / frontalis", "تجاعيد أفقية", "Horizontal lines / frontalis"),
    injectionPoints: [
      { id: "f1", x: 32, y: 22, label: L("frontalis", "الجبهية", "Frontalis"), dose: L("2–4 יח׳", "2–4 و", "2–4 U") },
      { id: "f2", x: 42, y: 20, label: L("frontalis", "الجبهية", "Frontalis"), dose: L("2–4 יח׳", "2–4 و", "2–4 U") },
      { id: "f3", x: 50, y: 18, label: L("frontalis", "الجبهية", "Frontalis"), dose: L("2–4 יח׳", "2–4 و", "2–4 U") },
      { id: "f4", x: 58, y: 20, label: L("frontalis", "الجبهية", "Frontalis"), dose: L("2–4 יח׳", "2–4 و", "2–4 U") },
      { id: "f5", x: 68, y: 22, label: L("frontalis", "الجبهية", "Frontalis"), dose: L("2–4 יח׳", "2–4 و", "2–4 U") },
      { id: "brow", x: 50, y: 30, label: L("שולי גבה", "هامش الحاجب", "Brow margin"), dose: L("סכנה", "خطر", "Danger"), danger: true },
    ],
    dangerNotes: {
      he: ["פטיוזיס / כובד גבה", "שמור arch", "גברים: מינון שמרני יותר לעיתים הפוך — לפי שריר"],
      ar: ["تدلي / ثقل الحاجب", "حافظ على القوس", "حسب قوة العضلة"],
      en: ["Ptosis / brow heaviness", "Preserve arch", "Dose to muscle, not a copied map"],
    },
    techniqueSteps: {
      he: ["מפה במנוחה ובתנועה", "שולי בטיחות מעל הגבה", "תיעוד יחידות לנקודה"],
      ar: ["خطّط في الراحة والحركة", "هامش فوق الحاجب", "وثّق الوحدات"],
      en: ["Map at rest and in motion", "Safety margin above brow", "Document units per point"],
    },
    doseLines: [
      { site: L("מצח", "الجبهة", "Forehead"), range: L("10–20 יח׳ ona", "10–20 و", "10–20 U ona"), plane: L("תוך־שרירי", "عضلي", "IM") },
    ],
  },
  {
    regionId: "glabella",
    subtitle: L("קמטי כעס — סיכון קריטי למילוי", "تجاعيد الغضب — خطر الفيلر", "Glabella — filler is critical risk"),
    injectionPoints: [
      { id: "pro", x: 50, y: 28, label: L("procerus", "العضلة النازلة", "Procerus"), dose: L("4–5 יח׳", "4–5 و", "4–5 U") },
      { id: "cor-l", x: 44, y: 30, label: L("corrugator", "المغضنة", "Corrugator"), dose: L("8–10 יח׳/צד", "8–10 و/جانب", "8–10 U/side") },
      { id: "cor-r", x: 56, y: 30, label: L("corrugator", "المغضنة", "Corrugator"), dose: L("8–10 יח׳/צד", "8–10 و/جانب", "8–10 U/side") },
    ],
    dangerNotes: {
      he: ["מילוי כאן — סיכון וסקולרי קיצוני / ראייה", "טוקסין: פטיוזיס אם נמוך מדי", "שקול הימנעות ממילוי"],
      ar: ["الفيلر هنا خطر وعائي / بصر", "التوكسين: تدلي إن انخفض", "تجنّب الفيلر غالباً"],
      en: ["Filler here — extreme vascular / vision risk", "Toxin: ptosis if too low", "Consider avoiding filler"],
    },
    techniqueSteps: {
      he: ["טוקסין לפי דפוס שריר", "5–7 נקודות טיפוסיות", "אין מילוי שגרתי"],
      ar: ["توكسين حسب العضلة", "5–7 نقاط نموذجية", "لا فيلر روتيني"],
      en: ["Toxin by muscle pattern", "Typically 5–7 points", "No routine filler"],
    },
    doseLines: [
      { site: L("גלאבלה ona", "الجبينة", "Glabella ona"), range: L("~20 יח׳", "~20 و", "~20 U"), plane: L("תוך־שרירי", "عضلي", "IM") },
      { site: L("Dysport", "Dysport", "Dysport"), range: L("~50 יח׳ (לא 1:1)", "~50 (ليست 1:1)", "~50 U (not 1:1)"), plane: L("IFU", "النشرة", "IFU") },
    ],
  },
  {
    regionId: "neck",
    subtitle: L("פלטיזמה / BAP / Nefertiti", "platysma / BAP", "Platysma / BAP / Nefertiti"),
    injectionPoints: [
      { id: "plat-l", x: 42, y: 90, label: L("רצועה", "شريط", "Band"), dose: L("2–4 יח׳", "2–4 و", "2–4 U") },
      { id: "plat", x: 50, y: 92, label: L("פלטיזמה", "platysma", "Platysma"), dose: L("2–4 יח׳/נקודה", "2–4 و/نقطة", "2–4 U/point") },
      { id: "plat-r", x: 58, y: 90, label: L("רצועה", "شريط", "Band"), dose: L("2–4 יח׳", "2–4 و", "2–4 U") },
      { id: "bap", x: 38, y: 88, label: L("BAP צוואר", "BAP رقبة", "Neck BAP"), dose: L("0.2 מ״ל/נקודה", "0.2 مل/نقطة", "0.2 ml/point") },
      { id: "swallow", x: 50, y: 86, label: L("מסלול בליעה", "مسار البلع", "Swallow path"), dose: L("סכנה", "خطر", "Danger"), danger: true },
    ],
    dangerNotes: {
      he: ["דיספגיה אם טוקסין גבוה/עמוק", "עור דק", "אל תערבב volumizer באותו יום עם Profhilo"],
      ar: ["عسر بلع إن ارتفع التوكسين", "جلد رقيق", "لا تخلط فوليومايزر مع Profhilo"],
      en: ["Dysphagia if toxin too high/deep", "Thin skin", "Do not mix volumizer same day as Profhilo"],
    },
    techniqueSteps: {
      he: ["מיפוי רצועות", "Profhilo 5-point neck", "Nefertiti lift — הכשרה"],
      ar: ["تخطيط الأشرطة", "Profhilo 5 نقاط", "Nefertiti — تدريب"],
      en: ["Map bands", "Profhilo 5-point neck", "Nefertiti lift — trained only"],
    },
    doseLines: [
      { site: L("טוקסין רצועות", "توكسين الأشرطة", "Band toxin"), range: L("לפי דפוס", "حسب النمط", "By pattern"), plane: L("תוך־שרירי שטחי", "عضلي سطحي", "Superficial IM") },
      { site: L("Profhilo צוואר", "Profhilo رقبة", "Profhilo neck"), range: L("2 מ״ל / 5 נקודות", "2 مل / 5 نقاط", "2 ml / 5 points"), plane: L("BAP", "BAP", "BAP") },
    ],
  },
  {
    regionId: "tmj",
    subtitle: L("כאב / bruxism — טיפולי", "ألم / صرير — علاجي", "Pain / bruxism — therapeutic"),
    injectionPoints: [
      { id: "tmj-l", x: 20, y: 42, label: L("temporalis", "الصدغية", "Temporalis"), dose: L("10–20 יח׳", "10–20 و", "10–20 U") },
      { id: "tmj-r", x: 80, y: 42, label: L("temporalis", "الصدغية", "Temporalis"), dose: L("10–20 יח׳", "10–20 و", "10–20 U") },
      { id: "ms-l", x: 24, y: 58, label: L("מססטר", "الماضغة", "Masseter"), dose: L("25–40 יח׳/צד", "25–40 و/جانب", "25–40 U/side") },
      { id: "ms-r", x: 76, y: 58, label: L("מססטר", "الماضغة", "Masseter"), dose: L("25–40 יח׳/צד", "25–40 و/جانب", "25–40 U/side") },
      { id: "ant", x: 28, y: 52, label: L("קדמי — סכנה", "أمامي — خطر", "Anterior — danger"), dose: L("סכנה", "خطر", "Danger"), danger: true },
    ],
    dangerNotes: {
      he: ["דיספגיה אם גבוה/קדמי", "שינוי נשיכה", "שמור night guard בשיחה"],
      ar: ["عسر بلع إن ارتفع/تقدم", "تغير الإطباق", "ناقش الحارس الليلي"],
      en: ["Dysphagia if too high/anterior", "Bite change", "Discuss night guard"],
    },
    techniqueSteps: {
      he: ["מישוש מססטר", "3–4 נקודות אחוריות־תחתונות", "הערכה דנטלית אם כאב נמשך"],
      ar: ["جس الماضغة", "3–4 نقاط خلفية سفلية", "تقييم سني إن استمر الألم"],
      en: ["Palpate masseter", "3–4 posterior-inferior points", "Dental review if pain persists"],
    },
    doseLines: [
      { site: L("מססטר/צד", "ماضغة/جانب", "Masseter/side"), range: L("25–40 יח׳ ona", "25–40 و", "25–40 U ona"), plane: L("תוך־שרירי", "عضلي", "IM") },
      { site: L("temporalis/צד", "صدغية/جانب", "Temporalis/side"), range: L("10–20 יח׳ ona", "10–20 و", "10–20 U ona"), plane: L("תוך־שרירי", "عضلي", "IM") },
    ],
  },
  {
    regionId: "masseter",
    subtitle: L("הקטנת מסה / V-line", "تصغير الكتلة", "Bulk reduction / V-line"),
    injectionPoints: [
      { id: "m-l", x: 24, y: 62, label: L("מססטר", "الماضغة", "Masseter"), dose: L("25–40 יח׳", "25–40 و", "25–40 U") },
      { id: "m-l2", x: 26, y: 68, label: L("נקודה תחתונה", "نقطة سفلية", "Lower point"), dose: L("8–12 יח׳", "8–12 و", "8–12 U") },
      { id: "m-r", x: 76, y: 62, label: L("מססטר", "الماضغة", "Masseter"), dose: L("25–40 יח׳", "25–40 و", "25–40 U") },
      { id: "m-r2", x: 74, y: 68, label: L("נקודה תחתונה", "نقطة سفلية", "Lower point"), dose: L("8–12 יח׳", "8–12 و", "8–12 U") },
      { id: "risorius", x: 30, y: 58, label: L("risorius — סכנה", "الضحكة — خطر", "Risorius — danger"), dose: L("סכנה", "خطر", "Danger"), danger: true },
    ],
    dangerNotes: {
      he: ["אטרופיה יתר", "חיוך אסימטרי", "דיספגיה"],
      ar: ["ضمور مفرط", "ابتسامة غير متناظرة", "عسر بلع"],
      en: ["Over-atrophy", "Asymmetric smile", "Dysphagia"],
    },
    techniqueSteps: {
      he: ["גבול אחורי־תחתון בטוח", "בדוק כוח נשיכה במעקב", "זכר: אל תחליש יתר"],
      ar: ["الحد الخلفي السفلي الآمن", "افحص قوة العضّ", "لا تُضعف أكثر من اللازم"],
      en: ["Safe posterior-inferior zone", "Recheck bite strength", "Do not over-weaken"],
    },
    doseLines: [
      { site: L("לצד", "لكل جانب", "Per side"), range: L("25–40 יח׳ ona", "25–40 و", "25–40 U ona"), plane: L("תוך־שרירי", "عضلي", "IM") },
    ],
  },
  {
    regionId: "axilla",
    subtitle: L("הזעת יתר ראשונית", "فرط تعرق أولي", "Primary hyperhidrosis"),
    injectionPoints: [
      { id: "ax-l", x: 12, y: 52, label: L("בית שחי", "إبط", "Axilla"), dose: L("50 יח׳/צד", "50 و/جانب", "50 U/side") },
      { id: "ax-l2", x: 14, y: 58, label: L("רשת", "شبكة", "Grid"), dose: L("תוך־עורי", "داخل الأدمة", "Intradermal") },
      { id: "ax-r", x: 88, y: 52, label: L("בית שחי", "إبط", "Axilla"), dose: L("50 יח׳/צד", "50 و/جانب", "50 U/side") },
      { id: "ax-r2", x: 86, y: 58, label: L("רשת", "شبكة", "Grid"), dose: L("תוך־עורי", "داخل الأدمة", "Intradermal") },
      { id: "muscle", x: 12, y: 64, label: L("שריר — עמוק מדי", "عضلة — أعمق مما يلزم", "Muscle — too deep"), dose: L("סכנה", "خطر", "Danger"), danger: true },
    ],
    dangerNotes: {
      he: ["חולשה אם עמוק מדי", "הזעה מפצה נדירה", "Minor test לפני grid"],
      ar: ["ضعف إن عمقت", "تعرق معاوض نادر", "اختبار Minor قبل الشبكة"],
      en: ["Weakness if too deep", "Rare compensatory sweating", "Minor test before grid"],
    },
    techniqueSteps: {
      he: ["Starch-iodine map", "רשת 1–1.5 ס״מ תוך־עורית", "50–100 יח׳ דו־צדדי ona-class"],
      ar: ["تخطيط اليود", "شبكة 1–1.5 سم داخل الجلد", "50–100 و ثنائي الجانب"],
      en: ["Starch-iodine map", "1–1.5 cm intradermal grid", "50–100 U bilateral ona-class"],
    },
    doseLines: [
      { site: L("דו־צדדי", "ثنائي", "Bilateral"), range: L("50–100 יח׳ ona", "50–100 و", "50–100 U ona"), plane: L("תוך־עורי", "داخل الجلد", "Intradermal") },
    ],
  },
  {
    regionId: "migraine",
    subtitle: L("PREEMPT — 155 יח׳ / 31 אתרים", "PREEMPT — 155 و / 31 موقعاً", "PREEMPT — 155 U / 31 sites"),
    injectionPoints: [
      { id: "gl", x: 50, y: 28, label: L("גלאבלה", "الجبينة", "Glabella"), dose: L("5 יח׳×5", "5 و×5", "5 U × 5") },
      { id: "fr", x: 50, y: 20, label: L("מצח", "الجبهة", "Forehead"), dose: L("5 יח׳/אתר", "5 و/موقع", "5 U/site") },
      { id: "temp-l", x: 22, y: 36, label: L("temporalis", "الصدغية", "Temporalis"), dose: L("4 אתרים", "4 مواقع", "4 sites") },
      { id: "temp-r", x: 78, y: 36, label: L("temporalis", "الصدغية", "Temporalis"), dose: L("4 אתרים", "4 مواقع", "4 sites") },
      { id: "occ", x: 50, y: 8, label: L("occipital", "قفوي", "Occipital"), dose: L("PREEMPT", "PREEMPT", "PREEMPT") },
      { id: "trap", x: 28, y: 14, label: L("cervical / trapezius", "رقبي / ترابيس", "Cervical / trapezius"), dose: L("זהירות", "حذر", "Caution"), danger: true },
    ],
    dangerNotes: {
      he: ["לא מפת בוטוקס אסתטית", "דיספגיה / חולשת צוואר", "רק לפי תווית מאושרת"],
      ar: ["ليست خريطة تجميل", "عسر بلع / ضعف رقبة", "وفق التسمية فقط"],
      en: ["Not an aesthetic botox map", "Dysphagia / neck weakness", "Approved label only"],
    },
    techniqueSteps: {
      he: ["קריטריוני מיגרנה כרונית", "31 אתרים קבועים", "חזרה כל 12 שבועות"],
      ar: ["معايير الشقيقة المزمنة", "31 موقعاً ثابتاً", "كل 12 أسبوعاً"],
      en: ["Chronic migraine criteria", "31 fixed sites", "Repeat q12 weeks"],
    },
    doseLines: [
      { site: L("סשן PREEMPT", "جلسة PREEMPT", "PREEMPT session"), range: L("155 יח׳ (עד 195)", "155 و (حتى 195)", "155 U (up to 195)"), plane: L("תוך־שרירי", "عضلي", "IM") },
    ],
  },
];

export const REGION_PACKS: Record<string, RegionPack> = Object.fromEntries(
  packs.map((pack) => [pack.regionId, pack]),
);

export function getRegionPack(regionId: string): RegionPack | undefined {
  return REGION_PACKS[regionId];
}

export const FACE_ATLAS_IDS = [
  "periocular",
  "glabella",
  "forehead",
  "nose",
  "cheeks",
  "temple",
  "chin",
  "jawline",
  "lips",
  "neck",
] as const;

export const THERAPY_ATLAS_IDS = ["tmj", "masseter", "axilla", "migraine"] as const;
