import { stores, storeWhatsapp, type StoreType } from "@/lib/stores";

export const QUOTE_STORAGE_KEY = "riberfuso-quote-v2";
export const QUOTE_MESSAGE_MAX = 1800;

export type QuoteStorePreference = StoreType;

export type StoredQuoteDraft = {
  message: string;
  storeId: QuoteStorePreference;
};

export const quoteStoreOptions: {
  id: QuoteStorePreference;
  label: string;
}[] = stores.map((store) => ({
  id: store.id,
  label: `${store.typeLabel} ${store.name}`,
}));

export function isQuoteStoreId(value: string): value is QuoteStorePreference {
  return stores.some((store) => store.id === value);
}

export function buildQuoteWhatsAppUrl(
  message: string,
  storeId: QuoteStorePreference,
) {
  const store = stores.find((item) => item.id === storeId) ?? stores[0];
  const channel = storeWhatsapp(store);
  const baseUrl = channel?.href ?? "https://wa.me/5535998972282";
  const body = message.trim();
  const lines = [
    "Olá, gostaria de solicitar um orçamento.",
    "",
    `Loja de preferência: ${store.typeLabel} ${store.name}`,
    "",
    "O que preciso:",
    body,
  ];

  return `${baseUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
}
