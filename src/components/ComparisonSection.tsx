import { useState } from 'react';
import { GitCompareArrows, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { ComparisonResult } from '../comparison';
import { COMPARISON_CURRENT_TIME, checkComparison } from '../comparison';
import { SAMPLE_BOOKINGS } from '../data';

const RESULT_STYLES: Record<string, string> = {
  AVAILABLE: 'border-green-200 bg-green-50',
  OVERLAP: 'bg-red-50 border-red-200',
  BLOCKED: 'bg-red-50 border-red-200',
};

export default function ComparisonSection() {
  const [startInput, setStartInput] = useState('630');
  const [durationInput, setDurationInput] = useState('60');
  const [blocked, setBlocked] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const duration = Number(durationInput);
  const endTime = Number.isInteger(duration) && duration > 0 ? Number(startInput) + duration : null;

  const handleCheck = () =>
    setResult(checkComparison(startInput, durationInput, blocked, SAMPLE_BOOKINGS, COMPARISON_CURRENT_TIME));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-700">
        <GitCompareArrows size={18} className="text-teal-600" /> Comparison Mode
      </h2>
      <p className="mb-3 text-sm text-slate-500">
        Lecture Hall A &middot; current time 08:00 &middot; existing bookings 09:00&ndash;10:00 and 12:00&ndash;13:00
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-600">
          Start time (minutes from midnight)
          <input
            type="number"
            min={0}
            max={1439}
            value={startInput}
            onChange={(e) => setStartInput(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-teal-500 focus:outline-none"
          />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Duration (minutes)
          <input
            type="number"
            min={1}
            max={120}
            value={durationInput}
            onChange={(e) => setDurationInput(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-teal-500 focus:outline-none"
          />
        </label>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
        <input
          type="checkbox"
          checked={blocked}
          onChange={(e) => setBlocked(e.target.checked)}
          className="h-4 w-4 accent-teal-600"
        />
        Room is blocked
      </label>

      <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
        End time: {endTime !== null ? `${endTime} min` : '—'}
      </p>

      <button
        onClick={handleCheck}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 font-medium text-white transition-colors hover:bg-teal-700"
      >
        <ShieldCheck size={18} /> Run Comparison Check
      </button>

      {result && (
        <div
          className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
            RESULT_STYLES[result.reasonCode] ?? 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <ShieldAlert size={16} />
            {result.available ? 'Available' : 'Unavailable'} &middot; {result.reasonCode}
          </div>
          <p className="mt-1 text-slate-600">{result.message}</p>
        </div>
      )}
    </section>
  );
}
