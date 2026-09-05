import Link from "next/link";
import { CatalogDownloadButton } from "./CatalogDownloadButton";
import { buildCatalogUrl } from "@/lib/catalog-url";

export function CatalogSearchCTA() {
  return (
    <aside
      data-catalog-cta
      className="relative overflow-hidden border border-ice/10 bg-gradient-to-r from-steel/70 via-steel/25 to-void px-6 py-8 sm:px-8 sm:py-10 lg:px-10"
      aria-labelledby="catalog-search-cta-heading"
    >
      <div
        className="pointer-events-none absolute -top-10 -right-6 h-40 w-40 rounded-full bg-signal/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-brand/20 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-body text-kicker text-signal uppercase">
            Busca no catálogo
          </p>
          <h3
            id="catalog-search-cta-heading"
            className="font-display text-display-md mt-2 text-ice uppercase"
          >
            Procurando um produto específico?
          </h3>
          <p className="mt-3 text-body-md text-mute sm:text-body-lg">
            Consulte nosso catálogo completo por código ou descrição. Mais de 7 mil
            itens cadastrados — disponibilidade e preço sob consulta.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={buildCatalogUrl()}
            className="inline-flex min-h-12 items-center justify-center bg-signal px-6 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-white uppercase transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#c4242c] focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            Consultar catálogo
          </Link>
          <CatalogDownloadButton className="transition-[border-color,color,transform] duration-200 hover:-translate-y-px" />
        </div>
      </div>
    </aside>
  );
}
