"use client";

import type { CatalogProduct } from "@/lib/catalog";
import { useQuote } from "./QuoteProvider";

type AddToQuoteButtonProps = {
  product: CatalogProduct;
  compact?: boolean;
};

export function AddToQuoteButton({ product, compact = false }: AddToQuoteButtonProps) {
  const { addItem, has } = useQuote();
  const added = has(product.c);

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className={
        compact
          ? `inline-flex min-h-11 items-center justify-center border px-3 font-body text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none ${
              added
                ? "border-signal/50 bg-signal/10 text-ice"
                : "border-ice/20 text-ice hover:border-signal hover:text-signal"
            }`
          : `inline-flex min-h-12 w-full items-center justify-center bg-signal px-4 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#c4242c] focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none sm:w-auto`
      }
    >
      {added ? "No orçamento" : "Adicionar ao orçamento"}
    </button>
  );
}
