import { ContactChannels } from "./ContactChannels";
import { StoreCard } from "@/components/stores/StoreCard";
import { site } from "@/lib/site";
import { stores } from "@/lib/stores";

export function ContactPageContent() {
  return (
    <div className="bg-void">
      <section className="border-b border-ice/10 bg-steel px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-[90rem]">
          <p className="font-body text-kicker text-signal uppercase">
            Contato · {site.city}
          </p>
          <h1 className="font-display text-display-lg mt-3 max-w-4xl text-ice uppercase">
            ESTAMOS PRONTOS
            <br />
            PARA ATENDER VOCÊ.
          </h1>
          <p className="mt-5 max-w-2xl text-body-md text-mute sm:text-body-lg">
            Atacado e varejo em parafusos, ferramentas, máquinas e grandes marcas.
            Fale com a equipe ou visite a Matriz na Vila Nova ou a Filial no Centro.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <div>
            <h2 className="font-display text-display-md text-ice uppercase">
              Canais de atendimento
            </h2>
            <p className="mt-3 max-w-lg text-body-md text-mute">
              Escolha o canal mais conveniente. Para orçamentos e disponibilidade
              de itens, o WhatsApp costuma ser o mais rápido.
            </p>
            <div className="mt-8">
              <ContactChannels />
            </div>
          </div>

          <div>
            <h2 className="font-display text-display-md text-ice uppercase">
              Nossas lojas
            </h2>
            <p className="mt-3 text-body-md text-mute">
              Duas unidades em Poços de Caldas. Use “Ver rota” para abrir o Google
              Maps no endereço da unidade desejada.
            </p>
            <div className="store-grid mt-8">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
