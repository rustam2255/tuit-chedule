import { Router } from "express";
import { z } from "zod";
import {
  createDoc,
  deleteDocById,
  getStoreData,
  seedFirestore,
} from "../../lib/firestore.js";
import type { StoreData } from "../../shared/types.js";

const router = Router();

const buildingSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(1),
  floors: z.coerce.number().int().min(1).max(20),
  description: z.string().optional(),
});

const facultySchema = z.object({
  name: z.string().min(2),
  code: z.string().min(1),
});

const departmentSchema = z.object({
  facultyId: z.string().min(1),
  name: z.string().min(2),
  code: z.string().min(1),
});

const subjectSchema = z.object({
  departmentId: z.string().min(1),
  name: z.string().min(2),
  code: z.string().min(1),
});

const teacherSchema = z.object({
  fullName: z.string().min(3),
  departmentId: z.string().min(1),
  unavailableTimeslotIds: z.array(z.string()).default([]),
});

const groupSchema = z.object({
  name: z.string().min(2),
  facultyId: z.string().min(1),
  departmentId: z.string().min(1),
  size: z.coerce.number().int().positive(),
  maxLessonsPerDay: z.coerce.number().int().min(1).max(6),
});

const roomSchema = z.object({
  buildingId: z.string().min(1),
  name: z.string().min(2),
  capacity: z.coerce.number().int().positive(),
  type: z.enum(["lecture", "seminar", "lab", "computer_lab"]),
  floor: z.coerce.number().int().min(1).max(20).optional(),
});

const loadSchema = z.object({
  subjectId: z.string().min(1),
  groupId: z.string().min(1),
  teacherId: z.string().min(1),
  lessonType: z.enum(["lecture", "seminar", "lab", "computer_lab"]),
  weeklyLessons: z.coerce.number().int().min(1).max(6),
  preferredBuildingId: z.string().optional().or(z.literal("")),
});

const schemas = {
  buildings: buildingSchema,
  faculties: facultySchema,
  departments: departmentSchema,
  subjects: subjectSchema,
  teachers: teacherSchema,
  groups: groupSchema,
  rooms: roomSchema,
  loads: loadSchema,
} as const;

type CollectionName = keyof typeof schemas;
type LoadPayload = z.infer<typeof loadSchema>;

function assertRefs(
  store: StoreData,
  collection: CollectionName,
  payload: unknown
) {
  if (collection === "departments") {
    const data = payload as z.infer<typeof departmentSchema>;
    if (!store.faculties.some((item) => item.id === data.facultyId)) {
      return "Fakultet topilmadi";
    }
  }

  if (collection === "subjects") {
    const data = payload as z.infer<typeof subjectSchema>;
    if (!store.departments.some((item) => item.id === data.departmentId)) {
      return "Kafedra topilmadi";
    }
  }

  if (collection === "teachers") {
    const data = payload as z.infer<typeof teacherSchema>;
    if (!store.departments.some((item) => item.id === data.departmentId)) {
      return "Kafedra topilmadi";
    }
  }

  if (collection === "groups") {
    const data = payload as z.infer<typeof groupSchema>;
    if (!store.faculties.some((item) => item.id === data.facultyId)) {
      return "Fakultet topilmadi";
    }
    if (!store.departments.some((item) => item.id === data.departmentId)) {
      return "Kafedra topilmadi";
    }
  }

  if (collection === "rooms") {
    const data = payload as z.infer<typeof roomSchema>;
    if (!store.buildings.some((item) => item.id === data.buildingId)) {
      return "Bino topilmadi";
    }
  }

  if (collection === "loads") {
    const data = payload as LoadPayload;
    if (!store.subjects.some((item) => item.id === data.subjectId)) {
      return "Fan topilmadi";
    }
    if (!store.groups.some((item) => item.id === data.groupId)) {
      return "Guruh topilmadi";
    }
    if (!store.teachers.some((item) => item.id === data.teacherId)) {
      return "Ustoz topilmadi";
    }
    if (
      data.preferredBuildingId &&
      !store.buildings.some((item) => item.id === data.preferredBuildingId)
    ) {
      return "Bino topilmadi";
    }
  }

  return null;
}

router.get("/full", async (_req, res) => {
  try {
    const store = await getStoreData();
    res.json(store);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Ma'lumotlarni olishda xatolik" });
  }
});

router.post("/reset", async (_req, res) => {
  try {
    const data = await seedFirestore(true);
    res.json({ message: "Firestore demo ma'lumotlari tiklandi", data });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Resetda xatolik" });
  }
});

router.get("/:collection", async (req, res) => {
  try {
    const store = await getStoreData();
    const { collection } = req.params as { collection: keyof StoreData };

    if (!(collection in store)) {
      return res.status(404).json({ message: "Bo'lim topilmadi" });
    }

    res.json((store as any)[collection]);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Ma'lumotlarni olishda xatolik" });
  }
});

router.post("/:collection", async (req, res) => {
  try {
    const { collection } = req.params as { collection: CollectionName };

    if (!(collection in schemas)) {
      return res.status(404).json({ message: "Bo'lim topilmadi" });
    }

    if (collection === "loads") {
      const parsed = loadSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message: "Ma'lumot noto'g'ri",
          issues: parsed.error.flatten(),
        });
      }

      const store = await getStoreData();
      const refError = assertRefs(store, collection, parsed.data);
      if (refError) {
        return res.status(400).json({ message: refError });
      }

      const payload: LoadPayload = !parsed.data.preferredBuildingId
        ? { ...parsed.data, preferredBuildingId: undefined }
        : parsed.data;

      const created = await createDoc(collection, payload as any);
      return res.status(201).json(created);
    }

    const parsed = schemas[collection].safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Ma'lumot noto'g'ri",
        issues: parsed.error.flatten(),
      });
    }

    const store = await getStoreData();
    const refError = assertRefs(store, collection, parsed.data);
    if (refError) {
      return res.status(400).json({ message: refError });
    }

    const created = await createDoc(collection, parsed.data as any);
    return res.status(201).json(created);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Saqlashda xatolik" });
  }
});

router.delete("/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params as {
      collection: CollectionName;
      id: string;
    };

    if (!(collection in schemas)) {
      return res.status(404).json({ message: "Bo'lim topilmadi" });
    }

    await deleteDocById(collection, id);
    return res.json({ message: "O'chirildi" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "O'chirishda xatolik" });
  }
});

export default router;