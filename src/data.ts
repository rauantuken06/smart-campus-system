import type { Room, Booking } from './types';

export const SAMPLE_ROOMS: Room[] = [
  { id: 'r1', name: 'Lecture Hall A', building: 'Science Block', capacity: 120, blocked: false },
  { id: 'r2', name: 'Lab 201', building: 'Engineering Wing', capacity: 40, blocked: false },
  { id: 'r3', name: 'Conference Room B', building: 'Main Building', capacity: 20, blocked: true },
  { id: 'r4', name: 'Seminar Room 5', building: 'Library', capacity: 30, blocked: false },
  { id: 'r5', name: 'Auditorium C', building: 'Arts Centre', capacity: 300, blocked: false },
];

export const SAMPLE_BOOKINGS: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540, end: 600 },   // 09:00–10:00
  { id: 'b2', roomId: 'r1', start: 720, end: 780 },   // 12:00–13:00
  { id: 'b3', roomId: 'r2', start: 600, end: 660 },   // 10:00–11:00
  { id: 'b4', roomId: 'r2', start: 900, end: 960 },   // 15:00–16:00
  { id: 'b5', roomId: 'r4', start: 840, end: 900 },   // 14:00–15:00
  { id: 'b6', roomId: 'r5', start: 480, end: 540 },   // 08:00–09:00
];

export function minutesToLabel(m: number): string {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
