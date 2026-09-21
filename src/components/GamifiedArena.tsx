import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Flame, 
  Trophy, 
  Timer, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCw, 
  Layers, 
  ArrowRight, 
  Zap, 
  Award,
  ChevronRight,
  Plus
} from 'lucide-react';
import { QuizQuestion, Flashcard, DailyQuest, SubjectId, UserProfile, UserStats } from '../types';
import { sound } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import { GlobalLeaderboard } from './GlobalLeaderboard';

interface GamifiedArenaProps {
  selectedSubject: SubjectId;
  flashcards: Flashcard[];
  dailyQuests: DailyQuest[];
  comboMultiplier: number;
  currentUser?: UserProfile | null;
  userStats?: UserStats;
  onUpdateQuests: (quests: DailyQuest[]) => void;
  onUpdateFlashcards: (cards: Flashcard[]) => void;
  onAddXp: (amount: number) => void;
}

const SAMPLE_QUIZ_QUESTIONS: Record<SubjectId, QuizQuestion[]> = {
  'ap-calc-bc': [
    {
      id: 'q-calc-1',
      question: 'Which substitution technique evaluates ∫ x * e^(2x) dx most effectively?',
      options: [
        'Integration by Parts with u = x, dv = e^(2x) dx',
        'U-substitution with u = 2x',
        'Partial Fraction Decomposition',
        'Trigonometric substitution x = tan(θ)',
      ],
      correctAnswer: 0,
      explanation: 'By the LIATE rule, polynomial algebraic factor x should be differentiated (u = x), and the exponential factor integrated (dv = e^(2x) dx).',
      hint: 'Think about which factor simplifies to 1 when differentiated.',
      conceptTag: 'Integration by Parts (LIATE)',
      difficulty: 'medium',
      xp: 60,
    },
    {
      id: 'q-calc-2',
      question: 'What is the sum of the geometric series Σ (3/4)^n from n=0 to ∞?',
      options: ['3', '4', '7', 'Diverges'],
      correctAnswer: 1,
      explanation: 'For |r| < 1, the sum is a / (1 - r). Here a = 1, r = 3/4, so 1 / (1 - 3/4) = 1 / (1/4) = 4.',
      hint: 'Use the infinite geometric series formula S = a / (1 - r).',
      conceptTag: 'Infinite Series',
      difficulty: 'easy',
      xp: 40,
    },
    {
      id: 'q-calc-3',
      question: 'If a particle motion is given by x(t) = t³, y(t) = 2t², what is its speed at t = 1?',
      options: ['5', '√13', '7', '25'],
      correctAnswer: 0,
      explanation: 'Speed is √( (dx/dt)² + (dy/dt)² ). dx/dt = 3t² = 3. dy/dt = 4t = 4. Speed = √(3² + 4²) = √(9 + 16) = √25 = 5.',
      hint: 'Speed is the magnitude of the velocity vector (3-4-5 right triangle).',
      conceptTag: 'Parametric Kinematics',
      difficulty: 'medium',
      xp: 75,
    },
  ],
  'ap-bio': [
    {
      id: 'q-bio-1',
      question: 'During cellular respiration, where does the highest proton (H+) concentration accumulate?',
      options: [
        'Mitochondrial matrix',
        'Intermembrane space',
        'Cytoplasm',
        'Endoplasmic reticulum lumen',
      ],
      correctAnswer: 1,
      explanation: 'The electron transport chain pumps protons from the mitochondrial matrix into the intermembrane space, generating the proton-motive force.',
      hint: 'Protons are pumped outward into the narrow gap between membranes.',
      conceptTag: 'Chemiosmosis',
      difficulty: 'medium',
      xp: 50,
    },
    {
      id: 'q-bio-2',
      question: 'Which enzyme is responsible for synthesizing RNA primers during DNA replication?',
      options: ['DNA Polymerase I', 'DNA Ligase', 'RNA Primase', 'Topoisomerase'],
      correctAnswer: 2,
      explanation: 'Primase creates short complementary RNA primers that provide the 3\'-OH group required for DNA Polymerase III.',
      hint: 'Notice the root "prime" in the enzyme name.',
      conceptTag: 'Molecular Genetics',
      difficulty: 'easy',
      xp: 40,
    },
  ],
  'ap-physics': [
    {
      id: 'q-phys-1',
      question: 'A solid cylinder and a thin hollow hoop of equal mass and radius roll down an incline without slipping. Which reaches the bottom first?',
      options: [
        'The solid cylinder',
        'The hollow hoop',
        'Both reach at the identical time',
        'Depends on the angle of incline',
      ],
      correctAnswer: 0,
      explanation: 'The solid cylinder has a lower moment of inertia (1/2 MR² vs MR²), converting a greater fraction of potential energy into linear translational kinetic energy.',
      hint: 'Which object resists rotational acceleration less?',
      conceptTag: 'Rotational Inertia',
      difficulty: 'medium',
      xp: 65,
    },
  ],
  'sat-prep': [
    {
      id: 'q-sat-1',
      question: 'If 2x + 3y = 12 and 4x + 6y = k has infinitely many solutions, what is the value of k?',
      options: ['12', '24', '6', '48'],
      correctAnswer: 1,
      explanation: 'Multiplying the first equation by 2 yields 4x + 6y = 24. For infinite solutions, equations must be collinear, so k = 24.',
      hint: 'Multiply the entire first equation by 2 to compare coefficients.',
      conceptTag: 'Linear Systems',
      difficulty: 'easy',
      xp: 45,
    },
  ],
  'ap-chem': [],
  'ap-ush': [],
  'ap-cs-a': []
};

