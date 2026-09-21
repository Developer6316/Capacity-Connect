import React, { useState, useEffect } from 'react';
import {
  Presentation,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Network,
  Layers,
  BarChart3,
  ShieldCheck,
  BrainCircuit,
  GraduationCap,
  Users,
  Compass,
  Cpu,
  Workflow,
  FileCheck,
  Flame,
  Award,
  BookOpen,
  Eye,
  HelpCircle,
  Clock,
  KeyRound,
  Zap,
  Check,
  FileText,
  Timer
} from 'lucide-react';
import { downloadHackathonPitchPDF } from '../utils/hackathonPdfGenerator';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalName?: string;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  portalName = 'Capacity Connect',
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const totalSlides = 6;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => (prev > 1 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose, totalSlides]);

  if (!isOpen) return null;

  const handleNext = () => setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : prev));
  const handlePrev = () => setCurrentSlide((prev) => (prev > 1 ? prev - 1 : prev));

  const slideTitles = [
    'Topic or Theme',
    'Realtime Problems Faced',
    'Problems Solved Using This Solution',
    'Structure Access & Architecture',
    'Complete Platform Features',
    'Others: Impact, Tech & Roadmap',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-2xl transition-all duration-300">
      {/* Background Ambient Glass Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Deck Container */}
      <div
        className={`relative w-full flex flex-col bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'fixed inset-0 rounded-none border-none h-screen max-w-none'
            : 'max-w-6xl max-h-[92vh] h-[820px]'
        }`}
      >
        {/* Frosted Glass Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02] backdrop-blur-md z-20">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950/70 rounded-[10px] flex items-center justify-center">
                <Presentation className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white tracking-wide">{portalName}</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Glass Deck
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                Slide {currentSlide} of {totalSlides}: {slideTitles[currentSlide - 1]}
              </p>
            </div>
          </div>

          {/* Quick Deck Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => downloadHackathonPitchPDF({ projectName: portalName })}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-rose-500/25 hover:from-amber-500/35 hover:to-rose-500/35 text-amber-200 border border-amber-500/40 text-xs font-semibold transition-all shadow-sm shadow-amber-500/10"
              title="Download 3-Minute Hackathon Pitch Script & Judges Quick-Sheet (PDF)"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>3-Min Pitch PDF</span>
            </button>

            <a
              href="/Capacity_Connect_Presentation.pptx"
              download="Capacity_Connect_Presentation.pptx"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 text-xs font-medium transition-all shadow-sm"
              title="Download 6-Slide PPTX Deck"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Download PPTX</span>
            </a>

            <a
              href="/Capacity_Connect_Presentation_Content.pdf"
              download="Capacity_Connect_Presentation_Content.pdf"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 text-xs font-medium transition-all shadow-sm"
              title="Download 7-Page PDF Presentation & Speaker Notes Guide"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Presentation PDF</span>
            </a>

            <a
              href="/Capacity_Connect_Explanation_Pros_Cons.pdf"
              download="Capacity_Connect_Explanation_Pros_Cons.pdf"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 text-xs font-medium transition-all shadow-sm"
              title="Download 2-Page Executive Explanation & Balanced Pros/Cons PDF"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Pros & Cons PDF</span>
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 border border-white/10 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-300 hover:text-rose-200 border border-white/10 hover:border-rose-500/30 transition-colors"
              title="Close Presentation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Canvas Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative flex flex-col justify-between scrollbar-none z-10">
          
          {/* ============================================================ */}
          {/* SLIDE 1: TOPIC OR THEME */}
          {/* ============================================================ */}
          {currentSlide === 1 && (
            <div className="space-y-8 animate-fadeIn my-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>SLIDE 01 • THEMATIC ARCHITECTURE</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-200 to-white">
                    Capacity Connect
                  </span>
                </h1>
                <h2 className="text-lg sm:text-xl font-medium text-cyan-400/90 tracking-wide">
                  Topic & Theme: Unified Digital Ecosystem for Institutional Training, Competency Development & Knowledge Sharing
                </h2>
                <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                  A modern, cognitive-first Learning Experience Platform (LXP / LMS) engineered to synthesize institutional 
                  training paths, empower trainers with automated evaluation telemetry, and guide learners through 
                  adaptive, 24/7 AI-scaffolded mastery.
                </p>
              </div>

              {/* Glass Frosted Pillar Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-lg hover:border-indigo-500/40 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">1. Trainee Capacity Growth</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Personalized multi-subject STEM & computational pathways with spaced repetition, interactive whiteboards, and multimodal Socratic tutoring.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-lg hover:border-cyan-500/40 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">2. Trainer Workflow Acceleration</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Centralized grading desk, automated rubrics scoring, trainee cohort telemetry, and verified competency matrix endorsements.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-lg hover:border-emerald-500/40 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">3. Institutional Governance</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Role-Based Access Control (RBAC), immutable audit logging, white-label portal customization, and verified honors certifications.
                  </p>
                </div>
              </div>

              {/* Glass Footer Tagline */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/30 via-slate-900/40 to-cyan-900/30 border border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span className="text-xs font-medium text-slate-200">
                    &ldquo;Empowering Trainees, Enabling Trainers, Elevating Institutional Excellence&rdquo;
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 hidden sm:inline">DEVELOPER6316 • SYSTEM GOVERNANCE</span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 2: REALTIME PROBLEMS FACED */}
          {/* ============================================================ */}
          {currentSlide === 2 && (
            <div className="space-y-6 animate-fadeIn my-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-xs font-semibold backdrop-blur-md">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>SLIDE 02 • THE EDUCATIONAL & TRAINING BOTTLENECK</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Realtime Problems Faced in Organizations & Institutions
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                  Traditional learning systems and corporate LMS tools suffer from deep fragmentation, lagging feedback, and cognitive overload.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-rose-500/20 backdrop-blur-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> 01. Fragmented Tooling
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Disjointed Learning Silos</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Learners juggle separate platforms for videos, code playgrounds, quiz spreadsheets, and PDF documents. Context switching causes cognitive fatigue and broken study continuity.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-amber-500/20 backdrop-blur-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> 02. Feedback Lag
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Trainer Grading Overload</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Trainers spend up to 70% of their time evaluating repetitive manual assignments. Trainees wait days or weeks for corrective feedback, stalling mastery when it matters most.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-indigo-500/20 backdrop-blur-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" /> 03. Passive Consumption
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Rapid Knowledge Decay</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Without active spaced repetition or interactive visualization, trainees forget up to 80% of technical formulas and principles within 48 hours (Ebbinghaus Forgetting Curve).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-purple-500/20 backdrop-blur-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> 04. Skill Invisibility
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Lack of Competency Matrix</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Leadership relies on binary attendance records rather than granular competency matrices. Critical organizational skill gaps remain invisible until project execution failures.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/20 backdrop-blur-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" /> 05. Connectivity Drops
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Zero-Tolerance Offline Flaws</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Standard web portals crash or lose unsaved quiz inputs when learners travel or experience institutional network disruptions.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-emerald-500/20 backdrop-blur-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> 06. Shallow AI Helpers
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Direct Answer Cheating</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Generic chatbot tools provide raw solutions without teaching the underlying mathematical or algorithmic logic, stifling critical reasoning and long-term problem solving.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 3: PROBLEMS SOLVED USING THIS SOLUTION */}
          {/* ============================================================ */}
          {currentSlide === 3 && (
            <div className="space-y-6 animate-fadeIn my-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>SLIDE 03 • TARGETED ARCHITECTURAL SOLUTIONS</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Problems Solved Using Capacity Connect
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                  How our unified cognitive platform directly resolves each organizational challenge through smart engineering.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Unified Single-Pane Digital Ecosystem</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Merges course progression, interactive code scratchpads, D3 visualization canvases, flashcards, and trainer grading into one fluid interface.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Socratic Multimodal AI Mentorship</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Powered by Google Gemini 3.8 Flash, the AI acts as a patient tutor that asks guiding questions, analyzes diagrams visually, and speaks explanations with voice synthesis.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Automated Rubric Scoring & Instant Feedback</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Reduces trainer evaluation turnaround from days to seconds with auto-graded assessments, code correctness checkers, and rubric breakdown.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Granular Skill Competency Matrix</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Visual radar telemetry mapping trainee proficiencies across institutional departments and technical proficiencies with verifiable credentials.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Supercharged Retention Engine (SM-2 Spaced Repetition)</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Mathematically schedules review intervals right before memory decay occurs, elevating long-term recall from 35% to 94%.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">PWA Offline-First Zero-Interruption Architecture</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Full Service Worker caching, local IndexedDB persistence, and seamless background sync allow learners to train uninterrupted anywhere.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 4: STRUCTURE ACCESS */}
          {/* ============================================================ */}
          {currentSlide === 4 && (
            <div className="space-y-6 animate-fadeIn my-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>SLIDE 04 • STRUCTURE ACCESS & ROLE-BASED GOVERNANCE</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Role-Based Architecture & System Access Structure
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                  Multi-tier role governance ensuring data isolation, specialized toolkits, and end-to-end platform security.
                </p>
              </div>

              {/* 3 Role Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Trainee */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-indigo-500/30 backdrop-blur-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs uppercase tracking-wider border border-indigo-500/30">
                        Trainee / Learner
                      </span>
                      <GraduationCap className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Empowered Learning Studio</h4>
                    <ul className="text-xs text-slate-300 space-y-2">
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Full Course Catalog Access & Modules</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> 24/7 AI Socratic Tutor & Voice Assistant</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Visual Homework Solver & Scratchpads</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Flashcards & Gamified Quiz Arena</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Personal Honors Certificate Generator</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
                    Scope: Personal Progress & Interactive Tools
                  </div>
                </div>

                {/* Trainer */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/30 backdrop-blur-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs uppercase tracking-wider border border-cyan-500/30">
                        Trainer / Faculty
                      </span>
                      <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Instructional Cockpit</h4>
                    <ul className="text-xs text-slate-300 space-y-2">
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Assessment Submission Evaluation Desk</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Rubrics Builder & Score Override Controls</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Trainee Cohort Performance Telemetry</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Skill Competency Matrix Endorsement</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Study Group Moderation & Content Curation</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
                    Scope: Cohort Telemetry & Curriculum Grading
                  </div>
                </div>

                {/* Admin */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/30">
                        Admin (Developer6316)
                      </span>
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Executive Governance</h4>
                    <ul className="text-xs text-slate-300 space-y-2">
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Enterprise User Directory & Role Assignment</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Portal White-label Branding & Settings</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Real-Time Security Audit Logs & IP Tracking</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Course Catalog & Subject Management</li>
                      <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Direct On-Demand PIN Challenge (Developer6316)</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
                    Scope: Full System Security & Infrastructure
                  </div>
                </div>
              </div>

              {/* Architecture Layer Bar */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Modern Technology Pipeline:</span>
                <span>Client (React 19 + Vite 6 + Tailwind CSS v4 + Motion)</span>
                <span>•</span>
                <span>Server Gateway (Node.js Express + TSX)</span>
                <span>•</span>
                <span>AI Core (Google Gemini 3.8 Flash SDK)</span>
                <span>•</span>
                <span>Security (Direct On-Demand PIN + Role Isolation)</span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 5: COMPLETE PLATFORM FEATURES */}
          {/* ============================================================ */}
          {currentSlide === 5 && (
            <div className="space-y-4 animate-fadeIn my-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>SLIDE 05 • COMPREHENSIVE PLATFORM CAPABILITIES</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    All Features Integrated in Capacity Connect
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    A complete suite of 15 high-impact modules engineered for learners, trainers, and administrators.
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    15 CORE MODULES
                  </span>
                </div>
              </div>

              {/* Grid of all features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  { name: '1. Modular Course Catalog', desc: 'Curated STEM & CS courses with video lessons, transcripts, & resource packs.', icon: BookOpen, color: 'text-indigo-400' },
                  { name: '2. 24/7 Socratic AI Tutor', desc: 'Gemini-powered conversational mentor with step scaffolding & voice synthesis.', icon: BrainCircuit, color: 'text-cyan-400' },
                  { name: '3. Visual Homework Solver', desc: 'Multimodal vision scanner parsing handwriting, math formulas & diagrams.', icon: Eye, color: 'text-amber-400' },
                  { name: '4. Generative STEM Canvas', desc: 'Dynamic D3/Desmos graphing, coordinate plotting & interactive geometry.', icon: Compass, color: 'text-emerald-400' },
                  { name: '5. Adaptive Spaced Repetition', desc: 'SM-2 flashcard scheduler calculating optimal recall intervals for axioms.', icon: Clock, color: 'text-rose-400' },
                  { name: '6. Gamified Arena & Battles', desc: 'Interactive quiz duels, streak multipliers, daily goals, & live XP ranking.', icon: Flame, color: 'text-amber-400' },
                  { name: '7. Trainer Assessment Desk', desc: 'Assignment submissions, automated rubric scoring, & trainer remarks.', icon: FileCheck, color: 'text-indigo-400' },
                  { name: '8. Skill Competency Matrix', desc: 'Radar chart tracking proficiencies across institutional departments.', icon: BarChart3, color: 'text-cyan-400' },
                  { name: '9. Centralized Knowledge Hub', desc: 'Searchable organizational documentation and technical research repository.', icon: BookOpen, color: 'text-emerald-400' },
                  { name: '10. Topological Knowledge Graph', desc: 'Visual network diagram connecting study nodes, prerequisites & concepts.', icon: Network, color: 'text-purple-400' },
                  { name: '11. Collaborative Study Groups', desc: 'Trainee study rooms, shared peer notes, and cohort discussion threads.', icon: Users, color: 'text-sky-400' },
                  { name: '12. Holographic Honors Certificates', desc: 'Cryptographic credentials with dynamic holographic gold foil border animations & PDF export.', icon: Award, color: 'text-amber-400' },
                  { name: '13. Enterprise Admin Governance', desc: 'Secure Developer6316 authentication with on-demand PIN modal, RBAC, & branding controls.', icon: ShieldCheck, color: 'text-rose-400' },
                  { name: '14. Security Audit Logger', desc: 'Real-time telemetry recording logins, role updates, and portal actions.', icon: KeyRound, color: 'text-indigo-400' },
                  { name: '15. PWA Offline-First Sync', desc: 'Full offline Service Worker caching with automatic background synchronization.', icon: Zap, color: 'text-emerald-400' },
                ].map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-white/20 transition-all flex items-start space-x-2.5"
                    >
                      <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 shrink-0 mt-0.5">
                        <Icon className={`w-4 h-4 ${feat.color}`} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{feat.name}</h4>
                        <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SLIDE 6: OTHERS (IMPACT, TECH & ROADMAP) */}
          {/* ============================================================ */}
          {currentSlide === 6 && (
            <div className="space-y-6 animate-fadeIn my-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>SLIDE 06 • IMPACT, SECURITY & STRATEGIC ROADMAP</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Empirical Impact, Enterprise Security & Roadmap
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                  Measurable institutional outcomes, robust architectural compliance, and future roadmap trajectory.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metrics */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" /> Empirical Performance
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-white mb-1">
                        <span>Concept Retention (SM-2)</span>
                        <span className="text-emerald-400">94%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-white mb-1">
                        <span>Gemini Latency SLA</span>
                        <span className="text-cyan-400">&lt; 400ms</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-white mb-1">
                        <span>Trainer Time Saved</span>
                        <span className="text-indigo-400">70%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-400 h-full rounded-full" style={{ width: '70%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Compliance & Security
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>Direct Admin PIN Auth:</strong> Focused modal challenge for Developer6316 without tab friction.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>Holographic Foil Certificates:</strong> CSS keyframe specular sheen and prismatic beam sweep animations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>Modern Stack Architecture:</strong> Built on React 19, Vite 6, Tailwind v4 & Google GenAI SDK.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span><strong>Immutable Audit Logs:</strong> Tamper-evident logging of logins, role updates, and grades.</span>
                    </li>
                  </ul>
                </div>

                {/* Strategic Roadmap */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4" /> Strategic Roadmap
                  </h4>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="font-bold text-purple-300">Q3 2026:</span> LTI 1.3 Canvas & Blackboard LMS Interoperability.
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="font-bold text-cyan-300">Q4 2026:</span> Edge On-Device AI models for zero-connectivity field zones.
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="font-bold text-emerald-300">Q1 2027:</span> Predictive Dropout AI & Adaptive Curriculum Curators.
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer Attribution Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    D
                  </div>
                  <div>
                    <span className="font-bold text-white">Author & Lead Architect:</span>{' '}
                    <span className="text-amber-300 font-mono">Developer6316</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Institutional Governance Edition</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-400 font-mono">Build 2026.09 (React 19 • Vite 6 • Tailwind v4)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Frosted Glass Footer Navigation Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02] backdrop-blur-md z-20">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 1}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold border border-white/10 transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Slide Indicator Dots with Labels */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                  currentSlide === idx
                    ? 'w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-indigo-500/30 ring-2 ring-white/30'
                    : 'w-7 h-7 bg-white/[0.05] hover:bg-white/[0.15] text-slate-400 text-xs border border-white/10'
                }`}
                title={`Jump to Slide ${idx}: ${slideTitles[idx - 1]}`}
              >
                {idx}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlide === totalSlides}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold border border-indigo-400/30 transition-all shadow-lg shadow-indigo-500/20"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
