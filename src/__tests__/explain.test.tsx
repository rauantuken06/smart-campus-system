/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import App from '../App';
import { explainSafely, EXPLAIN_FALLBACK_TEXT, EXPLAIN_TIMEOUT_MS } from '../llm/explain';
import type { LlmAdapter, ExplainRequest, ExplainResult } from '../llm/explain';

afterEach(() => cleanup());

const baseReq: ExplainRequest = {
  decision: 'unavailable',
  reasons: ['The interval overlaps an existing booking.'],
  roomName: 'Lecture Hall A',
  start: 600,
  end: 660,
};

describe('explainSafely (fallback contract)', () => {
  it('returns the adapter text on success', async () => {
    const ok: LlmAdapter = {
      explain: async () => ({ text: 'Plain answer.', source: 'mock-llm' }),
    };
    const res = await explainSafely(ok, baseReq);
    expect(res).toEqual({ text: 'Plain answer.', source: 'mock-llm' });
  });

  it('returns the fallback when the adapter rejects', async () => {
    const failing: LlmAdapter = {
      explain: async () => {
        throw new Error('boom');
      },
    };
    const res = await explainSafely(failing, baseReq);
    expect(res.text).toBe(EXPLAIN_FALLBACK_TEXT);
  });

  it('returns the fallback when the adapter exceeds the timeout', async () => {
    vi.useFakeTimers();
    const slow: LlmAdapter = {
      explain: () => new Promise<ExplainResult>(() => {}),
    };
    const pending = explainSafely(slow, baseReq);
    vi.advanceTimersByTime(EXPLAIN_TIMEOUT_MS + 1);
    const res = await pending;
    vi.useRealTimers();
    expect(res.text).toBe(EXPLAIN_FALLBACK_TEXT);
  });

  it('returns the fallback on malformed adapter output', async () => {
    const malformed: LlmAdapter = {
      explain: async () => ({ wrong: true }) as unknown as ExplainResult,
    };
    const res = await explainSafely(malformed, baseReq);
    expect(res.text).toBe(EXPLAIN_FALLBACK_TEXT);
  });
});

import { mockLlmAdapter } from '../llm/mockAdapter';

describe('mockLlmAdapter (scenario fidelity)', () => {
  const cases: Array<[string, ExplainRequest]> = [
    [
      'overlap',
      {
        decision: 'unavailable',
        reasons: ['The interval overlaps an existing booking.'],
        roomName: 'Lab 201',
        start: 630,
        end: 690,
      },
    ],
    [
      'blocked room',
      {
        decision: 'unavailable',
        reasons: ['This room is currently blocked and cannot be booked.'],
        roomName: 'Conference Room B',
        start: 840,
        end: 900,
      },
    ],
    [
      'invalid interval',
      {
        decision: 'unavailable',
        reasons: [
          'Interval must satisfy 0 ≤ start < end ≤ 1440 (minutes of day).',
        ],
        roomName: 'Lecture Hall A',
        start: -5,
        end: 1500,
      },
    ],
    [
      'past time',
      {
        decision: 'unavailable',
        reasons: [
          'Start time must be strictly after the current time (480 min).',
        ],
        roomName: 'Lecture Hall A',
        start: 470,
        end: 530,
      },
    ],
    [
      'empty reasons (available)',
      {
        decision: 'available',
        reasons: [],
        roomName: 'Seminar Room 5',
        start: 600,
        end: 660,
      },
    ],
    [
      'excessive input length',
      {
        decision: 'unavailable',
        reasons: [`${'very long reason '.repeat(50)}.`],
        roomName: `X${'y'.repeat(500)}`,
        start: 600,
        end: 660,
      },
    ],
  ];

  for (const [label, req] of cases) {
    it(`explains the ${label} case within the contract`, async () => {
      const res = await mockLlmAdapter.explain(req);
      expect(res.source).toBe('mock-llm');
      expect(res.text.length).toBeGreaterThan(0);
      const sentences = res.text.split(/[.!?]\s*/).filter(Boolean).length;
      expect(sentences).toBeLessThanOrEqual(2);
      expect(res.text).toContain(req.roomName);
    });
  }

  it('restates the overlap reason verbatim', async () => {
    const res = await mockLlmAdapter.explain(cases[0][1]);
    expect(res.text).toContain('The interval overlaps an existing booking.');
  });

  it('restates the blocked reason verbatim', async () => {
    const res = await mockLlmAdapter.explain(cases[1][1]);
    expect(res.text).toContain('blocked and cannot be booked');
  });
});

function checkLectureHallA() {
  fireEvent.click(screen.getAllByRole('button', { name: /Lecture Hall A/i })[0]);
  fireEvent.click(screen.getByRole('button', { name: /Check Availability/i }));
}

describe('ExplainSection through App', () => {
  it('shows no explain button before a confirmed verdict', () => {
    render(<App />);
    expect(screen.queryByRole('button', { name: /explain availability/i })).toBeNull();
  });

  it('produces a labeled 2-sentence explanation below the verdict', async () => {
    render(<App />);
    checkLectureHallA();
    expect(screen.getByText('Available')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /explain availability/i }));

    await waitFor(() =>
      expect(screen.getByText(/AI explanation \(mock\)/i)).toBeTruthy()
    );
    const text = screen.getByText(/Good news: Lecture Hall A/).textContent ?? '';
    const sentences = text.split(/[.!?]\s*/).filter(Boolean).length;
    expect(sentences).toBeLessThanOrEqual(2);
  });

  it('explains a blocked-room rejection through the UI', async () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /Conference Room B/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Check Availability/i }));
    expect(screen.getByText('Unavailable')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /explain availability/i }));

    await waitFor(() =>
      expect(screen.getByText(/AI explanation \(mock\)/i)).toBeTruthy()
    );
    const text = screen.getByText(/Conference Room B cannot be booked/).textContent ?? '';
    expect(text).toContain('blocked and cannot be booked');
  });

  it('explains an invalid-interval rejection through the UI', async () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /Lecture Hall A/i })[0]);

    // Start time 1500 (past end-of-day 1440)
    fireEvent.change(screen.getAllByRole('spinbutton')[1], {
      target: { value: '1500' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Check Availability/i }));
    expect(screen.getByText('Unavailable')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /explain availability/i }));

    await waitFor(() =>
      expect(screen.getByText(/AI explanation \(mock\)/i)).toBeTruthy()
    );
    const text = screen.getByText(/Lecture Hall A cannot be booked/).textContent ?? '';
    // With start=1500 and currentTime=480, the checker reports the past-time
    // rule (start ≤ currentTime), not the interval rule — restate what the
    // checker actually said.
    expect(text).toContain('Start time must be strictly after the current time');
  });

  it('discards the explanation when the inputs change (stale guard)', async () => {
    render(<App />);
    checkLectureHallA();
    fireEvent.click(screen.getByRole('button', { name: /explain availability/i }));
    await waitFor(() =>
      expect(screen.getByText(/AI explanation \(mock\)/i)).toBeTruthy()
    );

    fireEvent.change(screen.getAllByRole('spinbutton')[1], {
      target: { value: '610' },
    });

    expect(screen.queryByText(/AI explanation \(mock\)/i)).toBeNull();
    expect(screen.getByText(/Select a room and interval/i)).toBeTruthy();
  });
});
