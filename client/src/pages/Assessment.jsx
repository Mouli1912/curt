import React, { useState, useEffect } from 'react';
import { startAssessment, submitAnswer } from '../api/client';

export default function Assessment({ userId = 'pro-user', onFinish }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(3);
  const totalQuestions = 20;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Default fallback question matching screenshot 2
    setCurrentQuestion({
      id: 'q-demo-3',
      text: 'Which data structure is most suitable for implementing a priority queue?',
      options: ['Array', 'Linked List', 'Binary Heap', 'Stack'],
      correctIndex: 2
    });
    setSelectedOption(2); // Pre-select Binary Heap matching screenshot
  }, []);

  const progressPercent = Math.round((questionIndex / totalQuestions) * 100);

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="header-title-group">
            <div className="header-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
              ✓
            </div>
            <h1 className="page-title">Adaptive Assessment</h1>
          </div>
          <p className="page-subtitle">Answer questions to measure your skills. The test adapts to your level.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Left Column - Question Card */}
        <div className="card-white" style={{ padding: '2rem' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#475569' }}>
              Question {questionIndex} of {totalQuestions}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>
              <span>⏱️</span> 12:30
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: '#2563eb', borderRadius: '4px', transition: 'width 0.3s ease' }}></div>
          </div>

          {/* Question Text */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.75rem', lineHeight: 1.4 }}>
            {currentQuestion?.text || 'Which data structure is most suitable for implementing a priority queue?'}
          </h2>

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {currentQuestion?.options?.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  style={{
                    padding: '1.1rem 1.25rem',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: isSelected ? '#eff6ff' : '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: isSelected ? '6px solid #2563eb' : '2px solid #cbd5e1',
                    background: '#ffffff',
                    flexShrink: 0
                  }}></div>
                  <span style={{ fontSize: '1rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#1e40af' : '#334155' }}>
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn-secondary" onClick={() => setQuestionIndex(Math.max(1, questionIndex - 1))}>
              ← Previous
            </button>
            <button className="btn-primary" onClick={() => {
              if (questionIndex >= totalQuestions) {
                if (onFinish) onFinish();
              } else {
                setQuestionIndex(questionIndex + 1);
              }
            }}>
              Next Question →
            </button>
          </div>
        </div>

        {/* Right Sidebar - Assessment Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-white" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
              Assessment Progress
            </h3>

            {/* Circular Progress Gauge */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                margin: '0 auto 1rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="3.5" strokeDasharray={`${progressPercent}, 100`} />
                </svg>
                <div style={{ position: 'absolute', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                  {progressPercent}%
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                {questionIndex} / {totalQuestions} questions
              </div>
            </div>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#10b981' }}>✓</span> Easy questions
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#2563eb' }}>●</span> Adaptive difficulty
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#f59e0b' }}>⏱</span> Estimated time: 17 min
              </div>
            </div>
          </div>

          {/* Tip Card */}
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            gap: '0.85rem'
          }}>
            <span style={{ fontSize: '1.4rem' }}>💡</span>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#065f46', marginBottom: '0.2rem' }}>
                Tip
              </div>
              <div style={{ fontSize: '0.85rem', color: '#047857', lineHeight: 1.4 }}>
                Take your time and read each question carefully.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
