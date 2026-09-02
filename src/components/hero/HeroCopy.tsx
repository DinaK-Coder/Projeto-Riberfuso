import { homeSection, site } from "@/lib/site";

const buttonBase =
  "hero-btn inline-flex w-full items-center justify-center gap-2 px-5 font-body text-[0.8125rem] font-semibold tracking-[0.08em] uppercase transition-[color,background-color,border-color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:outline-none active:translate-y-px sm:text-sm lg:w-auto lg:min-w-[13rem] lg:px-6";

const differentials = [
  {
    title: "Atacado e varejo",
    description: "Empresas e consumidores finais",
    icon: "trade" as const,
  },
  {
    title: "Grandes marcas",
    description: "Bosch, Tramontina, Gedore e mais",
    icon: "brands" as const,
  },
  {
    title: "Atendimento especializado",
    description: "Orientação para a peça certa",
    icon: "support" as const,
  },
];

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="hero-btn-icon h-4 w-4 shrink-0 fill-current"
      aria-hidden
    >
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.08 6.45 2.08 11.91c0 1.75.46 3.45 1.34 4.95L2 22l5.29-1.38a10 10 0 0 0 4.75 1.2h.01c5.49 0 9.96-4.45 9.96-9.91 0-2.65-1.04-5.14-2.96-7zM12.05 20.15h-.01a8.28 8.28 0 0 1-4.21-1.15l-.3-.18-3.14.82.84-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.72-8.24 8.29-8.24 2.21 0 4.29.86 5.85 2.41a8.16 8.16 0 0 1 2.43 5.83c0 4.55-3.73 8.24-8.29 8.24zm4.54-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.21-.73-.65-1.22-1.45-1.37-1.7-.14-.24-.02-.37.11-.49.11-.11.25-.29.37-.43.12-.14.16-.24.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.48-.41-.41-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.24-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}

function DiffIcon({ type }: { type: (typeof differentials)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "hero-diff-icon h-[1.125rem] w-[1.125rem] shrink-0 stroke-signal sm:h-5 sm:w-5",
    fill: "none",
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (type === "trade") {
    return (
      <svg {...common}>
        <path d="M4 7h16v12H4z" />
        <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
        <path d="M4 11h16" />
      </svg>
    );
  }

  if (type === "brands") {
    return (
      <svg {...common}>
        <path d="M12 3.5 14.4 8.4l5.4.5-4.1 3.6 1.2 5.3L12 15.6 7.1 17.8l1.2-5.3-4.1-3.6 5.4-.5L12 3.5z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M9.6 9.7a2.5 2.5 0 0 1 4.85.8c0 1.5-1.4 2.1-2.2 2.6-.55.35-.75.6-.75 1.15" />
      <path d="M12 17.1h.01" />
    </svg>
  );
}

export function HeroCopy() {
  return (
    <div className="hero-copy flex w-full flex-col justify-center text-left">
      <div className="hero-main">
        <p
          className="hero-kicker mb-3 font-body text-kicker text-mute uppercase"
          data-hero-kicker
        >
          {site.storesShort} · Desde {site.since}
        </p>
        <h1 id="hero-heading" className="hero-slogan font-display text-ice">
          <span className="hero-line-mask">
            <span className="hero-line block" data-hero-line>
              Bom de preço,
            </span>
          </span>
          <span className="hero-line-mask mt-[0.04em]">
            <span className="hero-line highlight block text-signal" data-hero-line>
              bom de negócio.
            </span>
          </span>
        </h1>
        <p className="hero-lead mt-5 sm:mt-6" data-hero-lead>
          Parafusos, ferramentas, máquinas e ferragens das principais marcas —
          estoque amplo e orientação técnica no balcão.
        </p>
        <div
          className="hero-actions mt-6 flex w-full flex-col gap-3 sm:mt-7 lg:flex-row lg:flex-nowrap lg:items-stretch"
          data-hero-actions
        >
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonBase} bg-signal text-white hover:bg-[#c4242c] focus-visible:bg-[#c4242c] active:bg-[#a81c24]`}
            data-hero-cta
          >
            <WhatsAppIcon />
            Comprar pelo WhatsApp
          </a>
          <a
            href={homeSection("produtos")}
            className={`${buttonBase} border border-white/80 bg-void/55 text-white hover:border-white hover:bg-void/72 focus-visible:border-white active:bg-void/80`}
            data-hero-cta
          >
            Ver produtos
          </a>
        </div>
      </div>

      <ul className="hero-diffs" aria-label="Diferenciais" data-hero-diffs>
        {differentials.map((item) => (
          <li key={item.title} className="hero-diff" data-hero-diff>
            <DiffIcon type={item.icon} />
            <p className="hero-diff-title font-body font-semibold text-ice uppercase">
              {item.title}
            </p>
            <p className="hero-diff-desc">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
