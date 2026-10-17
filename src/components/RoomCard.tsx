import { Users, Ban, MapPin } from 'lucide-react';
import type { Room } from '../types';

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}

export default function RoomCard({ room, selected, onSelect }: RoomCardProps) {
  return (
    <button
      onClick={onSelect}
      className={[
        'flex flex-col gap-2 rounded-xl border p-4 text-left transition-all',
        selected
          ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/30'
          : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md',
        room.blocked ? 'opacity-60' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-800">{room.name}</span>
        {room.blocked ? (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            <Ban size={12} /> Blocked
          </span>
        ) : (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Open
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin size={12} /> {room.building}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} /> {room.capacity}
        </span>
      </div>
    </button>
  );
}
