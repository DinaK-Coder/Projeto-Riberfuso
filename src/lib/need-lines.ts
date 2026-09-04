import { buildCatalogUrl } from "@/lib/catalog-url";

export type NeedLine = {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: NeedIconId;
};

export type NeedIconId =
  | "screws"
  | "nuts"
  | "hand-tools"
  | "power-tools"
  | "discs"
  | "drills"
  | "wrenches"
  | "chemicals";

export const needLines: NeedLine[] = [
  {
    id: "parafusos",
    name: "Parafusos e fixadores",
    description: "Sextavados, francês, allen e linha métrica",
    href: buildCatalogUrl({ categoria: "parafusos" }),
    icon: "screws",
  },
  {
    id: "porcas-arruelas",
    name: "Porcas e arruelas",
    description: "Travamento, encosto e distribuição de carga",
    href: buildCatalogUrl({ categoria: "porcas-arruelas" }),
    icon: "nuts",
  },
  {
    id: "ferramentas-manuais",
    name: "Ferramentas manuais",
    description: "Chaves, alicates e linha de oficina",
    href: buildCatalogUrl({ categoria: "ferramentas-manuais" }),
    icon: "hand-tools",
  },
  {
    id: "ferramentas-eletricas",
    name: "Ferramentas elétricas",
    description: "Furadeiras, parafusadeiras e marteletes",
    href: buildCatalogUrl({ categoria: "ferramentas-eletricas" }),
    icon: "power-tools",
  },
  {
    id: "abrasivos",
    name: "Discos e abrasivos",
    description: "Corte, desbaste e acabamento",
    href: buildCatalogUrl({ categoria: "abrasivos" }),
    icon: "discs",
  },
  {
    id: "brocas",
    name: "Brocas e acessórios",
    description: "Brocas, bits e consumo de bancada",
    href: buildCatalogUrl({ q: "BROCA" }),
    icon: "drills",
  },
  {
    id: "chaves",
    name: "Chaves e soquetes",
    description: "Combinadas, soquetes e torque",
    href: buildCatalogUrl({ q: "CHAVE" }),
    icon: "wrenches",
  },
  {
    id: "quimicos",
    name: "Produtos químicos e adesivos",
    description: "Colas, silicones e manutenção",
    href: buildCatalogUrl({ q: "COLA" }),
    icon: "chemicals",
  },
];
