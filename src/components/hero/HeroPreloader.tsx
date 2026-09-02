"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { site } from "@/lib/site";

type HeroPreloaderProps = {
  progress: number;
  visible: boolean;
};

export const HeroPreloader = forwardRef<HTMLDivElement, HeroPreloaderProps>(
  function HeroPreloader({ progress, visible }, ref) {
    if (!visible) return null;

    const pct = Math.round(Math.min(Math.max(progress, 0), 1) * 100);

    return (
      <div
        ref={ref}
        className="hero-preloader"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Carregando a página"
      >
        <div className="hero-preloader-inner">
          <Image
            src={site.logo}
            alt={site.name}
            width={612}
            height={321}
            priority
            unoptimized
            className="hero-preloader-logo"
            data-hero-preloader-logo
          />
          <div className="hero-preloader-track" aria-hidden>
            <span className="hero-preloader-bar" data-hero-preloader-bar />
          </div>
          <p className="hero-preloader-pct" data-hero-preloader-pct>
            {pct}%
          </p>
        </div>
      </div>
    );
  },
);
