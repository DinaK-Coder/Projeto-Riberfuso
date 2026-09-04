"use client";

import { useEffect, useState } from "react";
import { replaceCatalogUrl, type ParsedCatalogUrl } from "@/lib/catalog-url";

/**
 * Catalog search fields stay in React state while typing.
 * The address bar is updated in place so the query stays shareable
 * without a Next.js navigation that would remount the field.
 */
export function useCatalogSearchState(initialSearch: ParsedCatalogUrl) {
  const [mode, setMode] = useState(initialSearch.mode);
  const [query, setQuery] = useState(initialSearch.q);
  const [categoryId, setCategoryId] = useState(initialSearch.categoria);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      replaceCatalogUrl({ q: query, mode, categoria: categoryId });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query, mode, categoryId]);

  return { mode, setMode, query, setQuery, categoryId, setCategoryId };
}
