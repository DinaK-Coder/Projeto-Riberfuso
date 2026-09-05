export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "riberfuso-theme";
export const DEFAULT_THEME: Theme = "light";

export const THEME_COLORS = {
  dark: "#0f1624",
  light: "#c5d2e4",
} as const;

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

export function themeFromSystem(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function resolveTheme(): Theme {
  return readStoredTheme() ?? DEFAULT_THEME;
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}

export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=${JSON.stringify(DEFAULT_THEME)};}var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t;}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(DEFAULT_THEME)});document.documentElement.style.colorScheme=${JSON.stringify(DEFAULT_THEME)};}})();`;
