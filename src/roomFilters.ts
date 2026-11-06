import type { Room } from './types';

export interface RoomFilters {
  minCapacity: number;
  equipment: string[];
}

export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= filters.minCapacity &&
      filters.equipment.every((item) => room.equipment.includes(item))
  );
}

export function getEquipmentOptions(rooms: Room[]): string[] {
  return [...new Set(rooms.flatMap((room) => room.equipment))].sort();
}
