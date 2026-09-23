import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  BrainCircuit, 
  Camera, 
  Flame, 
  Award, 
  ShieldCheck, 
  CheckCircle, 
  Presentation, 
  FileText, 
  Cpu, 
  BookOpen, 
  Layers, 
  Code2, 
  HeartHandshake, 
  ArrowRight,
  Terminal,
  UserCheck,
  Timer
} from 'lucide-react';
import { downloadHackathonPitchPDF } from '../utils/hackathonPdfGenerator';

interface AboutViewProps {
  onNavigateToTab: (tabId: string) => void;
  onOpenPresentationModal?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateToTab, onOpenPresentationModal }) => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Learning & Governance Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300">Capacity Connect</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Capacity Connect is a centralized, digital ecosystem for organizational training, competency development, and knowledge sharing. Designed to bridge cognitive gaps for modern learners, trainees, and engineers through structured curricula, adaptive skill-gap identification, and peer documentation.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => downloadHackathonPitchPDF()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
              title="Download 3-Minute Hackathon Pitch Script & Judges Quick-Sheet (PDF)"
            >
              <Timer className="w-4 h-4 text-slate-950" />
              <span>3-Min Pitch PDF</span>
            </button>

            {onOpenPresentationModal && (
              <button
                type="button"
                onClick={onOpenPresentationModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <Presentation className="w-4 h-4 text-indigo-200" />
                <span>Open Presentation Deck</span>
              </button>
            )}

            <a
              href="/Capacity_Connect_Presentation.pptx"
              download="Capacity_Connect_Presentation.pptx"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Presentation className="w-4 h-4 text-cyan-400" />
              <span>PPTX</span>
            </a>

            <button
              onClick={() => onNavigateToTab('paths')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
            >
              <span>Explore Study Paths</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Pedagogical Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Socratic Scaffolding</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rejecting superficial answer-dumping tools, our multimodal mentor deconstructs complex problems into guided conceptual inquiries and fundamental theorems.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Consistent Habit Loops</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Equipped with a 30-day GitHub/LeetCode-style contribution heatmap, daily study goals, streak shields, and XP rewards, learning becomes an engaging daily pursuit.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Verified Honors Mastery</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Standardized mock AP exam simulator with College Board rubric AI scoring, providing students with cryptographically verifiable academic honor credentials.
          </p>
        </div>
      </section>

      {/* Comprehensive Feature Breakdown */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Platform Modules & Features</h2>
            <p className="text-xs text-slate-400">Integrated suite of multimodal STEM learning utilities</p>
          </div>
          <span className="text-[11px] font-mono text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            10+ Integrated Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <BookOpen className="w-4 h-4" />
              <span>Adaptive Study Paths & Interactive Skill Tree</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visual dependency graphs representing prerequisite concepts, competency milestones, and AI-curated personalized curriculum pathways.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Flame className="w-4 h-4" />
              <span>30-Day Contribution Heatmap & Streak Hub</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              5-week × 7-day practice matrix tracking daily study intensity, day-by-day telemetry tooltips, streak freeze shields, and quick-log shortcuts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Camera className="w-4 h-4" />
              <span>Visual Multimodal Homework Solver</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini 3.1 Pro vision decoding for handwritten equations and diagrams, delivering Socratic guidance and 1-click peer whiteboard exports.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI Scientific Diagram Generator</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              On-demand generation of biology biochemical pathways, physics free-body diagrams, and calculus 3D graphs via Gemini Imagen, with flashcard export.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>Spaced Repetition Flashcards (SuperMemo SM-2)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Algorithmic review interval scheduling using confidence grading (Again, Hard, Good, Easy) to prevent cognitive decay and optimize exam recall.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Terminal className="w-4 h-4" />
              <span>Interactive Math Scratchpad & LaTeX Toolbar</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Digital canvas for stroke sketching and LaTeX math typesetting, paired with automated AI proof and calculation verification.
            </p>
          </div>
        </div>
      </section>

      {/* Engineering & Technology Architecture */}
      <section className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Full-Stack Technical Architecture</h2>
            <p className="text-xs text-slate-400">High-performance reactive frontend & secure AI middleware</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-semibold text-indigo-400 block">Frontend Client</span>
            <p className="text-slate-300 font-medium">React 18 + TypeScript</p>
            <p className="text-slate-400">Vite bundler, Tailwind CSS styling, Lucide icons, Motion transitions.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-semibold text-cyan-400 block">AI Intelligence</span>
            <p className="text-slate-300 font-medium">Google GenAI SDK</p>
            <p className="text-slate-400">Gemini 3.1 Pro (Vision), Gemini 3.8 Flash (Tutor), Imagen (Diagrams).</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-semibold text-emerald-400 block">Backend Server</span>
            <p className="text-slate-300 font-medium">Express + esbuild</p>
            <p className="text-slate-400">Zero-leak API key proxying, rate-limiting, and single CommonJS bundle.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="font-semibold text-amber-400 block">PWA & Offline</span>
            <p className="text-slate-300 font-medium">Workbox + Web Audio</p>
            <p className="text-slate-400">Offline asset caching, installable manifest, custom synthesizer sounds.</p>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* PROMINENT AUTHOR SECTION AT THE END (AS REQUESTED) */}
      {/* ========================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border-2 border-indigo-500/30 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Official Platform Architect & Creator</span>
            </div>

            <div>
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase block mb-1">
                Lead Architect & Author
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                <span>Developer6316</span>
                <span className="inline-flex items-center text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verified Author
                </span>
              </h2>
            </div>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Designed and developed the complete <strong>Capacity Connect</strong> learning ecosystem—from the multimodal AI vision pipelines and SuperMemo SM-2 recall engines to the LeetCode-style activity heatmaps and cryptographically verifiable academic certification system.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-400" /> Full-Stack Architecture
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Gemini AI Integration
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Presentation className="w-4 h-4 text-emerald-400" /> PPTX Presentation Author
              </span>
            </div>
          </div>

          {/* Author Badge Card */}
          <div className="w-full md:w-auto flex-shrink-0">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-xl text-center space-y-4 min-w-[260px]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/30">
                D
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Developer6316</h4>
                <p className="text-xs text-indigo-400 font-mono">Platform Author & Architect</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Edition:</span>
                  <span className="text-slate-200 font-semibold">Production 2026</span>
                </div>
                <div className="flex justify-between">
                  <span>Deck Author:</span>
                  <span className="text-indigo-300 font-semibold">Developer6316</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-semibold">Active & Maintained</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {onOpenPresentationModal && (
                  <button
                    type="button"
                    onClick={onOpenPresentationModal}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white border border-indigo-400/30 text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    <Presentation className="w-3.5 h-3.5 text-cyan-200" />
                    <span>View 6-Slide Glass Deck</span>
                  </button>
                )}

                <a
                  href="/Capacity_Connect_Presentation.pptx"
                  download="Capacity_Connect_Presentation.pptx"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all shadow-sm"
                >
                  <Presentation className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download PPTX Deck</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
