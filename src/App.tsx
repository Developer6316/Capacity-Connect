import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StudyPathView } from './components/StudyPathView';
import { VisualHomeworkSolver } from './components/VisualHomeworkSolver';
import { DiagramGenerator } from './components/DiagramGenerator';
import { GamifiedArena } from './components/GamifiedArena';
import { CollaborativeStudyGroups } from './components/CollaborativeStudyGroups';
import { SocraticTutor } from './components/SocraticTutor';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { AIContentCuration } from './components/AIContentCuration';
import { AuthModal } from './components/AuthModal';
import { CertificateModal } from './components/CertificateModal';
import { MockExamSimulator } from './components/MockExamSimulator';
import { SpacedRepetitionTrainer } from './components/SpacedRepetitionTrainer';
import { MathScratchpad } from './components/MathScratchpad';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { StudyGuideDigest } from './components/StudyGuideDigest';
import { OfflineBanner } from './components/OfflineBanner';
import { GlobalVoiceBar } from './components/GlobalVoiceBar';
import { AboutView } from './components/AboutView';
import { CourseCatalogView } from './components/CourseCatalogView';
import { SkillGapTracker } from './components/SkillGapTracker';
import { KnowledgeRepository } from './components/KnowledgeRepository';
import { TrainerPortal } from './components/TrainerPortal';
import { AdminPortal } from './components/AdminPortal';
import { ToastContainer, ToastItem } from "./components/ToastContainer";
import { LoginRegisterView } from './components/LoginRegisterView';
import { PresentationModal } from './components/PresentationModal';
import { useIdleTimeout } from './hooks/useIdleTimeout';

import { 
  DEFAULT_PORTAL_SETTINGS, 
  INITIAL_COURSES, 
  DEFAULT_SKILL_COMPETENCIES, 
  INITIAL_KNOWLEDGE_ARTICLES, 
  INITIAL_TRAINER_SUBMISSIONS 
} from './data/coursesData';

import { 
  SubjectId, 
  UserStats, 
  StudyPath, 
  Flashcard, 
  AchievementBadge, 
  StudyCircle, 
  DailyQuest,
  UserProfile,
  AuditLogEntry,
  DailyStudyGoal,
  CuratedContentItem,
  CourseCertificate,
  TrainingCourse,
  SkillCompetency,
  KnowledgeArticle,
  TrainerAssessmentSubmission,
  PortalCustomizationSettings,
  UserRole
} from './types';

import { 
  INITIAL_STUDY_PATHS, 
  INITIAL_FLASHCARDS, 
  INITIAL_BADGES, 
  INITIAL_STUDY_CIRCLES, 
  INITIAL_DAILY_QUESTS 
} from './data/curriculumData';

import { INITIAL_CURATED_ITEMS } from './data/curatedContentData';

import { sound } from './utils/audioSynth';
import confetti from 'canvas-confetti';

