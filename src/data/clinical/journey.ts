import {
  companyForProduct,
  emergencies,
  getCitation,
  getMaterial,
  getProtocol,
  getRegion,
  getTechnique,
  protocols,
  type AestheticCompany,
  type EmergencyProtocol,
  type GlobalCitation,
  type InjectionRegion,
  type Material,
  type Protocol,
  type Technique,
} from "..";
import { CLINICAL_TREATMENTS, type ClinicalTreatment } from "./treatmentCatalog";
import { getMentorByRegion, type ClinicalMentorGuide } from "./index";
import {
  ATLAS_REGION_IDS,
  REGION_DEFAULT_PROTOCOL,
  REGION_EMERGENCIES,
  TREATMENT_PROTOCOL,
} from "./protocolMap";
import { getRegionPack, type RegionPack } from "./regionPacks";
import { getRegionDepth, type RegionDepth } from "./regionDepth";
import { faceZones } from "../faceZones";
import { DRIVE_VIDEOS, type DriveVideo } from "../../lib/driveMedia";
import { STITCH, USER_LIPS } from "../../lib/assets";

export type JourneyStepId = "region" | "protocol" | "materials" | "injection" | "emergency";

export const JOURNEY_STEPS: JourneyStepId[] = [
  "region",
  "protocol",
  "materials",
  "injection",
  "emergency",
];

export type AssembledJourney = {
  region: InjectionRegion;
  protocol: Protocol | undefined;
  relatedProtocols: Protocol[];
  treatments: ClinicalTreatment[];
  materials: Material[];
  companies: AestheticCompany[];
  techniques: Technique[];
  emergencies: EmergencyProtocol[];
  citations: GlobalCitation[];
  mentor: ClinicalMentorGuide | undefined;
  pack: RegionPack | undefined;
  depth: RegionDepth | undefined;
  stills: string[];
  videos: DriveVideo[];
};

function unique<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

export function stillsForRegion(regionId: string): string[] {
  switch (regionId) {
    case "lips":
      return [...USER_LIPS.anatomy, USER_LIPS.clinical[0] ?? USER_LIPS.before, USER_LIPS.before];
    case "cheeks":
      return [...STITCH.midface, STITCH.injection];
    case "jawline":
      return [STITCH.side[1] ?? STITCH.profile, STITCH.profile, STITCH.side[0] ?? STITCH.profile];
    case "chin":
      return [STITCH.profile, STITCH.side[1] ?? STITCH.profile];
    case "nose":
      return [STITCH.profile, STITCH.side[0] ?? STITCH.profile, STITCH.injection];
    case "temple":
      return [STITCH.temple, STITCH.side[0] ?? STITCH.temple];
    case "periocular":
      return [STITCH.periocular, STITCH.extreme];
    case "glabella":
      return [STITCH.extreme, STITCH.periocular];
    case "forehead":
      return [STITCH.extreme, STITCH.periocular, STITCH.injection];
    case "neck":
      return [STITCH.side[1] ?? STITCH.treatment, STITCH.treatment];
    case "masseter":
    case "tmj":
      return [STITCH.side[1] ?? STITCH.profile, STITCH.profile, STITCH.treatment];
    case "axilla":
      return [STITCH.treatment, STITCH.injection];
    case "migraine":
      return [STITCH.extreme, STITCH.periocular, STITCH.temple];
    default:
      return [STITCH.injection, STITCH.treatment];
  }
}

export function videosForRegion(regionId: string): DriveVideo[] {
  const bucket: DriveVideo["region"] | null =
    regionId === "lips"
      ? "lips"
      : regionId === "cheeks"
        ? "midface"
        : regionId === "jawline" || regionId === "chin" || regionId === "nose"
          ? "jawline"
          : regionId === "glabella" ||
              regionId === "periocular" ||
              regionId === "forehead" ||
              regionId === "migraine" ||
              regionId === "tmj" ||
              regionId === "masseter"
            ? "toxin"
            : null;
  if (!bucket) return [];
  return DRIVE_VIDEOS.filter((video) => video.region === bucket);
}

function regionMatchesTreatment(regionId: string, treatment: ClinicalTreatment): boolean {
  if (treatment.zoneIds.some((zone) => zone === regionId || zone.startsWith(`${regionId}-`))) {
    return true;
  }
  const mapped = faceZones.filter((zone) => zone.regionId === regionId).map((zone) => zone.id);
  return mapped.some((zone) => treatment.zoneIds.includes(zone));
}

export function assembleJourney(regionId: string): AssembledJourney | undefined {
  const region = getRegion(regionId);
  if (!region) return undefined;

  const relatedProtocols = protocols.filter((protocol) => protocol.regionIds.includes(regionId));
  const defaultId = REGION_DEFAULT_PROTOCOL[regionId];
  const protocol =
    (defaultId ? getProtocol(defaultId) : undefined) ?? relatedProtocols[0];

  const treatments = CLINICAL_TREATMENTS.filter((treatment) =>
    regionMatchesTreatment(regionId, treatment),
  );

  const materialIds = new Set<string>([
    ...(protocol?.materialIds ?? []),
    ...treatments.map((treatment) => treatment.material.id),
  ]);
  const materials = [...materialIds]
    .map((id) => getMaterial(id))
    .filter((material): material is Material => Boolean(material));

  const companies = unique(
    materials
      .map((material) => companyForProduct(material.id))
      .filter((company): company is AestheticCompany => Boolean(company)),
    (company) => company.id,
  );

  const techniques = unique(
    (protocol?.techniqueIds ?? [])
      .map((id) => getTechnique(id))
      .filter((technique): technique is Technique => Boolean(technique)),
    (technique) => technique.id,
  );

  const emergencyIds = REGION_EMERGENCIES[regionId] ?? ["anaphylaxis"];
  const regionEmergencies = emergencyIds
    .map((id) => emergencies.find((item) => item.id === id))
    .filter((item): item is EmergencyProtocol => Boolean(item));

  const citationIds = [
    ...(protocol?.citationIds ?? []),
    ...materials.flatMap((material) => material.sources.map((source) => source.citationId).filter(Boolean)),
    ...regionEmergencies.flatMap((item) => item.citationIds ?? []),
    ...companies.flatMap((company) => company.citationIds),
  ].filter((id): id is string => Boolean(id));

  const citations = unique(
    citationIds.map((id) => getCitation(id)).filter((item): item is GlobalCitation => Boolean(item)),
    (item) => item.id,
  );

  return {
    region,
    protocol,
    relatedProtocols,
    treatments,
    materials,
    companies,
    techniques,
    emergencies: regionEmergencies,
    citations,
    mentor: getMentorByRegion(regionId),
    pack: getRegionPack(regionId),
    depth: getRegionDepth(regionId),
    stills: stillsForRegion(regionId),
    videos: videosForRegion(regionId),
  };
}

export function protocolForTreatment(treatmentId: string): Protocol | undefined {
  const mapped = TREATMENT_PROTOCOL[treatmentId];
  return mapped ? getProtocol(mapped) : undefined;
}

export function atlasRegions(): InjectionRegion[] {
  return ATLAS_REGION_IDS.map((id) => getRegion(id)).filter(
    (region): region is InjectionRegion => Boolean(region),
  );
}
