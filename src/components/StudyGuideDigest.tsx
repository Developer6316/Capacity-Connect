import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Sparkles, 
  Flame, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { SubjectId } from '../types';
import { HIGH_YIELD_TOPICS } from '../data/studyGuideData';
import { sound } from '../utils/audioSynth';

interface StudyGuideDigestProps {
  selectedSubject: SubjectId;
  userStats: { xp: number; streakDays: number; level: number; totalStudyMinutes: number };
  onOpenTutorWithTopic?: (topic: string) => void;
}

export const StudyGuideDigest: React.FC<StudyGuideDigestProps> = ({
  selectedSubject,
  userStats,
  onOpenTutorWithTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'study-guide' | 'counselor-digest'>('study-guide');

  const currentTopic = HIGH_YIELD_TOPICS.find(t => t.subject === selectedSubject) || HIGH_YIELD_TOPICS[0];

  const handlePrint = () => {
    sound.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              High-Yield Academic Synthesizer
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Printable PDF & Parent Digest
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Study Guides & Counselor Digest</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Condensed high-yield cheat sheets for last-minute review, plus verified weekly progress digests formatted for parents and college counselors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('study-guide')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'study-guide' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              High-Yield Cheat Sheet
            </button>
            <button
              onClick={() => setActiveTab('counselor-digest')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'counselor-digest' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Parent & Counselor Digest
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {activeTab === 'study-guide' ? (
        /* High-Yield Study Guide Content */
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* Header of Cheat Sheet */}
          <div className="border-b border-slate-800 pb-6">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-400">
                {currentTopic.unit}
              </span>
              <span className="text-xs text-slate-500 font-mono">College Board High-Frequency Concept</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">{currentTopic.title}</h2>
          </div>

          {/* Key Theorems */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Core Theorems & Rigorous Criteria</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTopic.keyTheorems.map((t, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {t.statement}
                  </p>
                  <p className="text-[11px] text-cyan-400/90 font-medium">💡 AP Context: {t.importance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* High-Yield Formulas Bank */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Critical Equations to Memorize</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentTopic.highYieldFormulas.map((formula, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 flex items-center justify-between">
                  <span>{formula}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes & Pitfalls */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">
              Common Traps & Grader Pitfalls (Score Drop Traps)
            </h3>
            <div className="space-y-2">
              {currentTopic.commonMistakes.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✕</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Strategies */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              Chief Reader Advice & Test Day Hacks
            </h3>
            <div className="space-y-2">
              {currentTopic.examTips.map((tip, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Socratic follow-up */}
          {onOpenTutorWithTopic && (
            <div className="pt-4 border-t border-slate-800 flex justify-end print:hidden">
              <button
                onClick={() => onOpenTutorWithTopic(currentTopic.title)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Practice Problems on this Topic with Tutor</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Academic Counselor & Parent Progress Digest */
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Verified Academic Portfolio</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">Weekly Student Progress & Mastery Digest</h2>
              <p className="text-xs text-slate-400">Report Window: Current Academic Term • Standardized Prep Track</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 font-mono">Issued for:</span>
              <div className="text-sm font-bold text-white">Parshuv Nathan (Grade 11 Honors)</div>
              <span className="text-[11px] text-indigo-400 font-mono">Advisor: Dr. Elena Rostova</span>
            </div>
          </div>

          {/* Executive Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Weekly Study Time</span>
              <div className="text-2xl font-bold text-white mt-1">6.8 Hours</div>
              <span className="text-[10px] text-emerald-400 font-semibold">+1.2 hrs vs last week</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Active Study Streak</span>
              <div className="text-2xl font-bold text-amber-400 mt-1 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>{userStats.streakDays} Days</span>
              </div>
              <span className="text-[10px] text-slate-500">Perfect habit regularity</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Diagnostic Mastery</span>
              <div className="text-2xl font-bold text-indigo-400 mt-1">88% Composite</div>
              <span className="text-[10px] text-slate-500">Predicted AP Score: 5</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Total Practice XP</span>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{userStats.xp} XP</div>
              <span className="text-[10px] text-slate-500">Level {userStats.level} Scholar</span>
            </div>
          </div>

          {/* Detailed Course Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Unit Competency & Readiness Index</h3>
            <div className="space-y-2.5">
              {[
                { name: 'AP Calculus BC: Parametric & Vector Calculus', mastery: 94, status: 'Mastered' },
                { name: 'AP Calculus BC: Infinite Sequences & Taylor Series', mastery: 86, status: 'Strong' },
                { name: 'AP Physics C: Rotational Dynamics & Center of Mass', mastery: 90, status: 'Mastered' },
                { name: 'AP Biology: Cellular Respiration & Chemiosmosis', mastery: 84, status: 'Proficient' },
              ].map((unit, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-white">{unit.name}</span>
                      <span className="font-mono text-indigo-400 font-bold">{unit.mastery}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                        style={{ width: `${unit.mastery}%` }}
                      />
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 text-center">
                    {unit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Counselor Narrative Observation */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white">Academic Counselor Assessment & Commendation</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Parshuv continues to demonstrate exceptional rigor and mathematical maturity. Active daily recall through our Spaced Repetition Anki system has mitigated typical memory decay on Taylor Series error bounds. For the upcoming evaluation cycle, we encourage continued focus on Free-Response Question justification clarity to ensure maximum rubric points on Section 2."
            </p>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Cryptographic Hash: 8f2b7a94...1c09</span>
              <span>Official Department of Academic Excellence</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
