import { stores, storeWhatsapp, type StoreType } from "@/lib/stores";
import type { CatalogProduct } from "@/lib/catalog";

export const QUOTE_STORAGE_KEY = "riberfuso-quote-v1";

export type QuoteItem = {
  code: string;
  name: string;
  qty: number;
  notes: string;
};

export type QuoteStorePreference = StoreType;

export const quoteStoreOptions: {
  id: QuoteStorePreference;
  label: string;
}[] = stores.map((store) => ({
  id: store.id,
  label: `${store.typeLabel} ${store.name}`,
}));

export function productToQuoteItem(
  product: CatalogProduct,
  qty = 1,
): QuoteItem {
  return {
    code: product.c,
    name: product.n,
    qty: Math.max(1, Math.round(qty)),
    notes: "",
  };
}

export function quoteItemCount(items: QuoteItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function buildQuoteWhatsAppUrl(
  items: QuoteItem[],
  storeId: QuoteStorePreference,
) {
  const store = stores.find((item) => item.id === storeId) ?? stores[0];
  const channel = storeWhatsapp(store);
  const baseUrl = channel?.href ?? "https://wa.me/5535998972282";
  const lines = [
    "Olá, gostaria de solicitar um orçamento.",
    "",
    `Loja de preferência: ${store.typeLabel} ${store.name}`,
    "",
    "Itens:",
    ...items.map((item, index) => {
      const notes = item.notes.trim();
      return [
        `${index + 1}. ${item.name}`,
        `   Código: ${item.code}`,
        `   Quantidade: ${item.qty}`,
        notes ? `   Observações: ${notes}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    }),
  ];

  return `${baseUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
}
