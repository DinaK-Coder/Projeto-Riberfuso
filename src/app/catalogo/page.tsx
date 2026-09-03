import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteContent } from "@/lib/firebase/content";
import { parseCatalogSearchInput } from "@/lib/catalog-url";
import { homeSection, site } from "@/lib/site";

const ProductCatalog = dynamic(
  () =>
    import("@/components/catalog/ProductCatalog").then(
      (module) => module.ProductCatalog,
    ),
  {
    loading: () => (
      <p className="text-body-md text-mute" role="status">
        Carregando catálogo…
      </p>
    ),
  },
);

export const metadata: Metadata = {
  title: `Catálogo | ${site.name}`,
  description:
    "Consulte o cadastro de produtos da Riberfuso em Poços de Caldas: parafusos, ferramentas, máquinas e ferragens. Busca por código ou descrição.",
};

type CatalogoSearchParams = {
  q?: string | string[];
  mode?: string | string[];
  categoria?: string | string[];
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<CatalogoSearchParams>;
}) {
  const [content, params] = await Promise.all([
    getSiteContent(),
    searchParams,
  ]);
  const initialSearch = parseCatalogSearchInput(params);

  return (
    <main>
      <SiteHeader />
      <section className="border-b border-ice/10 bg-steel px-6 py-14 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-[90rem]">
          <p className="font-body text-kicker text-signal uppercase">
            Cadastro · {content.city}
          </p>
          <h1 className="font-display text-display-lg mt-3 max-w-4xl text-ice uppercase">
            Catálogo de produtos
          </h1>
          <p className="mt-5 max-w-2xl text-body-md text-mute sm:text-body-lg">
            Mais de 7 mil itens no cadastro comercial. Busque pelo código ou pela
            descrição e consulte disponibilidade e preço pelo WhatsApp.
          </p>
          <Link
            href={homeSection("produtos")}
            className="mt-6 inline-flex text-[0.8125rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:text-signal"
          >
            Voltar às linhas de produto
          </Link>
        </div>
      </section>

      <section className="bg-void px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <ProductCatalog
          whatsappUrl={content.whatsapp}
          initialSearch={initialSearch}
        />
      </section>
      <SiteFooter />
    </main>
  );
}
