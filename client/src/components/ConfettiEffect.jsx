import React from 'react';

/**
 * Lightweight SVG/CSS animated confetti particle overlay for celebratory credential moments
 */
export default function ConfettiEffect() {
  const particles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * -30 - 10,
    color: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'][i % 6],
    size: Math.random() * 8 + 6,
    duration: Math.random() * 1.5 + 1.5,
    delay: Math.random() * 0.4,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-celebrate-drop rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.4}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiDrop ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s infinite`
          }}
        />
      ))}
      <style>{`
        @keyframes confettiDrop {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