export default function App() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addToast = (message: string, linkText?: string, linkTab?: string, type: "success" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, linkText, linkTab, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  // User Identity & RBAC State (Trainee, Trainer, Admin, Learner, Instructor)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('capacity_connect_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('capacity_connect_current_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === 'Admin') return 'admin';
        if (u.role === 'Trainer' || u.role === 'Instructor') return 'trainer';
      }
    } catch {
      // ignore
    }
    return 'courses';
  });

  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('ap-calc-bc');

  // Digital LMS Portal Core State
  const [courses, setCourses] = useState<TrainingCourse[]>(INITIAL_COURSES);
  const [portalSettings, setPortalSettings] = useState<PortalCustomizationSettings>(DEFAULT_PORTAL_SETTINGS);
  const [skillCompetencies, setSkillCompetencies] = useState<SkillCompetency[]>(DEFAULT_SKILL_COMPETENCIES);
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>(INITIAL_KNOWLEDGE_ARTICLES);
  const [trainerSubmissions, setTrainerSubmissions] = useState<TrainerAssessmentSubmission[]>(INITIAL_TRAINER_SUBMISSIONS);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPresentationModalOpen, setIsPresentationModalOpen] = useState(false);

  // Auto-logout after 30 minutes of inactivity for shared institutional environments
  const handleIdleLogout = useCallback(() => {
    if (currentUser) {
      setCurrentUser(null);
      try {
        localStorage.removeItem('capacity_connect_current_user');
      } catch {
        // ignore
      }
      setIsLoginModalOpen(false);
      addToast('Session timed out after inactivity.', 'Sign In', 'login', 'info');
    }
  }, [currentUser]);

  useIdleTimeout(handleIdleLogout, 30 * 60 * 1000);

  // Enterprise Users Directory for Admin Management (Sole Admin: Developer6316)
  const [allUsers, setAllUsers] = useState<UserProfile[]>([
    {
      id: 'admin-developer6316',
      name: 'Developer6316',
      email: 'developer6316@capacityconnect.local',
      role: 'Admin',
      department: 'Platform Administration & System Governance',
      bio: 'Lead System Architect and Platform Super Administrator.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      loginMethod: 'pin',
      pin: '6316',
      createdAt: '2026-09-06',
      lastLogin: 'Ready (PIN: 6316)',
      mfaEnabled: true,
    },
    {
      id: 'trainer-1',
      name: 'Dr. Rajeshwari Iyer',
      email: 'r.iyer@institution.ac.in',
      role: 'Trainer',
      department: 'Advanced Systems & NPTEL Faculty',
      bio: 'Lead faculty in distributed systems, high concurrency architectures, and national curricula.',
      loginMethod: 'password',
      createdAt: '2026-03-12',
      lastLogin: 'Today, 08:45 AM',
      mfaEnabled: true,
    },
    {
      id: 'trainee-1',
      name: 'Arjun Sharma',
      email: 'arjun.sharma@institution.ac.in',
      role: 'Trainee',
      department: 'Computer Science & Engineering',
      bio: 'Enrolled in core CS and India Stack national capability tracks.',
      loginMethod: 'google_sso',
      createdAt: '2026-08-15',
      lastLogin: 'Today, 09:15 AM',
      mfaEnabled: true,
    },
  ]);

  // Immutable Audit Logs for SIH Compliance
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: 'Today, 08:30:14 AM',
      action: 'LOGIN_SUCCESS',
      details: 'User authenticated via Google SSO (OIDC OAuth2.0 / PKCE Flow)',
      userEmail: 'alex.rivera@highschool.edu',
      userRole: 'Learner',
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    },
    {
      id: 'log-2',
      timestamp: 'Today, 08:30:16 AM',
      action: 'MFA_CHALLENGE_VERIFIED',
      details: 'TOTP RFC-6238 token verified against institutional vault',
      userEmail: 'alex.rivera@highschool.edu',
      userRole: 'Learner',
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    },
    {
      id: 'log-3',
      timestamp: 'Today, 08:35:22 AM',
      action: 'DIAGNOSTIC_EVALUATION',
      details: 'Curriculum adaptive diagnostic path initialized for AP Calculus BC',
      userEmail: 'alex.rivera@highschool.edu',
      userRole: 'Learner',
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    },
  ]);

  // Daily Study Goal Tracker State
  const [dailyGoal, setDailyGoal] = useState<DailyStudyGoal>({
    targetMinutes: 45,
    minutesStudiedToday: 30,
    goalMetToday: false,
    sessionsLogged: 2,
  });

  // Curated Multi-Modal Content Items
  const [curatedItems, setCuratedItems] = useState<CuratedContentItem[]>(INITIAL_CURATED_ITEMS);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Certificate Data
  const [courseCertificate, setCourseCertificate] = useState<CourseCertificate>({
    id: 'cert-calc-bc-1',
    courseTitle: 'AP Calculus BC Mastery & Analytical Methods',
    recipientName: currentUser?.name || '',
    issueDate: 'October 15, 2025',
    instructorName: 'Dr. Evelyn Vance, MIT & College Board Fellow',
    score: 96,
    verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  });

  // User Stats State
  const [stats, setStats] = useState<UserStats>({
    xp: 3840,
    level: 14,
    levelTitle: 'Syllabus Strategist',
    nextLevelXp: 5600,
    streakDays: 12,
    lastActiveDate: 'Today',
    completedQuizzes: 38,
    flashcardsReviewed: 165,
    studyMinutesTotal: 430,
    comboMultiplier: 1.5,
  });

  // Core Data Collections
  const [studyPaths, setStudyPaths] = useState<StudyPath[]>(INITIAL_STUDY_PATHS);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_BADGES);
  const [studyCircles, setStudyCircles] = useState<StudyCircle[]>(INITIAL_STUDY_CIRCLES);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(INITIAL_DAILY_QUESTS);

  // Jump to Tutor with context topic
  const [tutorInitialTopic, setTutorInitialTopic] = useState<string | undefined>(undefined);

  const handleAddXp = (amount: number) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      const currentLevelCap = prev.level * 400;
      if (newXp >= currentLevelCap) {
        // Level up!
        sound.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.4 },
        });

        const nextLevel = prev.level + 1;
        const titles = [
          'Freshman Explorer',
          'Concept Apprentice',
          'Syllabus Strategist',
          'Honors Vanguard',
          'National AP Scholar',
          'Ivy League Valedictorian',
        ];
        const nextTitle = titles[Math.min(titles.length - 1, Math.floor(nextLevel / 5))];

        return {
          ...prev,
          xp: newXp,
          level: nextLevel,
          levelTitle: nextTitle,
        };
      }
      return { ...prev, xp: newXp };
    });
  };

  // -------------------------------------------------------------
  // Directory Storage Hydration & Synchronization (./data/ folder)
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Fetch users from local data/credentials.json
    fetch('/api/data/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users) && data.users.length > 0) {
          setAllUsers(data.users);
        }
      })
      .catch((err) => console.warn('[Storage] Local credentials fetch bypassed:', err));

    // 2. Fetch stored LMS state from local data/portal_state.json
    fetch('/api/data/store')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.state) {
          const s = data.state;
          if (Array.isArray(s.courses)) setCourses(s.courses);
          if (s.portalSettings) setPortalSettings(s.portalSettings);
          if (Array.isArray(s.skillCompetencies)) setSkillCompetencies(s.skillCompetencies);
          if (Array.isArray(s.knowledgeArticles)) setKnowledgeArticles(s.knowledgeArticles);
          if (Array.isArray(s.trainerSubmissions)) setTrainerSubmissions(s.trainerSubmissions);
          if (Array.isArray(s.auditLogs)) setAuditLogs(s.auditLogs);
          console.log('[Storage] Hydrated state from data/portal_state.json');
        }
      })
      .catch((err) => console.warn('[Storage] Local store fetch bypassed:', err));
  }, []);

  // Helper to persist current state to data/portal_state.json
  const persistStateToDisk = (overrides?: any) => {
    const payload = {
      courses,
      portalSettings,
      skillCompetencies,
      knowledgeArticles,
      trainerSubmissions,
      auditLogs,
      ...overrides,
    };
    fetch('/api/data/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.warn('[Storage Save Error]', err));
  };

  const handleCompleteNode = (nodeId: string) => {
    setStudyPaths((prevPaths) =>
      prevPaths.map((path) => {
        if (path.subject !== selectedSubject) return path;

        const updatedNodes = path.nodes.map((node) => {
          if (node.id === nodeId) {
            handleAddXp(node.xpReward);
            sound.playCorrect(2);
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
            return { ...node, status: 'completed' as const };
          }
          return node;
        });

        // Check if next node can be unlocked
        const completedIndex = updatedNodes.findIndex((n) => n.id === nodeId);
        if (completedIndex >= 0 && completedIndex + 1 < updatedNodes.length) {
          if (updatedNodes[completedIndex + 1].status === 'locked') {
            updatedNodes[completedIndex + 1] = {
              ...updatedNodes[completedIndex + 1],
              status: 'in_progress',
            };
          }
        }

        const completedCount = updatedNodes.filter((n) => n.status === 'completed').length;
        const newMastery = Math.round((completedCount / updatedNodes.length) * 100);

        return {
          ...path,
          nodes: updatedNodes,
          completedUnits: completedCount,
          masteryScore: newMastery,
        };
      })
    );
  };

  const handleSaveDiagramAsFlashcard = (title: string, imageUrl: string) => {
    const newCard: Flashcard = {
      id: `card-diagram-${Date.now()}`,
      subject: selectedSubject,
      front: `Diagram Model: ${title}`,
      back: `Visual Reference Generated: Inspect labeled components and verify equilibrium forces.`,
      box: 1,
      keyTerm: 'Visual Schematic',
      lastReviewed: 'Just now',
    };
    setFlashcards([newCard, ...flashcards]);
    handleAddXp(60);
  };

  const handleOpenTutorWithTopic = (topic: string) => {
    setTutorInitialTopic(topic);
    setActiveTab('tutor');
  };

  // Digital LMS & Capacity Building Handlers
  const handleAddAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleNptelEnroll = (title: string) => {
    addToast(`Redirecting to SWAYAM portal for ${title}...`, 'Go to Adaptive Paths', 'paths', 'info');
    handleAddXp(50);
  };

  const handleEnrollCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return { ...c, enrolled: true, progressPercent: Math.max(c.progressPercent, 10) };
        }
        return c;
      })
    );
    const course = courses.find(c => c.id === courseId);
    if (course) {
      addToast(`Successfully enrolled in ${course.title}!`, 'Go to Adaptive Paths', 'paths');
    }
    handleAddXp(120);
    sound.playCorrect(2);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    handleAddAuditLog({
      action: 'COURSE_ENROLLMENT',
      details: `Enrolled in course ID: ${courseId}`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
  };

  const handleToggleModuleCompletion = (courseId: string, moduleId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const updatedModules = c.modules.map((m) => {
          if (m.id === moduleId) {
            return { ...m, isCompleted: !m.isCompleted };
          }
          return m;
        });
        const completedCount = updatedModules.filter((m) => m.isCompleted).length;
        const total = updatedModules.length;
        const newPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
        const isCertified = newPercent === 100;

        if (newPercent > c.progressPercent) {
          handleAddXp(40);
          sound.playLevelUp();
        }

        return {
          ...c,
          modules: updatedModules,
          progressPercent: newPercent,
          certified: isCertified,
        };
      })
    );
  };

  const handleOpenCourseCertificate = (course: TrainingCourse) => {
    setCourseCertificate({
      id: `cert-${course.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
      courseTitle: course.title,
      recipientName: currentUser.name,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      instructorName: course.instructor || 'Academic Governance Council',
      score: '100% (Honors Distinction)',
      verificationHash: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-LMS2026`,
    });
    setIsCertModalOpen(true);
    sound.playLevelUp();
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
  };

  const handleUpdateCompetencies = (updated: SkillCompetency[]) => {
    setSkillCompetencies(updated);
    handleAddAuditLog({
      action: 'SKILL_GAP_UPDATED',
      details: `Self-assessment diagnostic updated across ${updated.length} competency areas.`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
  };

  const handleAddKnowledgeArticle = (newArticle: KnowledgeArticle) => {
    setKnowledgeArticles((prev) => [newArticle, ...prev]);
    handleAddXp(150);
    sound.playLevelUp();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    handleAddAuditLog({
      action: 'KNOWLEDGE_ARTICLE_PUBLISHED',
      details: `Published article: "${newArticle.title}" in category ${newArticle.category}`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
  };

  const handleUpvoteKnowledgeArticle = (articleId: string) => {
    setKnowledgeArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          const hasUpvoted = !art.hasUpvoted;
          const upvotes = hasUpvoted ? art.upvotes + 1 : Math.max(0, art.upvotes - 1);
          if (hasUpvoted) handleAddXp(20);
          return { ...art, hasUpvoted, upvotes };
        }
        return art;
      })
    );
  };

  const handleCreateCourse = (newCourse: TrainingCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
    handleAddXp(200);
    sound.playLevelUp();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    handleAddAuditLog({
      action: 'COURSE_CREATED',
      details: `New training course authored: [${newCourse.code}] ${newCourse.title}`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
  };

  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setTrainerSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          return {
            ...sub,
            status: 'Graded' as const,
            score,
            feedback,
          };
        }
        return sub;
      })
    );
    handleAddAuditLog({
      action: 'ASSESSMENT_GRADED',
      details: `Submission ${submissionId} graded: ${score}/100 with qualitative feedback.`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
  };

  const handleUploadMaterial = (courseId: string, materialName: string, materialType: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const newModule = {
            id: `mod-mat-${Date.now()}`,
            title: materialName,
            duration: '15 min read',
            type: (materialType === 'PDF' ? 'reading' : materialType === 'VIDEO' ? 'video' : 'practice') as any,
            isCompleted: false,
          };
          return {
            ...c,
            modules: [...c.modules, newModule],
          };
        }
        return c;
      })
    );
    handleAddAuditLog({
      action: 'MATERIAL_UPLOADED',
      details: `Uploaded ${materialType} "${materialName}" to course ID ${courseId}`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
  };

  const handleUpdatePortalSettings = (newSettings: PortalCustomizationSettings) => {
    setPortalSettings(newSettings);
    handleAddAuditLog({
      action: 'PORTAL_SETTINGS_UPDATED',
      details: `Portal customization updated. Active Gemini Model: ${newSettings.activeGeminiModel}. Custom Key: ${newSettings.isCustomApiKeySet ? 'Configured' : 'Default'}.`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole, newDept: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, role: newRole, department: newDept };
        }
        return u;
      })
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole, department: newDept }));
    }
    handleAddAuditLog({
      action: 'USER_ROLE_CHANGED',
      details: `User ${userId} permissions changed to ${newRole} in ${newDept}.`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
  };

  const handleExportData = () => {
    const snapshot = {
      exportTimestamp: new Date().toISOString(),
      portalSettings,
      courses,
      skillCompetencies,
      knowledgeArticles,
      trainerSubmissions,
      allUsers,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capacity_connect_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all portal configurations and restore defaults?')) {
      setPortalSettings(DEFAULT_PORTAL_SETTINGS);
      setCourses(INITIAL_COURSES);
      setSkillCompetencies(DEFAULT_SKILL_COMPETENCIES);
      setKnowledgeArticles(INITIAL_KNOWLEDGE_ARTICLES);
      setTrainerSubmissions(INITIAL_TRAINER_SUBMISSIONS);
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('capacity_connect_current_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
    setAllUsers((prev) => {
      const exists = prev.some((u) => u.email === user.email);
      if (!exists) return [...prev, user];
      return prev.map((u) => (u.email === user.email ? user : u));
    });
    setIsLoginModalOpen(false);
    
    // Always navigate directly to the appropriate dashboard
    if (user.role === 'Admin') {
      setActiveTab('admin');
    } else if (user.role === 'Trainer' || user.role === 'Instructor') {
      setActiveTab('trainer');
    } else {
      setActiveTab('courses');
    }

    handleAddAuditLog({
      action: 'LOGIN_SUCCESS',
      details: `User ${user.name} signed in as ${user.role} via ${user.loginMethod || 'Credentials'}.`,
      userEmail: user.email,
      userRole: user.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
    addToast(`Welcome, ${user.name}! Signed in as ${user.role}.`, 'View Portal', user.role === 'Admin' ? 'admin' : user.role === 'Trainer' ? 'trainer' : 'courses');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('capacity_connect_current_user');
    } catch (e) {
      console.warn('LocalStorage remove error', e);
    }
    setIsLoginModalOpen(false);
    setActiveTab('courses');
    handleAddAuditLog({
      action: 'LOGOUT',
      details: 'User logged out of session.',
      userEmail: currentUser?.email || 'user@capacityconnect.local',
      userRole: currentUser?.role || 'Guest',
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
    addToast('You have signed out successfully.', 'Sign In', 'login', 'info');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
        <LoginRegisterView 
          onLoginSuccess={handleLoginSuccess} 
          portalName={portalSettings.portalName}
          portalMotto={portalSettings.portalMotto}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white font-sans">
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(prev => prev.filter(t => t.id !== id))} onNavigate={setActiveTab} />
      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        selectedSubject={selectedSubject}
        userStats={stats}
        onSelectTab={setActiveTab}
        onSelectSubject={setSelectedSubject}
        dailyGoal={dailyGoal}
        currentUser={currentUser}
        portalName={portalSettings.portalName}
        portalMotto={portalSettings.portalMotto}
        onOpenLoginView={() => setIsLoginModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCertificateModal={() => setIsCertModalOpen(true)}
        onOpenPresentationModal={() => setIsPresentationModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Persistent Offline Connectivity Banner */}
      <OfflineBanner />

      {/* Main Content Workspace */}
      <main className="flex-1 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        {/* 1. Digital LMS: Course Catalog */}
        {activeTab === 'courses' && (
          <CourseCatalogView
            courses={courses}
            onEnroll={handleEnrollCourse}
            onNptelEnroll={handleNptelEnroll}
            onToggleModuleCompletion={handleToggleModuleCompletion}
            onOpenCertificateModal={handleOpenCourseCertificate}
          />
        )}

        {/* 2. Digital LMS: Skill-Gap Diagnostic & Tracking */}
        {activeTab === 'skill-gap' && (
          <SkillGapTracker
            competencies={skillCompetencies}
            allCourses={courses}
            targetJobRole={`${currentUser.department} Specialist`}
            onUpdateCompetencies={handleUpdateCompetencies}
            onEnrollCourse={handleEnrollCourse}
            onViewCourseDetails={() => {
              setActiveTab('courses');
            }}
          />
        )}

        {/* 3. Digital LMS: Peer-to-Peer Knowledge Wiki */}
        {activeTab === 'knowledge' && (
          <KnowledgeRepository
            articles={knowledgeArticles}
            currentUser={currentUser}
            onAddArticle={handleAddKnowledgeArticle}
            onUpvoteArticle={handleUpvoteKnowledgeArticle}
          />
        )}

        {/* 4. Digital LMS: Trainer Studio */}
        {activeTab === 'trainer' && (
          <TrainerPortal
            currentUser={currentUser}
            courses={courses}
            submissions={trainerSubmissions}
            onCreateCourse={handleCreateCourse}
            onGradeSubmission={handleGradeSubmission}
            onUploadMaterial={handleUploadMaterial}
          />
        )}

        {/* 5. Digital LMS: Admin Console */}
        {activeTab === 'admin' && (
          <AdminPortal
            settings={portalSettings}
            currentUser={currentUser}
            auditLogs={auditLogs}
            allCourses={courses}
            allUsers={allUsers}
            onUpdateSettings={handleUpdatePortalSettings}
            onUpdateUserRole={handleUpdateUserRole}
            onAddAuditLog={handleAddAuditLog}
            onExportData={handleExportData}
            onResetData={handleResetData}
          />
        )}

        {/* 6. Full-Page Login & Register Portal */}
        {activeTab === 'login' && (
          <div className="py-6">
            <LoginRegisterView
              onLoginSuccess={handleLoginSuccess}
              portalName={portalSettings.portalName}
              portalMotto={portalSettings.portalMotto}
            />
          </div>
        )}
        {activeTab === 'paths' && (
          <StudyPathView
            paths={studyPaths}
            selectedSubject={selectedSubject}
            onSelectNode={handleCompleteNode}
            onOpenTutor={handleOpenTutorWithTopic}
            onAddXp={handleAddXp}
            onUpdatePaths={setStudyPaths}
            dailyGoal={dailyGoal}
            onUpdateGoal={setDailyGoal}
          />
        )}

        {activeTab === 'mock-exams' && (
          <MockExamSimulator
            selectedSubject={selectedSubject}
            onAddXp={handleAddXp}
            onOpenCertificateModal={() => setIsCertModalOpen(true)}
          />
        )}

        {activeTab === 'flashcards' && (
          <SpacedRepetitionTrainer
            selectedSubject={selectedSubject}
            onAddXp={handleAddXp}
            onOpenTutorWithTopic={handleOpenTutorWithTopic}
          />
        )}

        {activeTab === 'scratchpad' && (
          <MathScratchpad
            selectedSubject={selectedSubject}
            onAddXp={handleAddXp}
            onOpenTutorWithTopic={handleOpenTutorWithTopic}
          />
        )}

        {activeTab === 'mind-map' && (
          <KnowledgeGraphView
            selectedSubject={selectedSubject}
            onOpenTutorWithTopic={handleOpenTutorWithTopic}
          />
        )}

        {activeTab === 'study-guides' && (
          <StudyGuideDigest
            selectedSubject={selectedSubject}
            userStats={{
              xp: stats.xp,
              streakDays: stats.streakDays,
              level: stats.level,
              totalStudyMinutes: stats.studyMinutesTotal,
            }}
            onOpenTutorWithTopic={handleOpenTutorWithTopic}
          />
        )}

        {(activeTab === 'curation' || activeTab === 'ai-curation') && (
          <AIContentCuration
            selectedSubject={selectedSubject}
            curatedItems={curatedItems}
            onUpdateCuratedItems={setCuratedItems}
            onOpenTutorWithTopic={handleOpenTutorWithTopic}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'solver' && (
          <VisualHomeworkSolver
            selectedSubject={selectedSubject}
            onAddXp={handleAddXp}
            onShareToCircle={(content) => {
              const activeCircle = studyCircles[0];
              if (activeCircle) {
                const updatedCircle = {
                  ...activeCircle,
                  whiteboardNotes: [
                    {
                      id: `note-${Date.now()}`,
                      author: 'You (Homework Solver)',
                      content,
                      timestamp: 'Just now',
                      pinned: true,
                    },
                    ...activeCircle.whiteboardNotes,
                  ],
                };
                setStudyCircles(studyCircles.map((c) => (c.id === activeCircle.id ? updatedCircle : c)));
                alert('Posted step breakdown directly to your collaborative study circle!');
              }
            }}
          />
        )}

        {activeTab === 'diagram' && (
          <DiagramGenerator
            selectedSubject={selectedSubject}
            onAddXp={handleAddXp}
            onSaveAsFlashcard={handleSaveDiagramAsFlashcard}
          />
        )}

        {activeTab === 'arena' && (
          <GamifiedArena
            selectedSubject={selectedSubject}
            flashcards={flashcards}
            dailyQuests={dailyQuests}
            comboMultiplier={stats.comboMultiplier}
            currentUser={currentUser}
            userStats={stats}
            onUpdateQuests={setDailyQuests}
            onUpdateFlashcards={setFlashcards}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'groups' && (
          <CollaborativeStudyGroups
            circles={studyCircles}
            selectedSubject={selectedSubject}
            onUpdateCircles={setStudyCircles}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'tutor' && (
          <SocraticTutor
            selectedSubject={selectedSubject}
            initialTopic={tutorInitialTopic}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'analytics' && (
          <ProgressAnalytics
            stats={stats}
            badges={badges}
            paths={studyPaths}
            onOpenTutorWithTopic={handleOpenTutorWithTopic}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'about' && (
          <AboutView 
            onNavigateToTab={setActiveTab} 
            onOpenPresentationModal={() => setIsPresentationModalOpen(true)}
          />
        )}
      </main>

      {/* Footer Branding & Server Architecture Details */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold text-slate-300">{portalSettings.portalName}</span>
            <span>•</span>
            <span className="hidden md:inline">{portalSettings.portalMotto}</span>
            <span className="hidden md:inline">•</span>
            <button 
              onClick={() => setActiveTab('about')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              About & Author (Developer6316)
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center space-x-3 font-mono text-[11px] text-slate-400">
            <span>Author: <strong className="text-indigo-300">Developer6316</strong></span>
            <span>•</span>
            <span>gemini-3.1-pro</span>
            <span>•</span>
            <span>gemini-3.8-flash</span>
          </div>
        </div>
      </footer>

      {/* Quick Sign In / Switch Account Modal */}
      {isLoginModalOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLoginModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        >
          <div className="relative w-full max-w-xl my-auto">
            <LoginRegisterView
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => setIsLoginModalOpen(false)}
              portalName={portalSettings.portalName}
              portalMotto={portalSettings.portalMotto}
            />
          </div>
        </div>
      )}

      {/* User Management & Security Modal (RBAC, MFA, Audit Logs, Credentials) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        auditLogs={auditLogs}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          try {
            localStorage.setItem('capacity_connect_current_user', JSON.stringify(updated));
          } catch (e) {
            console.warn(e);
          }
          if (updated.role === 'Admin') {
            setActiveTab('admin');
          } else if (updated.role === 'Trainer' || updated.role === 'Instructor') {
            setActiveTab('trainer');
          }
          setCourseCertificate((prev) => ({ ...prev, recipientName: updated.name }));
        }}
        onAddAuditLog={(entry) => {
          const newLog: AuditLogEntry = {
            ...entry,
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          };
          setAuditLogs([newLog, ...auditLogs]);
        }}
      />

      {/* Course Honors Mastery Certificate Modal */}
      <CertificateModal
        certificate={isCertModalOpen ? courseCertificate : null}
        onClose={() => setIsCertModalOpen(false)}
      />

      {/* 6-Slide Glass Effect Presentation Deck Modal */}
      <PresentationModal
        isOpen={isPresentationModalOpen}
        onClose={() => setIsPresentationModalOpen(false)}
        portalName={portalSettings.portalName}
      />

      {/* Floating Hands-Free Global Voice Navigation & Dictation Bar */}
      <GlobalVoiceBar
        onNavigate={(tab) => {
          setActiveTab(tab);
          sound.playClick();
        }}
        onSelectSubject={(subj) => {
          setSelectedSubject(subj);
          sound.playSuccess();
        }}
        onToggleSound={() => {
          sound.toggleMute();
        }}
        onReadProblem={() => {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const textToSpeak = `Current active view is ${activeTab}. Selected subject is ${selectedSubject}. Ready for your voice command.`;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
          }
        }}
      />
    </div>
  );
}
