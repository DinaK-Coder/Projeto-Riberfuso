import Link from "next/link";
import { getContactInfo, getSiteContent, getStores } from "@/lib/firebase/content";
import { homeSection } from "@/lib/site";

export async function ContactPreview() {
  const [site, stores, contact] = await Promise.all([
    getSiteContent(),
    getStores(),
    getContactInfo(),
  ]);
  return (
    <section
      id="contato"
      aria-labelledby="contact-preview-heading"
      className="section-atmosphere section-atmosphere-steel section-divider-top bg-steel px-6 py-20 sm:px-10 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="max-w-3xl">
          <p className="font-body text-kicker text-signal uppercase">
            Atendimento · {site.storesSummary}
          </p>
          <h2
            id="contact-preview-heading"
            className="font-display text-display-lg mt-3 text-ice uppercase"
          >
            FALE COM A
            <br />
            RIBERFUSO.
          </h2>
          <p className="mt-5 max-w-xl text-body-md text-mute sm:text-body-lg">
            Parafusos, ferramentas e máquinas em Poços de Caldas desde {site.since}.
            Fale com a equipe pelo WhatsApp, telefone ou visite uma das nossas
            unidades — Vila Nova e Centro.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="contact-card">
            <p className="font-body text-kicker text-signal uppercase">WhatsApp</p>
            <a
              href={contact.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card-link"
            >
              {contact.whatsapp.display}
            </a>
          </article>
          <article className="contact-card">
            <p className="font-body text-kicker text-signal uppercase">Telefone</p>
            <a href={contact.phones[0].href} className="contact-card-link">
              {contact.phones[0].display}
            </a>
          </article>
          {stores.map((store) => (
            <article key={store.id} className="contact-card">
              <p className="font-body text-kicker text-signal uppercase">
                {store.typeLabel}
              </p>
              <p className="mt-2 text-body-md font-semibold text-ice">{store.name}</p>
              <p className="text-body-md text-mute">{store.street}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/contato" className="contact-card-cta inline-flex justify-center">
            Ver contato completo
          </Link>
          <Link
            href={homeSection("lojas")}
            className="inline-flex min-h-11 items-center justify-center border border-ice/25 px-5 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:border-ice/50 hover:bg-ice/5 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            Ver nossas lojas
          </Link>
        </div>
      </div>
    </section>
  );
}
