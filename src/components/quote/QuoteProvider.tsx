"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  QUOTE_STORAGE_KEY,
  productToQuoteItem,
  quoteItemCount,
  type QuoteItem,
  type QuoteStorePreference,
} from "@/lib/quote";
import type { CatalogProduct } from "@/lib/catalog";

type QuoteContextValue = {
  items: QuoteItem[];
  storeId: QuoteStorePreference;
  setStoreId: (id: QuoteStorePreference) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: CatalogProduct, qty?: number) => void;
  updateItem: (code: string, patch: Partial<Pick<QuoteItem, "qty" | "notes">>) => void;
  removeItem: (code: string) => void;
  clear: () => void;
  count: number;
  has: (code: string) => boolean;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

function readStoredQuote(): QuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const record = item as Partial<QuoteItem>;
      if (typeof record.code !== "string" || typeof record.name !== "string") {
        return [];
      }
      return [
        {
          code: record.code,
          name: record.name,
          qty: Math.max(1, Number(record.qty) || 1),
          notes: typeof record.notes === "string" ? record.notes : "",
        },
      ];
    });
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [storeId, setStoreId] = useState<QuoteStorePreference>("matriz");
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredQuote());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: CatalogProduct, qty = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.code === product.c);
      if (existing) {
        return current.map((item) =>
          item.code === product.c
            ? { ...item, qty: item.qty + Math.max(1, qty) }
            : item,
        );
      }
      return [...current, productToQuoteItem(product, qty)];
    });
    setOpen(true);
  }, []);

  const updateItem = useCallback(
    (code: string, patch: Partial<Pick<QuoteItem, "qty" | "notes">>) => {
      setItems((current) =>
        current.map((item) => {
          if (item.code !== code) return item;
          return {
            ...item,
            qty: patch.qty != null ? Math.max(1, Math.round(patch.qty)) : item.qty,
            notes: patch.notes != null ? patch.notes : item.notes,
          };
        }),
      );
    },
    [],
  );

  const removeItem = useCallback((code: string) => {
    setItems((current) => current.filter((item) => item.code !== code));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<QuoteContextValue>(
    () => ({
      items,
      storeId,
      setStoreId,
      open,
      setOpen,
      addItem,
      updateItem,
      removeItem,
      clear,
      count: quoteItemCount(items),
      has: (code: string) => items.some((item) => item.code === code),
    }),
    [addItem, clear, items, open, removeItem, storeId, updateItem],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote deve ser usado dentro de QuoteProvider");
  }
  return context;
}
