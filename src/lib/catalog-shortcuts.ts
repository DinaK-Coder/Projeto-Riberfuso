import { buildCatalogUrl } from "@/lib/catalog-url";

export type ShortcutGroup = "fixacao" | "ferramentas" | "materiais";

export type CatalogShortcut = {
  /** Texto exibido no chip (descrição amigável) */
  description: string;
  /** Abreviação preenchida no campo de busca */
  abbreviation: string;
  /** Termos usados na busca (nomenclatura do cadastro) */
  searchTerms: string;
  /** Grupos alternativos (OR): cada string é um AND de palavras */
  searchAnyOf?: string[];
  /** Descrições a ignorar (ex.: escovas com "cabo" = cabo da escova) */
  excludePattern?: RegExp;
  /** Agrupamento na vitrine da Home */
  group: ShortcutGroup;
  /** Destaque na seção "Mais buscados" */
  featured?: boolean;
};

export const SHORTCUT_GROUPS: {
  id: ShortcutGroup;
  label: string;
  description: string;
}[] = [
  {
    id: "fixacao",
    label: "Fixação",
    description: "Parafusos, porcas e brocantes para todo tipo de montagem.",
  },
  {
    id: "ferramentas",
    label: "Ferramentas manuais",
    description: "Chaves, soquetes e acessórios de aperto.",
  },
  {
    id: "materiais",
    label: "Materiais e ferragens",
    description: "Inox, zincado, cabos de aço e barras rosqueadas.",
  },
];

/**
 * Atalhos: o usuário vê a descrição no chip e a abreviação vai para o campo de busca.
 */
export const CATALOG_SHORTCUTS: CatalogShortcut[] = [
  {
    description: "Parafusos sextavados",
    abbreviation: "PARAF SEXT",
    searchTerms: "PARAF SEXT",
    group: "fixacao",
    featured: true,
  },
  {
    description: "Porcas sextavadas",
    abbreviation: "Porca sext",
    searchTerms: "PORCA SEXT",
    group: "fixacao",
  },
  {
    description: "Porcas autotravantes",
    abbreviation: "Porca Auto",
    searchTerms: "PORCA TRAV",
    group: "fixacao",
  },
  {
    description: "Parafusos Allen",
    abbreviation: "PARAF ALLEN",
    searchTerms: "PARAF ALLEN",
    group: "fixacao",
  },
  {
    description: "Chaves Allen",
    abbreviation: "CHAVE ALLEN",
    searchTerms: "CHAVE ALLEN",
    excludePattern: /soquete/i,
    group: "ferramentas",
  },
  {
    description: "Chaves soquete Allen",
    abbreviation: "SOQUETE ALLEN",
    searchTerms: "SOQUETE ALLEN",
    group: "ferramentas",
  },
  {
    description: "Chaves combinadas",
    abbreviation: "COMB",
    searchTerms: "CHAVE COMB",
    group: "ferramentas",
    featured: true,
  },
  {
    description: "Chaves fixas",
    abbreviation: "FIXA",
    searchTerms: "CHAVE FIXA",
    group: "ferramentas",
  },
  {
    description: "Chaves estrela",
    abbreviation: "Estrela",
    searchTerms: "CHAVE ESTRELA",
    group: "ferramentas",
  },
  {
    description: "Parafusos francês",
    abbreviation: "Francês",
    searchTerms: "PARAF FRANC",
    group: "fixacao",
  },
  {
    description: "Materiais zincados",
    abbreviation: "ZN",
    searchTerms: "ZN",
    group: "materiais",
  },
  {
    description: "Materiais em inox",
    abbreviation: "INOX",
    searchTerms: "INOX",
    group: "materiais",
    featured: true,
  },
  {
    description: "Cabo de aço",
    abbreviation: "CABO DE ACO",
    searchTerms: "CABO ACO",
    excludePattern: /^escova/i,
    group: "materiais",
    featured: true,
  },
  {
    description: "Barras rosqueadas",
    abbreviation: "BARRA ROSQ",
    searchTerms: "BARRA ROSQ",
    group: "materiais",
  },
  {
    description: "Parafusos Fixer",
    abbreviation: "FIXER",
    searchTerms: "FIXER",
    group: "fixacao",
  },
  {
    description: "Brocantes sextavados e atarraxantes ponta broca",
    abbreviation: "PONTA BROCA",
    searchTerms: "BROCANTE",
    searchAnyOf: ["BROCANTE", "PT BROCA"],
    group: "fixacao",
  },
  {
    description: "Chaves Torx",
    abbreviation: "CHAVE TORX",
    searchTerms: "CHAVE TORX",
    group: "ferramentas",
  },
  {
    description: "Soquetes",
    abbreviation: "SOQUETE",
    searchTerms: "SOQUETE",
    group: "ferramentas",
  },
];

export function buildShortcutCatalogUrl(shortcut: CatalogShortcut): string {
  return buildCatalogUrl({ q: shortcut.abbreviation });
}

export type ResolvedDescriptionSearch = {
  terms: string;
  excludePattern?: RegExp;
  searchAnyOf?: string[];
};

function findDescriptionShortcut(query: string): CatalogShortcut | undefined {
  const lower = query.trim().toLowerCase();
  if (!lower) return undefined;

  const match = CATALOG_SHORTCUTS.find(
    (item) => item.abbreviation.toLowerCase() === lower,
  );
  if (match) return match;

  if (lower === "cabo aco" || lower === "cabo de aco") {
    return CATALOG_SHORTCUTS.find((item) => item.abbreviation === "CABO DE ACO");
  }

  if (lower === "brocante" || lower === "pt broca") {
    return CATALOG_SHORTCUTS.find((item) => item.abbreviation === "PONTA BROCA");
  }

  if (lower === "allen" || lower === "parafuso allen" || lower === "parafusos allen") {
    return CATALOG_SHORTCUTS.find((item) => item.abbreviation === "PARAF ALLEN");
  }

  if (lower === "chave soquete allen" || lower === "chaves soquete allen") {
    return CATALOG_SHORTCUTS.find((item) => item.abbreviation === "SOQUETE ALLEN");
  }

  if (lower === "chave allen" || lower === "chaves allen") {
    return CATALOG_SHORTCUTS.find((item) => item.abbreviation === "CHAVE ALLEN");
  }

  return undefined;
}

export function resolveDescriptionSearch(query: string): ResolvedDescriptionSearch {
  const trimmed = query.trim();
  if (!trimmed) return { terms: trimmed };

  const shortcut = findDescriptionShortcut(trimmed);
  if (shortcut) {
    return {
      terms: shortcut.searchTerms,
      excludePattern: shortcut.excludePattern,
      searchAnyOf: shortcut.searchAnyOf,
    };
  }

  return { terms: trimmed };
}
