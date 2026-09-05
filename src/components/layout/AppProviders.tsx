"use client";

import { QuoteDrawer } from "@/components/quote/QuoteDrawer";
import { QuoteProvider } from "@/components/quote/QuoteProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QuoteProvider>
        {children}
        <QuoteDrawer />
      </QuoteProvider>
    </ThemeProvider>
  );
}
