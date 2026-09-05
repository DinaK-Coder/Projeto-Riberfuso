"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  CATALOG_SHORTCUTS,
  SHORTCUT_GROUPS,
  type ShortcutGroup,
} from "@/lib/catalog-shortcuts";

type CatalogSuggestionCascadeProps = {
  onSelect: (abbreviation: string) => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function CatalogSuggestionCascade({
  onSelect,
}: CatalogSuggestionCascadeProps) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<ShortcutGroup>("fixacao");
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

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
        className={`inline-flex min-h-10 items-center gap-2 border px-3 font-body text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-[border-color,color,background-color] duration-200 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none ${
          open
            ? "border-signal text-signal"
            : "border-ice/20 text-ice hover:border-signal hover:text-signal"
        }`}
      >
        Sugestões
        <motion.svg
          viewBox="0 0 16 16"
          className="h-3 w-3"
          fill="none"
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 28 }
          }
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Sugestões de materiais"
            className="absolute left-0 z-30 mt-1 w-[min(36rem,calc(100vw-3rem))] origin-top-left overflow-hidden border border-ice/15 bg-panel shadow-[0_18px_44px_rgba(0,0,0,0.28)] sm:w-[28rem]"
            initial={
              reduceMotion ? false : { opacity: 0, y: -10, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.98 }
            }
            transition={{ duration: reduceMotion ? 0.12 : 0.28, ease: EASE }}
          >
            <div className="grid sm:grid-cols-[10.5rem_minmax(0,1fr)]">
              <LayoutGroup>
                <ul className="relative border-b border-ice/10 sm:border-b-0 sm:border-r">
                  {SHORTCUT_GROUPS.map((group, index) => {
                    const selected = activeGroup === group.id;
                    return (
                      <li key={group.id} className="relative">
                        {selected ? (
                          <motion.span
                            layoutId={
                              reduceMotion ? undefined : "catalog-cascade-active"
                            }
                            className="pointer-events-none absolute inset-0 bg-signal/10 before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-signal before:content-['']"
                            transition={
                              reduceMotion
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 380, damping: 34 }
                            }
                          />
                        ) : null}
                        <button
                          type="button"
                          role="menuitem"
                          aria-expanded={selected}
                          onPointerEnter={() => setActiveGroup(group.id)}
                          onClick={() => setActiveGroup(group.id)}
                          className={`relative z-[1] flex min-h-11 w-full items-center justify-between gap-2 px-3 text-left font-body text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 focus-visible:outline-none ${
                            selected
                              ? "text-signal"
                              : "text-ice hover:bg-ice/5"
                          }`}
                        >
                          <motion.span
                            initial={
                              reduceMotion ? false : { opacity: 0, x: -8 }
                            }
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: reduceMotion ? 0 : 0.24,
                              delay: reduceMotion ? 0 : 0.04 + index * 0.04,
                              ease: EASE,
                            }}
                          >
                            {group.label}
                          </motion.span>
                          <motion.span
                            aria-hidden
                            className="text-[0.7rem]"
                            animate={{
                              x: selected ? 3 : 0,
                              opacity: selected ? 1 : 0.45,
                            }}
                            transition={{
                              duration: reduceMotion ? 0 : 0.2,
                              ease: EASE,
                            }}
                          >
                            ▸
                          </motion.span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </LayoutGroup>

              <div className="relative grid min-h-[11.25rem] overflow-hidden sm:min-h-[17.75rem]">
                <AnimatePresence mode="popLayout" initial={!reduceMotion}>
                  <motion.ul
                    key={activeGroup}
                    className="col-start-1 row-start-1 py-1"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0.08 : 0.16 }}
                  >
                    {items.map((shortcut, index) => (
                      <motion.li
                        key={shortcut.abbreviation}
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, x: 16, y: -6 }
                        }
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, x: -10, y: 4 }
                        }
                        transition={{
                          duration: reduceMotion ? 0 : 0.26,
                          delay: reduceMotion ? 0 : 0.03 + index * 0.038,
                          ease: EASE,
                        }}
                      >
                        <button
                          type="button"
                          role="menuitem"
                          title={`Buscar: ${shortcut.abbreviation}`}
                          onClick={() => {
                            onSelect(shortcut.abbreviation);
                            setOpen(false);
                          }}
                          className="flex min-h-10 w-full px-3 text-left font-body text-[0.8125rem] text-ice transition-[color,background-color,transform] duration-200 hover:translate-x-1 hover:bg-signal/10 hover:text-signal focus-visible:bg-signal/10 focus-visible:outline-none"
                        >
                          {shortcut.description}
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
