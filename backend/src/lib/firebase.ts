import admin from "firebase-admin";
import { env } from "../config/env.js";

if (!env.firebaseProjectId || !env.firebaseClientEmail || !env.firebasePrivateKey) {
  console.warn("Firebase credentials are missing. Fill backend/.env before starting the server.");
}

if (!admin.apps.length && env.firebaseProjectId && env.firebaseClientEmail && env.firebasePrivateKey) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey,
    }),
  });
}

export const firestore = admin.apps.length ? admin.firestore() : null;
