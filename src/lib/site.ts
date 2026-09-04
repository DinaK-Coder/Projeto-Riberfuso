export type SiteContent = {
  name: string;
  since: number;
  city: string;
  whatsapp: string;
  logo: string;
  storesSummary: string;
  storesShort: string;
};

export const site: SiteContent = {
  name: "Riberfuso Vila Nova",
  since: 1991,
  city: "Poços de Caldas — MG",
  whatsapp: "https://wa.me/5535998972282",
  logo: "/brand/marca.png",
  storesSummary: "2 lojas em Poços de Caldas",
  storesShort: "Vila Nova + Centro · Poços de Caldas",
};

export function homeSection(id: string) {
  return `/#${id}`;
}

export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/novidades", label: "Novidades" },
  { href: homeSection("lojas"), label: "Lojas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
] as const;
