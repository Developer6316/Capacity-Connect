import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Sparkles, 
  Trophy, 
  Clock, 
  Target, 
  BrainCircuit, 
  Plus, 
  ArrowRight, 
  Lightbulb, 
  BookOpen, 
  Flame,
  AlertCircle
} from 'lucide-react';
import { StudyPath, MilestoneNode, SubjectId, DailyStudyGoal } from '../types';
import { DailyStudyGoalWidget } from './DailyStudyGoalWidget';
import { StreakActivityWidget } from './StreakActivityWidget';
import { sound } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface StudyPathViewProps {
  paths: StudyPath[];
  selectedSubject: SubjectId;
  onUpdatePaths: (paths: StudyPath[]) => void;
  onStartNode?: (node: MilestoneNode) => void;
  onSelectNode?: (nodeId: string) => void;
  onOpenTutorWithTopic?: (topic: string) => void;
  onOpenTutor?: (topic: string) => void;
  onAddXp: (amount: number) => void;
  dailyGoal?: DailyStudyGoal;
  onUpdateGoal?: (updated: DailyStudyGoal) => void;
}

export const StudyPathView: React.FC<StudyPathViewProps> = ({
  paths,
  selectedSubject,
  onUpdatePaths,
  onStartNode,
  onSelectNode,
  onOpenTutorWithTopic,
  onOpenTutor,
  onAddXp,
  dailyGoal,
  onUpdateGoal,
}) => {
  const currentPath = paths.find(p => p.subject === selectedSubject) || paths[0];
  const [selectedNode, setSelectedNode] = useState<MilestoneNode | null>(
    currentPath?.nodes[2] || currentPath?.nodes[0] || null
  );
  const [showAiModal, setShowAiModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTriggerTutor = (topic: string) => {
    if (onOpenTutorWithTopic) onOpenTutorWithTopic(topic);
    else if (onOpenTutor) onOpenTutor(topic);
  };

  const handleTriggerStartNode = (node: MilestoneNode) => {
    if (onStartNode) onStartNode(node);
    else if (onSelectNode) onSelectNode(node.id);
  };

  // Form state for custom AI Path generation
  const [customForm, setCustomForm] = useState({
    gradeLevel: 'Grade 11',
    targetExam: 'AP Exam & College Board Final',
    targetScore: 'Score 5 (Mastery)',
    weakAreas: 'Integration by parts, error bounds, and parametric rates of change',
    availableHours: 6,
  });

  const handleGenerateAiPath = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/study-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          gradeLevel: customForm.gradeLevel,
          targetExam: customForm.targetExam,
          targetScore: customForm.targetScore,
          weakAreas: customForm.weakAreas,
          availableHoursPerWeek: customForm.availableHours,
        }),
      });

      const data = await response.json();
      if (data.success && data.path) {
        const newPath: StudyPath = {
          ...data.path,
          id: `custom-path-${Date.now()}`,
          subject: selectedSubject,
          completedUnits: 0,
          masteryScore: 10,
        };

        const updatedPaths = paths.map(p => p.subject === selectedSubject ? newPath : p);
        onUpdatePaths(updatedPaths);
        setSelectedNode(newPath.nodes[0] || null);
        setShowAiModal(false);
        onAddXp(100);
        sound.playCorrect(2);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } else {
        alert('Failed to generate study path. Please check connection.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while generating AI Study Path.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCompleteNode = (node: MilestoneNode) => {
    if (!currentPath) return;
    const updatedNodes = currentPath.nodes.map(n => {
      if (n.id === node.id) {
        return { ...n, status: 'completed' as const, masteryPercent: 100 };
      }
      return n;
    });

    const updatedPath: StudyPath = {
      ...currentPath,
      completedUnits: Math.min(currentPath.totalUnits, currentPath.completedUnits + 1),
      masteryScore: Math.min(100, currentPath.masteryScore + 8),
      nodes: updatedNodes,
    };

    onUpdatePaths(paths.map(p => p.subject === selectedSubject ? updatedPath : p));
    setSelectedNode({ ...node, status: 'completed', masteryPercent: 100 });
    onAddXp(node.xpReward);
    sound.playLevelUp();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
  };

  if (!currentPath) {
    return (
      <div className="p-8 text-center text-slate-400">
        No study path configured for this subject yet.
      </div>
    );
  }

  const completionPercent = Math.round((currentPath.completedUnits / Math.max(1, currentPath.totalUnits)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Overview Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 shadow-xl shadow-black/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                Personalized AI Roadmap
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {currentPath.weeklyGoalHours} hrs/week goal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              {currentPath.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Targeting: <span className="text-indigo-300 font-medium">{currentPath.targetExam}</span> ({currentPath.targetScore}) • {currentPath.gradeLevel}
            </p>
            {currentPath.aiNotes && (
              <div className="flex items-start space-x-2 pt-1 text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 max-w-2xl">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-amber-300">AI Diagnostic Note:</strong> {currentPath.aiNotes}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Progress metric */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 min-w-[170px] shadow-sm">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400">Curriculum Progress</span>
                <span className="font-bold text-indigo-400">{completionPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-700" 
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between">
                <span>{currentPath.completedUnits} / {currentPath.totalUnits} Units</span>
                <span>Mastery: {currentPath.masteryScore}%</span>
              </div>
            </div>

            {/* AI Re-generate Path Button */}
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Tailor with Gemini AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Study Goal Tracker Widget with Celebratory Particles */}
      {dailyGoal && onUpdateGoal && (
        <DailyStudyGoalWidget
          goal={dailyGoal}
          onUpdateGoal={onUpdateGoal}
          onAddXp={onAddXp}
        />
      )}

      {/* 30-Day Contribution Heatmap Streak Activity Widget */}
      <StreakActivityWidget onAddXp={onAddXp} />

      {/* Main Grid: Visual Interactive Skill Tree & Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Roadmap Nodes */}
        <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Curriculum Skill Tree & Milestones</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {currentPath.nodes.filter(n => n.status === 'completed').length} / {currentPath.nodes.length} Completed
            </span>
          </div>

          {/* Connected Milestone Path Nodes */}
          <div className="relative py-4 space-y-4">
            {/* Vertical connector guide line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-800" />

            {currentPath.nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isCompleted = node.status === 'completed';
              const isInProgress = node.status === 'in_progress';
              const isLocked = node.status === 'locked';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`relative flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-slate-800/90 border-indigo-500/80 shadow-md shadow-indigo-500/10' 
                      : 'bg-slate-900/90 hover:bg-slate-800/50 border-slate-800'
                  }`}
                >
                  {/* Node Status Emblem */}
                  <div className="relative z-10 shrink-0 mt-0.5">
                    {isCompleted && (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    {isInProgress && (
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 animate-pulse shadow-md shadow-cyan-500/40">
                        <Play className="w-4 h-4 fill-cyan-300" />
                      </div>
                    )}
                    {node.status === 'available' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center text-indigo-300">
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                    )}
                    {isLocked && (
                      <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Node Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-slate-400 font-medium">{node.unit}</span>
                        <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {node.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                          +{node.xpReward} XP
                        </span>
                        {node.type === 'boss_exam' && (
                          <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1 font-semibold">
                            <Trophy className="w-3 h-3" /> Boss
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {node.description}
                    </p>

                    {/* Progress bar and concepts preview */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 text-[11px]">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{node.estimatedMinutes} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Mastery:</span>
                        <span className={`font-mono font-medium ${node.masteryPercent >= 80 ? 'text-emerald-400' : node.masteryPercent > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {node.masteryPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Inspector & Active Learning Actions */}
        <div className="lg:col-span-5 space-y-5">
          {selectedNode ? (
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                  {selectedNode.unit} • Milestone Details
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  selectedNode.status === 'completed' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : selectedNode.status === 'in_progress'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : selectedNode.status === 'locked'
                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {selectedNode.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold font-display text-white">
                  {selectedNode.title}
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Key Concept Pills */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  <span>Targeted Curriculum Concepts</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.keyConcepts.map((concept, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-medium"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Node Stats Box */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Time Estimate</span>
                  <span className="text-slate-100 font-semibold flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedNode.estimatedMinutes} Minutes
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Milestone Reward</span>
                  <span className="text-amber-300 font-semibold flex items-center gap-1 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    +{selectedNode.xpReward} XP Points
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleTriggerStartNode(selectedNode)}
                  disabled={selectedNode.status === 'locked'}
                  className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all ${
                    selectedNode.status === 'locked'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25'
                  }`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Practice & Quiz Arena for this Unit</span>
                </button>

                <button
                  onClick={() => handleTriggerTutor(`${selectedNode.title}: ${selectedNode.description}`)}
                  className="w-full py-2.5 rounded-xl font-medium text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center justify-center space-x-2 transition-all"
                >
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  <span>Ask Socratic Tutor to Teach this Topic</span>
                </button>

                {selectedNode.status !== 'completed' && (
                  <button
                    onClick={() => handleCompleteNode(selectedNode)}
                    className="w-full py-2 rounded-xl text-[11px] text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all font-medium"
                  >
                    Mark Milestone as Mastered (+{selectedNode.xpReward} XP)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 text-center text-slate-400 text-xs">
              Select a milestone node to inspect learning objectives.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Gemini AI Personalized Path Generator */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white font-display">
                  Gemini Personalized Study Path Generator
                </h3>
              </div>
              <button 
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateAiPath} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Grade Level</label>
                  <select
                    value={customForm.gradeLevel}
                    onChange={e => setCustomForm({ ...customForm, gradeLevel: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                  >
                    <option>Grade 9 (Freshman)</option>
                    <option>Grade 10 (Sophomore)</option>
                    <option>Grade 11 (Junior)</option>
                    <option>Grade 12 (Senior)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Exam Goal</label>
                  <input
                    type="text"
                    value={customForm.targetExam}
                    onChange={e => setCustomForm({ ...customForm, targetExam: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                    placeholder="e.g. AP Exam 5, SAT 1550+, Final Exam"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Target Score / Desired Mastery
                </label>
                <input
                  type="text"
                  value={customForm.targetScore}
                  onChange={e => setCustomForm({ ...customForm, targetScore: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                  placeholder="e.g. Score 5 or 98% in AP Calc"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Specific Weak Spots / Struggle Areas
                </label>
                <textarea
                  rows={3}
                  value={customForm.weakAreas}
                  onChange={e => setCustomForm({ ...customForm, weakAreas: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 resize-none leading-relaxed"
                  placeholder="e.g. I always get confused when applying integration by parts with trig functions, and I struggle with Taylor error bounds..."
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Available Study Hours per Week: <span className="text-cyan-400 font-bold">{customForm.availableHours} hrs</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={15}
                  step={1}
                  value={customForm.availableHours}
                  onChange={e => setCustomForm({ ...customForm, availableHours: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing Adaptive Path...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                      <span>Generate Personalized Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
