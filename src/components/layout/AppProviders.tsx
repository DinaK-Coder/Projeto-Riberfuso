"use client";

import { QuoteDrawer } from "@/components/quote/QuoteDrawer";
import { QuoteProvider } from "@/components/quote/QuoteProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QuoteProvider>
      {children}
      <QuoteDrawer />
    </QuoteProvider>
  );
}
