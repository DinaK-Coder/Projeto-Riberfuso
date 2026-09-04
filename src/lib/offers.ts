export type Offer = {
  id: string;
  badge: string;
  title: string;
  summary: string;
  ctaLabel: string;
  href?: string;
  cta?: "quote" | "link";
  /** Data final no formato AAAA-MM-DD. Sem valor, a oferta permanece ativa. */
  validUntil?: string;
  active: boolean;
};

export const fallbackOffers: Offer[] = [
  {
    id: "atacado",
    badge: "Atacado",
    title: "Condições para quantidade",
    summary:
      "Parafusos, porcas e arruelas vendidos por unidade. Consulte preço de volume pelo WhatsApp da loja.",
    ctaLabel: "Pedir orçamento",
    cta: "quote",
    active: true,
  },
  {
    id: "bosch",
    badge: "Marca",
    title: "Bosch Professional no balcão",
    summary:
      "Máquinas, baterias e acessórios para uso profissional. Confira disponibilidade na Vila Nova e no Centro.",
    ctaLabel: "Ver marca",
    cta: "link",
    href: "/marca/bosch",
    active: true,
  },
  {
    id: "catalogo",
    badge: "Cadastro",
    title: "+7 mil itens para consulta",
    summary:
      "Busque pelo código ou pela descrição e fale no WhatsApp para estoque, preço e quantidade.",
    ctaLabel: "Abrir catálogo",
    cta: "link",
    href: "/catalogo",
    active: true,
  },
];

export function isOfferLive(offer: Offer, now = new Date()) {
  if (!offer.active) return false;
  if (!offer.validUntil) return true;

  const end = new Date(`${offer.validUntil}T23:59:59`);
  if (Number.isNaN(end.getTime())) return true;
  return end >= now;
}

export function liveOffers(offers: Offer[], now = new Date()) {
  return offers.filter((offer) => isOfferLive(offer, now));
}

export function offerQuoteMessage(offer: Offer) {
  return `Gostaria de consultar esta oferta:\n${offer.title}\n\n${offer.summary}`;
}

export function formatOfferValidUntil(value?: string) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
