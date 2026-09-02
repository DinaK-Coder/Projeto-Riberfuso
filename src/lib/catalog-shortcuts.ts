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
};

/**
 * Atalhos: o usuário vê a descrição no chip e a abreviação vai para o campo de busca.
 */
export const CATALOG_SHORTCUTS: CatalogShortcut[] = [
  {
    description: "Parafusos sextavados",
    abbreviation: "PARAF SEXT",
    searchTerms: "PARAF SEXT",
  },
  {
    description: "Porcas sextavadas",
    abbreviation: "Porca sext",
    searchTerms: "PORCA SEXT",
  },
  {
    description: "Porcas autotravantes",
    abbreviation: "Porca Auto",
    searchTerms: "PORCA TRAV",
  },
  {
    description: "Produtos e parafusos allen",
    abbreviation: "ALLEN",
    searchTerms: "ALLEN",
  },
  {
    description: "Chaves combinadas",
    abbreviation: "COMB",
    searchTerms: "CHAVE COMB",
  },
  {
    description: "Chaves fixas",
    abbreviation: "FIXA",
    searchTerms: "CHAVE FIXA",
  },
  {
    description: "Chaves estrela",
    abbreviation: "Estrela",
    searchTerms: "CHAVE ESTRELA",
  },
  {
    description: "Parafusos francês",
    abbreviation: "Francês",
    searchTerms: "PARAF FRANC",
  },
  {
    description: "Materiais zincados",
    abbreviation: "ZN",
    searchTerms: "ZN",
  },
  {
    description: "Materiais em inox",
    abbreviation: "INOX",
    searchTerms: "INOX",
  },
  {
    description: "Cabo de aço",
    abbreviation: "CABO DE ACO",
    searchTerms: "CABO ACO",
    excludePattern: /^escova/i,
  },
  {
    description: "Barras rosqueadas",
    abbreviation: "BARRA ROSQ",
    searchTerms: "BARRA ROSQ",
  },
  {
    description: "Parafusos Fixer",
    abbreviation: "FIXER",
    searchTerms: "FIXER",
  },
  {
    description: "Brocantes sextavados e atarraxantes ponta broca",
    abbreviation: "PONTA BROCA",
    searchTerms: "BROCANTE",
    searchAnyOf: ["BROCANTE", "PT BROCA"],
  },
  {
    description: "Folhas de lixa",
    abbreviation: "FOLHA LIXA",
    searchTerms: "FOLHA LIXA",
  },
  {
    description: "Chaves Torx",
    abbreviation: "CHAVE TORX",
    searchTerms: "CHAVE TORX",
  },
  {
    description: "Soquetes",
    abbreviation: "SOQUETE",
    searchTerms: "SOQUETE",
  },
];

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

export function resolveDescriptionQuery(query: string): string {
  return resolveDescriptionSearch(query).terms;
}
