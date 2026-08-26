import { lipsMentor } from "./lipsMentor";
import { midfaceMentor } from "./midfaceMentor";
import type { ClinicalMentorGuide } from "./types";

export * from "./types";
export { lipsMentor, midfaceMentor };

export const mentorGuides: ClinicalMentorGuide[] = [lipsMentor, midfaceMentor];

export function getMentorByRegion(regionId: string) {
  const aliases: Record<string, string> = {
    lips: "lips",
    cheeks: "cheeks",
    midface: "cheeks",
  };
  const normalized = aliases[regionId] ?? regionId;
  return mentorGuides.find((g) => g.regionId === normalized);
}

export function getMentor(id: string) {
  return mentorGuides.find((g) => g.id === id);
}
