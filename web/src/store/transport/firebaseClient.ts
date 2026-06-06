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
    const app = initializeApp({
      apiKey: env.VITE_FIREBASE_API_KEY ?? "demo-api-key",
      projectId: env.VITE_FIREBASE_PROJECT_ID ?? DEMO_PROJECT_ID,
      databaseURL:
        env.VITE_FIREBASE_DATABASE_URL ??
        `http://127.0.0.1:9000?ns=${DEMO_PROJECT_ID}-default-rtdb`,
    });
    const auth = getAuth(app);
    const db = getDatabase(app);
    if (useEmulator) {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", {
        disableWarnings: true,
      });
      connectDatabaseEmulator(db, "127.0.0.1", 9000);
    }
    client = { db, auth };
  }
  return client;
};
