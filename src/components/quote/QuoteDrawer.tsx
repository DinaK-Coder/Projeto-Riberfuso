"use client";

import { useEffect, useId, useRef } from "react";
import {
  QUOTE_MESSAGE_MAX,
  buildQuoteWhatsAppUrl,
  quoteStoreOptions,
} from "@/lib/quote";
import { useQuote } from "./QuoteProvider";

export function QuoteDrawer() {
  const { message, setMessage, open, setOpen, storeId, setStoreId, clear } =
    useQuote();
  const titleId = useId();
  const fieldId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = message.trim().length > 0;
  const whatsappHref = canSend ? buildQuoteWhatsAppUrl(message, storeId) : null;

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 40);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="theme-scrim absolute inset-0"
        aria-label="Fechar orçamento"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col border-l border-ice/10 bg-void pt-[env(safe-area-inset-top)] shadow-[-24px_0_60px_rgba(0,0,0,0.45)]">
        <header className="flex items-start justify-between gap-4 border-b border-ice/10 px-5 py-4">
          <div>
            <p className="font-body text-kicker text-signal uppercase">Pedido rápido</p>
            <h2 id={titleId} className="font-display mt-1 text-xl text-ice uppercase">
              Pedir orçamento
            </h2>
            <p className="mt-1 text-[0.875rem] text-mute">
              Escreva o que precisa. Enviamos o texto ao WhatsApp da loja.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-ice/15 text-ice hover:border-ice/40 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <label htmlFor={fieldId} className="font-body text-kicker text-mute uppercase">
            O que você precisa
          </label>
          <textarea
            ref={textareaRef}
            id={fieldId}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={8}
            maxLength={QUOTE_MESSAGE_MAX}
            placeholder="Ex.: 200 parafusos sextavados 10 mm, 100 porcas inox M8, 50 arruelas e uma parafusadeira Bosch 18V."
            className="mt-2 w-full resize-y border border-ice/15 bg-steel/20 px-3 py-3 text-body-md text-ice outline-none placeholder:text-mute/55 focus:border-signal"
          />
          <p className="mt-2 text-[0.75rem] text-mute">
            {message.length}/{QUOTE_MESSAGE_MAX} · quantidade, medida e marca ajudam no atendimento
          </p>
        </div>

        <footer className="border-t border-ice/10 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <fieldset>
            <legend className="font-body text-kicker text-mute uppercase">
              Enviar para
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {quoteStoreOptions.map((option) => {
                const selected = storeId === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex min-h-12 cursor-pointer items-center justify-center border px-2 text-center font-body text-[0.75rem] font-semibold tracking-[0.06em] uppercase ${
                      selected
                        ? "border-signal bg-signal/10 text-ice"
                        : "border-ice/15 text-mute hover:border-ice/35"
                    }`}
                  >
                    <input
                      type="radio"
                      name="quote-store"
                      value={option.id}
                      checked={selected}
                      onChange={() => setStoreId(option.id)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex min-h-12 items-center justify-center bg-signal px-4 text-center font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-white uppercase hover:bg-[#c4242c] focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
            >
              Enviar no WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="mt-4 flex min-h-12 w-full items-center justify-center bg-signal/40 px-4 text-center font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-white/70 uppercase"
            >
              Escreva o pedido para enviar
            </button>
          )}
          {message.trim() ? (
            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full min-h-11 text-[0.75rem] font-semibold tracking-[0.08em] text-mute uppercase hover:text-ice focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
            >
              Limpar texto
            </button>
          ) : null}
        </footer>
      </aside>
    </div>
  );
}
