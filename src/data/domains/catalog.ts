import type { DomainProduct } from "../types";

const L = (he: string, ar: string, en: string) => ({ he, ar, en });
const LA = (he: string[], ar: string[], en: string[]) => ({ he, ar, en });

export const DOMAIN_PRODUCTS: DomainProduct[] = [
  // ═══ THREADS ═══
  {
    id: "pdo-mint",
    domain: "threads",
    companyId: "promoitalia",
    nameHe: "PDO Mint / Korean PDO threads",
    nameAr: "خيوط PDO Mint",
    nameEn: "PDO Mint / Korean PDO threads",
    characteristics: LA(
      ["PDO biodegradable", "SASP/UASP/OASP vectors", "SVM layer", "Lift + collagen"],
      ["PDO", "متجهات SASP", "طبقة SVM"],
      ["PDO biodegradable", "SASP/UASP/OASP vectors", "SVM plane", "Lift + collagen"],
    ),
    whyRecommended: L(
      "Non-surgical lift adjunct — cite pdo-thread-consensus; training mandatory.",
      "رفع غير جراحي — تدريب إلزامي.",
      "Non-surgical lift — cite PDO consensus; training mandatory.",
    ),
    typicalUses: ["midface lift", "jawline", "neck", "body (trained)"],
    doseNotes: ["Thread count per vector per IFU; avoid over-tension; spacing from deep filler 2–4 weeks"],
    citationIds: ["pdo-thread-consensus", "combined-treatment-timing"],
    reviewedByPhysician: false,
  },
  {
    id: "plla-threads",
    domain: "threads",
    nameHe: "PLLA / PCL barbed threads",
    nameAr: "خيوط PLLA/PCL",
    nameEn: "PLLA / PCL barbed threads",
    characteristics: LA(
      ["Longer collagen stimulus vs PDO", "Barbed cog design", "Higher lift force — complication risk"],
      ["PLLA/PCL", "Barbed", "رفع أقوى"],
      ["Longer collagen vs PDO", "Barbed cogs", "Higher lift — higher risk"],
    ),
    whyRecommended: L(
      "Stronger lift than PDO — specialist training; know extraction protocol.",
      "رفع أقوى — تدريب متخصص.",
      "Stronger lift — specialist training required.",
    ),
    typicalUses: ["jawline", "midface", "neck lift"],
    doseNotes: ["Fewer threads than PDO often; assess skin thickness; antibiotic prophylaxis per protocol"],
    citationIds: ["pdo-thread-consensus"],
    reviewedByPhysician: false,
  },

  // ═══ PEELS ═══
  {
    id: "peel-aha-bha",
    domain: "peels",
    nameHe: "AHA / BHA superficial peel",
    nameAr: "تقشير AHA/BHA سطحي",
    nameEn: "AHA / BHA superficial peel",
    characteristics: LA(
      ["Glycolic 20–70%", "Salicylic 20–30%", "Superficial stratum corneum", "Minimal downtime"],
      ["سطحي", "تقشير خفيف"],
      ["Glycolic/salicylic", "Superficial", "Minimal downtime"],
    ),
    whyRecommended: L(
      "Skin quality, acne, melasma adjunct — Fitzpatrick I–III safest; cite peel-depth-brooks.",
      "جودة البشرة — Fitzpatrick I–III.",
      "Skin quality adjunct — Fitzpatrick I–III safest; cite Brooks classification.",
    ),
    typicalUses: ["texture", "acne", "pigment light", "prep for events"],
    doseNotes: ["Neutralize per protocol; SPF mandatory; stop retinoids 5–7 days pre"],
    citationIds: ["peel-depth-brooks", "combined-treatment-timing"],
    reviewedByPhysician: false,
  },
  {
    id: "peel-tca-medium",
    domain: "peels",
    nameHe: "TCA medium peel (10–35%)",
    nameAr: "تقشير TCA متوسط",
    nameEn: "TCA medium peel (10–35%)",
    characteristics: LA(
      ["Medium depth reticular dermis", "Frost endpoint", "5–7 days downtime", "PIH risk IV–VI"],
      ["TCA متوسط", "تقشير Frost", "خطر PIH"],
      ["Medium depth", "Frost endpoint", "PIH risk higher types"],
    ),
    whyRecommended: L(
      "Rhytids, solar damage — wait 2–4 weeks before filler per combined-treatment-timing.",
      "تجاعيد — انتظار قبل الفيلر.",
      "Rhytids/solar damage — wait before filler per global timing consensus.",
    ),
    typicalUses: ["perioral rhytids", "face/neck photoaging"],
    doseNotes: ["TCA 10–15% repeated vs 25–35% single; pre-treat IV–VI carefully"],
    citationIds: ["peel-depth-brooks", "combined-treatment-timing"],
    reviewedByPhysician: false,
  },
  {
    id: "peel-jessner",
    domain: "peels",
    nameHe: "Jessner / combination peel",
    nameAr: "Jessner",
    nameEn: "Jessner / combination peel",
    characteristics: LA(
      ["Salicylic + lactic + resorcinol", "Medium-superficial bridge", "Acne/melasma protocols"],
      ["مزيج", "حب الشباب"],
      ["Combination acids", "Acne/melasma"],
    ),
    whyRecommended: L(
      "Versatile medium-superficial — layer with retinoid home care.",
      "متعدد الاستخدامات.",
      "Versatile medium-superficial bridge peel.",
    ),
    typicalUses: ["acne", "melasma (careful)", "texture"],
    doseNotes: ["1–3 coats per tolerance; monitor frost"],
    citationIds: ["peel-depth-brooks"],
    reviewedByPhysician: false,
  },

  // ═══ HAIR ═══
  {
    id: "hair-prp",
    domain: "hair",
    nameHe: "PRP / PRF scalp",
    nameAr: "PRP/PRF فروة الرأس",
    nameEn: "PRP / PRF scalp",
    characteristics: LA(
      ["Autologous platelets", "Growth factors", "Androgenetic alopecia adjunct", "3–4 sessions q4–6 weeks"],
      ["PRP", "3–4 جلسات", "تساقط"],
      ["Autologous GF", "3–4 sessions q4–6 weeks", "AGA adjunct"],
    ),
    whyRecommended: L(
      "Evidence for AGA maintenance — cite hair-meso-consensus; not transplant replacement.",
      "ملحق لتساقط الشعر.",
      "AGA maintenance evidence — cite hair consensus; adjunct not replacement.",
    ),
    typicalUses: ["AGA", "telogen effluvium adjunct", "post-transplant support"],
    doseNotes: ["10–20 ml draw typical; scalp microinjections 0.05–0.1 ml/point; series protocol"],
    citationIds: ["hair-meso-consensus"],
    reviewedByPhysician: false,
  },
  {
    id: "hair-meso-cocktail",
    domain: "hair",
    nameHe: "Hair mesotherapy (minoxidil/peptides/PN)",
    nameAr: "Mesotherapy شعر",
    nameEn: "Hair mesotherapy cocktails",
    characteristics: LA(
      ["Minoxidil micro-dose", "Peptides", "PN/PDRN adjunct", "Monthly series"],
      ["مينوكسidil", "ببتides", "PN"],
      ["Minoxidil micro", "Peptides", "PN adjunct"],
    ),
    whyRecommended: L(
      "Adjunct to medical therapy — document ingredients; watch systemic minoxidil load.",
      "ملحق للعلاج الطبي.",
      "Adjunct to medical therapy — document cocktail ingredients.",
    ),
    typicalUses: ["AGA", "thinning", "scalp quality"],
    doseNotes: ["0.05–0.1 ml per point; 4–6 sessions; combine with oral/topical per MD"],
    citationIds: ["hair-meso-consensus"],
    reviewedByPhysician: false,
  },
  {
    id: "hair-exosomes",
    domain: "hair",
    nameHe: "Exosomes scalp (frontier)",
    nameAr: "Exosomes للشعر",
    nameEn: "Scalp exosomes (frontier)",
    characteristics: LA(
      ["EV regenerative class", "Evidence evolving", "Brand-specific protocols", "Regulatory variable"],
      ["حدودي", "أدلة متطورة"],
      ["Frontier EV class", "Evolving evidence", "Regulatory variable"],
    ),
    whyRecommended: L(
      "Frontier — verify local approval + supplier QC; not substitute for proven AGA meds.",
      "حدودي — تحقق من الموافقة.",
      "Frontier — verify approval/QC; not substitute for proven AGA therapy.",
    ),
    typicalUses: ["AGA adjunct", "post-procedure scalp"],
    doseNotes: ["Micro-dose brand-specific; series 3–4; document lot"],
    citationIds: ["hair-meso-consensus"],
    reviewedByPhysician: false,
  },

  // ═══ BODY ═══
  {
    id: "body-sculptra-butt",
    domain: "body",
    companyId: "galderma",
    nameHe: "Sculptra body / buttocks (IFU/training)",
    nameAr: "Sculptra للجسم",
    nameEn: "Sculptra body / buttocks",
    characteristics: LA(
      ["PLLA large volume", "Gradual collagen", "Multi-vial sessions", "Specialist training"],
      ["PLLA", "جلسات متعددة"],
      ["PLLA large volume", "Multi-session", "Specialist training"],
    ),
    whyRecommended: L(
      "Body contour gradual — cite sculptra-dilution + Lanluma-class alternatives.",
      "محاكاة تدريجية للجسم.",
      "Gradual body contour — cite Sculptra dilution protocol.",
    ),
    typicalUses: ["buttocks", "hip dips", "cellulite adjunct"],
    doseNotes: ["Vials per session per IFU; massage; realistic series expectations"],
    citationIds: ["sculptra-dilution"],
    materialId: "sculptra",
    reviewedByPhysician: false,
  },
  {
    id: "body-hyperhidrosis",
    domain: "body",
    nameHe: "Hyperhidrosis toxin (axilla/palm)",
    nameAr: "فرط التعرق — توكسين",
    nameEn: "Hyperhidrosis botulinum toxin",
    characteristics: LA(
      ["Intradermal grid", "Minor test mapping", "~50 U/axilla Botox-class", "Palmar anesthesia"],
      ["شبكة داخل الأدمة", "50 U/إبط"],
      ["Intradermal grid", "~50 U/axilla ona-class", "Palmar anesthesia"],
    ),
    whyRecommended: L(
      "Therapeutic gold standard axilla — cite hyperhidrosis-botox IFU.",
      "معيار فرط التعرق.",
      "Therapeutic gold standard axilla — cite global IFU.",
    ),
    typicalUses: ["axillary HH", "palmar HH", "plantar HH (expert)"],
    doseNotes: ["50–100 U bilateral axilla class; 40–60 U/palm; repeat q6–12 months"],
    citationIds: ["hyperhidrosis-botox"],
    materialId: "botox",
    reviewedByPhysician: false,
  },
  {
    id: "body-neauvia",
    domain: "body",
    nameHe: "Neauvia body / hand volume",
    nameAr: "Neauvia للجسم",
    nameEn: "Neauvia body / hand HA",
    characteristics: LA(
      ["Dual-phase HA for body", "Hand rejuvenation", "Buttocks (IFU)"],
      ["HA للجسم", "اليد"],
      ["Body HA", "Hand rejuvenation"],
    ),
    whyRecommended: L(
      "Body HA alternative to PLLA — product-specific IFU only.",
      "HA للجسم.",
      "Body HA — strict product IFU.",
    ),
    typicalUses: ["hands", "buttocks contour", "decolletage"],
    doseNotes: ["Larger volumes possible — vascular awareness body zones"],
    citationIds: [],
    materialId: "neauvia-intense",
    reviewedByPhysician: false,
  },

  // ═══ LIPOLYTICS ═══
  {
    id: "kybella",
    domain: "lipolytics",
    companyId: "allergan-abbvie",
    nameHe: "Kybella (deoxycholic acid) submental",
    nameAr: "Kybella",
    nameEn: "Kybella (deoxycholic acid)",
    characteristics: LA(
      ["FDA submental label", "0.2 ml/injection point", "Swelling significant", "Up to 6 sessions"],
      ["FDA", "0.2 ml/نقطة", "6 جلسات"],
      ["FDA submental", "0.2 ml/point", "Up to 6 sessions"],
    ),
    whyRecommended: L(
      "Non-surgical submental fat — cite kybella-fda; not for general body lipolysis off-label without evidence.",
      "دهون تحت الذقن.",
      "Submental fat reduction — cite FDA protocol.",
    ),
    typicalUses: ["submental fat", "double chin"],
    doseNotes: ["≤50 injections/session; ≥1 month between; counsel swelling"],
    citationIds: ["kybella-fda"],
    reviewedByPhysician: false,
  },
  {
    id: "ppc-meso",
    domain: "lipolytics",
    nameHe: "PPC / lipolysis mesotherapy (off-label regions vary)",
    nameAr: "PPC meso",
    nameEn: "PPC lipolysis mesotherapy",
    characteristics: LA(
      ["Phosphatidylcholine/deoxycholate cocktails", "Regulatory status varies", "Nodules risk"],
      ["PPC", "تنظيم متغير"],
      ["PPC cocktails", "Variable regulation", "Nodule risk"],
    ),
    whyRecommended: L(
      "Use only where legally approved + trained — prefer Kybella/Sculptra body where evidence stronger.",
      "فقط حيث معتمد قانونياً.",
      "Only where legally approved — prefer stronger-evidence alternatives.",
    ),
    typicalUses: ["local fat pockets (where legal)"],
    doseNotes: ["Small aliquots; series; monitor nodules"],
    citationIds: [],
    reviewedByPhysician: false,
  },

  // ═══ DEVICES ═══
  {
    id: "device-hifu",
    domain: "devices",
    companyId: "device-leaders",
    nameHe: "HIFU (Ulthera / Ultraformer class)",
    nameAr: "HIFU",
    nameEn: "HIFU (Ulthera / Ultraformer class)",
    characteristics: LA(
      ["SMAS/deep fascia targeting", "Non-invasive lift", "Linear/circular cartridges", "Fitzpatrick limits"],
      ["SMAS", "رفع", "Fitzpatrick"],
      ["SMAS targeting", "Non-invasive lift", "Fitzpatrick limits"],
    ),
    whyRecommended: L(
      "Device lift layer — cite hifu-safety; wait before filler or stage carefully.",
      "رفع بالجهاز.",
      "Device lift — cite safety guidelines; filler timing.",
    ),
    typicalUses: ["brow lift", "jawline", "neck"],
    doseNotes: ["Lines/vectors per IFU; energy by skin thickness; avoid over-treatment"],
    citationIds: ["hifu-safety", "combined-treatment-timing"],
    reviewedByPhysician: false,
  },
  {
    id: "device-rf-microneedling",
    domain: "devices",
    nameHe: "RF microneedling (Morpheus8 / Secret RF class)",
    nameAr: "RF microneedling",
    nameEn: "RF microneedling",
    characteristics: LA(
      ["Fractional RF + needles", "Skin tightening + texture", "Adjustable depth", "Downtime variable"],
      ["RF + إبر", "شد"],
      ["Fractional RF + needles", "Tightening + texture"],
    ),
    whyRecommended: L(
      "Skin quality + mild laxity — synergize with PN/Profhilo after healing.",
      "جودة الجلد.",
      "Skin quality + laxity — synergize with PN/Profhilo post-healing.",
    ),
    typicalUses: ["face/neck laxity", "acne scars", "texture"],
    doseNotes: ["Depth 1–4 mm per area; 1–3 sessions; SPF critical"],
    citationIds: ["hifu-safety", "combined-treatment-timing"],
    reviewedByPhysician: false,
  },
  {
    id: "device-cryolipolysis",
    domain: "devices",
    nameHe: "Cryolipolysis (CoolSculpting class)",
    nameAr: "Cryolipolysis",
    nameEn: "Cryolipolysis",
    characteristics: LA(
      ["Apoptosis fat cells", "Non-invasive contour", "Paradoxical adipose hyperplasia rare", "Multiple cycles"],
      ["تبريد", "دهون"],
      ["Fat apoptosis", "Non-invasive", "PAH rare risk"],
    ),
    whyRecommended: L(
      "Body contour non-surgical — not substitute for injectable gluteal volume.",
      "نحت الجسم.",
      "Body contour device — not gluteal volume substitute.",
    ),
    typicalUses: ["abdomen flanks", "submental (applicators vary)"],
    doseNotes: ["Cycles per bulge; 8–12 weeks between; counsel PAH risk"],
    citationIds: ["combined-treatment-timing"],
    reviewedByPhysician: false,
  },
  {
    id: "device-laser-fractional",
    domain: "devices",
    companyId: "device-leaders",
    nameHe: "Fractional laser (Fraxel / CO2 class)",
    nameAr: "Laser fractional",
    nameEn: "Fractional laser resurfacing",
    characteristics: LA(
      ["Ablative vs non-ablative", "Collagen remodeling", "PIH risk", "Downtime days–weeks"],
      ["CO2/Fraxel", "PIH"],
      ["Ablative/non-ablative", "PIH risk", "Variable downtime"],
    ),
    whyRecommended: L(
      "Resurfacing gold standard class — Fitzpatrick protocol + filler timing 2–4 weeks.",
      "تجديد سطحي.",
      "Resurfacing standard — Fitzpatrick + filler timing.",
    ),
    typicalUses: ["rhytids", "scars", "pigment"],
    doseNotes: ["Test patch IV–VI; ablative requires downtime counseling"],
    citationIds: ["hifu-safety", "peel-depth-brooks", "combined-treatment-timing"],
    reviewedByPhysician: false,
  },
  {
    id: "device-emsculpt",
    domain: "devices",
    nameHe: "HIFEM / RF body (Emsculpt / Emsculpt Neo class)",
    nameAr: "HIFEM body",
    nameEn: "HIFEM body contour",
    characteristics: LA(
      ["Muscle stimulation + fat (Neo RF)", "Non-invasive", "Series 4–6", "Maintenance"],
      ["HIFEM", "عضلات"],
      ["Muscle + fat Neo", "Series protocol"],
    ),
    whyRecommended: L(
      "Muscle definition adjunct — not facial injectable substitute.",
      "تحديد عضلات.",
      "Muscle definition adjunct — body focus.",
    ),
    typicalUses: ["abdomen", "buttocks", "arms"],
    doseNotes: ["4–6 sessions q2–3 days; maintenance q2–3 months"],
    citationIds: [],
    reviewedByPhysician: false,
  },
];

