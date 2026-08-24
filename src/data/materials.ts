import type { Material } from "./types";

/**
 * תוכן זרע לדוגמה בלבד — לא מאושר קלינית.
 * כל ערך מינון/התוויה חייב לעבור אישור רופא + IFU לפני שימוש.
 */
export const materials: Material[] = [
  {
    id: "ha-versatile",
    nameHe: "חומצה היאלורונית — רב־שימושית",
    nameEn: "HA filler (versatile)",
    class: "ha",
    rheology: "G′ בינוני, קוהזיות בינונית — לפי מוצר ספציפי",
    typicalUses: ["לחיים", "קפלים נזולביאליים", "מריונטות", "סנטר קל"],
    planes: ["subdermal", "superficial-fat", "deep-fat"],
    doseNotes: [
      "מינון לפי IFU המוצר והאנטומיה של המטופל — לא לפי כלל אצבע גלובלי",
      "התחל בכמות שמרנית; השלם במפגש מעקב אם נדרש",
      "תעד מותג, לוט, נפח לכל אזור",
    ],
    contraindications: [
      "רגישות ידועה ל־HA / לידוקאין (אם קיים בתכשיר)",
      "זיהום פעיל באזור",
      "הריון/הנקה — לפי מדיניות המרפאה וה־IFU",
    ],
    pearls: [
      "התאמת ריאולוגיה למטרה (נפח מול קווי מתאר מול עור)",
      "שאיפה / הזרקה איטית / מודעות וסקולרית קריטיים באזורים בסיכון",
    ],
    sources: [{ label: "IFU יצרן", note: "חובה לפי מוצר" }],
    reviewedByPhysician: false,
  },
  {
    id: "ha-lips",
    nameHe: "חומצה היאלורונית — שפתיים",
    nameEn: "HA filler (lips)",
    class: "ha",
    rheology: "רכה יותר / אינטגרציה דינמית — לפי מוצר",
    typicalUses: ["נפח שפתיים", "הגדרת גבול", "תיקון אסימטריה"],
    planes: ["subdermal", "superficial-fat"],
    doseNotes: [
      "תכנון לפי יחס שפה עליונה/תחתונה ומבנה הפנים",
      "העדף מפגשים מדורגים על פני תיקון יתר חד־פעמי",
    ],
    contraindications: ["הרפס פעיל", "זיהום מקומי", "רגישות למרכיבי התכשיר"],
    pearls: [
      "שמור על תנועה טבעית; הימנע מעומס יתר בגבול האדום",
      "הסבר מראש על נפיחות מוקדמת",
    ],
    sources: [{ label: "IFU יצרן" }],
    reviewedByPhysician: false,
  },
  {
    id: "btx-a",
    nameHe: "טוקסין בוטולינום A",
    nameEn: "Botulinum toxin A",
    class: "toxin",
    typicalUses: ["מצח", "גלאבלה", "עין עורב", "מסהטר", "צוואר (לפי הכשרה)"],
    planes: ["intramuscular"],
    doseNotes: [
      "יחידות אינן חופפות 1:1 בין מותגים — המר לפי טבלת היצרן בלבד",
      "מיפוי נקודות + מינון לפי דפוס שריר, מין, עובי שריר ומטרה",
      "שמור מרווח בטוח מאזורים שיגרמו לפטיוזיס",
    ],
    contraindications: [
      "הפרעות נוירומוסקולריות רלוונטיות",
      "זיהום באתר ההזרקה",
      "הריון/הנקה — לפי מדיניות ו־IFU",
    ],
    pearls: [
      "תעד מותג, דילול, יחידות לנקודה",
      "הערכת אנימציה במנוחה ובתנועה לפני ההזרקה",
    ],
    sources: [{ label: "IFU יצרן", note: "חובה לכל מותג" }],
    reviewedByPhysician: false,
  },
  {
    id: "caha",
    nameHe: "סידן הידרוקסיאפטיט (CaHA)",
    nameEn: "Calcium hydroxylapatite",
    class: "caha",
    typicalUses: ["נפח עמוק", "קו לסת", "ביוסטימולציה לפי פרוטוקול"],
    planes: ["deep-fat", "periosteal"],
    doseNotes: [
      "לא באזורים בעלי סיכון וסקולרי גבוה ללא הכשרה ייעודית",
      "אין אנטידות אנזימטית כמו ב־HA — בחירה ובטיחות קריטיות",
    ],
    contraindications: ["הזרקה שטחית באזורים לא מתאימים", "זיהום פעיל"],
    pearls: ["דילול/טכניקה לפי IFU והכשרה", "בחירת מטופל שמרנית בהתחלה"],
    sources: [{ label: "IFU יצרן" }],
    reviewedByPhysician: false,
  },
  {
    id: "plla",
    nameHe: "חומצה פולי־ל־לקטית (PLLA)",
    nameEn: "Poly-L-lactic acid",
    class: "biostimulator",
    typicalUses: ["איכות עור / נפח הדרגתי", "לחיים", "רקות — לפי הכשרה"],
    planes: ["subdermal", "superficial-fat"],
    doseNotes: [
      "הכנה, המסה וזמני המתנה — אך ורק לפי IFU",
      "תוצאה הדרגתית; תכנון סדרת מפגשים",
    ],
    contraindications: ["זיהום פעיל", "נטייה לצלקות קלואיד לפי שיקול דעת"],
    pearls: ["עיסוי לאחר טיפול לפי פרוטוקול", "ציפיות מטופל לטווח בינוני"],
    sources: [{ label: "IFU יצרן" }],
    reviewedByPhysician: false,
  },
  {
    id: "hyaluronidase",
    nameHe: "היאלורונידאז",
    nameEn: "Hyaluronidase",
    class: "enzyme",
    typicalUses: ["פירוק HA", "ניהול סיבוך וסקולרי / תיקון יתר"],
    planes: ["intradermal", "subdermal", "superficial-fat", "deep-fat"],
    doseNotes: [
      "מינון חירום לפי פרוטוקול המרפאה שאישרת — עדכן כאן אחרי אישור",
      "בדיקת רגישות לפי מדיניות המרפאה כאשר רלוונטי",
    ],
    contraindications: ["רגישות ידועה להיאלורונידאז / מקורות חלבון רלוונטיים"],
    pearls: [
      "ערכה לחירום חייבת להיות זמינה בכל יום הזרקות HA",
      "תעד זמן, מינון, תגובה, והפניה",
    ],
    sources: [{ label: "פרוטוקול מרפאה + ספרות קלינית" }],
    reviewedByPhysician: false,
  },
];
