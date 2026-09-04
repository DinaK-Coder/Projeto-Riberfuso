import {
  contactLandlines,
  contactWhatsapps,
  type ContactInfo,
} from "@/lib/contact";
import type { SiteContent } from "@/lib/site";

type ContactChannelsProps = {
  variant?: "grid" | "stack";
  contact: ContactInfo;
  site: SiteContent;
};

export function ContactChannels({
  variant = "grid",
  contact,
  site,
}: ContactChannelsProps) {
  const layout =
    variant === "grid"
      ? "grid gap-4 sm:grid-cols-2"
      : "flex flex-col gap-4";
  const whatsapps = contactWhatsapps(contact);
  const landlines = contactLandlines(contact);

  return (
    <div className={layout}>
      <article className="contact-card">
        <p className="font-body text-kicker text-signal uppercase">WhatsApp</p>
        <ul className="mt-1 space-y-2">
          {whatsapps.map((phone) => (
            <li key={phone.href}>
              <p className="text-[0.7rem] font-medium tracking-[0.12em] text-mute uppercase">
                {phone.unit} · vendas
              </p>
              <a
                href={phone.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-link mt-0"
              >
                {phone.display}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-body-md text-mute">Orçamentos e atendimento rápido</p>
      </article>

      <article className="contact-card">
        <p className="font-body text-kicker text-signal uppercase">Telefone</p>
        <ul className="mt-1 space-y-2">
          {landlines.map((phone) => (
            <li key={phone.href}>
              <p className="text-[0.7rem] font-medium tracking-[0.12em] text-mute uppercase">
                {phone.unit}
              </p>
              <a href={phone.href} className="contact-card-link mt-0">
                {phone.display}
              </a>
            </li>
          ))}
        </ul>
      </article>

      <article className="contact-card">
        <p className="font-body text-kicker text-signal uppercase">E-mail</p>
        <a href={contact.email.href} className="contact-card-link break-all">
          {contact.email.display}
        </a>
      </article>

      <article className="contact-card">
        <p className="font-body text-kicker text-signal uppercase">Redes sociais</p>
        <div className="mt-2 flex flex-col items-start gap-1">
          <a
            href={contact.social.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card-link"
          >
            Instagram {contact.social.instagram.handle}
          </a>
          <a
            href={contact.social.facebook.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card-link"
          >
            Facebook {contact.social.facebook.handle}
          </a>
          <a
            href={contact.social.youtube.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card-link"
          >
            YouTube {contact.social.youtube.handle}
          </a>
        </div>
        <p className="mt-2 text-body-md text-mute">
          Instagram, Facebook e YouTube — bastidores e vídeos do Manual das
          Ferramentas
        </p>
      </article>

      <article className="contact-card sm:col-span-2">
        <p className="font-body text-kicker text-signal uppercase">Atendimento</p>
        <p className="text-body-md text-ice">Atacado e varejo nas duas unidades</p>
        <p className="mt-2 text-body-md text-mute">{contact.hoursNote}</p>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card-cta mt-4 inline-flex"
        >
          Falar no WhatsApp
        </a>
      </article>
    </div>
  );
}
