"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Brand } from "@/lib/brands";
import { BrandPlate } from "./BrandPlate";

type BrandStripProps = {
  brands: Brand[];
  reducedMotion: boolean;
};

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

const PLATE_STEP_PX = 13.5 * 16 + 12;

function plateIdFromPoint(clientX: number, clientY: number): string | null {
  const stack = document.elementsFromPoint(clientX, clientY);
  for (const node of stack) {
    if (!(node instanceof Element)) continue;
    const plate = node.closest("[data-brand-id]");
    if (plate) return plate.getAttribute("data-brand-id");
  }
  return null;
}

function StripRow({
  brands,
  reverse,
  duration,
  activeId,
  selectedId,
  reducedMotion,
  paused,
  onHover,
  onLeave,
  onToggle,
}: {
  brands: Brand[];
  reverse?: boolean;
  duration: string;
  activeId: string | null;
  selectedId: string | null;
  reducedMotion: boolean;
  paused: boolean;
  onHover: (id: string) => void;
  onLeave: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const loop = [...brands, ...brands];

  return (
    <div className="flex overflow-hidden">
      <div
        className={`brand-strip-track flex w-max gap-3 ${reverse ? "brand-strip-track--reverse" : ""}`}
        style={{
          animationDuration: duration,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {loop.map((brand, index) => (
          <div key={`${brand.id}-${index}`} className="w-[13.5rem] shrink-0">
            <BrandPlate
              brand={brand}
              compact
              active={activeId === brand.id}
              selected={selectedId === brand.id}
              dimmed={Boolean(activeId) && activeId !== brand.id}
              reducedMotion={reducedMotion}
              inert={index >= brands.length}
              onHover={onHover}
              onLeave={onLeave}
              onToggle={onToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BrandStrip({ brands, reducedMotion }: BrandStripProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [navPaused, setNavPaused] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const selectedRef = useRef<string | null>(null);
  const hoverIdRef = useRef<string | null>(null);
  const pointerRef = useRef({ inside: false, x: 0, y: 0, type: "" });
  const rafRef = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<number | null>(null);

  const activeId = hoverId ?? selectedId;
  const active = brands.find((brand) => brand.id === activeId) ?? null;
  const paused = Boolean(selectedId) || reducedMotion || navPaused;

  const rowA = brands.filter((_, index) => index % 2 === 0);
  const rowB = brands.filter((_, index) => index % 2 === 1);

  const applyHoverId = useCallback((id: string | null) => {
    if (hoverIdRef.current === id) return;
    hoverIdRef.current = id;
    setHoverId(id);
  }, []);

  const hitTest = useCallback(() => {
    rafRef.current = null;
    const pointer = pointerRef.current;
    if (!pointer.inside || pointer.type === "touch") return;
    applyHoverId(plateIdFromPoint(pointer.x, pointer.y));
    if (!selectedRef.current) {
      rafRef.current = requestAnimationFrame(hitTest);
    }
  }, [applyHoverId]);

  const scheduleHitTest = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(hitTest);
  }, [hitTest]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (pauseTimerRef.current != null) window.clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const updateScrollArrows = useCallback(() => {
    const track = scrollerRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const track = scrollerRef.current;
    if (!track || !reducedMotion) return;

    updateScrollArrows();
    track.addEventListener("scroll", updateScrollArrows, { passive: true });
    window.addEventListener("resize", updateScrollArrows);

    return () => {
      track.removeEventListener("scroll", updateScrollArrows);
      window.removeEventListener("resize", updateScrollArrows);
    };
  }, [reducedMotion, updateScrollArrows]);

  const nudgeMarquee = useCallback((direction: -1 | 1) => {
    const root = stripRef.current;
    if (!root) return;

    root.querySelectorAll<HTMLElement>(".brand-strip-track").forEach((track) => {
      const anim = track.getAnimations()[0];
      const effect = anim?.effect;
      if (!anim || !effect || !("getComputedTiming" in effect)) return;

      const duration = Number(effect.getComputedTiming().duration) || 42000;
      const loopWidth = track.scrollWidth / 2;
      if (!loopWidth) return;

      const step = Math.min(loopWidth * 0.28, PLATE_STEP_PX * 2.25);
      const delta = direction * (step / loopWidth) * duration;
      const current = Number(anim.currentTime) || 0;
      anim.currentTime = current + delta;
    });

    setNavPaused(true);
    if (pauseTimerRef.current != null) window.clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = window.setTimeout(() => {
      setNavPaused(false);
      pauseTimerRef.current = null;
    }, 850);
  }, []);

  const scrollStrip = useCallback(
    (direction: -1 | 1) => {
      const track = scrollerRef.current;
      if (!track) return;
      const amount = Math.max(track.clientWidth * 0.7, PLATE_STEP_PX * 2);
      track.scrollBy({
        left: direction * amount,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion],
  );

  const onStep = useCallback(
    (direction: -1 | 1) => {
      if (reducedMotion) {
        scrollStrip(direction);
        return;
      }
      nudgeMarquee(direction);
    },
    [nudgeMarquee, reducedMotion, scrollStrip],
  );

  const onPointerSample = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      pointerRef.current = {
        inside: true,
        x: event.clientX,
        y: event.clientY,
        type: event.pointerType,
      };
      if (event.pointerType === "touch") return;
      scheduleHitTest();
    },
    [scheduleHitTest],
  );

  const onPointerLeaveStrip = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const next = event.relatedTarget;
      if (next instanceof Node && event.currentTarget.contains(next)) return;
      pointerRef.current.inside = false;
      applyHoverId(null);
    },
    [applyHoverId],
  );

  const onHover = useCallback(
    (id: string) => {
      applyHoverId(id);
    },
    [applyHoverId],
  );

  const onLeave = useCallback((id: string) => {
    if (pointerRef.current.inside) return;
    applyHoverId(hoverIdRef.current === id ? null : hoverIdRef.current);
  }, [applyHoverId]);

  const onToggle = useCallback((id: string) => {
    const next = selectedRef.current === id ? null : id;
    selectedRef.current = next;
    setSelectedId(next);
    if (next) {
      applyHoverId(next);
      return;
    }
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && focused.hasAttribute("data-brand-id")) {
      focused.blur();
    }
  }, [applyHoverId]);

  const plates = (
    <>
      {brands.map((brand) => (
        <div key={brand.id} className="w-[13.5rem] shrink-0">
          <BrandPlate
            brand={brand}
            compact
            active={activeId === brand.id}
            selected={selectedId === brand.id}
            dimmed={Boolean(activeId) && activeId !== brand.id}
            reducedMotion={reducedMotion}
            onHover={onHover}
            onLeave={onLeave}
            onToggle={onToggle}
          />
        </div>
      ))}
    </>
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="font-body text-kicker text-mute uppercase">Também no balcão</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Marcas anteriores"
            disabled={reducedMotion && !canPrev}
            onClick={() => onStep(-1)}
            className="inline-flex h-11 w-11 items-center justify-center border border-ice/15 bg-steel/40 text-ice transition-colors hover:border-signal/60 hover:bg-signal hover:text-white disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            <Chevron direction="prev" />
          </button>
          <button
            type="button"
            aria-label="Próximas marcas"
            disabled={reducedMotion && !canNext}
            onClick={() => onStep(1)}
            className="inline-flex h-11 w-11 items-center justify-center border border-ice/15 bg-steel/40 text-ice transition-colors hover:border-signal/60 hover:bg-signal hover:text-white disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            <Chevron direction="next" />
          </button>
        </div>
      </div>
      {reducedMotion ? (
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerEnter={onPointerSample}
          onPointerMove={onPointerSample}
          onPointerLeave={onPointerLeaveStrip}
        >
          {plates}
        </div>
      ) : (
        <div
          ref={stripRef}
          className="brand-strip relative overflow-hidden py-1"
          onPointerEnter={onPointerSample}
          onPointerMove={onPointerSample}
          onPointerLeave={onPointerLeaveStrip}
        >
          <div className="flex flex-col gap-3">
            <StripRow
              brands={rowA}
              duration="42s"
              activeId={activeId}
              selectedId={selectedId}
              reducedMotion={reducedMotion}
              paused={paused}
              onHover={onHover}
              onLeave={onLeave}
              onToggle={onToggle}
            />
            <StripRow
              brands={rowB}
              reverse
              duration="54s"
              activeId={activeId}
              selectedId={selectedId}
              reducedMotion={reducedMotion}
              paused={paused}
              onHover={onHover}
              onLeave={onLeave}
              onToggle={onToggle}
            />
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-steel to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-steel to-transparent sm:w-16" />
        </div>
      )}
      <BrandInfoPanel active={active} reducedMotion={reducedMotion} />
    </div>
  );
}

function BrandInfoPanel({
  active,
  reducedMotion,
}: {
  active: Brand | null;
  reducedMotion: boolean;
}) {
  return (
    <div
      id="brand-info-panel"
      className="mt-5 min-h-[8.5rem] overflow-hidden border border-ice/10 bg-ink/70 px-5 py-5 sm:min-h-[8rem] sm:px-6 sm:py-6"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key={active.id}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[15.5rem] overflow-y-auto sm:max-h-[13.5rem]"
          >
            <p className="font-display text-display-md break-words text-ice">
              {active.name}
            </p>
            <p className="mt-3 inline-flex max-w-full border border-ice/15 px-3 py-1 font-body text-kicker leading-snug break-words text-mute uppercase">
              {active.classification}
            </p>
            <p className="mt-4 max-w-3xl text-body-md break-words text-mute sm:text-body-lg">
              {active.description}
            </p>
          </motion.div>
        ) : (
          <motion.p
            key="idle"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="max-w-2xl text-base leading-relaxed text-mute sm:text-lg"
          >
            Passe o cursor ou toque em uma marca para ver a classificação de uso
            e a linha disponível no balcão.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
