import { contact } from "@/lib/contact";
import { site } from "@/lib/site";
import {
  storeAddress,
  storeLandlines,
  storeLine,
  storePath,
  storeWhatsapp,
  stores,
  type Store,
} from "@/lib/stores";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://riberfusovilanova.com.br";

function storeNode(store: Store) {
  const whatsapp = storeWhatsapp(store);
  const landline = storeLandlines(store)[0];

  return {
    "@type": "HardwareStore",
    "@id": `${SITE_URL}${storePath(store)}#store`,
    name: `${site.name} — ${store.typeLabel} ${store.name}`,
    image: `${SITE_URL}${store.photoSrc}`,
    url: `${SITE_URL}${storePath(store)}`,
    telephone: landline?.display,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.street,
      addressLocality: store.city,
      addressRegion: store.state,
      postalCode: store.postalCode,
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: store.lat,
      longitude: store.lng,
    },
    hasMap: store.directionsUrl,
    openingHours: ["Mo-Fr 08:00-18:00", "Sa 08:00-12:00"],
    description: `${storeAddress(store)}. ${storeLine(store)}.`,
    ...(whatsapp
      ? {
          potentialAction: {
            "@type": "CommunicateAction",
            name: "Falar no WhatsApp",
            target: whatsapp.href,
          },
        }
      : {}),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    "@id": `${SITE_URL}/#business`,
    name: site.name,
    alternateName: ["Riberfuso", "Riberfuso Vila Nova", "Riberfuso Poços de Caldas"],
    description:
      "Parafusos, fixadores, ferramentas, máquinas e produtos para construção, mecânica, manutenção, serralheria e indústria em Poços de Caldas. Atacado e varejo desde 1991.",
    url: SITE_URL,
    image: `${SITE_URL}/brand/marca.png`,
    logo: `${SITE_URL}/brand/marca.png`,
    telephone: contact.phones[0]?.display,
    email: contact.email.display,
    foundingDate: String(site.since),
    slogan: "Bom de preço, bom de negócio.",
    priceRange: "$$",
    currenciesAccepted: "BRL",
    areaServed: {
      "@type": "City",
      name: "Poços de Caldas",
      addressRegion: "MG",
      addressCountry: "BR",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: stores[0]?.street,
      addressLocality: "Poços de Caldas",
      addressRegion: "MG",
      postalCode: stores[0]?.postalCode,
      addressCountry: "BR",
    },
    sameAs: [
      contact.social.instagram.href,
      contact.social.facebook.href,
      contact.social.youtube.href,
    ],
    department: stores.map(storeNode),
  };
}

export function storeJsonLd(store: Store) {
  return {
    "@context": "https://schema.org",
    ...storeNode(store),
    parentOrganization: {
      "@id": `${SITE_URL}/#business`,
    },
  };
}
