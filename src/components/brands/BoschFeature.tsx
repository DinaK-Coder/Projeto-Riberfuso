"use client";

import { motion } from "motion/react";
import type { Brand } from "@/lib/brands";
import { BrandLogo } from "./BrandLogo";

type BoschFeatureProps = {
  brand: Brand;
  reducedMotion: boolean;
};

export function BoschFeature({ brand, reducedMotion }: BoschFeatureProps) {
  const title = brand.title ?? brand.name;

  return (
    <article className="grid overflow-hidden border border-ice/10 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
      <div className="flex min-h-[220px] flex-col justify-between bg-[#F3F4F6] px-7 py-8 lg:min-h-[280px] lg:px-10 lg:py-10">
        <p className="font-body text-kicker text-signal uppercase">
          Destaque · linha profissional
        </p>
        <div className="flex flex-1 items-center justify-center py-6">
          <BrandLogo brand={brand} featured />
        </div>
        <p className="font-body text-kicker text-[#4A5160] uppercase">
          {brand.classification}
        </p>
      </div>

      <div className="flex flex-col justify-center border-t border-ice/10 px-7 py-8 lg:border-t-0 lg:border-l lg:px-12 lg:py-10">
        <p className="font-display text-display-md text-ice uppercase">
          {title}
        </p>
        <p className="mt-4 inline-flex w-fit border border-white/15 px-3 py-1 font-body text-kicker text-mute uppercase">
          {brand.classification}
        </p>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-xl text-body-md text-mute sm:text-body-lg"
        >
          {brand.description}
        </motion.p>
        {brand.highlight ? (
          <p className="font-display mt-7 text-lg leading-snug font-bold text-ice sm:text-xl">
            {brand.highlight}
          </p>
        ) : null}
      </div>
    </article>
  );
}
