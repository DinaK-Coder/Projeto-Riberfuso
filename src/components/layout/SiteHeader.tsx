import { getSiteContent, getStores } from "@/lib/firebase/content";
import { SiteHeaderBar } from "./SiteHeaderBar";

export async function SiteHeader() {
  const [site, stores] = await Promise.all([getSiteContent(), getStores()]);
  return <SiteHeaderBar site={site} stores={stores} />;
}
