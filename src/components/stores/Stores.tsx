import { getStores } from "@/lib/firebase/content";
import { StoreDirectory } from "./StoreDirectory";

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
            Matriz na Vila Nova e Filial no Centro. Veja o endereço, fale pelo
            WhatsApp da unidade ou trace a rota no Google Maps.
          </p>
        </div>

        <div className="mt-12 lg:mt-14">
          <StoreDirectory stores={stores} />
        </div>
      </div>
    </section>
  );
}
