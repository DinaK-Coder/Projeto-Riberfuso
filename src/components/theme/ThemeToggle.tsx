"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="theme-toggle-sun h-4 w-4" aria-hidden fill="none">
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.25v1.8M12 18.95v1.8M4.99 4.99l1.27 1.27M17.74 17.74l1.27 1.27M3.25 12h1.8M18.95 12h1.8M4.99 19.01l1.27-1.27M17.74 6.26l1.27-1.27"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="theme-toggle-moon h-4 w-4" aria-hidden fill="none">
      <path
        d="M15.6 3.35A8.35 8.35 0 1 0 20.65 14.4 6.6 6.6 0 0 1 15.6 3.35Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const isDark = theme === "dark";
  const label = !ready
    ? "Alternar tema"
    : isDark
      ? "Ativar tema claro"
      : "Ativar tema escuro";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      aria-pressed={ready ? !isDark : undefined}
      title={label}
      onClick={toggleTheme}
    >
      <SunIcon />
      <MoonIcon />
      <span className="theme-toggle-tip" role="tooltip">
        {ready ? (isDark ? "Tema claro" : "Tema escuro") : "Tema"}
      </span>
    </button>
  );
}
