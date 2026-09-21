import React, { useState } from 'react';
import { 
  Brain, 
  RotateCw, 
  CheckCircle2, 
  Volume2, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Clock, 
  Filter,
  Check,
  ChevronRight,
  Flame
} from 'lucide-react';
import { SpacedFlashcard, SM2Rating, SubjectId } from '../types';
import { INITIAL_SPACED_CARDS } from '../data/spacedRepetitionData';
import { sound } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface SpacedRepetitionTrainerProps {
  selectedSubject: SubjectId;
  onAddXp: (amount: number) => void;
  onOpenTutorWithTopic?: (topic: string) => void;
}

export const SpacedRepetitionTrainer: React.FC<SpacedRepetitionTrainerProps> = ({
  selectedSubject,
  onAddXp,
  onOpenTutorWithTopic,
}) => {
  // Load stored cards or initial
  const [cards, setCards] = useState<SpacedFlashcard[]>(() => {
    try {
      const stored = localStorage.getItem('smartlearn_spaced_cards');
      return stored ? JSON.parse(stored) : INITIAL_SPACED_CARDS;
    } catch {
      return INITIAL_SPACED_CARDS;
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [reviewedCountToday, setReviewedCountToday] = useState(0);

  // Filter cards by subject and difficulty
  const filteredCards = cards.filter(c => {
    const matchSubject = c.subject === selectedSubject;
    const matchDiff = filterDifficulty === 'all' || c.difficulty === filterDifficulty;
    return matchSubject && matchDiff;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  // SM-2 Algorithm Calculation
  const handleRating = (rating: SM2Rating) => {
    if (!currentCard) return;

    sound.playClick();
    const qMap: Record<SM2Rating, number> = {
      again: 1,
      hard: 2,
      good: 4,
      easy: 5,
    };
    const q = qMap[rating];

    let newInterval: number;
    let newReps: number;
    let newEase = currentCard.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (newEase < 1.3) newEase = 1.3;

    if (q < 3) {
      newInterval = 1;
      newReps = 0;
      sound.playIncorrect();
    } else {
      if (currentCard.repetitionCount === 0) {
        newInterval = 1;
      } else if (currentCard.repetitionCount === 1) {
        newInterval = 3;
      } else {
        newInterval = Math.round(currentCard.intervalDays * newEase * (rating === 'easy' ? 1.3 : 1.0));
      }
      newReps = currentCard.repetitionCount + 1;
      onAddXp(rating === 'easy' ? 30 : rating === 'good' ? 20 : 10);
      sound.playSuccess();
    }

    const nextDate = newInterval === 1 ? 'Tomorrow' : `In ${newInterval} days`;
    const newRetention = Math.min(99, Math.max(50, Math.round(100 - (1 / newEase) * 20)));

    const updatedCards = cards.map(c => {
      if (c.id === currentCard.id) {
        return {
          ...c,
          intervalDays: newInterval,
          repetitionCount: newReps,
          easeFactor: parseFloat(newEase.toFixed(2)),
          nextReviewDate: nextDate,
          lastReviewed: 'Today',
          retentionPercent: newRetention,
        };
      }
      return c;
    });

    setCards(updatedCards);
    try {
      localStorage.setItem('smartlearn_spaced_cards', JSON.stringify(updatedCards));
    } catch (e) {
      console.warn('Could not save spaced cards', e);
    }

    setReviewedCountToday(prev => prev + 1);
    setIsFlipped(false);

    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const handleSpeakCard = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Retention metrics
  const avgRetention = Math.round(
    cards.reduce((acc, c) => acc + c.retentionPercent, 0) / Math.max(1, cards.length)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              SuperMemo SM-2 Algorithmic Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Ebbinghaus Decay Protection
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Adaptive Spaced Repetition</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Optimizes review intervals based on difficulty and recall latency. Cards are scheduled right at the moment of cognitive forgetting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterDifficulty}
              onChange={(e) => { setFilterDifficulty(e.target.value); setCurrentIndex(0); setIsFlipped(false); }}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="all" className="bg-slate-900">All Masteries</option>
              <option value="Foundational" className="bg-slate-900">Foundational</option>
              <option value="Intermediate" className="bg-slate-900">Intermediate</option>
              <option value="Mastery" className="bg-slate-900">Mastery (Hard)</option>
            </select>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Avg Memory: {avgRetention}%</span>
          </div>
        </div>
      </div>

      {/* Main Flashcard Interactive Area */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Brain className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Review Cards Match Filter</h3>
          <p className="text-xs text-slate-400">All current concepts for this criteria have been mastered!</p>
          <button
            onClick={() => setFilterDifficulty('all')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D Flip Card */}
          <div className="lg:col-span-8 space-y-4">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative min-h-[380px] w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 p-8 shadow-2xl cursor-pointer transition-all duration-300 hover:border-indigo-500/60 flex flex-col justify-between group select-none"
            >
              {/* Card Header metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                    {currentCard.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    currentCard.difficulty === 'Mastery' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    currentCard.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {currentCard.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakCard(isFlipped ? currentCard.backSolution : currentCard.frontPrompt);
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    title="Read aloud with speech synthesizer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-500 font-mono">
                    {currentIndex + 1} / {filteredCards.length}
                  </span>
                </div>
              </div>

              {/* Card Body (Front vs Back) */}
              <div className="my-8">
                {!isFlipped ? (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Recall Prompt</span>
                    <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                      {currentCard.frontPrompt}
                    </h2>
                    <p className="text-xs text-slate-400 italic">Click card or press Space to reveal derivation & mnemonic</p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Target Concept & Derivation</span>
                    <div className="text-sm md:text-base text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                      {currentCard.backSolution}
                    </div>

                    {currentCard.formulaOrCode && (
                      <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 border border-slate-800">
                        {currentCard.formulaOrCode}
                      </div>
                    )}

                    {currentCard.mnemonic && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                        <span className="font-bold">🧠 Memory Anchor: </span>
                        {currentCard.mnemonic}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer prompt */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  {isFlipped ? 'Answer Revealed' : 'Click anywhere to flip'}
                </span>
                <span className="font-mono text-slate-400">
                  Ease: {currentCard.easeFactor} • Interval: {currentCard.intervalDays}d
                </span>
              </div>
            </div>

            {/* SM-2 Recall Rating Buttons */}
            {isFlipped && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button
                  onClick={() => handleRating('again')}
                  className="p-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-center transition"
                >
                  <div className="font-bold text-sm">Again</div>
                  <div className="text-[11px] text-rose-400/80 mt-0.5">Reset (1 day)</div>
                </button>

                <button
                  onClick={() => handleRating('hard')}
                  className="p-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-center transition"
                >
                  <div className="font-bold text-sm">Hard</div>
                  <div className="text-[11px] text-amber-400/80 mt-0.5">+2 days (1.2x)</div>
                </button>

                <button
                  onClick={() => handleRating('good')}
                  className="p-3.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-center transition"
                >
                  <div className="font-bold text-sm">Good</div>
                  <div className="text-[11px] text-indigo-400/80 mt-0.5">Optimal interval</div>
                </button>

                <button
                  onClick={() => handleRating('easy')}
                  className="p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-center transition"
                >
                  <div className="font-bold text-sm">Easy</div>
                  <div className="text-[11px] text-emerald-400/80 mt-0.5">+Bonus (30 XP)</div>
                </button>
              </div>
            )}
          </div>

          {/* Side Performance & Retention Stats */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Memory Retention Curve</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Current Card Retention</span>
                    <span className="font-bold text-white">{currentCard.retentionPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${currentCard.retentionPercent}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Consecutive Repetitions:</span>
                    <span className="font-bold text-white">{currentCard.repetitionCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Ease Factor:</span>
                    <span className="font-bold text-white">{currentCard.easeFactor}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Scheduled Next Review:</span>
                    <span className="font-bold text-cyan-400">{currentCard.nextReviewDate}</span>
                  </div>
                </div>
              </div>

              {onOpenTutorWithTopic && (
                <button
                  onClick={() => onOpenTutorWithTopic(currentCard.frontPrompt)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Discuss Concept with Tutor</span>
                </button>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Today's Review Session</span>
              </h3>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">{reviewedCountToday}</span>
                <span className="text-xs text-slate-400">Cards Recalled Today</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Daily active recall strengthens synaptic pathways and transitions short-term working memory into long-term declarative knowledge.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
