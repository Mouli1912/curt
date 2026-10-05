import React from 'react';

export default function QuestionCard({ question, selectedIndex, onSelectOption, disabled = false, feedback = null }) {
  if (!question) return null;

  const promptText = question.prompt || question.question;

  return (
    <div className="card-white" style={{ padding: '2rem' }}>
      {/* Skill Node & Difficulty Metadata */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', alignItems: 'center' }}>
        {question.skillNode && (
          <span style={{
            background: '#eff6ff',
            color: '#2563eb',
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            🏷️ {question.skillNode}
          </span>
        )}
        {question.difficulty && (
          <span style={{
            background: '#fef3c7',
            color: '#d97706',
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            🎯 Elo Difficulty: {question.difficulty}
          </span>
        )}
      </div>

      {/* Question Prompt */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.75rem', lineHeight: 1.4 }}>
        {promptText}
      </h2>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {question.options?.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          let borderStyle = '1px solid #e2e8f0';
          let bgStyle = '#f8fafc';
          let textColor = '#334155';
          let badgeText = null;

          if (feedback) {
            if (idx === feedback.correctIndex) {
              borderStyle = '2px solid #10b981';
              bgStyle = '#ecfdf5';
              textColor = '#065f46';
              badgeText = '✓ Correct';
            } else if (isSelected && !feedback.isCorrect) {
              borderStyle = '2px solid #ef4444';
              bgStyle = '#fef2f2';
              textColor = '#991b1b';
              badgeText = '✕ Incorrect';
            }
          } else if (isSelected) {
            borderStyle = '2px solid #2563eb';
            bgStyle = '#eff6ff';
            textColor = '#1e40af';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelectOption(idx)}
              style={{
                padding: '1.1rem 1.25rem',
                borderRadius: '12px',
                border: borderStyle,
                background: bgStyle,
                cursor: disabled ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                width: '100%',
                outline: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: isSelected ? '6px solid #2563eb' : '2px solid #cbd5e1',
                  background: '#ffffff',
                  flexShrink: 0
                }} />
                <span style={{ fontSize: '1rem', fontWeight: isSelected ? 700 : 500, color: textColor }}>
                  {opt}
                </span>
              </div>

              {badgeText && (
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: feedback?.isCorrect || idx === feedback?.correctIndex ? '#047857' : '#b91c1c'
                }}>
                  {badgeText}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
