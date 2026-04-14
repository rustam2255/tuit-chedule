import type { LucideIcon } from "lucide-react";

export default function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number | string }) {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-soft">
      <div className="mb-4 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
