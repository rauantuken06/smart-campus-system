import { describe, it, expect } from 'vitest';
import { checkAvailability, isSameCheck } from '../availability';
import { SAMPLE_ROOMS, SAMPLE_BOOKINGS } from '../data';
import type { Booking, CheckInputs } from '../types';

const CURRENT_TIME = 480;

describe('checkAvailability regressions (AC1, AC3, F3, F5)', () => {
  it('reports unavailable with a reason when no room is selected', () => {
    const result = checkAvailability(null, 600, 660, CURRENT_TIME, SAMPLE_BOOKINGS);
    expect(result.decision).toBe('unavailable');
    expect(result.reasons).toEqual(['Please select a room first.']);
  });

  it('never reports a blocked room as available across many valid intervals', () => {
    const blocked = SAMPLE_ROOMS.find((r) => r.blocked);
    expect(blocked).toBeDefined();
    for (let start = 481; start < 1380; start += 37) {
      for (const length of [15, 60, 120]) {
        const result = checkAvailability(blocked!, start, start + length, CURRENT_TIME, []);
        expect(result.decision).toBe('unavailable');
      }
    }
  });

  it('ignores bookings belonging to other rooms when only the selected room is passed', () => {
    const lab = SAMPLE_ROOMS.find((r) => r.id === 'r2')!;
    const labBookings = SAMPLE_BOOKINGS.filter((b) => b.roomId === 'r2');
    const otherRoomOnly: Booking[] = SAMPLE_BOOKINGS.filter((b) => b.roomId === 'r1');
    expect(checkAvailability(lab, 600, 660, CURRENT_TIME, labBookings).decision).toBe('unavailable');
    expect(checkAvailability(lab, 600, 660, CURRENT_TIME, otherRoomOnly).decision).toBe('available');
  });
});

describe('isSameCheck (F5 stale-result prevention)', () => {
  const base: CheckInputs = { roomId: 'r1', start: 600, end: 660, currentTime: CURRENT_TIME };

  it('treats identical inputs as the same check', () => {
    expect(isSameCheck(base, { ...base })).toBe(true);
  });

  it('detects a room switch', () => {
    expect(isSameCheck(base, { ...base, roomId: 'r2' })).toBe(false);
  });

  it('detects a deselected room', () => {
    expect(isSameCheck(base, { ...base, roomId: null })).toBe(false);
  });

  it('detects start, end, or current time changes', () => {
    expect(isSameCheck(base, { ...base, start: 605 })).toBe(false);
    expect(isSameCheck(base, { ...base, end: 670 })).toBe(false);
    expect(isSameCheck(base, { ...base, currentTime: 470 })).toBe(false);
  });
});
