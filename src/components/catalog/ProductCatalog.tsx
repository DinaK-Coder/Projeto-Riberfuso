"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useRouter, useSearchParams } from "next/navigation";
import { CATALOG_SHORTCUTS } from "@/lib/catalog-shortcuts";
import { buildCatalogUrl, parseCatalogUrl } from "@/lib/catalog-url";
import {
  CATALOG_PDF_HREF,
  PAGE_SIZE,
  categoryLabel,
  searchCatalog,
  whatsappConsultUrl,
  whatsappNotFoundUrl,
  type CatalogPayload,
  type CatalogProduct,
  type CatalogSearchMode,
} from "@/lib/catalog";
import { prefersReducedMotion } from "@/lib/prefers-motion";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M12 4v10m0 0 4-4m-4 4-4-4M5 18h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodeHighlight({ code, query }: { code: string; query: string }) {
  const digits = query.replace(/\D/g, "");
  if (!digits) {
    return <>{code}</>;
  }

  const idx = code.indexOf(digits);
  if (idx === -1) {
    return <>{code}</>;
  }

  return (
    <>
      {code.slice(0, idx)}
      <mark className="bg-signal/25 text-signal">{code.slice(idx, idx + digits.length)}</mark>
      {code.slice(idx + digits.length)}
    </>
  );
}

function CatalogDownloadSection() {
  return (
    <aside
      className="mt-14 border border-ice/10 bg-steel/25 p-6 sm:p-8"
      aria-labelledby="catalog-download-heading"
    >
      <p className="font-body text-kicker text-signal uppercase">Catálogo completo</p>
      <h2
        id="catalog-download-heading"
        className="font-display text-display-md mt-2 text-ice uppercase"
      >
        Prefere consultar o catálogo completo?
      </h2>
      <p className="mt-3 max-w-2xl text-body-md text-mute">
        Baixe o catálogo da Riberfuso e consulte nossa linha de produtos com calma, no
        formato tradicional.
      </p>
      {CATALOG_PDF_HREF ? (
        <a
          href={CATALOG_PDF_HREF}
          download
          className="mt-6 inline-flex min-h-12 items-center gap-2 border border-ice/25 bg-void px-5 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:border-signal hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
        >
          <DownloadIcon />
          Baixar catálogo completo — PDF
        </a>
      ) : (
        <p className="mt-6 text-[0.875rem] text-mute">
          O PDF oficial estará disponível em breve nesta página. Enquanto isso, utilize a
          busca acima ou fale com nossa equipe pelo WhatsApp.
        </p>
      )}
    </aside>
  );
}

const TABS: { id: CatalogSearchMode; label: string }[] = [
  { id: "description", label: "Buscar por descrição" },
  { id: "code", label: "Buscar por código" },
];

