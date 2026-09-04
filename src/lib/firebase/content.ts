import { cache } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore/lite";
import { brands as fallbackBrands, type Brand } from "@/lib/brands";
import { categories as fallbackCategories, type Category } from "@/lib/categories";
import {
  contact as fallbackContact,
  type ContactInfo,
  type ContactPhone,
} from "@/lib/contact";
import { site as fallbackSite, type SiteContent } from "@/lib/site";
import { stores as fallbackStores, type Store, type StoreType } from "@/lib/stores";
import { getFirestoreDb } from "./app";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function parseSite(data: Record<string, unknown>): SiteContent {
  return {
    name: asString(data.name, fallbackSite.name),
    since: asNumber(data.since, fallbackSite.since),
    city: asString(data.city, fallbackSite.city),
    whatsapp: asString(data.whatsapp, fallbackSite.whatsapp),
    logo: asString(data.logo, fallbackSite.logo),
    storesSummary: asString(data.storesSummary, fallbackSite.storesSummary),
    storesShort: asString(data.storesShort, fallbackSite.storesShort),
  };
}

function parseContact(data: Record<string, unknown>): ContactInfo | null {
  if (!isRecord(data.whatsapp) || !isRecord(data.email) || !isRecord(data.social)) {
    return null;
  }

  const instagram = isRecord(data.social.instagram) ? data.social.instagram : null;
  if (!instagram) return null;
  const facebook = isRecord(data.social.facebook) ? data.social.facebook : {};
  const youtube = isRecord(data.social.youtube) ? data.social.youtube : {};

  const phones = Array.isArray(data.phones)
    ? data.phones.flatMap((phone): ContactPhone[] => {
        if (!isRecord(phone)) return [];
        const unit = phone.unit === "Filial" ? "Filial" : "Matriz";
        const kind = phone.kind === "vendas" ? "vendas" : "phone";
        return [
          {
            unit,
            kind,
            display: asString(phone.display),
            href: asString(phone.href),
          },
        ];
      })
    : [];

  if (!phones.length) return null;

  return {
    phones,
    whatsapp: {
      display: asString(data.whatsapp.display),
      href: asString(data.whatsapp.href),
    },
    email: {
      display: asString(data.email.display),
      href: asString(data.email.href),
    },
    social: {
      instagram: {
        label: asString(instagram.label, "Instagram"),
        href: asString(instagram.href),
        handle: asString(instagram.handle),
      },
      facebook: {
        label: asString(facebook.label, fallbackContact.social.facebook.label),
        href: asString(facebook.href, fallbackContact.social.facebook.href),
        handle: asString(facebook.handle, fallbackContact.social.facebook.handle),
      },
      youtube: {
        label: asString(youtube.label, fallbackContact.social.youtube.label),
        href: asString(youtube.href, fallbackContact.social.youtube.href),
        handle: asString(youtube.handle, fallbackContact.social.youtube.handle),
      },
    },
    hoursNote: asString(data.hoursNote, fallbackContact.hoursNote),
  };
}

function parseStore(id: string, data: Record<string, unknown>): Store | null {
  const typeLabel = data.typeLabel;
  if (typeLabel !== "Matriz" && typeLabel !== "Filial") return null;
  if (id !== "matriz" && id !== "filial") return null;

  const fallback = fallbackStores.find((store) => store.id === id);
  if (!fallback) return null;

  const parsedPhones = Array.isArray(data.phones)
    ? data.phones.flatMap((phone) => {
        if (!isRecord(phone)) return [];
        return [
          {
            display: asString(phone.display),
            href: asString(phone.href),
            note: typeof phone.note === "string" ? phone.note : undefined,
          },
        ];
      })
    : [];
  const phones = parsedPhones.length ? parsedPhones : fallback.phones;

  return {
    ...fallback,
    id: id as StoreType,
    typeLabel,
    name: asString(data.name, fallback.name),
    street: asString(data.street, fallback.street),
    neighborhood: asString(data.neighborhood, fallback.neighborhood),
    city: asString(data.city, fallback.city),
    state: asString(data.state, fallback.state),
    postalCode: asString(data.postalCode, fallback.postalCode ?? "") || fallback.postalCode,
    mapsQuery: asString(data.mapsQuery, fallback.mapsQuery),
    directionsUrl: asString(data.directionsUrl, fallback.directionsUrl),
    hours: asString(data.hours, fallback.hours),
    hoursNote: asString(data.hoursNote, fallback.hoursNote),
    photoSrc: asString(data.photoSrc, fallback.photoSrc),
    photoAlt: asString(data.photoAlt, fallback.photoAlt),
    phones,
  };
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const db = getFirestoreDb();
  if (!db) return fallbackSite;

  try {
    const snapshot = await getDoc(doc(db, "settings", "site"));
    const data = snapshot.data();
    return snapshot.exists() && data ? parseSite(data) : fallbackSite;
  } catch (error) {
    console.error("Firestore: falha ao ler settings/site", error);
    return fallbackSite;
  }
});

