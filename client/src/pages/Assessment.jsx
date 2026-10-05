import React, { useState, useEffect } from 'react';
import { startAssessment, submitAnswer } from '../api/client';
import QuestionCard from '../components/QuestionCard';

export default function Assessment({ userId = 'pro-user', onFinish }) {
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(15);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Live Overall Rating & Ratings per skill
  const [overallRating, setOverallRating] = useState(1000);
  const [ratings, setRatings] = useState({});
  const [ratingToast, setRatingToast] = useState(null);

  // Answer feedback overlay state
  const [feedback, setFeedback] = useState(null);

  // History of answered questions in this session
  const [history, setHistory] = useState([]);

  // Start Session on mount or userId change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setHistory([]);
    setSelectedIndex(null);
    setFeedback(null);

    startAssessment(userId, 'frontend-developer')
      .then((data) => {
        if (!isMounted) return;
        setSession(data);
        setCurrentQuestion(data.currentQuestion);
        setQuestionNumber(data.questionNumber || 1);
        setTotalQuestions(data.totalQuestions || 15);
        setRatings(data.ratings || {});
        setOverallRating(data.overallRating || 1000);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to start assessment session:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Submit selected option
  const handleSubmitAnswer = async () => {
    if (selectedIndex === null || !currentQuestion || submitting) return;

    setSubmitting(true);
    try {
      const res = await submitAnswer(userId, currentQuestion.id, selectedIndex);

      const isCorrect = res.correct !== undefined ? res.correct : res.isCorrect;
      const delta = res.ratingDelta || 0;
      const deltaSign = delta >= 0 ? `+${delta}` : `${delta}`;
      const skillName = res.skillNode ? res.skillNode.toUpperCase() : 'SKILL';

      // Set feedback for brief visual highlighting
      setFeedback({
        isCorrect,
        correctIndex: res.correctIndex
      });

      // Show live Elo adjustment badge toast
      setRatingToast({
        text: `${deltaSign} Elo on ${skillName} (Overall: ${res.overallRating || overallRating})`,
        isCorrect,
        delta
      });

      // Update ratings state immediately for live feedback
      if (res.ratings) setRatings(res.ratings);
      if (res.overallRating) setOverallRating(res.overallRating);

      // Save into history
      setHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          selectedIndex,
          isCorrect,
          delta,
          skillNode: res.skillNode,
          newRating: res.updatedRating || res.newRating
        }
      ]);

      // Brief delay so user sees feedback before advancing
      setTimeout(() => {
        setFeedback(null);
        setSelectedIndex(null);
        setSubmitting(false);

        if (res.isComplete || !res.nextQuestion) {
          setSession((prev) => ({ ...prev, isComplete: true }));
        } else {
          setCurrentQuestion(res.nextQuestion);
          setQuestionNumber(res.questionNumber || questionNumber + 1);
        }
      }, 1100);

    } catch (err) {
      console.error('Error submitting answer:', err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card-white" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>⚙️</div>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>
            Initializing Adaptive Assessment Engine...
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Preparing deterministic Elo scoring & skill node graph...
          </p>
        </div>
      </div>
    );
  }

  // Completion Screen View
  if (session?.isComplete || !currentQuestion) {
    const totalCorrect = history.filter((h) => h.isCorrect).length;
    const accuracyPercent = history.length > 0 ? Math.round((totalCorrect / history.length) * 100) : 0;

    return (
      <div className="container" style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div className="card-white" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.25rem',
            margin: '0 auto 1.5rem auto'
          }}>
            ✓
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Assessment Complete!
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
            Your real-time Elo skill ratings have stabilized based on your adaptive performance.
          </p>

          {/* Metric Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Overall Rating</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', marginTop: '0.25rem' }}>{overallRating} Elo</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Questions Answered</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{history.length} / {totalQuestions}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Accuracy Score</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>{accuracyPercent}%</div>
            </div>
          </div>

          {/* Final Per-Skill Ratings List */}
          <div style={{ textAlign: 'left', marginBottom: '2.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              📊 Measured Per-Skill Elo Ratings
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {Object.entries(ratings).map(([skill, score]) => (
                <div key={skill} style={{
                  background: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize', color: '#334155' }}>{skill}</span>
                  <span style={{ fontWeight: 800, color: score >= 1200 ? '#10b981' : score >= 1000 ? '#2563eb' : '#d97706' }}>
                    {score} Elo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {onFinish && (
            <button
              className="btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
              onClick={onFinish}
            >
              Continue to Skill Gap Report →
            </button>
          )}
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((questionNumber - 1) / totalQuestions) * 100);

  return (
    <div className="container">
      {/* Toast Notification for Elo Rating Changes */}
      {ratingToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          background: ratingToast.isCorrect ? '#ecfdf5' : '#fef2f2',
          border: ratingToast.isCorrect ? '1px solid #a7f3d0' : '1px solid #fecaca',
          color: ratingToast.isCorrect ? '#047857' : '#b91c1c',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          fontWeight: 700,
          fontSize: '0.925rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          transition: 'all 0.3s ease'
        }}>
          <span>{ratingToast.isCorrect ? '🎉' : '💡'}</span>
          <span>{ratingToast.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="header-title-group">
            <div className="header-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
              ⚡
            </div>
            <h1 className="page-title">Adaptive Skill Assessment</h1>
          </div>
          <p className="page-subtitle">
            Questions dynamically adapt to your performance using deterministic Elo scoring.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        
        {/* Left Column - Question Card */}
        <div>
          {/* Progress Bar & Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#475569' }}>
              Question {questionNumber} of {totalQuestions}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb' }}>
              {progressPercent}% Complete
            </span>
          </div>

          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: '#2563eb', borderRadius: '4px', transition: 'width 0.3s ease' }} />
          </div>

          <QuestionCard
            question={currentQuestion}
            selectedIndex={selectedIndex}
            onSelectOption={setSelectedIndex}
            disabled={submitting || feedback !== null}
            feedback={feedback}
          />

          {/* Action Button Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              className="btn-primary"
              onClick={handleSubmitAnswer}
              disabled={selectedIndex === null || submitting}
              style={{
                padding: '0.85rem 2rem',
                fontSize: '1rem',
                opacity: selectedIndex === null || submitting ? 0.6 : 1,
                cursor: selectedIndex === null || submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Submitting & Updating Elo...' : 'Submit Answer →'}
            </button>
          </div>
        </div>

        {/* Right Sidebar - Live Elo Badge & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Live Overall Rating Badge */}
          <div className="card-white" style={{ padding: '1.75rem', textAlign: 'center', border: '2px solid #3b82f6' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ LIVE OVERALL ELO RATING
            </div>
            
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#1e40af',
              margin: '0.5rem 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <span>{overallRating}</span>
              <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>pts</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
              ● Real-time Adaptive Engine
            </div>
          </div>

          {/* Current Skill Ratings Breakdown */}
          <div className="card-white" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              🎯 Touched Skill Node Ratings
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '300px', overflowY: 'auto' }}>
              {Object.entries(ratings).map(([skill, score]) => (
                <div key={skill} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: currentQuestion?.skillNode === skill ? '#eff6ff' : '#f8fafc',
                  border: currentQuestion?.skillNode === skill ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', textTransform: 'capitalize' }}>
                    {skill}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb' }}>
                    {score}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
