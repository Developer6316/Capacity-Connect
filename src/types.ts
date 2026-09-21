export type SubjectId = 
  | 'ap-calc-bc' 
  | 'ap-bio' 
  | 'ap-physics' 
  | 'ap-chem' 
  | 'sat-prep' 
  | 'ap-ush' 
  | 'ap-cs-a';

export interface MilestoneNode {
  id: string;
  title: string;
  subject: SubjectId;
  unit: string;
  description: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  masteryPercent: number;
  estimatedMinutes: number;
  xpReward: number;
  type: 'concept' | 'quiz' | 'deep_dive' | 'boss_exam';
  keyConcepts: string[];
}

export interface StudyPath {
  id: string;
  subject: SubjectId;
  title: string;
  gradeLevel: string;
  targetExam: string;
  targetScore: string;
  totalUnits: number;
  completedUnits: number;
  masteryScore: number;
  weeklyGoalHours: number;
  nodes: MilestoneNode[];
  aiNotes?: string;
}

export interface UserStats {
  xp: number;
  level: number;
  levelTitle: string;
  nextLevelXp: number;
  streakDays: number;
  lastActiveDate: string;
  completedQuizzes: number;
  flashcardsReviewed: number;
  studyMinutesTotal: number;
  comboMultiplier: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  category: 'quiz' | 'flashcard' | 'pomodoro' | 'tutor' | 'homework';
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'mastery' | 'streak' | 'collaboration' | 'speed';
  unlockedAt?: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
  conceptTag: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
}

export interface Flashcard {
  id: string;
  subject: SubjectId;
  front: string;
  back: string;
  keyTerm: string;
  box: number; // 1 to 5 for Leitner Box
  nextReviewDate?: string;
  lastReviewed?: string;
}

export interface StudyCircle {
  id: string;
  name: string;
  subject: SubjectId;
  description: string;
  memberCount: number;
  activeOnline: number;
  weeklyGoalHours: number;
  currentHoursStudied: number;
  tags: string[];
  recentActivity: {
    id: string;
    studentName: string;
    action: string;
    timeAgo: string;
  }[];
  whiteboardNotes: {
    id: string;
    author: string;
    content: string;
    timestamp: string;
    pinned?: boolean;
  }[];
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
  formula?: string;
  engine?: string;
}

export interface HomeworkAnalysisResult {
  subject: string;
  topic: string;
  transcription: string;
  stepByStepSolution: {
    stepNumber: number;
    stepTitle: string;
    explanation: string;
    equationOrCode?: string;
  }[];
  conceptualExplanation: string;
  commonPitfalls: string[];
  keyFormulas: string[];
  practiceFollowUp: {
    question: string;
    answerHint: string;
  };
}

export interface GeneratedDiagramResult {
  imageUrl?: string;
  caption: string;
  labels: string[];
  educationalBreakdown: string;
  prompt: string;
}

export type UserRole = 'Trainee' | 'Trainer' | 'Admin' | 'Learner' | 'Instructor' | 'Field Worker' | 'Auditor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeOrStudentId?: string;
  targetRole?: string;
  avatarUrl?: string;
  bio: string;
  mfaEnabled: boolean;
  pin?: string;
  loginMethod: 'password' | 'google_sso' | 'gov_sso' | 'otp' | 'pin';
  createdAt: string;
  lastLogin: string;
}

// Digital LMS Course Structure
export interface CourseModuleItem {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz' | 'hands_on' | 'pdf';
  completed?: boolean;
  contentUrl?: string;
  resourceSummary?: string;
}

export interface TrainingCourse {
  id: string;
  code: string;
  title: string;
  category: 'Computer Science' | 'India Curricula' | 'AI & Data Science' | 'Cloud & DevOps' | 'Cybersecurity' | 'Leadership & Compliance';
  description: string;
  instructor: string;
  instructorRole?: string;
  organization?: string;
  durationHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrollmentCount: number;
  prerequisites: string[];
  targetSkills: string[];
  modules: CourseModuleItem[];
  enrolled: boolean;
  progress: number; // 0 to 100
  certified: boolean;
  regionBadge?: 'Global CS' | 'NPTEL / India' | 'GATE CS' | 'Enterprise Track';
  featured?: boolean;
  thumbnailGradient?: string;
}

// Skill Tracking & Skill-Gap Mapping Types
export interface SkillCompetency {
  id: string;
  name: string;
  category: 'Core CS' | 'Cloud & Infra' | 'Data & AI' | 'Security & Law' | 'System Architecture';
  currentLevel: number; // 1 to 5
  targetLevel: number;  // 1 to 5
  gapScore: number;     // targetLevel - currentLevel (positive means gap exists)
  priority: 'Critical' | 'Moderate' | 'Proficient';
  recommendedCourseIds: string[];
  assessedDate: string;
}

export interface SkillGapProfile {
  targetJobRole: string;
  lastAssessed: string;
  overallReadinessScore: number; // 0 to 100%
  competencies: SkillCompetency[];
}

// Peer-to-Peer Knowledge Repository
export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Engineering SOP' | 'Architecture RFC' | 'Interview Prep' | 'Exam Guide' | 'Security Protocol' | 'Code Standards';
  tags: string[];
  authorName: string;
  authorRole: UserRole;
  department: string;
  upvotes: number;
  hasUpvoted?: boolean;
  createdAt: string;
  readTime: string;
  views: number;
  commentsCount: number;
  attachments?: { name: string; size: string; type: string }[];
}

