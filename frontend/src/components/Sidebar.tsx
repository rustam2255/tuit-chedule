import { Building2, CalendarRange, GraduationCap, LayoutDashboard, LibraryBig, LogOut, Menu, NotebookPen, School, Shapes, Users, Warehouse, X } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: CalendarRange, label: "Jadval", to: "/schedule" },
  { icon: Warehouse, label: "Binolar", to: "/buildings" },
  { icon: School, label: "Fakultetlar", to: "/faculties" },
  { icon: Shapes, label: "Kafedralar", to: "/departments" },
  { icon: LibraryBig, label: "Fanlar", to: "/subjects" },
  { icon: Users, label: "Ustozlar", to: "/teachers" },
  { icon: GraduationCap, label: "Guruhlar", to: "/groups" },
  { icon: Building2, label: "Xonalar", to: "/rooms" },
  { icon: NotebookPen, label: "Yuklamalar", to: "/loads" },
];

function SidebarContent({ close }: { close?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTitle = useMemo(() => items.find((item) => location.pathname.startsWith(item.to))?.label ?? "Dashboard", [location.pathname]);
  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
        
        <h2 className="mt-2 text-xl font-semibold">Smart Scheduler Pro</h2>
        
      </div>
      <div className="mt-6 rounded-3xl bg-white/10 p-4 text-sm text-slate-100">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Joriy bo‘lim</p>
        <p className="mt-2 text-lg font-semibold">{activeTitle}</p>
      </div>
      <nav className="mt-8 flex-1 space-y-2 overflow-y-auto pr-1">
        {items.map(({ icon: Icon, label, to }) => (
          <NavLink key={label} to={to} onClick={close} className={({ isActive }) => `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${isActive ? "bg-white text-brand-900 shadow-lg" : "bg-white/5 hover:bg-white/10"}`}>
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 hover:bg-white/15" onClick={() => { localStorage.removeItem("tatu_token"); localStorage.removeItem("tatu_user"); navigate("/login"); }}>
        <LogOut className="h-5 w-5" /> Chiqish
      </button>
    </>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-soft xl:hidden"><Menu className="h-5 w-5" /></button>
      <aside className="hidden h-screen w-72 flex-col border-r border-slate-200 bg-brand-900 p-5 text-white xl:sticky xl:top-0 xl:flex"><SidebarContent /></aside>
      {open ? <div className="fixed inset-0 z-50 xl:hidden"><div className="absolute inset-0 bg-slate-950/40" onClick={() => setOpen(false)} /><aside className="absolute left-0 top-0 flex h-screen w-[86%] max-w-xs flex-col bg-brand-900 p-5 text-white shadow-2xl"><div className="mb-4 flex justify-end"><button onClick={() => setOpen(false)} className="rounded-xl bg-white/10 p-2"><X className="h-5 w-5" /></button></div><SidebarContent close={() => setOpen(false)} /></aside></div> : null}
    </>
  );
}
