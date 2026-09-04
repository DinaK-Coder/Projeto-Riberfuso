import Link from "next/link";
import { homeSection, type SiteContent } from "@/lib/site";
import { PedirOrcamentoButton } from "@/components/quote/PedirOrcamentoButton";

const buttonBase =
  "hero-btn inline-flex w-full items-center justify-center gap-2 px-5 font-body text-[0.8125rem] font-semibold tracking-[0.08em] uppercase transition-[color,background-color,border-color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:outline-none active:translate-y-px sm:text-sm lg:w-auto lg:min-w-[13rem] lg:px-6";

export function HeroCopy({ site }: { site: SiteContent }) {
  return (
    <div className="hero-copy flex w-full flex-col justify-center text-left">
      <div className="hero-main">
        <p
          className="hero-kicker mb-3 font-body text-kicker text-mute uppercase"
          data-hero-kicker
        >
          {site.storesShort} · Desde {site.since}
        </p>
        <h1 id="hero-heading" className="hero-slogan font-display text-ice">
          <span className="hero-line-mask">
            <span className="hero-line block" data-hero-line>
              Bom de preço,
            </span>
          </span>
          <span className="hero-line-mask mt-[0.04em]">
            <span className="hero-line highlight block text-signal" data-hero-line>
              bom de negócio.
            </span>
          </span>
        </h1>
        <p className="hero-lead mt-5 sm:mt-6" data-hero-lead>
          Parafusos, ferramentas, máquinas e ferragens das principais marcas —
          estoque amplo e orientação técnica no balcão.
        </p>
        <div
          className="hero-actions mt-6 flex w-full flex-col gap-3 sm:mt-7 lg:flex-row lg:flex-nowrap lg:items-stretch"
          data-hero-actions
        >
          <PedirOrcamentoButton />
          <Link
            href="/catalogo"
            className={`${buttonBase} border border-white/80 bg-void/55 text-white hover:border-white hover:bg-void/72 focus-visible:border-white active:bg-void/80`}
            data-hero-cta
          >
            Ver catálogo
          </Link>
        </div>
        <Link
          href={homeSection("lojas")}
          className="mt-4 inline-flex min-h-11 items-center font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-ice/80 uppercase transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          data-hero-cta
        >
          Ver nossas lojas
        </Link>
      </div>
    </div>
  );
}
