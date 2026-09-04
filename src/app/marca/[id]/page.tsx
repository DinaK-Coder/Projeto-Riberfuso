import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/brands/BrandLogo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { brandPageHref, brandSearchTerm, brands, getBrand } from "@/lib/brands";
import { buildCatalogUrl } from "@/lib/catalog-url";
import { site } from "@/lib/site";

type BrandPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return brands.map((brand) => ({ id: brand.id }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { id } = await params;
  const brand = getBrand(id);
  if (!brand) return { title: "Marca" };

  return {
    title: `${brand.title ?? brand.name} em Poços de Caldas`,
    description: `${brand.title ?? brand.name} na ${site.name}. ${brand.description}`,
    alternates: { canonical: brandPageHref(brand) },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { id } = await params;
  const brand = getBrand(id);
  if (!brand) notFound();

  const catalogHref = buildCatalogUrl({
    q: brandSearchTerm(brand),
    mode: "description",
  });

  return (
    <main>
      <SiteHeader />
      <section className="border-b border-ice/10 bg-steel px-6 py-14 sm:px-10 lg:px-16 lg:py-16">
        <div
          className={
            brand.featured
              ? "mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center"
              : "mx-auto max-w-[90rem]"
          }
        >
          {brand.featured ? (
            <div className="flex h-44 w-full max-w-[22rem] items-center justify-center bg-[#e7eaf1] px-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] ring-1 ring-black/10 lg:h-52">
              <BrandLogo brand={brand} featured />
            </div>
          ) : null}
          <div>
            <p className="font-body text-kicker text-signal uppercase">
              {brand.featured
                ? `Parceiro · ${site.city}`
                : `Marca · ${site.city}`}
            </p>
            <h1 className="font-display text-display-lg mt-3 text-ice uppercase">
              {brand.title ?? brand.name}
            </h1>
            <p className="mt-3 inline-flex border border-white/15 px-3 py-1 font-body text-kicker text-mute uppercase">
              {brand.classification}
            </p>
            <p className="mt-5 max-w-2xl text-body-md text-mute sm:text-body-lg">
              {brand.description}
            </p>
            {brand.highlight ? (
              <p className="font-display mt-5 max-w-2xl text-lg font-bold text-ice sm:text-xl">
                {brand.highlight}
              </p>
            ) : null}
            <Link
              href={catalogHref}
              className="mt-8 inline-flex min-h-12 items-center bg-signal px-5 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#c4242c] focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
            >
              Consultar estoque
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
