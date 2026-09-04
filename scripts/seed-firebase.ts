/**
 * Envia o conteúdo atual do site para o Firestore.
 *
 * Antes de rodar:
 * 1. Crie o projeto no Firebase Console e ative o Firestore.
 * 2. Na primeira carga, use modo de teste (escrita liberada) só para este seed.
 * 3. Preencha .env.local com as chaves NEXT_PUBLIC_FIREBASE_*.
 * 4. npm run firebase:seed
 * 5. Publique firestore.rules (leitura pública, escrita bloqueada no cliente).
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { brands } from "../src/lib/brands";
import { categories } from "../src/lib/categories";
import { contact } from "../src/lib/contact";
import { site } from "../src/lib/site";
import { fallbackOffers } from "../src/lib/offers";
import { stores } from "../src/lib/stores";

function loadEnvLocal() {
  const filePath = resolve(process.cwd(), ".env.local");
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (Object.values(config).some((value) => !value)) {
  console.error("Preencha todas as variáveis NEXT_PUBLIC_FIREBASE_* em .env.local.");
  process.exit(1);
}

const app = initializeApp(config);
const db = getFirestore(app);

function omitUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  );
}

async function seed() {
  await setDoc(doc(db, "settings", "site"), site);
  await setDoc(doc(db, "settings", "contact"), contact);

  await Promise.all(
    stores.map((store, index) =>
      setDoc(doc(db, "stores", store.id), omitUndefined({ ...store, order: index })),
    ),
  );

  await Promise.all(
    categories.map((category, index) =>
      setDoc(
        doc(db, "categories", category.id),
        omitUndefined({ ...category, order: index }),
      ),
    ),
  );

  await Promise.all(
    brands.map((brand, index) =>
      setDoc(doc(db, "brands", brand.id), omitUndefined({ ...brand, order: index })),
    ),
  );

  await Promise.all(
    fallbackOffers.map((offer, index) =>
      setDoc(doc(db, "offers", offer.id), omitUndefined({ ...offer, order: index })),
    ),
  );

  console.log("Firestore atualizado:");
  console.log("- settings/site");
  console.log("- settings/contact");
  console.log(`- ${stores.length} lojas`);
  console.log(`- ${categories.length} categorias`);
  console.log(`- ${brands.length} marcas`);
  console.log(`- ${fallbackOffers.length} ofertas`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Falha ao enviar dados para o Firestore.");
  console.error(error);
  process.exit(1);
});
