import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore/lite";
import { getFirebaseWebConfig } from "./config";

export function getFirebaseApp(): FirebaseApp | null {
  const config = getFirebaseWebConfig();
  if (!config) return null;

  return getApps().length > 0 ? getApp() : initializeApp(config);
}

export function getFirestoreDb(): Firestore | null {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}
