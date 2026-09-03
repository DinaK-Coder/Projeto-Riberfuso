import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const revalidate = 120;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f1624",
};

export const metadata: Metadata = {
  title: "Riberfuso Vila Nova | Parafusos e ferramentas em Poços de Caldas",
  description:
    "Parafusos, ferramentas e soluções profissionais em Poços de Caldas. Duas unidades: Matriz Vila Nova e Filial Centro. Atacado e varejo desde 1991.",
  icons: {
    icon: [{ url: "/brand/marca.png", type: "image/png" }],
    apple: "/brand/marca.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="bg-void"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className={`${outfit.variable} bg-void font-body text-base text-ice antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
