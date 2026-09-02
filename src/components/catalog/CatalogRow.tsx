"use client";

import { motion } from "motion/react";
import { site } from "@/lib/site";
import type { Category } from "@/lib/categories";

type CatalogRowProps = {
  category: Category;
  active: boolean;
  reducedMotion: boolean;
  onActivate: (id: string) => void;
};

export function CatalogRow({
  category,
  active,
  reducedMotion,
  onActivate,
}: CatalogRowProps) {
  const consult = `${site.whatsapp}?text=${encodeURIComponent(
    `Olá, preciso de ${category.name.toLowerCase()} na Riberfuso.`,
  )}`;

  return (
    <motion.a
      href={consult}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => onActivate(category.id)}
      onFocus={() => onActivate(category.id)}
      initial={false}
      animate={{
        x: !reducedMotion && active ? 8 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block border-b border-ice/10 py-5 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none lg:py-6"
    >
      <span
        className="absolute top-0 bottom-0 left-0 w-px origin-top bg-signal"
        style={{
          transform: active ? "scaleY(1)" : "scaleY(0)",
          transition: reducedMotion ? "none" : "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}
        aria-hidden
      />
      <div className="flex items-baseline gap-4 pl-4 lg:gap-6">
        <span className="font-body w-10 text-sm tracking-[0.12em] text-mute">
          {category.index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-display-md text-ice uppercase">
                {category.name}
              </h3>
              <span
                className="mt-3 block h-px bg-signal"
                style={{
                  width: active ? 48 : 0,
                  transition: reducedMotion
                    ? "none"
                    : "width 0.4s cubic-bezier(0.22,1,0.36,1)",
                }}
                aria-hidden
              />
            </div>
            <motion.span
              initial={false}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 6 }}
              transition={{ duration: 0.3 }}
              className="mt-2 hidden shrink-0 font-body text-kicker text-signal uppercase lg:inline"
            >
              Consultar
            </motion.span>
          </div>
          <motion.p
            initial={false}
            animate={{
              opacity: active ? 1 : 0,
              height: active ? "auto" : 0,
              marginTop: active ? 10 : 0,
            }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="max-w-md overflow-hidden text-base leading-relaxed text-mute"
          >
            {category.description}
          </motion.p>
        </div>
      </div>
    </motion.a>
  );
}
