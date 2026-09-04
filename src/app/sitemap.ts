import type { MetadataRoute } from "next";
import { brands } from "@/lib/brands";
import { SITE_URL } from "@/lib/seo";
import { stores } from "@/lib/stores";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/catalogo`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contato`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...stores.map((store) => ({
      url: `${SITE_URL}/lojas/${store.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...brands.map((brand) => ({
      url: `${SITE_URL}/marca/${brand.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
