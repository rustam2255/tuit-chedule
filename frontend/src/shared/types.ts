export type RoomType = "lecture" | "seminar" | "lab" | "computer_lab";

export type Building = { id: string; name: string; code: string; floors: number; description?: string };
export type Faculty = { id: string; name: string; code: string };
export type Department = { id: string; facultyId: string; name: string; code: string };
export type Subject = { id: string; departmentId: string; name: string; code: string };
export type Room = { id: string; buildingId: string; name: string; capacity: number; type: RoomType; floor?: number };
export type Teacher = { id: string; fullName: string; departmentId: string; unavailableTimeslotIds: string[] };
export type StudentGroup = { id: string; name: string; facultyId: string; departmentId: string; size: number; maxLessonsPerDay: number };
export type Timeslot = { id: string; day: string; order: number; startTime: string; endTime: string };
export type SubjectLoad = { id: string; subjectId: string; groupId: string; teacherId: string; lessonType: RoomType; weeklyLessons: number; preferredBuildingId?: string };
export type ScheduleEntry = { id: string; subjectId: string; groupId: string; teacherId: string; roomId: string; timeslotId: string; lessonType: RoomType };

export type StoreData = {
  buildings: Building[];
  faculties: Faculty[];
  departments: Department[];
  subjects: Subject[];
  rooms: Room[];
  teachers: Teacher[];
  groups: StudentGroup[];
  timeslots: Timeslot[];
  loads: SubjectLoad[];
};

export type SchedulerResult = {
  entries: ScheduleEntry[];
  unscheduled: Array<{ loadId: string; reason: string }>;
  generatedAt: string | null;
};

export type DisplayScheduleEntry = ScheduleEntry & {
  subjectName: string;
  groupName: string;
  teacherName: string;
  roomName: string;
  roomBuilding: string;
  timeslotLabel: string;
  day: string;
  order: number;
  startTime: string;
  endTime: string;
};
