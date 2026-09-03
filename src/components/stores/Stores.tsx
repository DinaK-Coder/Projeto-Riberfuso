import { getStores } from "@/lib/firebase/content";
import { StoreCard } from "./StoreCard";

export async function Stores() {
  const stores = await getStores();
  return (
    <section
      id="lojas"
      aria-labelledby="stores-heading"
      className="section-atmosphere section-divider-top bg-void px-6 py-20 sm:px-10 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="max-w-3xl">
          <p className="font-body text-kicker text-signal uppercase">
            Unidades · Poços de Caldas
          </p>
          <h2
            id="stores-heading"
            className="font-display text-display-lg mt-3 text-ice uppercase"
          >
            Nossas lojas
          </h2>
          <p className="mt-5 max-w-xl text-body-md text-mute sm:text-body-lg">
            Escolha a unidade mais conveniente para você. Matriz na Vila Nova e
            Filial no Centro — mesma marca, mesmo atendimento.
          </p>
        </div>

        <div className="store-grid mt-12 lg:mt-14">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}
