import { getSiteContent } from "@/lib/firebase/content";
import { SiteHeaderBar } from "./SiteHeaderBar";

export async function SiteHeader() {
  const site = await getSiteContent();
  return <SiteHeaderBar site={site} />;
}
