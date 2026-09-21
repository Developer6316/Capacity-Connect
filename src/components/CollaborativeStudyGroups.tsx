import React, { useState, useEffect } from 'react';
import { 
  Users2, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Clock, 
  Target, 
  Sparkles, 
  MessageSquare, 
  Plus, 
  Pin, 
  Flame, 
  Trophy, 
  Radio, 
  Send,
  UserCheck
} from 'lucide-react';
import { StudyCircle, SubjectId } from '../types';
import { sound } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface CollaborativeStudyGroupsProps {
  circles: StudyCircle[];
  selectedSubject: SubjectId;
  onUpdateCircles: (circles: StudyCircle[]) => void;
  onAddXp: (amount: number) => void;
}

export const CollaborativeStudyGroups: React.FC<CollaborativeStudyGroupsProps> = ({
  circles,
  selectedSubject,
  onUpdateCircles,
  onAddXp,
}) => {
  const [activeCircleId, setActiveCircleId] = useState<string>(circles[0]?.id || 'circle-calc');
  const activeCircle = circles.find(c => c.id === activeCircleId) || circles[0];

  // Pomodoro Focus Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'brown' | 'chimes'>('none');

  // Whiteboard New Note State
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [isPostingNote, setIsPostingNote] = useState<boolean>(false);

  // Synchronized Pomodoro timer tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds(prev => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
      sound.playLevelUp();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onAddXp(timerMode === 'focus' ? 120 : 20);

      // Switch mode
      if (timerMode === 'focus') {
        setTimerMode('break');
        setPomodoroSeconds(5 * 60);
      } else {
        setTimerMode('focus');
        setPomodoroSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds, timerMode]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    if (ambientSound !== 'none') {
      sound.startAmbient(ambientSound);
    }
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
    sound.stopAmbient();
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    sound.stopAmbient();
    setPomodoroSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const handleAmbientChange = (type: 'none' | 'rain' | 'brown' | 'chimes') => {
    setAmbientSound(type);
    if (type === 'none') {
      sound.stopAmbient();
    } else if (isTimerRunning) {
      sound.startAmbient(type);
    }
  };

  const handleAddWhiteboardNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      author: 'You (Student)',
      content: newNoteContent.trim(),
      timestamp: 'Just now',
    };

    const updatedCircle = {
      ...activeCircle,
      whiteboardNotes: [newNote, ...activeCircle.whiteboardNotes],
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          studentName: 'You',
          action: 'shared a collaborative concept note',
          timeAgo: 'Just now',
        },
        ...activeCircle.recentActivity,
      ],
    };

    onUpdateCircles(circles.map(c => c.id === activeCircle.id ? updatedCircle : c));
    setNewNoteContent('');
    onAddXp(50);
    sound.playCorrect(1);
  };

  const minutes = Math.floor(pomodoroSeconds / 60);
  const seconds = pomodoroSeconds % 60;
  const progressPct = Math.round((activeCircle.currentHoursStudied / activeCircle.weeklyGoalHours) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-black/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1">
            <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="font-mono uppercase tracking-wider">Live Peer Study Circles & Squads</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Collaborative Study Circles
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Study alongside high school peers with synchronized Pomodoro sessions, synthesizable acoustic focus sounds, shared concept whiteboards, and cohort study targets.
          </p>
        </div>

        {/* Circle Switcher Pills */}
        <div className="flex items-center flex-wrap gap-2">
          {circles.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCircleId(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                activeCircle.id === c.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                  : 'bg-slate-850/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Focus Room on Left, Collaborative Board on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pomodoro Room & Active Circle Metrics */}
        <div className="lg:col-span-5 space-y-4">
          {/* Synchronized Pomodoro Session Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-center space-y-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">Synchronized Circle Timer</span>
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">{activeCircle.activeOnline} Peers Active</span>
              </div>
            </div>

            {/* Timer Display */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                {timerMode === 'focus' ? 'Deep Work Focus Block' : 'Brain Recharge Break'}
              </span>
              <div className="font-display font-extrabold text-5xl sm:text-6xl text-white tracking-tight font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center items-center space-x-3">
              {isTimerRunning ? (
                <button
                  onClick={handlePauseTimer}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-amber-600/30 transition-all"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause Timer</span>
                </button>
              ) : (
                <button
                  onClick={handleStartTimer}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Synchronized Focus</span>
                </button>
              )}

              <button
                onClick={handleResetTimer}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Pure Synthetic Ambient Sound Selection */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Study Focus Ambience:</span>
                </span>
                <span className="font-mono text-cyan-400 uppercase text-[10px]">
                  {ambientSound}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'none', label: 'Off' },
                  { id: 'rain', label: 'Rain' },
                  { id: 'brown', label: 'Brown Noise' },
                  { id: 'chimes', label: 'Chimes' },
                ].map((soundOpt) => (
                  <button
                    key={soundOpt.id}
                    onClick={() => handleAmbientChange(soundOpt.id as any)}
                    className={`py-1 rounded-lg text-[11px] font-medium border transition-all ${
                      ambientSound === soundOpt.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {soundOpt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Group Target Progress */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Squad Weekly Study Goal</span>
              </h3>
              <span className="font-mono text-cyan-400 font-bold">{progressPct}%</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full transition-all duration-700" 
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{activeCircle.currentHoursStudied} Hours Logged</span>
              <span>Target: {activeCircle.weeklyGoalHours} Hours</span>
            </div>
          </div>

          {/* Peer Live Activity Stream */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3 text-xs">
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Peer Activity Feed</span>
            </h3>

            <div className="space-y-2">
              {activeCircle.recentActivity.map((act) => (
                <div 
                  key={act.id}
                  className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <span className="text-slate-300">
                    <strong className="text-cyan-300">{act.studentName}</strong> {act.action}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px] shrink-0 ml-2">
                    {act.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Collaborative Study Whiteboard & Sticky Notes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Collaborative Scratchpad & Concept Pinboard</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pin key exam formulas, memory heuristics, and tricky FRQ steps for all squad members.
                </p>
              </div>
            </div>

            {/* Post Note Input Box */}
            <form onSubmit={handleAddWhiteboardNote} className="space-y-2">
              <div className="relative">
                <textarea
                  rows={2}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Share a formula reminder, exam insight, or study tip with the circle..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pr-24 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
                <button
                  type="submit"
                  disabled={!newNoteContent.trim()}
                  className="absolute right-2.5 bottom-3.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>Pin (+50 XP)</span>
                </button>
              </div>
            </form>

            {/* Pinboard Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {activeCircle.whiteboardNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                    note.pinned
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-cyan-300 font-mono text-[11px]">
                      {note.author}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {note.pinned && <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                      <span className="text-[10px]">{note.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-slate-200 leading-relaxed font-sans">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
