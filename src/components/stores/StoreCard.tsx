import Image from "next/image";
import Link from "next/link";
import {
  storeAddress,
  storeEmbedUrl,
  storeLandlines,
  storeLine,
  storePath,
  storeWhatsapp,
  type Store,
} from "@/lib/stores";

type StoreCardProps = {
  store: Store;
  compact?: boolean;
  nearest?: boolean;
  showPageLink?: boolean;
};

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="store-card-icon h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function StoreCard({
  store,
  compact = false,
  nearest = false,
  showPageLink = true,
}: StoreCardProps) {
  const whatsapp = storeWhatsapp(store);
  const landlines = storeLandlines(store);
  const primaryPhone = landlines[0];

  return (
    <article
      className={`store-card ${compact ? "store-card--compact" : ""}`}
      data-store-id={store.id}
    >
      {!compact ? (
        <div className="store-card-photo">
          <Image
            src={store.photoSrc}
            alt={store.photoAlt}
            width={750}
            height={480}
            sizes="(max-width: 768px) 100vw, 45vw"
            className="h-full w-full object-cover object-center"
          />
        </div>
      ) : null}

      <div className="store-card-top">
        <span className="store-card-badge">
          <LocationIcon />
          {store.typeLabel}
        </span>
        {nearest ? (
          <p className="store-card-near">Unidade mais próxima</p>
        ) : null}
        <h3 className="store-card-name">{store.name}</h3>
      </div>

      <div className="store-card-body">
        <p className="store-card-street">{storeAddress(store)}</p>
        <p className="store-card-meta">{storeLine(store)}</p>

        <p className="store-card-hours">
          <span className="store-card-label">Horário</span>
          {store.hours}
        </p>
        <p className="store-card-hours-note">{store.hoursNote}</p>

        {landlines.length ? (
          <ul className="store-card-phones">
            {landlines.map((phone) => (
              <li key={phone.href}>
                <a href={phone.href} className="store-card-phone">
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {!compact ? (
        <div className="store-card-map">
          <iframe
            title={`Mapa da ${store.typeLabel} ${store.name} em ${store.city}`}
            src={storeEmbedUrl(store)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      ) : null}

      <div className="store-card-actions">
        <a
          href={store.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="store-card-cta"
          aria-label={`Traçar rota para ${store.typeLabel} ${store.name}`}
        >
          Traçar rota
        </a>
        {primaryPhone ? (
          <a
            href={primaryPhone.href}
            className="store-card-cta store-card-cta--ghost store-card-cta--call"
            aria-label={`Ligar agora para ${store.typeLabel} ${store.name}`}
          >
            Ligar agora
          </a>
        ) : null}
        {whatsapp ? (
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="store-card-cta store-card-cta--ghost"
            aria-label={`Falar com a ${store.typeLabel} ${store.name} no WhatsApp`}
          >
            Falar no WhatsApp
          </a>
        ) : null}
        {showPageLink ? (
          <Link href={storePath(store)} className="store-card-more">
            Página da unidade
          </Link>
        ) : null}
      </div>
    </article>
  );
}
