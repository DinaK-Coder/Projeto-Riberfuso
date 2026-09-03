import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductCatalog } from "@/components/catalog/ProductCatalog";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteContent } from "@/lib/firebase/content";
import { homeSection, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Catálogo | ${site.name}`,
  description:
    "Consulte o cadastro de produtos da Riberfuso em Poços de Caldas: parafusos, ferramentas, máquinas e ferragens. Busca por código ou descrição.",
};

export default async function CatalogoPage() {
  const content = await getSiteContent();

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
        <Suspense
          fallback={
            <p className="text-body-md text-mute" role="status">
              Carregando catálogo…
            </p>
          }
        >
          <ProductCatalog whatsappUrl={content.whatsapp} />
        </Suspense>
      </section>
      <SiteFooter />
    </main>
  );
}
