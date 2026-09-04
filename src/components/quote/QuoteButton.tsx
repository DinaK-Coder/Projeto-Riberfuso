"use client";

import { useQuote } from "./QuoteProvider";

type QuoteButtonProps = {
  className?: string;
  label?: string;
};

export function QuoteButton({
  className = "",
  label = "Meu orçamento",
}: QuoteButtonProps) {
  const { count, setOpen } = useQuote();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`relative inline-flex min-h-11 items-center justify-center border border-ice/20 px-3 font-body text-[0.75rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:border-signal hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none sm:px-4 sm:text-[0.8125rem] ${className}`}
      aria-label={
        count > 0 ? `${label}, ${count} ${count === 1 ? "item" : "itens"}` : label
      }
    >
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">Orçamento</span>
      {count > 0 ? (
        <span className="ml-2 inline-flex min-w-5 items-center justify-center bg-signal px-1.5 py-0.5 text-[0.6875rem] leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
