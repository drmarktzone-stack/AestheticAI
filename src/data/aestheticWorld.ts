/**
 * Compact aesthetic-world catalog for Protokol Mobile.
 * Mirrors the web Atlas: companies + why recommended + global protocol citations.
 * Educational drafts — physician must approve against IFU/local regulation.
 */

export type MobileCompany = {
  id: string;
  name: string;
  focus: string[];
  whyHe: string;
  whyEn: string;
  citationIds: string[];
  productNames: string[];
};

export type MobileCitation = {
  id: string;
  issuer: string;
  titleHe: string;
  titleEn: string;
  summaryHe: string;
  summaryEn: string;
};

export type MobileDomain = {
  id: string;
  domain: string;
  nameHe: string;
  nameEn: string;
  whyHe: string;
  whyEn: string;
  citationIds: string[];
};

export const MOBILE_COMPANIES: MobileCompany[] = [
  {
    id: "allergan-abbvie",
    name: "Allergan Aesthetics (AbbVie)",
    focus: ["Juvederm Vycross", "Botox", "HArmonyCa", "MD Codes"],
    whyHe: "Portfolio מלא + MD Codes — baseline למרפאות premium.",
    whyEn: "Full portfolio + MD Codes — premium clinic baseline.",
    citationIds: ["md-codes", "preempt-migraine", "kybella-fda"],
    productNames: ["Voluma", "Volux", "Vollure", "Volbella", "Volite", "Botox", "HArmonyCa"],
  },
  {
    id: "galderma",
    name: "Galderma",
    focus: ["Restylane OBT", "Sculptra", "Dysport", "GAIN"],
    whyHe: "מומלץ ל-Sculptra, Kysse, Dysport — GAIN להכשרה.",
    whyEn: "Recommended for Sculptra, Kysse, Dysport — GAIN training.",
    citationIds: ["galderma-gain", "sculptra-dilution", "toxin-unit-conversion"],
    productNames: ["Kysse", "Lyft", "Defyne", "Refyne", "Sculptra", "Dysport", "Skinbooster"],
  },
  {
    id: "merz",
    name: "Merz Aesthetics",
    focus: ["Belotero", "Radiesse", "Xeomin", "Ultherapy"],
    whyHe: "Perioral finesse, CaHA, toxin ללא חלבונים מורכבים.",
    whyEn: "Perioral finesse, CaHA, naked toxin option.",
    citationIds: ["tyndall-consensus", "hifu-safety"],
    productNames: ["Belotero Balance/Intense/Volume", "Radiesse", "Xeomin"],
  },
  {
    id: "teoxane",
    name: "Teoxane",
    focus: ["Teosyal RHA", "Redensity"],
    whyHe: "אזורים דינמיים + periorbital — חלופה ל-Vycross/OBT.",
    whyEn: "Dynamic areas + periorbital — Vycross/OBT alternative.",
    citationIds: ["md-codes"],
    productNames: ["RHA 2/3/4", "Redensity 2"],
  },
  {
    id: "revance",
    name: "Revance",
    focus: ["RHA US", "Daxxify"],
    whyHe: "טוקסין ארוך טווח — המרת יחידות חובה.",
    whyEn: "Long-acting toxin — mandatory unit conversion.",
    citationIds: ["toxin-unit-conversion"],
    productNames: ["RHA 3", "RHA Redensity", "Daxxify"],
  },
  {
    id: "sinclair",
    name: "Sinclair",
    focus: ["Ellansé PCL", "Lanluma"],
    whyHe: "Biostim לפי משך + PLLA גוף — הכשרת PCL.",
    whyEn: "Duration-tier biostim + body PLLA — PCL training.",
    citationIds: ["ellanse-protocol"],
    productNames: ["Ellansé S/M/L/E+", "Lanluma"],
  },
  {
    id: "ibsa",
    name: "IBSA (Profhilo)",
    focus: ["Profhilo BAP", "Structura"],
    whyHe: "איכות עור בלי overfill — פרוטוקול BAP עולמי.",
    whyEn: "Skin quality without overfill — global BAP protocol.",
    citationIds: ["profhilo-bap"],
    productNames: ["Profhilo", "Profhilo Structura"],
  },
  {
    id: "pharmaresearch",
    name: "Rejuran (PharmaResearch)",
    focus: ["PN Healer/I/S/HB"],
    whyHe: "איכות עור, צלקות, periocular — לא תחליף filler.",
    whyEn: "Skin quality, scars, periorbital — not filler substitute.",
    citationIds: ["rejuran-protocol"],
    productNames: ["Rejuran Healer", "Rejuran I"],
  },
  {
    id: "croma",
    name: "Croma (Princess/Saypha)",
    focus: ["CE HA", "MENA/EU"],
    whyHe: "HA מאושר CE במחיר תחרותי — מפה rheology ל-premium.",
    whyEn: "CE-marked value HA — map rheology to premium peers.",
    citationIds: ["asaps-safety"],
    productNames: ["Princess / Saypha lines"],
  },
  {
    id: "evolus",
    name: "Evolus (Jeuveau)",
    focus: ["Aesthetic toxin US"],
    whyHe: "טוקסין אסתטי US — אין המרה 1:1 ל-Botox.",
    whyEn: "US aesthetic toxin — no 1:1 Botox conversion.",
    citationIds: ["toxin-unit-conversion"],
    productNames: ["Jeuveau"],
  },
  {
    id: "candela",
    name: "Candela",
    focus: ["Vbeam", "PicoWay", "CO2"],
    whyHe: "שכבת לייזר חובה בעולם אסתטיקה מלא.",
    whyEn: "Laser layer required for complete aesthetics.",
    citationIds: ["hifu-safety", "combined-treatment-timing"],
    productNames: ["Vbeam", "PicoWay", "CO2RE"],
  },
  {
    id: "ulthera",
    name: "Ultherapy (Merz)",
    focus: ["HIFU SMAS"],
    whyHe: "HIFU ייחוס — לא תחליף לנפח filler.",
    whyEn: "HIFU reference — not filler volume substitute.",
    citationIds: ["hifu-safety"],
    productNames: ["Ultherapy"],
  },
];

