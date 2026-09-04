import type { CatalogSearchMode } from "@/lib/catalog";

export type CatalogUrlParams = {
  q?: string;
  mode?: CatalogSearchMode;
  categoria?: string;
};

export type ParsedCatalogUrl = {
  q: string;
  mode: CatalogSearchMode;
  categoria: string;
};

export function buildCatalogUrl(params: CatalogUrlParams = {}): string {
  const search = new URLSearchParams();

  if (params.q?.trim()) search.set("q", params.q.trim());
  if (params.mode === "code") search.set("mode", "code");
  if (params.categoria?.trim()) search.set("categoria", params.categoria.trim());

  const query = search.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
}

export function parseCatalogUrl(searchParams: URLSearchParams): ParsedCatalogUrl {
  const mode = searchParams.get("mode");
  return {
    q: searchParams.get("q") ?? "",
    mode: mode === "code" ? "code" : "description",
    categoria: searchParams.get("categoria") ?? "",
  };
}

function firstQueryValue(value?: string | string[]): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/** Parse App Router `searchParams` (string or string[]). */
export function parseCatalogSearchInput(
  input: {
    q?: string | string[];
    mode?: string | string[];
    categoria?: string | string[];
  } = {},
): ParsedCatalogUrl {
  const mode = firstQueryValue(input.mode);
  return {
    q: firstQueryValue(input.q),
    mode: mode === "code" ? "code" : "description",
    categoria: firstQueryValue(input.categoria),
  };
}

function catalogUrlMatchesLocation(url: string): boolean {
  const current = new URL(window.location.href);
  const next = new URL(url, window.location.origin);
  return (
    current.pathname === next.pathname &&
    (current.searchParams.get("q") ?? "") === (next.searchParams.get("q") ?? "") &&
    (current.searchParams.get("mode") ?? "") === (next.searchParams.get("mode") ?? "") &&
    (current.searchParams.get("categoria") ?? "") ===
      (next.searchParams.get("categoria") ?? "")
  );
}

/**
 * Mirror catalog state in the address bar without a Next.js navigation.
 * `router.replace` would suspend the page (flicker) and write the URL back
 * into the input, fighting the user as they type.
 */
export function replaceCatalogUrl(params: CatalogUrlParams): void {
  if (typeof window === "undefined") return;
  const url = buildCatalogUrl(params);
  if (catalogUrlMatchesLocation(url)) return;
  window.history.replaceState(window.history.state ?? null, "", url);
}
