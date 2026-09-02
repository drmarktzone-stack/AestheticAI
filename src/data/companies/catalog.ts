import type { AestheticCompany } from "../types";

const L = (he: string, ar: string, en: string) => ({ he, ar, en });
const LA = (he: string[], ar: string[], en: string[]) => ({ he, ar, en });

export const COMPANIES: AestheticCompany[] = [
  {
    id: "allergan-abbvie",
    name: "Allergan Aesthetics (AbbVie)",
    hq: "Irvine, CA / Dublin, IE",
    website: "https://www.allerganaesthetics.com",
    focus: ["HA fillers", "toxin", "hybrid CaHA+HA", "lipolytics", "MD Codes training"],
    productIds: [
      "juvederm-voluma", "juvederm-volux", "juvederm-vollure", "juvederm-volbella",
      "juvederm-volite", "juvederm-ultra-plus", "juvederm-ultra", "botox", "harmonyca",
    ],
    description: L(
      "מנהיג עולמי: Juvederm Vycross, Botox, Volux, HArmonyCa — MD Codes.",
      "Allergan/AbbVie — Juvederm وBotox وHArmonyCa.",
      "Global leader: Juvederm Vycross, Botox, Volux, HArmonyCa — MD Codes.",
    ),
    differentiators: LA(
      ["Portfolio Vycross מלא", "Botox reference units + PREEMPT", "HArmonyCa hybrid", "MD Codes mapping"],
      ["محفظة Vycross", "Botox", "HArmonyCa", "MD Codes"],
      ["Full Vycross portfolio", "Botox reference + PREEMPT", "HArmonyCa hybrid", "MD Codes"],
    ),
    whyRecommended: L(
      "Portfolio מלא + הכשרה MD Codes — baseline קליניקות premium.",
      "محفظة كاملة + MD Codes.",
      "Full portfolio + MD Codes — premium clinic baseline.",
    ),
    citationIds: ["md-codes", "preempt-migraine", "kybella-fda", "combined-treatment-timing"],
    reviewedByPhysician: false,
  },
  {
    id: "galderma",
    name: "Galderma",
    hq: "Zug, Switzerland",
    website: "https://www.galderma.com",
    focus: ["Restylane OBT", "Sculptra", "Dysport", "Skinboosters"],
    productIds: [
      "restylane-kysse", "restylane-lyft", "restylane-contour", "restylane-defyne",
      "restylane-refyne", "restylane-volyme", "restylane-skinbooster-vital", "sculptra", "dysport",
    ],
    description: L(
      "Restylane OBT, Sculptra PLLA, Dysport — GAIN academy.",
      "Restylane وSculptra وDysport — GAIN.",
      "Restylane OBT, Sculptra, Dysport — GAIN academy.",
    ),
    differentiators: LA(
      ["OBT dynamic lips/cheeks", "Sculptra PLLA gold standard", "Dysport ~2.5:1 vs Botox glabella", "GAIN training"],
      ["OBT", "Sculptra", "Dysport", "GAIN"],
      ["OBT dynamic", "Sculptra gold standard", "Dysport unit conversion", "GAIN"],
    ),
    whyRecommended: L(
      "מומלץ ל-Sculptra, Kysse, Dysport — GAIN מצוין להכשרה.",
      "موصى به لـ Sculptra وKysse.",
      "Recommended for Sculptra, Kysse, Dysport — GAIN training.",
    ),
    citationIds: ["galderma-gain", "sculptra-dilution", "toxin-unit-conversion"],
    reviewedByPhysician: false,
  },
  {
    id: "merz",
    name: "Merz Aesthetics",
    hq: "Frankfurt, Germany",
    website: "https://www.merz.com",
    focus: ["Belotero CPM", "Radiesse CaHA", "Xeomin"],
    productIds: [
      "belotero-balance", "belotero-intense", "belotero-volume", "belotero-revive",
      "belotero-lips", "radiesse", "xeomin",
    ],
    description: L(
      "Belotero CPM finesse; Radiesse CaHA; Xeomin naked toxin.",
      "Belotero وRadiesse وXeomin.",
      "Belotero CPM; Radiesse CaHA; Xeomin naked toxin.",
    ),
    differentiators: LA(
      ["CPM even integration", "Radiesse structural + hyperdilute", "Xeomin no complexing proteins", "Revive skin quality"],
      ["CPM", "Radiesse", "Xeomin", "Revive"],
      ["CPM integration", "Radiesse + hyperdilute", "Xeomin", "Revive"],
    ),
    whyRecommended: L(
      "Perioral finesse, CaHA, toxin antibody concern.",
      "دقة حول الفم وCaHA.",
      "Perioral finesse, CaHA, antibody-conscious toxin choice.",
    ),
    citationIds: ["tyndall-consensus", "combined-treatment-timing"],
    reviewedByPhysician: false,
  },
  {
    id: "teoxane",
    name: "Teoxane",
    hq: "Geneva, Switzerland",
    website: "https://www.teoxane.com",
    focus: ["Teosyal RHA", "Redensity"],
    productIds: ["teosyal-rha-2", "teosyal-rha-3", "teosyal-rha-4", "teosyal-redensity-2"],
    description: L(
      "RHA resilient HA; Redensity periorbital — EU/APAC.",
      "RHA وRedensity.",
      "RHA resilient HA; Redensity — EU/APAC leader.",
    ),
    differentiators: LA(
      ["RHA dynamic G′", "Redensity tear trough", "Broad EU portfolio"],
      ["RHA", "Redensity", "EU"],
      ["RHA dynamic", "Redensity periorbital", "EU portfolio"],
    ),
    whyRecommended: L(
      "Dynamic areas + periorbital — חלופה חזקה ל-Vycross/OBT.",
      "مناطق ديناميكية.",
      "Dynamic areas + periorbital — strong Vycross/OBT alternative.",
    ),
    citationIds: ["md-codes"],
    reviewedByPhysician: false,
  },
  {
    id: "revance",
    name: "Revance Therapeutics",
    hq: "Nashville, TN, USA",
    website: "https://www.revance.com",
    focus: ["RHA US", "Daxxify"],
    productIds: ["revance-rha-3", "revance-rha-redensity", "daxxify"],
    description: L(
      "RHA US + Daxxify long-acting toxin.",
      "RHA + Daxxify.",
      "RHA US + Daxxify long-duration toxin.",
    ),
    differentiators: LA(
      ["Daxxify frontier longevity", "RHA US mirrors Teoxane", "40 U glabella daxibotulinumtoxinA label"],
      ["Daxxify", "RHA", "40 U"],
      ["Daxxify longevity", "RHA US", "40 U label"],
    ),
    whyRecommended: L(
      "Longer toxin interval — unit conversion mandatory.",
      "فترة توكسين أطول.",
      "Longer toxin interval — mandatory unit conversion.",
    ),
    citationIds: ["toxin-unit-conversion"],
    reviewedByPhysician: false,
  },
  {
    id: "sinclair",
    name: "Sinclair Pharma",
    hq: "London, UK",
    focus: ["Ellansé PCL", "Lanluma PLLA"],
    productIds: ["ellanse", "lanluma"],
    description: L(
      "Ellansé PCL duration tiers; Lanluma body PLLA.",
      "Ellansé وLanluma.",
      "Ellansé PCL tiers; Lanluma body PLLA.",
    ),
    differentiators: LA(
      ["Duration at syringe prep", "Lanluma body V/VII", "No enzyme reversal"],
      ["مدة PCL", "Lanluma", "لا إنزيم"],
      ["Duration at prep", "Lanluma body", "No enzyme reversal"],
    ),
    whyRecommended: L(
      "Biostim duration choice + body PLLA — PCL training required.",
      "موصى به لـ Ellansé.",
      "Duration-tier biostim + body PLLA — PCL training required.",
    ),
    citationIds: ["ellanse-protocol"],
    reviewedByPhysician: false,
  },
  {
    id: "ibsa",
    name: "IBSA",
    hq: "Lugano, Switzerland",
    focus: ["Profhilo", "Profhilo Structura"],
    productIds: ["profhilo", "profhilo-structura"],
    description: L(
      "Profhilo NAHYCO bio-remodeling; Structura fat layer (frontier).",
      "Profhilo وStructura.",
      "Profhilo NAHYCO; Structura fat remodeling (frontier).",
    ),
    differentiators: LA(
      ["BAP 10-point protocol", "Not a volumizer", "Structura subcutaneous fat targeting"],
      ["BAP", "ليس volumizer", "Structura"],
      ["BAP protocol", "Not volumizer", "Structura fat layer"],
    ),
    whyRecommended: L(
      "Skin quality/laxity without overfill — BAP global protocol.",
      "جودة الجلد.",
      "Skin quality without over-volumizing — BAP protocol.",
    ),
    citationIds: ["profhilo-bap"],
    reviewedByPhysician: false,
  },
  {
    id: "pharmaresearch",
    name: "PharmaResearch (Rejuran)",
    hq: "Seoul, South Korea",
    focus: ["Rejuran PN"],
    productIds: ["rejuran-healer", "rejuran-i"],
    description: L(
      "Rejuran PN — K-beauty regenerative leader.",
      "Rejuran PN.",
      "Rejuran PN — K-beauty regenerative leader.",
    ),
    differentiators: LA(
      ["PN collagen/ECM", "Healer/I/S/HB variants", "2–4 session series"],
      ["PN", "Healer/I", "2–4 جلسات"],
      ["PN regeneration", "Variant by depth", "Multi-session"],
    ),
    whyRecommended: L(
      "Skin quality, scars, periorbital — not filler substitute.",
      "جودة البشرة.",
      "Skin quality, scars, periorbital — not filler substitute.",
    ),
    citationIds: ["rejuran-protocol"],
    reviewedByPhysician: false,
  },
  {
    id: "hugel-medytox",
    name: "Hugel / Medytox (Korea toxin)",
    hq: "Seoul, South Korea",
    focus: ["Letybo", "Innotox RTU", "Meditoxin"],
    productIds: ["letybo", "innotox", "meditoxin"],
    description: L(
      "Korean toxin innovation: Letybo, Innotox liquid RTU (frontier), Meditoxin.",
      "توكسين كوري — Innotox.",
      "Korean toxin: Letybo, Innotox RTU (frontier), Meditoxin.",
    ),
    differentiators: LA(
      ["Innotox no reconstitution", "Distinct unit tables", "APAC adoption"],
      ["Innotox جاهز", "وحدات خاصة", "APAC"],
      ["Innotox RTU", "Distinct units", "APAC adoption"],
    ),
    whyRecommended: L(
      "Frontier formats many Western physicians haven't used — strict IFU.",
      "حدودي — IFU صارم.",
      "Frontier formats — strict IFU; verify regional approval.",
    ),
    citationIds: ["toxin-unit-conversion"],
    reviewedByPhysician: false,
  },
  {
    id: "filorga-prollenium",
    name: "Filorga / Prollenium / Vivacy",
    hq: "EU / Canada",
    focus: ["Art Filler", "Revanesse", "Stylage"],
    productIds: ["filorga-art-filler", "revanesse-versa", "stylage-xl"],
    description: L(
      "EU/NA HA alternatives: Filorga Art Filler, Revanesse, Stylage.",
      "Filorga وRevanesse وStylage.",
      "EU/NA HA: Filorga, Revanesse, Stylage.",
    ),
    differentiators: LA(
      ["Tri-Hyal / IPN-Like tech", "Regional IFU differences", "Value positioning"],
      ["Tri-Hyal", "IFU إقليمي"],
      ["Tri-Hyal / IPN-Like", "Regional IFU", "Value positioning"],
    ),
    whyRecommended: L(
      "Regional portfolio diversity — map rheology to Juvederm/Restylane equivalents.",
      "تنوع إقليمي.",
      "Regional diversity — map rheology to major brands.",
    ),
    citationIds: [],
    reviewedByPhysician: false,
  },
  {
    id: "korea-biostim",
    name: "Dexlevo / REGEN / Victoria (K-biostim)",
    hq: "Seoul, South Korea",
    focus: ["GOURI PCL", "AestheFill PDLLA", "Juvelook hybrid"],
    productIds: ["gouri", "aesthefill", "juvelook"],
    description: L(
      "K-beauty biostim frontier: GOURI liquid PCL, AestheFill, Juvelook PDLLA+HA.",
      "GOURI وAestheFill وJuvelook.",
      "K-beauty biostim: GOURI, AestheFill, Juvelook hybrid.",
    ),
    differentiators: LA(
      ["Not classic HA filler", "Multi-session collagen", "Frontier in West"],
      ["ليس فيller كلاسيكي", "frontier"],
      ["Not classic HA", "Multi-session collagen", "Frontier in West"],
    ),
    whyRecommended: L(
      "Collagenesis without HA volume — training + regional approval critical.",
      "تحفيز كولاجين.",
      "Collagenesis without HA volume — training critical.",
    ),
    citationIds: ["ellanse-protocol", "sculptra-dilution"],
    reviewedByPhysician: false,
  },
  {
    id: "device-leaders",
    name: "Candela / Solta / Ulthera class",
    hq: "Global",
    focus: ["Laser", "IPL", "RF", "HIFU", "Ultrasound"],
    productIds: [],
    description: L(
      "שכבת devices: Candela laser/IPL, Thermage RF, Ulthera HIFU — adjunct to injectables.",
      "أجهزة ليزر/RF/HIFU.",
      "Device layer: lasers, RF, HIFU — injectables adjunct.",
    ),
    differentiators: LA(
      ["Fitzpatrick protocols", "Combination timing with filler", "Burn/PIH prevention"],
      ["Fitzpatrick", "توقيت مع الفيلر"],
      ["Fitzpatrick protocols", "Filler timing", "Burn prevention"],
    ),
    whyRecommended: L(
      "Complete aesthetic world requires energy devices — cite hifu-safety + combination timing.",
      "طبقة أجهزة كاملة.",
      "Complete aesthetics requires devices — cite safety + combination timing.",
    ),
    citationIds: ["hifu-safety", "combined-treatment-timing"],
    reviewedByPhysician: false,
  },
];

export function getCompany(id: string) {
  return COMPANIES.find((c) => c.id === id);
}

export function companyForProduct(materialId: string) {
  return COMPANIES.find((c) => c.productIds.includes(materialId));
}
