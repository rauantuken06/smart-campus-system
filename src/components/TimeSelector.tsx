interface TimeSelectorProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

/**
 * A numeric input that lets the user pick a time in 1-minute steps (0–1440).
 * Stores minutes-from-midnight internally.
 */
export default function TimeSelector({ label, value, onChange }: TimeSelectorProps) {
  const toLabel = (m: number) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <input
        type="number"
        min={0}
        max={1440}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
      <span className="text-xs text-slate-400">{toLabel(value)}</span>
    </div>
  );
}
