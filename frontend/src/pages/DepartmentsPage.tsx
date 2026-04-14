import { useState } from "react";
import DataTable from "@/components/DataTable";
import DeleteButton from "@/components/DeleteButton";
import FormCard from "@/components/FormCard";
import { InputField, Label, SelectField } from "@/components/FormControls";
import SectionGrid from "@/components/SectionGrid";
import { useMasterData } from "@/hooks/useMasterData";
import api from "@/shared/api";

export default function DepartmentsPage() {
  const { data, refresh } = useMasterData();
  const [form, setForm] = useState({ facultyId: data.faculties[0]?.id ?? "", name: "", code: "" });
  const [loading, setLoading] = useState(false);
  const facultyMap = new Map(data.faculties.map((item) => [item.id, item.name]));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await api.post("/masterdata/departments", form); setForm({ facultyId: data.faculties[0]?.id ?? "", name: "", code: "" }); await refresh(); } finally { setLoading(false); } };
  const remove = async (id: string) => { await api.delete(`/masterdata/departments/${id}`); await refresh(); };
  return <SectionGrid><FormCard title="Kafedra qo‘shish" description="Kafedrani ma’lum fakultetga biriktiring."><form className="space-y-4" onSubmit={submit}><Label title="Fakultet"><SelectField value={form.facultyId} onChange={(e) => setForm({ ...form, facultyId: e.target.value })}>{data.faculties.map((faculty) => <option key={faculty.id} value={faculty.id}>{faculty.name}</option>)}</SelectField></Label><Label title="Kafedra nomi"><InputField value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Label><Label title="Kod"><InputField value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Label><button disabled={loading || !data.faculties.length} className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">{loading ? "Saqlanmoqda..." : "Qo‘shish"}</button></form></FormCard><DataTable title="Kafedralar ro‘yxati" data={data.departments} columns={[{ key: "name", title: "Nomi" }, { key: "facultyId", title: "Fakultet", render: (item) => facultyMap.get(item.facultyId) ?? item.facultyId }, { key: "code", title: "Kod" }, { key: "actions", title: "Amal", render: (item) => <DeleteButton onClick={() => remove(item.id)} /> }]} /></SectionGrid>;
}
