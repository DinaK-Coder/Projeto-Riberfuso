import type { Metadata } from "next";
import { OffersBoard } from "@/components/offers/OffersBoard";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PedirOrcamentoButton } from "@/components/quote/PedirOrcamentoButton";
import { Videos } from "@/components/videos/Videos";
import { getOffers, getSiteContent } from "@/lib/firebase/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ofertas e novidades",
  description: `Ofertas do balcão e vídeos do canal da ${site.name} em ${site.city}. Consulte promoções, estoque e novidades de ferramentas.`,
  alternates: { canonical: "/novidades" },
};

export default async function NovidadesPage() {
  const [content, offers] = await Promise.all([
    getSiteContent(),
    getOffers(),
  ]);

  return (
    <main>
      <SiteHeader />
      <section className="border-b border-ice/10 bg-steel px-6 py-14 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-[90rem]">
          <p className="font-body text-kicker text-signal uppercase">
            Balcão · {content.city}
          </p>
          <h1 className="font-display text-display-lg mt-3 max-w-4xl text-ice uppercase">
            Ofertas e novidades
          </h1>
          <p className="mt-5 max-w-2xl text-body-md text-mute sm:text-body-lg">
            Promoções e condições do momento, mais os vídeos recentes do canal
            Manual das Ferramentas. Preço e estoque sempre sob consulta.
          </p>
          <div className="mt-8">
            <PedirOrcamentoButton />
          </div>
        </div>
      </section>

      <section
        id="ofertas"
        aria-labelledby="ofertas-heading"
        className="bg-void px-6 py-16 sm:px-10 lg:px-16 lg:py-20"
      >
        <div className="mx-auto max-w-[90rem]">
          <p className="font-body text-kicker text-signal uppercase">
            Ofertas · agora
          </p>
          <h2
            id="ofertas-heading"
            className="font-display text-display-lg mt-3 text-ice uppercase"
          >
            No balcão
          </h2>
          <p className="mt-5 max-w-xl text-body-md text-mute sm:text-body-lg">
            Confira o que está em destaque e fale com a loja para quantidade,
            medida e disponibilidade.
          </p>
          <OffersBoard offers={offers} />
        </div>
      </section>

      <Videos sectionId="canal" />
      <SiteFooter />
    </main>
  );
}
