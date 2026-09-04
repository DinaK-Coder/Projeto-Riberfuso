"use client";

import { useEffect, useId, useRef, useState } from "react";
import { whatsappConsultUrl, type CatalogProduct } from "@/lib/catalog";
import { stores, storeWhatsapp } from "@/lib/stores";

type CatalogWhatsAppConsultProps = {
  product: CatalogProduct;
};

export function CatalogWhatsAppConsult({ product }: CatalogWhatsAppConsultProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const channels = stores.flatMap((store) => {
    const whatsapp = storeWhatsapp(store);
    return whatsapp
      ? [{ store, href: whatsappConsultUrl(whatsapp.href, product) }]
      : [];
  });

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!channels.length) return null;

  return (
    <div ref={wrapRef} className="relative sm:justify-self-end">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Consultar ${product.n} no WhatsApp`}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center justify-center border border-ice/20 px-3 font-body text-[0.75rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:border-signal hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
      >
        WhatsApp
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Escolha a loja"
          className="absolute left-0 z-20 mt-1 w-[min(18rem,calc(100vw-3rem))] border border-ice/15 bg-ink p-1 shadow-[0_18px_44px_rgba(0,0,0,0.55)] sm:left-auto sm:right-0"
        >
          {channels.map(({ store, href }) => (
            <a
              key={store.id}
              role="menuitem"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-0.5 px-3 py-2.5 transition-colors hover:bg-ice/5 focus-visible:bg-ice/5 focus-visible:outline-none"
              onClick={() => setOpen(false)}
            >
              <span className="font-body text-[0.75rem] font-semibold tracking-[0.08em] text-ice uppercase">
                {store.typeLabel} · {store.name}
              </span>
              <span className="text-[0.75rem] text-mute">Consultar no WhatsApp</span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
