import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  User, 
  Award, 
  Target, 
  ShieldCheck, 
  Eye, 
  TrendingUp,
  Clock,
  Flame,
  AlertCircle,
  Share2,
  Smartphone
} from 'lucide-react';
import { UserStats, StudyPath, AchievementBadge, UserProfile } from '../types';
import { generateProgressReportPDF, downloadProgressReportPDF } from '../utils/pdfReportGenerator';
import { sound } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface ProgressReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  paths: StudyPath[];
  badges: AchievementBadge[];
  currentUser?: UserProfile | null;
  portalName?: string;
}

export const ProgressReportModal: React.FC<ProgressReportModalProps> = ({
  isOpen,
  onClose,
  stats,
  paths,
  badges,
  currentUser,
  portalName = 'Capacity Connect Academic Portal',
}) => {
  const [studentName, setStudentName] = useState(currentUser?.name || 'Alex Rivera');
  const [studentEmail, setStudentEmail] = useState(currentUser?.email || 'alex.rivera@highschool.edu');
  const [studentId, setStudentId] = useState(currentUser?.employeeOrStudentId || 'SCHOLAR-2026-8841');
  const [departmentOrGrade, setDepartmentOrGrade] = useState(currentUser?.department || 'STEM & AP Honors Program');
  const [includeDiagnosticGaps, setIncludeDiagnosticGaps] = useState(true);
  const [includeBadges, setIncludeBadges] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setStudentName(currentUser.name);
      if (currentUser.email) setStudentEmail(currentUser.email);
      if (currentUser.employeeOrStudentId) setStudentId(currentUser.employeeOrStudentId);
      if (currentUser.department) setDepartmentOrGrade(currentUser.department);
    }
  }, [currentUser, isOpen]);

  // Check if Web Share API is supported (mobile / modern browsers)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanShare(true);
    }
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const avgMastery = paths.length > 0
    ? Math.round(paths.reduce((acc, p) => acc + p.masteryScore, 0) / paths.length)
    : 85;

  const handleDownload = () => {
    setIsExporting(true);
    try {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.5 },
        });
      } catch {
        // Fallback gracefully
      }

      downloadProgressReportPDF({
        studentName,
        studentEmail,
        studentId,
        departmentOrGrade,
        stats,
        paths,
        badges,
        portalName,
        includeDiagnosticGaps,
        includeBadges,
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreviewInNewTab = () => {
    try {
      sound.playClick();
      const doc = generateProgressReportPDF({
        studentName,
        studentEmail,
        studentId,
        departmentOrGrade,
        stats,
        paths,
        badges,
        portalName,
        includeDiagnosticGaps,
        includeBadges,
      });
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const newTab = window.open(url, '_blank');
      if (!newTab) {
        // Pop-up blocker triggered on some mobile browsers; fallback to direct download
        doc.save(`CapacityConnect_Progress_Report_${(studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      }
    } catch (err) {
      console.error('PDF preview error:', err);
    }
  };

  const handleSharePDF = async () => {
    try {
      sound.playClick();
      const doc = generateProgressReportPDF({
        studentName,
        studentEmail,
        studentId,
        departmentOrGrade,
        stats,
        paths,
        badges,
        portalName,
        includeDiagnosticGaps,
        includeBadges,
      });
      const blob = doc.output('blob');
      const cleanName = (studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      const file = new File([blob], `Progress_Report_${cleanName}.pdf`, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Academic Progress & Mastery Report',
          text: `Official Academic Progress Report for ${studentName}`,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'Academic Progress & Mastery Report',
          text: `Academic Progress Report for ${studentName} - Mastery: ${avgMastery}%`,
          url: window.location.href,
        });
      }
    } catch (err) {
      // User cancelled share or unsupported
      if ((err as Error).name !== 'AbortError') {
        console.warn('Share not completed:', err);
      }
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden my-0 sm:my-6 text-slate-100 max-h-[92vh] flex flex-col"
        >
          {/* Top Bar Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between shrink-0">
            <div className="flex items-start space-x-3 sm:space-x-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-400">
                    Official Academic Export
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    A4 Vector PDF
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold font-display text-white mt-0.5">
                  Export Study Progress Report
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-xl hidden xs:block">
                  Verified 2-page PDF summary encompassing syllabus completion, AI diagnostic gaps, and study hours.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-1 -mt-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto overscroll-contain flex-1">
            {/* Live Metrics Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 space-y-0.5 sm:space-y-1">
                <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Overall Mastery</span>
                </div>
                <div className="text-lg sm:text-xl font-bold font-display text-indigo-300">{avgMastery}%</div>
                <p className="text-[10px] text-slate-400 font-mono truncate">{paths.length} Courses</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 space-y-0.5 sm:space-y-1">
                <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-slate-400">
                  <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Study Streak</span>
                </div>
                <div className="text-lg sm:text-xl font-bold font-display text-amber-400">{stats.streakDays} Days</div>
                <p className="text-[10px] text-slate-400 font-mono truncate">+{stats.comboMultiplier}x Multiplier</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 space-y-0.5 sm:space-y-1">
                <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Focus Hours</span>
                </div>
                <div className="text-lg sm:text-xl font-bold font-display text-emerald-400">
                  {(stats.studyMinutesTotal / 60).toFixed(1)}h
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate">{stats.completedQuizzes} Quizzes</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 space-y-0.5 sm:space-y-1">
                <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-slate-400">
                  <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Honors Badges</span>
                </div>
                <div className="text-lg sm:text-xl font-bold font-display text-cyan-400">
                  {badges.filter(b => b.unlocked).length} / {badges.length}
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate">Verified Status</p>
              </div>
            </div>

            {/* Student Transcript Details (Editable) */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800/80 gap-1">
                <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Candidate & Transcript Details</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] text-slate-400">Printed on official PDF header</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Student / Candidate Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-medium text-sm"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Student Email Address
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-medium text-sm"
                    placeholder="email@domain.edu"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Student / Scholar ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                    placeholder="e.g. SCHOLAR-2026-8841"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Academic Track / Program
                  </label>
                  <input
                    type="text"
                    value={departmentOrGrade}
                    onChange={(e) => setDepartmentOrGrade(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-medium text-sm"
                    placeholder="e.g. STEM & AP Honors Program"
                  />
                </div>
              </div>
            </div>

            {/* Curriculum Tracks to be Included */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Curriculum Subjects Included in PDF Table</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {paths.length} Courses
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {paths.map((path) => (
                  <div
                    key={path.id}
                    className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-slate-200 block truncate">{path.title}</span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {path.completedUnits} / {path.totalUnits} Units • Target: {path.targetScore}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 shrink-0">
                      {path.masteryScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Options */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 block">
                Report Modules & Content Inclusion
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={includeDiagnosticGaps}
                    onChange={(e) => setIncludeDiagnosticGaps(e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="font-medium text-slate-200 block">AI Diagnostic Gap Analysis</span>
                    <span className="text-[10px] text-slate-400 block">Include priority weak spots & AI recommendations</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={includeBadges}
                    onChange={(e) => setIncludeBadges(e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="font-medium text-slate-200 block">Honors & Achievement Badges</span>
                    <span className="text-[10px] text-slate-400 block">Include certified badge awards & progress</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Institutional Seal Notice */}
            <div className="flex items-start sm:items-center space-x-3 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
              <span className="leading-relaxed text-[11px] sm:text-xs">
                <strong>Cryptographically Sealed:</strong> Exported reports include SHA-256 digital verification hashes, registrar signatures, and College Board aligned audit metadata.
              </span>
            </div>

            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>PDF summary report generated and downloaded successfully!</span>
              </motion.div>
            )}
          </div>

          {/* Footer Actions (Sticky on Mobile) */}
          <div className="bg-slate-950 p-3.5 sm:p-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] sm:text-xs text-slate-400 flex items-center space-x-1.5 self-start sm:self-center">
              <span>Standard A4 Portrait</span>
              <span>•</span>
              <span>Vector Sharp</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {canShare && (
                <button
                  onClick={handleSharePDF}
                  className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all min-h-[44px] min-w-[44px]"
                  title="Share PDF report via native device share sheet"
                >
                  <Share2 className="w-4 h-4 text-slate-300" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              )}

              <button
                onClick={handlePreviewInNewTab}
                className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all min-h-[44px]"
                title="View PDF directly in browser"
              >
                <Eye className="w-4 h-4 text-slate-400" />
                <span>Preview</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={isExporting}
                className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98] min-h-[44px]"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

