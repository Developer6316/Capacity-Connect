import React, { useState } from 'react';
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
  Timer,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMuted = propIsMuted !== undefined ? propIsMuted : internalMuted;
  const setIsMuted = propSetIsMuted || setInternalMuted;

  const currentTabId = activeTab || currentTab || 'courses';
  const handleSelectTab = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (setCurrentTab) setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
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

  // Primary navigation items (Enterprise Digital LMS core)
  const primaryNavItems = [
    { id: 'courses', label: 'Course Catalog', icon: BookMarked },
    { id: 'skill-gap', label: 'Skill-Gap Matrix', icon: Target },
    { id: 'knowledge', label: 'Knowledge Wiki', icon: FolderGit2 },
    { id: 'trainer', label: 'Trainer Studio', icon: Layers },
    { id: 'admin', label: 'Admin Console', icon: Settings },
  ];

  // Secondary learning modules
  const secondaryNavItems = [
    { id: 'paths', label: 'Adaptive Paths', icon: BookOpen },
    { id: 'mock-exams', label: 'Mock Exams', icon: Clock },
    { id: 'flashcards', label: 'Spaced Repetition', icon: Brain },
    { id: 'scratchpad', label: 'Math Scratchpad', icon: PenTool },
    { id: 'mind-map', label: 'Mind Map', icon: Network },
    { id: 'solver', label: 'AI Homework Solver', icon: Camera },
    { id: 'arena', label: 'Arena XP', icon: Swords },
    { id: 'tutor', label: 'Socratic Tutor', icon: BrainCircuit },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Subject Picker */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button 
              onClick={() => handleSelectTab('courses')}
              className="flex items-center gap-2.5 text-left group shrink-0"
              title="Return to Course Catalog"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600/90 border border-indigo-500/30 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:bg-indigo-600 transition-colors">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden min-[400px]:block">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base sm:text-lg text-white tracking-tight leading-none">
                    {portalName}
                  </span>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-indigo-400">
                    LMS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-normal line-clamp-1 max-w-[200px] sm:max-w-xs md:max-w-md mt-0.5">
                  {portalMotto}
                </p>
              </div>
            </button>

            {/* Subject Selector Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowSubjectMenu(!showSubjectMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
                aria-haspopup="listbox"
                aria-expanded={showSubjectMenu}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="truncate max-w-[110px] md:max-w-[140px]">{currentSubjectObj.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {showSubjectMenu && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Active Curriculum
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
                      <span className="text-[10px] text-slate-400">
                        {sub.tag}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Area: Typographic Stats (Unboxed), Primary Actions, Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Typographic Stats Bar (Human-made unboxed stats with typographic / dividers) */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-slate-300 pr-2 border-r border-slate-800">
              <div className="flex items-center gap-1.5" title="Daily Streak">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-white">{activeStats.streakDays}d streak</span>
              </div>
              <span className="text-slate-600">/</span>
              <div className="flex items-center gap-1.5" title="Experience Points">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium text-slate-200">Lvl {activeStats.level}</span>
                <span className="text-slate-400 text-[11px] font-mono">({activeStats.xp} XP)</span>
              </div>
              {dailyGoal && (
                <>
                  <span className="text-slate-600">/</span>
                  <div className="flex items-center gap-1.5" title="Daily Study Goal">
                    <Target className={`w-3.5 h-3.5 ${dailyGoal.goalMetToday ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="text-slate-300">{dailyGoal.minutesStudiedToday}/{dailyGoal.targetMinutes}m</span>
                  </div>
                </>
              )}
            </div>

            {/* User Profile & Role Switcher */}
            {currentUser && onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                title="Account Details & Permissions"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
              >
                <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-indigo-400 font-mono hidden md:inline">
                  [{currentUser.role}]
                </span>
              </button>
            )}

            {currentUser ? (
              onOpenLoginView && (
                <button
                  onClick={onOpenLoginView}
                  title="Switch Persona / Account"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">Switch Role</span>
                </button>
              )
            ) : (
              onOpenLoginView && (
                <button
                  onClick={onOpenLoginView}
                  title="Sign In to Portal"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )
            )}

            {/* 3-Minute Pitch PDF Button (Simple, clean, accessible) */}
            <button
              type="button"
              onClick={() => downloadHackathonPitchPDF()}
              title="Download 3-Minute Hackathon Pitch Script & Judges Quick-Sheet (PDF)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">3-Min Pitch</span>
              <span className="text-[10px] font-mono text-amber-400/80">PDF</span>
            </button>

            {/* Presentation Deck Modal Trigger */}
            {onOpenPresentationModal && (
              <button
                type="button"
                onClick={onOpenPresentationModal}
                title="View 6-Slide Presentation Deck"
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
              >
                <Presentation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deck</span>
              </button>
            )}

            {/* PWA Install Button */}
            <PWAInstallButton className="hidden xl:inline-flex" />

            {/* Sound Mute/Unmute */}
            <button
              onClick={handleMuteToggle}
              title={isMuted ? 'Unmute audio effects' : 'Mute audio'}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800"
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 lg:hidden"
              aria-label="Open Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-indigo-400" /> : <Menu className="w-5 h-5 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation Row (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center space-x-1 pb-2.5 overflow-x-auto scrollbar-none text-xs border-t border-slate-900 pt-2">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTabId === item.id || 
              (item.id === 'paths' && currentTabId === 'study-paths') ||
              (item.id === 'solver' && currentTabId === 'homework-solver') ||
              (item.id === 'arena' && currentTabId === 'gamified-arena') ||
              (item.id === 'tutor' && currentTabId === 'socratic-tutor') ||
              (item.id === 'analytics' && currentTabId === 'progress-analytics');

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation (Small and Medium screens) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 px-4 py-4 space-y-4 shadow-2xl">
          {/* Quick Stats in Mobile Drawer */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeStats.streakDays} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Level {activeStats.level} ({activeStats.xp} XP)</span>
            </div>
          </div>

          {/* Core LMS Sections */}
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 pb-1">
              Core Enterprise LMS
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTabId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEM Learning & Practice Tools */}
          <div className="space-y-1 pt-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 pb-1">
              Learning & Diagnostic Modules
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTabId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Footer Deck & Action Links */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
            {onOpenPresentationModal && (
              <button
                onClick={() => {
                  onOpenPresentationModal();
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-cyan-300 border border-slate-800 text-xs font-medium"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Open Deck</span>
              </button>
            )}
            {onLogout && currentUser && (
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
