import Link from "next/link";
import { contactWhatsapps } from "@/lib/contact";
import { getContactInfo, getSiteContent } from "@/lib/firebase/content";

export async function ContactPreview() {
  const [site, contact] = await Promise.all([
    getSiteContent(),
    getContactInfo(),
  ]);
  return (
    <section
      id="contato-preview"
      aria-labelledby="contact-preview-heading"
      className="section-atmosphere section-atmosphere-steel section-divider-top bg-steel px-6 py-16 sm:px-10 lg:px-16 lg:py-20"
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
            Consulte estoque e peça orçamento pelo WhatsApp. Telefone, rotas e
            redes sociais estão na página de contato.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {contactWhatsapps(contact).map((phone) => (
            <article key={phone.href} className="contact-card">
              <p className="font-body text-kicker text-signal uppercase">
                WhatsApp · {phone.unit}
              </p>
              <a
                href={phone.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-link"
              >
                {phone.display}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/contato" className="contact-card-cta inline-flex justify-center">
            Ver contato completo
          </Link>
        </div>
      </div>
    </section>
  );
}
