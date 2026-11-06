import { SearchX } from 'lucide-react';
import type { Room } from '../types';
import RoomCard from './RoomCard';

interface RoomGridProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelect: (id: string) => void;
}

export default function RoomGrid({ rooms, selectedRoomId, onSelect }: RoomGridProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <SearchX size={28} className="text-slate-400" />
        <p className="font-semibold text-slate-700">No rooms match these filters</p>
        <p className="text-sm text-slate-500">
          Try a lower minimum capacity or fewer required equipment items.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          selected={selectedRoomId === room.id}
          onSelect={() => onSelect(room.id)}
        />
      ))}
    </div>
  );
}
