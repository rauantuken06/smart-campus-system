/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import TimeSelector from '../components/TimeSelector';
import { minutesToLabel } from '../time';

afterEach(() => {
  cleanup();
});

/**
 * W2 reproduction tests — run against the UNFIXED component.
 *
 * Browser-reachable paths (primary reproduction):
 *  - Clearing the field sets value to '' → Number('') === 0 (not NaN).
 *  - Typing a negative or >1440 number: the HTML min/max attributes are
 *    advisory only; fireEvent.change delivers these values and the browser
 *    does too for typed/pasted input in most browsers.
 *
 * Artificial path (clearly separated, not a browser reproduction):
 *  - 'abc' via fireEvent.change: a real <input type="number"> filters
 *    non-numeric keystrokes, so this is injection, not user-reachable.
 */
describe('TimeSelector W2 reproduction (pre-fix baseline)', () => {
  it('empty field value coerces to 0, not NaN (browser-reachable)', () => {
    const seen: number[] = [];
    render(<TimeSelector label="Start Time" value={540} onChange={(v) => seen.push(v)} />);

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });

    expect(seen).toEqual([0]); // Number('') === 0 — the common clear-field path is safe.
  });

  it('negative value passes through unclamped (browser-reachable)', () => {
    const seen: number[] = [];
    render(<TimeSelector label="Start Time" value={540} onChange={(v) => seen.push(v)} />);

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '-5' } });

    expect(seen).toEqual([-5]); // Unclamped; reaches checkAvailability, which rejects it via AC1.
  });

  it('value above 1440 passes through unclamped (browser-reachable)', () => {
    const seen: number[] = [];
    render(<TimeSelector label="Start Time" value={540} onChange={(v) => seen.push(v)} />);

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '9999' } });

    expect(seen).toEqual([9999]); // Unclamped; AC1 rejects it, but the hint label shows 9999 min.
  });

  it('artificial NaN injection: jsdom sanitizes to 0, onChange never receives NaN', () => {
    const seen: number[] = [];
    render(<TimeSelector label="Start Time" value={540} onChange={(v) => seen.push(v)} />);

    // Artificial: jsdom enforces number-input validity — an invalid value is
    // stored as the empty string, so Number('') === 0. A real browser behaves
    // the same way. NaN is unreachable through DOM change events.
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: 'abc' } });

    expect(seen).toEqual([0]);
  });

  it('renders the per-input hint for an out-of-range value without crashing', () => {
    render(<TimeSelector label="Start Time" value={-5} onChange={() => {}} />);

    // minutesToLabel(-5) is "-1:-5" — odd-looking but rendered, no crash.
    expect(screen.getByText(minutesToLabel(-5))).toBeTruthy();
  });
});
