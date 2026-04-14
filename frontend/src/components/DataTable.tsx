import type { ReactNode } from "react";

export type Column<T> = {
  key: keyof T | string;
  title: string;
  render?: (item: T) => ReactNode;
};

export default function DataTable<T extends { id?: string }>({
  title,
  columns,
  data,
  emptyText = "Ma'lumot topilmadi",
}: {
  title: string;
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
}) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {data.length} ta
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              {columns.map((column) => (
                <th key={String(column.key)} className="px-3 py-1 font-medium">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={item.id ?? rowIndex} className="bg-slate-50 text-slate-800">
                  {columns.map((column, colIndex) => {
                    const value = column.render ? column.render(item) : String(item[column.key as keyof T] ?? "-");
                    const edgeClass = colIndex === 0 ? "rounded-l-2xl" : colIndex === columns.length - 1 ? "rounded-r-2xl" : "";
                    return (
                      <td key={String(column.key)} className={`${edgeClass} px-4 py-3 align-middle`}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
