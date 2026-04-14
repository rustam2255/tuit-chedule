import type { SelectHTMLAttributes } from "react";

export function InputField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 ${props.className ?? ""}`} />;
}

export function SelectField({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 ${props.className ?? ""}`}>{children}</select>;
}

export function Label({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{title}</span>
      {children}
    </label>
  );
}
