"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FEATURED_SHORTCUTS,
  SHORTCUT_GROUPS,
  shortcutsByGroup,
} from "@/lib/catalog-shortcuts";
import { buildCatalogUrl } from "@/lib/catalog-url";
import { prefersReducedMotion } from "@/lib/prefers-motion";
import { CatalogSearchCTA } from "./CatalogSearchCTA";
import { ShortcutCard } from "./ShortcutCard";

gsap.registerPlugin(ScrollTrigger);

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

      gsap.from("[data-shortcut-card]", {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-shortcuts-grid]",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from("[data-catalog-cta]", {
        y: 20,
        opacity: 0,
        duration: 0.7,
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
      className="relative -mt-8 bg-void px-6 pb-24 pt-14 sm:px-10 lg:-mt-10 lg:px-16 lg:pb-32 lg:pt-20"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
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
              As mesmas buscas usadas no catálogo do site. Clique em um produto
              para abrir a pesquisa já configurada — código ou descrição.
            </p>
            <a
              href={buildCatalogUrl()}
              className="mt-4 inline-flex min-h-10 items-center font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
            >
              Abrir catálogo completo
            </a>
          </div>
        </div>

        <div className="mb-10 lg:mb-14">
          <p className="font-body text-kicker text-mute uppercase">Mais buscados</p>
          <div
            data-shortcuts-grid
            className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
          >
            {FEATURED_SHORTCUTS.map((shortcut) => (
              <ShortcutCard key={shortcut.abbreviation} shortcut={shortcut} featured />
            ))}
          </div>
        </div>

        <div className="space-y-10 lg:space-y-12">
          {SHORTCUT_GROUPS.map((group) => {
            const items = shortcutsByGroup(group.id).filter((item) => !item.featured);
            if (items.length === 0) return null;

            return (
              <section key={group.id} aria-labelledby={`shortcut-group-${group.id}`}>
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3
                      id={`shortcut-group-${group.id}`}
                      className="font-display text-xl text-ice uppercase lg:text-2xl"
                    >
                      {group.label}
                    </h3>
                    <p className="mt-1 text-[0.875rem] text-mute">{group.description}</p>
                  </div>
                </div>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((shortcut) => (
                    <li key={shortcut.abbreviation}>
                      <ShortcutCard shortcut={shortcut} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-10 lg:mt-14">
          <CatalogSearchCTA />
        </div>
      </div>
    </section>
  );
}
