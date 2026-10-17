import { useState, useMemo } from 'react';
import { Clock, Search, CalendarDays, Building2 } from 'lucide-react';
import type { Room, AvailabilityResult } from './types';
import { SAMPLE_ROOMS, SAMPLE_BOOKINGS, minutesToLabel } from './data';
import { checkAvailability } from './availability';
import RoomCard from './components/RoomCard';
import TimeSelector from './components/TimeSelector';
import ResultBanner from './components/ResultBanner';
import BookingSchedule from './components/BookingSchedule';

function App() {
  const [rooms] = useState<Room[]>(SAMPLE_ROOMS);
  const [bookings] = useState(SAMPLE_BOOKINGS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(600);  // 10:00
  const [endTime, setEndTime] = useState(660);      // 11:00
  const [currentTime, setCurrentTime] = useState(480); // 08:00
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId]
  );

  const roomBookings = useMemo(
    () => bookings.filter((b) => b.roomId === selectedRoomId),
    [bookings, selectedRoomId]
  );

  const handleCheck = () => {
    if (!selectedRoom) {
      setResult({ decision: 'unavailable', reasons: ['Please select a room first.'] });
      return;
    }
    const res = checkAvailability(selectedRoom, startTime, endTime, currentTime, bookings);
    setResult(res);
  };

  const duration = endTime - startTime;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white">
            <CalendarDays size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Smart Campus Room Checker</h1>
            <p className="text-sm text-slate-500">Check room availability before you book</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left — rooms + schedule */}
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-700">
                <Building2 size={18} className="text-teal-600" /> Select a Room
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    selected={selectedRoomId === room.id}
                    onSelect={() => setSelectedRoomId(room.id)}
                  />
                ))}
              </div>
            </section>

            {selectedRoom && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-700">
                  <Clock size={18} className="text-teal-600" /> Existing Bookings
                </h2>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <BookingSchedule bookings={roomBookings} roomName={selectedRoom.name} />
                </div>
              </section>
            )}
          </div>

          {/* Right — check panel */}
          <aside className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:self-start">
            <h2 className="text-lg font-semibold text-slate-700">Check Availability</h2>

            {/* Current time */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-600">Current Time (min)</label>
              <input
                type="number"
                min={0}
                max={1440}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-400">{minutesToLabel(currentTime)}</span>
            </div>

            <TimeSelector label="Start Time" value={startTime} onChange={setStartTime} />
            <TimeSelector label="End Time" value={endTime} onChange={setEndTime} />

            {/* Duration hint */}
            <div
              className={[
                'rounded-lg px-3 py-2 text-sm font-medium',
                duration > 120
                  ? 'bg-amber-50 text-amber-700'
                  : duration <= 0
                    ? 'bg-red-50 text-red-700'
                    : 'bg-slate-50 text-slate-600',
              ].join(' ')}
            >
              Duration: {duration > 0 ? `${duration} min` : 'Invalid'}
              {duration > 120 && ' (max 120 min)'}
            </div>

            <button
              onClick={handleCheck}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 font-medium text-white transition-colors hover:bg-teal-700"
            >
              <Search size={18} /> Check Availability
            </button>

            <ResultBanner result={result} />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
