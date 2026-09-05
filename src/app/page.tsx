import dynamic from "next/dynamic";
import { ContactPreview } from "@/components/contact/ContactPreview";
import { Hero } from "@/components/hero/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Stores } from "@/components/stores/Stores";
import { getSiteContent } from "@/lib/firebase/content";

const Catalog = dynamic(() =>
  import("@/components/catalog/Catalog").then((module) => module.Catalog),
);
const Partners = dynamic(() =>
  import("@/components/brands/Partners").then((module) => module.Partners),
);

export default async function HomePage() {
  const site = await getSiteContent();

  return (
    <main>
      <SiteHeader />
      <Hero site={site} />
      <CredibilityStrip />
      <Catalog />
      <Partners />
      <Stores />
      <ContactPreview />
      <SiteFooter />
    </main>
  );
}
