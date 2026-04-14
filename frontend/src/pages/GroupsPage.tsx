import { useState } from "react";
import DataTable from "@/components/DataTable";
import DeleteButton from "@/components/DeleteButton";
import FormCard from "@/components/FormCard";
import { InputField, Label, SelectField } from "@/components/FormControls";
import SectionGrid from "@/components/SectionGrid";
import { useMasterData } from "@/hooks/useMasterData";
import api from "@/shared/api";

export default function GroupsPage() {
  const { data, refresh } = useMasterData();
  const [form, setForm] = useState({ name: "", facultyId: data.faculties[0]?.id ?? "", departmentId: data.departments[0]?.id ?? "", size: "30", maxLessonsPerDay: "3" });
  const [loading, setLoading] = useState(false);
  const facultyMap = new Map(data.faculties.map((item) => [item.id, item.name]));
  const depMap = new Map(data.departments.map((item) => [item.id, item.name]));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await api.post("/masterdata/groups", form); setForm({ name: "", facultyId: data.faculties[0]?.id ?? "", departmentId: data.departments[0]?.id ?? "", size: "30", maxLessonsPerDay: "3" }); await refresh(); } finally { setLoading(false); } };
  const remove = async (id: string) => { await api.delete(`/masterdata/groups/${id}`); await refresh(); };
  return <SectionGrid><FormCard title="Guruh qo‘shish" description="Har bir guruh uchun fakultet, kafedra va maksimal kunlik dars sonini belgilang."><form className="space-y-4" onSubmit={submit}><Label title="Guruh nomi"><InputField value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Label><Label title="Fakultet"><SelectField value={form.facultyId} onChange={(e) => setForm({ ...form, facultyId: e.target.value })}>{data.faculties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</SelectField></Label><Label title="Kafedra"><SelectField value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>{data.departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</SelectField></Label><div className="grid gap-4 sm:grid-cols-2"><Label title="Talabalar soni"><InputField type="number" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} /></Label><Label title="Kunlik limit"><InputField type="number" value={form.maxLessonsPerDay} onChange={(e) => setForm({ ...form, maxLessonsPerDay: e.target.value })} /></Label></div><button disabled={loading || !data.faculties.length || !data.departments.length} className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">{loading ? "Saqlanmoqda..." : "Qo‘shish"}</button></form></FormCard><DataTable title="Talabalar guruhlari" data={data.groups} columns={[{ key: "name", title: "Guruh" }, { key: "facultyId", title: "Fakultet", render: (item) => facultyMap.get(item.facultyId) ?? item.facultyId }, { key: "departmentId", title: "Kafedra", render: (item) => depMap.get(item.departmentId) ?? item.departmentId }, { key: "size", title: "Talaba soni" }, { key: "maxLessonsPerDay", title: "Kunlik limit" }, { key: "actions", title: "Amal", render: (item) => <DeleteButton onClick={() => remove(item.id)} /> }]} /></SectionGrid>;
}
