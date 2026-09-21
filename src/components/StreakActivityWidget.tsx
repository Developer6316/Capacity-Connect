import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Trophy, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Info,
  ChevronRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StreakDayActivity, StreakSummary } from '../types';
import { 
  loadStreakHistory, 
  saveStreakHistory, 
  computeStreakSummary, 
  calculateContributionLevel,
  toggleStreakFreezeInStorage 
} from '../data/streakActivityData';
import { sound } from '../utils/audioSynth';

interface StreakActivityWidgetProps {
  onAddXp?: (amount: number) => void;
  className?: string;
  variant?: 'full' | 'compact';
}

export const StreakActivityWidget: React.FC<StreakActivityWidgetProps> = ({
  onAddXp,
  className = '',
  variant = 'full',
}) => {
  const [days, setDays] = useState<StreakDayActivity[]>(() => loadStreakHistory());
  const [selectedDay, setSelectedDay] = useState<StreakDayActivity | null>(() => {
    const history = loadStreakHistory();
    return history[history.length - 1] || null;
  });
  const [hoveredDay, setHoveredDay] = useState<StreakDayActivity | null>(null);
  const [viewMode, setViewMode] = useState<'matrix' | 'timeline'>('matrix');
  const [showFreezeNotification, setShowFreezeNotification] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  const summary = useMemo(() => computeStreakSummary(days), [days]);

  // Active day to display in detail inspector (hovered takes priority over selected)
  const activeInspectorDay = hoveredDay || selectedDay || days[days.length - 1];

  // Group 30 days into 5 weeks for GitHub-style contribution matrix (Sunday to Saturday)
  const weekColumns = useMemo(() => {
    // Determine the calendar layout
    const columns: (StreakDayActivity | null)[][] = [];
    let currentWeek: (StreakDayActivity | null)[] = Array(7).fill(null);

    days.forEach((day, index) => {
      const dayOfWeek = day.dayOfWeek; // 0 = Sun, 6 = Sat
      currentWeek[dayOfWeek] = day;

      // If Saturday or last day, push column and start new week
      if (dayOfWeek === 6 || index === days.length - 1) {
        columns.push([...currentWeek]);
        currentWeek = Array(7).fill(null);
      }
    });

    return columns;
  }, [days]);

  // Color classes for intensity levels 0-4
  const getLevelStyle = (level: 0 | 1 | 2 | 3 | 4, isToday: boolean, isSelected: boolean) => {
    let base = '';
    switch (level) {
      case 0:
        base = 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/60';
        break;
      case 1:
        base = 'bg-emerald-950/90 hover:bg-emerald-900 border-emerald-800 text-emerald-400';
        break;
      case 2:
        base = 'bg-emerald-800/90 hover:bg-emerald-700 border-emerald-600 text-emerald-200';
        break;
      case 3:
        base = 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-sm shadow-emerald-600/30';
        break;
      case 4:
        base = 'bg-emerald-400 hover:bg-emerald-300 border-emerald-200 text-emerald-950 font-bold shadow-md shadow-emerald-400/40';
        break;
    }

    const todayRing = isToday ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-900' : '';
    const selectedRing = isSelected ? 'scale-110 z-10 ring-2 ring-indigo-400' : '';

    return `${base} ${todayRing} ${selectedRing}`;
  };

  // Quick action: Log 15 minutes of study to today
  const handleQuickLog = () => {
    sound.playSuccess();
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#6366f1', '#38bdf8', '#fbbf24']
    });

    const updated = [...days];
    const todayIndex = updated.findIndex(d => d.isToday);
    if (todayIndex !== -1) {
      const current = updated[todayIndex];
      const newMinutes = current.minutes + 15;
      const newXp = current.xpEarned + 100;
      const newLevel = calculateContributionLevel(newMinutes);
      
      const newDay: StreakDayActivity = {
        ...current,
        minutes: newMinutes,
        xpEarned: newXp,
        level: newLevel,
        flashcardsReviewed: current.flashcardsReviewed + 5,
        topics: current.topics.includes('Interactive Session') 
          ? current.topics 
          : [...current.topics, 'Capacity Connect • Study Sprint']
      };

      updated[todayIndex] = newDay;
      setDays(updated);
      saveStreakHistory(updated);
      setSelectedDay(newDay);
      setJustLogged(true);
      setTimeout(() => setJustLogged(false), 3000);

      if (onAddXp) {
        onAddXp(100);
      }
    }
  };

  // Toggle Streak Freeze Shield
  const handleToggleFreeze = () => {
    sound.playClick();
    const nextState = !summary.streakFreezeActive;
    toggleStreakFreezeInStorage(nextState);
    setDays([...days]); // trigger re-computation
    setShowFreezeNotification(true);
    setTimeout(() => setShowFreezeNotification(false), 4000);
  };

  // Reset to initial baseline for testing
  const handleResetHistory = () => {
    sound.playClick();
    if (confirm('Reset streak activity data to standard 30-day baseline?')) {
      localStorage.removeItem('capacity_connect_streak_history_v2');
      const fresh = loadStreakHistory();
      setDays(fresh);
      setSelectedDay(fresh[fresh.length - 1]);
    }
  };

  return (
    <div className={`rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden transition-all ${className}`}>
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                Active Streak Hub
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Last 30 Days Study Activity
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
              <span>Study Streak Heatmap</span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 font-mono font-medium">
                {summary.activeDaysLast30} / 30 Days Active
              </span>
            </h2>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Active streak counter */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-amber-500/30 shadow-md shadow-amber-500/10">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Current Streak</span>
                <span className="text-base font-bold text-amber-300 font-display">
                  {summary.currentStreak} Days
                </span>
              </div>
            </div>

            {/* Total Minutes in 30 Days */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">30-Day Volume</span>
                <span className="text-base font-bold text-slate-200 font-display">
                  {(summary.totalMinutesLast30 / 60).toFixed(1)} hrs
                </span>
              </div>
            </div>

            {/* Streak Freeze Shield Toggle */}
            <button
              onClick={handleToggleFreeze}
              title={summary.streakFreezeActive ? 'Streak Freeze Active: Rest days are protected' : 'Equip Streak Freeze Shield'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                summary.streakFreezeActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {summary.streakFreezeActive ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Freeze Shield Active</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-slate-400" />
                  <span>Equip Freeze</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Freeze Shield Notification Toast */}
        {showFreezeNotification && (
          <div className="mt-3 p-2.5 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-cyan-200 text-xs flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              {summary.streakFreezeActive 
                ? 'Streak Shield Armed: Your active streak will be preserved even if you take an off-day tomorrow!'
                : 'Streak Shield Disarmed: Resume standard daily study intervals.'}
            </span>
            <button 
              onClick={() => setShowFreezeNotification(false)}
              className="text-cyan-400 hover:text-white text-[11px] font-bold underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Main Heatmap Visualization Area */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Controls: View Switcher & Quick Log Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Layout:</span>
            <div className="inline-flex p-0.5 rounded-lg bg-slate-950 border border-slate-800">
              <button
                onClick={() => { sound.playClick(); setViewMode('matrix'); }}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  viewMode === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Contribution Matrix
              </button>
              <button
                onClick={() => { sound.playClick(); setViewMode('timeline'); }}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  viewMode === 'timeline'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                30-Day Timeline
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickLog}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log +15m Today (+100 XP)</span>
            </button>

            <button
              onClick={handleResetHistory}
              title="Reset data to standard sample"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Heatmap Grid Rendering */}
        {viewMode === 'matrix' ? (
          /* Contribution Matrix: Weekday Rows (Sun-Sat) x Week Columns */
          <div className="bg-slate-950/60 rounded-xl p-4 sm:p-5 border border-slate-800/80 overflow-x-auto">
            <div className="min-w-[480px]">
              {/* Month Header Banner */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pb-2 border-b border-slate-800/60 mb-3">
                <span>← 30 Days Ago ({days[0]?.dayLabel})</span>
                <span className="text-indigo-400 font-semibold">Today ({days[days.length - 1]?.dayLabel}) →</span>
              </div>

              <div className="flex gap-2">
                {/* Weekday Labels Column */}
                <div className="flex flex-col justify-between text-[10px] text-slate-500 font-mono pr-2 py-0.5 select-none shrink-0 w-8">
                  <span className="h-6 flex items-center">Sun</span>
                  <span className="h-6 flex items-center font-semibold text-slate-400">Mon</span>
                  <span className="h-6 flex items-center">Tue</span>
                  <span className="h-6 flex items-center font-semibold text-slate-400">Wed</span>
                  <span className="h-6 flex items-center">Thu</span>
                  <span className="h-6 flex items-center font-semibold text-slate-400">Fri</span>
                  <span className="h-6 flex items-center">Sat</span>
                </div>

                {/* Week Columns */}
                <div className="flex gap-2.5 flex-1 justify-between">
                  {weekColumns.map((week, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-2 flex-1">
                      {week.map((day, rowIdx) => {
                        if (!day) {
                          return (
                            <div 
                              key={rowIdx} 
                              className="h-6 w-full rounded-md bg-transparent" 
                            />
                          );
                        }

                        const isSelected = selectedDay?.dateStr === day.dateStr;

                        return (
                          <div
                            key={day.dateStr}
                            onClick={() => {
                              sound.playClick();
                              setSelectedDay(day);
                            }}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={`h-6 w-full rounded-md border cursor-pointer transition-all duration-200 flex items-center justify-center relative group ${getLevelStyle(
                              day.level,
                              day.isToday,
                              isSelected
                            )}`}
                          >
                            {/* Inner miniature dot or indicator for today */}
                            {day.isToday && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping absolute" />
                            )}

                            {/* Floating Micro-Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                              <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-white whitespace-nowrap shadow-2xl space-y-0.5">
                                <div className="font-bold flex items-center gap-1.5">
                                  <span>{day.fullDateLabel}</span>
                                  {day.isToday && <span className="text-cyan-400">(Today)</span>}
                                </div>
                                <div className="text-slate-300 flex items-center gap-2 text-[10px]">
                                  <span className="text-emerald-400 font-semibold">{day.minutes} min studied</span>
                                  <span>•</span>
                                  <span className="text-amber-300">+{day.xpEarned} XP</span>
                                </div>
                              </div>
                              <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Continuous 30-Day Timeline Grid */
          <div className="bg-slate-950/60 rounded-xl p-4 sm:p-5 border border-slate-800/80">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
              {days.map((day) => {
                const isSelected = selectedDay?.dateStr === day.dateStr;
                return (
                  <button
                    key={day.dateStr}
                    onClick={() => {
                      sound.playClick();
                      setSelectedDay(day);
                    }}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center transition-all min-h-[58px] relative ${getLevelStyle(
                      day.level,
                      day.isToday,
                      isSelected
                    )}`}
                  >
                    <span className="text-[10px] font-mono text-slate-400">{day.dayOfWeekShort}</span>
                    <span className="text-xs font-bold text-white">
                      {day.dateStr.split('-')[2]}
                    </span>
                    <span className={`text-[9px] font-semibold ${day.minutes > 0 ? 'text-emerald-300' : 'text-slate-500'}`}>
                      {day.minutes > 0 ? `${day.minutes}m` : '—'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Study Intensity:</span>
            <span className="text-[10px] text-slate-500">Less</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700" title="0 min (Inactive)" />
              <span className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-800" title="1-24 min" />
              <span className="w-3.5 h-3.5 rounded bg-emerald-800 border border-emerald-600" title="25-49 min" />
              <span className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-400" title="50-79 min" />
              <span className="w-3.5 h-3.5 rounded bg-emerald-400 border border-emerald-200" title="80+ min (High Focus)" />
            </div>
            <span className="text-[10px] text-slate-500">More</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Cyan Ring: Today
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Best Streak: {summary.longestStreak} Days
            </span>
          </div>
        </div>

        {/* Selected Day Deep Dive Inspector Card */}
        {activeInspectorDay && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-3 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white text-sm">
                  {activeInspectorDay.fullDateLabel}
                </span>
                {activeInspectorDay.isToday && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Today
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeInspectorDay.minutes > 0 ? `${activeInspectorDay.minutes} Minutes Studied` : 'Rest Day (0 min)'}
                </span>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  +{activeInspectorDay.xpEarned} XP Earned
                </span>
              </div>
            </div>

            {/* Day Activity Details & Topics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-1.5">
                <span className="text-slate-400 block font-medium text-[11px]">Curriculum Topics Covered:</span>
                {activeInspectorDay.topics.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {activeInspectorDay.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 text-[11px] flex items-center gap-1 font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-[11px]">
                    Rest day logged. No active practice recorded for this date.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Flashcards</span>
                  <span className="text-white font-bold">{activeInspectorDay.flashcardsReviewed} reviewed</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Quizzes</span>
                  <span className="text-white font-bold">{activeInspectorDay.quizzesCompleted} completed</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status</span>
                  <span className={`font-bold ${activeInspectorDay.minutes > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {activeInspectorDay.minutes > 0 ? 'Consistent' : 'Rest'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
