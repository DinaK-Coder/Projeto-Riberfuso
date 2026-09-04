import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { AppProviders } from "@/components/layout/AppProviders";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, localBusinessJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Riberfuso Vila Nova | Parafusos e ferramentas em Poços de Caldas",
    template: `%s | ${site.name}`,
  },
  description:
    "Parafusos, ferramentas e soluções profissionais em Poços de Caldas. Duas unidades: Matriz Vila Nova e Filial Centro. Atacado e varejo desde 1991. Consulte estoque e peça orçamento pelo WhatsApp.",
  keywords: [
    "Riberfuso",
    "Riberfuso Vila Nova",
    "parafusos Poços de Caldas",
    "ferramentas Poços de Caldas",
    "ferragens Poços de Caldas",
    "atacado e varejo",
    "Bosch Professional",
    "loja de parafusos",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: site.name,
    title: "Riberfuso Vila Nova | Parafusos e ferramentas em Poços de Caldas",
    description:
      "Atacado e varejo de parafusos, ferramentas e máquinas em Poços de Caldas desde 1991. Matriz Vila Nova e Filial Centro.",
    images: [{ url: "/brand/marca.png", alt: site.name }],
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
        <JsonLd data={localBusinessJsonLd()} />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
