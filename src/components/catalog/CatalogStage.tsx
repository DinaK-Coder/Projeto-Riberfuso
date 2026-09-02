"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Category } from "@/lib/categories";

type CatalogStageProps = {
  category: Category;
  reducedMotion: boolean;
};

export function CatalogStage({ category, reducedMotion }: CatalogStageProps) {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="relative flex min-h-[300px] flex-col justify-between border border-ice/10 bg-void px-7 py-9 lg:min-h-[480px] lg:px-11 lg:py-11">
      <p className="font-body text-kicker text-signal uppercase">
        {category.index} — linha
      </p>
      <motion.div
        key={category.id}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.35, ease }}
      >
        <p className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.9] font-extrabold tracking-[0.02em] text-ice">
          {category.index}
        </p>
        <p className="font-display mt-5 text-xl tracking-[0.06em] text-ice uppercase lg:text-2xl">
          {category.name}
        </p>
        <p className="mt-4 max-w-md text-body-md text-mute sm:text-body-lg">
          {category.description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {category.examples.map((example) => (
            <li
              key={example}
              className="border border-ice/12 px-2.5 py-1 text-[0.75rem] tracking-[0.04em] text-ice/75 uppercase"
            >
              {example}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[0.875rem] text-mute">
          {category.productCount.toLocaleString("pt-BR")} itens relacionados no
          cadastro
        </p>
      </motion.div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-kicker text-mute uppercase">{category.spec}</p>
        <Link
          href="/catalogo"
          className="inline-flex min-h-10 items-center justify-center border border-ice/25 px-4 font-body text-[0.75rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:border-signal hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
        >
          Buscar no catálogo
        </Link>
      </div>
    </div>
  );
}
