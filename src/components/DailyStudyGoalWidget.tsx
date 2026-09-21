import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Clock, 
  Play, 
  Pause, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Trophy, 
  Plus, 
  RotateCcw,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audioSynth';
import { DailyStudyGoal } from '../types';

interface DailyStudyGoalWidgetProps {
  goal: DailyStudyGoal;
  onUpdateGoal: (updatedGoal: DailyStudyGoal) => void;
  onAddXp: (amount: number) => void;
  variant?: 'compact' | 'full';
}

export const DailyStudyGoalWidget: React.FC<DailyStudyGoalWidgetProps> = ({
  goal,
  onUpdateGoal,
  onAddXp,
  variant = 'full',
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [targetInput, setTargetInput] = useState(goal.targetMinutes.toString());
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Live stopwatch effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev + 1;
          // Every 60 seconds of focused study, add 1 minute to the goal!
          if (next % 60 === 0) {
            handleAddMinutes(1, false);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const triggerCelebration = () => {
    sound.playLevelUp();
    confetti({
      particleCount: 130,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);
    setShowCelebrationModal(true);
  };

  const handleAddMinutes = (minutes: number, shouldTriggerCelebration = true) => {
    const newMinutes = goal.minutesStudiedToday + minutes;
    const wasAlreadyMet = goal.goalMetToday;
    const isNowMet = newMinutes >= goal.targetMinutes;

    const updated: DailyStudyGoal = {
      ...goal,
      minutesStudiedToday: newMinutes,
      goalMetToday: isNowMet,
      sessionsLogged: goal.sessionsLogged + 1,
    };

    onUpdateGoal(updated);
    onAddXp(minutes * 3); // 3 XP per minute studied

    if (!wasAlreadyMet && isNowMet && shouldTriggerCelebration) {
      onAddXp(120); // Big bonus for reaching goal!
      triggerCelebration();
    } else if (shouldTriggerCelebration) {
      sound.playCorrect(1);
    }
  };

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(targetInput, 10);
    if (!isNaN(num) && num >= 5 && num <= 480) {
      const isMet = goal.minutesStudiedToday >= num;
      onUpdateGoal({
        ...goal,
        targetMinutes: num,
        goalMetToday: isMet,
      });
      setIsEditingGoal(false);
      sound.playCorrect(1);
      if (!goal.goalMetToday && isMet) {
        triggerCelebration();
      }
    } else {
      alert('Please enter a valid study goal between 5 and 480 minutes.');
    }
  };

  const progressPercent = Math.min(100, Math.round((goal.minutesStudiedToday / goal.targetMinutes) * 100));
  const remainingMinutes = Math.max(0, goal.targetMinutes - goal.minutesStudiedToday);

  // Compact variant for Navbar or small cards
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm text-xs">
        <Target className={`w-3.5 h-3.5 ${goal.goalMetToday ? 'text-emerald-400' : 'text-indigo-400'}`} />
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400">Goal:</span>
          <span className="font-semibold text-slate-200">
            {goal.minutesStudiedToday}/{goal.targetMinutes}m
          </span>
          <span className={`text-[10px] font-bold ${goal.goalMetToday ? 'text-emerald-400' : 'text-indigo-400'}`}>
            ({progressPercent}%)
          </span>
        </div>
      </div>
    );
  }

  // Full dashboard widget
  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-indigo-950/30 border border-slate-800 p-5 shadow-xl shadow-black/30 relative overflow-hidden">
      {/* Background glow when goal met */}
      {goal.goalMetToday && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Info & Progress Bar */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                goal.goalMetToday ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
              }`}>
                {goal.goalMetToday ? <PartyPopper className="w-4 h-4 animate-bounce" /> : <Target className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Daily Study Goal
                  </span>
                  {goal.goalMetToday ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Goal Achieved! (+120 XP)
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-mono border border-indigo-500/25">
                      {remainingMinutes}m remaining
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Track active focus minutes across lessons, quizzes, and problem-solving.
                </p>
              </div>
            </div>

            {/* Change Target button */}
            <button
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
            >
              {isEditingGoal ? 'Cancel' : 'Change Target'}
            </button>
          </div>

          {/* Edit Target Inline Form */}
          {isEditingGoal && (
            <form onSubmit={handleSaveTarget} className="flex items-center space-x-2 p-2 bg-slate-950/70 rounded-xl border border-slate-800 animate-in fade-in">
              <span className="text-xs text-slate-300 font-medium">Daily Target:</span>
              <input
                type="number"
                min={5}
                max={480}
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white text-center focus:outline-none focus:border-indigo-500 font-bold"
              />
              <span className="text-xs text-slate-400">minutes</span>
              <div className="flex items-center space-x-1.5 ml-2">
                {[30, 45, 60, 90].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setTargetInput(quick.toString())}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:bg-slate-700"
                  >
                    {quick}m
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm ml-auto"
              >
                Set Goal
              </button>
            </form>
          )}

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">{goal.minutesStudiedToday}</span>
                <span className="text-slate-400">/ {goal.targetMinutes} minutes completed</span>
              </div>
              <span className={`font-mono font-bold ${goal.goalMetToday ? 'text-emerald-400' : 'text-indigo-400'}`}>
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  goal.goalMetToday
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Logging & Live Focus Timer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-5">
          {/* Live Focus Stopwatch */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between sm:justify-start space-x-3">
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-mono">
                Active Focus Timer
              </span>
              <span className="font-mono text-sm font-bold text-slate-200">
                {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                {String(timerSeconds % 60).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-2 rounded-lg text-white font-semibold text-xs flex items-center space-x-1 transition-all ${
                isTimerRunning
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20'
              }`}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
            </button>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleAddMinutes(15)}
              className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-medium transition-all"
              title="Add 15 minutes of study (+45 XP)"
            >
              +15m
            </button>
            <button
              onClick={() => handleAddMinutes(30)}
              className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-medium transition-all"
              title="Add 30 minutes of study (+90 XP)"
            >
              +30m
            </button>
            {goal.goalMetToday && (
              <button
                onClick={triggerCelebration}
                className="px-2.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all flex items-center gap-1"
                title="Re-play victory celebration animation"
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Celebrate!</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Congratulatory Celebration Modal */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-emerald-500/10 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/30">
                Daily Goal Conquered!
              </span>
              <h3 className="text-2xl font-bold font-display text-white tracking-tight pt-1">
                Outstanding Dedication! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                You hit your target of <strong>{goal.targetMinutes} minutes</strong> of focused study today! Consistent effort builds unstoppable mastery.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Time Studied</span>
                <span className="text-lg font-bold text-white">{goal.minutesStudiedToday} mins</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Bonus Earned</span>
                <span className="text-lg font-bold text-amber-400">+120 XP ⚡</span>
              </div>
            </div>

            <button
              onClick={() => setShowCelebrationModal(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 transition-all"
            >
              Keep Crushing It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
