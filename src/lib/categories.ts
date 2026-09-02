export type CategoryShowcaseSize = "hero" | "large" | "medium" | "compact";

export type Category = {
  id: string;
  index: string;
  name: string;
  description: string;
  spec: string;
  /** Approximate count from commercial catalog export */
  productCount: number;
  examples: string[];
  showcaseSize: CategoryShowcaseSize;
  /** Optional default search when opening the catalog for this line */
  catalogQuery?: string;
};

export const categories: Category[] = [
  {
    id: "parafusos",
    index: "01",
    name: "Parafusos",
    description:
      "Sextavados, francês, auto atarraxantes, brocantes e linha métrica. A base da fixação.",
    spec: "M3–M24 · ABNT · métrico / imperial",
    productCount: 1539,
    examples: [
      "Parafuso sextavado",
      "Auto atarraxante",
      "Linha inox",
    ],
    showcaseSize: "hero",
    catalogQuery: "PARAF SEXT",
  },
  {
    id: "porcas-arruelas",
    index: "02",
    name: "Porcas e arruelas",
    description:
      "Travamento, encosto e distribuição de carga. O conjunto que segura o trabalho.",
    spec: "Sextavada · autotravante · lisa / pressão",
    productCount: 747,
    examples: ["Porca sextavada", "Arruela", "Anel elástico"],
    showcaseSize: "medium",
  },
  {
    id: "ferramentas-manuais",
    index: "03",
    name: "Ferramentas manuais",
    description:
      "Chaves, alicates, allen, torx e combinadas. Precisão no aperto, no corte e no ajuste.",
    spec: "Profissional · hobby · oficina",
    productCount: 601,
    examples: ["Alicate", "Chave combinada", "Soquete"],
    showcaseSize: "medium",
    catalogQuery: "CHAVE COMB",
  },
  {
    id: "ferramentas-eletricas",
    index: "04",
    name: "Ferramentas elétricas",
    description:
      "Furadeiras, parafusadeiras, marteletes e serras. Potência para quem não pode parar.",
    spec: "Bosch Professional",
    productCount: 118,
    examples: ["Furadeira", "Parafusadeira", "Esmerilhadeira"],
    showcaseSize: "compact",
  },
  {
    id: "maquinas",
    index: "05",
    name: "Máquinas",
    description:
      "Serras, compressores e equipamentos de oficina. Estrutura para produção e manutenção.",
    spec: "Oficina · indústria · serviço pesado",
    productCount: 46,
    examples: ["Compressor", "Prensa", "Equipamento de oficina"],
    showcaseSize: "compact",
  },
  {
    id: "linha-trator",
    index: "06",
    name: "Linha trator",
    description:
      "Arado, lâmina, porcas e recuperadores. Fixação para o campo e a manutenção agrícola.",
    spec: "Arado · lâmina · recuperador",
    productCount: 51,
    examples: ["Parafuso arado", "Recuperador", "Linha agrícola"],
    showcaseSize: "compact",
  },
  {
    id: "serralheria",
    index: "07",
    name: "Serralheria",
    description:
      "Dobradiças, grampos, barras e cabos de aço. Material para quem corta, solda e monta.",
    spec: "Ferragens · barras · cabos de aço",
    productCount: 324,
    examples: ["Dobradiça", "Cabo de aço", "Grampo"],
    showcaseSize: "large",
    catalogQuery: "CABO DE ACO",
  },
  {
    id: "abrasivos",
    index: "08",
    name: "Abrasivos",
    description:
      "Discos de corte, desbaste e acabamento. O consumo certo para cada material.",
    spec: "Corte · desbaste · acabamento",
    productCount: 103,
    examples: ["Disco de corte", "Disco flap", "Lixa"],
    showcaseSize: "compact",
  },
  {
    id: "acessorios",
    index: "09",
    name: "Acessórios",
    description:
      "Bits, soquetes, extensões e consumo de bancada. O que completa a ferramenta.",
    spec: "Encaixe · bits · soquetes",
    productCount: 300,
    examples: ["Abraçadeira", "Broca", "Adaptador"],
    showcaseSize: "medium",
  },
  {
    id: "equipamentos-profissionais",
    index: "10",
    name: "Equipamentos profissionais",
    description:
      "Linha para medição, proteção e trabalho contínuo. O que a obra e a indústria pedem.",
    spec: "Medição · proteção · serviço",
    productCount: 64,
    examples: ["Esquadro", "Trena", "EPI"],
    showcaseSize: "compact",
  },
];
