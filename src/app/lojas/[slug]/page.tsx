import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StoreCard } from "@/components/stores/StoreCard";
import { SITE_URL, storeJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { storeBySlug, stores } from "@/lib/stores";

type StorePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stores.map((store) => ({ slug: store.slug }));
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = storeBySlug(slug);
  if (!store) return { title: "Loja" };

  const title = `${store.typeLabel} ${store.name} em Poços de Caldas`;
  const description = `${site.name} ${store.typeLabel} ${store.name}: ${store.street}, ${store.neighborhood}. Traçar rota, ligar ou falar no WhatsApp.`;

  return {
    title,
    description,
    alternates: { canonical: `/lojas/${store.slug}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: `${SITE_URL}/lojas/${store.slug}`,
      images: [{ url: store.photoSrc, alt: store.photoAlt }],
    },
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const store = storeBySlug(slug);
  if (!store) notFound();

  return (
    <main>
      <JsonLd data={storeJsonLd(store)} />
      <SiteHeader />
      <section className="border-b border-ice/10 bg-steel px-6 py-14 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto grid max-w-[90rem] gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div>
            <p className="font-body text-kicker text-signal uppercase">
              Loja · {store.city}
            </p>
            <h1 className="font-display text-display-lg mt-3 text-ice uppercase">
              {store.typeLabel} {store.name}
            </h1>
            <p className="mt-5 max-w-2xl text-body-md text-mute sm:text-body-lg">
              Atacado e varejo de parafusos, ferramentas e máquinas em Poços de
              Caldas. Consulte estoque e fale com esta unidade no WhatsApp.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden border border-ice/10">
            <Image
              src={store.photoSrc}
              alt={store.photoAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>
      <section className="bg-void px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-[36rem]">
          <StoreCard store={store} showPageLink={false} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
