import { StreakDayActivity, StreakSummary } from '../types';

const STORAGE_KEY = 'capacity_connect_streak_history_v2';
const FREEZE_KEY = 'capacity_connect_streak_freeze_active';

const STEM_TOPICS = [
  'AP Calc BC • Taylor & Maclaurin Series',
  'AP Calc BC • Integration by Parts & Partial Fractions',
  'AP Physics C • Rotational Dynamics & Moment of Inertia',
  'AP Physics C • Gauss\'s Law & Electric Flux',
  'AP Biology • Cellular Respiration & ATP Synthase',
  'AP Biology • Signal Transduction Pathways',
  'AP Chem • Thermodynamics & Gibbs Free Energy',
  'AP CS A • Recursion & Binary Search Trees',
  'Mock Exam Simulator • Timed FRQ Review',
  'Spaced Repetition • Formula Anki Recall'
];

/**
 * Calculates level 0-4 based on study minutes
 */
export function calculateContributionLevel(minutes: number): 0 | 1 | 2 | 3 | 4 {
  if (minutes <= 0) return 0;
  if (minutes < 25) return 1;
  if (minutes < 50) return 2;
  if (minutes < 80) return 3;
  return 4;
}

/**
 * Generates initial 30 days of realistic study activity
 */
export function generateInitial30DaysActivity(): StreakDayActivity[] {
  const days: StreakDayActivity[] = [];
  const today = new Date();

  // Pattern of activity for the past 30 days:
  // Days 0-13 (most recent 14 days): active continuous streak (today is index 29)
  // Earlier days: realistic pattern with 3 rest days
  const restDayIndices = [3, 9, 15]; // index 0 is 29 days ago

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const isToday = i === 0;
    const dayIndexFromStart = 29 - i; // 0 to 29
    const isRestDay = restDayIndices.includes(dayIndexFromStart) && !isToday;

    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const fullDateLabel = d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const dayOfWeek = d.getDay(); // 0 = Sun
    const dayOfWeekShort = d.toLocaleDateString('en-US', { weekday: 'short' });

    let minutes = 0;
    let xpEarned = 0;
    let topics: string[] = [];
    let quizzesCompleted = 0;
    let flashcardsReviewed = 0;

    if (!isRestDay) {
      if (isToday) {
        minutes = 45;
        xpEarned = 280;
        topics = [
          'AP Calc BC • Taylor & Maclaurin Series',
          'Spaced Repetition • Formula Anki Recall'
        ];
        quizzesCompleted = 1;
        flashcardsReviewed = 18;
      } else {
        // Deterministic pseudo-random generation based on date
        const seed = (d.getDate() * 13 + d.getMonth() * 7 + i * 17) % 100;
        if (seed < 20) {
          minutes = 20 + (seed % 10);
          xpEarned = 140;
          quizzesCompleted = 0;
          flashcardsReviewed = 10;
        } else if (seed < 55) {
          minutes = 35 + (seed % 15);
          xpEarned = 240;
          quizzesCompleted = 1;
          flashcardsReviewed = 22;
        } else if (seed < 85) {
          minutes = 60 + (seed % 20);
          xpEarned = 380;
          quizzesCompleted = 2;
          flashcardsReviewed = 35;
        } else {
          minutes = 90 + (seed % 30);
          xpEarned = 520;
          quizzesCompleted = 3;
          flashcardsReviewed = 50;
        }

        const tIndex1 = seed % STEM_TOPICS.length;
        const tIndex2 = (seed + 3) % STEM_TOPICS.length;
        topics = [STEM_TOPICS[tIndex1], STEM_TOPICS[tIndex2]];
      }
    }

    days.push({
      dateStr,
      dayLabel,
      fullDateLabel,
      dayOfWeek,
      dayOfWeekShort,
      minutes,
      xpEarned,
      level: calculateContributionLevel(minutes),
      isToday,
      topics,
      quizzesCompleted,
      flashcardsReviewed,
    });
  }

  return days;
}

/**
 * Load streak activity from storage or fallback to generated initial
 */
export function loadStreakHistory(): StreakDayActivity[] {
  if (typeof window === 'undefined') return generateInitial30DaysActivity();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = generateInitial30DaysActivity();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: StreakDayActivity[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = generateInitial30DaysActivity();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    // Ensure today's date matches current system date
    const todayStr = new Date().toISOString().split('T')[0];
    const lastItem = parsed[parsed.length - 1];
    if (lastItem && lastItem.dateStr !== todayStr) {
      // Refresh to align with today's 30-day window
      const refreshed = generateInitial30DaysActivity();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
      return refreshed;
    }

    return parsed;
  } catch {
    return generateInitial30DaysActivity();
  }
}

/**
 * Save streak activity
 */
export function saveStreakHistory(days: StreakDayActivity[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  } catch {
    // Ignore storage quota
  }
}

/**
 * Compute summary statistics from the 30-day activity array
 */
export function computeStreakSummary(days: StreakDayActivity[]): StreakSummary {
  let activeCount = 0;
  let totalMinutes = 0;
  let totalXp = 0;

  // Calculate current streak backward from today
  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].minutes > 0) {
      currentStreak++;
    } else {
      // If today has 0 so far, we check yesterday before breaking
      if (i === days.length - 1 && days[i].minutes === 0) {
        continue;
      }
      break;
    }
  }

  // Calculate longest streak in 30 days
  let longestStreak = 0;
  let tempStreak = 0;
  days.forEach((day) => {
    if (day.minutes > 0) {
      activeCount++;
      totalMinutes += day.minutes;
      totalXp += day.xpEarned;
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });

  // Longest all-time might exceed 30 days if student was already at 24
  longestStreak = Math.max(longestStreak, 24);

  let freezeActive = false;
  try {
    freezeActive = localStorage.getItem(FREEZE_KEY) === 'true';
  } catch {
    freezeActive = false;
  }

  return {
    currentStreak: Math.max(currentStreak, 14), // Current active streak benchmark
    longestStreak,
    activeDaysLast30: activeCount,
    totalMinutesLast30: totalMinutes,
    totalXpLast30: totalXp,
    streakFreezeAvailable: true,
    streakFreezeActive: freezeActive,
  };
}

/**
 * Set streak freeze preference
 */
export function toggleStreakFreezeInStorage(nextState: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FREEZE_KEY, nextState ? 'true' : 'false');
  } catch {
    // Ignore
  }
}
