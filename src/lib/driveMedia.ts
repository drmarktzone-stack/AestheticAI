import { asset } from "./assets";

export type DriveVideo = {
  id: string;
  src: string;
  poster?: string;
  region: "lips" | "midface" | "jawline" | "toxin" | "cinematic";
  title: { he: string; ar: string; en: string };
  kind: "injection" | "animation3d" | "morph" | "timeline" | "cinematic" | "mapping";
};

export const DRIVE_VIDEOS: DriveVideo[] = [
  {
    id: "lips-ha-injection",
    src: asset("stitch/drive/videos/lips/ha_lip_filler_injection_simulation_202608241623.mp4"),
    region: "lips",
    kind: "injection",
    title: {
      he: "הזרקת HA לשפתיים — סימולציה",
      ar: "حقن HA للشفاه — محاكاة",
      en: "HA lip filler injection — simulation",
    },
  },
  {
    id: "lips-3d-animation",
    src: asset("stitch/drive/videos/lips/lips_filler_3d_medical_animation_202608241645.mp4"),
    region: "lips",
    kind: "animation3d",
    title: {
      he: "אנימציה רפואית תלת־ממד — שפתיים",
      ar: "رسوم طبية ثلاثية الأبعاد — الشفاه",
      en: "3D medical animation — lips",
    },
  },
  {
    id: "midface-cheeks-3d",
    src: asset("stitch/drive/videos/midface/medical_3d_animation_of_cheeks_202608241648.mp4"),
    region: "midface",
    kind: "animation3d",
    title: {
      he: "אנימציית לחיים תלת־ממד",
      ar: "رسوم الخدود ثلاثية الأبعاد",
      en: "Cheeks 3D medical animation",
    },
  },
  {
    id: "jawline-contour",
    src: asset("stitch/drive/videos/jawline/jawline_contouring_simulation_pr_202608241625.mp4"),
    region: "jawline",
    kind: "injection",
    title: {
      he: "סימולציית קונטור קו לסת",
      ar: "محاكاة تحديد خط الفك",
      en: "Jawline contouring simulation",
    },
  },
  {
    id: "toxin-glabella-map",
    src: asset("stitch/drive/videos/toxin/botulinum_toxin_glabella_mapping_202608241621.mp4"),
    region: "toxin",
    kind: "mapping",
    title: {
      he: "מיפוי טוקסין — גלאבלה",
      ar: "تخطيط التوكسين — الجبينة",
      en: "Botulinum toxin — glabella mapping",
    },
  },
  {
    id: "toxin-periocular",
    src: asset("stitch/drive/videos/toxin/botulinum_toxin_periocular_injec_202608241630.mp4"),
    region: "toxin",
    kind: "injection",
    title: {
      he: "הזרקת טוקסין — סביב העיניים",
      ar: "حقن التوكسين — حول العين",
      en: "Botulinum toxin — periocular injection",
    },
  },
  {
    id: "toxin-crows",
    src: asset("stitch/drive/videos/toxin/toxin_injection_crow_s_feet_202608241637.mp4"),
    region: "toxin",
    kind: "injection",
    title: {
      he: "הזרקת טוקסין — עין עורב",
      ar: "حقن التوكسين — أقدام الغراب",
      en: "Toxin injection — crow's feet",
    },
  },
  {
    id: "toxin-sim",
    src: asset("stitch/drive/videos/toxin/medical_simulation_of_botulinum_202608241632.mp4"),
    region: "toxin",
    kind: "animation3d",
    title: {
      he: "סימולציה רפואית — בוטולינום",
      ar: "محاكاة طبية — البوتولينوم",
      en: "Medical simulation — botulinum",
    },
  },
  {
    id: "cinematic-clinic",
    src: asset("stitch/drive/videos/cinematic/hailuo_video_continue_the_same_cinematic_cl_548260946387894280.mp4"),
    region: "cinematic",
    kind: "cinematic",
    title: {
      he: "פתיחה קולנועית — קליניקה",
      ar: "افتتاح سينمائي — العيادة",
      en: "Cinematic clinic intro",
    },
  },
  {
    id: "clinical-sim-aesthetic",
    src: asset("stitch/drive/videos/cinematic/clinical_simulation_for_aestheti_202608241620.mp4"),
    region: "cinematic",
    kind: "cinematic",
    title: {
      he: "סימולציה קלינית אסתטית",
      ar: "محاكاة سريرية تجميلية",
      en: "Clinical aesthetic simulation",
    },
  },
  {
    id: "morph-ba",
    src: asset("stitch/drive/videos/cinematic/pixverse_v5.6_image_text_360p_smooth_morph_vid.mp4"),
    region: "lips",
    kind: "morph",
    title: {
      he: "מעבר חלק לפני→אחרי",
      ar: "تحول سلس قبل→بعد",
      en: "Smooth before→after morph",
    },
  },
  {
    id: "timelapse-clinic",
    src: asset("stitch/drive/videos/cinematic/pixverse_v5.6_image_text_360p_timelapse_clinic.mp4"),
    region: "cinematic",
    kind: "timeline",
    title: {
      he: "טיימלאפס קליני",
      ar: "تصوير متقطع سريري",
      en: "Clinical timelapse",
    },
  },
  {
    id: "cinematic-premium-1",
    src: asset("stitch/drive/videos/cinematic/pixverse_v5.6_image_text_360p_10s_premium_medi.mp4"),
    region: "cinematic",
    kind: "cinematic",
    title: {
      he: "קליניקה — פרימיום 1",
      ar: "العيادة — بريميوم 1",
      en: "Clinic — premium reel 1",
    },
  },
  {
    id: "cinematic-premium-2",
    src: asset("stitch/drive/videos/cinematic/pixverse_v5.6_image_text_360p_10s_premium_medi-2.mp4"),
    region: "cinematic",
    kind: "cinematic",
    title: {
      he: "קליניקה — פרימיום 2",
      ar: "العيادة — بريميوم 2",
      en: "Clinic — premium reel 2",
    },
  },
  {
    id: "cinematic-premium-3",
    src: asset("stitch/drive/videos/cinematic/pixverse_v5.6_image_text_360p_10s_premium_medi-3.mp4"),
    region: "cinematic",
    kind: "cinematic",
    title: {
      he: "קליניקה — פרימיום 3",
      ar: "العيادة — بريميوم 3",
      en: "Clinic — premium reel 3",
    },
  },
  {
    id: "cinematic-premium-4",
    src: asset("stitch/drive/videos/cinematic/pixverse_v5.6_image_text_360p_10s_premium_medi-4.mp4"),
    region: "cinematic",
    kind: "cinematic",
    title: {
      he: "קליניקה — פרימיום 4",
      ar: "العيادة — بريميوم 4",
      en: "Clinic — premium reel 4",
    },
  },
  {
    id: "cinematic-pika-a",
    src: asset("stitch/drive/videos/cinematic/pika-bd0058a5-6ec8-45ba-a993-a7f31b1a6259.mp4"),
    region: "cinematic",
    kind: "cinematic",
    title: {
      he: "ריל קליני A",
      ar: "مقطع سريري A",
      en: "Clinical reel A",
    },
  },
  {
    id: "cinematic-pika-b",
    src: asset("stitch/drive/videos/cinematic/pika-59567d7d-a434-4502-8e9c-c2d37fad24d8.mp4"),
    region: "cinematic",
    kind: "cinematic",
    title: {
      he: "ריל קליני B",
      ar: "مقطع سريري B",
      en: "Clinical reel B",
    },
  },
];

