/** Stitch / Drive clinical assets under public/stitch */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const STITCH = {
  heroClinic: asset("stitch/hero-clinic.png"),
  heroIntro: asset("stitch/hero-intro.png"),
  cinematicIntro: asset("stitch/cinematic/intro.png"),
  cinematicClinic: asset("stitch/cinematic/clinic.png"),
  injection: asset("stitch/clinical/injection.png"),
  treatment: asset("stitch/clinical/treatment.png"),
  profile: asset("stitch/clinical/profile.png"),
  beforeAfter: asset("stitch/clinical/before-after.png"),
  lips: [
    asset("stitch/clinical/lips-1.png"),
    asset("stitch/clinical/lips-2.png"),
    asset("stitch/clinical/lips-3.png"),
    asset("stitch/clinical/lips-4.png"),
    asset("stitch/clinical/lips-5.png"),
  ],
  midface: [
    asset("stitch/clinical/midface-1.png"),
    asset("stitch/clinical/midface-2.png"),
    asset("stitch/clinical/midface-close.png"),
  ],
  temple: asset("stitch/clinical/temple.png"),
  periocular: asset("stitch/clinical/periocular.png"),
  extreme: asset("stitch/clinical/extreme.png"),
  side: [asset("stitch/clinical/side-1.png"), asset("stitch/clinical/side-2.png")],
  timeline: [
    { id: "d1", label: "יום 1", sub: "נפיחות קלה", src: asset("stitch/timeline/lips-day1.png") },
    { id: "d7", label: "יום 7", sub: "תוצאה אופטימלית", src: asset("stitch/timeline/lips-day7.png") },
    { id: "m3", label: "חודש 3", sub: "יציבות", src: asset("stitch/timeline/lips-month3.png") },
    { id: "m6", label: "חודש 6", sub: "ספיגה הדרגתית", src: asset("stitch/timeline/lips-month6.png") },
  ],
  animation: [
    asset("stitch/animation/frame-1.png"),
    asset("stitch/animation/frame-2.png"),
    asset("stitch/animation/frame-3.png"),
    asset("stitch/animation/frame-4.png"),
    asset("stitch/animation/frame-5.png"),
  ],
} as const;

export const LIBRARY_SECTIONS = [
  {
    id: "lips",
    title: "שפתיים",
    items: [
      { title: "סימולציית הזרקה מדורגת", tag: "תקריב קליני", src: STITCH.lips[0] },
      { title: "יום 1 — נפיחות קלה", tag: "שלב דלקתי", src: STITCH.timeline[0].src },
      { title: "יום 7 — תוצאה אופטימלית", tag: "אינטגרציה", src: STITCH.timeline[1].src },
      { title: "חודש 3 — יציבות", tag: "מעקב", src: STITCH.timeline[2].src },
      { title: "חודש 6 — ספיגה הדרגתית", tag: "פירוק מטבולי", src: STITCH.timeline[3].src },
      { title: "סימולציית הזרקה — מבט על", tag: "תכנון אנטומי", src: STITCH.lips[2] },
      { title: "סימולציית הזרקה — פרופיל", tag: "ניתוח נפחים", src: STITCH.lips[3] },
    ],
  },
  {
    id: "midface",
    title: "לחיים ומרכז הפנים",
    items: [
      { title: "לחיים — טכניקת קנולה מניפה", tag: "פרוצדורה", src: STITCH.midface[0] },
      { title: "לחיים — בולוס ממוקד מחט", tag: "תמיכה מבנית", src: STITCH.midface[1] },
      { title: "לחיים — תקריב בולוס עמוק", tag: "קשת זיגומטית", src: STITCH.midface[2] },
      { title: "מיפוי וקטורים — מרכז הפנים", tag: "סימולציה קלינית", src: STITCH.injection },
    ],
  },
  {
    id: "temples",
    title: "רקות",
    items: [
      { title: "רקות — מילוי נפח (תקריב)", tag: "תכנון וביצוע", src: STITCH.temple },
      { title: "רקות — תמיכה אנטומית", tag: "פרופיל צד", src: STITCH.side[0] },
    ],
  },
  {
    id: "upperface",
    title: "גלאבלה וסביב העיניים",
    items: [
      { title: "גלאבלה — מיפוי טוקסין", tag: "נקודות הזרקה", src: STITCH.extreme },
      { title: "סביב העיניים — טוקסין", tag: "גישה שמרנית", src: STITCH.periocular },
    ],
  },
  {
    id: "jawline",
    title: "קו לסת",
    items: [
      { title: "קו לסת — קונטור וחידוד", tag: "תכנון זווית הלסת", src: STITCH.side[1] },
      { title: "פרופיל קליני — ניתוח נפחים", tag: "הערכה", src: STITCH.profile },
    ],
  },
] as const;
