import { categories } from "@/lib/categories";
import { compareProductsByMeasurement, sortProductsByMeasurement } from "@/lib/catalog-measurements";
import { resolveDescriptionSearch } from "@/lib/catalog-shortcuts";

export type CatalogProduct = {
  c: string;
  n: string;
  g: string;
};

export type CatalogPayload = {
  generatedAt: string;
  source: string;
  count: number;
  products: CatalogProduct[];
};

export type CatalogSearchMode = "code" | "description";

export const PAGE_SIZE = 40;

/** Set when a PDF is added to public/catalog/ — file not in repo yet */
export const CATALOG_PDF_HREF: string | null = null;

const categoryLabels = Object.fromEntries(
  categories.map((item) => [item.id, item.name]),
) as Record<string, string>;

export function categoryLabel(slug: string): string {
  return categoryLabels[slug] ?? slug.replace(/-/g, " ");
}

export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

export function tokenizeSearch(value: string): string[] {
  return normalizeSearch(value)
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

/** Palavras curtas que não podem casar dentro de outra (ex.: "de" em "madeira"). */
const TOKEN_ONLY_WORDS = new Set(["de", "da", "do", "das", "dos", "e", "a", "o"]);

export function tokenizeDescription(text: string): string[] {
  return normalizeSearch(text)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

function descriptionMatchesWord(text: string, word: string): boolean {
  const normalized = normalizeSearch(text);

  if (TOKEN_ONLY_WORDS.has(word)) {
    return tokenizeDescription(text).includes(word);
  }

  if (word.length <= 2) {
    return normalized.includes(word);
  }

  const tokens = tokenizeDescription(text);
  return tokens.some((token) => token.includes(word)) || normalized.includes(word);
}

function productMatchesAllWords(text: string, words: string[]): boolean {
  return words.every((word) => descriptionMatchesWord(text, word));
}

function scoreDescriptionMatch(text: string, words: string[]): number {
  const normalized = normalizeSearch(text);
  let score = 0;

  for (const word of words) {
    score += 12;
    const idx = normalized.indexOf(word);
    if (idx >= 0 && idx < 20) score += 4;
  }

  const phrase = words.join(" ");
  score += 40;
  if (normalized.includes(phrase)) score += 35;
  if (normalized.startsWith(words[0])) score += 8;

  return score;
}

function scoreProductAgainstGroups(
  product: CatalogProduct,
  groups: string[],
): number {
  let bestScore = -1;

  for (const group of groups) {
    const words = tokenizeSearch(group);
    if (words.length === 0) continue;
    if (!productMatchesAllWords(product.n, words)) continue;
    bestScore = Math.max(bestScore, scoreDescriptionMatch(product.n, words));
  }

  return bestScore;
}

function padCode(digits: string): string {
  return digits.padStart(8, "0");
}

type ScoredProduct = { product: CatalogProduct; score: number };

/**
 * Code-only search: exact match first, then partial / similar digit sequences.
 */
export function searchByCode(
  products: CatalogProduct[],
  query: string,
): CatalogProduct[] {
  const compact = query.trim().replace(/\s/g, "");
  if (!compact) return [];

  const digits = compact.replace(/\D/g, "");
  const normalized = normalizeSearch(compact);
  const scored: ScoredProduct[] = [];

  for (const product of products) {
    const code = product.c;
    let score = 0;

    if (digits) {
      const padded = padCode(digits);
      if (code === padded || code === digits) {
        score = 1000;
      } else if (code.endsWith(digits) && digits.length >= 2) {
        score = 700 - (code.length - digits.length);
      } else if (code.startsWith(digits) && digits.length >= 2) {
        score = 650 - (code.length - digits.length);
      } else if (code.includes(digits)) {
        score = 500 - (code.length - digits.length);
      } else if (digits.length >= 3) {
        const tail = code.replace(/^0+/, "");
        if (tail.includes(digits) || digits.includes(tail)) {
          score = 300;
        }
      }
    }

    if (!score && normalized) {
      const codeNorm = normalizeSearch(code);
      if (codeNorm === normalized) score = 900;
      else if (codeNorm.includes(normalized)) score = 200;
    }

    if (score > 0) scored.push({ product, score });
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        compareProductsByMeasurement(a.product, b.product),
    )
    .map((item) => item.product);
}

/**
 * Description-only search: every token must appear in the description (AND).
 * Does not use product code as a search field.
 */
export function searchByDescription(
  products: CatalogProduct[],
  query: string,
): CatalogProduct[] {
  const { terms, excludePattern, searchAnyOf } = resolveDescriptionSearch(query);
  const words = tokenizeSearch(terms);
  if (words.length === 0 && !searchAnyOf?.length) return [];

  const phrase = words.join(" ");
  const scored: ScoredProduct[] = [];

  for (const product of products) {
    if (excludePattern?.test(product.n)) continue;

    if (searchAnyOf?.length) {
      const score = scoreProductAgainstGroups(product, searchAnyOf);
      if (score < 0) continue;
      scored.push({ product, score });
      continue;
    }

    const text = normalizeSearch(product.n);
    let matched = 0;
    let score = 0;

    for (const word of words) {
      if (!descriptionMatchesWord(product.n, word)) {
        matched = -1;
        break;
      }
      matched += 1;
      score += 12;
      const idx = text.indexOf(word);
      if (idx >= 0 && idx < 20) score += 4;
    }

    if (matched !== words.length) continue;

    score += 40;
    if (text.includes(phrase)) score += 35;
    if (text.startsWith(words[0])) score += 8;

    scored.push({ product, score });
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        compareProductsByMeasurement(a.product, b.product),
    )
    .map((item) => item.product);
}

export type CatalogSearchOptions = {
  categoryId?: string;
};

export function filterProductsByCategory(
  products: CatalogProduct[],
  categoryId?: string,
): CatalogProduct[] {
  if (!categoryId) return products;
  return products.filter((product) => product.g === categoryId);
}

export function searchCatalog(
  products: CatalogProduct[],
  query: string,
  mode: CatalogSearchMode,
  options: CatalogSearchOptions = {},
): CatalogProduct[] {
  const scoped = filterProductsByCategory(products, options.categoryId);
  const trimmed = query.trim();

  if (!trimmed) {
    return mode === "description" ? sortProductsByMeasurement(scoped) : [];
  }

  return mode === "code"
    ? searchByCode(scoped, trimmed)
    : searchByDescription(scoped, trimmed);
}

export function whatsappConsultUrl(baseUrl: string, product: CatalogProduct) {
  const text = `Olá, gostaria de consultar disponibilidade e preço do item ${product.c} — ${product.n}.`;
  return `${baseUrl}?text=${encodeURIComponent(text)}`;
}

export function whatsappNotFoundUrl(baseUrl: string, term: string) {
  const text = `Olá! Estou procurando por ${term} e não encontrei no catálogo do site. Poderiam me ajudar?`;
  return `${baseUrl}?text=${encodeURIComponent(text)}`;
}