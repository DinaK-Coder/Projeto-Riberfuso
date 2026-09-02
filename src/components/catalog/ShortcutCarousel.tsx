"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CATALOG_SHORTCUTS,
  SHORTCUT_GROUPS,
  type ShortcutGroup,
} from "@/lib/catalog-shortcuts";
import { prefersReducedMotion } from "@/lib/prefers-motion";
import { ShortcutCard } from "./ShortcutCard";

type FilterId = "todos" | ShortcutGroup;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...SHORTCUT_GROUPS.map((group) => ({ id: group.id, label: group.label })),
];

function Chevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d={direction === "prev" ? "M12 4 6 10l6 6" : "M8 4l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShortcutCarousel() {
  const [filter, setFilter] = useState<FilterId>("todos");
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();

  const items = useMemo(() => {
    if (filter === "todos") return CATALOG_SHORTCUTS;
    return CATALOG_SHORTCUTS.filter((item) => item.group === filter);
  }, [filter]);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollTo({ left: 0, behavior: "auto" });
    updateArrows();

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      track.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [items, updateArrows]);

  const scrollByPage = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(track.clientWidth * 0.72, 260);
    track.scrollBy({
      left: direction * amount,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <div data-shortcuts-carousel>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filtrar sugestões de produtos"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(item.id)}
                className={`min-h-10 border px-3.5 font-body text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none ${
                  selected
                    ? "border-signal bg-signal text-white"
                    : "border-ice/15 text-ice hover:border-ice/35"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            aria-label="Anterior"
            disabled={!canPrev}
            onClick={() => scrollByPage(-1)}
            className="inline-flex h-10 w-10 items-center justify-center border border-ice/15 text-ice transition-colors hover:border-ice/40 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            <Chevron direction="prev" />
          </button>
          <button
            type="button"
            aria-label="Próximo"
            disabled={!canNext}
            onClick={() => scrollByPage(1)}
            className="inline-flex h-10 w-10 items-center justify-center border border-ice/15 text-ice transition-colors hover:border-ice/40 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            <Chevron direction="next" />
          </button>
        </div>
      </div>

      <div className="relative mt-5">
        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          aria-label="Carrossel de sugestões do catálogo"
        >
          {items.map((shortcut) => (
            <div key={shortcut.abbreviation} className="snap-start">
              <ShortcutCard shortcut={shortcut} />
            </div>
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-void to-transparent sm:w-12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-void to-transparent sm:w-12"
          aria-hidden
        />
      </div>

      <p className="mt-3 text-[0.8125rem] text-mute">
        {items.length} sugest{items.length === 1 ? "ão" : "ões"} · deslize ou use as setas
      </p>
    </div>
  );
}
