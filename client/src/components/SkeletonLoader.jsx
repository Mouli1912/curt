import React from 'react';

/**
 * Reusable skeleton loader components for fetching states
 */
export function SkeletonBox({ className = 'h-6 w-full', style = {} }) {
  return (
    <div
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md ${className}`}
      style={style}
    />
  );
}

export function QuestionSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex gap-2 mb-4">
        <SkeletonBox className="h-6 w-24 rounded-md" />
        <SkeletonBox className="h-6 w-32 rounded-md" />
      </div>
      <SkeletonBox className="h-8 w-4/5 mb-3" />
      <SkeletonBox className="h-8 w-2/3 mb-8" />

      <div className="space-y-3 mb-6">
        <SkeletonBox className="h-14 w-full rounded-xl" />
        <SkeletonBox className="h-14 w-full rounded-xl" />
        <SkeletonBox className="h-14 w-full rounded-xl" />
        <SkeletonBox className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function GraphSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <SkeletonBox className="h-6 w-48 mb-2" />
          <SkeletonBox className="h-4 w-72" />
        </div>
        <div className="flex gap-3">
          <SkeletonBox className="h-4 w-16" />
          <SkeletonBox className="h-4 w-16" />
          <SkeletonBox className="h-4 w-16" />
        </div>
      </div>
      <SkeletonBox className="h-[360px] w-full rounded-xl" />
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <SkeletonBox className="h-6 w-32" />
            <SkeletonBox className="h-5 w-16 rounded-full" />
          </div>
          <SkeletonBox className="h-4 w-full mb-3" />
          <SkeletonBox className="h-3 w-4/5 mb-4" />
          <SkeletonBox className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}
