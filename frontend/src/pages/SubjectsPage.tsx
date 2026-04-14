import { useState } from "react";
import DataTable from "@/components/DataTable";
import DeleteButton from "@/components/DeleteButton";
import FormCard from "@/components/FormCard";
import { InputField, Label, SelectField } from "@/components/FormControls";
import SectionGrid from "@/components/SectionGrid";
import { useMasterData } from "@/hooks/useMasterData";
import api from "@/shared/api";

export default function SubjectsPage() {
  const { data, refresh } = useMasterData();
  const [form, setForm] = useState({ departmentId: data.departments[0]?.id ?? "", name: "", code: "" });
  const [loading, setLoading] = useState(false);
  const depMap = new Map(data.departments.map((item) => [item.id, item.name]));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await api.post("/masterdata/subjects", form); setForm({ departmentId: data.departments[0]?.id ?? "", name: "", code: "" }); await refresh(); } finally { setLoading(false); } };
  const remove = async (id: string) => { await api.delete(`/masterdata/subjects/${id}`); await refresh(); };
  return <SectionGrid><FormCard title="Fan qo‘shish" description="Kafedra ichidagi fanlarni kiritib boring."><form className="space-y-4" onSubmit={submit}><Label title="Kafedra"><SelectField value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>{data.departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</SelectField></Label><Label title="Fan nomi"><InputField value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Label><Label title="Kod"><InputField value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Label><button disabled={loading || !data.departments.length} className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">{loading ? "Saqlanmoqda..." : "Qo‘shish"}</button></form></FormCard><DataTable title="Fanlar ro‘yxati" data={data.subjects} columns={[{ key: "name", title: "Fan" }, { key: "departmentId", title: "Kafedra", render: (item) => depMap.get(item.departmentId) ?? item.departmentId }, { key: "code", title: "Kod" }, { key: "actions", title: "Amal", render: (item) => <DeleteButton onClick={() => remove(item.id)} /> }]} /></SectionGrid>;
}
