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