export const MOBILE_CITATIONS: MobileCitation[] = [
  {
    id: "ace-vo-2023",
    issuer: "ACE Group",
    titleHe: "ACE — ניהול חסימה וסקולרית",
    titleEn: "ACE — HA vascular occlusion management",
    summaryHe: "זיהוי מוקדם, היאלורונידאז מיידי, הסלמה.",
    summaryEn: "Early recognition, immediate hyaluronidase, escalation.",
  },
  {
    id: "md-codes",
    issuer: "Allergan / Galderma training",
    titleHe: "MD Codes / FACE — מיפוי אנטומי",
    titleEn: "MD Codes / FACE — anatomic mapping",
    summaryHe: "נקודות, וקטורים, שכבות — בסיס midface/lips/jaw.",
    summaryEn: "Points, vectors, planes — midface/lips/jaw basis.",
  },
  {
    id: "asaps-safety",
    issuer: "ASAPS",
    titleHe: "ASAPS — בטיחות טיפולים אסתטיים",
    titleEn: "ASAPS — aesthetic safety guidelines",
    summaryHe: "הכשרה, חירום, הסכמה מדעת.",
    summaryEn: "Training, emergency kit, informed consent.",
  },
  {
    id: "profhilo-bap",
    issuer: "IBSA",
    titleHe: "Profhilo BAP — 10 נקודות",
    titleEn: "Profhilo BAP — 10-point protocol",
    summaryHe: "2 ml; 10 נקודות; 2 מפגשים ~4 שבועות.",
    summaryEn: "2 ml; 10 points; 2 sessions ~4 weeks.",
  },
  {
    id: "sculptra-dilution",
    issuer: "Galderma",
    titleHe: "Sculptra — dilution + massage 5-5-5",
    titleEn: "Sculptra — dilution + 5-5-5 massage",
    summaryHe: "8–12 ml; microdepot; אין reversal אנזימטי.",
    summaryEn: "8–12 ml; microdepots; no enzyme reversal.",
  },
  {
    id: "toxin-unit-conversion",
    issuer: "Manufacturer IFUs",
    titleHe: "אין המרת יחידות 1:1 בין מותגי טוקסין",
    titleEn: "Toxin units are NOT 1:1 across brands",
    summaryHe: "Botox:Dysport ~1:2.5 בגלאבלה — IFU בלבד.",
    summaryEn: "Botox:Dysport ~1:2.5 glabella — IFU tables only.",
  },
  {
    id: "pdo-thread-consensus",
    issuer: "IMCAS / thread literature",
    titleHe: "PDO/PLLA threads — וקטורים וסיבוכים",
    titleEn: "PDO/PLLA threads — vectors & complications",
    summaryHe: "SASP/UASP; SVM; הכשרה חובה.",
    summaryEn: "SASP/UASP; SVM plane; training mandatory.",
  },
  {
    id: "combined-treatment-timing",
    issuer: "Multi-society consensus",
    titleHe: "תזמון שילוב toxin + filler + peel + device",
    titleEn: "Combined treatment timing",
    summaryHe: "טוקסין לפני filler ב־2 שבועות; peel/laser המתנה 2–4.",
    summaryEn: "Toxin 2 weeks before filler; peel/laser wait 2–4 weeks.",
  },
];

