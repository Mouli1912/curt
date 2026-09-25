import React, { useState, useEffect } from 'react';
import { startAssessment, submitAnswer } from '../api/client';
import QuestionCard from '../components/QuestionCard';

export default function Assessment({ userId = 'demo-user', onFinish }) {
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [overallRating, setOverallRating] = useState(1000);
  const [lastDelta, setLastDelta] = useState(null);
  const [ratings, setRatings] = useState({});
  const [questionNumber, setQuestionNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [stopReason, setStopReason] = useState(null);
  const [error, setError] = useState(null);

  const initAssessment = async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setLastDelta(null);
    setIsComplete(false);
    try {
      const data = await startAssessment(userId, 'frontend-developer');
      setSession(data);
      setCurrentQuestion(data.currentQuestion);
      setOverallRating(data.overallRating);
      setRatings(data.ratings || {});
      setQuestionNumber(data.questionNumber || 1);
      setIsComplete(data.isComplete);
      setLoading(false);
    } catch (err) {
      console.error('Failed to start assessment:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    initAssessment();
  }, [userId]);

  const handleSelectAnswer = async (selectedIndex) => {
    if (submitting || !currentQuestion || isComplete) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await submitAnswer(userId, currentQuestion.id, selectedIndex);

      setFeedback({
        correct: response.correct,
        delta: response.delta
      });
      setOverallRating(response.updatedRating);
      setRatings(response.updatedSkillRatings || {});
      setLastDelta(response.delta);

      // Brief delay to let the user view feedback before transitioning
      setTimeout(() => {
        setFeedback(null);
        if (response.isComplete) {
          setIsComplete(true);
          setStopReason(response.stopReason || 'Assessment completed.');
          if (onFinish) onFinish(response);
        } else {
          setCurrentQuestion(response.nextQuestion);
          setQuestionNumber(prev => prev + 1);
        }
        setSubmitting(false);
      }, 1200);
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Initializing Adaptive Assessment Engine...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Calculating initial skill difficulties and Elo baselines</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="container">
        <div className="error card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444' }}>Assessment Engine Error</h2>
          <p>{error}</p>
          <button onClick={initAssessment} className="btn-primary" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Top Header & Live Elo Indicator */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="logo-badge">Adaptive Engine — Step 2</span>
            <h1 style={{ fontSize: '1.8rem', margin: '0.25rem 0' }}>Frontend Developer Skill Quiz</h1>
            <p className="subtitle" style={{ margin: 0, fontSize: '0.9rem' }}>
              Questions dynamically adapt to your performance using deterministic Elo rating updates.
            </p>
          </div>

          {/* Live Elo Badge */}
          <div
            className="elo-badge-card"
            style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              color: '#fff',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              textAlign: 'center',
              minWidth: '160px',
              border: '1px solid #334155'
            }}
          >
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.05em', color: '#94a3b8' }}>
              Live Overall Elo
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1.1 }}>
              {overallRating}
            </div>
            {lastDelta !== null && (
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginTop: '0.25rem',
                  color: lastDelta >= 0 ? '#4ade80' : '#f87171'
                }}
              >
                {lastDelta >= 0 ? `▲ +${lastDelta}` : `▼ ${lastDelta}`}
              </div>
            )}
          </div>
        </div>

        {/* Zero LLM Constraint Disclaimer */}
        <div className="no-llm-banner" style={{ marginTop: '1.25rem' }}>
          <span>⚡ <strong>Pure Elo Rating Math (K=32):</strong> No LLM API calls. Completely deterministic & real-time adaptive.</span>
        </div>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Main Quiz View or Completion View */}
      {!isComplete ? (
        <main>
          {/* Progress Bar */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>Progress (Max 15 Questions)</span>
              <span>Question {questionNumber} of 15</span>
            </div>
            <div className="progress-bar-bg" style={{ height: '8px', borderRadius: '4px', background: '#e2e8f0' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${(questionNumber / 15) * 100}%`,
                  height: '100%',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            questionNumber={questionNumber}
            onSelectAnswer={handleSelectAnswer}
            submitting={submitting}
            feedback={feedback}
          />
        </main>
      ) : (
        /* Assessment Complete Screen */
        <main className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Assessment Complete!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {stopReason || 'You have successfully completed the adaptive assessment session.'}
          </p>

          <div
            style={{
              background: 'var(--bg-subtle, #f8fafc)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color, #e2e8f0)',
              marginBottom: '2rem',
              display: 'inline-block',
              minWidth: '240px'
            }}
          >
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Final Overall Elo Rating
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2563eb' }}>
              {overallRating}
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: '1rem' }}>
            Per-Skill Ratings Evaluated
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.75rem',
              textAlign: 'left',
              marginBottom: '2rem'
            }}
          >
            {Object.entries(ratings).map(([skillId, rating]) => (
              <div
                key={skillId}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{skillId}</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: rating >= 1000 ? '#059669' : '#dc2626',
                    fontSize: '0.95rem'
                  }}
                >
                  {rating}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={initAssessment}
            className="btn-primary"
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Retake Assessment
          </button>
        </main>
      )}
    </div>
  );
}
