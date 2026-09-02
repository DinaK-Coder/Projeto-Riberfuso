"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Brand } from "@/lib/brands";
import { BrandPlate } from "./BrandPlate";

type BrandStripProps = {
  brands: Brand[];
  reducedMotion: boolean;
};

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
  const selectedRef = useRef<string | null>(null);
  const hoverIdRef = useRef<string | null>(null);
  const pointerRef = useRef({ inside: false, x: 0, y: 0, type: "" });
  const rafRef = useRef<number | null>(null);

  const activeId = hoverId ?? selectedId;
  const active = brands.find((brand) => brand.id === activeId) ?? null;
  const paused = Boolean(selectedId) || reducedMotion;

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
    };
  }, []);

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
      {reducedMotion ? (
        <div
          className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerEnter={onPointerSample}
          onPointerMove={onPointerSample}
          onPointerLeave={onPointerLeaveStrip}
        >
          {plates}
        </div>
      ) : (
        <div
          className="brand-strip relative overflow-hidden border border-white/10 bg-[#0E1829] py-3"
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
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0E1829] to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0E1829] to-transparent sm:w-16" />
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
      className="mt-5 min-h-[17rem] overflow-hidden border border-white/10 bg-[#0E1829] px-5 py-5 sm:min-h-[15.5rem] sm:px-6 sm:py-6"
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
            <p className="mt-3 inline-flex max-w-full border border-white/15 px-3 py-1 font-body text-kicker leading-snug break-words text-mute uppercase">
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
