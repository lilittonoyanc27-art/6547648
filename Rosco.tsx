import React from 'react';
import { RiddleItem } from './data.ts';

export type QuestionStatus = 'pending' | 'correct' | 'incorrect' | 'passed';

interface RoscoProps {
  riddles: RiddleItem[];
  currentIndex: number;
  statusMap: Record<number, QuestionStatus>;
  onSelectIndex: (index: number) => void;
  correctCount: number;
  remainingCount: number;
  secondsLeft: number;
  timerActive: boolean;
}

export const Rosco: React.FC<RoscoProps> = ({
  riddles,
  currentIndex,
  statusMap,
  onSelectIndex,
  correctCount,
  remainingCount,
  secondsLeft,
  timerActive
}) => {
  const size = 520;
  const center = size / 2;
  const radius = 205;
  const total = riddles.length; // 27

  return (
    <div className="relative flex items-center justify-center select-none w-full max-w-[540px] aspect-square mx-auto">
      {/* Decorative Outer Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      {/* SVG Container for the Circle */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          {/* Subtle connecting ring */}
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
          </linearGradient>

          {/* Letter Node Gradients */}
          <radialGradient id="gradPending" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#034475" />
          </radialGradient>

          <radialGradient id="gradActive" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </radialGradient>

          <radialGradient id="gradCorrect" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="45%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>

          <radialGradient id="gradIncorrect" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="45%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>

          <radialGradient id="gradPassed" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="45%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </radialGradient>

          <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="3"
          strokeDasharray="6 4"
          className="opacity-70"
        />

        {/* Render 27 Letter Nodes */}
        {riddles.map((riddle, index) => {
          const angleDeg = -90 + (index * 360) / total;
          const angleRad = (angleDeg * Math.PI) / 180;
          const cx = center + radius * Math.cos(angleRad);
          const cy = center + radius * Math.sin(angleRad);

          const isCurrent = index === currentIndex;
          const status = statusMap[riddle.id] || 'pending';

          let fillUrl = 'url(#gradPending)';
          let strokeColor = '#7dd3fc';
          let textColor = '#ffffff';

          if (isCurrent) {
            fillUrl = 'url(#gradActive)';
            strokeColor = '#fef08a';
            textColor = '#0f172a';
          } else if (status === 'correct') {
            fillUrl = 'url(#gradCorrect)';
            strokeColor = '#86efac';
            textColor = '#ffffff';
          } else if (status === 'incorrect') {
            fillUrl = 'url(#gradIncorrect)';
            strokeColor = '#fca5a5';
            textColor = '#ffffff';
          } else if (status === 'passed') {
            fillUrl = 'url(#gradPassed)';
            strokeColor = '#fed7aa';
            textColor = '#ffffff';
          }

          const nodeRadius = isCurrent ? 20 : 17;

          return (
            <g
              key={riddle.id}
              onClick={() => onSelectIndex(index)}
              className="cursor-pointer transition-transform duration-200 hover:scale-110 focus:outline-none"
              role="button"
              tabIndex={0}
              aria-label={`Letra ${riddle.letter}, Pregunta ${riddle.id}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectIndex(index);
                }
              }}
            >
              {/* Active pulsing highlight ring */}
              {isCurrent && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={nodeRadius + 6}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  className="animate-ping opacity-60"
                />
              )}

              {/* Main Circular Letter Bubble */}
              <circle
                cx={cx}
                cy={cy}
                r={nodeRadius}
                fill={fillUrl}
                stroke={strokeColor}
                strokeWidth={isCurrent ? 2.5 : 1.5}
                filter={isCurrent ? 'url(#activeGlow)' : undefined}
                className="transition-all duration-300"
              />

              {/* Inner subtle specular light */}
              <circle
                cx={cx - nodeRadius * 0.28}
                cy={cy - nodeRadius * 0.28}
                r={nodeRadius * 0.42}
                fill="#ffffff"
                opacity="0.32"
              />

              {/* Letter Text */}
              <text
                x={cx}
                y={cy + (riddle.letter === 'Ñ' ? 5.5 : 5)}
                textAnchor="middle"
                fontSize={isCurrent ? '16' : '14'}
                fontWeight="800"
                fill={textColor}
                fontFamily="'Plus Jakarta Sans', sans-serif"
                style={{ pointerEvents: 'none' }}
              >
                {riddle.letter}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Center TV Podium HUD (Authentic TV Show Counters) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4">
        {/* Score & Remaining Round Counters (Like TV Show Badges in Photo) */}
        <div className="flex items-center gap-3 sm:gap-4 mb-2 pointer-events-auto">
          {/* Correct Aciertos Circle (Orange Badge in TV Show) */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-white/80 shadow-[0_0_20px_rgba(249,115,22,0.6)] flex items-center justify-center text-white">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums">
                {correctCount}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider mt-1 drop-shadow">
              Aciertos
            </span>
          </div>

          {/* Timer Display */}
          {(() => {
            const mins = Math.floor(secondsLeft / 60);
            const secs = secondsLeft % 60;
            const formattedTime = `${mins}:${secs.toString().padStart(2, '0')}`;
            return (
              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-colors px-1 shadow-lg ${
                    secondsLeft <= 60
                      ? 'bg-rose-950/80 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse'
                      : 'bg-slate-900/90 border-cyan-400/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black font-mono tabular-nums tracking-tight">
                    {formattedTime}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">
                  {timerActive ? 'Tiempo' : 'Pausa'}
                </span>
              </div>
            );
          })()}

          {/* Remaining Counter (Green Badge in TV Show) */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-700 border-2 border-white/80 shadow-[0_0_20px_rgba(34,197,94,0.6)] flex items-center justify-center text-white">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums">
                {remainingCount}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-300 uppercase tracking-wider mt-1 drop-shadow">
              Restantes
            </span>
          </div>
        </div>

        {/* Current Active Letter Center Banner */}
        <div className="mt-1 bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-xl px-4 py-1.5 shadow-lg text-center max-w-[200px]">
          <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
            Letra {riddles[currentIndex]?.letter} · {currentIndex + 1}/27
          </div>
          <div className="text-xs font-medium text-slate-200 truncate">
            {riddles[currentIndex]?.categoryEs}
          </div>
        </div>
      </div>
    </div>
  );
};
