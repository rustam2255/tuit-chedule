type Entry = {
  id: string;
  subjectName: string;
  groupName: string;
  teacherName: string;
  roomName: string;
  timeslotLabel: string;
  lessonType: string;
};

export default function SchedulePreview({ entries }: { entries: Entry[] }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-slate-900">Yaratilgan jadval</h3>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{entries.length} ta dars</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-3 py-1 font-medium">Fan</th>
              <th className="px-3 py-1 font-medium">Guruh</th>
              <th className="px-3 py-1 font-medium">Ustoz</th>
              <th className="px-3 py-1 font-medium">Xona</th>
              <th className="px-3 py-1 font-medium">Vaqt</th>
              <th className="px-3 py-1 font-medium">Turi</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-slate-500">Hozircha jadval generatsiya qilinmagan.</td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="bg-slate-50 text-slate-800">
                  <td className="rounded-l-2xl px-4 py-3 font-medium">{entry.subjectName}</td>
                  <td className="px-4 py-3">{entry.groupName}</td>
                  <td className="px-4 py-3">{entry.teacherName}</td>
                  <td className="px-4 py-3">{entry.roomName}</td>
                  <td className="px-4 py-3">{entry.timeslotLabel}</td>
                  <td className="rounded-r-2xl px-4 py-3"><span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{entry.lessonType}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
