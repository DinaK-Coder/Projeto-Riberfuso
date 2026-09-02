"use client";

import Link from "next/link";
import {
  buildShortcutCatalogUrl,
  type CatalogShortcut,
} from "@/lib/catalog-shortcuts";

type ShortcutCardProps = {
  shortcut: CatalogShortcut;
  featured?: boolean;
};

export function ShortcutCard({ shortcut, featured = false }: ShortcutCardProps) {
  const href = buildShortcutCatalogUrl(shortcut);

  return (
    <Link
      href={href}
      data-shortcut-card
      className={`group relative flex flex-col justify-between overflow-hidden border border-ice/10 bg-gradient-to-br from-steel/35 via-void to-void transition-[border-color,transform] duration-300 hover:border-signal/45 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none ${
        featured
          ? "min-h-[200px] p-6 sm:min-h-[220px] lg:min-h-[240px]"
          : "min-h-[148px] p-4 sm:min-h-[160px] sm:p-5"
      }`}
    >
      <div
        className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-signal/5 transition-transform duration-500 group-hover:scale-125"
        aria-hidden
      />

      <div className="relative z-10">
        <p className="font-body text-[0.6875rem] tracking-[0.12em] text-signal uppercase">
          {shortcut.abbreviation}
        </p>
        <h3
          className={`font-display mt-2 text-ice uppercase ${
            featured ? "text-xl lg:text-2xl" : "text-base lg:text-lg"
          }`}
        >
          {shortcut.description}
        </h3>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
        <span className="text-[0.8125rem] text-mute">Busca no catálogo</span>
        <span
          className="inline-flex shrink-0 items-center gap-1 font-body text-[0.75rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors group-hover:text-signal"
          aria-hidden
        >
          Ver
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <path
              d="M3 8h10m0 0L9 4m4 4L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
