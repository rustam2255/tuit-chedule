import { CalendarDays, DatabaseZap, LayoutGrid, Warehouse } from "lucide-react";
import { useLocation } from "react-router-dom";

const titleMap: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dars jadvali boshqaruvi", subtitle: "Firestore bilan ishlovchi TATU avtomatlashtirilgan jadval paneli" },
  "/schedule": { title: "Avtomatik jadval generatsiyasi", subtitle: "Binolar, xonalar, ustozlar va guruhlar asosida konfliktsiz jadval" },
  "/buildings": { title: "Binolar", subtitle: "Universitet binolari va ularning parametrlarini boshqarish" },
  "/faculties": { title: "Fakultetlar", subtitle: "Yangi fakultetlarni qo‘shish va ro‘yxatni yuritish" },
  "/departments": { title: "Kafedralar", subtitle: "Har bir fakultetga bog‘langan kafedralarni boshqarish" },
  "/subjects": { title: "Fanlar", subtitle: "Kafedra bo‘yicha fanlar bazasini yuritish" },
  "/teachers": { title: "Ustozlar", subtitle: "O‘qituvchilar va ularning band vaqtlarini boshqarish" },
  "/groups": { title: "Guruhlar", subtitle: "Talabalar soni va kunlik limit bilan guruhlarni kiritish" },
  "/rooms": { title: "Xonalar", subtitle: "Bino, qavat, sig‘im va xona turiga qarab auditoriyalarni boshqarish" },
  "/loads": { title: "Yuklamalar", subtitle: "Fan, guruh, ustoz va afzal bino bilan yuklama yaratish" },
};

export default function Header() {
  const user = JSON.parse(localStorage.getItem("tatu_user") ?? "{}");
  const location = useLocation();
  const content = titleMap[location.pathname] ?? titleMap["/dashboard"];
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-white px-5 py-5 shadow-soft md:px-6">
      <div className="pl-12 xl:pl-0">
        <p className="text-sm text-slate-500">{content.subtitle}</p>
        <h1 className="text-2xl font-semibold text-slate-900">{content.title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
       
       
        <div className="hidden rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 lg:block"><div className="flex items-center gap-2"><Warehouse className="h-4 w-4" /> Bino + xona modeli</div></div>
        <div className="hidden rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 lg:block"><div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Haftalik rejalashtirish</div></div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right"><p className="text-sm font-semibold text-slate-900">{user.fullName ?? "Admin"}</p><p className="text-xs uppercase text-slate-500">{user.role ?? "admin"}</p></div>
      </div>
    </header>
  );
}
