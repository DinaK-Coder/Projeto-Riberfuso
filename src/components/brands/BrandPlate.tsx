"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import type { Brand } from "@/lib/brands";
import { brandAlt } from "@/lib/brands";
import { BrandLogo } from "./BrandLogo";

type BrandPlateProps = {
  brand: Brand;
  active: boolean;
  selected: boolean;
  dimmed: boolean;
  reducedMotion: boolean;
  compact?: boolean;
  inert?: boolean;
  onHover: (id: string) => void;
  onLeave: (id: string) => void;
  onToggle: (id: string) => void;
};

export function BrandPlate({
  brand,
  active,
  selected,
  dimmed,
  reducedMotion,
  compact = false,
  inert = false,
  onHover,
  onLeave,
  onToggle,
}: BrandPlateProps) {
  const mediaRef = useRef<HTMLSpanElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pointerFocusRef = useRef(false);

  const resetMedia = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    gsap.set(media, { x: 0, y: 0, scale: 1, opacity: 1, transformOrigin: "50% 50%" });
  }, []);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      resetMedia();
    };
  }, [resetMedia]);

  const playPulse = () => {
    const media = mediaRef.current;
    const sheen = sheenRef.current;
    if (!media || reducedMotion) return;

    timelineRef.current?.kill();
    resetMedia();

    timelineRef.current = gsap.timeline({
      onComplete: () => {
        resetMedia();
        if (sheen) gsap.set(sheen, { xPercent: -120, opacity: 0 });
        timelineRef.current = null;
      },
    });

    if (sheen) {
      gsap.set(sheen, { xPercent: -120, opacity: 0.5 });
      timelineRef.current.to(sheen, { xPercent: 120, duration: 0.5, ease: "power2.inOut" }, 0);
    }

    timelineRef.current
      .fromTo(media, { scale: 1 }, { scale: 0.95, duration: 0.12, ease: "power2.in" }, 0)
      .to(media, { scale: 1.04, duration: 0.2, ease: "power2.out" })
      .to(media, { scale: 1, duration: 0.24, ease: "power3.out" });
  };

  return (
    // Spec: keep a selected state on the brand control (with aria-pressed).
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <button
      type="button"
      data-brand-plate
      data-brand-id={brand.id}
      tabIndex={inert ? -1 : 0}
      aria-hidden={inert || undefined}
      data-on={active ? "true" : undefined}
      aria-label={brandAlt(brand)}
      aria-pressed={selected}
      aria-selected={selected}
      aria-describedby={active && !inert ? "brand-info-panel" : undefined}
      onPointerDown={() => {
        pointerFocusRef.current = true;
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        onHover(brand.id);
      }}
      onFocus={() => {
        if (pointerFocusRef.current) {
          pointerFocusRef.current = false;
          return;
        }
        onHover(brand.id);
      }}
      onBlur={() => onLeave(brand.id)}
      onClick={() => {
        onToggle(brand.id);
        try {
          playPulse();
        } catch {
          resetMedia();
        }
      }}
      className={`relative flex cursor-pointer items-center justify-center overflow-hidden border border-white/12 bg-panel p-[5px] text-[#1A1C20] transition-[opacity,box-shadow] duration-300 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-steel focus-visible:outline-none ${
        compact ? "h-[6.25rem] w-full shrink-0" : "aspect-[5/3] w-full min-w-0"
      } ${active ? "z-10" : "z-0"} ${dimmed ? "opacity-[0.38]" : "opacity-100"}`}
      style={{
        colorScheme: "light",
        outline: active ? "2px solid #E83038" : "1px solid transparent",
        outlineOffset: "-1px",
      }}
    >
      <span className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white">
        <span ref={mediaRef} className="relative z-[1] flex h-full w-full items-center justify-center">
          <BrandLogo brand={brand} />
        </span>
        <span
          ref={sheenRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </span>
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[3px] origin-left bg-signal transition-transform duration-300 ${
          active || selected ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </button>
  );
}
