
/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App integration tests', () => {
  it('checks availability through the UI', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /Lecture Hall A/i })
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Check Availability/i })
    );

    expect(screen.getByText('Available')).toBeTruthy();
  });

  it('hides a stale result when start time changes', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /Lecture Hall A/i })
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Check Availability/i })
    );

    expect(screen.getByText('Available')).toBeTruthy();

    const inputs = screen.getAllByRole('spinbutton');

    // Input order: current time, start time, end time
    fireEvent.change(inputs[1], {
      target: { value: '610' },
    });

    expect(screen.queryByText('Available')).toBeNull();
    expect(
      screen.getByText(/Select a room and interval/i)
    ).toBeTruthy();
  });
});
