import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* Extraídas do logo Riberfuso (RF vermelho/azul + fundo navy) */
        void: "#0F1624",
        steel: "#1A2744",
        panel: "#1C2740",
        ink: "#080D18",
        ice: "#F7F8FA",
        mute: "#C5CAD0",
        signal: "#E83038",
        brand: "#4F53A4",
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
