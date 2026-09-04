"use client";

import { useEffect, useId } from "react";
import Link from "next/link";
import { buildCatalogUrl } from "@/lib/catalog-url";
import { buildQuoteWhatsAppUrl, quoteStoreOptions } from "@/lib/quote";
import { useQuote } from "./QuoteProvider";

export function QuoteDrawer() {
  const {
    items,
    open,
    setOpen,
    updateItem,
    removeItem,
    clear,
    storeId,
    setStoreId,
    count,
  } = useQuote();
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, setOpen]);

  if (!open) return null;

  const whatsappHref = items.length
    ? buildQuoteWhatsAppUrl(items, storeId)
    : null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="absolute inset-0 bg-ink/70"
        aria-label="Fechar orçamento"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col border-l border-ice/10 bg-void shadow-[-24px_0_60px_rgba(0,0,0,0.45)]">
        <header className="flex items-start justify-between gap-4 border-b border-ice/10 px-5 py-4">
          <div>
            <p className="font-body text-kicker text-signal uppercase">Lista de orçamento</p>
            <h2 id={titleId} className="font-display mt-1 text-xl text-ice uppercase">
              Meu orçamento
            </h2>
            <p className="mt-1 text-[0.875rem] text-mute">
              {count === 0
                ? "Nenhum item ainda"
                : `${count} ${count === 1 ? "item" : "itens"} para consultar`}
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
          {items.length === 0 ? (
            <div className="py-6">
              <p className="text-body-md text-mute">
                Busque produtos no catálogo e use “Adicionar ao orçamento”. Depois
                envie a lista pelo WhatsApp, sem checkout online.
              </p>
              <Link
                href={buildCatalogUrl()}
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex min-h-12 items-center bg-signal px-4 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-white uppercase hover:bg-[#c4242c] focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
              >
                Consultar estoque
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.code} className="border border-ice/10 bg-steel/20 p-4">
                  <p className="font-body text-[0.75rem] tracking-[0.04em] text-signal">
                    {item.code}
                  </p>
                  <p className="mt-1 text-body-md text-ice">{item.name}</p>
                  <p className="mt-2 text-[0.75rem] text-mute">
                    Consulte disponibilidade e preço
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-[0.8125rem] text-mute">
                      Qtd.
                      <input
                        type="number"
                        min={1}
                        inputMode="numeric"
                        value={item.qty}
                        onChange={(event) =>
                          updateItem(item.code, {
                            qty: Number(event.target.value) || 1,
                          })
                        }
                        className="h-11 w-20 border border-ice/15 bg-void px-2 text-ice outline-none focus:border-signal"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeItem(item.code)}
                      className="min-h-11 text-[0.75rem] font-semibold tracking-[0.08em] text-mute uppercase hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
                    >
                      Remover
                    </button>
                  </div>
                  <label className="mt-3 block">
                    <span className="sr-only">Observações de {item.name}</span>
                    <textarea
                      value={item.notes}
                      onChange={(event) =>
                        updateItem(item.code, { notes: event.target.value })
                      }
                      rows={2}
                      placeholder="Observações (medida, acabamento, urgência…)"
                      className="w-full resize-y border border-ice/15 bg-void px-3 py-2 text-[0.875rem] text-ice outline-none placeholder:text-mute/55 focus:border-signal"
                    />
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-ice/10 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <fieldset>
              <legend className="font-body text-kicker text-mute uppercase">
                Loja de preferência
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
                Falar no WhatsApp
              </a>
            ) : null}
            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full min-h-11 text-[0.75rem] font-semibold tracking-[0.08em] text-mute uppercase hover:text-ice focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
            >
              Limpar lista
            </button>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
