"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { featuredBrand, secondaryBrands } from "@/lib/brands";
import { prefersReducedMotion } from "@/lib/prefers-motion";
import { BoschFeature } from "./BoschFeature";
import { BrandStrip } from "./BrandStrip";

gsap.registerPlugin(ScrollTrigger);

export function Partners() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceHook = useReducedMotion();
  const reduced = reduceHook ?? false;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-partners-copy]", {
        y: 24,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="marcas"
      aria-labelledby="partners-heading"
      className="section-atmosphere section-atmosphere-steel section-divider-top relative overflow-x-hidden bg-steel px-6 py-20 sm:px-10 lg:px-16 lg:py-24"
    >
      <div className="mb-14 max-w-3xl lg:mb-20">
        <p
          data-partners-copy
          className="font-body text-kicker text-signal uppercase"
        >
          Marcas · no balcão
        </p>
        <h2
          id="partners-heading"
          data-partners-copy
          className="font-display text-display-lg mt-3 text-ice uppercase"
        >
          GRANDES MARCAS PARA
          <br />
          GRANDES TRABALHOS.
        </h2>
        <p
          data-partners-copy
          className="mt-5 max-w-xl text-body-md text-mute sm:text-body-lg"
        >
          Trabalhamos com fabricantes reconhecidos para oferecer ferramentas,
          máquinas, fixadores e soluções profissionais em que você pode
          confiar.
        </p>
      </div>

      <BoschFeature brand={featuredBrand} reducedMotion={reduced} />

      <div className="mt-12 lg:mt-14">
        <BrandStrip brands={secondaryBrands} reducedMotion={reduced} />
      </div>
    </section>
  );
}
