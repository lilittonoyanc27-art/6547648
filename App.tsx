import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Check,
  X,
  FastForward,
  RotateCcw,
  Languages,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Trophy,
  Play,
  Pause,
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';

import {
  RIDDLES,
  SPEAKING_QUESTIONS,
  RiddleItem,
  checkAnswerMatch
} from './data.ts';
import { Rosco, QuestionStatus } from './Rosco.tsx';
import { playSound, speakSpanish } from './sound.ts';

export default function App() {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<'game' | 'speaking' | 'all-riddles'>('game');

  // Game State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [statusMap, setStatusMap] = useState<Record<number, QuestionStatus>>({});
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'incorrect' | 'passed' | null;
    messageEs: string;
    messageHy: string;
    correctAnswerEs?: string;
    correctAnswerHy?: string;
  }>({ type: null, messageEs: '', messageHy: '' });

  // Translations & Answer Visibility
  const [showArmenianTranslation, setShowArmenianTranslation] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Sound & Timer (20 minutes = 1200s)
  const TOTAL_TIME_SECONDS = 20 * 60;
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_TIME_SECONDS);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Victory / Completed State
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Speaking Section state
  const [activeSpeakingIdx, setActiveSpeakingIdx] = useState<number>(0);
  const [speakingArmenianRevealed, setSpeakingArmenianRevealed] = useState<Record<number, boolean>>({});

  const currentRiddle: RiddleItem = RIDDLES[currentIndex] || RIDDLES[0];
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute stats
  const correctCount = Object.values(statusMap).filter((s) => s === 'correct').length;
  const incorrectCount = Object.values(statusMap).filter((s) => s === 'incorrect').length;
  const remainingCount = RIDDLES.length - correctCount - incorrectCount;

  // Auto focus input on index change
  useEffect(() => {
    setUserAnswer('');
    setShowArmenianTranslation(false);
    setShowAnswer(false);
    setFeedback({ type: null, messageEs: '', messageHy: '' });
    if (activeTab === 'game') {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [currentIndex, activeTab]);

  // Timer countdown
  useEffect(() => {
    if (!timerRunning || isCompleted) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, isCompleted]);

  // Check if all answered
  useEffect(() => {
    if (correctCount + incorrectCount === RIDDLES.length && RIDDLES.length > 0) {
      setIsCompleted(true);
      setTimerRunning(false);
      if (soundEnabled) playSound.victory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [correctCount, incorrectCount, soundEnabled]);

  // Find next question that is pending or passed
  const findNextPendingIndex = (startIndex: number): number => {
    const total = RIDDLES.length;
    for (let step = 1; step <= total; step++) {
      const idx = (startIndex + step) % total;
      const status = statusMap[RIDDLES[idx].id];
      if (status !== 'correct' && status !== 'incorrect') {
        return idx;
      }
    }
    // If all are answered, stay on next
    return (startIndex + 1) % total;
  };

  // Move to next question seamlessly
  const advanceToNext = (fromIndex: number) => {
    const nextIdx = findNextPendingIndex(fromIndex);
    setCurrentIndex(nextIdx);
  };

  // Submit Answer
  const handleCheckAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim()) return;

    if (!timerRunning && secondsLeft > 0) {
      setTimerRunning(true);
    }

    const isMatch = checkAnswerMatch(userAnswer, currentRiddle);

    if (isMatch) {
      if (soundEnabled) playSound.correct();
      setStatusMap((prev) => ({ ...prev, [currentRiddle.id]: 'correct' }));
      setFeedback({
        type: 'correct',
        messageEs: '¡Correcto! Excelente deducción.',
        messageHy: 'Ճիշտ է։ Հիանալի պատասխան։',
        correctAnswerEs: currentRiddle.answerEs,
        correctAnswerHy: currentRiddle.answerHy
      });

      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 }
      });

      // Brief delay to celebrate and move to next
      setTimeout(() => {
        advanceToNext(currentIndex);
      }, 900);
    } else {
      // INCORECT ANSWER:
      // Requirement: "и если ответ неверный всё равно продолжить играть"
      if (soundEnabled) playSound.incorrect();
      setStatusMap((prev) => ({ ...prev, [currentRiddle.id]: 'incorrect' }));
      setFeedback({
        type: 'incorrect',
        messageEs: `Incorrecto. La respuesta era: ${currentRiddle.answerEs}`,
        messageHy: `Սխալ է։ Ճիշտ պատասխանն էր՝ ${currentRiddle.answerHy}`,
        correctAnswerEs: currentRiddle.answerEs,
        correctAnswerHy: currentRiddle.answerHy
      });

      // Still advance so the user continues playing smoothly
      setTimeout(() => {
        advanceToNext(currentIndex);
      }, 1600);
    }
  };

  // Pasapalabra (Pass)
  const handlePass = () => {
    if (soundEnabled) playSound.pass();
    if (!timerRunning && secondsLeft > 0) {
      setTimerRunning(true);
    }

    setStatusMap((prev) => {
      // Only mark as passed if not already correct/incorrect
      if (prev[currentRiddle.id] !== 'correct' && prev[currentRiddle.id] !== 'incorrect') {
        return { ...prev, [currentRiddle.id]: 'passed' };
      }
      return prev;
    });

    setFeedback({
      type: 'passed',
      messageEs: '¡Pasapalabra! Pasamos a la siguiente letra.',
      messageHy: 'Բաց թողնված է։ Անցնում ենք հաջորդ տառին։'
    });

    setTimeout(() => {
      advanceToNext(currentIndex);
    }, 450);
  };

  // Manual marking (ideal for teacher/student oral practice)
  const handleMarkStatus = (status: 'correct' | 'incorrect') => {
    if (status === 'correct') {
      if (soundEnabled) playSound.correct();
      setStatusMap((prev) => ({ ...prev, [currentRiddle.id]: 'correct' }));
      setFeedback({
        type: 'correct',
        messageEs: '¡Marcado como correcto!',
        messageHy: 'Նշված է որպես ճիշտ։',
        correctAnswerEs: currentRiddle.answerEs,
        correctAnswerHy: currentRiddle.answerHy
      });
      setTimeout(() => advanceToNext(currentIndex), 700);
    } else {
      if (soundEnabled) playSound.incorrect();
      setStatusMap((prev) => ({ ...prev, [currentRiddle.id]: 'incorrect' }));
      setFeedback({
        type: 'incorrect',
        messageEs: `Marcado como fallo. Respuesta: ${currentRiddle.answerEs}`,
        messageHy: `Նշված է որպես սխալ։ Պատասխան՝ ${currentRiddle.answerHy}`,
        correctAnswerEs: currentRiddle.answerEs,
        correctAnswerHy: currentRiddle.answerHy
      });
      setTimeout(() => advanceToNext(currentIndex), 1200);
    }
  };

  // Direct letter click
  const handleSelectRiddle = (index: number) => {
    if (soundEnabled) playSound.select();
    setCurrentIndex(index);
  };

  // Reset Game
  const handleResetGame = () => {
    if (soundEnabled) playSound.select();
    setStatusMap({});
    setCurrentIndex(0);
    setSecondsLeft(TOTAL_TIME_SECONDS);
    setTimerRunning(false);
    setIsCompleted(false);
    setUserAnswer('');
    setShowArmenianTranslation(false);
    setShowAnswer(false);
    setFeedback({ type: null, messageEs: '', messageHy: '' });
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-900">
      {/* Studio Lighting Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/20 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-600/15 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-cyan-600/15 blur-[100px] rounded-full" />
      </div>

      {/* Header Contract: 3 Zones */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center font-black text-white text-lg">
            P
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent whitespace-nowrap">
              PASAPALABRA
            </span>
            <span className="text-[11px] text-cyan-400 font-medium -mt-0.5 tracking-wide">
              Իսպաներեն Հանելուկներ · El Rosco
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('game')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'game'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            El Rosco (Խաղ)
          </button>

          <button
            onClick={() => setActiveTab('speaking')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'speaking'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Preguntas para hablar (Խոսակցական)
          </button>

          <button
            onClick={() => setActiveTab('all-riddles')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'all-riddles'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Todas las 27 (Բոլոր հարցերը)
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Audio, Timer Toggle, Reset) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            aria-label="Sonido"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={handleResetGame}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Reiniciar partida"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Selector */}
      <div className="md:hidden flex border-b border-slate-800 bg-slate-950/90 px-3 py-2 gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('game')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 ${
            activeTab === 'game' ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-900'
          }`}
        >
          El Rosco (Խաղ)
        </button>
        <button
          onClick={() => setActiveTab('speaking')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 ${
            activeTab === 'speaking' ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-900'
          }`}
        >
          Խոսակցական (7)
        </button>
        <button
          onClick={() => setActiveTab('all-riddles')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 ${
            activeTab === 'all-riddles' ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-900'
          }`}
        >
          Բոլոր հարցերը (27)
        </button>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col">
        {/* ===================== TAB 1: EL ROSCO GAME ===================== */}
        {activeTab === 'game' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-auto">
            {/* Left Column: The Iconic Circular Rosco (7 Cols on desktop) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950/40 border border-slate-800/80 rounded-3xl p-4 sm:p-6 backdrop-blur-sm relative shadow-2xl">
              <Rosco
                riddles={RIDDLES}
                currentIndex={currentIndex}
                statusMap={statusMap}
                onSelectIndex={handleSelectRiddle}
                correctCount={correctCount}
                remainingCount={remainingCount}
                secondsLeft={secondsLeft}
                timerActive={timerRunning}
              />

              {/* Rosco Legend / Quick Stats Bar */}
              <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(34,197,94,0.7)]" />
                    <span>Aciertos: <strong className="text-emerald-400">{correctCount}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
                    <span>Fallos: <strong className="text-rose-400">{incorrectCount}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>Pasadas: <strong className="text-amber-400">{Object.values(statusMap).filter(s => s === 'passed').length}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{timerRunning ? 'Pausar' : 'Iniciar'}</span>
                  </button>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Nivel A1–A2</span>
                </div>
              </div>
            </div>

            {/* Right Column: Active Riddle Card & Interactive Controls (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Category & Letter Header Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-xl shadow-md shadow-blue-500/20">
                      {currentRiddle.letter}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                        {currentRiddle.categoryEs} · {currentRiddle.categoryHy}
                      </div>
                      <h2 className="text-sm font-semibold text-slate-200">
                        {currentRiddle.titleEs} — {currentRiddle.titleHy}
                      </h2>
                    </div>
                  </div>

                  {/* Read Aloud Button (Web Speech API) */}
                  <button
                    onClick={() => speakSpanish(currentRiddle.questionEs)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition-all shadow-sm flex items-center gap-1 text-xs"
                    title="Escuchar en español"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[11px] hidden sm:inline">Escuchar</span>
                  </button>
                </div>

                {/* THE SPANISH RIDDLE BOX (CLICK TO REVEAL ARMENIAN TRANSLATION) */}
                <div
                  onClick={() => setShowArmenianTranslation(!showArmenianTranslation)}
                  role="button"
                  tabIndex={0}
                  className="group relative cursor-pointer rounded-xl bg-gradient-to-br from-slate-950 to-blue-950/40 p-4 border border-blue-500/30 hover:border-cyan-400 transition-all duration-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  title="Haz clic para ver/ocultar la traducción al armenio"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                      <span>🇪🇸</span> Español (Հանելուկ)
                    </span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 group-hover:bg-cyan-900 transition-colors">
                      <Languages className="w-3 h-3" />
                      {showArmenianTranslation ? 'Թաքցնել թարգմանությունը' : 'Սեղմեք թարգմանության համար'}
                    </span>
                  </div>

                  <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                    {currentRiddle.questionEs}
                  </p>

                  {/* Visual Clue hint */}
                  <div className="mt-2 text-[11px] text-slate-400 italic flex items-center gap-1">
                    <span>💡 Սեղմեք տեքստի վրա՝ հայերեն թարգմանությունը բացելու համար</span>
                  </div>
                </div>

                {/* ARMENIAN TRANSLATION DISPLAY (Smooth appearance) */}
                {showArmenianTranslation && (
                  <div className="mt-3 p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/30 border border-indigo-500/40 animate-in fade-in slide-in-from-top-2 duration-200 shadow-inner">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                        <span>🇦🇲</span> Հայերեն թարգմանություն
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowArmenianTranslation(false);
                        }}
                        className="text-slate-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm sm:text-base font-normal text-slate-100 leading-relaxed">
                      {currentRiddle.questionHy}
                    </p>
                  </div>
                )}

                {/* FEEDBACK BANNER (If answered or passed) */}
                {feedback.type && (
                  <div
                    className={`mt-4 p-3.5 rounded-xl border flex items-start gap-2.5 transition-all animate-in fade-in duration-200 ${
                      feedback.type === 'correct'
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                        : feedback.type === 'incorrect'
                        ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                        : 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                    }`}
                  >
                    {feedback.type === 'correct' ? (
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : feedback.type === 'incorrect' ? (
                      <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <FastForward className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs sm:text-sm">
                      <div className="font-bold">{feedback.messageEs}</div>
                      <div className="text-xs opacity-90 mt-0.5">{feedback.messageHy}</div>
                      {feedback.type === 'incorrect' && (
                        <div className="mt-1.5 text-xs bg-black/30 p-2 rounded-lg font-mono text-white">
                          🇪🇸 {feedback.correctAnswerEs} · 🇦🇲 {feedback.correctAnswerHy}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ANSWER INPUT FORM */}
                <form onSubmit={handleCheckAnswer} className="mt-4 flex flex-col gap-2.5">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Escribe la respuesta (o en armenio)..."
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all pr-24 font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!userAnswer.trim()}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all shadow-md flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Comprobar</span>
                    </button>
                  </div>

                  {/* GAME ACTIONS ROW */}
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {/* Pasapalabra Button */}
                    <button
                      type="button"
                      onClick={handlePass}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-orange-950/40 flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <FastForward className="w-4 h-4" />
                      <span>¡Pasapalabra!</span>
                      <span className="text-[10px] opacity-80">(Բաց թողնել)</span>
                    </button>

                    {/* DEDICATED ANSWER BUTTON (Requirement: "отдельно кнопка ответов тоже была") */}
                    <button
                      type="button"
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showAnswer ? 'Ocultar respuesta' : 'Ver respuesta'}</span>
                    </button>
                  </div>

                  {/* DEDICATED ANSWER REVEAL PANEL */}
                  {showAnswer && (
                    <div className="mt-2 p-3.5 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-1">
                        <span>🎯 Respuesta Oficial / Պատասխան՝</span>
                        <button
                          type="button"
                          onClick={() => speakSpanish(currentRiddle.answerEs)}
                          className="hover:underline flex items-center gap-1 text-[11px] text-cyan-300"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Escuchar</span>
                        </button>
                      </div>
                      <div className="text-base font-extrabold text-white flex items-center gap-2">
                        <span className="text-emerald-400">🇪🇸 {currentRiddle.answerEs}</span>
                        <span className="text-slate-500">—</span>
                        <span className="text-amber-200">🇦🇲 {currentRiddle.answerHy}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Puedes marcarlo abajo como acierto o continuar jugando libremente.
                      </p>
                    </div>
                  )}

                  {/* ORAL / SELF-SCORING ROW (For interactive study) */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Calificación rápida:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMarkStatus('correct')}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 flex items-center gap-1 transition-colors"
                        title="Marcar como Correcto y continuar"
                      >
                        <Check className="w-3 h-3" />
                        <span>Acierto (Ճիշտ)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkStatus('incorrect')}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 flex items-center gap-1 transition-colors"
                        title="Marcar como Fallo y continuar"
                      >
                        <X className="w-3 h-3" />
                        <span>Fallo (Սխալ)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => advanceToNext(currentIndex)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                        title="Siguiente sin marcar"
                      >
                        <span>Siguiente</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Category Quick Navigator */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-400">Temas / Թեմաներ:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSelectRiddle(0)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    📅 Días (1-9)
                  </button>
                  <button
                    onClick={() => handleSelectRiddle(9)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    🎨 Colores (10-18)
                  </button>
                  <button
                    onClick={() => handleSelectRiddle(18)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    ✈️ Viajes (19-27)
                  </button>
                </div>
              </div>

              {/* Instructions Reminder Note */}
              <div className="text-[12px] text-slate-400 bg-blue-950/20 border border-blue-900/40 rounded-xl p-3 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300">Կանոններ՝</strong> Սեղմեք իսպաներեն հարցի վրա՝ հայերեն թարգմանությունը տեսնելու համար։ Եթե պատասխանը սխալ է, խաղը շարունակվում է։ Օգտագործեք «Ver respuesta» կոճակը պատասխանը բացելու համար։
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: SPEAKING QUESTIONS ===================== */}
        {activeTab === 'speaking' && (
          <div className="max-w-4xl w-full mx-auto my-auto flex flex-col gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    ⭐ Preguntas adicionales para hablar
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    Լրացուցիչ խոսակցական հարցեր (7 հարց)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Հանելուկներից հետո պատասխանիր ամբողջական նախադասություններով։
                  </p>
                </div>

                <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-800 text-cyan-300 whitespace-nowrap">
                  Pregunta {activeSpeakingIdx + 1} de {SPEAKING_QUESTIONS.length}
                </div>
              </div>

              {/* Active Speaking Card */}
              {(() => {
                const q = SPEAKING_QUESTIONS[activeSpeakingIdx];
                const isRevealed = speakingArmenianRevealed[q.id];

                return (
                  <div className="py-6 flex flex-col gap-5">
                    {/* Spanish Question Box (Click to reveal armenian) */}
                    <div
                      onClick={() =>
                        setSpeakingArmenianRevealed((prev) => ({
                          ...prev,
                          [q.id]: !prev[q.id]
                        }))
                      }
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer group p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 border border-blue-500/30 hover:border-cyan-400 transition-all shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <span>🇪🇸</span> Pregunta #{q.id} (Haz clic para ver traducción)
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakSpanish(q.questionEs);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-cyan-300 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Escuchar</span>
                        </button>
                      </div>

                      <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                        {q.questionEs}
                      </p>

                      <div className="mt-3 text-xs text-cyan-400 font-medium">
                        {isRevealed
                          ? '🇦🇲 Թարգմանությունը բացված է (սեղմեք փակելու համար)'
                          : '👉 Սեղմեք տեքստի վրա՝ հայերեն թարգմանությունը տեսնելու համար'}
                      </div>
                    </div>

                    {/* Armenian Translation */}
                    {isRevealed && (
                      <div className="p-5 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 animate-in fade-in duration-200">
                        <span className="text-xs font-bold text-indigo-300 block mb-1">
                          🇦🇲 Հայերեն հարցը՝
                        </span>
                        <p className="text-lg font-medium text-slate-100">
                          {q.questionHy}
                        </p>
                      </div>
                    )}

                    {/* Suggested sentence starter */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-slate-400">
                        💡 Ինչպե՞ս սկսել պատասխանը (Inicio de respuesta):
                      </span>
                      <div className="text-sm font-semibold text-emerald-400">
                        🇪🇸 {q.suggestedStartEs}
                      </div>
                      <div className="text-xs text-slate-400">
                        🇦🇲 {q.suggestedStartHy}
                      </div>
                    </div>

                    {/* Navigation Buttons for Speaking Cards */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                      <button
                        onClick={() =>
                          setActiveSpeakingIdx(
                            (activeSpeakingIdx - 1 + SPEAKING_QUESTIONS.length) %
                              SPEAKING_QUESTIONS.length
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        Anterior
                      </button>

                      <div className="flex gap-1.5">
                        {SPEAKING_QUESTIONS.map((item, idx) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveSpeakingIdx(idx)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                              idx === activeSpeakingIdx
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setActiveSpeakingIdx(
                            (activeSpeakingIdx + 1) % SPEAKING_QUESTIONS.length
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: ALL 27 RIDDLES DIRECT LIST ===================== */}
        {activeTab === 'all-riddles' && (
          <div className="max-w-4xl w-full mx-auto my-4 flex flex-col gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="border-b border-slate-800 pb-4 mb-4">
                <h2 className="text-xl font-bold text-white">
                  27 preguntas con respuestas | 27 հարց պատասխաններով
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Կարող եք սեղմել ցանկացած հարցի վրա՝ այն Rosco խաղում բացելու համար կամ տեսնել թարգմանությունը։
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5 max-h-[70vh] overflow-y-auto pr-1">
                {RIDDLES.map((item, idx) => {
                  const status = statusMap[item.id];
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl font-black flex items-center justify-center shrink-0 text-white ${
                            status === 'correct'
                              ? 'bg-emerald-600'
                              : status === 'incorrect'
                              ? 'bg-rose-600'
                              : status === 'passed'
                              ? 'bg-amber-600'
                              : 'bg-blue-600'
                          }`}
                        >
                          {item.letter}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-cyan-400">
                              #{item.id} · {item.titleEs}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              ({item.categoryEs})
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-200 mt-0.5">
                            {item.questionEs}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            🇦🇲 {item.questionHy}
                          </p>
                          <div className="text-xs font-bold text-emerald-400 mt-1.5">
                            🇪🇸 {item.answerEs} — 🇦🇲 {item.answerHy}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleSelectRiddle(idx);
                          setActiveTab('game');
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        Jugar en Rosco
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VICTORY / COMPLETION MODAL */}
        {isCompleted && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                <Trophy className="w-9 h-9" />
              </div>

              <h2 className="text-2xl font-black text-white">
                ¡El Rosco Completado!
              </h2>
              <p className="text-sm text-cyan-300 font-medium mt-1">
                Շնորհավորանքներ։ Բոլոր 27 հարցերն ավարտված են։
              </p>

              <div className="grid grid-cols-2 gap-3 w-full my-5">
                <div className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-2xl">
                  <div className="text-3xl font-black text-emerald-400 font-mono tabular-nums">
                    {correctCount}
                  </div>
                  <div className="text-xs font-semibold text-emerald-300 mt-0.5">
                    Aciertos (Ճիշտ)
                  </div>
                </div>

                <div className="bg-rose-950/60 border border-rose-500/50 p-3 rounded-2xl">
                  <div className="text-3xl font-black text-rose-400 font-mono tabular-nums">
                    {incorrectCount}
                  </div>
                  <div className="text-xs font-semibold text-rose-300 mt-0.5">
                    Fallos (Սխալ)
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={handleResetGame}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg transition-all"
                >
                  Jugar de nuevo (Կրկին խաղալ)
                </button>
                <button
                  onClick={() => setIsCompleted(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all"
                >
                  Ver Rosco
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 px-4 py-3 text-center text-xs text-slate-500">
        <span>Pasapalabra en español y armenio · 27 Adivinanzas · Nivel A1–A2</span>
      </footer>
    </div>
  );
}
