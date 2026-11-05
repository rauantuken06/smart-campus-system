import { describe, it, expect } from 'vitest';
import { minutesToLabel } from '../time';

describe('minutesToLabel', () => {
  it('formats minutes from midnight as HH:MM with zero padding', () => {
    expect(minutesToLabel(0)).toBe('00:00');
    expect(minutesToLabel(5)).toBe('00:05');
    expect(minutesToLabel(540)).toBe('09:00');
    expect(minutesToLabel(615)).toBe('10:15');
  });

  it('formats the end of the day as 24:00', () => {
    expect(minutesToLabel(1440)).toBe('24:00');
  });
});
