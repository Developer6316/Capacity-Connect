import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Flame, 
  Zap, 
  TrendingUp, 
  Search, 
  Award, 
  Sparkles, 
  Star, 
  Shield, 
  Users, 
  ArrowUpRight, 
  CheckCircle2, 
  ChevronUp, 
  GraduationCap, 
  Filter,
  Swords
} from 'lucide-react';
import { LeaderboardEntry, UserProfile, UserStats } from '../types';
import { sound } from '../utils/audioSynth';

interface GlobalLeaderboardProps {
  currentUser: UserProfile | null;
  userStats: UserStats;
  onNavigateToQuiz?: () => void;
  onNavigateToFlashcards?: () => void;
}

const BASE_TRAINEES: LeaderboardEntry[] = [
  {
    id: 'trainee-lead-1',
    name: 'Aarav Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    role: 'Trainee',
    department: 'Computer Science & Engineering',
    institution: 'IIT Bombay',
    xp: 6420,
    level: 18,
    levelTitle: 'Grandmaster of Algorithms',
    streakDays: 24,
    quizzesCompleted: 62,
    division: 'Grandmaster',
    recentBadge: 'DSA Titan',
  },
  {
    id: 'trainee-lead-2',
    name: 'Priya Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'Trainee',
    department: 'AI & Data Science',
    institution: 'IIT Madras',
    xp: 5890,
    level: 16,
    levelTitle: 'Deep Learning Pioneer',
    streakDays: 19,
    quizzesCompleted: 54,
    division: 'Diamond',
    recentBadge: 'Matrix Master',
  },
  {
    id: 'trainee-lead-3',
    name: 'Kavya Subramanian',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    role: 'Trainee',
    department: 'India Curricula & NPTEL',
    institution: 'Anna University',
    xp: 5120,
    level: 15,
    levelTitle: 'Curriculum Vanguard',
    streakDays: 17,
    quizzesCompleted: 48,
    division: 'Diamond',
    recentBadge: 'NPTEL Scholar',
  },
  {
    id: 'trainee-lead-4',
    name: 'Rohan Varma',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    role: 'Trainee',
    department: 'Cloud & DevOps',
    institution: 'BITS Pilani',
    xp: 4340,
    level: 14,
    levelTitle: 'Infrastructure Architect',
    streakDays: 14,
    quizzesCompleted: 41,
    division: 'Platinum',
    recentBadge: 'Kubernetes Ace',
  },
  {
    id: 'trainee-lead-5',
    name: 'Ananya Roy',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'Trainee',
    department: 'Cybersecurity & Networks',
    institution: 'NIT Trichy',
    xp: 3950,
    level: 13,
    levelTitle: 'Cryptographic Defender',
    streakDays: 11,
    quizzesCompleted: 36,
    division: 'Platinum',
    recentBadge: 'Zero Trust Sentinel',
  },
  {
    id: 'trainee-lead-6',
    name: 'Vikramaditya Sengupta',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Trainee',
    department: 'Computer Science & Engineering',
    institution: 'Delhi Technological University',
    xp: 3410,
    level: 12,
    levelTitle: 'Systems Engineer',
    streakDays: 9,
    quizzesCompleted: 31,
    division: 'Gold',
    recentBadge: 'Kernel Crusader',
  },
  {
    id: 'trainee-lead-7',
    name: 'Meera Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    role: 'Trainee',
    department: 'AI & Data Science',
    institution: 'IIIT Hyderabad',
    xp: 2980,
    level: 11,
    levelTitle: 'Model Evaluator',
    streakDays: 8,
    quizzesCompleted: 27,
    division: 'Gold',
    recentBadge: 'NLP Specialist',
  },
  {
    id: 'trainee-lead-8',
    name: 'Siddharth Joshi',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'Trainee',
    department: 'India Curricula & NPTEL',
    institution: 'Jadavpur University',
    xp: 2650,
    level: 10,
    levelTitle: 'Syllabus Specialist',
    streakDays: 6,
    quizzesCompleted: 22,
    division: 'Silver',
    recentBadge: 'Discrete Math Honors',
  },
];

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  currentUser,
  userStats,
  onNavigateToQuiz,
  onNavigateToFlashcards,
}) => {
  const [timeframe, setTimeframe] = useState<'all-time' | 'weekly' | 'monthly'>('all-time');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically assemble the leaderboard with current user's real-time XP and stats
  const leaderboardData = useMemo(() => {
    const currentUserName = currentUser?.name || 'You (Trainee)';
    const currentUserDept = currentUser?.department || 'Computer Science & Engineering';

    // The user's active entry
    const userEntry: LeaderboardEntry = {
      id: currentUser?.id || 'current-user-active',
      name: currentUserName,
      avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: currentUser?.role || 'Trainee',
      department: currentUserDept,
      institution: 'Capacity Connect National Cohort',
      xp: userStats.xp,
      level: userStats.level,
      levelTitle: userStats.levelTitle || 'Syllabus Strategist',
      streakDays: userStats.streakDays,
      quizzesCompleted: userStats.completedQuizzes || 38,
      division: userStats.level >= 16 ? 'Grandmaster' : userStats.level >= 13 ? 'Diamond' : userStats.level >= 10 ? 'Platinum' : 'Gold',
      recentBadge: 'Active Sprint Contender',
      isCurrentUser: true,
    };

    // Combine and apply time-scale multiplier if simulating weekly / monthly sprints
    const multiplier = timeframe === 'weekly' ? 0.35 : timeframe === 'monthly' ? 0.7 : 1.0;

    const list = [...BASE_TRAINEES, userEntry].map((entry) => ({
      ...entry,
      xp: Math.round(entry.xp * multiplier),
    }));

    // Sort descending by XP, then level
    list.sort((a, b) => b.xp - a.xp || b.level - a.level);

    // Assign rank
    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [currentUser, userStats, timeframe]);

  // Filter by department and search
  const filteredLeaderboard = useMemo(() => {
    return leaderboardData.filter((entry) => {
      const matchesDept = 
        departmentFilter === 'all' || 
        entry.department.toLowerCase().includes(departmentFilter.toLowerCase());
      
      const matchesSearch = 
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.institution && entry.institution.toLowerCase().includes(searchQuery.toLowerCase())) ||
        entry.department.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDept && matchesSearch;
    });
  }, [leaderboardData, departmentFilter, searchQuery]);

  // Current user's rank information
  const currentUserEntry = useMemo(() => {
    return leaderboardData.find((entry) => entry.isCurrentUser);
  }, [leaderboardData]);

  // Identify who is immediately above the user to spur healthy competition
  const nextTarget = useMemo(() => {
    if (!currentUserEntry || !currentUserEntry.rank || currentUserEntry.rank === 1) return null;
    return leaderboardData[currentUserEntry.rank - 2] || null;
  }, [leaderboardData, currentUserEntry]);

  // Top 3 Podium Winners (from full leaderboardData)
  const topThree = useMemo(() => {
    return leaderboardData.slice(0, 3);
  }, [leaderboardData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-mono uppercase tracking-wider">National Trainee Standings • Real-Time Honor Roll</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Global Arena Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Measure your skill mastery, consistency streaks, and exam readiness against peer scholars and engineering cohorts across the country.
            </p>
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="flex items-center p-1 bg-slate-950/90 border border-slate-800 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => {
                setTimeframe('all-time');
                sound.playCorrect(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'all-time'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All-Time
            </button>
            <button
              onClick={() => {
                setTimeframe('weekly');
                sound.playCorrect(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'weekly'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly Sprint
            </button>
            <button
              onClick={() => {
                setTimeframe('monthly');
                sound.playCorrect(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'monthly'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly League
            </button>
          </div>
        </div>
      </div>

      {/* Motivational "Your Position & Climb Goal" Card */}
      {currentUserEntry && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-2 border-indigo-500/50 shadow-lg shadow-indigo-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img
                src={currentUserEntry.avatarUrl}
                alt={currentUserEntry.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-400 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-[10px] font-mono font-bold text-white px-1.5 py-0.2 rounded-full border border-indigo-400">
                #{currentUserEntry.rank}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-indigo-300">Your Current Standing</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  {currentUserEntry.division} League
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{currentUserEntry.name}</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  (Rank #{currentUserEntry.rank} of {leaderboardData.length})
                </span>
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-0.5">
                <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {currentUserEntry.xp.toLocaleString()} XP
                </span>
                <span>•</span>
                <span className="text-cyan-400 font-semibold">Level {currentUserEntry.level}: {currentUserEntry.levelTitle}</span>
                <span>•</span>
                <span className="text-orange-400 font-mono flex items-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  {currentUserEntry.streakDays}-Day Streak
                </span>
              </div>
            </div>
          </div>

          {/* Next Rival Target / Push to Climb */}
          <div className="flex flex-col sm:items-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            {nextTarget ? (
              <div className="text-left sm:text-right space-y-1 mb-2">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 sm:justify-end">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Climb to Rank #{nextTarget.rank}
                </span>
                <p className="text-xs text-slate-300">
                  Only <strong className="text-amber-300 font-mono font-bold">{(nextTarget.xp - currentUserEntry.xp).toLocaleString()} XP</strong> behind{' '}
                  <span className="text-white font-semibold">{nextTarget.name}</span>!
                </p>
              </div>
            ) : (
              <div className="text-left sm:text-right space-y-1 mb-2">
                <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 sm:justify-end">
                  <Crown className="w-3.5 h-3.5" />
                  Pole Position!
                </span>
                <p className="text-xs text-slate-300">You currently hold the #1 national spot in this division.</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {onNavigateToQuiz && (
                <button
                  onClick={() => {
                    sound.playCorrect(1);
                    onNavigateToQuiz();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Start Quiz (+XP)</span>
                </button>
              )}
              {onNavigateToFlashcards && (
                <button
                  onClick={() => {
                    sound.playCorrect(1);
                    onNavigateToFlashcards();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-all border border-slate-700"
                >
                  <span>Leitner SRS</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Champions Podium Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {topThree.map((trainee, index) => {
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;

          let medalColor = 'text-amber-400';
          let borderColor = 'border-amber-500/40';
          let gradientBg = 'from-amber-950/20 via-slate-900 to-slate-900';
          let crownIcon = <Crown className="w-5 h-5 text-amber-400 animate-bounce" />;
          let rankLabel = '1st Place • Grand Champion';

          if (isSecond) {
            medalColor = 'text-slate-300';
            borderColor = 'border-slate-500/40';
            gradientBg = 'from-slate-800/40 via-slate-900 to-slate-900';
            crownIcon = <Medal className="w-5 h-5 text-slate-300" />;
            rankLabel = '2nd Place • Vice Champion';
          } else if (isThird) {
            medalColor = 'text-amber-600';
            borderColor = 'border-amber-700/40';
            gradientBg = 'from-amber-950/10 via-slate-900 to-slate-900';
            crownIcon = <Medal className="w-5 h-5 text-amber-600" />;
            rankLabel = '3rd Place • Bronze Laureate';
          }

          return (
            <div
              key={trainee.id}
              className={`rounded-2xl bg-gradient-to-b ${gradientBg} border-2 ${borderColor} p-5 relative overflow-hidden flex flex-col justify-between shadow-xl transition-transform hover:-translate-y-1`}
            >
              {/* Top Medal Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  {crownIcon}
                  <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${medalColor}`}>
                    {rankLabel}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400">
                  {trainee.streakDays}d Streak 🔥
                </span>
              </div>

              {/* Center Profile */}
              <div className="flex flex-col items-center text-center my-4 space-y-2">
                <div className="relative">
                  <img
                    src={trainee.avatarUrl}
                    alt={trainee.name}
                    className={`w-16 h-16 rounded-2xl object-cover border-2 ${isFirst ? 'border-amber-400 shadow-lg shadow-amber-500/30' : 'border-slate-700'}`}
                  />
                  <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-md ${
                    isFirst ? 'bg-amber-400 text-slate-950' : isSecond ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                  }`}>
                    {trainee.rank}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-base flex items-center justify-center gap-1.5">
                    <span>{trainee.name}</span>
                    {trainee.isCurrentUser && (
                      <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 text-[10px] font-bold">You</span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <GraduationCap className="w-3 h-3 text-slate-500" />
                    <span>{trainee.institution || 'Premier Institute'}</span>
                  </p>
                  <p className="text-[11px] text-cyan-400 font-medium mt-0.5">{trainee.levelTitle}</p>
                </div>
              </div>

              {/* Bottom XP Metrics */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Score:</span>
                <span className="font-mono font-bold text-amber-300 text-sm flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {trainee.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Department Filters */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trainee, college, or track..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter by Department */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors w-full sm:w-auto"
          >
            <option value="all">All Academic Departments</option>
            <option value="Computer Science">Computer Science & Engineering</option>
            <option value="AI & Data Science">AI & Data Science</option>
            <option value="India Curricula">India Curricula & NPTEL</option>
            <option value="Cloud">Cloud & DevOps</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Trainee Competency Rankings ({filteredLeaderboard.length} Ranked)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Updated via Real-time Sprint Engine
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Trainee Scholar</th>
                <th className="py-3 px-4 hidden md:table-cell">Department & Track</th>
                <th className="py-3 px-4">Level & Division</th>
                <th className="py-3 px-4 hidden sm:table-cell text-center">Daily Streak</th>
                <th className="py-3 px-4 hidden lg:table-cell text-center">Quizzes</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeaderboard.length > 0 ? (
                filteredLeaderboard.map((trainee) => {
                  const isTopThree = trainee.rank && trainee.rank <= 3;
                  const isUser = trainee.isCurrentUser;

                  return (
                    <tr
                      key={trainee.id}
                      className={`transition-colors ${
                        isUser
                          ? 'bg-indigo-600/15 hover:bg-indigo-600/25 border-l-4 border-l-indigo-500 font-medium'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {trainee.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                            🥇 1
                          </span>
                        ) : trainee.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-400/20 text-slate-300 font-bold border border-slate-400/30">
                            🥈 2
                          </span>
                        ) : trainee.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-700/20 text-amber-500 font-bold border border-amber-700/30">
                            🥉 3
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold">#{trainee.rank}</span>
                        )}
                      </td>

                      {/* Trainee Scholar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={trainee.avatarUrl}
                            alt={trainee.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{trainee.name}</span>
                              {isUser && (
                                <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-500/40">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <span>{trainee.institution || 'Engineering Cohort'}</span>
                              {trainee.recentBadge && (
                                <>
                                  <span>•</span>
                                  <span className="text-amber-400/90 font-mono text-[10px]">{trainee.recentBadge}</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-slate-300 text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                          {trainee.department}
                        </span>
                      </td>

                      {/* Level & Division */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-cyan-300 font-mono">Lvl {trainee.level}</span>
                            <span className="text-slate-400 hidden sm:inline">•</span>
                            <span className="text-slate-300 text-[11px] font-medium hidden sm:inline">{trainee.levelTitle}</span>
                          </div>
                          <span className={`inline-block text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            trainee.division === 'Grandmaster' 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                              : trainee.division === 'Diamond'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {trainee.division}
                          </span>
                        </div>
                      </td>

                      {/* Daily Streak */}
                      <td className="py-3.5 px-4 hidden sm:table-cell text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-mono text-xs border border-orange-500/20">
                          <Flame className="w-3 h-3 text-orange-400" />
                          <span>{trainee.streakDays}d</span>
                        </span>
                      </td>

                      {/* Quizzes Completed */}
                      <td className="py-3.5 px-4 hidden lg:table-cell text-center font-mono text-slate-300">
                        {trainee.quizzesCompleted}
                      </td>

                      {/* Total XP */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400 text-sm">
                        <div className="flex items-center justify-end space-x-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>{trainee.xp.toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No trainees match the current search or department filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gamification Incentives & Fair Play Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Weekly League Rewards & Honors</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            The top 3 trainees in the Weekly Sprint earn verifiable Digital Laureate badges, honor points, and institutional course completion endorsements on their profile.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Anti-Cheat & Socratic Evaluation Verification</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            XP and leaderboard rankings are continuously validated against diagnostic accuracy and Socratic challenge response times to maintain genuine competition.
          </p>
        </div>
      </div>
    </div>
  );
};
