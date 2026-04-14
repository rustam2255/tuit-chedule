import type { Room, ScheduleEntry, SchedulerResult, StoreData, StudentGroup, SubjectLoad, Teacher, Timeslot } from "../../shared/types.js";

type SchedulerInput = Pick<StoreData, "rooms" | "teachers" | "groups" | "timeslots" | "loads" | "subjects">;

export function generateSchedule(input: SchedulerInput): SchedulerResult {
  const { rooms, teachers, groups, timeslots, loads, subjects } = input;
  const entries: ScheduleEntry[] = [];
  const unscheduled: Array<{ loadId: string; reason: string }> = [];

  const teacherMap = new Map(teachers.map((t) => [t.id, t]));
  const groupMap = new Map(groups.map((g) => [g.id, g]));
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  const groupTimes = new Map<string, Set<string>>();
  const teacherTimes = new Map<string, Set<string>>();
  const roomTimes = new Map<string, Set<string>>();
  const groupDayLoad = new Map<string, Map<string, number>>();
  const teacherDayLoad = new Map<string, Map<string, number>>();

  const sortedLoads = [...loads].sort((a, b) => {
    const groupA = groupMap.get(a.groupId)!;
    const groupB = groupMap.get(b.groupId)!;
    return groupB.size - groupA.size || b.weeklyLessons - a.weeklyLessons;
  });

  for (const load of sortedLoads) {
    const teacher = teacherMap.get(load.teacherId);
    const group = groupMap.get(load.groupId);
    const subject = subjectMap.get(load.subjectId);

    if (!teacher || !group || !subject) {
      unscheduled.push({ loadId: load.id, reason: "Ustoz, guruh yoki fan topilmadi" });
      continue;
    }

    for (let i = 0; i < load.weeklyLessons; i++) {
      const candidate = findBestPlacement({ load, group, teacher, rooms, timeslots, groupTimes, teacherTimes, roomTimes, groupDayLoad, teacherDayLoad });
      if (!candidate) {
        unscheduled.push({ loadId: load.id, reason: `${subject.name} uchun ${i + 1}-darsga slot topilmadi` });
        continue;
      }

      entries.push({
        id: `entry-${entries.length + 1}`,
        timeslotId: candidate.timeslot.id,
        roomId: candidate.room.id,
        teacherId: teacher.id,
        groupId: group.id,
        subjectId: subject.id,
        lessonType: load.lessonType,
      });

      addBusy(groupTimes, group.id, candidate.timeslot.id);
      addBusy(teacherTimes, teacher.id, candidate.timeslot.id);
      addBusy(roomTimes, candidate.room.id, candidate.timeslot.id);
      bump(groupDayLoad, group.id, candidate.timeslot.day);
      bump(teacherDayLoad, teacher.id, candidate.timeslot.day);
    }
  }

  return { entries, unscheduled, generatedAt: new Date().toISOString() };
}

function findBestPlacement(args: {
  load: SubjectLoad;
  group: StudentGroup;
  teacher: Teacher;
  rooms: Room[];
  timeslots: Timeslot[];
  groupTimes: Map<string, Set<string>>;
  teacherTimes: Map<string, Set<string>>;
  roomTimes: Map<string, Set<string>>;
  groupDayLoad: Map<string, Map<string, number>>;
  teacherDayLoad: Map<string, Map<string, number>>;
}) {
  const { load, group, teacher, rooms, timeslots, groupTimes, teacherTimes, roomTimes, groupDayLoad, teacherDayLoad } = args;
  const roomPool = rooms.filter((room) => room.capacity >= group.size);
  let best: { timeslot: Timeslot; room: Room; score: number } | null = null;

  for (const timeslot of timeslots) {
    if (teacher.unavailableTimeslotIds.includes(timeslot.id)) continue;
    if (isBusy(groupTimes, group.id, timeslot.id)) continue;
    if (isBusy(teacherTimes, teacher.id, timeslot.id)) continue;

    const gDay = groupDayLoad.get(group.id)?.get(timeslot.day) ?? 0;
    const tDay = teacherDayLoad.get(teacher.id)?.get(timeslot.day) ?? 0;
    if (gDay >= group.maxLessonsPerDay) continue;
    if (tDay >= 4) continue;

    for (const room of roomPool) {
      if (isBusy(roomTimes, room.id, timeslot.id)) continue;
      let score = 0;
      if (room.type === load.lessonType) score += 8;
      else score -= 4;
      if (load.preferredBuildingId && room.buildingId === load.preferredBuildingId) score += 5;
      score += Math.max(0, 6 - gDay * 2);
      score += Math.max(0, 4 - tDay * 2);
      score += Math.max(0, 4 - Math.floor(Math.abs(room.capacity - group.size) / 10));
      score += timeslot.order <= 2 ? 2 : 0;
      if (!best || score > best.score) best = { timeslot, room, score };
    }
  }

  return best;
}

function isBusy(map: Map<string, Set<string>>, entityId: string, timeslotId: string) {
  return map.get(entityId)?.has(timeslotId) ?? false;
}
function addBusy(map: Map<string, Set<string>>, entityId: string, timeslotId: string) {
  const current = map.get(entityId) ?? new Set<string>();
  current.add(timeslotId);
  map.set(entityId, current);
}
function bump(map: Map<string, Map<string, number>>, entityId: string, day: string) {
  const byDay = map.get(entityId) ?? new Map<string, number>();
  byDay.set(day, (byDay.get(day) ?? 0) + 1);
  map.set(entityId, byDay);
}
