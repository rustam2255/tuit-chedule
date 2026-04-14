import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, UserRound } from "lucide-react";
import api from "@/shared/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("dilxushbek");
  const [password, setPassword] = useState("2003");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setError(""); try { const { data } = await api.post("/auth/login", { username, password }); localStorage.setItem("tatu_token", data.token); localStorage.setItem("tatu_user", JSON.stringify(data.user)); navigate("/dashboard"); } catch (err: any) { setError(err?.response?.data?.message || "Server bilan ulanishda xatolik"); } finally { setLoading(false); } };
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="hidden p-16 lg:flex lg:flex-col lg:justify-between"><div><div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">MUHAMMAD AL-XORAZMIY NOMIDAGI TATU</div><h1 className="mt-8 max-w-xl text-5xl font-semibold leading-tight">Smart Schedule Management System</h1><p className="mt-5 max-w-lg text-base text-slate-200">Fakultetlar, kafedralar, fanlar, ustozlar, binolar va auditoriyalarni hisobga olib avtomatik dars jadvali yaratish tizimi.</p></div><div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur"><p className="text-sm text-slate-200">Demo login</p><p className="mt-2 font-medium">Login: dilxushbek</p><p className="font-medium">Parol: 2003</p></div></div>
        <div className="flex items-center justify-center p-6 lg:p-12"><form onSubmit={handleSubmit} className="w-full max-w-md rounded-[28px] bg-white p-8 text-slate-900 shadow-soft"><div className="mb-8"><p className="text-sm font-medium uppercase tracking-[0.25em] text-brand-700">LMS Style Login</p><h2 className="mt-3 text-3xl font-semibold">Tizimga kirish</h2><p className="mt-2 text-sm text-slate-500">Dars jadvali boshqaruv paneliga kirish uchun login ma'lumotlarini kiriting.</p></div><label className="mb-4 block"><span className="mb-2 block text-sm font-medium">Login</span><div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3"><UserRound className="mr-3 h-5 w-5 text-slate-400" /><input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border-none outline-none" /></div></label><label className="mb-4 block"><span className="mb-2 block text-sm font-medium">Parol</span><div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3"><Lock className="mr-3 h-5 w-5 text-slate-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-none outline-none" /></div></label>{error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}<button className="w-full rounded-2xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-70" disabled={loading}>{loading ? "Kirilmoqda..." : "Kirish"}</button></form></div>
      </div>
    </div>
  );
}
