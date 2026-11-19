export interface ExplainRequest {
  decision: 'available' | 'unavailable';
  reasons: string[];
  roomName: string;
  start: number;
  end: number;
}

export interface ExplainResult {
  text: string;
  source: 'mock-llm';
}

export interface LlmAdapter {
  explain(req: ExplainRequest): Promise<ExplainResult>;
}

export const EXPLAIN_TIMEOUT_MS = 2000;

export const EXPLAIN_FALLBACK_TEXT = 'Explanation temporarily unavailable.';

function isExplainResult(value: unknown): value is ExplainResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ExplainResult).text === 'string' &&
    (value as ExplainResult).text.length > 0 &&
    (value as ExplainResult).source === 'mock-llm'
  );
}

/**
 * Runs the adapter and normalizes every failure mode — rejection, timeout,
 * or malformed output — into the safe fallback text. Never throws.
 */
export async function explainSafely(
  adapter: LlmAdapter,
  req: ExplainRequest
): Promise<ExplainResult> {
  try {
    const result = await Promise.race([
      adapter.explain(req),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), EXPLAIN_TIMEOUT_MS)
      ),
    ]);
    if (!isExplainResult(result)) {
      return { text: EXPLAIN_FALLBACK_TEXT, source: 'mock-llm' };
    }
    return result;
  } catch {
    return { text: EXPLAIN_FALLBACK_TEXT, source: 'mock-llm' };
  }
}
