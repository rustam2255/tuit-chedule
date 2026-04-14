export default function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100">
      O‘chirish
    </button>
  );
}
