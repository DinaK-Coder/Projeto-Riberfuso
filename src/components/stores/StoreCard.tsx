import { storeLine, type Store } from "@/lib/stores";

type StoreCardProps = {
  store: Store;
  compact?: boolean;
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

export function StoreCard({ store, compact = false }: StoreCardProps) {
  return (
    <article className={`store-card ${compact ? "store-card--compact" : ""}`}>
      <div className="store-card-top">
        <span className="store-card-badge">
          <LocationIcon />
          {store.typeLabel}
        </span>
        <h3 className="store-card-name">{store.name}</h3>
      </div>

      <div className="store-card-body">
        <p className="store-card-street">{store.street}</p>
        <p className="store-card-meta">{storeLine(store)}</p>
      </div>

      <a
        href={store.directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="store-card-cta"
        aria-label={`Ver rota para ${store.typeLabel} ${store.name}`}
      >
        Ver rota
      </a>
    </article>
  );
}
