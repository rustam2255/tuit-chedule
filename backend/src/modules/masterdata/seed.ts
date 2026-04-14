import type { StoreData } from "../../shared/types.js";

export const seedData: StoreData = {
  buildings: [
    { id: "b1", name: "A bino", code: "A", floors: 4, description: "Asosiy o‘quv bino" },
    { id: "b2", name: "B bino", code: "B", floors: 4, description: "Kompyuter laboratoriyalari" },
    { id: "b3", name: "C bino", code: "C", floors: 3, description: "Ma’ruza auditoriyalari" },
  ],
  faculties: [
    { id: "f1", name: "Dasturiy injiniring fakulteti", code: "DI" },
    { id: "f2", name: "Kompyuter injiniring fakulteti", code: "KI" },
  ],
  departments: [
    { id: "d1", facultyId: "f1", name: "Dasturiy ta’minot", code: "DT" },
    { id: "d2", facultyId: "f2", name: "Axborot texnologiyalari", code: "AT" },
  ],
  subjects: [
    { id: "s1", departmentId: "d1", name: "Algoritmlar", code: "ALG" },
    { id: "s2", departmentId: "d1", name: "Web dasturlash", code: "WEB" },
    { id: "s3", departmentId: "d2", name: "Ma’lumotlar bazasi", code: "MDB" },
  ],
  rooms: [
    { id: "r1", buildingId: "b1", name: "A-101", capacity: 80, type: "lecture", floor: 1 },
    { id: "r2", buildingId: "b1", name: "A-204", capacity: 30, type: "seminar", floor: 2 },
    { id: "r3", buildingId: "b2", name: "B-301", capacity: 28, type: "computer_lab", floor: 3 },
    { id: "r4", buildingId: "b3", name: "C-110", capacity: 32, type: "lab", floor: 1 },
  ],
  teachers: [
    { id: "t1", fullName: "Akmal Karimov", departmentId: "d1", unavailableTimeslotIds: ["ts-6"] },
    { id: "t2", fullName: "Dilnoza Usmonova", departmentId: "d1", unavailableTimeslotIds: ["ts-1", "ts-2"] },
    { id: "t3", fullName: "Sardor Xudoyberdiyev", departmentId: "d2", unavailableTimeslotIds: [] },
  ],
  groups: [
    { id: "g1", name: "SE-2201", facultyId: "f1", departmentId: "d1", size: 28, maxLessonsPerDay: 4 },
    { id: "g2", name: "SE-2202", facultyId: "f1", departmentId: "d1", size: 30, maxLessonsPerDay: 4 },
    { id: "g3", name: "KI-2201", facultyId: "f2", departmentId: "d2", size: 26, maxLessonsPerDay: 4 },
  ],
  timeslots: [
    { id: "ts-1", day: "monday", order: 1, startTime: "08:30", endTime: "09:50" },
    { id: "ts-2", day: "monday", order: 2, startTime: "10:00", endTime: "11:20" },
    { id: "ts-3", day: "monday", order: 3, startTime: "11:30", endTime: "12:50" },
    { id: "ts-4", day: "tuesday", order: 1, startTime: "08:30", endTime: "09:50" },
    { id: "ts-5", day: "tuesday", order: 2, startTime: "10:00", endTime: "11:20" },
    { id: "ts-6", day: "tuesday", order: 3, startTime: "11:30", endTime: "12:50" },
    { id: "ts-7", day: "wednesday", order: 1, startTime: "08:30", endTime: "09:50" },
    { id: "ts-8", day: "wednesday", order: 2, startTime: "10:00", endTime: "11:20" },
    { id: "ts-9", day: "thursday", order: 1, startTime: "08:30", endTime: "09:50" },
    { id: "ts-10", day: "friday", order: 1, startTime: "08:30", endTime: "09:50" },
  ],
  loads: [
    { id: "l1", subjectId: "s1", groupId: "g1", teacherId: "t1", lessonType: "lecture", weeklyLessons: 1, preferredBuildingId: "b1" },
    { id: "l2", subjectId: "s2", groupId: "g1", teacherId: "t2", lessonType: "computer_lab", weeklyLessons: 2, preferredBuildingId: "b2" },
    { id: "l3", subjectId: "s3", groupId: "g3", teacherId: "t3", lessonType: "lab", weeklyLessons: 2, preferredBuildingId: "b3" },
  ],
};
