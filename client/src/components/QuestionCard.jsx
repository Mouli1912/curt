import React, { useEffect } from 'react';

export default function QuestionCard({
  question,
  selectedIndex,
  onSelectOption,
  disabled = false,
  feedback = null
}) {
  if (!question) return null;

  const promptText = question.prompt || question.question;

  // Keyboard shortcut listener for options 1-4
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (question.options && idx < question.options.length) {
          onSelectOption(idx);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, question, onSelectOption]);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-300 animate-slide-up">
      {/* Skill Node & Difficulty Metadata */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {question.skillNode && (
          <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800 flex items-center gap-1">
            <span>🏷️</span> {question.skillNode}
          </span>
        )}
        {question.difficulty && (
          <span className="px-3 py-1 rounded-md text-xs font-bold bg-warning-50 text-warning-700 dark:bg-warning-950 dark:text-warning-300 border border-warning-200 dark:border-warning-800 flex items-center gap-1">
            <span>🎯</span> Difficulty: {question.difficulty} Elo
          </span>
        )}
      </div>

      {/* Question Prompt */}
      <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white mb-6 leading-relaxed">
        {promptText}
      </h2>

      {/* Options List */}
      <div className="space-y-3 mb-4" role="radiogroup" aria-label="Answer options">
        {question.options?.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          let containerClasses = 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-neutral-100 dark:hover:bg-neutral-800';
          let badgeText = null;

          if (feedback) {
            if (idx === feedback.correctIndex) {
              containerClasses = 'bg-success-50 dark:bg-success-950/60 border-success-500 text-success-900 dark:text-success-100 font-semibold ring-2 ring-success-500/20';
              badgeText = '✓ Correct';
            } else if (isSelected && !feedback.isCorrect) {
              containerClasses = 'bg-danger-50 dark:bg-danger-950/60 border-danger-500 text-danger-900 dark:text-danger-100 font-semibold ring-2 ring-danger-500/20';
              badgeText = '✕ Incorrect';
            }
          } else if (isSelected) {
            containerClasses = 'bg-primary-50 dark:bg-primary-950/70 border-primary-600 dark:border-primary-500 text-primary-900 dark:text-primary-100 ring-2 ring-primary-500/30 font-semibold';
          }

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => !disabled && onSelectOption(idx)}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ${containerClasses}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full border border-neutral-300 dark:border-neutral-600 flex items-center justify-center text-xs font-bold shrink-0 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                  {idx + 1}
                </span>
                <span className="text-sm sm:text-base leading-snug">
                  {opt}
                </span>
              </div>

              {badgeText && (
                <span className={`text-xs font-black uppercase tracking-wider shrink-0 ${feedback?.isCorrect || idx === feedback?.correctIndex ? 'text-success-700 dark:text-success-300' : 'text-danger-700 dark:text-danger-300'}`}>
                  {badgeText}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-[11px] text-neutral-400 dark:text-neutral-500 text-right font-medium">
        💡 Tip: Use keyboard numbers <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">1</kbd>-<kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">4</kbd> to pick your answer.
      </div>
    </div>
  );
}
