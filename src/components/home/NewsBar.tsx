import Link from "next/link";
import { formatOfferValidUntil, type Offer } from "@/lib/offers";
import type { YoutubeVideo } from "@/lib/youtube";

type NewsBarProps = {
  offers: Offer[];
  latestVideo: YoutubeVideo | null;
};

export function NewsBar({ offers, latestVideo }: NewsBarProps) {
  const highlights = offers.slice(0, 2);

  return (
    <section
      aria-label="Ofertas e novidades"
      className="border-b border-ice/10 bg-steel/50"
    >
      <div className="mx-auto flex max-w-[90rem] flex-col gap-3 px-6 py-3 sm:px-10 lg:flex-row lg:items-center lg:gap-6 lg:px-16">
        <p className="shrink-0 font-body text-kicker text-signal uppercase">
          Novidades
        </p>
        <ul className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1">
          {highlights.map((offer) => {
            const until = formatOfferValidUntil(offer.validUntil);
            return (
              <li key={offer.id} className="min-w-0 text-[0.875rem] text-ice/90">
                <Link
                  href="/novidades#ofertas"
                  className="transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
                >
                  <span className="font-medium">{offer.title}</span>
                  {until ? (
                    <span className="text-mute"> · até {until}</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
          {latestVideo ? (
            <li className="min-w-0 text-[0.875rem] text-ice/90">
              <Link
                href="/novidades#canal"
                className="line-clamp-1 transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
              >
                <span className="text-mute">YouTube · </span>
                {latestVideo.title}
              </Link>
            </li>
          ) : null}
        </ul>
        <Link
          href="/novidades"
          className="inline-flex min-h-10 shrink-0 items-center font-body text-[0.75rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
        >
          Ver tudo
        </Link>
      </div>
    </section>
  );
}
