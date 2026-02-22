import React, { useState } from 'react';
import { submitQuiz } from '../utils/api';

const s = {
  question: { marginBottom: '1.5rem' },
  questionText: {
    color: 'var(--foreground)', fontSize: '0.875rem', fontWeight: 600,
    marginBottom: '0.65rem', lineHeight: 1.55,
  },
  // Base option style
  option: {
    display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
    padding: '0.55rem 0.75rem', borderRadius: '8px', marginBottom: '0.35rem',
    border: '1.5px solid var(--border)', cursor: 'pointer',
    fontSize: '0.85rem', color: 'var(--foreground)', background: 'var(--background)',
    transition: 'border-color 0.15s, background 0.15s',
    lineHeight: 1.4,
  },
  optionSelected: {
    borderColor: 'var(--primary)',
    background: 'var(--accent)',
    color: 'var(--accent-foreground)',
  },
  optionCorrect: {
    borderColor: 'var(--success)', background: 'var(--success-light)',
    color: 'var(--success-fg)', cursor: 'default',
  },
  optionWrong: {
    borderColor: 'var(--destructive)',
    background: 'hsl(0, 84%, 96%)', color: 'var(--destructive)',
    cursor: 'default',
  },
  optionDimmed: { opacity: 0.45, cursor: 'default' },

  // Result banners
  resultBanner: {
    borderRadius: '8px', padding: '0.7rem 1rem', marginBottom: '1rem',
    fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.4,
  },
  resultPass: {
    background: 'var(--success-light)', color: 'var(--success-fg)',
    border: '1px solid var(--success)',
  },
  resultFail: {
    background: 'hsl(0, 84%, 96%)', color: 'var(--destructive)',
    border: '1px solid var(--destructive)',
  },
  errorBanner: {
    background: 'hsl(0, 84%, 96%)', color: 'var(--destructive)',
    border: '1px solid var(--destructive)',
    borderRadius: '8px', padding: '0.7rem 1rem', marginBottom: '1rem', fontSize: '0.85rem',
  },

  // Explanation text shown after submit
  explanation: {
    marginTop: '0.35rem', fontSize: '0.78rem',
    color: 'var(--muted-foreground)', fontStyle: 'italic', lineHeight: 1.4,
  },

  submitBtn: {
    width: '100%', padding: '0.7rem', background: 'var(--primary)',
    color: 'var(--primary-foreground)', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', marginTop: '0.25rem',
    transition: 'background 0.15s',
  },
  retryBtn: {
    width: '100%', padding: '0.7rem', background: 'var(--muted)',
    color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', marginTop: '0.65rem',
  },
  alreadyPassed: {
    background: 'var(--success-light)', color: 'var(--success-fg)',
    borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.875rem',
    textAlign: 'center', fontWeight: 600, border: '1px solid var(--success)',
  },
  noQuiz: { color: 'var(--muted-foreground)', fontSize: '0.875rem' },
};

function optionStyle(base, selected, submitted, isCorrect, isChosen) {
  if (!submitted) return selected ? { ...base, ...s.optionSelected } : base;
  if (isCorrect)              return { ...base, ...s.optionCorrect };
  if (isChosen && !isCorrect) return { ...base, ...s.optionWrong };
  return { ...base, ...s.optionDimmed };
}

export default function QuizComponent({ courseId, weekId, questions, initialPassed, onQuizPassed }) {
  const [answers,    setAnswers]    = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const [result,     setResult]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  if (initialPassed) {
    return <div style={s.alreadyPassed}>✓ Quiz passed — week complete!</div>;
  }
  if (questions.length === 0) {
    return <p style={s.noQuiz}>No quiz for this week.</p>;
  }

  function handleSelect(questionId, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  async function handleSubmit() {
    if (!allAnswered) return;
    setSubmitting(true);
    setError('');
    try {
      const { data } = await submitQuiz(courseId, weekId, answers);
      setResult(data);
      setSubmitted(true);
      if (data.passed) onQuizPassed?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setSubmitting(false); }
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setError('');
  }

  return (
    <div>
      {/* Result banner */}
      {submitted && result && (
        <div style={{ ...s.resultBanner, ...(result.passed ? s.resultPass : s.resultFail) }}>
          {result.passed
            ? `✓ Passed! ${result.score}/${result.total} (${result.pct}%)`
            : `${result.score}/${result.total} correct (${result.pct}%) — need 70% to pass`}
        </div>
      )}
      {error && <div style={s.errorBanner}>{error}</div>}

      {/* Questions */}
      {questions.map((q, qi) => {
        const chosen       = answers[q.id];
        const correctIndex = result?.correctAnswers?.[q.id] ?? q.correctIndex;

        return (
          <div key={q.id} style={s.question}>
            <div style={s.questionText}>{qi + 1}. {q.text}</div>
            {q.options.map((option, idx) => {
              const isChosen  = chosen === idx;
              const isCorrect = submitted && correctIndex !== undefined && idx === correctIndex;
              return (
                <div
                  key={idx}
                  role="button"
                  tabIndex={submitted ? -1 : 0}
                  style={optionStyle(s.option, isChosen, submitted, isCorrect, isChosen)}
                  onClick={() => handleSelect(q.id, idx)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelect(q.id, idx)}
                >
                  <span style={{ fontWeight: 700, flexShrink: 0, color: 'inherit' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{option}</span>
                </div>
              );
            })}
            {submitted && q.explanation && (
              <div style={s.explanation}>{q.explanation}</div>
            )}
          </div>
        );
      })}

      {/* Actions */}
      {!submitted ? (
        <button
          style={{ ...s.submitBtn, opacity: allAnswered ? 1 : 0.5 }}
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
        >
          {submitting ? 'Submitting…' : 'Submit Quiz'}
        </button>
      ) : !result?.passed ? (
        <button style={s.retryBtn} onClick={handleRetry}>↺ Retry Quiz</button>
      ) : null}
    </div>
  );
}
