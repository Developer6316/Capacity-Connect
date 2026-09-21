import React from 'react';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  BrainCircuit, 
  Camera, 
  Palette, 
  Swords, 
  Users2, 
  BarChart3, 
  Volume2, 
  VolumeX,
  GraduationCap,
  ChevronDown,
  Target,
  ShieldCheck,
  User,
  Award,
  Clock,
  Brain,
  PenTool,
  Network,
  FileText,
  Presentation,
  Info,
  Layers,
  Settings,
  BookMarked,
  FolderGit2,
  LogIn,
  LogOut,
  Users,
  Timer
} from 'lucide-react';
import { SubjectId, UserStats, DailyStudyGoal, UserProfile } from '../types';
import { sound } from '../utils/audioSynth';
import { PWAInstallButton } from './PWAInstallButton';
import { downloadHackathonPitchPDF } from '../utils/hackathonPdfGenerator';

interface NavbarProps {
  currentTab?: string;
  activeTab?: string;
  setCurrentTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  selectedSubject: SubjectId;
  setSelectedSubject?: (sub: SubjectId) => void;
  onSelectSubject?: (sub: SubjectId) => void;
  stats?: UserStats;
  userStats?: UserStats;
  isMuted?: boolean;
  setIsMuted?: (muted: boolean) => void;
  dailyGoal?: DailyStudyGoal;
  currentUser?: UserProfile;
  onOpenAuthModal?: () => void;
  onOpenCertificateModal?: () => void;
  onOpenLoginView?: () => void;
  onOpenPresentationModal?: () => void;
  onLogout?: () => void;
  portalName?: string;
  portalMotto?: string;
}

