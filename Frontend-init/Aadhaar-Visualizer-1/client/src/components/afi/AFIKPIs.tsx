import { AFIRecord } from "./afi.types";

export default function AFIKPIs({ data }: { data: AFIRecord[] }) {
  const avg = (key: keyof AFIRecord) =>
    (data.reduce((s, d) => s + (d[key] as number), 0) / data.length).toFixed(1);

  const cards = [
    { label: "Enrollment Friction (EFI)", value: avg("EFI") },
    { label: "Biometric Friction (BFI)", value: avg("BFI") },
    { label: "Demographic Friction (DFI)", value: avg("DFI") },
    { label: "Overall AFI", value: avg("AFI") }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map(c => (
        <div
          key={c.label}
          className="rounded-xl bg-white shadow p-4 border"
        >
          <p className="text-sm text-gray-500">{c.label}</p>
          <p className="text-2xl font-bold">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
