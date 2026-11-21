import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import BookingSchedule from '../components/BookingSchedule';
import type { Booking } from '../types';

describe('BookingSchedule', () => {
  it('lists bookings in start-time order without reordering the input array', () => {
    const bookings: Booking[] = [
      { id: 'late', roomId: 'r1', start: 720, end: 780 },
      { id: 'early', roomId: 'r1', start: 540, end: 600 },
    ];
    const snapshot = bookings.map((b) => b.id);

    const html = renderToStaticMarkup(
      <BookingSchedule bookings={bookings} roomName="Lab" />
    );

    expect(html.indexOf('09:00')).toBeLessThan(html.indexOf('12:00'));
    expect(bookings.map((b) => b.id)).toEqual(snapshot);
  });

  it('shows the empty-state message and no booking rows for an empty schedule', () => {
    const html = renderToStaticMarkup(
      <BookingSchedule bookings={[]} roomName="Lab" />
    );

    expect(html).toContain('No existing bookings for this room.');
    expect(html).not.toContain('Lab');
    expect(html).not.toContain(':');
  });
});
