"use client";

import Link from "next/link";
import {
  buildShortcutCatalogUrl,
  type CatalogShortcut,
} from "@/lib/catalog-shortcuts";

type ShortcutCardProps = {
  shortcut: CatalogShortcut;
};

export function ShortcutCard({ shortcut }: ShortcutCardProps) {
  const href = buildShortcutCatalogUrl(shortcut);

  return (
    <Link
      href={href}
      data-shortcut-card
      className="group flex h-full min-h-[7.25rem] w-[min(15.5rem,calc(100vw-3.25rem))] shrink-0 flex-col justify-between border border-ice/10 bg-steel/20 px-4 py-4 transition-[border-color,background-color] duration-250 hover:border-signal/40 hover:bg-steel/35 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none sm:min-h-[7.5rem] sm:w-[17rem] sm:px-5 sm:py-5"
    >
      <div>
        <p className="font-body text-[0.625rem] tracking-[0.14em] text-signal uppercase">
          {shortcut.abbreviation}
        </p>
        <h3 className="font-display mt-2 text-[0.95rem] leading-snug text-ice uppercase sm:text-base">
          {shortcut.description}
        </h3>
      </div>

      <span className="mt-4 inline-flex items-center gap-1.5 font-body text-[0.6875rem] font-semibold tracking-[0.1em] text-mute uppercase transition-colors group-hover:text-signal">
        Consultar
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden>
          <path
            d="M3 8h10m0 0L9 4m4 4L9 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
