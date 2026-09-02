import type { CatalogSearchMode } from "@/lib/catalog";

export type CatalogUrlParams = {
  q?: string;
  mode?: CatalogSearchMode;
  categoria?: string;
};

export function buildCatalogUrl(params: CatalogUrlParams = {}): string {
  const search = new URLSearchParams();

  if (params.q?.trim()) search.set("q", params.q.trim());
  if (params.mode === "code") search.set("mode", "code");
  if (params.categoria?.trim()) search.set("categoria", params.categoria.trim());

  const query = search.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
}

export function parseCatalogUrl(searchParams: URLSearchParams): {
  q: string;
  mode: CatalogSearchMode;
  categoria: string;
} {
  const mode = searchParams.get("mode");
  return {
    q: searchParams.get("q") ?? "",
    mode: mode === "code" ? "code" : "description",
    categoria: searchParams.get("categoria") ?? "",
  };
}