export const GamifiedArena: React.FC<GamifiedArenaProps> = ({
  selectedSubject,
  flashcards,
  dailyQuests,
  comboMultiplier,
  currentUser,
  userStats,
  onUpdateQuests,
  onUpdateFlashcards,
  onAddXp,
}) => {
  const [activeMode, setActiveMode] = useState<'quiz' | 'srs' | 'leaderboard'>('quiz');

  // Fallback default stats if not passed directly
  const effectiveStats: UserStats = userStats || {
    xp: 3840,
    level: 14,
    levelTitle: 'Syllabus Strategist',
    nextLevelXp: 5600,
    streakDays: 12,
    lastActiveDate: 'Today',
    completedQuizzes: 38,
    flashcardsReviewed: 165,
    studyMinutesTotal: 430,
    comboMultiplier: comboMultiplier || 1.5,
  };

  // Quiz State
  const questions = SAMPLE_QUIZ_QUESTIONS[selectedSubject] || SAMPLE_QUIZ_QUESTIONS['ap-calc-bc'];
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(1);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  // Flashcards SRS state
  const currentSubjectCards = flashcards.filter(c => c.subject === selectedSubject || true);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Dynamic AI Quiz Generation State
  const [isAiGeneratingQuiz, setIsAiGeneratingQuiz] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(questions);

  useEffect(() => {
    setActiveQuestions(SAMPLE_QUIZ_QUESTIONS[selectedSubject] || SAMPLE_QUIZ_QUESTIONS['ap-calc-bc']);
    setCurrentQIndex(0);
    setIsQuizComplete(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setTimerSeconds(30);
  }, [selectedSubject]);

  // Quiz Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (activeMode === 'quiz' && isTimerActive && timerSeconds > 0 && !isAnswerSubmitted && !isQuizComplete) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && !isAnswerSubmitted && !isQuizComplete) {
      // Auto submit on time out
      handleSubmitAnswer(-1);
    }
    return () => clearInterval(interval);
  }, [timerSeconds, isTimerActive, isAnswerSubmitted, activeMode, isQuizComplete]);

  const currentQ = activeQuestions[currentQIndex] || activeQuestions[0];

  const handleSubmitAnswer = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionIdx);
    setIsAnswerSubmitted(true);
    setIsTimerActive(false);

    const isCorrect = optionIdx === currentQ.correctAnswer;
    if (isCorrect) {
      const earnedXp = Math.round(currentQ.xp * combo);
      onAddXp(earnedXp);
      setQuizScore(prev => prev + 1);
      setCombo(prev => Math.min(3.5, Number((prev + 0.5).toFixed(1))));
      sound.playCorrect(combo);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } else {
      setCombo(1);
      sound.playIncorrect();
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < activeQuestions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      setTimerSeconds(30);
      setIsTimerActive(true);
    } else {
      setIsQuizComplete(true);
      sound.playLevelUp();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setQuizScore(0);
    setCombo(1);
    setTimerSeconds(30);
    setIsTimerActive(true);
    setIsQuizComplete(false);
  };

  // Generate new Quiz with Gemini AI
  const handleGenerateAiQuiz = async () => {
    setIsAiGeneratingQuiz(true);
    try {
      const response = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: 'High-Yield AP Exam Concepts',
          count: 5,
        }),
      });

      const data = await response.json();
      if (data.success && data.questions && data.questions.length > 0) {
        setActiveQuestions(data.questions);
        handleRestartQuiz();
        sound.playCorrect(2);
      } else {
        const fallback = SAMPLE_QUIZ_QUESTIONS[selectedSubject] || SAMPLE_QUIZ_QUESTIONS['ap-calc-bc'];
        setActiveQuestions(fallback);
        handleRestartQuiz();
        sound.playCorrect(1);
      }
    } catch (err) {
      console.warn('Network issue generating quiz, serving verified curriculum bank:', err);
      const fallback = SAMPLE_QUIZ_QUESTIONS[selectedSubject] || SAMPLE_QUIZ_QUESTIONS['ap-calc-bc'];
      setActiveQuestions(fallback);
      handleRestartQuiz();
      sound.playCorrect(1);
    } finally {
      setIsAiGeneratingQuiz(false);
    }
  };

  // Flashcards Leitner Action
  const handleLeitnerAnswer = (quality: 'again' | 'hard' | 'good' | 'easy') => {
    const card = currentSubjectCards[cardIndex];
    if (!card) return;

    let newBox = card.box;
    if (quality === 'again') {
      newBox = 1;
      sound.playIncorrect();
    } else if (quality === 'good' || quality === 'easy') {
      newBox = Math.min(5, card.box + 1);
      onAddXp(25);
      sound.playCorrect(1);
    }

    const updated = flashcards.map(c => c.id === card.id ? { ...c, box: newBox, lastReviewed: 'Just now' } : c);
    onUpdateFlashcards(updated);

    setIsCardFlipped(false);
    if (cardIndex + 1 < currentSubjectCards.length) {
      setCardIndex(prev => prev + 1);
    } else {
      setCardIndex(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Gamification Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-black/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-mono uppercase tracking-wider">Advanced Gamification & Recall Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Knowledge Arena & Daily Sprints
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Test your speed under exam pressure with lightning quiz streaks, earn XP multipliers, and strengthen long-term recall with 5-stage Leitner spaced repetition.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => {
              setActiveMode('quiz');
              sound.playCorrect(1);
            }}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'quiz' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Lightning Quiz</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('srs');
              sound.playCorrect(1);
            }}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'srs' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Leitner Flashcards</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('leaderboard');
              sound.playCorrect(1);
            }}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'leaderboard' 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Global Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Main Mode Content */}
      {activeMode === 'quiz' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Quiz Arena */}
          <div className="lg:col-span-8 space-y-4">
            {!isQuizComplete && currentQ ? (
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
                {/* Top Status Bar: Timer, Question Progress, Combo Multiplier */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-400">
                      Question {currentQIndex + 1} of {activeQuestions.length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px] border border-slate-700">
                      {currentQ.conceptTag}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Combo Multiplier Flame */}
                    <div className="flex items-center space-x-1 font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                      <Flame className={`w-3.5 h-3.5 ${combo > 1 ? 'animate-bounce text-amber-400' : 'text-slate-500'}`} />
                      <span>{combo}x Combo</span>
                    </div>

                    {/* Timer */}
                    <div className={`flex items-center space-x-1 font-mono font-bold px-2.5 py-1 rounded-full border ${
                      timerSeconds <= 8 
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      <Timer className="w-3.5 h-3.5" />
                      <span>{timerSeconds}s</span>
                    </div>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {currentQ.question}
                  </h2>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span>Reward: <strong className="text-amber-300 font-mono">+{currentQ.xp * combo} XP</strong></span>
                    <span>•</span>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showHint ? 'Hide Hint' : 'Need a Socratic Hint?'}</span>
                    </button>
                  </div>

                  {showHint && (
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
                      <span className="font-semibold text-amber-300 block">💡 Thought-provoking Clue:</span>
                      <p className="italic">{currentQ.hint}</p>
                    </div>
                  )}
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctAnswer;
                    let optionStyle = 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/80 text-slate-200';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                      } else {
                        optionStyle = 'bg-slate-800/40 border-slate-800 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !isAnswerSubmitted && handleSubmitAnswer(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${optionStyle}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-slate-300 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-relaxed">{option}</span>
                        </div>

                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Socratic Instant Explanation Breakdown */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${
                        selectedOption === currentQ.correctAnswer ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {selectedOption === currentQ.correctAnswer ? '✓ Correct! Combo Increased!' : '✗ Incorrect! Concept Review:'}
                      </span>
                      <button
                        onClick={handleNextQuestion}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/30"
                      >
                        <span>{currentQIndex + 1 < activeQuestions.length ? 'Next Question' : 'Complete Quiz'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Completion Summary Screen */
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-8 text-center space-y-5 animate-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/20">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-display text-white">
                    Round Complete!
                  </h2>
                  <p className="text-xs text-slate-400">
                    You scored <strong className="text-cyan-400">{quizScore} / {activeQuestions.length}</strong> correct on this high school sprint.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={handleRestartQuiz}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>

                  <button
                    onClick={handleGenerateAiQuiz}
                    disabled={isAiGeneratingQuiz}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>{isAiGeneratingQuiz ? 'Synthesizing...' : 'Generate New AI Quiz (+XP)'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Daily Quests Board & Speed Challenge Controls */}
          <div className="lg:col-span-4 space-y-4">
            {/* Daily Quests Card */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Daily Quests Board</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Reset at 00:00</span>
              </div>

              <div className="space-y-2.5">
                {dailyQuests.map((quest) => {
                  const progressPct = Math.min(100, Math.round((quest.current / quest.target) * 100));
                  return (
                    <div 
                      key={quest.id}
                      className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-semibold text-slate-200">{quest.title}</h4>
                          <p className="text-[11px] text-slate-400">{quest.description}</p>
                        </div>
                        <span className="text-[11px] font-mono text-amber-300 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shrink-0">
                          +{quest.xpReward} XP
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Progress: {quest.current}/{quest.target}</span>
                          <span>{progressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-cyan-400 h-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Leaderboard Standings Widget */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="uppercase tracking-wider text-[11px]">National Standings</span>
                </div>
                <button
                  onClick={() => {
                    sound.playCorrect(1);
                    setActiveMode('leaderboard');
                  }}
                  className="text-cyan-400 hover:underline text-[11px] font-medium flex items-center gap-0.5"
                >
                  <span>Leaderboard</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-amber-400">#1</span>
                    <span className="text-white font-medium">Aarav Deshmukh</span>
                  </div>
                  <span className="font-mono text-amber-300 font-semibold">6,420 XP</span>
                </div>
                <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-300">#2</span>
                    <span className="text-slate-200">Priya Nair</span>
                  </div>
                  <span className="font-mono text-slate-300 font-semibold">5,890 XP</span>
                </div>
                <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-indigo-400">You</span>
                    <span className="text-white font-medium truncate max-w-[110px]">{currentUser?.name || 'Trainee'}</span>
                  </div>
                  <span className="font-mono text-indigo-300 font-bold">{effectiveStats.xp.toLocaleString()} XP</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playCorrect(1);
                  setActiveMode('leaderboard');
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-center flex items-center justify-center space-x-1.5 transition-all text-[11px]"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>View Full Global Leaderboard</span>
              </button>
            </div>

            {/* AI Custom Quiz Trigger */}
            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-800/30 p-5 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-indigo-300 font-semibold">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>On-Demand Exam Sprint</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Generate 5 fresh multiple-choice exam challenges aligned with your current syllabus using Gemini 3.8 Flash.
              </p>
              <button
                onClick={handleGenerateAiQuiz}
                disabled={isAiGeneratingQuiz}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-600/25"
              >
                {isAiGeneratingQuiz ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Generate AI Sprint (+XP)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : activeMode === 'srs' ? (
        /* Spaced Repetition (SRS) Leitner Box Flashcard Mode */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Leitner Box Progress Level Indicators */}
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[1, 2, 3, 4, 5].map((boxNum) => {
              const countInBox = flashcards.filter(c => c.box === boxNum).length;
              return (
                <div 
                  key={boxNum}
                  className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-center"
                >
                  <span className="text-[10px] text-slate-400 font-mono block">Box {boxNum}</span>
                  <span className="font-bold text-cyan-400 text-sm">{countInBox} Cards</span>
                </div>
              );
            })}
          </div>

          {/* Active Flashcard Canvas with 3D Flip */}
          {currentSubjectCards.length > 0 ? (
            <div className="space-y-4">
              <div 
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="cursor-pointer min-h-[300px] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-indigo-500/40 hover:border-indigo-400 p-8 flex flex-col items-center justify-center text-center shadow-xl transition-all select-none relative"
              >
                <div className="absolute top-4 left-4 text-xs font-mono text-slate-400">
                  Card {cardIndex + 1} of {currentSubjectCards.length} • Box {currentSubjectCards[cardIndex]?.box}
                </div>
                <div className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {currentSubjectCards[cardIndex]?.keyTerm}
                </div>

                <div className="space-y-3 max-w-xl">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
                    {isCardFlipped ? 'Answer & Explanation' : 'Concept / Question'}
                  </span>
                  <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
                    {isCardFlipped ? currentSubjectCards[cardIndex]?.back : currentSubjectCards[cardIndex]?.front}
                  </p>
                </div>

                <div className="absolute bottom-4 text-[11px] text-slate-500 flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  <span>Click card to flip</span>
                </div>
              </div>

              {/* Leitner SRS Confidence Rating Buttons */}
              <div className="grid grid-cols-4 gap-3 text-xs">
                <button
                  onClick={() => handleLeitnerAnswer('again')}
                  className="py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold flex flex-col items-center"
                >
                  <span>Again</span>
                  <span className="text-[10px] text-rose-400 font-normal">Back to Box 1</span>
                </button>
                <button
                  onClick={() => handleLeitnerAnswer('hard')}
                  className="py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold flex flex-col items-center"
                >
                  <span>Hard</span>
                  <span className="text-[10px] text-amber-400 font-normal">Review Soon</span>
                </button>
                <button
                  onClick={() => handleLeitnerAnswer('good')}
                  className="py-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-semibold flex flex-col items-center"
                >
                  <span>Good</span>
                  <span className="text-[10px] text-indigo-400 font-normal">+1 Box (+25 XP)</span>
                </button>
                <button
                  onClick={() => handleLeitnerAnswer('easy')}
                  className="py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold flex flex-col items-center"
                >
                  <span>Easy</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Mastered (+25 XP)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
              No flashcards in this deck yet.
            </div>
          )}
        </div>
      ) : (
        /* Global Leaderboard Mode */
        <GlobalLeaderboard
          currentUser={currentUser || null}
          userStats={effectiveStats}
          onNavigateToQuiz={() => {
            setActiveMode('quiz');
            sound.playCorrect(1);
          }}
          onNavigateToFlashcards={() => {
            setActiveMode('srs');
            sound.playCorrect(1);
          }}
        />
      )}
    </div>
  );
};