export type DriveImage = {
  id: string;
  src: string;
  region: "lips" | "clinical" | "storyboard";
  title: { he: string; ar: string; en: string };
  tag: { he: string; ar: string; en: string };
};

export const DRIVE_IMAGES: DriveImage[] = [
  {
    id: "lips-rest",
    src: asset(
      "stitch/drive/images/lips/base_promptclose-up_frontal_view_of_adult_female_lips_at_res.jpg",
    ),
    region: "lips",
    title: {
      he: "שפתיים במנוחה — מבט קדמי",
      ar: "شفاه في الراحة — أمامي",
      en: "Lips at rest — frontal",
    },
    tag: { he: "בסיס", ar: "أساس", en: "Baseline" },
  },
  {
    id: "lips-before-ha",
    src: asset(
      "stitch/drive/images/lips/base_promptsame_adult_female_subject_lips_before_hyaluronic.jpg",
    ),
    region: "lips",
    title: {
      he: "לפני HA — אותו נבדק",
      ar: "قبل HA — نفس الشخص",
      en: "Before HA — same subject",
    },
    tag: { he: "לפני", ar: "قبل", en: "Before" },
  },
  {
    id: "clinical-edu",
    src: asset(
      "stitch/drive/images/clinical/clinical_medical_photography_for_aesthetic_medicine_educatio.jpg",
    ),
    region: "clinical",
    title: {
      he: "צילום רפואי חינוכי",
      ar: "تصوير طبي تعليمي",
      en: "Educational medical photography",
    },
    tag: { he: "קליני", ar: "سريري", en: "Clinical" },
  },
  {
    id: "clinical-macro-1",
    src: asset(
      "stitch/drive/images/clinical/high-level-description-a-macro-photograp_11xogcw_x5ekbahzqsifrg_qg2ytfvcsfgwyn2e.jpg",
    ),
    region: "clinical",
    title: {
      he: "מאקרו קליני 1",
      ar: "ماكرو سريري 1",
      en: "Clinical macro 1",
    },
    tag: { he: "מאקרו", ar: "ماكرو", en: "Macro" },
  },
  {
    id: "clinical-macro-2",
    src: asset(
      "stitch/drive/images/clinical/high-level-description-a-macro-photograp_cp00hxvjvfi2ykb-z1-psw_qg2ytfvcsfgwyn2e.jpg",
    ),
    region: "clinical",
    title: {
      he: "מאקרו קליני 2",
      ar: "ماكرو سريري 2",
      en: "Clinical macro 2",
    },
    tag: { he: "מאקרו", ar: "ماكرو", en: "Macro" },
  },
  {
    id: "clinical-close-1",
    src: asset(
      "stitch/drive/images/clinical/high-level-description-a-clinical-close-_oncb7677vocnswvjwupngg_j09-fzzuqd62gj4j.jpg",
    ),
    region: "clinical",
    title: {
      he: "תקריב קליני 1",
      ar: "لقطة سريرية قريبة 1",
      en: "Clinical close-up 1",
    },
    tag: { he: "תקריב", ar: "قريب", en: "Close-up" },
  },
  {
    id: "storyboard-lips",
    src: asset("stitch/drive/images/storyboard/medical_animation_storyboard_gri_202608241648.jpg"),
    region: "storyboard",
    title: {
      he: "סטוריבורד אנימציה רפואית",
      ar: "لوحة قصة للرسوم الطبية",
      en: "Medical animation storyboard",
    },
    tag: { he: "תכנון", ar: "تخطيط", en: "Planning" },
  },
];

export function videosForRegion(region: DriveVideo["region"]) {
  return DRIVE_VIDEOS.filter((v) => v.region === region);
}

export function featuredLipsVideos() {
  return DRIVE_VIDEOS.filter((v) => v.region === "lips");
}

export function featuredMidfaceVideos() {
  return videosForRegion("midface");
}

export function featuredJawlineVideos() {
  return videosForRegion("jawline");
}

export function injectionVideos() {
  return DRIVE_VIDEOS.filter((v) => v.kind === "injection" || v.kind === "animation3d");
}
