export type StoreType = "matriz" | "filial";

export type Store = {
  id: StoreType;
  typeLabel: "Matriz" | "Filial";
  name: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  /** Full destination string for Google Maps search/directions */
  mapsQuery: string;
  directionsUrl: string;
};

function mapsDirectionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export const stores: Store[] = [
  {
    id: "matriz",
    typeLabel: "Matriz",
    name: "Vila Nova",
    street: "Rua Dr. Mário de Paiva, 465",
    neighborhood: "Vila Nova",
    city: "Poços de Caldas",
    state: "MG",
    mapsQuery: "Rua Dr. Mário de Paiva, 465 - Vila Nova, Poços de Caldas - MG",
    directionsUrl: mapsDirectionsUrl(
      "Rua Dr. Mário de Paiva, 465 - Vila Nova, Poços de Caldas - MG",
    ),
  },
  {
    id: "filial",
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
  },
];

export function storeLine(store: Store) {
  return `${store.neighborhood} · ${store.city} - ${store.state}`;
}
