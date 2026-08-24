import type { EmergencyProtocol, Protocol } from "./types";

export const protocols: Protocol[] = [
  {
    id: "lip-refresh",
    nameHe: "רענון שפתיים מדורג",
    indication: "נפח/הגדרה עם דגש על טבעיות ובטיחות",
    regionIds: ["lips"],
    materialIds: ["ha-lips"],
    techniqueIds: ["linear-threading", "microdroplet"],
    steps: [
      { title: "הערכה", detail: "יחס שפתיים, שיניים, פרופיל, ציפיות, קונטרה־אינדיקציות" },
      { title: "תכנון", detail: "הגדר מטרה (נפח/גבול/סימטריה) ונפח מקסימלי למפגש" },
      { title: "הזרקה", detail: "טכניקה לפי תכנון; ניטור צבע/כאב; תיעוד לוט ונפח" },
      { title: "שחרור", detail: "הנחיות נפיחות, סימני אזהרה, ומועד מעקב" },
    ],
    dosingFramework: [
      "קבע תקרת נפח למפגש לפי שיקול דעתך ו־IFU",
      "העדף השלמה במעקב על פני תיקון יתר",
    ],
    followUp: ["ביקורת 10–14 יום", "צילום סטנדרטי לפני/אחרי"],
    redFlags: ["כאב חריג", "הלבנה", "חיוורון מתקדם", "קושי נשימה — חירום מערכתי"],
    sources: [{ label: "פרוטוקול מרפאה — טיוטה" }],
    reviewedByPhysician: false,
  },
  {
    id: "upper-face-toxin",
    nameHe: "טוקסין פנים עליונות",
    indication: "מצח / גלאבלה / עין עורב לפי הערכה",
    regionIds: ["glabella", "periocular"],
    materialIds: ["btx-a"],
    techniqueIds: ["toxin-mapping"],
    steps: [
      { title: "ניתוח אנימציה", detail: "דפוסי שריר, אסימטריה, כוח הרמה של מצח" },
      { title: "מיפוי", detail: "סמן נקודות; התאם יחידות לפרופיל המטופל" },
      { title: "הזרקה", detail: "עומק שרירי מדויק; הימנע מאזורים בסיכון לפטיוזיס" },
      { title: "מעקב", detail: "הערכת תוצאה ב־14 יום; תיעוד תגובה" },
    ],
    dosingFramework: [
      "יחידות לפי מותג בלבד — ללא המרה משוערת",
      "שמור טבלת מינון אישית מאושרת לכל מותג שאתה משתמש בו",
    ],
    followUp: ["ביקורת שבועיים", "תיקון נקודתי בזהירות אם נדרש"],
    redFlags: ["פטיוזיס", "כפל ראייה", "חולשת חיוך חריגה"],
    sources: [{ label: "IFU + פרוטוקול מרפאה — טיוטה" }],
    reviewedByPhysician: false,
  },
  {
    id: "midface-support",
    nameHe: "תמיכת midface",
    indication: "איבוד נפח לחיים / תמיכת רקמות רכות",
    regionIds: ["cheeks"],
    materialIds: ["ha-versatile", "caha"],
    techniqueIds: ["bolus", "fanning"],
    steps: [
      { title: "אבחון וקטור", detail: "הבחן בין איבוד נפח עמוק לבין שינויי עור שטחיים" },
      { title: "בחירת חומר", detail: "ריאולוגיה לפי מטרה וסיכון" },
      { title: "בניית תמיכה", detail: "עוגנים עמוקים ואז פיזור לפי הצורך" },
      { title: "איזון", detail: "השוואת צדדים בישיבה" },
    ],
    dosingFramework: [
      "תעד נפח לכל רבע/מדור",
      "אל תערבב מותגים באותו מישור ללא סיבה מתועדת",
    ],
    followUp: ["ביקורת שבועיים־חודש", "צילום סטנדרטי"],
    redFlags: ["כאב חד", "שינוי צבע", "חסר נוירולוגי"],
    sources: [{ label: "פרוטוקול מרפאה — טיוטה" }],
    reviewedByPhysician: false,
  },
];

export const emergencies: EmergencyProtocol[] = [
  {
    id: "vascular-occlusion",
    nameHe: "חשד לחסימה וסקולרית לאחר מילוי",
    urgency: "critical",
    recognition: [
      "כאב disproportionate",
      "הלבנה / livedo / שינוי צבע",
      "קפילרי רפיל איטי או נעדר",
      "בשלב מאוחר: שלפוחיות / נמק",
    ],
    immediateActions: [
      "עצור הזרקה מיד",
      "השאר את המטופל במרפאה; התחל פרוטוקול החירום שלך",
      "שקול היאלורונידאז באזור הרלוונטי לפי הפרוטוקול שאישרת",
      "חמם / עיסוי / מדדי עזר — רק לפי הפרוטוקול המאושר שלך",
      "נטר ראייה ותסמינים מערכתיים",
    ],
    medsAndTools: [
      "היאלורונידאז זמין ומכויל",
      "ערכה לחירום (סימון תכולה באחריות המרפאה)",
      "גישה להפניה דחופה / רפואת עיניים לפי הצורך",
    ],
    escalation: [
      "שינוי ראייה = חירום אופתלמולוגי מיידי",
      "חשד לנמק מתקדם — הפניה דחופה",
    ],
    documentation: [
      "זמן אירוע, חומר, נפח, אזור, פעולות, מינונים, תגובה",
      "צילום סדרתי",
      "הנחיות המשך ומעקב צמוד",
    ],
    reviewedByPhysician: false,
  },
  {
    id: "vision-threat",
    nameHe: "חשד למעורבות ראייה",
    urgency: "critical",
    recognition: [
      "טשטוש / אובדן ראייה",
      "כאב אורביטלי / כאב ראש חד",
      "חסר בשדה ראייה",
    ],
    immediateActions: [
      "הפסק פעולה; אל תשלח הביתה",
      "הפעל פרוטוקול ראייה של המרפאה",
      "פנייה מיידית למומחה עיניים / מיון לפי המסלול שהגדרת",
    ],
    medsAndTools: ["לפי פרוטוקול מרפאה מאושר בלבד"],
    escalation: ["אין המתנה ל‘שיפור ספונטני’ כשיש איום על ראייה"],
    documentation: ["זמן מדויק", "תסמינים", "פעולות", "יעד ההפניה"],
    reviewedByPhysician: false,
  },
  {
    id: "anaphylaxis",
    nameHe: "חשד לאנפילקסיס",
    urgency: "critical",
    recognition: [
      "אורטיקריה מפושטת / אנגיואדמה",
      "קוצר נשימה / צפצופים",
      "ירידת לחץ דם / סחרחורת קשה",
    ],
    immediateActions: [
      "קבע ABC",
      "הפעל פרוטוקול אנפילקסיס של המרפאה (אפינפרין וכו’ לפי מה שאישרת)",
      "הזעק עזרה דחופה",
    ],
    medsAndTools: ["ערכת אנפילקסיס מעודכנת", "חמצן / ניטור לפי זמינות"],
    escalation: ["פינוי דחוף לכל חשד משמעותי"],
    documentation: ["זמן", "חשיפה", "מינונים", "תגובה"],
    reviewedByPhysician: false,
  },
];
