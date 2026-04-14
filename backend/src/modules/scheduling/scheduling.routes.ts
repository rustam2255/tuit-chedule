import { Router } from "express";
import { z } from "zod";
import { clearSchedule, getCurrentSchedule, getStoreData, saveSchedule } from "../../lib/firestore.js";
import { generateSchedule } from "./scheduler.js";
import type { ScheduleEntry, SchedulerResult, StoreData } from "../../shared/types.js";

const router = Router();

router.get("/overview", async (_req, res) => {
  try {
    const store = await getStoreData();
    res.json({
      buildings: store.buildings.length,
      faculties: store.faculties.length,
      departments: store.departments.length,
      rooms: store.rooms.length,
      teachers: store.teachers.length,
      groups: store.groups.length,
      subjects: store.subjects.length,
      loads: store.loads.length,
      timeslots: store.timeslots.length,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Overview olishda xatolik" });
  }
});

router.get("/resources", async (_req, res) => {
  try {
    const store = await getStoreData();
    res.json(store);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Resurslarni olishda xatolik" });
  }
});

router.get("/current", async (_req, res) => {
  try {
    const schedule = await getCurrentSchedule();
    res.json(schedule);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Joriy jadvalni olishda xatolik" });
  }
});

router.post("/generate", async (_req, res) => {
  try {
    const store = await getStoreData();
    const result = generateSchedule(store);
    await saveSchedule(result);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Jadval yaratishda xatolik" });
  }
});

router.delete("/current", async (_req, res) => {
  try {
    await clearSchedule();
    res.json({ message: "Jadval tozalandi" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Tozalashda xatolik" });
  }
});

const updateSchema = z.object({ timeslotId: z.string().min(1), roomId: z.string().min(1) });

router.patch("/entries/:id", async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Yangi slot yoki xona noto'g'ri" });

  try {
    const schedule = await getCurrentSchedule();
    const store = await getStoreData();
    const idx = schedule.entries.findIndex((item) => item.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Dars topilmadi" });

    const existing = schedule.entries[idx];
    const updated: ScheduleEntry = { ...existing, ...parsed.data };
    const conflict = validateEntryUpdate(schedule, store, updated, existing.id);
    if (conflict) return res.status(400).json({ message: conflict });

    schedule.entries[idx] = updated;
    schedule.generatedAt = new Date().toISOString();
    await saveSchedule(schedule);
    res.json(schedule);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Yangilashda xatolik" });
  }
});

router.get("/export/csv", async (_req, res) => {
  try {
    const schedule = await getCurrentSchedule();
    if (!schedule.entries.length) return res.status(404).json({ message: "Avval jadval yarating" });
    const store = await getStoreData();
    const rows = buildFlatRows(schedule, store);
    const header = ["Fan", "Guruh", "Ustoz", "Xona", "Bino", "Kun", "Para", "Boshlanish", "Tugash", "Turi"];
    const csv = [header, ...rows.map((r) => [r.subject, r.group, r.teacher, r.room, r.building, r.day, String(r.order), r.startTime, r.endTime, r.lessonType])]
      .map((line) => line.map(csvEscape).join(","))
      .join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="tatu-schedule.csv"');
    res.send("\uFEFF" + csv);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Exportda xatolik" });
  }
});

function csvEscape(value: string) { return `"${String(value).replaceAll('"', '""')}"`; }

function validateEntryUpdate(schedule: SchedulerResult, store: StoreData, candidate: ScheduleEntry, ignoreId: string) {
  const room = store.rooms.find((item) => item.id === candidate.roomId);
  const timeslot = store.timeslots.find((item) => item.id === candidate.timeslotId);
  const group = store.groups.find((item) => item.id === candidate.groupId);
  const teacher = store.teachers.find((item) => item.id === candidate.teacherId);
  if (!room || !timeslot || !group || !teacher) return "Xona, slot, guruh yoki ustoz topilmadi";
  if (room.capacity < group.size) return "Xona sig'imi guruhga yetmaydi";
  if (room.type !== candidate.lessonType) return "Xona turi dars turiga mos emas";
  if (teacher.unavailableTimeslotIds.includes(candidate.timeslotId)) return "Ustoz bu vaqtda band";
  for (const entry of schedule.entries) {
    if (entry.id === ignoreId || entry.timeslotId !== candidate.timeslotId) continue;
    if (entry.groupId === candidate.groupId) return "Guruhda konflikt bor";
    if (entry.teacherId === candidate.teacherId) return "Ustozda konflikt bor";
    if (entry.roomId === candidate.roomId) return "Xona band";
  }
  const sameDay = schedule.entries.filter((entry) => entry.id !== ignoreId && entry.groupId === candidate.groupId);
  const countSameDay = sameDay.filter((entry) => store.timeslots.find((t) => t.id === entry.timeslotId)?.day === timeslot.day).length;
  if (countSameDay >= group.maxLessonsPerDay) return "Guruhning bir kundagi limiti oshadi";
  return null;
}

function buildFlatRows(schedule: SchedulerResult, store: StoreData) {
  const subjectMap = new Map(store.subjects.map((item) => [item.id, item.name]));
  const groupMap = new Map(store.groups.map((item) => [item.id, item.name]));
  const teacherMap = new Map(store.teachers.map((item) => [item.id, item.fullName]));
  const roomMap = new Map(store.rooms.map((item) => [item.id, item]));
  const buildingMap = new Map(store.buildings.map((item) => [item.id, item.code]));
  const timeslotMap = new Map(store.timeslots.map((item) => [item.id, item]));
  return schedule.entries.map((entry) => {
    const room = roomMap.get(entry.roomId)!;
    const ts = timeslotMap.get(entry.timeslotId)!;
    return {
      subject: subjectMap.get(entry.subjectId) ?? entry.subjectId,
      group: groupMap.get(entry.groupId) ?? entry.groupId,
      teacher: teacherMap.get(entry.teacherId) ?? entry.teacherId,
      room: room.name,
      building: buildingMap.get(room.buildingId) ?? room.buildingId,
      day: ts.day,
      order: ts.order,
      startTime: ts.startTime,
      endTime: ts.endTime,
      lessonType: entry.lessonType,
    };
  }).sort((a, b) => a.day.localeCompare(b.day) || a.order - b.order || a.group.localeCompare(b.group));
}

export default router;
