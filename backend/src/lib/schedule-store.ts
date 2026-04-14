import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SchedulerResult } from "../shared/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../../data");
const scheduleFile = path.join(dataDir, "current-schedule.json");

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

export function readCurrentSchedule(): SchedulerResult | null {
  ensureDir();
  if (!fs.existsSync(scheduleFile)) return null;
  return JSON.parse(fs.readFileSync(scheduleFile, "utf-8")) as SchedulerResult;
}

export function writeCurrentSchedule(data: SchedulerResult) {
  ensureDir();
  fs.writeFileSync(scheduleFile, JSON.stringify(data, null, 2), "utf-8");
}

export function clearCurrentSchedule() {
  ensureDir();
  if (fs.existsSync(scheduleFile)) fs.unlinkSync(scheduleFile);
}
