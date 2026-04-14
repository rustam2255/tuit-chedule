import { useMemo, useState } from "react";
import { BookOpenCheck, Building2, Layers3, School2, Shapes, UsersRound, Warehouse } from "lucide-react";
import StatCard from "@/components/StatCard";
import SchedulePreview from "@/components/SchedulePreview";
import { useMasterData } from "@/hooks/useMasterData";
import api from "@/shared/api";
import type { ScheduleEntry } from "@/shared/types";

export default function DashboardPage() {
  const { data, refresh } = useMasterData();
  const [schedule, setSchedule] = useState<{ entries: ScheduleEntry[]; unscheduled: Array<{ loadId: string; reason: string }> } | null>(null);
  const [loading, setLoading] = useState(false);

  const runGenerator = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/scheduling/generate");
      setSchedule(data);
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const previewEntries = useMemo(() => {
    if (!schedule) return [];
    const subjectMap = new Map(data.subjects.map((item) => [item.id, item.name]));
    const groupMap = new Map(data.groups.map((item) => [item.id, item.name]));
    const teacherMap = new Map(data.teachers.map((item) => [item.id, item.fullName]));
    const buildingMap = new Map(data.buildings.map((item) => [item.id, item.code]));
    const roomMap = new Map(data.rooms.map((item) => [item.id, `${item.name} (${buildingMap.get(item.buildingId) ?? item.buildingId})`]));
    const timeslotMap = new Map(data.timeslots.map((item) => [item.id, `${item.day} | ${item.startTime} - ${item.endTime}`]));
    return schedule.entries.map((entry) => ({
      ...entry,
      subjectName: subjectMap.get(entry.subjectId) ?? entry.subjectId,
      groupName: groupMap.get(entry.groupId) ?? entry.groupId,
      teacherName: teacherMap.get(entry.teacherId) ?? entry.teacherId,
      roomName: roomMap.get(entry.roomId) ?? entry.roomId,
      timeslotLabel: timeslotMap.get(entry.timeslotId) ?? entry.timeslotId,
    }));
  }, [data, schedule]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-6">
        <StatCard icon={Warehouse} label="Binolar" value={data.buildings.length} />
        <StatCard icon={Layers3} label="Fakultetlar" value={data.faculties.length} />
        <StatCard icon={Shapes} label="Kafedralar" value={data.departments.length} />
        <StatCard icon={Building2} label="Xonalar" value={data.rooms.length} />
        <StatCard icon={UsersRound} label="Ustozlar" value={data.teachers.length} />
        <StatCard icon={BookOpenCheck} label="Yuklamalar" value={data.loads.length} />
      </section>
      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <SchedulePreview entries={previewEntries} />
        <div className="rounded-[28px] bg-white p-6 shadow-soft">
          
          <button onClick={runGenerator} disabled={loading} className="mt-6 w-full rounded-2xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">{loading ? "Generatsiya qilinmoqda..." : "Jadvalni avtomatik yaratish"}</button>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Fanlar</p><p className="mt-2 text-2xl font-semibold text-slate-900">{data.subjects.length}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Slotlar</p><p className="mt-2 text-2xl font-semibold text-slate-900">{data.timeslots.length}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Guruhlar</p><p className="mt-2 text-2xl font-semibold text-slate-900">{data.groups.length}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Binolar</p><p className="mt-2 text-2xl font-semibold text-slate-900">{data.buildings.length}</p></div>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Konflikt hisobot</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">{(schedule?.unscheduled ?? []).length === 0 ? <li>Hozircha konflikt topilmadi yoki generatsiya hali ishga tushmagan.</li> : schedule?.unscheduled.map((item) => <li key={`${item.loadId}-${item.reason}`}>• {item.reason}</li>)}</ul>
          </div>
        </div>
      </section>
    </div>
  );
}
