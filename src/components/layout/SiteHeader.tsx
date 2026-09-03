import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/firebase/content";
import { navLinks } from "@/lib/site";

export async function SiteHeader() {
  const site = await getSiteContent();
  return (
    <header className="sticky top-0 z-50 bg-void shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div className="mx-auto flex w-full max-w-[90rem] items-center gap-5 px-4 py-3.5 sm:px-8 lg:px-12">
        <Link href="/" className="shrink-0" aria-label="Voltar ao início">
          <Image
            src={site.logo}
            alt="Riberfuso Vila Nova"
            width={612}
            height={321}
            priority
            unoptimized
            className="h-14 w-auto max-w-[12rem] object-contain object-left sm:h-16 lg:h-[4.35rem] lg:max-w-[15rem]"
          />
        </Link>

        <nav
          aria-label="Seções do site"
          className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex items-center justify-end gap-1 sm:gap-1.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center whitespace-nowrap px-2.5 font-body text-[0.8125rem] font-medium tracking-[0.08em] text-ice uppercase transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none sm:px-3 sm:text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 items-center bg-signal px-4 py-2.5 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#c4242c] focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none sm:inline-flex sm:text-sm"
        >
          WhatsApp
        </a>
      </div>
      <div className="h-1 w-full bg-signal" aria-hidden />
    </header>
  );
}