// Trainer Assessment Evaluation
export interface TrainerAssessmentSubmission {
  id: string;
  courseId: string;
  courseTitle: string;
  traineeId: string;
  traineeName: string;
  traineeEmail: string;
  assignmentTitle: string;
  submittedAt: string;
  status: 'Pending' | 'Graded' | 'Resubmission';
  score?: number; // 0 to 100
  feedback?: string;
  submissionText: string;
  fileAttachment?: string;
}

// Admin Portal Settings & Customization
export interface PortalCustomizationSettings {
  portalName: string;
  portalMotto: string;
  organizationName: string;
  primaryAccent: 'indigo' | 'emerald' | 'cyan' | 'purple' | 'amber';
  geminiApiKey: string;
  isCustomApiKeySet: boolean;
  activeGeminiModel: 'gemini-3.8-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';
  rateLimitingEnabled: boolean;
  allowPublicRegistration: boolean;
  requireMfa: boolean;
  enableAuditLogging: boolean;
  departments: string[];
  storageUsageMb: number;
  maxStorageMb: number;
  customResources: {
    id: string;
    title: string;
    type: 'PDF Document' | 'Curriculum Guide' | 'Video Library' | 'API Spec' | 'External Link';
    url: string;
    targetRole: string;
    addedBy: string;
    date: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  userEmail: string;
  userRole: UserRole;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
}

export type ContentModality = 'article' | 'video' | 'practice_problem' | 'interactive_simulation';

export interface CuratedContentItem {
  id: string;
  title: string;
  subject: SubjectId;
  topic: string;
  modality: ContentModality;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  estimatedTime: string;
  source: string;
  summary: string;
  keyTakeaways: string[];
  matchReason: string;
  xpReward: number;
  completed?: boolean;
  contentBody?: string;
  tags?: string[];
  videoDuration?: string;
  videoTimestamps?: { label: string; time: string }[];
  practiceProblem?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    hint: string;
  };
  simulationParameters?: {
    name: string;
    unit: string;
    defaultVal: number;
    min: number;
    max: number;
  }[];
}

export interface DailyStudyGoal {
  targetMinutes: number;
  minutesStudiedToday: number;
  goalMetToday: boolean;
  sessionsLogged: number;
  streakDays?: number;
}

export interface CourseCertificate {
  id: string;
  recipientName: string;
  courseTitle: string;
  issueDate: string;
  instructorName: string;
  score: number | string;
  verificationHash: string;
  studentName?: string;
  subjectTitle?: string;
  completionDate?: string;
  gradeScore?: string;
  verificationCode?: string;
  honorsLevel?: string;
}

// 1. Mock Exam Simulator Types
export interface ExamMCQ {
  id: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  equationOrFigure?: string;
}

export interface ExamFRQ {
  id: string;
  frqNumber: number;
  title: string;
  prompt: string;
  parts: {
    label: string; // e.g., "(a)", "(b)", "(c)"
    prompt: string;
    maxPoints: number;
    scoringRubric: string[];
    sampleSolution: string;
  }[];
}

export interface MockExam {
  id: string;
  subject: SubjectId;
  title: string;
  durationMinutes: number;
  totalPoints: number;
  mcqQuestions: ExamMCQ[];
  frqQuestions: ExamFRQ[];
  formulaSheet: {
    category: string;
    formulas: { label: string; formula: string; description: string }[];
  }[];
}

// 2. Spaced Repetition (SM-2) Types
export type SM2Rating = 'again' | 'hard' | 'good' | 'easy';

export interface SpacedFlashcard {
  id: string;
  subject: SubjectId;
  frontPrompt: string;
  backSolution: string;
  category: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Mastery';
  formulaOrCode?: string;
  mnemonic?: string;
  intervalDays: number;
  repetitionCount: number;
  easeFactor: number;
  nextReviewDate: string;
  lastReviewed?: string;
  retentionPercent: number;
}

// 3. Knowledge Graph & Cross-Subject Mind Map
export interface KnowledgeNode {
  id: string;
  label: string;
  subject: SubjectId;
  category: string;
  level: number; // 1: Foundation, 2: Core, 3: Advanced
  summary: string;
  crossSubjectBridges: string[]; // Subject IDs or node IDs it links to
  equations?: string[];
  x?: number;
  y?: number;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  label: string;
  type: 'prerequisite' | 'cross_discipline' | 'application';
}

// 4. Study Guide & Digest
export interface HighYieldTopic {
  id: string;
  subject: SubjectId;
  title: string;
  unit: string;
  keyTheorems: { name: string; statement: string; importance: string }[];
  commonMistakes: string[];
  examTips: string[];
  highYieldFormulas: string[];
}

// 5. Streak Activity Heatmap
export interface StreakDayActivity {
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Aug 12"
  fullDateLabel: string; // e.g. "Tuesday, August 12, 2026"
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  dayOfWeekShort: string; // 'Sun', 'Mon', etc.
  minutes: number;
  xpEarned: number;
  level: 0 | 1 | 2 | 3 | 4; // Heatmap intensity
  isToday: boolean;
  topics: string[];
  quizzesCompleted: number;
  flashcardsReviewed: number;
}

export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  activeDaysLast30: number;
  totalMinutesLast30: number;
  totalXpLast30: number;
  streakFreezeAvailable: boolean;
  streakFreezeActive: boolean;
}

// 6. Global Leaderboard & Competition Rankings
export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  department: string;
  institution?: string;
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  quizzesCompleted: number;
  rank?: number;
  division?: 'Grandmaster' | 'Diamond' | 'Platinum' | 'Gold' | 'Silver';
  recentBadge?: string;
  isCurrentUser?: boolean;
}