function CatalogPagination({
  currentPage,
  pageCount,
  onPageChange,
  className = "",
}: {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  return (
    <nav
      aria-label="Paginação do catálogo"
      className={`flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="inline-flex min-h-11 items-center border border-ice/20 px-4 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:border-ice/45 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
      >
        Anterior
      </button>
      <p className="text-[0.875rem] text-mute" aria-live="polite">
        Página {currentPage} de {pageCount}
      </p>
      <button
        type="button"
        disabled={currentPage >= pageCount}
        onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
        className="inline-flex min-h-11 items-center border border-ice/20 px-4 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:border-ice/45 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
      >
        Próxima
      </button>
    </nav>
  );
}

export function ProductCatalog({ whatsappUrl }: { whatsappUrl: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialParams = useMemo(() => parseCatalogUrl(searchParams), [searchParams]);

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [mode, setMode] = useState<CatalogSearchMode>(initialParams.mode);
  const [query, setQuery] = useState(initialParams.q);
  const [categoryId, setCategoryId] = useState(initialParams.categoria);
  const [page, setPage] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const catalogTopRef = useRef<HTMLDivElement>(null);
  const prevMode = useRef(mode);
  const scrollAfterPageChange = useRef(false);
  const urlReady = useRef(false);

  const deferredQuery = useDeferredValue(query);
  const activeQuery = mode === "code" ? query.trim() : deferredQuery.trim();
  const isSearching = mode === "description" && query.trim() !== deferredQuery.trim();
  const hasQuery = activeQuery.length > 0;
  const hasCategory = categoryId.length > 0;
  const categoryName = hasCategory ? categoryLabel(categoryId) : "";

  useEffect(() => {
    const next = parseCatalogUrl(searchParams);
    setMode(next.mode);
    setQuery(next.q);
    setCategoryId(next.categoria);
    urlReady.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (!urlReady.current) return;

    const current = parseCatalogUrl(searchParams);
    if (
      current.q !== activeQuery ||
      current.mode !== mode ||
      current.categoria !== categoryId
    ) {
      router.replace(
        buildCatalogUrl({ q: activeQuery, mode, categoria: categoryId }),
        { scroll: false },
      );
    }
  }, [activeQuery, mode, categoryId, router, searchParams]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetch("/catalog/products.json")
      .then((response) => {
        if (!response.ok) throw new Error("Falha ao carregar catálogo");
        return response.json() as Promise<CatalogPayload>;
      })
      .then((payload) => {
        if (cancelled) return;
        setProducts(payload.products);
        setTotal(payload.count);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeQuery, mode, categoryId]);

  useEffect(() => {
    if (!scrollAfterPageChange.current) return;
    scrollAfterPageChange.current = false;

    catalogTopRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }, [page]);

  useEffect(() => {
    if (prevMode.current === mode) return;
    prevMode.current = mode;

    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) return;

    gsap.fromTo(
      panel,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" },
    );
  }, [mode]);

  const results = useMemo(
    () =>
      searchCatalog(products, activeQuery, mode, {
        categoryId: categoryId || undefined,
      }),
    [products, activeQuery, mode, categoryId],
  );

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const switchMode = (next: CatalogSearchMode) => {
    if (next === mode) return;
    setMode(next);
    setQuery("");
    setCategoryId("");
  };

  const clearCategory = () => {
    setCategoryId("");
  };

  const applyShortcut = (abbreviation: string) => {
    setMode("description");
    setCategoryId("");
    setQuery(abbreviation);
  };

  const goToPage = (next: number) => {
    scrollAfterPageChange.current = true;
    setPage(next);
  };

  return (
    <div className="mx-auto max-w-[90rem]">
      <div
        ref={catalogTopRef}
        role="tablist"
        aria-label="Modo de busca do catálogo"
        className="flex scroll-mt-[calc(var(--site-header-height)+0.75rem)] flex-col gap-2 sm:flex-row sm:gap-0"
      >
        {TABS.map((tab, index) => {
          const selected = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`catalog-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls="catalog-search-panel"
              onClick={() => switchMode(tab.id)}
              className={`min-h-12 flex-1 border px-4 py-3 font-body text-[0.8125rem] font-semibold tracking-[0.08em] uppercase transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none sm:text-sm ${
                index > 0 ? "sm:-ml-px" : ""
              } ${
                selected
                  ? "z-10 border-signal bg-signal text-white"
                  : "border-ice/15 bg-steel/30 text-ice hover:border-ice/35"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        ref={panelRef}
        id="catalog-search-panel"
        role="tabpanel"
        aria-labelledby={`catalog-tab-${mode}`}
        className="mt-6"
      >
        {mode === "description" ? (
          <label className="block max-w-3xl">
            <span className="font-body text-kicker text-signal uppercase">
              Buscar por descrição
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="O que você está procurando?"
              className="mt-2 w-full border border-ice/15 bg-void px-4 py-3.5 text-body-md text-ice outline-none transition-colors placeholder:text-mute/55 focus:border-signal"
              autoComplete="off"
              autoFocus
              aria-describedby="catalog-desc-hint"
            />
            <span id="catalog-desc-hint" className="mt-2 block text-[0.875rem] text-mute">
              Ex.: SEXT.A, PARAF.SEXT, INOX · ou descreva o produto com palavras-chave
            </span>
          </label>
        ) : (
          <label className="block max-w-3xl">
            <span className="font-body text-kicker text-signal uppercase">
              Buscar por código
            </span>
            <input
              type="search"
              inputMode="numeric"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Digite o código do produto"
              className="mt-2 w-full border border-ice/15 bg-void px-4 py-3.5 text-body-md text-ice outline-none transition-colors placeholder:text-mute/55 focus:border-signal"
              autoComplete="off"
              aria-describedby="catalog-code-hint"
            />
            <span id="catalog-code-hint" className="mt-2 block text-[0.875rem] text-mute">
              Ex.: 12345 · aceita código completo ou parcial
            </span>
          </label>
        )}
      </div>

      {hasCategory && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[0.875rem] text-mute">Linha:</span>
          <button
            type="button"
            onClick={clearCategory}
            className="inline-flex min-h-9 items-center gap-2 border border-signal/40 bg-signal/10 px-3 font-body text-[0.8125rem] font-medium text-ice transition-colors hover:border-signal hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            {categoryName}
            <span aria-hidden className="text-mute">
              ×
            </span>
            <span className="sr-only">Remover filtro de linha</span>
          </button>
        </div>
      )}

      {mode === "description" && (
        <div className="mt-5">
          <p className="font-body text-kicker text-mute uppercase">
            Sugestões de materiais
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {CATALOG_SHORTCUTS.map((shortcut) => (
              <li key={shortcut.abbreviation}>
                <button
                  type="button"
                  title={`Buscar: ${shortcut.abbreviation}`}
                  onClick={() => applyShortcut(shortcut.abbreviation)}
                  className="min-h-10 border border-ice/15 px-3 py-2 text-left font-body text-[0.8125rem] font-medium text-ice transition-colors hover:border-signal hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
                >
                  {shortcut.description}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.875rem] text-mute">
        {status === "loading" && <p role="status">Carregando catálogo…</p>}
        {status === "error" && (
          <p className="text-signal" role="alert">
            Não foi possível carregar o catálogo.
          </p>
        )}
        {status === "ready" && !isSearching && (
          <>
            <p role="status" aria-live="polite">
              {results.length.toLocaleString("pt-BR")} resultado
              {results.length === 1 ? "" : "s"}
              {hasQuery || hasCategory ? " encontrados" : ""}
              {hasCategory ? ` em ${categoryName}` : ""} ·{" "}
              {total.toLocaleString("pt-BR")} itens no cadastro
            </p>
            <p>Preços e estoque sob consulta no WhatsApp.</p>
          </>
        )}
        {status === "ready" && isSearching && (
          <p role="status" aria-live="polite">
            Buscando…
          </p>
        )}
      </div>

      {status === "ready" && !isSearching && results.length > PAGE_SIZE && (
        <CatalogPagination
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={goToPage}
          className="mt-6"
        />
      )}

      <div className="mt-6 overflow-hidden border border-ice/10">
        <div className="hidden grid-cols-[7.5rem_minmax(0,1fr)_auto] gap-4 border-b border-ice/10 bg-steel/40 px-4 py-3 text-kicker text-mute uppercase sm:grid">
          <span>Código</span>
          <span>Descrição</span>
          <span>Consulta</span>
        </div>

        {status === "ready" && !isSearching && mode === "code" && !hasQuery && !hasCategory && (
          <p className="px-4 py-10 text-body-md text-mute">
            Digite o código do produto para localizar o item no cadastro.
          </p>
        )}

        {status === "ready" && !isSearching && hasQuery && pageItems.length === 0 && (
          <div className="px-4 py-10">
            <p className="font-display text-display-md text-ice uppercase">
              Nenhum produto encontrado
            </p>
            <p className="mt-3 text-body-md text-mute">
              Não encontramos produtos correspondentes a &ldquo;{activeQuery}&rdquo;.
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-[0.875rem] text-mute">
              <li>Verifique a escrita ou tente menos palavras</li>
              <li>Use as sugestões de materiais acima</li>
              <li>
                {mode === "description"
                  ? "Ou mude para Buscar por código"
                  : "Ou mude para Buscar por descrição"}
              </li>
            </ul>
            <a
              href={whatsappNotFoundUrl(whatsappUrl, activeQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center bg-signal px-4 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#c4242c] focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
            >
              Falar com um vendedor
            </a>
          </div>
        )}

        {status === "ready" && !isSearching && pageItems.length > 0 && (
          <ul>
            {pageItems.map((product) => (
              <li
                key={product.c}
                className="grid gap-2 border-b border-ice/8 px-4 py-4 last:border-b-0 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
              >
                <p className="font-body text-[0.8125rem] tracking-[0.04em] text-signal">
                  {mode === "code" && hasQuery ? (
                    <CodeHighlight code={product.c} query={activeQuery} />
                  ) : (
                    product.c
                  )}
                </p>
                <p className="text-body-md text-ice">{product.n}</p>
                <a
                  href={whatsappConsultUrl(whatsappUrl, product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center border border-ice/20 px-3 font-body text-[0.75rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:border-signal hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none sm:justify-self-end"
                >
                  Consultar
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {status === "ready" && !isSearching && results.length > PAGE_SIZE && (
        <CatalogPagination
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={goToPage}
          className="mt-6"
        />
      )}

      <CatalogDownloadSection />
    </div>
  );
}
