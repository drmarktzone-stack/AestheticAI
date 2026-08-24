import { lipsMentor } from "./lipsMentor";
import type { ClinicalMentorGuide } from "./types";

export * from "./types";
export { lipsMentor };

export const mentorGuides: ClinicalMentorGuide[] = [lipsMentor];

export function getMentorByRegion(regionId: string) {
  return mentorGuides.find((g) => g.regionId === regionId);
}

export function getMentor(id: string) {
  return mentorGuides.find((g) => g.id === id);
}
