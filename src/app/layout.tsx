import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Riberfuso Vila Nova | Parafusos e ferramentas em Poços de Caldas",
  description:
    "Parafusos, ferramentas e soluções profissionais em Poços de Caldas. Duas unidades: Matriz Vila Nova e Filial Centro. Atacado e varejo desde 1991.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="bg-[#1C1F26]" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${mono.variable} bg-[#1C1F26] font-body text-base text-ice antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
