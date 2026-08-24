import type { Locale } from "../i18n";

interface NamedEntity {
  nameHe: string;
  nameEn: string;
  nameAr?: string;
}

export function entityName(entity: NamedEntity, locale: Locale): string {
  if (locale === "he") return entity.nameHe;
  if (locale === "ar") return entity.nameAr ?? entity.nameHe;
  return entity.nameEn;
}
