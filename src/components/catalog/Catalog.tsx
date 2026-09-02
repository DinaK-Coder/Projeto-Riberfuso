"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { categories } from "@/lib/categories";
import { prefersReducedMotion } from "@/lib/prefers-motion";
import { CatalogRow } from "./CatalogRow";
import { CatalogStage } from "./CatalogStage";

gsap.registerPlugin(ScrollTrigger);

export function Catalog() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(categories[0].id);
  const reduceHook = useReducedMotion();
  const reduced = reduceHook ?? false;
  const active = categories.find((item) => item.id === activeId) ?? categories[0];

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
      <div className="mb-14 flex flex-col gap-6 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p
            data-catalog-kicker
            className="font-body text-kicker text-signal uppercase"
          >
            Índice · 10 linhas · +7 mil itens
          </p>
          <h2
            id="catalog-heading"
            data-catalog-title
            className="font-display text-display-lg mt-3 text-ice uppercase"
          >
            ENCONTRE O QUE
            <br />
            VOCÊ PRECISA.
          </h2>
        </div>
        <div data-catalog-kicker className="max-w-sm lg:pb-1">
          <p className="text-body-md text-mute sm:text-body-lg">
            Catálogo de quem atende serralheria, mecânica, construção e indústria.
            Atacado e varejo em Poços de Caldas.
          </p>
          <a
            href="/catalogo"
            className="mt-4 inline-flex font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            Abrir busca completa
          </a>
        </div>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] lg:gap-16">
        <nav aria-label="Linhas de produto">
          <ul>
            {categories.map((category) => (
              <li key={category.id} id={category.id}>
                <CatalogRow
                  category={category}
                  active={category.id === activeId}
                  reducedMotion={reduced}
                  onActivate={setActiveId}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:sticky lg:top-24">
          <CatalogStage category={active} reducedMotion={reduced} />
        </div>
      </div>
    </section>
  );
}
