import { firestore } from "./firebase.js";
import { seedData } from "../modules/masterdata/seed.js";
import type { ScheduleEntry, SchedulerResult, StoreData } from "../shared/types.js";

const dataCollections = ["buildings", "faculties", "departments", "subjects", "rooms", "teachers", "groups", "timeslots", "loads"] as const;
type CollectionName = (typeof dataCollections)[number];

function assertDb() {
  if (!firestore) throw new Error("Firestore ulanmagan. backend/.env ichiga Firebase service account qiymatlarini kiriting.");
  return firestore;
}

export async function getCollection<T>(name: CollectionName): Promise<T[]> {
  const db = assertDb();
  const snapshot = await db.collection(name).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
}

export async function getStoreData(): Promise<StoreData> {
  const [buildings, faculties, departments, subjects, rooms, teachers, groups, timeslots, loads] = await Promise.all(
    dataCollections.map((name) => getCollection<any>(name))
  );
  return { buildings, faculties, departments, subjects, rooms, teachers, groups, timeslots, loads };
}

export async function createDoc<T extends Record<string, any>>(collection: CollectionName, payload: T) {
  const db = assertDb();
  const ref = db.collection(collection).doc();
  const doc = { ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  await ref.set(doc);
  return { id: ref.id, ...payload };
}

export async function updateDocById<T extends Record<string, any>>(collection: CollectionName, id: string, payload: T) {
  const db = assertDb();
  await db.collection(collection).doc(id).set({ ...payload, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function deleteDocById(collection: CollectionName, id: string) {
  const db = assertDb();
  await db.collection(collection).doc(id).delete();
}

async function clearCollection(name: string) {
  const db = assertDb();
  const snapshot = await db.collection(name).get();
  if (snapshot.empty) return;
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

export async function seedFirestore(force = false) {
  const db = assertDb();
  const existing = await db.collection("faculties").limit(1).get();
  if (!existing.empty && !force) return getStoreData();

  if (force) {
    await Promise.all([...dataCollections, "schedule_entries"].map((name) => clearCollection(name)));
    await clearCollection("settings");
  }

  for (const collectionName of dataCollections) {
    const batch = db.batch();
    const items = seedData[collectionName];
    items.forEach((item) => {
      const { id, ...rest } = item as any;
      const ref = db.collection(collectionName).doc(id);
      batch.set(ref, rest);
    });
    await batch.commit();
  }

  await db.collection("settings").doc("schedule_meta").set({ generatedAt: null, unscheduled: [] }, { merge: true });
  return getStoreData();
}

export async function getCurrentSchedule(): Promise<SchedulerResult> {
  const db = assertDb();
  const [metaDoc, entriesSnapshot] = await Promise.all([
    db.collection("settings").doc("schedule_meta").get(),
    db.collection("schedule_entries").get(),
  ]);

  const meta = (metaDoc.data() ?? {}) as { generatedAt?: string | null; unscheduled?: Array<{ loadId: string; reason: string }> };
  const entries = entriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ScheduleEntry));
  return {
    entries,
    unscheduled: meta.unscheduled ?? [],
    generatedAt: meta.generatedAt ?? null,
  };
}

export async function saveSchedule(schedule: SchedulerResult) {
  const db = assertDb();
  await clearCollection("schedule_entries");
  if (schedule.entries.length) {
    const batch = db.batch();
    schedule.entries.forEach((entry) => {
      const { id, ...rest } = entry;
      batch.set(db.collection("schedule_entries").doc(id), rest);
    });
    await batch.commit();
  }
  await db.collection("settings").doc("schedule_meta").set(
    {
      generatedAt: schedule.generatedAt,
      unscheduled: schedule.unscheduled,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function clearSchedule() {
  await clearCollection("schedule_entries");
  const db = assertDb();
  await db.collection("settings").doc("schedule_meta").set({ generatedAt: null, unscheduled: [], updatedAt: new Date().toISOString() }, { merge: true });
}
