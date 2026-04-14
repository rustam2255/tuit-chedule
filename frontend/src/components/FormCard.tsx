import type { ReactNode } from "react";

export default function FormCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-soft">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}
