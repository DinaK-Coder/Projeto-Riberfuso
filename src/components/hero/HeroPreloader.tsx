"use client";

import { forwardRef } from "react";
import type { SiteContent } from "@/lib/site";

type HeroPreloaderProps = {
  visible: boolean;
  site: SiteContent;
};

export const HeroPreloader = forwardRef<HTMLDivElement, HeroPreloaderProps>(
  function HeroPreloader({ visible, site }, ref) {
    if (!visible) return null;

    return (
      <div
        ref={ref}
        className="hero-preloader theme-lock-dark"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Carregando a página"
      >
        <div className="hero-preloader-inner">
          <img
            src={site.logo}
            alt={site.name}
            width={612}
            height={321}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className="hero-preloader-logo site-logo"
            data-hero-preloader-logo
          />
          <div className="hero-preloader-track" aria-hidden>
            <span className="hero-preloader-bar" data-hero-preloader-bar />
          </div>
          <p className="hero-preloader-pct" data-hero-preloader-pct>
            0%
          </p>
        </div>
      </div>
    );
  },
);
