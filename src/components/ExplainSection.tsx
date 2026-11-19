import { useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { AvailabilityResult, CheckInputs } from '../types';
import { explainSafely, EXPLAIN_FALLBACK_TEXT } from '../llm/explain';
import type { LlmAdapter } from '../llm/explain';
import { mockLlmAdapter } from '../llm/mockAdapter';

interface ExplainSectionProps {
  result: AvailabilityResult;
  roomName: string;
  inputs: CheckInputs;
  adapter?: LlmAdapter;
}

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'done'; text: string }
  | { kind: 'fallback' };

export default function ExplainSection({
  result,
  roomName,
  inputs,
  adapter = mockLlmAdapter,
}: ExplainSectionProps) {
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const requestSeq = useRef(0);

  const handleExplain = () => {
    const id = ++requestSeq.current;
    setPhase({ kind: 'loading' });

    explainSafely(adapter, {
      decision: result.decision,
      reasons: result.reasons,
      roomName,
      start: inputs.start,
      end: inputs.end,
    }).then((res) => {
      // Ignore if a newer request was started. When the inputs change, the
      // parent discards the verdict and unmounts this section, so a late
      // response from a discarded check can never render either way.
      if (id !== requestSeq.current) return;
      setPhase(
        res.text === EXPLAIN_FALLBACK_TEXT
          ? { kind: 'fallback' }
          : { kind: 'done', text: res.text }
      );
    });
  };

  let body;
  if (phase.kind === 'idle') {
    body = (
      <button
        type="button"
        onClick={handleExplain}
        className="mt-3 flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
      >
        <Sparkles size={14} /> Explain availability
      </button>
    );
  } else if (phase.kind === 'loading') {
    body = <p className="mt-3 text-sm text-slate-400">Explaining…</p>;
  } else {
    const text = phase.kind === 'done' ? phase.text : EXPLAIN_FALLBACK_TEXT;
    body = (
      <div className="mt-3 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          AI explanation (mock)
        </p>
        <p className="text-sm text-slate-600">{text}</p>
        <button
          type="button"
          onClick={handleExplain}
          className="text-xs text-slate-400 underline transition-colors hover:text-slate-600"
        >
          Explain again
        </button>
      </div>
    );
  }

  return <div aria-live="polite">{body}</div>;
}
