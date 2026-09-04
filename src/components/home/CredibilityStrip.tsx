const items = [
  {
    title: "Desde 1991 em Poços de Caldas",
    detail: "Atendimento local, estoque e balcão na cidade",
  },
  {
    title: "Atacado e varejo",
    detail: "Profissionais, empresas e consumidores",
  },
  {
    title: "Duas lojas físicas",
    detail: "Matriz Vila Nova e Filial Centro",
  },
  {
    title: "Atendimento rápido pelo WhatsApp",
    detail: "Consulta de estoque e pedido de orçamento",
  },
];

export function CredibilityStrip() {
  return (
    <section
      aria-label="Por que a Riberfuso"
      className="border-y border-ice/10 bg-steel/40"
    >
      <ul className="mx-auto grid max-w-[90rem] gap-px bg-ice/8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.title} className="bg-void px-6 py-5 sm:px-8 sm:py-6">
            <p className="font-body text-[0.8125rem] font-semibold tracking-[0.06em] text-ice uppercase">
              {item.title}
            </p>
            <p className="mt-1.5 text-[0.875rem] leading-snug text-mute">{item.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
