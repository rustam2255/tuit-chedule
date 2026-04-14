export default function SectionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">{children}</div>;
}
