"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  CATALOG_SHORTCUTS,
  SHORTCUT_GROUPS,
  type ShortcutGroup,
} from "@/lib/catalog-shortcuts";
import { ShortcutCard } from "./ShortcutCard";

type FilterId = "todos" | ShortcutGroup;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...SHORTCUT_GROUPS.map((group) => ({ id: group.id, label: group.label })),
];

const FADE_EASE = [0.16, 1, 0.3, 1] as const;

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
  const [inView, setInView] = useState(false);
  const [wave, setWave] = useState<"intro" | "filter">("intro");
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const items = useMemo(() => {
    if (filter === "todos") return CATALOG_SHORTCUTS;
    return CATALOG_SHORTCUTS.filter((item) => item.group === filter);
  }, [filter]);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const prev = track.scrollLeft > 4;
    const next = max > 4 && track.scrollLeft < max - 4;
    setCanPrev((current) => (current === prev ? current : prev));
    setCanNext((current) => (current === next ? current : next));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateArrows();
    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      track.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = 0;
    const frame = requestAnimationFrame(updateArrows);
    return () => cancelAnimationFrame(frame);
  }, [filter, updateArrows]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node || reduceMotion) {
      setInView(true);
      return;
    }

    let unlocked = false;
    const reveal = () => {
      if (unlocked) return;
      unlocked = true;
      setWave("intro");
      setInView(true);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };

    const isReady = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const entered = rect.top < vh * 0.68 && rect.bottom > vh * 0.14;
      const scrolledPast = rect.top < vh * 0.28;
      return entered || scrolledPast;
    };

    const onScroll = () => {
      if (isReady()) reveal();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && isReady()) reveal();
      },
      { threshold: 0.25, rootMargin: "0px 0px -16% 0px" },
    );
    observer.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion]);

  const scrollByPage = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(track.clientWidth * 0.72, 260);
    track.scrollBy({
      left: direction * amount,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div data-shortcuts-carousel>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <LayoutGroup>
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
                  onClick={() => {
                    if (item.id === filter) return;
                    setWave("filter");
                    setFilter(item.id);
                  }}
                  className={`relative min-h-10 overflow-hidden border px-3.5 font-body text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-[border-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none ${
                    selected
                      ? "border-signal text-white"
                      : "border-ice/15 text-ice hover:border-ice/35"
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId={reduceMotion ? undefined : "shortcut-filter-pill"}
                      className="absolute inset-0 bg-signal"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 240, damping: 30, mass: 0.7 }
                      }
                    />
                  ) : null}
                  <span className="relative z-[1]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            aria-label="Anterior"
            disabled={!canPrev}
            onClick={() => scrollByPage(-1)}
            className="inline-flex h-10 w-10 items-center justify-center border border-ice/15 text-ice transition-[border-color,color,transform] duration-200 hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none active:translate-x-[-1px]"
          >
            <Chevron direction="prev" />
          </button>
          <button
            type="button"
            aria-label="Próximo"
            disabled={!canNext}
            onClick={() => scrollByPage(1)}
            className="inline-flex h-10 w-10 items-center justify-center border border-ice/15 text-ice transition-[border-color,color,transform] duration-200 hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none active:translate-x-px"
          >
            <Chevron direction="next" />
          </button>
        </div>
      </div>

      <div ref={stageRef} className="relative mt-5 min-h-[8.25rem]">
        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto overflow-y-visible px-0.5 py-1 pb-3 [overflow-anchor:none] [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-proximity [scroll-padding-inline:0.25rem] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          aria-label="Carrossel de sugestões do catálogo"
        >
          {items.map((shortcut, index) => {
            const intro = wave === "intro";
            const delay = intro
              ? 0.32 + index * 0.15
              : 0.06 + index * 0.07;

            return (
              <motion.div
                key={`${filter}-${shortcut.abbreviation}`}
                className="snap-start shrink-0 will-change-transform"
                initial={
                  reduceMotion ? false : { opacity: 0, y: 46 }
                }
                animate={
                  inView || reduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 46 }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        delay: inView ? delay : 0,
                        opacity: {
                          duration: intro ? 1.15 : 0.55,
                          ease: FADE_EASE,
                        },
                        y: {
                          type: "spring",
                          stiffness: 58,
                          damping: 18,
                          mass: 1.05,
                        },
                      }
                }
              >
                <ShortcutCard shortcut={shortcut} />
              </motion.div>
            );
          })}
        </div>

        {canPrev && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-void via-void/70 to-transparent sm:w-8"
            aria-hidden
          />
        )}
        {canNext && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-void via-void/70 to-transparent sm:w-8"
            aria-hidden
          />
        )}
      </div>

      <p className="mt-3 text-[0.8125rem] text-mute">
        {items.length} sugest{items.length === 1 ? "ão" : "ões"} · deslize ou use as
        setas
      </p>
    </div>
  );
}
