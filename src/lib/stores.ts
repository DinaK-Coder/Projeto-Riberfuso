export type StoreType = "matriz" | "filial";

export type StorePhone = {
  display: string;
  href: string;
  note?: string;
};

export type Store = {
  id: StoreType;
  slug: "vila-nova" | "centro";
  typeLabel: "Matriz" | "Filial";
  name: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode?: string;
  mapsQuery: string;
  directionsUrl: string;
  lat: number;
  lng: number;
  hours: string;
  hoursNote: string;
  photoSrc: string;
  photoAlt: string;
  phones: StorePhone[];
};

function mapsDirectionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export const stores: Store[] = [
  {
    id: "matriz",
    slug: "vila-nova",
    typeLabel: "Matriz",
    name: "Vila Nova",
    street: "Rua Dr. Mário de Paiva, 465",
    neighborhood: "Vila Nova",
    city: "Poços de Caldas",
    state: "MG",
    postalCode: "37701-104",
    mapsQuery: "Rua Dr. Mário de Paiva, 465 - Vila Nova, Poços de Caldas - MG",
    directionsUrl: mapsDirectionsUrl(
      "Rua Dr. Mário de Paiva, 465 - Vila Nova, Poços de Caldas - MG",
    ),
    lat: -21.78692,
    lng: -46.55337,
    hours: "Segunda a sexta, 8h às 18h · Sábado, 8h às 12h",
    hoursNote: "Confirme o atendimento em feriados pelo WhatsApp.",
    photoSrc: "/about/vila-nova.jpg",
    photoAlt: "Fachada da Riberfuso Vila Nova na Rua Doutor Mário de Paiva, 465",
    phones: [
      { display: "(35) 3722-2754", href: "tel:+553537222754" },
      { display: "(35) 3722-3650", href: "tel:+553537223650" },
      {
        display: "(35) 99897-2282",
        href: "https://wa.me/5535998972282",
        note: "vendas",
      },
    ],
  },
  {
    id: "filial",
    slug: "centro",
    typeLabel: "Filial",
    name: "Centro",
    street: "Av. João Pinheiro, 432",
    neighborhood: "Centro",
    city: "Poços de Caldas",
    state: "MG",
    mapsQuery: "Av. João Pinheiro, 432 - Centro, Poços de Caldas - MG",
    directionsUrl: mapsDirectionsUrl(
      "Av. João Pinheiro, 432 - Centro, Poços de Caldas - MG",
    ),
    lat: -21.788,
    lng: -46.5616,
    hours: "Segunda a sexta, 8h às 18h · Sábado, 8h às 12h",
    hoursNote: "Confirme o atendimento em feriados pelo WhatsApp.",
    photoSrc: "/about/joao-pinheiro.jpg",
    photoAlt: "Fachada da Riberfuso na Avenida João Pinheiro, no Centro de Poços de Caldas",
    phones: [
      { display: "(35) 3714-8383", href: "tel:+553537148383" },
      {
        display: "(35) 99903-2197",
        href: "https://wa.me/5535999032197",
        note: "vendas",
      },
    ],
  },
];

export function storeLine(store: Store) {
  return `${store.neighborhood} · ${store.city} - ${store.state}`;
}

export function storeAddress(store: Store) {
  const zip = store.postalCode ? ` · CEP ${store.postalCode}` : "";
  return `${store.street} — ${store.neighborhood}, ${store.city} - ${store.state}${zip}`;
}

export function storePath(store: Store) {
  return `/lojas/${store.slug}`;
}

export function storeBySlug(slug: string) {
  return stores.find((store) => store.slug === slug);
}

export function storeWhatsapp(store: Store) {
  return store.phones.find((phone) => phone.href.includes("wa.me")) ?? null;
}

export function storeLandlines(store: Store) {
  return store.phones.filter((phone) => phone.href.startsWith("tel:"));
}

export function storeEmbedUrl(store: Store) {
  return `https://www.google.com/maps?q=${encodeURIComponent(store.mapsQuery)}&z=16&output=embed`;
}

export function storeMapsSearchUrl(store: Store) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`;
}

export function nearestStoreId(
  origin: { lat: number; lng: number },
  list: Store[] = stores,
) {
  if (!list.length) return null;

  const toRad = (value: number) => (value * Math.PI) / 180;
  const distanceKm = (store: Store) => {
    const dLat = toRad(store.lat - origin.lat);
    const dLng = toRad(store.lng - origin.lng);
    const lat1 = toRad(origin.lat);
    const lat2 = toRad(store.lat);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
  };

  return [...list].sort((a, b) => distanceKm(a) - distanceKm(b))[0]?.id ?? null;
}
