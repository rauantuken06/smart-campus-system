import { CheckCircle2, XCircle } from 'lucide-react';
import type { AvailabilityResult } from '../types';

interface ResultBannerProps {
  result: AvailabilityResult | null;
}

export default function ResultBanner({ result }: ResultBannerProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
        Select a room and interval, then press Check Availability.
      </div>
    );
  }

  const isAvailable = result.decision === 'available';

  return (
    <div
      className={[
        'rounded-xl border p-6',
        isAvailable
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-red-200 bg-red-50',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        {isAvailable ? (
          <CheckCircle2 className="text-emerald-600" size={28} />
        ) : (
          <XCircle className="text-red-600" size={28} />
        )}
        <div>
          <p
            className={[
              'text-lg font-bold',
              isAvailable ? 'text-emerald-700' : 'text-red-700',
            ].join(' ')}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </p>
          <ul className="mt-1 space-y-0.5">
            {result.reasons.map((r, i) => (
              <li
                key={i}
                className={[
                  'text-sm',
                  isAvailable ? 'text-emerald-600' : 'text-red-600',
                ].join(' ')}
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
