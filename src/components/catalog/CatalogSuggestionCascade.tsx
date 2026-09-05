"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  CATALOG_SHORTCUTS,
  SHORTCUT_GROUPS,
  type ShortcutGroup,
} from "@/lib/catalog-shortcuts";

type CatalogSuggestionCascadeProps = {
  onSelect: (abbreviation: string) => void;
};

export function CatalogSuggestionCascade({
  onSelect,
}: CatalogSuggestionCascadeProps) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<ShortcutGroup>("fixacao");
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  const items = CATALOG_SHORTCUTS.filter(
    (shortcut) => shortcut.group === activeGroup,
  );

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative mt-3" data-catalog-suggestions>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-10 items-center gap-2 border border-ice/20 px-3 font-body text-[0.75rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:border-signal hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
      >
        Sugestões
        <svg
          viewBox="0 0 16 16"
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          aria-hidden
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Sugestões de materiais"
          className="absolute left-0 z-30 mt-1 w-[min(36rem,calc(100vw-3rem))] border border-ice/15 bg-panel shadow-[0_18px_44px_rgba(0,0,0,0.28)] sm:w-[28rem]"
        >
          <div className="grid sm:grid-cols-[10.5rem_minmax(0,1fr)]">
            <ul className="border-b border-ice/10 sm:border-b-0 sm:border-r">
              {SHORTCUT_GROUPS.map((group) => {
                const selected = activeGroup === group.id;
                return (
                  <li key={group.id}>
                    <button
                      type="button"
                      role="menuitem"
                      aria-expanded={selected}
                      onPointerEnter={() => setActiveGroup(group.id)}
                      onClick={() => setActiveGroup(group.id)}
                      className={`flex min-h-11 w-full items-center justify-between gap-2 px-3 text-left font-body text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-colors focus-visible:bg-ice/5 focus-visible:outline-none ${
                        selected
                          ? "bg-signal/10 text-signal"
                          : "text-ice hover:bg-ice/5"
                      }`}
                    >
                      {group.label}
                      <span aria-hidden className="text-[0.7rem]">
                        ▸
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <ul className="py-1">
              {items.map((shortcut) => (
                <li key={shortcut.abbreviation}>
                  <button
                    type="button"
                    role="menuitem"
                    title={`Buscar: ${shortcut.abbreviation}`}
                    onClick={() => {
                      onSelect(shortcut.abbreviation);
                      setOpen(false);
                    }}
                    className="flex min-h-10 w-full px-3 text-left font-body text-[0.8125rem] text-ice transition-colors hover:bg-signal/10 hover:text-signal focus-visible:bg-signal/10 focus-visible:outline-none"
                  >
                    {shortcut.description}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
