import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contato | ${site.name}`,
  description: `Fale com a ${site.name} em ${site.city}. WhatsApp, telefone e rotas para a Matriz Vila Nova e a Filial Centro.`,
};

export default function ContatoPage() {
  return (
    <main>
      <SiteHeader />
      <ContactPageContent />
      <SiteFooter />
    </main>
  );
}
