import { homeSection, type SiteContent } from "@/lib/site";
import { PedirOrcamentoButton } from "@/components/quote/PedirOrcamentoButton";

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

export function HeroCopy({ site }: { site: SiteContent }) {
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
          <PedirOrcamentoButton />
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
