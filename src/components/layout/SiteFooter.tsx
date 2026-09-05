import Image from "next/image";
import Link from "next/link";
import { getContactInfo, getSiteContent, getStores } from "@/lib/firebase/content";
import { homeSection, navLinks } from "@/lib/site";

export async function SiteFooter() {
  const [site, stores, contact] = await Promise.all([
    getSiteContent(),
    getStores(),
    getContactInfo(),
  ]);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer border-t border-ice/10 bg-ink px-6 py-12 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[1.15fr_0.85fr_1.2fr] lg:gap-12">
        <div>
          <Link href="/" className="inline-block" aria-label="Voltar ao início">
            <Image
              src={site.logo}
              alt=""
              width={612}
              height={321}
              unoptimized
              className="site-logo h-12 w-auto max-w-[11rem] object-contain object-left opacity-95"
            />
          </Link>
          <p className="mt-4 max-w-sm text-body-md text-mute">
            Parafusos, ferramentas e soluções profissionais para quem não pode
            parar. Atacado e varejo em Poços de Caldas desde {site.since} —
            Matriz Vila Nova e Filial Centro.
          </p>
        </div>

        <div>
          <p className="font-body text-kicker text-signal uppercase">Navegação</p>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-body-md text-ice/85 transition-colors hover:text-signal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-body text-kicker text-signal uppercase">Nossas lojas</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {stores.map((store) => (
              <div key={store.id}>
                <p className="text-[0.75rem] font-medium tracking-[0.12em] text-signal uppercase">
                  {store.typeLabel} — {store.name}
                </p>
                <p className="mt-1 min-w-0 break-words text-body-md text-ice/85">{store.street}</p>
                <p className="text-[0.875rem] text-mute">
                  {store.neighborhood} · {store.city} - {store.state}
                </p>
                <a
                  href={store.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex text-[0.8125rem] font-semibold tracking-[0.06em] text-ice uppercase transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
                  aria-label={`Traçar rota para ${store.typeLabel} ${store.name}`}
                >
                  Traçar rota
                </a>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-1 text-body-md text-ice/85">
            <a
              href={contact.whatsapp.href}
              className="block transition-colors hover:text-signal"
            >
              WhatsApp {contact.whatsapp.display}
            </a>
            <a
              href={contact.social.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-colors hover:text-signal"
            >
              Instagram {contact.social.instagram.handle}
            </a>
            <a
              href={contact.social.facebook.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-colors hover:text-signal"
            >
              Facebook {contact.social.facebook.handle}
            </a>
            <a
              href={contact.social.youtube.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-colors hover:text-signal"
            >
              YouTube {contact.social.youtube.handle}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[90rem] flex-col gap-2 border-t border-ice/10 pt-6 text-[0.8125rem] text-mute sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}. Todos os direitos reservados.
        </p>
        <p>
          <Link
            href={homeSection("inicio")}
            className="transition-colors hover:text-ice"
          >
            Voltar ao início
          </Link>
        </p>
      </div>
    </footer>
  );
}
