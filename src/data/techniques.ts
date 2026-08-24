import type { Technique } from "./types";

export const techniques: Technique[] = [
  {
    id: "linear-threading",
    nameHe: "Linear threading",
    nameEn: "Linear threading",
    summary: "הזרקה רציפה לאורך מסלול בנסיגה או בהתקדמות מבוקרת.",
    whenToUse: ["קפלים", "הגדרת קו", "שפתיים לפי תכנון"],
    howTo: [
      "מקם את המחט/קנולה במשטח המטרה",
      "הזרק בנסיגה במהירות מבוקרת ובנפח אחיד",
      "עצור אם התנגדות/כאב/שינוי צבע חריגים",
    ],
    pitfalls: ["נפח יתר בנקודה אחת", "סטייה ממשטח היעד"],
    reviewedByPhysician: false,
  },
  {
    id: "fanning",
    nameHe: "Fanning",
    nameEn: "Fanning",
    summary: "פיזור ממקור כניסה אחד במניפה לכיסוי שטח.",
    whenToUse: ["לחיים", "אזורים רחבים הדורשים פיזור"],
    howTo: [
      "כניסה יחידה; שינוי זווית בין מעברים",
      "שמור על אותו משטח בין זרועות המניפה",
      "תעד נפח כולל לאזור",
    ],
    pitfalls: ["חפיפת יתר במרכז", "איבוד אוריינטציה בשכבה"],
    reviewedByPhysician: false,
  },
  {
    id: "bolus",
    nameHe: "Bolus נקודתי",
    nameEn: "Bolus",
    summary: "הפקדת נפח ממוקד לתמיכה או להרמה נקודתית.",
    whenToUse: ["תמיכה periosteal", "נקודות עוגן ב־midface"],
    howTo: [
      "אשר מיקום ועומק לפני ההזרקה",
      "הפקד נפח קטן ומדוד",
      "עסה בעדינות רק אם מתאים לחומר ולפרוטוקול",
    ],
    pitfalls: ["bolus גדול מדי", "מיקום שגוי בשכבה"],
    reviewedByPhysician: false,
  },
  {
    id: "microdroplet",
    nameHe: "Microdroplets",
    nameEn: "Microdroplets",
    summary: "טיפות זעירות לפיזור שטחי או לעבודה עדינה.",
    whenToUse: ["איכות עור", "אזורים דקים", "טכניקות מתקדמות נבחרות"],
    howTo: [
      "נפחים זעירים במרווחים מתוכננים",
      "הימנע מעומס שטחי שיוצר אי־סדירות",
    ],
    pitfalls: ["טינדינג", "אי־סדירות משטח"],
    reviewedByPhysician: false,
  },
  {
    id: "toxin-mapping",
    nameHe: "מיפוי נקודות טוקסין",
    nameEn: "Toxin mapping",
    summary: "תכנון נקודות ויחידות לפי דפוס שריר ומטרה אסתטית.",
    whenToUse: ["כל הזרקת טוקסין"],
    howTo: [
      "הערך במנוחה ובתנועה",
      "סמן נקודות לפני דילול/הזרקה",
      "תעד יחידות לנקודה ומותג",
    ],
    pitfalls: ["העתקה עיוורת של מפה גנרית", "אי־התאמה לעובי שריר"],
    reviewedByPhysician: false,
  },
];
