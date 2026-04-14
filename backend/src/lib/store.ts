import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StoreData } from "../shared/types.js";
import { seedData } from "../modules/masterdata/seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../../data");
const storeFile = path.join(dataDir, "store.json");

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(storeFile)) {
    fs.writeFileSync(storeFile, JSON.stringify(seedData, null, 2), "utf-8");
  }
}

export function readStore(): StoreData {
  ensureStore();
  const raw = fs.readFileSync(storeFile, "utf-8");
  return JSON.parse(raw) as StoreData;
}

export function writeStore(data: StoreData) {
  ensureStore();
  fs.writeFileSync(storeFile, JSON.stringify(data, null, 2), "utf-8");
}

export function resetStore() {
  writeStore(seedData);
  return seedData;
}
