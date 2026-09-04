"use client";

import { useQuote } from "./QuoteProvider";

const buttonBase =
  "hero-btn inline-flex w-full items-center justify-center gap-2 px-5 font-body text-[0.8125rem] font-semibold tracking-[0.08em] uppercase transition-[color,background-color,border-color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:outline-none active:translate-y-px sm:text-sm lg:w-auto lg:min-w-[13rem] lg:px-6";

export function PedirOrcamentoButton() {
  const { setOpen } = useQuote();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`${buttonBase} bg-signal text-white hover:bg-[#c4242c] focus-visible:bg-[#c4242c] active:bg-[#a81c24]`}
      data-hero-cta
    >
      Pedir orçamento
    </button>
  );
}
