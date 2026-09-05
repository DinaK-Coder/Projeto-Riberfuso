import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* Tokens em RGB para opacity (border-ice/10, bg-void/55) nos dois temas */
        void: "rgb(var(--void-rgb) / <alpha-value>)",
        steel: "rgb(var(--steel-rgb) / <alpha-value>)",
        panel: "rgb(var(--panel-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        ice: "rgb(var(--ice-rgb) / <alpha-value>)",
        mute: "rgb(var(--mute-rgb) / <alpha-value>)",
        signal: "rgb(var(--signal-rgb) / <alpha-value>)",
        brand: "rgb(var(--brand-rgb) / <alpha-value>)",
        navy: "rgb(var(--navy-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        body: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.35rem, 5.2vw, 4.5rem)",
          { lineHeight: "0.95", letterSpacing: "0.01em", fontWeight: "800" },
        ],
        "display-lg": [
          "clamp(1.85rem, 3.8vw, 3.25rem)",
          { lineHeight: "1.05", letterSpacing: "0.02em", fontWeight: "700" },
        ],
        "display-md": [
          "clamp(1.45rem, 2.6vw, 2.15rem)",
          { lineHeight: "1.1", letterSpacing: "0.03em", fontWeight: "700" },
        ],
        "body-lg": ["1.125rem", { lineHeight: "1.65" }],
        "body-md": ["1rem", { lineHeight: "1.65" }],
        kicker: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.16em", fontWeight: "500" },
        ],
      },
    },
  },
  plugins: [],
};

export default config;