const SUBJECTS: { id: SubjectId; label: string; tag: string }[] = [
  { id: 'ap-calc-bc', label: 'AP Calculus BC', tag: 'STEM' },
  { id: 'ap-bio', label: 'AP Biology', tag: 'Science' },
  { id: 'ap-physics', label: 'AP Physics C: Mech', tag: 'STEM' },
  { id: 'sat-prep', label: 'Digital SAT Prep', tag: 'Standardized' },
  { id: 'ap-chem', label: 'AP Chemistry', tag: 'Science' },
  { id: 'ap-ush', label: 'AP US History', tag: 'Humanities' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  activeTab,
  setCurrentTab,
  onSelectTab,
  selectedSubject,
  setSelectedSubject,
  onSelectSubject,
  stats,
  userStats,
  isMuted: propIsMuted,
  setIsMuted: propSetIsMuted,
  dailyGoal,
  currentUser,
  onOpenAuthModal,
  onOpenCertificateModal,
  onOpenLoginView,
  onOpenPresentationModal,
  onLogout,
  portalName = 'Capacity Connect',
  portalMotto = 'A centralized, digital ecosystem for organizational training, competency development, and knowledge sharing.',
}) => {
  const [internalMuted, setInternalMuted] = React.useState(false);
  const isMuted = propIsMuted !== undefined ? propIsMuted : internalMuted;
  const setIsMuted = propSetIsMuted || setInternalMuted;

  const currentTabId = activeTab || currentTab || 'courses';
  const handleSelectTab = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (setCurrentTab) setCurrentTab(tabId);
  };

  const handleSelectSubject = (subId: SubjectId) => {
    if (onSelectSubject) onSelectSubject(subId);
    else if (setSelectedSubject) setSelectedSubject(subId);
  };

  const activeStats = userStats || stats || {
    xp: 3840,
    level: 14,
    streakDays: 12,
    comboMultiplier: 1.5,
  };

  const [showSubjectMenu, setShowSubjectMenu] = React.useState(false);
  const currentSubjectObj = SUBJECTS.find(s => s.id === selectedSubject) || SUBJECTS[0];

  const handleMuteToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navItems = [
    { id: 'courses', label: 'Course Catalog', icon: BookMarked, badge: '12 Courses' },
    { id: 'skill-gap', label: 'Skill-Gap Matrix', icon: Target, badge: 'Role Fit' },
    { id: 'knowledge', label: 'Knowledge Wiki', icon: FolderGit2, badge: 'SOPs' },
    { id: 'trainer', label: 'Trainer Studio', icon: Layers, badge: currentUser?.role === 'Trainer' || currentUser?.role === 'Admin' ? 'Active' : 'Faculty' },
    { id: 'admin', label: 'Admin Console', icon: Settings, badge: currentUser?.role === 'Admin' ? 'Superuser' : 'Config' },
    { id: 'paths', label: 'Adaptive Paths', icon: BookOpen },
    { id: 'mock-exams', label: 'Mock Exams', icon: Clock, badge: 'Sim' },
    { id: 'flashcards', label: 'Spaced Repetition', icon: Brain, badge: 'SM-2' },
    { id: 'scratchpad', label: 'Math Scratchpad', icon: PenTool, badge: 'Stylus' },
    { id: 'mind-map', label: 'Mind Map', icon: Network, badge: 'Nexus' },
    { id: 'solver', label: 'AI Homework Solver', icon: Camera, badge: 'Vision' },
    { id: 'arena', label: 'Arena XP', icon: Swords, badge: 'XP' },
    { id: 'tutor', label: 'Socratic Tutor', icon: BrainCircuit },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info, badge: 'Author' },
  ];

  const xpProgress = Math.min(100, Math.round((activeStats.xp % 1000) / 10));

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 shadow-sm shadow-black/20">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Subject Picker */}
          <div className="flex items-center space-x-4">
            <div 
              onClick={() => handleSelectTab('courses')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/90 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-600 transition-all">
                <GraduationCap className="w-5 h-5 text-indigo-100 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                  {portalName} <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/25">Digital LMS</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-[280px] sm:max-w-md" title={portalMotto}>
                  {portalMotto}
                </p>
              </div>
            </div>

            {/* Subject Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSubjectMenu(!showSubjectMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-medium transition-all shadow-sm shadow-black/20"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{currentSubjectObj.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showSubjectMenu && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl shadow-black/70 py-1.5 z-50 backdrop-blur-md">
                  <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Select Active High School Course
                  </div>
                  {SUBJECTS.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        handleSelectSubject(sub.id);
                        setShowSubjectMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/60 transition-colors ${
                        sub.id === selectedSubject ? 'text-indigo-400 bg-slate-800/40 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-400 border border-slate-800">
                        {sub.tag}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gamified Stat Badges, Daily Goal, User & Sound */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* Daily Goal Pill */}
            {dailyGoal && (
              <button
                onClick={() => handleSelectTab('paths')}
                title="Daily Study Focus Goal"
                className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  dailyGoal.goalMetToday
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Target className={`w-3.5 h-3.5 ${dailyGoal.goalMetToday ? 'text-emerald-400 animate-pulse' : 'text-indigo-400'}`} />
                <span>{dailyGoal.minutesStudiedToday}/{dailyGoal.targetMinutes}m</span>
                {dailyGoal.goalMetToday && <span className="text-[10px] text-emerald-400 font-bold">✓ Met</span>}
              </button>
            )}

            {/* Streak Counter */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>{activeStats.streakDays}d</span>
              <span className="text-[10px] text-amber-300/80 font-normal hidden lg:inline">({activeStats.comboMultiplier}x)</span>
            </div>

            {/* Level & XP Gauge */}
            <div className="hidden sm:flex items-center space-x-2.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs">
              <div className="flex items-center space-x-1 font-semibold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Lvl {activeStats.level}</span>
              </div>
              <div className="w-14 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-500" 
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{activeStats.xp} XP</span>
            </div>

            {/* Certificate Honor Award Trigger */}
            {onOpenCertificateModal && (
              <button
                onClick={onOpenCertificateModal}
                title="View Cryptographic Certificate of Academic Mastery"
                className="hidden xl:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Certificate</span>
              </button>
            )}

            {/* User Profile / RBAC Trigger */}
            {currentUser && onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                title="User Management, RBAC Roles & Security Details"
                className="flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-all shadow-sm group"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-[11px]">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-indigo-400 font-mono">
                    {currentUser.role}
                  </span>
                </div>
              </button>
            )}

            {/* Role Switching & Authentication Controls */}
            {currentUser ? (
              <div className="flex items-center space-x-1.5">
                {onOpenLoginView && (
                  <button
                    onClick={onOpenLoginView}
                    title="Switch Persona / Account (Trainee, Trainer, Admin)"
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-medium transition-all shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Switch Role</span>
                  </button>
                )}
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Sign Out of session"
                    className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-slate-900 hover:bg-rose-500/15 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-medium transition-all shadow-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">Sign Out</span>
                  </button>
                )}
              </div>
            ) : (
              onOpenLoginView && (
                <button
                  onClick={onOpenLoginView}
                  title="Sign In to Portal"
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm shadow-indigo-600/20"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )
            )}

            {/* 3-Minute Hackathon Pitch PDF Download Button */}
            <button
              type="button"
              onClick={() => downloadHackathonPitchPDF()}
              title="Download 3-Minute Hackathon Pitch Script & Judges Quick-Sheet (PDF)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-semibold transition-all shadow-sm shadow-amber-500/10 active:scale-95"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">3-Min Pitch PDF</span>
              <span className="sm:hidden">Pitch</span>
            </button>

            {/* Glass Presentation Deck Button */}
            {onOpenPresentationModal ? (
              <button
                type="button"
                onClick={onOpenPresentationModal}
                title="View 6-Slide Glass Effect Presentation (Author: Developer6316)"
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm shadow-cyan-500/10 active:scale-95"
              >
                <Presentation className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Presentation</span>
              </button>
            ) : (
              <a
                href="/Capacity_Connect_Presentation.pptx"
                download="Capacity_Connect_Presentation.pptx"
                title="Download 6-Slide Glass Presentation (Author: Developer6316)"
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-medium transition-all shadow-sm"
              >
                <Presentation className="w-3.5 h-3.5 text-indigo-400" />
                <span>Presentation</span>
              </a>
            )}

            {/* PWA Install Button */}
            <PWAInstallButton className="hidden sm:inline-flex" />

            {/* Sound Mute/Unmute */}
            <button
              onClick={handleMuteToggle}
              title={isMuted ? 'Unmute focus audio & effects' : 'Mute audio'}
              className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800 shadow-sm"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTabId === item.id || 
              (item.id === 'paths' && currentTabId === 'study-paths') ||
              (item.id === 'curation' && (currentTabId === 'curation' || currentTabId === 'ai-curation')) ||
              (item.id === 'solver' && currentTabId === 'homework-solver') ||
              (item.id === 'diagram' && currentTabId === 'concept-diagrams') ||
              (item.id === 'arena' && currentTabId === 'gamified-arena') ||
              (item.id === 'groups' && currentTabId === 'study-circles') ||
              (item.id === 'tutor' && currentTabId === 'socratic-tutor') ||
              (item.id === 'analytics' && currentTabId === 'progress-analytics');

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-indigo-700/80 text-indigo-200' : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

