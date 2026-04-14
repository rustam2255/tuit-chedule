import { useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import DeleteButton from "@/components/DeleteButton";
import FormCard from "@/components/FormCard";
import { InputField, Label, SelectField } from "@/components/FormControls";
import SectionGrid from "@/components/SectionGrid";
import { useMasterData } from "@/hooks/useMasterData";
import api from "@/shared/api";

export default function RoomsPage() {
  const { data, refresh } = useMasterData();
  const [form, setForm] = useState({ buildingId: data.buildings[0]?.id ?? "", name: "", capacity: "30", type: "lecture", floor: "1" });
  const [loading, setLoading] = useState(false);
  const buildingMap = useMemo(() => new Map(data.buildings.map((item) => [item.id, `${item.code} - ${item.name}`])), [data.buildings]);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await api.post("/masterdata/rooms", form); setForm({ buildingId: data.buildings[0]?.id ?? "", name: "", capacity: "30", type: "lecture", floor: "1" }); await refresh(); } finally { setLoading(false); } };
  const remove = async (id: string) => { await api.delete(`/masterdata/rooms/${id}`); await refresh(); };
  return <SectionGrid><FormCard title="Xona qo‘shish" description="Bino, qavat, xona nomi, sig‘imi va turini belgilang."><form className="space-y-4" onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2"><Label title="Bino"><SelectField value={form.buildingId} onChange={(e) => setForm({ ...form, buildingId: e.target.value })}>{data.buildings.map((item) => <option key={item.id} value={item.id}>{item.code} - {item.name}</option>)}</SelectField></Label><Label title="Xona nomi"><InputField value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Label></div><div className="grid gap-4 sm:grid-cols-3"><Label title="Qavat"><InputField type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} /></Label><Label title="Sig‘im"><InputField type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></Label><Label title="Turi"><SelectField value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="lecture">lecture</option><option value="seminar">seminar</option><option value="lab">lab</option><option value="computer_lab">computer_lab</option></SelectField></Label></div><button disabled={loading || !data.buildings.length} className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">{loading ? "Saqlanmoqda..." : "Qo‘shish"}</button></form></FormCard><DataTable title="Xonalar bazasi" data={data.rooms} columns={[{ key: "buildingId", title: "Bino", render: (item) => buildingMap.get(item.buildingId) ?? item.buildingId }, { key: "name", title: "Xona" }, { key: "floor", title: "Qavat" }, { key: "capacity", title: "Sig‘im" }, { key: "type", title: "Turi" }, { key: "actions", title: "Amal", render: (item) => <DeleteButton onClick={() => remove(item.id)} /> }]} /></SectionGrid>;
}
