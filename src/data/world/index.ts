import { COMPANIES as CORE_COMPANIES } from "../companies/catalog";
import { GLOBAL_CITATIONS as CORE_CITATIONS } from "../citations/globalCitations";
import {
  DOMAIN_PRODUCTS as CORE_DOMAINS,
  DOMAIN_META,
} from "../domains/catalog";
import { EXTRA_COMPANIES, EXTRA_DOMAIN_PRODUCTS, EXTRA_CITATIONS } from "./extraCatalog";

export const COMPANIES = [...CORE_COMPANIES, ...EXTRA_COMPANIES];
export const GLOBAL_CITATIONS = [...CORE_CITATIONS, ...EXTRA_CITATIONS];
export const DOMAIN_PRODUCTS = [...CORE_DOMAINS, ...EXTRA_DOMAIN_PRODUCTS];

export function getCompany(id: string) {
  return COMPANIES.find((c) => c.id === id);
}

export function companyForProduct(materialId: string) {
  return COMPANIES.find((c) => c.productIds.includes(materialId));
}

export function getCitation(id: string) {
  return GLOBAL_CITATIONS.find((c) => c.id === id);
}

export function citationsForTag(tag: string) {
  return GLOBAL_CITATIONS.filter((c) => c.tags?.includes(tag));
}

export function productsForDomain(domain: string) {
  return DOMAIN_PRODUCTS.filter((p) => p.domain === domain);
}

export function getDomainProduct(id: string) {
  return DOMAIN_PRODUCTS.find((p) => p.id === id);
}

export { DOMAIN_META };

