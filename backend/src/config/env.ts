import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT || 8000),
  jwtSecret: required("JWT_SECRET", "super-secret-key"),
  clientOrigin: required("CLIENT_ORIGIN", "http://localhost:5173"),

  firebaseProjectId: required("FIREBASE_PROJECT_ID"),
  firebaseClientEmail: required("FIREBASE_CLIENT_EMAIL"),
  firebasePrivateKey: required("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
};