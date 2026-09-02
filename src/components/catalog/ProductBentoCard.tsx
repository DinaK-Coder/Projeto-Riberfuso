"use client";

import Link from "next/link";
import type { Category, CategoryShowcaseSize } from "@/lib/categories";
import { buildCatalogUrl } from "@/lib/catalog-url";

const SIZE_CLASSES: Record<CategoryShowcaseSize, string> = {
  hero: "sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[280px] lg:min-h-[420px]",
  large: "sm:col-span-2 min-h-[220px]",
  medium: "min-h-[200px]",
  compact: "min-h-[180px]",
};

function CategoryGlyph({ categoryId }: { categoryId: string }) {
  const common = "stroke-ice/20";
  const stroke = 1.2;

  switch (categoryId) {
    case "parafusos":
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden>
          <path d="M60 12 L72 36 H48 Z" className={common} strokeWidth={stroke} />
          <rect x="52" y="36" width="16" height="56" className={common} strokeWidth={stroke} />
          <path d="M48 92 H72" className={common} strokeWidth={stroke} />
        </svg>
      );
    case "porcas-arruelas":
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden>
          <polygon
            points="60,18 88,34 88,66 60,82 32,66 32,34"
            className={common}
            strokeWidth={stroke}
          />
          <circle cx="60" cy="50" r="14" className={common} strokeWidth={stroke} />
        </svg>
      );
    case "ferramentas-manuais":
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden>
          <path
            d="M24 88 L52 60 L68 76 L96 48"
            className={common}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path d="M88 40 L100 52" className={common} strokeWidth={stroke} strokeLinecap="round" />
        </svg>
      );
    case "serralheria":
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden>
          <path d="M20 90 H100" className={common} strokeWidth={stroke} />
          <path d="M30 70 H90 V90" className={common} strokeWidth={stroke} />
          <path d="M50 30 V70 M70 40 V70" className={common} strokeWidth={stroke} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden>
          <rect x="28" y="28" width="64" height="64" className={common} strokeWidth={stroke} />
          <path d="M40 60 H80 M60 40 V80" className={common} strokeWidth={stroke} />
        </svg>
      );
  }
}

type ProductBentoCardProps = {
  category: Category;
};

export function ProductBentoCard({ category }: ProductBentoCardProps) {
  const isHero = category.showcaseSize === "hero";
  const isCompact = category.showcaseSize === "compact";
  const href = buildCatalogUrl({
    categoria: category.id,
    q: category.catalogQuery,
  });

  return (
    <Link
      id={category.id}
      href={href}
      data-bento-card
      className={`group relative flex flex-col justify-between overflow-hidden border border-ice/10 bg-gradient-to-br from-steel/50 via-void to-void p-5 transition-[border-color,transform] duration-300 hover:border-signal/45 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none sm:p-6 ${SIZE_CLASSES[category.showcaseSize]}`}
    >
      <div
        className={`pointer-events-none absolute -right-4 -bottom-4 opacity-60 transition-opacity duration-300 group-hover:opacity-90 ${
          isHero ? "h-40 w-40 lg:h-52 lg:w-52" : isCompact ? "h-20 w-20" : "h-28 w-28"
        }`}
        aria-hidden
      >
        <CategoryGlyph categoryId={category.id} />
      </div>

      <p
        className={`pointer-events-none absolute top-3 right-4 font-display leading-none text-ice/[0.04] select-none ${
          isHero ? "text-[5rem] lg:text-[7rem]" : "text-[3.5rem]"
        }`}
        aria-hidden
      >
        {category.index}
      </p>

      <div className="relative z-10">
        <p className="font-body text-kicker text-signal uppercase">{category.index}</p>
        <h3
          className={`font-display mt-2 text-ice uppercase ${
            isHero
              ? "text-[clamp(1.75rem,4vw,2.75rem)]"
              : isCompact
                ? "text-lg"
                : "text-xl lg:text-2xl"
          }`}
        >
          {category.name}
        </h3>
        <p
          className={`mt-2 text-mute ${
            isHero ? "max-w-md text-body-md sm:text-body-lg" : "text-[0.875rem] leading-relaxed"
          } ${isCompact ? "line-clamp-2" : "line-clamp-3"}`}
        >
          {category.description}
        </p>
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          {!isCompact && (
            <ul className="mb-3 flex flex-wrap gap-1.5">
              {category.examples.slice(0, isHero ? 3 : 2).map((example) => (
                <li
                  key={example}
                  className="border border-ice/10 px-2 py-0.5 text-[0.6875rem] tracking-[0.04em] text-ice/70 uppercase"
                >
                  {example}
                </li>
              ))}
            </ul>
          )}
          <p className="text-[0.8125rem] text-mute">
            <span className="font-semibold text-ice">
              {category.productCount.toLocaleString("pt-BR")}
            </span>{" "}
            itens no cadastro
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-body text-[0.75rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors group-hover:text-signal">
          Consultar
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
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
