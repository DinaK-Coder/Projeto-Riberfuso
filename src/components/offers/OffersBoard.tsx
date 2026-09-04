"use client";

import Link from "next/link";
import {
  formatOfferValidUntil,
  offerQuoteMessage,
  type Offer,
} from "@/lib/offers";
import { useQuote } from "@/components/quote/QuoteProvider";

function OfferCta({ offer }: { offer: Offer }) {
  const { openWithMessage } = useQuote();
  const className =
    "inline-flex min-h-11 items-center font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-signal uppercase transition-colors hover:text-ice focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none";

  if (offer.cta === "quote") {
    return (
      <button
        type="button"
        className={className}
        onClick={() => openWithMessage(offerQuoteMessage(offer))}
      >
        {offer.ctaLabel}
      </button>
    );
  }

  if (offer.href) {
    return (
      <Link href={offer.href} className={className}>
        {offer.ctaLabel}
      </Link>
    );
  }

  return null;
}

export function OffersBoard({ offers }: { offers: Offer[] }) {
  if (!offers.length) {
    return (
      <p className="mt-8 max-w-xl text-body-md text-mute">
        Nenhuma oferta no ar neste momento. Fale no WhatsApp para consultar
        condições do dia no balcão.
      </p>
    );
  }

  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {offers.map((offer) => {
        const until = formatOfferValidUntil(offer.validUntil);
        return (
          <li key={offer.id}>
            <article className="flex h-full flex-col border border-ice/10 bg-steel/25 p-6">
              <p className="font-body text-kicker text-signal uppercase">
                {offer.badge}
              </p>
              <h3 className="font-display mt-3 text-xl font-extrabold text-ice uppercase sm:text-2xl">
                {offer.title}
              </h3>
              <p className="mt-3 flex-1 text-body-md text-mute">{offer.summary}</p>
              {until ? (
                <p className="mt-4 text-[0.8125rem] text-mute">Válida até {until}</p>
              ) : null}
              <div className="mt-5">
                <OfferCta offer={offer} />
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
