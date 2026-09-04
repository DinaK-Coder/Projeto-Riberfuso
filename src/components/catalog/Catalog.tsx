"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildCatalogUrl } from "@/lib/catalog-url";
import { prefersReducedMotion } from "@/lib/prefers-motion";
import { CatalogSearchCTA } from "./CatalogSearchCTA";
import { ShortcutCarousel } from "./ShortcutCarousel";

gsap.registerPlugin(ScrollTrigger);

export function Catalog() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-catalog-kicker], [data-catalog-title]", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from("[data-shortcuts-carousel]", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        immediateRender: false,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-shortcuts-carousel]",
          start: "top 88%",
          once: true,
          toggleActions: "play none none none",
        },
      });

      gsap.from("[data-catalog-cta]", {
        y: 16,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-catalog-cta]",
          start: "top 92%",
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
      className="relative section-atmosphere section-atmosphere-flow section-divider-top bg-void px-6 pb-24 pt-14 sm:px-10 lg:px-16 lg:pb-32 lg:pt-20"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p
              data-catalog-kicker
              className="font-body text-kicker text-signal uppercase"
            >
              Sugestões do catálogo · +7 mil itens
            </p>
            <h2
              id="catalog-heading"
              data-catalog-title
              className="font-display text-display-lg mt-3 text-ice uppercase"
            >
              Encontre pelo
              <br />
              que você precisa.
            </h2>
          </div>
          <div data-catalog-kicker className="max-w-md lg:pb-1">
            <p className="text-body-md text-mute sm:text-body-lg">
              As mesmas buscas do catálogo. Escolha uma sugestão e abra a
              pesquisa já configurada.
            </p>
            <a
              href={buildCatalogUrl()}
              className="mt-4 inline-flex min-h-10 items-center font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
            >
              Abrir catálogo completo
            </a>
          </div>
        </div>

        <ShortcutCarousel />

        <div className="mt-12 lg:mt-16">
          <CatalogSearchCTA />
        </div>
      </div>
    </section>
  );
}
