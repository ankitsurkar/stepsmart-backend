import React, { useState } from 'react';
import { submitQuiz } from '../utils/api';

const s = {
  question: { marginBottom: '1.5rem' },
  questionText: { color: '#e5e7eb', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.5 },
  option: {
    display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
    padding: '0.6rem 0.75rem', borderRadius: '8px', marginBottom: '0.4rem',
    border: '1.5px solid #2d2d4e', cursor: 'pointer',
    fontSize: '0.875rem', color: '#d1d5db', background: '#13131f',
    transition: 'border-color 0.15s, background 0.15s',
  },
  optionSelected: { borderColor: '#4f46e5', background: '#1e1b4b' },
  optionCorrect: { borderColor: '#10b981', background: '#064e3b', color: '#6ee7b7', cursor: 'default' },
  optionWrong: { borderColor: '#ef4444', background: '#450a0a', color: '#fca5a5', cursor: 'default' },
  optionUnchanged: { opacity: 0.5, cursor: 'default' },
  submitBtn: {
    width: '100%', padding: '0.75rem', background: '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
    fontSize: '0.9rem', marginTop: '0.5rem',
  },
  retryBtn: {
    width: '100%', padding: '0.75rem', background: '#374151', color: '#d1d5db',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
    fontSize: '0.9rem', marginTop: '0.75rem',
  },
  result: { borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' },
  resultPass: { background: '#064e3b', color: '#6ee7b7', border: '1px solid #10b981' },
  resultFail: { background: '#450a0a', color: '#fca5a5', border: '1px solid #ef4444' },
  explanation: { marginTop: '0.4rem', fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' },
  alreadyPassed: {
    background: '#064e3b', color: '#6ee7b7', borderRadius: '8px',
    padding: '0.75rem 1rem', fontSize: '0.875rem', textAlign: 'center',
  },
};

function getOptionStyle(base, selected, submitted, isCorrect, isChosen) {
  if (!submitted) {
    return selected ? { ...base, ...s.optionSelected } : base;
  }
  // After submission: show correct/wrong/unchanged
  if (isCorrect) return { ...base, ...s.optionCorrect };
  if (isChosen && !isCorrect) return { ...base, ...s.optionWrong };
  return { ...base, ...s.optionUnchanged };
}

export default function QuizComponent({ courseId, weekId, questions, initialPassed, onQuizPassed }) {
  const [answers, setAnswers] = useState({});     // { [questionId]: optionIndex }
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);     // { passed, score, total, pct, answers }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If the student already passed in a previous session, show a completion message immediately.
  if (initialPassed) {
    return <div style={s.alreadyPassed}>Quiz passed — week complete!</div>;
  }

  function handleSelect(questionId, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  async function handleSubmit() {
    if (!allAnswered) return;
    setSubmitting(true);
    setError('');
    try {
      const { data } = await submitQuiz(courseId, weekId, answers);
      setResult(data);
      setSubmitted(true);
      if (data.passed && onQuizPassed) onQuizPassed();
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setError('');
  }

  if (questions.length === 0) {
    return <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No quiz for this week.</p>;
  }

  return (
    <div>
      {submitted && result && (
        <div style={{ ...s.result, ...(result.passed ? s.resultPass : s.resultFail) }}>
          {result.passed
            ? `Passed! ${result.score}/${result.total} correct (${result.pct}%)`
            : `${result.score}/${result.total} correct (${result.pct}%) — need 70% to pass`}
        </div>
      )}

      {error && (
        <div style={{ ...s.result, background: '#450a0a', color: '#fca5a5', border: '1px solid #ef4444' }}>
          {error}
        </div>
      )}

      {questions.map((q, qi) => {
        const chosen = answers[q.id];
        // correctIndex is only present in the response if the student already passed
        // or if this is an admin view. For students during live quiz it is undefined.
        const correctIndex = result?.correctAnswers?.[q.id] ?? q.correctIndex;

        return (
          <div key={q.id} style={s.question}>
            <div style={s.questionText}>{qi + 1}. {q.text}</div>
            {q.options.map((option, idx) => {
              const isChosen = chosen === idx;
              const isCorrect = submitted && correctIndex !== undefined && idx === correctIndex;
              const style = getOptionStyle(s.option, isChosen, submitted, isCorrect, isChosen);
              return (
                <div
                  key={idx}
                  style={style}
                  onClick={() => handleSelect(q.id, idx)}
                  role="button"
                  tabIndex={submitted ? -1 : 0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelect(q.id, idx)}
                >
                  <span style={{ flexShrink: 0, fontWeight: 700 }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{option}</span>
                </div>
              );
            })}
            {/* Show explanation after submission */}
            {submitted && q.explanation && (
              <div style={s.explanation}>{q.explanation}</div>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          style={{ ...s.submitBtn, opacity: allAnswered ? 1 : 0.5 }}
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
        >
          {submitting ? 'Submitting…' : 'Submit Quiz'}
        </button>
      ) : !result?.passed ? (
        <button style={s.retryBtn} onClick={handleRetry}>
          Retry Quiz
        </button>
      ) : null}
    </div>
  );
}
