"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersLiteExperience } from "@/lib/prefers-motion";
import { HeroCopy } from "./HeroCopy";
import { HeroPreloader } from "./HeroPreloader";
import { HERO_BOSCH_PANELS } from "./heroPanels";
import { loadHeroAssets } from "./loadHeroAssets";
import type { SiteContent } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const PANEL_PARALLAX = [2, 4, 5, 3] as const;

export function Hero({ site }: { site: SiteContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let cancelled = false;
    let mouseMove: ((event: MouseEvent) => void) | null = null;
    let refreshRect: (() => void) | null = null;
    let failsafe = 0;
    const reduced = prefersLiteExperience();
    const isMobile =
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-hero-panel]");
      const photos = gsap.utils.toArray<HTMLElement>("[data-hero-photo]");
      const kicker = section.querySelector<HTMLElement>("[data-hero-kicker]");
      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      const lead = section.querySelector<HTMLElement>("[data-hero-lead]");
      const ctas = gsap.utils.toArray<HTMLElement>("[data-hero-cta]");
      const diffs = gsap.utils.toArray<HTMLElement>("[data-hero-diff]");
      const scrollHint = section.querySelector<HTMLElement>("[data-hero-scroll]");
      const scrollLine = section.querySelector<HTMLElement>("[data-hero-scroll-line]");
      const copy = section.querySelector<HTMLElement>(".hero-copy");
      const slogan = section.querySelector<HTMLElement>("#hero-heading");

      const forceReady = () => {
        gsap.killTweensOf([
          ...panels,
          ...photos,
          ...lines,
          ...ctas,
          ...diffs,
          kicker,
          lead,
          scrollHint,
          scrollLine,
        ].filter(Boolean));
        gsap.set(panels, { clipPath: "inset(0 0% 0 0)", clearProps: "clipPath" });
        gsap.set(photos, { clearProps: "transform" });
        gsap.set(
          [kicker, lead, slogan, ...lines, ...ctas, ...diffs, scrollHint].filter(
            Boolean,
          ),
          { clearProps: "all" },
        );
        if (scrollLine) gsap.set(scrollLine, { clearProps: "transform" });
        section.dataset.heroState = "ready";
        setShowPreloader(false);
      };

      const playEntrance = (fastExit: boolean) => {
        const preloader = preloaderRef.current;
        const bar = preloader?.querySelector<HTMLElement>("[data-hero-preloader-bar]");
        const logo = preloader?.querySelector<HTMLElement>("[data-hero-preloader-logo]");
        const pct = preloader?.querySelector<HTMLElement>("[data-hero-preloader-pct]");

        if (reduced) {
          if (preloader) gsap.set(preloader, { autoAlpha: 0 });
          forceReady();
          return;
        }

        // Drop CSS pending rules BEFORE GSAP owns transforms (avoids slogan stuck)
        section.dataset.heroState = "animating";

        gsap.set(panels, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(photos, { scale: 1.04, xPercent: 1 });
        gsap.set([kicker, lead, scrollHint].filter(Boolean), {
          autoAlpha: 0,
          y: 10,
        });
        gsap.set(slogan, { autoAlpha: 1 });
        gsap.set(lines, { yPercent: 105, force3D: true });
        gsap.set(ctas, { autoAlpha: 0, y: 12, scale: 0.98 });
        gsap.set(diffs, { autoAlpha: 0, y: 10 });
        if (scrollLine) {
          gsap.set(scrollLine, { scaleY: 0, transformOrigin: "top center" });
        }

        const master = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            section.dataset.heroState = "ready";
            // Guarantee slogan lines are visible even if a tween glitched
            gsap.set(lines, { clearProps: "transform" });
            gsap.set(".hero-photo-motion", { clearProps: "willChange" });
            if (scrollLine && !isMobile) {
              gsap.to(scrollLine, {
                scaleY: 0.35,
                duration: 0.9,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
              });
            }
            setShowPreloader(false);
          },
        });

        if (preloader) {
          if (bar) {
            master.to(
              bar,
              { scaleX: 1, duration: fastExit ? 0.12 : 0.2, ease: "power2.out" },
              0,
            );
          }
          master.to({}, { duration: fastExit ? 0.05 : 0.1 });
          if (logo || pct) {
            master.to(
              [logo, pct].filter(Boolean),
              {
                y: -14,
                autoAlpha: 0,
                duration: 0.28,
                ease: "power2.in",
                stagger: 0.03,
              },
              "-=0.02",
            );
          }
          master.to(
            preloader,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: fastExit ? 0.4 : 0.55,
              ease: "power3.inOut",
              onComplete: () => {
                gsap.set(preloader, { pointerEvents: "none" });
              },
            },
            "-=0.08",
          );
        }

        // Photos — wave L→R (shorter)
        master.to(
          panels,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: isMobile ? 0.55 : 0.75,
            stagger: 0.09,
            ease: "power3.inOut",
          },
          "-=0.22",
        );
        master.to(
          photos,
          {
            scale: 1,
            xPercent: 0,
            duration: isMobile ? 0.8 : 1,
            stagger: 0.09,
            ease: "power2.out",
          },
          "<",
        );

        if (kicker) {
          master.to(kicker, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.55");
        }

        // Slogan by line — critical
        if (lines.length) {
          master.to(
            lines,
            {
              yPercent: 0,
              duration: 0.55,
              stagger: 0.1,
              ease: "power4.out",
            },
            "-=0.28",
          );
        }

        if (lead) {
          master.to(lead, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.28");
        }

        if (ctas.length) {
          master.to(
            ctas,
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06 },
            "-=0.18",
          );
        }

        if (diffs.length) {
          master.to(
            diffs,
            { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.07 },
            "-=0.14",
          );
        }

        if (scrollHint) {
          master.to(scrollHint, { autoAlpha: 1, y: 0, duration: 0.3 }, "-=0.1");
        }
        if (scrollLine) {
          master.to(
            scrollLine,
            { scaleY: 1, duration: 0.35, ease: "power2.out" },
            "-=0.2",
          );
        }
      };

      const setupAmbient = () => {
        if (reduced) return;

        if (photos.length) {
          gsap.to(photos, {
            yPercent: isMobile ? 3 : 5,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        if (copy) {
          gsap.to(copy, {
            y: isMobile ? 16 : 24,
            autoAlpha: 0.9,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        if (scrollHint) {
          gsap.to(scrollHint, {
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=100",
              scrub: true,
            },
          });
        }

        if (!isMobile && !isCoarse && photos.length) {
          const setters = photos.map((photo, index) => ({
            x: gsap.quickTo(photo, "x", { duration: 0.7, ease: "power3.out" }),
            y: gsap.quickTo(photo, "y", { duration: 0.7, ease: "power3.out" }),
            intensity: PANEL_PARALLAX[index] ?? 3,
          }));

          let cachedRect = section.getBoundingClientRect();
          let width = Math.max(cachedRect.width, 1);
          let height = Math.max(cachedRect.height, 1);
          refreshRect = () => {
            cachedRect = section.getBoundingClientRect();
            width = Math.max(cachedRect.width, 1);
            height = Math.max(cachedRect.height, 1);
          };

          mouseMove = (event: MouseEvent) => {
            const nx = ((event.clientX - cachedRect.left) / width - 0.5) * 2;
            const ny = ((event.clientY - cachedRect.top) / height - 0.5) * 2;
            setters.forEach(({ x, y, intensity }) => {
              x(nx * intensity);
              y(ny * intensity * 0.65);
            });
          };

          window.addEventListener("mousemove", mouseMove, { passive: true });
          window.addEventListener("resize", refreshRect, { passive: true });
          window.addEventListener("scroll", refreshRect, { passive: true });
        }
      };

      void (async () => {
        const started = performance.now();
        await loadHeroAssets(section, ({ ratio }) => {
          if (cancelled) return;
          setProgress(ratio);
          const bar = preloaderRef.current?.querySelector<HTMLElement>(
            "[data-hero-preloader-bar]",
          );
          if (bar) gsap.set(bar, { scaleX: Math.max(ratio, 0.04) });
        });
        if (cancelled) return;

        const elapsed = performance.now() - started;
        const fastExit = elapsed < 400;
        setProgress(1);
        playEntrance(fastExit);
        window.requestAnimationFrame(() => {
          if (!cancelled) setupAmbient();
        });
      })();

      failsafe = window.setTimeout(() => {
        if (cancelled) return;
        if (section.dataset.heroState !== "ready") forceReady();
      }, 1800);
    }, section);

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      if (mouseMove) window.removeEventListener("mousemove", mouseMove);
      if (refreshRect) {
        window.removeEventListener("resize", refreshRect);
        window.removeEventListener("scroll", refreshRect);
      }
      ctx.revert();
    };
  }, []);

  return (
    <>
      <HeroPreloader
        ref={preloaderRef}
        progress={progress}
        visible={showPreloader}
        site={site}
      />

      <section
        ref={sectionRef}
        id="inicio"
        aria-labelledby="hero-heading"
        data-hero-state="pending"
        className="relative isolate flex min-h-[calc(100svh-var(--site-header-height))] flex-col justify-center overflow-hidden bg-void"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hero-photo-frame absolute inset-0">
            <div className="hero-photo-grid">
              {HERO_BOSCH_PANELS.map((panel, index) => (
                <div
                  key={panel.src}
                  className="hero-photo-panel"
                  data-hero-panel
                >
                  <div className="hero-photo-motion absolute inset-0" data-hero-photo>
                    <Image
                      src={panel.src}
                      alt=""
                      fill
                      priority={index < 2}
                      quality={72}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className={`hero-photo object-cover ${panel.positionClass}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-gradient-protect absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-void/45 via-transparent to-void/10" />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_80%_15%,rgba(232,48,56,0.06),transparent_58%),radial-gradient(ellipse_50%_40%_at_15%_90%,rgba(79,83,164,0.05),transparent_58%)]"
            aria-hidden
          />
        </div>

        <div className="hero-shell relative z-[1]">
          <HeroCopy site={site} />
        </div>

        <div
          className="hero-scroll pointer-events-none absolute inset-x-0 z-[2] flex flex-col items-center gap-2"
          data-hero-scroll
        >
          <span className="font-body text-[0.6875rem] tracking-[0.2em] text-ice/68 uppercase">
            Role para explorar
          </span>
          <span className="hero-scroll-line" data-hero-scroll-line aria-hidden />
          <span className="hero-scroll-arrow text-ice/78" aria-hidden>
            <svg viewBox="0 0 16 20" className="h-4 w-3.5 stroke-current" fill="none">
              <path
                d="M8 2v14M3.5 11.5 8 16.5l4.5-5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </section>
    </>
  );
}