export const getContactInfo = cache(async (): Promise<ContactInfo> => {
  const db = getFirestoreDb();
  if (!db) return fallbackContact;

  try {
    const snapshot = await getDoc(doc(db, "settings", "contact"));
    const parsed = snapshot.exists() ? parseContact(snapshot.data() ?? {}) : null;
    if (!parsed) return fallbackContact;

    return {
      ...parsed,
      phones:
        parsed.phones.length >= fallbackContact.phones.length
          ? parsed.phones
          : fallbackContact.phones,
      social: {
        ...parsed.social,
        facebook: parsed.social.facebook.href
          ? parsed.social.facebook
          : fallbackContact.social.facebook,
      },
    };
  } catch (error) {
    console.error("Firestore: falha ao ler settings/contact", error);
    return fallbackContact;
  }
});

export const getStores = cache(async (): Promise<Store[]> => {
  const db = getFirestoreDb();
  if (!db) return fallbackStores;

  try {
    const snapshot = await getDocs(collection(db, "stores"));
    const parsed = snapshot.docs
      .map((item) => {
        const data = item.data();
        const store = parseStore(item.id, data);
        return store
          ? { store, order: asNumber(data.order, 99) }
          : null;
      })
      .filter((item): item is { store: Store; order: number } => item !== null)
      .sort((a, b) => a.order - b.order)
      .map((item) => item.store);

    return parsed.length > 0 ? parsed : fallbackStores;
  } catch (error) {
    console.error("Firestore: falha ao ler stores", error);
    return fallbackStores;
  }
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const db = getFirestoreDb();
  if (!db) return fallbackCategories;

  try {
    const snapshot = await getDocs(collection(db, "categories"));
    if (snapshot.empty) return fallbackCategories;

    return snapshot.docs
      .map((item) => {
        const data = item.data();
        return {
          category: {
            id: item.id,
            index: asString(data.index),
            name: asString(data.name),
            description: asString(data.description),
            spec: asString(data.spec),
            productCount: asNumber(data.productCount, 0),
            examples: asStringArray(data.examples),
            showcaseSize: data.showcaseSize as Category["showcaseSize"],
            catalogQuery: typeof data.catalogQuery === "string" ? data.catalogQuery : undefined,
          } satisfies Category,
          order: asNumber(data.order, 99),
        };
      })
      .sort((a, b) => a.order - b.order)
      .map((item) => item.category);
  } catch (error) {
    console.error("Firestore: falha ao ler categories", error);
    return fallbackCategories;
  }
});

export const getBrands = cache(async (): Promise<Brand[]> => {
  const db = getFirestoreDb();
  if (!db) return fallbackBrands;

  try {
    const snapshot = await getDocs(collection(db, "brands"));
    if (snapshot.empty) return fallbackBrands;

    return snapshot.docs
      .map((item) => {
        const data = item.data();
        return {
          brand: {
            id: item.id,
            name: asString(data.name),
            logoSrc: asString(data.logoSrc),
            matte: data.matte as Brand["matte"],
            assetReady: Boolean(data.assetReady),
            featured: Boolean(data.featured) || undefined,
            title: typeof data.title === "string" ? data.title : undefined,
            classification: asString(data.classification),
            description: asString(data.description),
            highlight: typeof data.highlight === "string" ? data.highlight : undefined,
          } satisfies Brand,
          order: asNumber(data.order, 99),
        };
      })
      .sort((a, b) => a.order - b.order)
      .map((item) => item.brand);
  } catch (error) {
    console.error("Firestore: falha ao ler brands", error);
    return fallbackBrands;
  }
});
