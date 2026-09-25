import React, { useState, useEffect } from 'react';

export default function QuestionCard({
  question,
  questionNumber,
  onSelectAnswer,
  submitting,
  feedback
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Reset selected option when question changes
  useEffect(() => {
    setSelectedOption(null);
  }, [question?.id]);

  if (!question) {
    return (
      <div className="card text-center" style={{ padding: '2rem' }}>
        <p>No active question available.</p>
      </div>
    );
  }

  const handleSubmit = (idx) => {
    if (submitting || feedback) return;
    setSelectedOption(idx);
    onSelectAnswer(idx);
  };

  return (
    <div className="question-card card" style={{ padding: '1.75rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span className="no-llm-badge" style={{ fontSize: '0.8rem', opacity: 0.9 }}>
          Question #{questionNumber}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="category-tag" style={{ background: '#3b82f622', color: '#3b82f6', border: '1px solid #3b82f644' }}>
            Skill: {question.skillNode}
          </span>
          <span className="category-tag" style={{ background: '#8b5cf622', color: '#8b5cf6', border: '1px solid #8b5cf644' }}>
            Difficulty: {question.difficulty}
          </span>
        </div>
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', lineHeight: '1.4', fontWeight: 600 }}>
        {question.prompt}
      </h3>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          let buttonStyle = {
            textAlign: 'left',
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            border: isSelected ? '2px solid #3b82f6' : '1px solid var(--border-color, #e2e8f0)',
            background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--card-bg, #ffffff)',
            color: 'var(--text-color, #0f172a)',
            cursor: submitting || feedback ? 'default' : 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          };

          if (feedback && isSelected) {
            if (feedback.correct) {
              buttonStyle.border = '2px solid #10b981';
              buttonStyle.background = 'rgba(16, 185, 129, 0.12)';
            } else {
              buttonStyle.border = '2px solid #ef4444';
              buttonStyle.background = 'rgba(239, 68, 68, 0.12)';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSubmit(idx)}
              disabled={submitting || !!feedback}
              style={buttonStyle}
              className="option-button"
            >
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  background: isSelected ? (feedback ? (feedback.correct ? '#10b981' : '#ef4444') : '#3b82f6') : '#cbd5e1',
                  color: '#fff',
                  flexShrink: 0
                }}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span style={{ flexGrow: 1 }}>{optionText}</span>
            </button>
          );
        })}
      </div>

      {feedback && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 600,
            textAlign: 'center',
            animation: 'fadeIn 0.2s ease-in',
            background: feedback.correct ? '#d1fae5' : '#fee2e2',
            color: feedback.correct ? '#065f46' : '#991b1b',
            border: `1px solid ${feedback.correct ? '#a7f3d0' : '#fca5a5'}`
          }}
        >
          {feedback.correct ? (
            <span>✅ Correct! Elo Rating updated by <strong>+{feedback.delta}</strong> points.</span>
          ) : (
            <span>❌ Incorrect. Elo Rating updated by <strong>{feedback.delta}</strong> points.</span>
          )}
        </div>
      )}
    </div>
  );
}