export const MOBILE_DOMAINS: MobileDomain[] = [
  {
    id: "pdo-mint",
    domain: "threads",
    nameHe: "PDO Mint / Korean PDO threads",
    nameEn: "PDO Mint / Korean PDO threads",
    whyHe: "הרמה לא־ניתוחית — הכשרה חובה.",
    whyEn: "Non-surgical lift — training mandatory.",
    citationIds: ["pdo-thread-consensus"],
  },
  {
    id: "peel-tca",
    domain: "peels",
    nameHe: "TCA medium peel",
    nameEn: "TCA medium peel",
    whyHe: "קמטים/נזקי שמש — המתן לפני filler.",
    whyEn: "Rhytids/solar damage — wait before filler.",
    citationIds: ["combined-treatment-timing"],
  },
  {
    id: "hair-prp",
    domain: "hair",
    nameHe: "PRP / PRF scalp",
    nameEn: "PRP / PRF scalp",
    whyHe: "תוספת ל־AGA — לא תחליף להשתלה.",
    whyEn: "AGA adjunct — not transplant replacement.",
    citationIds: [],
  },
  {
    id: "kybella",
    domain: "lipolytics",
    nameHe: "Kybella submental",
    nameEn: "Kybella submental",
    whyHe: "המסת שומן תת־סנטרית לפי FDA.",
    whyEn: "FDA submental fat reduction protocol.",
    citationIds: ["kybella-fda"],
  },
  {
    id: "hifu",
    domain: "devices",
    nameHe: "HIFU / Ultherapy class",
    nameEn: "HIFU / Ultherapy class",
    whyHe: "הרמת device — תזמן מול filler.",
    whyEn: "Device lift — stage with filler carefully.",
    citationIds: ["hifu-safety", "combined-treatment-timing"],
  },
  {
    id: "hyperhidrosis",
    domain: "body",
    nameHe: "הזעת יתר — טוקסין",
    nameEn: "Hyperhidrosis toxin",
    whyHe: "סטנדרט טיפולי לבית שחי.",
    whyEn: "Therapeutic gold standard for axilla.",
    citationIds: [],
  },
];

export function citationById(id: string) {
  return MOBILE_CITATIONS.find((c) => c.id === id);
}
