import type { Booking, Room } from './types';
import { checkAvailability } from './availability';
import { BLOCKED_MESSAGE, DAY_END_MINUTES, MAX_BOOKING_MINUTES, OVERLAP_MESSAGE } from './constants';
import { SAMPLE_ROOMS } from './data';

export const COMPARISON_ROOM_ID = 'r1';
export const COMPARISON_CURRENT_TIME = 480;

export type ReasonCode =
  | 'AVAILABLE'
  | 'INVALID_START'
  | 'INVALID_DURATION'
  | 'INVALID_INTERVAL'
  | 'BLOCKED'
  | 'OVERLAP';

export interface ComparisonResult {
  available: boolean;
  reasonCode: ReasonCode;
  message: string;
}

/** Returns the integer value of the input, or null when empty, non-numeric, or non-integer. */
export function parseIntegerInput(value: string | number): number | null {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : null;
  }
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) ? parsed : null;
}

export function checkComparison(
  startInput: string | number,
  durationInput: string | number,
  blocked: boolean,
  bookings: Booking[],
  currentTime: number = COMPARISON_CURRENT_TIME
): ComparisonResult {
  const duration = parseIntegerInput(durationInput);
  if (duration === null || duration <= 0 || duration > MAX_BOOKING_MINUTES) {
    return {
      available: false,
      reasonCode: 'INVALID_DURATION',
      message: `Duration must be a whole number of minutes between 1 and ${MAX_BOOKING_MINUTES}.`,
    };
  }

  const start = parseIntegerInput(startInput);
  if (
    start === null ||
    start < 0 ||
    start >= DAY_END_MINUTES ||
    start + duration > DAY_END_MINUTES
  ) {
    return {
      available: false,
      reasonCode: 'INVALID_INTERVAL',
      message: `Start must be a whole number with 0 ≤ start and start + duration ≤ ${DAY_END_MINUTES} (minutes of day).`,
    };
  }

  if (start <= currentTime) {
    return {
      available: false,
      reasonCode: 'INVALID_START',
      message: `Start time must be strictly after the current time (${currentTime} min).`,
    };
  }

  const baseRoom = SAMPLE_ROOMS.find((r) => r.id === COMPARISON_ROOM_ID) ?? null;
  const room: Room | null = baseRoom ? { ...baseRoom, blocked } : null;
  const end = start + duration;

  const engineResult = checkAvailability(room, start, end, currentTime, bookings);
  if (engineResult.decision === 'available') {
    return {
      available: true,
      reasonCode: 'AVAILABLE',
      message: engineResult.reasons[0] ?? 'This room is available for the selected interval.',
    };
  }

  if (engineResult.reasons.some((r) => r === BLOCKED_MESSAGE)) {
    return {
      available: false,
      reasonCode: 'BLOCKED',
      message: 'This room is currently blocked and cannot be booked.',
    };
  }
  if (engineResult.reasons.some((r) => r === OVERLAP_MESSAGE)) {
    return {
      available: false,
      reasonCode: 'OVERLAP',
      message: 'The interval overlaps an existing booking.',
    };
  }
  return {
    available: false,
    reasonCode: 'INVALID_INTERVAL',
    message: engineResult.reasons.join(' '),
  };
}
