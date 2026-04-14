import { useState } from "react";
import DataTable from "@/components/DataTable";
import DeleteButton from "@/components/DeleteButton";
import FormCard from "@/components/FormCard";
import { InputField, Label } from "@/components/FormControls";
import SectionGrid from "@/components/SectionGrid";
import { useMasterData } from "@/hooks/useMasterData";
import api from "@/shared/api";

export default function BuildingsPage() {
  const { data, refresh } = useMasterData();
  const [form, setForm] = useState({ name: "", code: "", floors: "4", description: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await api.post("/masterdata/buildings", form); setForm({ name: "", code: "", floors: "4", description: "" }); await refresh(); } finally { setLoading(false); } };
  const remove = async (id: string) => { await api.delete(`/masterdata/buildings/${id}`); await refresh(); };
  return <SectionGrid><FormCard title="Bino qo‘shish" description="A, B, C kabi o‘quv binolari, qavatlar soni va izohlarni kiriting."><form className="space-y-4" onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2"><Label title="Bino nomi"><InputField value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Label><Label title="Kod"><InputField value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Label></div><div className="grid gap-4 sm:grid-cols-2"><Label title="Qavatlar soni"><InputField type="number" value={form.floors} onChange={(e) => setForm({ ...form, floors: e.target.value })} /></Label><Label title="Izoh"><InputField value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Label></div><button disabled={loading} className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">{loading ? "Saqlanmoqda..." : "Qo‘shish"}</button></form></FormCard><DataTable title="Binolar ro‘yxati" data={data.buildings} columns={[{ key: "name", title: "Bino" }, { key: "code", title: "Kod" }, { key: "floors", title: "Qavat" }, { key: "description", title: "Izoh" }, { key: "actions", title: "Amal", render: (item) => <DeleteButton onClick={() => remove(item.id)} /> }]} /></SectionGrid>;
}
