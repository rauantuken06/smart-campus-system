import type { ExplainRequest, ExplainResult, LlmAdapter } from './explain';

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/**
 * Deterministic, offline adapter. Templates the checker's reasons into at
 * most 2 sentences — never invents, omits, or contradicts a reason.
 */
export const mockLlmAdapter: LlmAdapter = {
  async explain(req: ExplainRequest): Promise<ExplainResult> {
    const window = `${formatTime(req.start)}–${formatTime(req.end)}`;

    if (req.decision === 'available') {
      const text =
        `Good news: ${req.roomName} is free from ${window}. ` +
        'No existing booking or rule conflicts with your request.';
      return { text, source: 'mock-llm' };
    }

    const reasonList = req.reasons.join(' ');
    const text =
      `${req.roomName} cannot be booked from ${window}. ` +
      `Why: ${reasonList}`;
    return { text, source: 'mock-llm' };
  },
};