export const DOMAIN_META: Record<
  string,
  { he: string; ar: string; en: string; route: string }
> = {
  injectables: {
    he: "הזרקות (HA, טוקסין, ביוסטימ, PN)",
    ar: "الحقن",
    en: "Injectables",
    route: "/materials",
  },
  threads: { he: "Threads", ar: "Threads", en: "Threads", route: "/world/threads" },
  peels: { he: "Peels", ar: "Peels", en: "Chemical peels", route: "/world/peels" },
  hair: { he: "Hair", ar: "Hair", en: "Hair restoration", route: "/world/hair" },
  body: { he: "Body", ar: "Body", en: "Body aesthetics", route: "/world/body" },
  devices: { he: "Devices", ar: "Devices", en: "Energy devices", route: "/world/devices" },
  lipolytics: { he: "Lipolytics", ar: "Lipolytics", en: "Fat dissolving", route: "/world/lipolytics" },
  combinations: {
    he: "Combinations",
    ar: "Combinations",
    en: "Treatment combinations",
    route: "/protocols",
  },
};

export function productsForDomain(domain: string) {
  return DOMAIN_PRODUCTS.filter((p) => p.domain === domain);
}

export function getDomainProduct(id: string) {
  return DOMAIN_PRODUCTS.find((p) => p.id === id);
}
