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
  { href: homeSection("inicio"), label: "Início" },
  { href: homeSection("produtos"), label: "Produtos" },
  { href: "/catalogo", label: "Catálogo" },
  { href: homeSection("marcas"), label: "Marcas" },
  { href: homeSection("sobre"), label: "Sobre" },
  { href: homeSection("novidades"), label: "Novidades" },
  { href: homeSection("lojas"), label: "Nossas lojas" },
  { href: "/contato", label: "Contato" },
] as const;
