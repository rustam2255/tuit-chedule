import { useState } from "react";
import DataTable from "@/components/DataTable";
import DeleteButton from "@/components/DeleteButton";
import FormCard from "@/components/FormCard";
import { InputField, Label } from "@/components/FormControls";
import SectionGrid from "@/components/SectionGrid";
import { useMasterData } from "@/hooks/useMasterData";
import api from "@/shared/api";

export default function FacultiesPage() {
  const { data, refresh } = useMasterData();
  const [form, setForm] = useState({ name: "", code: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await api.post("/masterdata/faculties", form); setForm({ name: "", code: "" }); await refresh(); } finally { setLoading(false); } };
  const remove = async (id: string) => { await api.delete(`/masterdata/faculties/${id}`); await refresh(); };
  return <SectionGrid><FormCard title="Fakultet qo‘shish" description="Masalan: Dasturiy injiniring, Kompyuter injiniring va hokazo."><form className="space-y-4" onSubmit={submit}><Label title="Fakultet nomi"><InputField value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Label><Label title="Qisqa kod"><InputField value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Label><button disabled={loading} className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">{loading ? "Saqlanmoqda..." : "Qo‘shish"}</button></form></FormCard><DataTable title="Fakultetlar ro‘yxati" data={data.faculties} columns={[{ key: "name", title: "Nomi" }, { key: "code", title: "Kod" }, { key: "actions", title: "Amal", render: (item) => <DeleteButton onClick={() => remove(item.id)} /> }]} /></SectionGrid>;
}
