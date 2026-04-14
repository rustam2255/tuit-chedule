import { useEffect, useMemo, useState } from "react";
import api from "@/shared/api";
import { useMasterData } from "@/hooks/useMasterData";
import type { DisplayScheduleEntry, SchedulerResult } from "@/shared/types";

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const dayLabel: Record<string, string> = { monday: "Dushanba", tuesday: "Seshanba", wednesday: "Chorshanba", thursday: "Payshanba", friday: "Juma", saturday: "Shanba" };
const tabs = [{ key: "list", label: "Umumiy jadval" }, { key: "group", label: "Guruh haftaligi" }, { key: "teacher", label: "Ustoz bo'yicha" }, { key: "room", label: "Xona bandligi" }] as const;

export default function SchedulePage() {
  const { data, refresh } = useMasterData();
  const [schedule, setSchedule] = useState<SchedulerResult>({ entries: [], unscheduled: [], generatedAt: null });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("list");
  const [groupFilter, setGroupFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTimeslotId, setEditTimeslotId] = useState("");
  const [editRoomId, setEditRoomId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCurrent = async () => { const response = await api.get<SchedulerResult>("/scheduling/current"); setSchedule(response.data); };
  useEffect(() => { loadCurrent(); }, []);

  const runGenerator = async () => {
    setLoading(true); setError(null); setMessage(null);
    try { const response = await api.post<SchedulerResult>("/scheduling/generate"); setSchedule(response.data); await refresh(); setMessage("Jadval muvaffaqiyatli yaratildi."); }
    catch (err: any) { setError(err?.response?.data?.message || "Jadval yaratishda xatolik yuz berdi"); }
    finally { setLoading(false); }
  };

  const clearSchedule = async () => { await api.delete("/scheduling/current"); await loadCurrent(); setMessage("Jadval tozalandi."); };
  const exportExcel = () => window.open("http://localhost:8000/api/scheduling/export/csv", "_blank");
  const exportPdf = () => window.print();

  const entries = useMemo<DisplayScheduleEntry[]>(() => {
    const subjectMap = new Map(data.subjects.map((item) => [item.id, item.name]));
    const groupMap = new Map(data.groups.map((item) => [item.id, item.name]));
    const teacherMap = new Map(data.teachers.map((item) => [item.id, item.fullName]));
    const roomMap = new Map(data.rooms.map((item) => [item.id, item]));
    const buildingMap = new Map(data.buildings.map((item) => [item.id, item.code]));
    const timeslotMap = new Map(data.timeslots.map((item) => [item.id, item]));
    return schedule.entries.map((entry) => {
      const room = roomMap.get(entry.roomId); const ts = timeslotMap.get(entry.timeslotId);
      return { ...entry, subjectName: subjectMap.get(entry.subjectId) ?? entry.subjectId, groupName: groupMap.get(entry.groupId) ?? entry.groupId, teacherName: teacherMap.get(entry.teacherId) ?? entry.teacherId, roomName: room?.name ?? entry.roomId, roomBuilding: room ? (buildingMap.get(room.buildingId) ?? room.buildingId) : "-", timeslotLabel: ts ? `${dayLabel[ts.day]} | ${ts.startTime} - ${ts.endTime}` : entry.timeslotId, day: ts?.day ?? "monday", order: ts?.order ?? 1, startTime: ts?.startTime ?? "", endTime: ts?.endTime ?? "" };
    }).sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.order - b.order || a.groupName.localeCompare(b.groupName));
  }, [data, schedule]);

  const filteredList = useMemo(() => entries.filter((item) => (!groupFilter || item.groupId === groupFilter) && (!teacherFilter || item.teacherId === teacherFilter) && (!roomFilter || item.roomId === roomFilter)), [entries, groupFilter, teacherFilter, roomFilter]);
  const selectedGroupEntries = useMemo(() => filteredList.filter((item) => !groupFilter || item.groupId === groupFilter), [filteredList, groupFilter]);
  const selectedTeacherEntries = useMemo(() => filteredList.filter((item) => !teacherFilter || item.teacherId === teacherFilter), [filteredList, teacherFilter]);
  const selectedRoomEntries = useMemo(() => filteredList.filter((item) => !roomFilter || item.roomId === roomFilter), [filteredList, roomFilter]);
  const editEntry = entries.find((item) => item.id === editId) ?? null;

  useEffect(() => { if (editEntry) { setEditTimeslotId(editEntry.timeslotId); setEditRoomId(editEntry.roomId); } }, [editEntry]);
  const saveEdit = async () => { if (!editId) return; try { const response = await api.patch<SchedulerResult>(`/scheduling/entries/${editId}`, { timeslotId: editTimeslotId, roomId: editRoomId }); setSchedule(response.data); setEditId(null); setMessage("Dars joylashuvi yangilandi."); setError(null); } catch (err: any) { setError(err?.response?.data?.message || "Saqlashda xatolik bo'ldi"); } };

  const roomOptions = data.rooms.map((item) => ({ value: item.id, label: `${item.name} (${data.buildings.find((b) => b.id === item.buildingId)?.code ?? item.buildingId})` }));

  return <div className="space-y-6"><div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"><div className="rounded-[28px] bg-white p-6 shadow-soft"><h3 className="text-xl font-semibold text-slate-900">Generator va eksport</h3><p className="mt-3 text-sm leading-6 text-slate-500">Admin Firestore bazasiga ma'lumotlarni kiritadi, tizim avtomatik jadval yaratadi, keyin uni qo'lda tahrirlash, Excel ga chiqarish yoki PDF sifatida saqlash mumkin.</p><div className="mt-6 flex flex-wrap gap-3"><button onClick={runGenerator} disabled={loading} className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">{loading ? "Hisoblanmoqda..." : "Jadvalni yaratish"}</button><button onClick={exportExcel} className="rounded-2xl border border-brand-200 px-5 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50">Excel export</button><button onClick={exportPdf} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">PDF / Print</button><button onClick={clearSchedule} className="rounded-2xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50">Tozalash</button></div><div className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4"><Stat label="Darslar" value={schedule.entries.length} /><Stat label="Konfliktlar" value={schedule.unscheduled.length} /><Stat label="Guruhlar" value={data.groups.length} /><Stat label="Xonalar" value={data.rooms.length} /></div>{schedule.generatedAt ? <p className="mt-4 text-xs text-slate-500">Oxirgi generatsiya: {new Date(schedule.generatedAt).toLocaleString()}</p> : null}{message ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}{error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}</div><div className="rounded-[28px] bg-white p-6 shadow-soft"><h3 className="text-xl font-semibold text-slate-900">Konflikt hisoboti</h3><ul className="mt-4 space-y-3 text-sm text-slate-600">{schedule.unscheduled.length === 0 ? <li className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700">Muvaffaqiyatli: hozircha to'qnashuv yo'q.</li> : schedule.unscheduled.map((item) => <li key={`${item.loadId}-${item.reason}`} className="rounded-2xl bg-amber-50 px-4 py-3 text-amber-800">{item.reason}</li>)}</ul></div></div><div className="rounded-[28px] bg-white p-6 shadow-soft"><div className="flex flex-wrap items-center gap-3">{tabs.map((tab) => <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${activeTab === tab.key ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{tab.label}</button>)}</div><div className="mt-5 grid gap-3 md:grid-cols-3"><SelectFilter label="Guruh" value={groupFilter} onChange={setGroupFilter} options={data.groups.map((item) => ({ value: item.id, label: item.name }))} /><SelectFilter label="Ustoz" value={teacherFilter} onChange={setTeacherFilter} options={data.teachers.map((item) => ({ value: item.id, label: item.fullName }))} /><SelectFilter label="Xona" value={roomFilter} onChange={setRoomFilter} options={roomOptions} /></div><div className="mt-6">{activeTab === "list" ? <ScheduleList entries={filteredList} onEdit={setEditId} /> : null}{activeTab === "group" ? <WeeklyGrid title="Guruh bo'yicha haftalik jadval" entries={selectedGroupEntries} /> : null}{activeTab === "teacher" ? <WeeklyGrid title="Ustoz bo'yicha darslar" entries={selectedTeacherEntries} /> : null}{activeTab === "room" ? <WeeklyGrid title="Xona bandligi" entries={selectedRoomEntries} /> : null}</div></div>{editEntry ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-semibold text-slate-900">Darsni tahrirlash</h3><p className="mt-1 text-sm text-slate-500">{editEntry.subjectName} • {editEntry.groupName} • {editEntry.teacherName}</p></div><button onClick={() => setEditId(null)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">Yopish</button></div><div className="mt-6 grid gap-4 md:grid-cols-2"><SelectFilter label="Yangi slot" value={editTimeslotId} onChange={setEditTimeslotId} options={data.timeslots.map((item) => ({ value: item.id, label: `${dayLabel[item.day]} | ${item.startTime} - ${item.endTime}` }))} /><SelectFilter label="Yangi xona" value={editRoomId} onChange={setEditRoomId} options={roomOptions} /></div><div className="mt-6 flex justify-end gap-3"><button onClick={() => setEditId(null)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Bekor qilish</button><button onClick={saveEdit} className="rounded-2xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white">Saqlash</button></div></div></div> : null}</div>;
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p></div>; }
function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) { return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-600">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-500"><option value="">Barchasi</option>{options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>; }
function ScheduleList({ entries, onEdit }: { entries: DisplayScheduleEntry[]; onEdit: (id: string) => void }) { return <div className="overflow-x-auto"><table className="min-w-full border-separate border-spacing-y-3 text-sm"><thead><tr className="text-left text-slate-500"><th className="px-3 py-1 font-medium">Fan</th><th className="px-3 py-1 font-medium">Guruh</th><th className="px-3 py-1 font-medium">Ustoz</th><th className="px-3 py-1 font-medium">Xona</th><th className="px-3 py-1 font-medium">Vaqt</th><th className="px-3 py-1 font-medium">Turi</th><th className="px-3 py-1 font-medium">Amal</th></tr></thead><tbody>{entries.length === 0 ? <tr><td colSpan={7} className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-slate-500">Ko'rsatish uchun jadval yo'q.</td></tr> : entries.map((entry) => <tr key={entry.id} className="bg-slate-50 text-slate-800"><td className="rounded-l-2xl px-4 py-3 font-medium">{entry.subjectName}</td><td className="px-4 py-3">{entry.groupName}</td><td className="px-4 py-3">{entry.teacherName}</td><td className="px-4 py-3">{entry.roomName} ({entry.roomBuilding})</td><td className="px-4 py-3">{entry.timeslotLabel}</td><td className="px-4 py-3">{entry.lessonType}</td><td className="rounded-r-2xl px-4 py-3"><button onClick={() => onEdit(entry.id)} className="rounded-xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">Tahrirlash</button></td></tr>)}</tbody></table></div>; }
function WeeklyGrid({ title, entries }: { title: string; entries: DisplayScheduleEntry[] }) { return <div><h4 className="mb-4 text-lg font-semibold text-slate-900">{title}</h4><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{dayOrder.map((day) => <div key={day} className="rounded-3xl bg-slate-50 p-4"><h5 className="font-semibold text-slate-900">{dayLabel[day]}</h5><div className="mt-3 space-y-3">{entries.filter((item) => item.day === day).length === 0 ? <p className="text-sm text-slate-500">Bo'sh</p> : entries.filter((item) => item.day === day).map((entry) => <div key={entry.id} className="rounded-2xl bg-white p-3"><p className="text-xs text-slate-500">{entry.startTime} - {entry.endTime}</p><p className="mt-1 font-medium text-slate-900">{entry.subjectName}</p><p className="text-sm text-slate-600">{entry.groupName} • {entry.roomName}</p><p className="text-xs text-slate-500">{entry.teacherName}</p></div>)}</div></div>)}</div></div>; }
