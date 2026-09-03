"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/site";
import { navLinks } from "@/lib/site";

type SiteHeaderBarProps = {
  site: SiteContent;
};

export function SiteHeaderBar({ site }: SiteHeaderBarProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

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
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-void pt-[env(safe-area-inset-top)] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div className="mx-auto flex w-full max-w-[90rem] items-center gap-3 px-4 py-3 sm:gap-5 sm:px-8 sm:py-3.5 lg:px-12">
        <Link
          href="/"
          className="shrink-0"
          aria-label="Voltar ao início"
          onClick={() => setOpen(false)}
        >
          <Image
            src={site.logo}
            alt="Riberfuso Vila Nova"
            width={612}
            height={321}
            priority
            unoptimized
            className="h-11 w-auto max-w-[9.5rem] object-contain object-left lg:h-[4.15rem] lg:max-w-[13.5rem] xl:h-[4.35rem] xl:max-w-[15rem]"
          />
        </Link>

        <nav
          aria-label="Seções do site"
          className="hidden min-w-0 flex-1 lg:block"
        >
          <ul className="flex items-center justify-end gap-0.5 xl:gap-1.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center whitespace-nowrap px-2 font-body text-[0.7rem] font-medium tracking-[0.08em] text-ice uppercase transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none xl:px-3 xl:text-[0.8125rem]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center bg-signal px-3 font-body text-[0.75rem] font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#c4242c] focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none sm:min-w-0 sm:px-4 sm:py-2.5 sm:text-[0.8125rem] lg:text-sm"
            aria-label="WhatsApp"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current lg:hidden"
              aria-hidden
            >
              <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.08 6.45 2.08 11.91c0 1.75.46 3.45 1.34 4.95L2 22l5.29-1.38a10 10 0 0 0 4.75 1.2h.01c5.49 0 9.96-4.45 9.96-9.91 0-2.65-1.04-5.14-2.96-7zM12.05 20.15h-.01a8.28 8.28 0 0 1-4.21-1.15l-.3-.18-3.14.82.84-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.72-8.24 8.29-8.24 2.21 0 4.29.86 5.85 2.41a8.16 8.16 0 0 1 2.43 5.83c0 4.55-3.73 8.24-8.29 8.24z" />
            </svg>
            <span className="hidden lg:inline">WhatsApp</span>
          </a>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-ice/20 text-ice transition-colors hover:border-ice/45 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
            <span className="flex w-5 flex-col gap-1.5" aria-hidden>
              <span
                className={`block h-px w-full bg-ice transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-full bg-ice transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-px w-full bg-ice transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>
      <div className="h-1 w-full bg-signal" aria-hidden />

      {open ? (
        <div
          id={panelId}
          className="border-b border-ice/10 bg-ink lg:hidden"
        >
          <nav aria-label="Menu do site" className="px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-12 items-center border-b border-ice/8 font-body text-sm font-medium tracking-[0.08em] text-ice uppercase focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex min-h-12 items-center justify-center bg-signal font-body text-sm font-semibold tracking-[0.08em] text-white uppercase"
              onClick={() => setOpen(false)}
            >
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
