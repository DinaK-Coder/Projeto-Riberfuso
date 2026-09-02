"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  aboutPhotos,
  aboutStory,
  historyChapters,
  type AboutPhoto,
} from "@/lib/history";
import { prefersReducedMotion } from "@/lib/prefers-motion";

gsap.registerPlugin(ScrollTrigger);

export function History() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-about-rise]", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      });

      gsap.from("[data-about-photo]", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-about-gallery]",
          start: "top 80%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sobre"
      aria-labelledby="history-heading"
      className="bg-void px-6 py-20 sm:px-10 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 xl:gap-20">
          <div className="max-w-2xl">
            <p
              data-about-rise
              className="font-body text-kicker text-signal uppercase"
            >
              {aboutStory.kicker}
            </p>
            <h2
              id="history-heading"
              data-about-rise
              className="font-display text-display-md mt-3 text-ice uppercase sm:text-display-lg"
            >
              {aboutStory.title}
            </h2>

            <div className="mt-8 space-y-5">
              {aboutStory.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  data-about-rise
                  className="text-body-md leading-relaxed text-mute sm:text-body-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <p
              data-about-rise
              className="mt-8 border-l-2 border-signal pl-4 text-base leading-relaxed text-ice sm:text-lg"
            >
              {aboutStory.closing}
            </p>
          </div>

          <ol
            data-about-rise
            className="about-milestones"
            aria-label="Marcos da história"
          >
            {historyChapters.map((chapter) => (
              <li key={chapter.id} className="about-milestone">
                <p className="font-body text-kicker text-signal uppercase">
                  {chapter.index}
                </p>
                <h3 className="font-display mt-2 text-xl font-extrabold text-ice sm:text-2xl">
                  {chapter.year}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mute sm:text-base">
                  {chapter.context}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div
          data-about-gallery
          className="about-gallery mt-14 lg:mt-16"
          role="list"
        >
          {aboutPhotos.map((photo) => (
            <AboutPhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPhotoCard({ photo }: { photo: AboutPhoto }) {
  const isArchive = photo.id === "anos-90";

  return (
    <figure data-about-photo className="about-photo" role="listitem">
      <div
        className={`about-photo-frame${isArchive ? " about-photo-frame--archive" : ""}`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className={`about-photo-img${isArchive ? " about-photo-img--archive" : ""}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 30vw"
        />
      </div>
      <figcaption className="about-photo-caption">
        <p className="font-body text-kicker text-signal uppercase">{photo.era}</p>
        <p className="font-display mt-1.5 text-lg font-bold text-ice sm:text-xl">
          {photo.title}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-mute">{photo.caption}</p>
      </figcaption>
    </figure>
  );
}
