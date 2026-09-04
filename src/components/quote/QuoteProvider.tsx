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
  QUOTE_MESSAGE_MAX,
  QUOTE_STORAGE_KEY,
  isQuoteStoreId,
  type QuoteStorePreference,
  type StoredQuoteDraft,
} from "@/lib/quote";

type QuoteContextValue = {
  message: string;
  setMessage: (value: string) => void;
  storeId: QuoteStorePreference;
  setStoreId: (id: QuoteStorePreference) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  openWithMessage: (value: string) => void;
  clear: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

function readStoredDraft(): StoredQuoteDraft {
  if (typeof window === "undefined") {
    return { message: "", storeId: "matriz" };
  }
  try {
    const raw = window.localStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) return { message: "", storeId: "matriz" };
    const parsed = JSON.parse(raw) as Partial<StoredQuoteDraft>;
    const message =
      typeof parsed.message === "string"
        ? parsed.message.slice(0, QUOTE_MESSAGE_MAX)
        : "";
    const storeId =
      typeof parsed.storeId === "string" && isQuoteStoreId(parsed.storeId)
        ? parsed.storeId
        : "matriz";
    return { message, storeId };
  } catch {
    return { message: "", storeId: "matriz" };
  }
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [message, setMessageState] = useState("");
  const [storeId, setStoreId] = useState<QuoteStorePreference>("matriz");
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const draft = readStoredDraft();
    setMessageState(draft.message);
    setStoreId(draft.storeId);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const draft: StoredQuoteDraft = { message, storeId };
    window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(draft));
  }, [hydrated, message, storeId]);

  const setMessage = useCallback((value: string) => {
    setMessageState(value.slice(0, QUOTE_MESSAGE_MAX));
  }, []);

  const openWithMessage = useCallback((value: string) => {
    setMessageState(value.slice(0, QUOTE_MESSAGE_MAX));
    setOpen(true);
  }, []);

  const clear = useCallback(() => setMessageState(""), []);

  const value = useMemo<QuoteContextValue>(
    () => ({
      message,
      setMessage,
      storeId,
      setStoreId,
      open,
      setOpen,
      openWithMessage,
      clear,
    }),
    [clear, message, open, openWithMessage, setMessage, storeId],
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
