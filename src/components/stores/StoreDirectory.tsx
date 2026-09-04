"use client";

import { useState } from "react";
import { nearestStoreId, type Store, type StoreType } from "@/lib/stores";
import { StoreCard } from "./StoreCard";

export function StoreDirectory({ stores }: { stores: Store[] }) {
  const [nearestId, setNearestId] = useState<StoreType | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "denied">(
    "idle",
  );

  const locate = () => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = nearestStoreId({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }, stores);
        setNearestId(next);
        setStatus(next ? "ready" : "denied");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-[0.875rem] text-mute">
          Endereço, telefone, horário e rota das duas unidades em Poços de Caldas.
        </p>
        <button
          type="button"
          onClick={locate}
          className="inline-flex min-h-12 items-center justify-center border border-ice/20 px-4 font-body text-[0.8125rem] font-semibold tracking-[0.08em] text-ice uppercase transition-colors hover:border-signal hover:text-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
        >
          {status === "loading"
            ? "Localizando…"
            : status === "ready"
              ? "Atualizar unidade mais próxima"
              : "Indicar unidade mais próxima"}
        </button>
      </div>
      {status === "denied" ? (
        <p className="mb-5 text-[0.875rem] text-mute" role="status">
          Não foi possível usar a localização. Escolha a unidade pelo bairro ou
          use Traçar rota no Google Maps.
        </p>
      ) : null}

      <div className="store-grid">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            nearest={nearestId === store.id}
          />
        ))}
      </div>
    </div>
  );
}
