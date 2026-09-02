"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { categories } from "@/lib/categories";
import { buildCatalogUrl } from "@/lib/catalog-url";
import { prefersReducedMotion } from "@/lib/prefers-motion";
import { CatalogSearchCTA } from "./CatalogSearchCTA";
import { ProductBentoCard } from "./ProductBentoCard";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_ITEMS = categories.reduce((sum, item) => sum + item.productCount, 0);

export function Catalog() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-catalog-kicker], [data-catalog-title]", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from("[data-bento-card]", {
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-bento-grid]",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from("[data-catalog-stats], [data-catalog-cta]", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-catalog-stats]",
          start: "top 90%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="produtos"
      aria-labelledby="catalog-heading"
      className="relative -mt-8 bg-void px-6 pb-24 pt-14 sm:px-10 lg:-mt-10 lg:px-16 lg:pb-32 lg:pt-20"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p
              data-catalog-kicker
              className="font-body text-kicker text-signal uppercase"
            >
              Variedade · 10 linhas · +7 mil itens
            </p>
            <h2
              id="catalog-heading"
              data-catalog-title
              className="font-display text-display-lg mt-3 text-ice uppercase"
            >
              Tudo para fixar,
              <br />
              montar e produzir.
            </h2>
          </div>
          <div data-catalog-kicker className="max-w-md lg:pb-1">
            <p className="text-body-md text-mute sm:text-body-lg">
              Parafusos, ferramentas, máquinas e ferragens para serralheria,
              mecânica, construção e indústria. Atacado e varejo em Poços de Caldas.
            </p>
          </div>
        </div>

        <div
          data-bento-grid
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-4 lg:gap-4"
        >
          {categories.map((category) => (
            <ProductBentoCard key={category.id} category={category} />
          ))}
        </div>

        <div
          data-catalog-stats
          className="mt-4 grid grid-cols-2 gap-3 border border-ice/10 bg-steel/20 p-5 sm:grid-cols-4 sm:gap-4 sm:p-6 lg:mt-6"
        >
          <div>
            <p className="font-display text-2xl text-ice lg:text-3xl">
              {TOTAL_ITEMS.toLocaleString("pt-BR")}+
            </p>
            <p className="mt-1 text-[0.8125rem] text-mute">Itens cadastrados</p>
          </div>
          <div>
            <p className="font-display text-2xl text-ice lg:text-3xl">10</p>
            <p className="mt-1 text-[0.8125rem] text-mute">Linhas de produto</p>
          </div>
          <div>
            <p className="font-display text-2xl text-ice lg:text-3xl">2</p>
            <p className="mt-1 text-[0.8125rem] text-mute">Lojas em Poços de Caldas</p>
          </div>
          <div className="col-span-2 flex items-center sm:col-span-1">
            <a
              href={buildCatalogUrl()}
              className="inline-flex min-h-10 items-center font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
            >
              Ver catálogo completo
            </a>
          </div>
        </div>

        <div className="mt-4 lg:mt-6">
          <CatalogSearchCTA />
        </div>
      </div>
    </section>
  );
}
