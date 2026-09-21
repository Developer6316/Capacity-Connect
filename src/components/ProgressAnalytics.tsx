import React, { useState } from 'react';
import { 
  BarChart3, 
  Trophy, 
  Flame, 
  Sparkles, 
  Target, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  TrendingUp,
  BrainCircuit,
  Compass,
  Zap,
  ArrowRight,
  Download,
  FileText
} from 'lucide-react';
import { UserStats, AchievementBadge, SubjectId, StudyPath, UserProfile } from '../types';
import { StreakActivityWidget } from './StreakActivityWidget';
import { ProgressReportModal } from './ProgressReportModal';

interface ProgressAnalyticsProps {
  stats: UserStats;
  badges: AchievementBadge[];
  paths: StudyPath[];
  onOpenTutorWithTopic: (topic: string) => void;
  currentUser?: UserProfile | null;
}

const WEEKLY_STUDY_HOURS = [
  { day: 'Mon', hours: 2.2, target: 1.5 },
  { day: 'Tue', hours: 1.8, target: 1.5 },
  { day: 'Wed', hours: 2.5, target: 1.5 },
  { day: 'Thu', hours: 1.2, target: 1.5 },
  { day: 'Fri', hours: 2.0, target: 1.5 },
  { day: 'Sat', hours: 3.4, target: 2.0 },
  { day: 'Sun', hours: 2.8, target: 2.0 },
];

const DIAGNOSTIC_WEAK_AREAS = [
  {
    subject: 'AP Calculus BC',
    topic: 'Taylor Series Lagrange Error Bound',
    accuracy: '42%',
    urgency: 'high',
    recommendation: 'Review formula R_n(x) <= M/(n+1)! * |x-a|^(n+1) and maximum derivative estimation on the interval.',
  },
  {
    subject: 'AP Physics C',
    topic: 'Rotational Moment of Inertia for Non-Uniform Rods',
    accuracy: '58%',
    urgency: 'medium',
    recommendation: 'Practice linear density dm = λ(x) dx integration techniques.',
  },
  {
    subject: 'AP Biology',
    topic: 'Signal Transduction Cascades & Second Messengers',
    accuracy: '64%',
    urgency: 'medium',
    recommendation: 'Review cAMP, IP3, and Ca2+ amplification cascades.',
  },
];

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  stats,
  badges,
  paths,
  onOpenTutorWithTopic,
  currentUser,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const maxWeeklyHour = 4.0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-black/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="font-mono uppercase tracking-wider">Mastery Analytics & Exam Readiness</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Academic Performance & Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Real-time analytics tracking curriculum mastery, study time investment, weak spot alerts, and achievement milestones across all AP & standardized test tracks.
          </p>
        </div>

        {/* Actions & Global Cohort Percentile Badge */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-slate-950/80 border border-amber-500/30 p-3.5 sm:p-4 rounded-xl flex items-center space-x-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Cohort Percentile</span>
              <span className="text-sm sm:text-base font-bold text-white font-display">Top 3.5% Nationwide</span>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] border border-indigo-400/30"
            title="Download verified A4 PDF transcript of study progress and mastery metrics"
          >
            <Download className="w-4 h-4 text-cyan-200" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Experience (XP)</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-display text-white">{stats.xp.toLocaleString()}</span>
            <span className="text-xs text-amber-400 font-semibold font-mono">+{stats.comboMultiplier}x Active</span>
          </div>
          <p className="text-[11px] text-slate-500">Level {stats.level} • {stats.levelTitle}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Daily Streak Retention</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-display text-amber-400">{stats.streakDays} Days</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-500">Consistent daily study bonus</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Flashcards Mastered (SRS)</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-display text-cyan-400">{stats.flashcardsReviewed}</span>
            <span className="text-xs text-cyan-300 font-mono">Box 4 & 5</span>
          </div>
          <p className="text-[11px] text-slate-500">High long-term retention</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Focus Hours</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-display text-emerald-400">{(stats.studyMinutesTotal / 60).toFixed(1)} hrs</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-[11px] text-slate-500">Pomodoro & live circle sessions</p>
        </div>
      </div>

      {/* 30-Day Contribution Heatmap Streak Activity Widget */}
      <StreakActivityWidget />

      {/* Charts & Subject Mastery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Time Bar Chart */}
        <div className="lg:col-span-6 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Weekly Focus Time Distribution (Hours)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Target: 14 hrs/wk</span>
          </div>

          <div className="pt-4 flex items-end justify-between h-44 gap-2">
            {WEEKLY_STUDY_HOURS.map((item) => {
              const heightPct = Math.round((item.hours / maxWeeklyHour) * 100);
              const isOverTarget = item.hours >= item.target;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-cyan-300 transition-colors">
                    {item.hours}h
                  </span>
                  <div className="w-full max-w-[32px] bg-slate-800 rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${
                        isOverTarget
                          ? 'bg-gradient-to-t from-indigo-600 to-cyan-400'
                          : 'bg-gradient-to-t from-slate-700 to-indigo-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Mastery Proficiency Breakdown */}
        <div className="lg:col-span-6 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Curriculum Subject Readiness</span>
            </h3>
            <span className="text-xs text-slate-400">AP Scale: 1 - 5</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {paths.map((path) => {
              return (
                <div key={path.id} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">{path.title}</span>
                    <span className="font-mono font-bold text-cyan-400">{path.masteryScore}% Mastery</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full transition-all duration-500"
                      style={{ width: `${path.masteryScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{path.completedUnits} of {path.totalUnits} Units Complete</span>
                    <span>Target: {path.targetScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Diagnostic Gap Detection & AI Intervention Alerts */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertCircle className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white">
              AI Diagnostic Gap Detection (Weak Spots Prioritization)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Automated by Gemini Analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DIAGNOSTIC_WEAK_AREAS.map((weak, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                    {weak.subject}
                  </span>
                  <span className="text-rose-400 font-bold font-mono text-xs">
                    {weak.accuracy} Accuracy
                  </span>
                </div>
                <h4 className="font-semibold text-slate-100 text-xs pt-1">
                  {weak.topic}
                </h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {weak.recommendation}
                </p>
              </div>

              <button
                onClick={() => onOpenTutorWithTopic(`${weak.subject}: ${weak.topic}. How can I master this topic and avoid common mistakes?`)}
                className="w-full mt-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/25 transition-all"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-200" />
                <span>Review with Socratic AI</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Unlocked Badges & Honors</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {badges.filter(b => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border text-xs space-y-2 text-center transition-all ${
                badge.unlocked
                  ? 'bg-slate-800/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-lg ${
                badge.unlocked
                  ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400'
                  : 'bg-slate-800 border border-slate-700 text-slate-500'
              }`}>
                {badge.iconName === 'Sigma' && 'Σ'}
                {badge.iconName === 'Flame' && <Flame className="w-6 h-6" />}
                {badge.iconName === 'Sparkles' && <Sparkles className="w-6 h-6" />}
                {badge.iconName === 'Users' && <Target className="w-6 h-6" />}
                {badge.iconName === 'Compass' && <Compass className="w-6 h-6" />}
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-xs">{badge.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{badge.description}</p>
              </div>

              {badge.unlocked ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block font-medium">
                  ✓ Unlocked
                </span>
              ) : (
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full"
                      style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {badge.progress} / {badge.maxProgress}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Downloadable PDF Summary Report Modal */}
      <ProgressReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        stats={stats}
        paths={paths}
        badges={badges}
        currentUser={currentUser}
      />
    </div>
  );
};
