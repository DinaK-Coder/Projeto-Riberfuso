import { contact } from "@/lib/contact";
import { site } from "@/lib/site";

type ContactChannelsProps = {
  variant?: "grid" | "stack";
};

export function ContactChannels({ variant = "grid" }: ContactChannelsProps) {
  const layout =
    variant === "grid"
      ? "grid gap-4 sm:grid-cols-2"
      : "flex flex-col gap-4";

  return (
    <div className={layout}>
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
        <p className="mt-2 text-body-md text-mute">Orçamentos e atendimento rápido</p>
      </article>

      <article className="contact-card">
        <p className="font-body text-kicker text-signal uppercase">Telefone</p>
        <ul className="space-y-1">
          {contact.phones.map((phone) => (
            <li key={phone.href}>
              <a href={phone.href} className="contact-card-link">
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
        <a
          href={contact.social.instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card-link"
        >
          {contact.social.instagram.handle}
        </a>
        <p className="mt-2 text-body-md text-mute">Novidades e bastidores da Riberfuso</p>
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
