"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATALOG_SHORTCUTS } from "@/lib/catalog-shortcuts";
import { buildCatalogUrl } from "@/lib/catalog-url";
import {
  suggestCatalog,
  type CatalogPayload,
  type CatalogProduct,
} from "@/lib/catalog";
import { brands } from "@/lib/brands";
import { needLines } from "@/lib/need-lines";

type GlobalSearchProps = {
  variant: "header" | "hero" | "menu";
  onNavigate?: () => void;
};

let catalogPromise: Promise<CatalogProduct[]> | null = null;

function loadCatalogProducts() {
  if (!catalogPromise) {
    catalogPromise = fetch("/catalog/products.json")
      .then((response) => {
        if (!response.ok) throw new Error("Falha ao carregar catálogo");
        return response.json() as Promise<CatalogPayload>;
      })
      .then((payload) => payload.products)
      .catch(() => {
        catalogPromise = null;
        return [] as CatalogProduct[];
      });
  }
  return catalogPromise;
}

export function GlobalSearch({ variant, onNavigate }: GlobalSearchProps) {
  const router = useRouter();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadCatalogProducts().then((items) => {
      if (!cancelled) setProducts(items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  const productHits = useMemo(
    () => suggestCatalog(products, query, 5),
    [products, query],
  );

  const shortcutHits = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) return [];
    return CATALOG_SHORTCUTS.filter(
      (item) =>
        item.description.toLowerCase().includes(normalized) ||
        item.abbreviation.toLowerCase().includes(normalized) ||
        item.searchTerms.toLowerCase().includes(normalized),
    ).slice(0, 3);
  }, [query]);

  const brandHits = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) return [];
    return brands
      .filter((brand) => brand.name.toLowerCase().includes(normalized))
      .slice(0, 2);
  }, [query]);

  const lineHits = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) return [];
    return needLines
      .filter(
        (line) =>
          line.name.toLowerCase().includes(normalized) ||
          line.description.toLowerCase().includes(normalized),
      )
      .slice(0, 2);
  }, [query]);

  const hasSuggestions =
    query.trim().length >= 2 &&
    (productHits.length > 0 ||
      shortcutHits.length > 0 ||
      brandHits.length > 0 ||
      lineHits.length > 0);

  const goToCatalog = (nextQuery = query, mode?: "code" | "description") => {
    const trimmed = nextQuery.trim();
    const digits = trimmed.replace(/\D/g, "");
    const nextMode =
      mode ??
      (digits.length >= 3 && digits.length / trimmed.replace(/\s/g, "").length >= 0.7
        ? "code"
        : "description");
    setOpen(false);
    onNavigate?.();
    router.push(buildCatalogUrl({ q: trimmed, mode: nextMode }));
  };

  const inputClass =
    variant === "hero"
      ? "h-12 w-full border border-white/20 bg-void/70 px-4 text-body-md text-ice outline-none placeholder:text-ice/45 focus:border-signal"
      : "h-11 w-full border border-ice/15 bg-ink px-3 text-[0.9375rem] text-ice outline-none placeholder:text-mute/55 focus:border-signal";

  return (
    <div ref={wrapRef} className="relative w-full min-w-0">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          goToCatalog();
        }}
      >
        <label className="sr-only" htmlFor={`${listId}-input`}>
          Buscar produtos
        </label>
        <input
          id={`${listId}-input`}
          type="search"
          value={query}
          autoComplete="off"
          placeholder="Busque por código, medida ou produto"
          aria-autocomplete="list"
          aria-expanded={open && hasSuggestions}
          aria-controls={listId}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          className={inputClass}
        />
      </form>

      {open && hasSuggestions ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-[80] mt-1 max-h-[min(24rem,70vh)] w-full overflow-y-auto border border-ice/15 bg-ink py-1 shadow-xl"
        >
          {lineHits.map((line) => (
            <li key={`line-${line.id}`}>
              <button
                type="button"
                role="option"
                className="flex w-full flex-col items-start px-3 py-2.5 text-left hover:bg-steel/50 focus-visible:bg-steel/50 focus-visible:outline-none"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                  router.push(line.href);
                }}
              >
                <span className="text-[0.6875rem] tracking-[0.08em] text-signal uppercase">
                  Categoria
                </span>
                <span className="text-[0.9375rem] text-ice">{line.name}</span>
              </button>
            </li>
          ))}
          {brandHits.map((brand) => (
            <li key={`brand-${brand.id}`}>
              <button
                type="button"
                role="option"
                className="flex w-full flex-col items-start px-3 py-2.5 text-left hover:bg-steel/50 focus-visible:bg-steel/50 focus-visible:outline-none"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                  router.push(`/marca/${brand.id}`);
                }}
              >
                <span className="text-[0.6875rem] tracking-[0.08em] text-signal uppercase">
                  Marca
                </span>
                <span className="text-[0.9375rem] text-ice">{brand.name}</span>
              </button>
            </li>
          ))}
          {shortcutHits.map((shortcut) => (
            <li key={`short-${shortcut.abbreviation}`}>
              <button
                type="button"
                role="option"
                className="flex w-full flex-col items-start px-3 py-2.5 text-left hover:bg-steel/50 focus-visible:bg-steel/50 focus-visible:outline-none"
                onClick={() => goToCatalog(shortcut.abbreviation, "description")}
              >
                <span className="text-[0.6875rem] tracking-[0.08em] text-signal uppercase">
                  Sugestão
                </span>
                <span className="text-[0.9375rem] text-ice">{shortcut.description}</span>
              </button>
            </li>
          ))}
          {productHits.map((product) => (
            <li key={product.c}>
              <button
                type="button"
                role="option"
                className="flex w-full flex-col items-start px-3 py-2.5 text-left hover:bg-steel/50 focus-visible:bg-steel/50 focus-visible:outline-none"
                onClick={() => goToCatalog(product.c, "code")}
              >
                <span className="font-body text-[0.75rem] tracking-[0.04em] text-signal">
                  {product.c}
                </span>
                <span className="line-clamp-2 text-[0.9375rem] text-ice">{product.n}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
