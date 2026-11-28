import { describe, it, expect } from 'vitest';
import { checkComparison } from '../comparison';
import { SAMPLE_BOOKINGS } from '../data';

describe('Comparison Mode (Practice #12)', () => {
  it('T1: start=630, duration=60, not blocked → AVAILABLE', () => {
    const result = checkComparison('630', '60', false, SAMPLE_BOOKINGS);
    expect(result.available).toBe(true);
    expect(result.reasonCode).toBe('AVAILABLE');
    expect(result.message).toBeTruthy();
  });

  it('T2: start=570, duration=60, not blocked → OVERLAP', () => {
    const result = checkComparison('570', '60', false, SAMPLE_BOOKINGS);
    expect(result.available).toBe(false);
    expect(result.reasonCode).toBe('OVERLAP');
    expect(result.message).toBeTruthy();
  });

  it('T3: start=630, duration=60, blocked → BLOCKED', () => {
    const result = checkComparison('630', '60', true, SAMPLE_BOOKINGS);
    expect(result.available).toBe(false);
    expect(result.reasonCode).toBe('BLOCKED');
    expect(result.message).toBeTruthy();
  });

  it('T4: start=630, duration=0 → INVALID_DURATION', () => {
    const result = checkComparison('630', '0', false, SAMPLE_BOOKINGS);
    expect(result.available).toBe(false);
    expect(result.reasonCode).toBe('INVALID_DURATION');
  });

  it('T5: start=630, duration=121 → INVALID_DURATION', () => {
    const result = checkComparison('630', '121', false, SAMPLE_BOOKINGS);
    expect(result.available).toBe(false);
    expect(result.reasonCode).toBe('INVALID_DURATION');
  });

  it('T6: start=450, duration=30 → INVALID_START', () => {
    const result = checkComparison('450', '30', false, SAMPLE_BOOKINGS);
    expect(result.available).toBe(false);
    expect(result.reasonCode).toBe('INVALID_START');
  });

  it('T7: start=600, duration=120, not blocked → AVAILABLE (touching endpoints)', () => {
    const result = checkComparison('600', '120', false, SAMPLE_BOOKINGS);
    expect(result.available).toBe(true);
    expect(result.reasonCode).toBe('AVAILABLE');
  });

  it('T9: empty start input, duration=60, currentTime=480 → INVALID_INTERVAL', () => {
    const result = checkComparison('', '60', false, SAMPLE_BOOKINGS, 480);
    expect(result.available).toBe(false);
    expect(result.reasonCode).toBe('INVALID_INTERVAL');
  });

  it('T8: bookings array is never mutated by available or unavailable checks', () => {
    const snapshot = SAMPLE_BOOKINGS.map((b) => ({ ...b }));
    checkComparison('630', '60', false, SAMPLE_BOOKINGS);
    checkComparison('570', '60', false, SAMPLE_BOOKINGS);
    checkComparison('630', '60', true, SAMPLE_BOOKINGS);
    expect(SAMPLE_BOOKINGS).toEqual(snapshot);
  });
});
