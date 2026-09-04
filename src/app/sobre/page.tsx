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
      <History asPage />
      <SiteFooter />
    </main>
  );
}
