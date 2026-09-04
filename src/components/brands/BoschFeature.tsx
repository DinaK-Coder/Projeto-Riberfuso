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
    <article className="relative overflow-hidden border border-ice/10 bg-[linear-gradient(135deg,#0c1220_0%,#10182a_55%,#161022_100%)]">
      <span className="absolute inset-y-0 left-0 w-[3px] bg-signal" aria-hidden />
      <span
        className="pointer-events-none absolute -right-16 top-[-40%] h-64 w-64 rounded-full bg-signal/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-6 px-6 py-7 pl-7 sm:px-8 sm:py-8 sm:pl-9 lg:flex-row lg:items-center lg:gap-12 lg:px-10 lg:py-9 lg:pl-11">
        <div className="flex h-40 w-full max-w-[20.5rem] shrink-0 items-center justify-center bg-[#e7eaf1] px-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] ring-1 ring-black/10 sm:h-44 sm:max-w-[22rem]">
          <BrandLogo brand={brand} featured />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-body text-kicker text-signal uppercase">
            Destaque · linha profissional
          </p>
          <p className="font-display text-display-md mt-3 text-ice uppercase">
            {title}
          </p>
          <p className="mt-3 inline-flex w-fit border border-white/15 px-3 py-1 font-body text-kicker text-mute uppercase">
            {brand.classification}
          </p>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-3xl text-body-md text-mute sm:text-body-lg"
          >
            {brand.description}
          </motion.p>
          {brand.highlight ? (
            <p className="font-display mt-5 max-w-3xl text-lg leading-snug font-bold text-ice sm:text-xl">
              {brand.highlight}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
