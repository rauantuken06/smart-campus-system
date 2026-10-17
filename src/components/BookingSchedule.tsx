import type { Booking } from '../types';
import { minutesToLabel } from '../data';

interface BookingScheduleProps {
  bookings: Booking[];
  roomName: string;
}

export default function BookingSchedule({ bookings, roomName }: BookingScheduleProps) {
  if (bookings.length === 0) {
    return (
      <p className="py-3 text-center text-sm text-slate-400">
        No existing bookings for this room.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {bookings
        .sort((a, b) => a.start - b.start)
        .map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="font-medium text-slate-600">{roomName}</span>
            <span className="text-slate-500">
              {minutesToLabel(b.start)} – {minutesToLabel(b.end)}
            </span>
          </div>
        ))}
    </div>
  );
}
