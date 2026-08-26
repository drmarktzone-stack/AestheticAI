import type { GlobalCitation } from "../data/types";

export function isCitationIncomplete(citation: GlobalCitation): boolean {
  return !citation.url && !citation.doi && !citation.pmid;
}
