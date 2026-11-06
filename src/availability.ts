import type { Room, Booking, AvailabilityResult, CheckInputs } from './types';
import { DAY_END_MINUTES, MAX_BOOKING_MINUTES } from './constants';

/**
 * Checks whether a candidate interval can be booked for the given room.
 *
 * AC1: Accept only when 0 ≤ start < end ≤ 1440 and start ≥ currentTime.
 * AC2: Reject if the booking is longer than 120 minutes.
 * AC3: Reject if the room is blocked.
 * AC4: Reject if the interval overlaps an existing booking (touching endpoints allowed).
 */
export function checkAvailability(
  room: Room | null,
  start: number,
  end: number,
  currentTime: number,
  bookings: Booking[]
): AvailabilityResult {
  if (!room) {
    return { decision: 'unavailable', reasons: ['Please select a room first.'] };
  }

  const reasons: string[] = [];

  // AC1 — interval validity
  if (start < 0 || end > DAY_END_MINUTES || start >= end) {
    reasons.push(`Interval must satisfy 0 ≤ start < end ≤ ${DAY_END_MINUTES} (minutes of day).`);
  }
  if (start <= currentTime) {
    reasons.push(`Start time must be strictly after the current time (${currentTime} min).`);
  }

  // AC2 — max 120-minute booking
  if (end - start > MAX_BOOKING_MINUTES) {
    reasons.push(`Bookings cannot be longer than ${MAX_BOOKING_MINUTES} minutes.`);
  }

  // AC3 — blocked room
  if (room.blocked) {
    reasons.push('This room is currently blocked and cannot be booked.');
  }

  // AC4 — overlap check (touching endpoints allowed)
  const overlapping = bookings.filter(
    (b) =>
      b.roomId === room.id &&
      b.start < end && // existing start before candidate end
      start < b.end     // candidate start before existing end
  );
  if (overlapping.length > 0) {
    reasons.push('The interval overlaps an existing booking.');
  }

  if (reasons.length > 0) {
    return { decision: 'unavailable', reasons };
  }
  return { decision: 'available', reasons: ['This room is available for the selected interval.'] };
}

export function isSameCheck(a: CheckInputs, b: CheckInputs): boolean {
  return (
    a.roomId === b.roomId &&
    a.start === b.start &&
    a.end === b.end &&
    a.currentTime === b.currentTime
  );
}
