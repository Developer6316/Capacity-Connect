import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Video, 
  CheckCircle2, 
  Sliders, 
  HelpCircle, 
  ExternalLink, 
  Clock, 
  Trophy, 
  Flame, 
  BrainCircuit, 
  RefreshCw, 
  Filter, 
  ChevronRight, 
  X, 
  Play, 
  Check, 
  BookMarked,
  Lightbulb,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CuratedContentItem, ContentModality, SubjectId } from '../types';
import { sound } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface AIContentCurationProps {
  selectedSubject: SubjectId;
  curatedItems: CuratedContentItem[];
  onUpdateCuratedItems: (items: CuratedContentItem[]) => void;
  onOpenTutorWithTopic: (topic: string) => void;
  onAddXp: (amount: number) => void;
}

export const AIContentCuration: React.FC<AIContentCurationProps> = ({
  selectedSubject,
  curatedItems,
  onUpdateCuratedItems,
  onOpenTutorWithTopic,
  onAddXp,
}) => {
  const [activeModality, setActiveModality] = useState<ContentModality | 'all'>('all');
  const [learningPace, setLearningPace] = useState<'Standard' | 'Accelerated' | 'Reinforcement'>('Accelerated');
  const [isCurating, setIsCurating] = useState(false);
  
  // Modals
  const [selectedArticle, setSelectedArticle] = useState<CuratedContentItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CuratedContentItem | null>(null);
  const [activePracticeAnswers, setActivePracticeAnswers] = useState<Record<string, number | null>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [simulationState, setSimulationState] = useState<Record<string, number>>({
    'cur-sim-1_param_0': 2,
    'cur-sim-1_param_1': 1.5,
    'cur-sim-1_param_2': 3,
  });

  // Filter items by subject (or general items) and modality
  const filteredItems = curatedItems.filter((item) => {
    const matchesSubject = item.subject === selectedSubject || item.subject === 'ap-calc-bc';
    const matchesModality = activeModality === 'all' || item.modality === activeModality;
    return matchesSubject && matchesModality;
  });

  // Dynamic AI Diagnostic & Re-Curation Engine
  const handleTriggerAICuration = async () => {
    setIsCurating(true);
    sound.playCorrect(1);

    try {
      const response = await fetch('/api/gemini/curate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          weakTopics: 'Techniques of Integration, cyclic integration, and geometric area decomposition',
          quizScore: 78,
          learningPace,
          studentGrade: 'Grade 11',
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.items) && data.items.length > 0) {
        // Merge with existing items, prioritizing newly curated resources
        onUpdateCuratedItems([...data.items, ...curatedItems]);
        sound.playLevelUp();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      } else {
        // Fallback: announce re-indexing completed
        sound.playCorrect(2);
      }
    } catch (err) {
      console.warn('Network call failed, relying on local adaptive heuristics:', err);
      sound.playCorrect(1);
    } finally {
      setIsCurating(false);
    }
  };

  const handleCompleteItem = (item: CuratedContentItem) => {
    if (item.completed) return;
    const updated = curatedItems.map((c) => c.id === item.id ? { ...c, completed: true } : c);
    onUpdateCuratedItems(updated);
    onAddXp(item.xpReward);
    sound.playCorrect(2);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleCheckPracticeAnswer = (itemId: string, selectedIdx: number, correctIdx: number, xp: number) => {
    setActivePracticeAnswers({ ...activePracticeAnswers, [itemId]: selectedIdx });
    if (selectedIdx === correctIdx) {
      sound.playCorrect(2);
      onAddXp(xp);
      confetti({ particleCount: 30, spread: 40 });
    } else {
      sound.playIncorrect();
    }
  };

  const getModalityBadge = (modality: ContentModality) => {
    switch (modality) {
      case 'article':
        return { label: 'Conceptual Article', icon: BookOpen, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      case 'video':
        return { label: 'Video Lecture', icon: Video, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
      case 'practice_problem':
        return { label: 'Active Problem', icon: HelpCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'interactive_simulation':
        return { label: 'Interactive Lab', icon: Sliders, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-indigo-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-black/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="font-mono uppercase tracking-wider">Adaptive NLP Content Curator • Multi-Modality</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            AI-Curated Learning Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Tailored articles, high-yield videos, step-through practice, and interactive sandboxes synthesized from your diagnostic quiz errors and learning pace.
          </p>
        </div>

        {/* Diagnostic Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pace Toggle */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-1 flex text-xs">
            {(['Accelerated', 'Standard', 'Reinforcement'] as const).map((pace) => (
              <button
                key={pace}
                onClick={() => {
                  setLearningPace(pace);
                  sound.playCorrect(1);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  learningPace === pace
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {pace}
              </button>
            ))}
          </div>

          {/* Trigger Re-Curation */}
          <button
            onClick={handleTriggerAICuration}
            disabled={isCurating}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/25 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCurating ? 'animate-spin' : ''}`} />
            <span>{isCurating ? 'Analyzing Quiz Errors...' : 'Re-Curate Content'}</span>
          </button>
        </div>
      </div>

      {/* Diagnostic Assessment Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Assessed Learning Pace</span>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{learningPace} Pace</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">Fast Synthesis</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Primary Focus Misconception</span>
            <div className="text-sm font-bold text-slate-200 truncate max-w-[200px]" title="Integration by Parts with Logarithms">
              Integration by Parts (LIATE)
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Modalities Synthesized</span>
            <div className="text-sm font-bold text-white">
              Articles • Videos • Problems • Labs
            </div>
          </div>
        </div>
      </div>

      {/* Modality Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Modalities' },
            { id: 'article', label: 'In-Depth Articles', icon: BookOpen },
            { id: 'video', label: 'Video Lectures', icon: Video },
            { id: 'practice_problem', label: 'Practice Problems', icon: HelpCircle },
            { id: 'interactive_simulation', label: 'Simulations & Labs', icon: Sliders },
          ].map((tab) => {
            const isSelected = activeModality === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModality(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline font-mono">
          Showing {filteredItems.length} curated resources
        </span>
      </div>

      {/* Curated Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => {
          const badge = getModalityBadge(item.modality);
          const BadgeIcon = badge.icon;
          const isPracticeDone = activePracticeAnswers[item.id] !== undefined;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between transition-all hover:border-slate-700 ${
                item.completed ? 'border-emerald-500/40' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Modality Badge & XP */}
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold flex items-center space-x-1.5 ${badge.color}`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {item.estimatedTime}
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      +{item.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Title and Source */}
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="text-indigo-400 font-medium">{item.source}</span>
                    <span>•</span>
                    <span className="capitalize">{item.difficulty}</span>
                  </div>
                </div>

                {/* Diagnostic Recommendation Reason */}
                <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{item.matchReason}</p>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                {/* Key Takeaways */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">
                    High-Yield Takeaways:
                  </span>
                  {item.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start space-x-1.5 text-xs text-slate-400">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>

                {/* Modality-specific Interactive Insets */}
                {item.modality === 'video' && item.videoTimestamps && (
                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Video Chapters ({item.videoDuration})
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {item.videoTimestamps.map((ts, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300 p-1.5 bg-slate-900 rounded-lg">
                          <span className="truncate">{ts.label}</span>
                          <span className="font-mono text-indigo-400 font-semibold ml-1">{ts.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.modality === 'practice_problem' && item.practiceProblem && (
                  <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
                    <span className="text-xs font-semibold text-slate-200">
                      {item.practiceProblem.question}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.practiceProblem.options.map((opt, optIdx) => {
                        const isChosen = activePracticeAnswers[item.id] === optIdx;
                        const isCorrect = optIdx === item.practiceProblem!.correctIndex;
                        const hasAnswered = activePracticeAnswers[item.id] !== undefined;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleCheckPracticeAnswer(item.id, optIdx, item.practiceProblem!.correctIndex, item.xpReward)}
                            className={`p-2 rounded-lg text-left text-xs font-medium border transition-all ${
                              hasAnswered && isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : hasAnswered && isChosen && !isCorrect
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                            }`}
                          >
                            <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isPracticeDone && (
                      <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-slate-300 border border-slate-800 space-y-1">
                        <span className="font-bold text-emerald-400 block">Explanation:</span>
                        <p className="whitespace-pre-wrap">{item.practiceProblem.explanation}</p>
                      </div>
                    )}
                  </div>
                )}

                {item.modality === 'interactive_simulation' && item.simulationParameters && (
                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Live Parameter Sandbox
                    </span>
                    {item.simulationParameters.map((param, pIdx) => {
                      const key = `${item.id}_param_${pIdx}`;
                      const val = simulationState[key] ?? param.defaultVal;
                      return (
                        <div key={pIdx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-slate-300">
                            <span>{param.name}</span>
                            <span className="font-mono font-bold text-indigo-400">{val} {param.unit}</span>
                          </div>
                          <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={0.5}
                            value={val}
                            onChange={(e) => setSimulationState({ ...simulationState, [key]: parseFloat(e.target.value) })}
                            className="w-full accent-indigo-500"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenTutorWithTopic(`Can you guide me through the concept: "${item.title}" from my curated learning matrix?`)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-medium"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Discuss with AI Tutor</span>
                </button>

                <div className="flex items-center space-x-2">
                  {item.modality === 'article' && (
                    <button
                      onClick={() => setSelectedArticle(item)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Read Article
                    </button>
                  )}

                  {item.modality === 'video' && (
                    <button
                      onClick={() => setSelectedVideo(item)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch Video</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCompleteItem(item)}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                      item.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={item.completed ? 'Marked as completed' : 'Mark as completed'}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider font-mono">
                  {selectedArticle.source} • {selectedArticle.estimatedTime}
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans flex-1">
              <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-indigo-200 text-xs">
                <strong>Diagnostic Context:</strong> {selectedArticle.matchReason}
              </div>

              <div className="whitespace-pre-wrap font-sans space-y-3">
                {selectedArticle.contentBody || selectedArticle.summary}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 text-xs uppercase tracking-wider font-mono block">
                  Core Principles to Memorize
                </span>
                {selectedArticle.keyTakeaways.map((k, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{k}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const topic = selectedArticle.title;
                  setSelectedArticle(null);
                  onOpenTutorWithTopic(`I just read "${topic}". Can you quiz me on its key concepts?`);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Quiz Me on This in Socratic Tutor</span>
              </button>

              <button
                onClick={() => {
                  handleCompleteItem(selectedArticle);
                  setSelectedArticle(null);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
              >
                Complete & Claim +{selectedArticle.xpReward} XP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Lecture Simulator Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider font-mono">
                  {selectedVideo.source} • {selectedVideo.videoDuration}
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {selectedVideo.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Mockup with Interactive Chapters */}
            <div className="aspect-video bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 group-hover:scale-110 transition-transform cursor-pointer">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <p className="text-xs text-slate-400 mt-3 font-mono">
                Interactive High-Yield Visual Lecture ({selectedVideo.videoDuration})
              </p>
            </div>

            {/* Chapter Markers */}
            {selectedVideo.videoTimestamps && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase text-slate-400">Timestamp Chapters</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedVideo.videoTimestamps.map((ts, idx) => (
                    <button
                      key={idx}
                      onClick={() => alert(`Jumped to ${ts.time}: ${ts.label}`)}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-left text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="text-slate-300 truncate">{ts.label}</span>
                      <span className="text-indigo-400 font-mono font-bold text-[11px]">{ts.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Awarded on video completion: +{selectedVideo.xpReward} XP</span>
              <button
                onClick={() => {
                  handleCompleteItem(selectedVideo);
                  setSelectedVideo(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Mark Video Watched
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
