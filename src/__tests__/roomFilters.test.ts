import { describe, it, expect } from 'vitest';
import { filterRooms, getEquipmentOptions } from '../roomFilters';
import { SAMPLE_ROOMS } from '../data';
import type { Room } from '../types';

const rooms: Room[] = [
  { id: 'a', name: 'A', building: 'X', capacity: 40, equipment: ['Projector', 'Whiteboard'], blocked: false },
  { id: 'b', name: 'B', building: 'X', capacity: 20, equipment: ['Projector'], blocked: false },
  { id: 'c', name: 'C', building: 'X', capacity: 120, equipment: ['Projector', 'Whiteboard', 'Microphone'], blocked: true },
];

describe('filterRooms (F1 capacity)', () => {
  it('includes a room whose capacity exactly equals the minimum', () => {
    expect(filterRooms(rooms, { minCapacity: 40, equipment: [] }).map((r) => r.id)).toEqual(['a', 'c']);
  });

  it('excludes rooms whose capacity is below the minimum', () => {
    expect(filterRooms(rooms, { minCapacity: 41, equipment: [] }).map((r) => r.id)).toEqual(['c']);
  });

  it('returns an empty list when no room has enough capacity', () => {
    expect(filterRooms(rooms, { minCapacity: 500, equipment: [] })).toEqual([]);
  });

  it('returns every room when the minimum is zero and no equipment is required', () => {
    expect(filterRooms(rooms, { minCapacity: 0, equipment: [] })).toHaveLength(3);
  });
});

describe('filterRooms (F2 equipment)', () => {
  it('requires ALL selected equipment items, not any of them', () => {
    const ids = filterRooms(rooms, { minCapacity: 0, equipment: ['Projector', 'Whiteboard'] }).map((r) => r.id);
    expect(ids).toEqual(['a', 'c']);
  });

  it('excludes a room that is missing one of the selected items', () => {
    const ids = filterRooms(rooms, { minCapacity: 0, equipment: ['Microphone'] }).map((r) => r.id);
    expect(ids).toEqual(['c']);
  });

  it('combines capacity and equipment filters with AND semantics', () => {
    const ids = filterRooms(rooms, { minCapacity: 50, equipment: ['Projector', 'Whiteboard'] }).map((r) => r.id);
    expect(ids).toEqual(['c']);
  });

  it('does not mutate the input rooms array', () => {
    const snapshot = JSON.stringify(rooms);
    filterRooms(rooms, { minCapacity: 30, equipment: ['Projector'] });
    expect(JSON.stringify(rooms)).toBe(snapshot);
  });

  it('lists each equipment option once, sorted', () => {
    expect(getEquipmentOptions(rooms)).toEqual(['Microphone', 'Projector', 'Whiteboard']);
  });

  it('keeps the fixture rooms valid for filtering', () => {
    expect(SAMPLE_ROOMS.every((r) => r.equipment.length > 0)).toBe(true);
    expect(SAMPLE_ROOMS).toHaveLength(5);
  });
});
