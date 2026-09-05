import type { Metadata } from "next";
import { History } from "@/components/history/History";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre a Riberfuso",
  description: `História da ${site.name} em ${site.city}: origem em Ribeirão Preto, chegada em 1991 e as duas unidades de hoje.`,
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-masthead section-invert bg-steel px-6 py-14 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-[90rem]">
          <p className="font-body text-kicker text-signal uppercase">
            Sobre · {site.city}
          </p>
          <h1 className="font-display text-display-lg mt-3 max-w-4xl text-ice uppercase">
            A história da Riberfuso
          </h1>
          <p className="mt-5 max-w-2xl text-body-md text-mute sm:text-body-lg">
            De Ribeirão Preto a Poços de Caldas: duas lojas, estoque no balcão e
            atendimento técnico desde 1991.
          </p>
        </div>
      </section>
      <History asPage />
      <SiteFooter />
    </main>
  );
}
