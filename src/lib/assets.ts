/** Stitch / Drive / user Bing clinical assets under public/stitch */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

/** Physician-supplied Bing pack (lips MVP) — preferred over Stitch placeholders */
export const USER_LIPS = {
  anatomy: [
    asset("stitch/user/lips/anatomy/lips_anatomy_front_d.jpg"),
    asset("stitch/user/lips/anatomy/lips_anatomy_front_a.jpg"),
    asset("stitch/user/lips/anatomy/lips_anatomy_front_c.jpg"),
    asset("stitch/user/lips/anatomy/lips_anatomy_front_b.jpg"),
  ],
  before: asset("stitch/user/lips/before_after/lips_before.jpg"),
  after: asset("stitch/user/lips/before_after/lips_after.jpg"),
  beforeAfterGrid: asset("stitch/user/lips/before_after/lips_ba_grid.jpg"),
  beforeAfterAlts: [
    asset("stitch/user/lips/before_after/lips_ba_01.jpg"),
    asset("stitch/user/lips/before_after/lips_ba_02.jpg"),
    asset("stitch/user/lips/before_after/lips_ba_03.jpg"),
  ],
  timeline: [
    {
      id: "d1",
      label: "יום 1",
      labelAr: "يوم 1",
      labelEn: "Day 1",
      sub: "נפיחות קלה",
      subAr: "تورم خفيف",
      subEn: "Mild edema",
      src: asset("stitch/user/lips/timeline/lips_day1.jpg"),
    },
    {
      id: "d7",
      label: "יום 7",
      labelAr: "يوم 7",
      labelEn: "Day 7",
      sub: "תוצאה אופטימלית",
      subAr: "نتيجة مبكرة مثالية",
      subEn: "Optimal early result",
      src: asset("stitch/user/lips/timeline/lips_day7.jpg"),
    },
    {
      id: "m3",
      label: "חודש 3",
      labelAr: "شهر 3",
      labelEn: "Month 3",
      sub: "יציבות",
      subAr: "استقرار",
      subEn: "Stability",
      src: asset("stitch/user/lips/timeline/lips_month3.jpg"),
    },
    {
      id: "m6",
      label: "חודש 6",
      labelAr: "شهر 6",
      labelEn: "Month 6",
      sub: "ספיגה הדרגתית",
      subAr: "امتصاص تدريجي",
      subEn: "Gradual resorption",
      src: asset("stitch/user/lips/timeline/lips_month6.jpg"),
    },
  ],
  timelineGrid: asset("stitch/user/lips/timeline/lips_timeline_grid.jpg"),
  clinical: [
    asset("stitch/user/lips/clinical/clinic_01.jpg"),
    asset("stitch/user/lips/clinical/clinic_02.jpg"),
    asset("stitch/user/lips/clinical/clinic_03.jpg"),
    asset("stitch/user/lips/clinical/clinic_04.jpg"),
  ],
} as const;

export const STITCH = {
  heroClinic: asset("stitch/hero-clinic.png"),
  heroIntro: asset("stitch/hero-intro.png"),
  cinematicIntro: asset("stitch/cinematic/intro.png"),
  cinematicClinic: asset("stitch/cinematic/clinic.png"),
  injection: asset("stitch/clinical/injection.png"),
  treatment: asset("stitch/clinical/treatment.png"),
  profile: asset("stitch/clinical/profile.png"),
  atlasPlate: asset("stitch/clinical/profile.png"),
  beforeAfter: USER_LIPS.beforeAfterGrid,
  lips: [...USER_LIPS.anatomy],
  midface: [
    asset("stitch/clinical/midface-1.png"),
    asset("stitch/clinical/midface-2.png"),
    asset("stitch/clinical/midface-close.png"),
  ],
  temple: asset("stitch/clinical/temple.png"),
  periocular: asset("stitch/clinical/periocular.png"),
  extreme: asset("stitch/clinical/extreme.png"),
  side: [asset("stitch/clinical/side-1.png"), asset("stitch/clinical/side-2.png")],
  timeline: USER_LIPS.timeline.map((f) => ({
    id: f.id,
    label: f.label,
    sub: f.sub,
    src: f.src,
  })),
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
      { title: "אנטומיה — מבט קדמי", tag: "בסיס קליני", src: USER_LIPS.anatomy[0] },
      { title: "לפני טיפול", tag: "baseline", src: USER_LIPS.before },
      { title: "אחרי טיפול", tag: "תוצאה", src: USER_LIPS.after },
      { title: "לפני / אחרי", tag: "השוואה", src: USER_LIPS.beforeAfterGrid },
      { title: "יום 1 — נפיחות קלה", tag: "שלב דלקתי", src: USER_LIPS.timeline[0].src },
      { title: "יום 7 — תוצאה אופטימלית", tag: "אינטגרציה", src: USER_LIPS.timeline[1].src },
      { title: "חודש 3 — יציבות", tag: "מעקב", src: USER_LIPS.timeline[2].src },
      { title: "חודש 6 — ספיגה הדרגתית", tag: "פירוק מטבולי", src: USER_LIPS.timeline[3].src },
      { title: "טיימליין מלא", tag: "Day1→Month6", src: USER_LIPS.timelineGrid },
      { title: "סביבה קלינית", tag: "הקשר טיפול", src: USER_LIPS.clinical[0] },
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
