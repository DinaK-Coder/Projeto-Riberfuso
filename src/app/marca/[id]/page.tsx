import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
        <div className="mx-auto max-w-[90rem]">
          <p className="font-body text-kicker text-signal uppercase">
            Marca · {site.city}
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
          <Link
            href={catalogHref}
            className="mt-8 inline-flex min-h-12 items-center bg-signal px-5 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#c4242c] focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            Consultar estoque
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
