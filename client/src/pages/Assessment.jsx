import React, { useState, useEffect } from 'react';
import { startAssessment, submitAnswer } from '../api/client';
import QuestionCard from '../components/QuestionCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { QuestionSkeleton } from '../components/SkeletonLoader';

export default function Assessment({ userId = 'pro-user', targetRole = 'frontend-developer', onFinish }) {
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(15);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Integrity & IRT timing states
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const questionStartTimeRef = React.useRef(Date.now());

  // Live Overall Rating & Ratings per skill
  const [overallRating, setOverallRating] = useState(1000);
  const [ratings, setRatings] = useState({});
  const [ratingToast, setRatingToast] = useState(null);
  const [scoreDeltaAnim, setScoreDeltaAnim] = useState(null); // { delta: number, key: number }

  // Answer feedback overlay state
  const [feedback, setFeedback] = useState(null);

  // History of answered questions in this session
  const [history, setHistory] = useState([]);

  // Track tab visibility changes for integrity logging
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setTabSwitchCount((prev) => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Reset timer on question change
  useEffect(() => {
    if (currentQuestion) {
      questionStartTimeRef.current = Date.now();
    }
  }, [currentQuestion]);

  const initAssessment = () => {
    setLoading(true);
    setError(null);
    setHistory([]);
    setSelectedIndex(null);
    setFeedback(null);
    setTabSwitchCount(0);

    startAssessment(userId, targetRole)
      .then((data) => {
        setSession(data);
        setCurrentQuestion(data.currentQuestion);
        setQuestionNumber(data.questionNumber || 1);
        setTotalQuestions(data.totalQuestions || 15);
        setRatings(data.ratings || {});
        setOverallRating(data.overallRating || 1000);
        setLoading(false);
        questionStartTimeRef.current = Date.now();
      })
      .catch((err) => {
        console.error('Failed to start assessment session:', err);
        setError('Failed to connect to adaptive assessment engine. Ensure backend is running.');
        setLoading(false);
      });
  };

  useEffect(() => {
    initAssessment();
  }, [userId, targetRole]);

  // Submit selected option
  const handleSubmitAnswer = async () => {
    if (selectedIndex === null || !currentQuestion || submitting) return;

    setSubmitting(true);
    const timeSpentMs = Date.now() - questionStartTimeRef.current;

    try {
      const res = await submitAnswer(userId, currentQuestion.id, selectedIndex, timeSpentMs, tabSwitchCount);

      const isCorrect = res.correct !== undefined ? res.correct : res.isCorrect;
      const delta = res.ratingDelta || 0;
      const deltaSign = delta >= 0 ? `+${delta}` : `${delta}`;
      const skillName = res.skillNode ? res.skillNode.toUpperCase() : 'SKILL';

      // Set feedback for brief visual highlighting
      setFeedback({
        isCorrect,
        correctIndex: res.correctIndex
      });

      // Trigger animated delta score badge
      setScoreDeltaAnim({
        delta,
        key: Date.now()
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

      // Delay to view answer feedback before advancing
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
      }, 1000);

    } catch (err) {
      console.error('Error submitting answer:', err);
      setError(`Submission error: ${err.message}`);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-4">
        <QuestionSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <div className="bg-danger-50 dark:bg-danger-950/40 border border-danger-200 dark:border-danger-900/60 rounded-2xl p-8 space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-danger-800 dark:text-danger-200">Assessment Failure</h2>
          <p className="text-sm text-danger-600 dark:text-danger-300">{error}</p>
          <button
            onClick={initAssessment}
            className="px-6 py-2.5 bg-danger-600 hover:bg-danger-500 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
          >
            Restart Assessment
          </button>
        </div>
      </div>
    );
  }

  // Completion Screen View
  if (session?.isComplete || !currentQuestion) {
    const totalCorrect = history.filter((h) => h.isCorrect).length;
    const accuracyPercent = history.length > 0 ? Math.round((totalCorrect / history.length) * 100) : 0;

    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-12 text-center shadow-lg space-y-8 animate-pop-in">
          <div className="w-20 h-20 rounded-full bg-success-50 dark:bg-success-950/80 text-success-600 dark:text-success-400 flex items-center justify-center text-4xl mx-auto border border-success-200 dark:border-success-800 animate-celebrate-bounce">
            ✓
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
              Assessment Complete!
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto">
              Your real-time Elo psychometric ratings have stabilized across touched skill domains.
            </p>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-50 dark:bg-neutral-800/60 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700">
              <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Overall Rating</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-primary-600 dark:text-primary-400 mt-1">
                <AnimatedCounter value={overallRating} /> Elo
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/60 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700">
              <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Questions Answered</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
                {history.length} / {totalQuestions}
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/60 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700">
              <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Accuracy Score</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-success-600 dark:text-success-400 mt-1">
                {accuracyPercent}%
              </div>
            </div>
          </div>

          {/* Final Per-Skill Ratings List */}
          <div className="text-left bg-neutral-50 dark:bg-neutral-800/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-4">
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>📊</span> Measured Per-Skill Elo Ratings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(ratings).map(([skill, score]) => (
                <div key={skill} className="bg-white dark:bg-neutral-900 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-bold capitalize text-neutral-700 dark:text-neutral-300">{skill}</span>
                  <span className={`font-extrabold ${score >= 1200 ? 'text-success-600 dark:text-success-400' : score >= 1000 ? 'text-primary-600 dark:text-primary-400' : 'text-warning-600 dark:text-warning-400'}`}>
                    {score} Elo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {onFinish && (
            <button
              onClick={onFinish}
              className="px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-lg shadow-primary-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
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
    <div className="space-y-6">
      {/* Toast Notification for Elo Rating Changes */}
      {ratingToast && (
        <div
          className={`fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-2xl border shadow-xl font-bold text-sm flex items-center gap-3 transition-all animate-pop-in ${
            ratingToast.isCorrect
              ? 'bg-success-50 dark:bg-success-950 text-success-900 dark:text-success-100 border-success-300 dark:border-success-700'
              : 'bg-danger-50 dark:bg-danger-950 text-danger-900 dark:text-danger-100 border-danger-300 dark:border-danger-700'
          }`}
          role="alert"
          aria-live="polite"
        >
          <span className="text-xl">{ratingToast.isCorrect ? '🎉' : '💡'}</span>
          <span>{ratingToast.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-950/80 text-success-600 dark:text-success-400 flex items-center justify-center text-xl font-extrabold border border-success-200 dark:border-success-800">
              ⚡
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Adaptive Skill Assessment
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Questions dynamically adapt to your answers using chess-like Elo psychometrics.
          </p>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - Question Card */}
        <div className="lg:col-span-8 space-y-4">
          {/* Progress Bar & Header */}
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-neutral-600 dark:text-neutral-400">
                Question {questionNumber} of {totalQuestions}
              </span>
              <span className="text-primary-600 dark:text-primary-400">
                {progressPercent}% Complete
              </span>
            </div>
            <div className="h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            selectedIndex={selectedIndex}
            onSelectOption={setSelectedIndex}
            disabled={submitting || feedback !== null}
            feedback={feedback}
          />

          {/* Action Button Bar */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedIndex === null || submitting}
              className={`px-8 py-3.5 rounded-xl font-extrabold text-sm text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                selectedIndex === null || submitting
                  ? 'bg-neutral-400 dark:bg-neutral-700 cursor-not-allowed opacity-60'
                  : 'bg-primary-600 hover:bg-primary-500 hover:-translate-y-0.5 active:translate-y-0 shadow-primary-600/25'
              }`}
            >
              {submitting ? 'Updating Elo Ratings...' : 'Submit Answer →'}
            </button>
          </div>
        </div>

        {/* Right Sidebar - Live Elo Badge & Progress */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Live Overall Rating Badge with Wow-Factor Animation */}
          <div className="relative bg-white dark:bg-neutral-900 border-2 border-primary-500 dark:border-primary-600 rounded-2xl p-6 text-center shadow-lg overflow-hidden">
            <div className="text-[11px] font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              ⚡ LIVE OVERALL ELO RATING
            </div>
            
            <div className="relative flex items-center justify-center gap-1.5 my-3">
              <span className="text-4xl sm:text-5xl font-black text-primary-700 dark:text-primary-300">
                <AnimatedCounter value={overallRating} />
              </span>
              <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400 self-end mb-1">
                pts
              </span>

              {/* Animated Floating Delta Pop Pill */}
              {scoreDeltaAnim && (
                <span
                  key={scoreDeltaAnim.key}
                  className={`absolute -top-3 right-4 px-2 py-0.5 rounded-full text-xs font-black animate-pop-in ${
                    scoreDeltaAnim.delta >= 0
                      ? 'bg-success-100 text-success-800 dark:bg-success-950 dark:text-success-200 border border-success-300'
                      : 'bg-danger-100 text-danger-800 dark:bg-danger-950 dark:text-danger-200 border border-danger-300'
                  }`}
                >
                  {scoreDeltaAnim.delta >= 0 ? `+${scoreDeltaAnim.delta}` : scoreDeltaAnim.delta}
                </span>
              )}
            </div>

            <div className="text-xs font-extrabold text-success-600 dark:text-success-400 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success-500 animate-ping inline-block" />
              <span>Real-time Elo Engine</span>
            </div>
          </div>

          {/* Current Skill Ratings Breakdown */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <span>🎯</span> Touched Skill Ratings
            </h3>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {Object.entries(ratings).length === 0 ? (
                <div className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-4 italic">
                  Answer questions to see domain rating updates.
                </div>
              ) : (
                Object.entries(ratings).map(([skill, score]) => {
                  const isCurrentSkill = currentQuestion?.skillNode === skill;
                  return (
                    <div
                      key={skill}
                      className={`flex justify-between items-center p-3 rounded-xl border text-xs transition-all ${
                        isCurrentSkill
                          ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-300 dark:border-primary-700 font-bold'
                          : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <span className="capitalize text-neutral-800 dark:text-neutral-200">{skill}</span>
                      <span className="font-black text-primary-600 dark:text-primary-400">{score} Elo</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
