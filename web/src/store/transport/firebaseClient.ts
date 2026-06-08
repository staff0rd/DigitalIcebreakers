import { initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectDatabaseEmulator,
  Database,
  getDatabase,
} from "firebase/database";

export type FirebaseClient = {
  db: Database;
  auth: Auth;
};

const DEMO_PROJECT_ID = "demo-digitalicebreakers";

let client: FirebaseClient | null = null;

export const getFirebaseClient = (): FirebaseClient => {
  if (!client) {
    const env = import.meta.env;
    const useEmulator = !env.VITE_FIREBASE_DATABASE_URL;
    const dbPort = Number(env.VITE_EMULATOR_DB_PORT ?? 9000);
    const authPort = Number(env.VITE_EMULATOR_AUTH_PORT ?? 9099);
    const app = initializeApp({
      apiKey: env.VITE_FIREBASE_API_KEY ?? "demo-api-key",
      projectId: env.VITE_FIREBASE_PROJECT_ID ?? DEMO_PROJECT_ID,
      databaseURL:
        env.VITE_FIREBASE_DATABASE_URL ??
        `http://127.0.0.1:${dbPort}?ns=${DEMO_PROJECT_ID}-default-rtdb`,
    });
    const auth = getAuth(app);
    const db = getDatabase(app);
    if (useEmulator) {
      connectAuthEmulator(auth, `http://127.0.0.1:${authPort}`, {
        disableWarnings: true,
      });
      connectDatabaseEmulator(db, "127.0.0.1", dbPort);
    }
    client = { db, auth };
  }
  return client;
};
