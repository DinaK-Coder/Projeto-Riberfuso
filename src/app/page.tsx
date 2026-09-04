import dynamic from "next/dynamic";
import { ContactPreview } from "@/components/contact/ContactPreview";
import { Hero } from "@/components/hero/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { NewsBar } from "@/components/home/NewsBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Stores } from "@/components/stores/Stores";
import { getOffers, getSiteContent } from "@/lib/firebase/content";
import { getYoutubeVideos } from "@/lib/youtube-feed";

const Catalog = dynamic(() =>
  import("@/components/catalog/Catalog").then((module) => module.Catalog),
);
const Partners = dynamic(() =>
  import("@/components/brands/Partners").then((module) => module.Partners),
);

export default async function HomePage() {
  const [site, offers, videos] = await Promise.all([
    getSiteContent(),
    getOffers(),
    getYoutubeVideos(4),
  ]);
  const latestVideo =
    videos.find((video) => !video.isShort) ?? videos[0] ?? null;

  return (
    <main>
      <SiteHeader />
      <Hero site={site} />
      <NewsBar offers={offers} latestVideo={latestVideo} />
      <CredibilityStrip />
      <Catalog />
      <Partners />
      <Stores />
      <ContactPreview />
      <SiteFooter />
    </main>
  );
}
