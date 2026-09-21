import { CuratedContentItem, UserProfile, AuditLogEntry, DailyStudyGoal } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-sih-2026-01',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@apexlearn.edu',
  role: 'Learner',
  department: 'Senior STEM Vanguard • Grade 11',
  bio: 'Aiming for 5s on AP Calculus BC and AP Physics C. Learning with active recall and visual schematics.',
  avatarUrl: '',
  mfaEnabled: true,
  loginMethod: 'google_sso',
  createdAt: '2026-08-15',
  lastLogin: 'Today, 09:42 AM',
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-101',
    timestamp: '2026-09-05 09:42:18',
    action: 'OAUTH_LOGIN',
    details: 'Authenticated via Google Identity SSO (Token verified, TLS 1.3)',
    userEmail: 'aarav.sharma@apexlearn.edu',
    userRole: 'Learner',
    ipAddress: '192.168.1.144',
    status: 'SUCCESS',
  },
  {
    id: 'log-102',
    timestamp: '2026-09-05 09:42:45',
    action: 'MFA_CHALLENGE',
    details: 'OTP verification succeeded (2FA authenticator token match)',
    userEmail: 'aarav.sharma@apexlearn.edu',
    userRole: 'Learner',
    ipAddress: '192.168.1.144',
    status: 'SUCCESS',
  },
  {
    id: 'log-103',
    timestamp: '2026-09-05 10:15:30',
    action: 'QUIZ_SUBMITTED',
    details: 'Completed "Unit 4: Integration by Parts" (Score: 80%, +150 XP)',
    userEmail: 'aarav.sharma@apexlearn.edu',
    userRole: 'Learner',
    ipAddress: '192.168.1.144',
    status: 'SUCCESS',
  },
  {
    id: 'log-104',
    timestamp: '2026-09-05 10:30:12',
    action: 'AI_CONTENT_CURATION_DISPATCH',
    details: 'Gemini NLP evaluated quiz mistakes and generated 4 tailored modalities',
    userEmail: 'aarav.sharma@apexlearn.edu',
    userRole: 'Learner',
    ipAddress: '192.168.1.144',
    status: 'SUCCESS',
  },
  {
    id: 'log-105',
    timestamp: '2026-09-05 11:05:00',
    action: 'ROLE_PERMISSION_CHECK',
    details: 'RBAC verification: Learner privileges authorized for curriculum nodes',
    userEmail: 'aarav.sharma@apexlearn.edu',
    userRole: 'Learner',
    ipAddress: '192.168.1.144',
    status: 'SUCCESS',
  },
];

export const INITIAL_DAILY_STUDY_GOAL: DailyStudyGoal = {
  targetMinutes: 45,
  minutesStudiedToday: 30,
  goalMetToday: false,
  sessionsLogged: 2,
  streakDays: 12,
};

export const INITIAL_CURATED_CONTENT: CuratedContentItem[] = [
  // 1. In-depth Article
  {
    id: 'cur-art-1',
    title: 'The Tabular Method vs. Classical Integration by Parts',
    subject: 'ap-calc-bc',
    topic: 'Integration by Parts',
    modality: 'article',
    difficulty: 'intermediate',
    estimatedTime: '7 min read',
    source: 'MIT Open Learning & Apex Research',
    summary: 'A definitive breakdown of when LIATE fails and how the sign-alternating tabular shortcut cuts integration time by 60% on AP FRQs.',
    matchReason: 'Triggered because question #4 on repeated integration of polynomials with trigonometric terms was flagged during your last diagnostic test.',
    xpReward: 80,
    keyTakeaways: [
      'LIATE hierarchy: Logarithmic, Inverse Trig, Algebraic, Trigonometric, Exponential.',
      'Tabular method applies whenever one factor differentiates to zero in finite steps.',
      'Watch cyclic integrals (like e^x sin x): stop differentiating when the original integral repeats and solve algebraically.',
    ],
    contentBody: `### Deep Dive: Solving Polynomial × Exponential Integrals Without Errors

Integration by parts stems directly from the Product Rule of differentiation:
\`\`\`
d/dx [u · v] = u'·v + u·v'
\`\`\`
Integrating both sides yields:
\`\`\`
u · v = ∫ v du + ∫ u dv  ==>  ∫ u dv = u·v - ∫ v du
\`\`\`

#### The LIATE Rule Priority:
When choosing **u**, proceed in this exact priority:
1. **L** - Logarithmic functions (e.g. \`ln(x)\`)
2. **I** - Inverse trigonometric functions (e.g. \`arctan(x)\`)
3. **A** - Algebraic / Polynomial expressions (e.g. \`x^3\`, \`3x^2\`)
4. **T** - Trigonometric functions (e.g. \`sin(x)\`, \`cos(x)\`)
5. **E** - Exponential functions (e.g. \`e^x\`, \`2^x\`)

#### Why Tabular Method Wins:
For integrals of the form \`∫ x^n · e^(kx) dx\` or \`∫ x^n · cos(kx) dx\`, drawing a two-column table (Differentiating column & Integrating column) with alternating signs \`(+ - + -)\` eliminates arithmetic sign errors. Always multiply diagonally and horizontally on the final non-zero row.`,
    tags: ['Calculus', 'Techniques of Integration', 'LIATE', 'AP FRQ Tips'],
  },

  // 2. High-Yield Video Lecture
  {
    id: 'cur-vid-1',
    title: 'Geometric Intuition of Integration by Parts & Revolutions',
    subject: 'ap-calc-bc',
    topic: 'Geometric Area Models',
    modality: 'video',
    difficulty: 'foundational',
    estimatedTime: '12 min video',
    source: 'Apex Visual Academy (Dr. Elena Vance)',
    summary: 'Visualize integration by parts as decomposing the area of a bounding rectangle [u·v] into two orthogonal area integrals.',
    matchReason: 'Tailored for your visual learning profile. Visual learners retain calculus concepts 2.4x longer when shown area decomposition models.',
    xpReward: 100,
    videoDuration: '11:45',
    videoTimestamps: [
      { label: 'Rectangle Area Decomposition', time: '01:15' },
      { label: 'Why the Minus Sign Exists', time: '04:30' },
      { label: 'Live Problem: ∫ x ln(x) dx Worked Out', time: '07:20' },
      { label: 'AP Exam Pitfalls with Definite Limits', time: '09:50' },
    ],
    keyTakeaways: [
      'Visualizing ∫ u dv as Area(total rectangle) - ∫ v du.',
      'Definite integration limits [a, b] apply to both the product u·v and the remaining integral.',
      'Common trap: forgetting to distribute negative signs across multi-term expressions.',
    ],
    contentBody: 'Video Masterclass: Dr. Elena Vance constructs dynamic Desmos geometric representations showing how the area between two curves maps directly into differential slices.',
    tags: ['Visual Calculus', 'Geometry', '3Blue1Brown Style', 'AP Prep'],
  },

  // 3. Interactive Practice Problem
  {
    id: 'cur-prac-1',
    title: 'Adaptive Challenge: Definite Integral of x²·cos(2x)',
    subject: 'ap-calc-bc',
    topic: 'Definite Integration by Parts',
    modality: 'practice_problem',
    difficulty: 'advanced',
    estimatedTime: '5 min practice',
    source: 'Apex Exam Bank & College Board Benchmark',
    summary: 'Test your mastery of multi-step integration by parts with definite boundaries from 0 to π/2. Instant feedback and step rubric included.',
    matchReason: 'Targeted to advance your readiness score from 4 to a solid 5 on AP Section I Part A (No-Calculator section).',
    xpReward: 90,
    keyTakeaways: [
      'Evaluate each term boundary-by-boundary to avoid sign errors.',
      'Factor out constants like (1/2) and (1/4) before plugging in π/2.',
    ],
    practiceProblem: {
      question: 'Evaluate the definite integral: ∫ from 0 to π/2 of [ x · sin(2x) ] dx',
      options: [
        'π / 4',
        'π / 2',
        '1 / 2',
        '(π - 1) / 4',
      ],
      correctIndex: 0,
      explanation: 'Using u = x and dv = sin(2x) dx:\n du = dx, v = -cos(2x)/2.\n∫ x sin(2x) dx = [-x·cos(2x)/2] from 0 to π/2 - ∫ [ -cos(2x)/2 ] dx\n= [ -(π/2)·cos(π)/2 - 0 ] + [ sin(2x)/4 ] from 0 to π/2\n= [ -(π/2)(-1)/2 ] + [ sin(π)/4 - 0 ]\n= π/4 + 0 = π/4.',
      hint: 'Remember that cos(π) = -1 and sin(π) = 0. Carefully watch the double negative sign in [-x·cos(2x)/2].',
    },
    tags: ['Practice Problem', 'Interactive Check', 'No-Calc', 'AP Calculus'],
  },

  // 4. Interactive Simulation & Cheat-Sheet
  {
    id: 'cur-sim-1',
    title: 'Interactive Curve Sandbox: Parameterizing ∫ xⁿ · e^(kx) dx',
    subject: 'ap-calc-bc',
    topic: 'Interactive Parameter Exploration',
    modality: 'interactive_simulation',
    difficulty: 'intermediate',
    estimatedTime: '6 min explore',
    source: 'Apex Interactive Labs',
    summary: 'Adjust exponents n and growth constant k in real-time to watch the antiderivative function morph, verifying convergence and inflection points.',
    matchReason: 'Kinesthetic/hands-on learning: tweaking variables directly builds instinctive number sense for high-stakes exams.',
    xpReward: 120,
    keyTakeaways: [
      'As power n increases, polynomial dominance near 0 expands.',
      'Exponential rate k controls how rapidly the curve asymptotically hugs the x-axis or shoots up.',
      'Antiderivative values can be visually estimated via tangent slopes.',
    ],
    simulationParameters: [
      { name: 'Polynomial Degree (n)', unit: 'integer', defaultVal: 2, min: 1, max: 5 },
      { name: 'Exponential Decay Rate (k)', unit: 'scale', defaultVal: 1.5, min: 0.5, max: 4.0 },
      { name: 'Integration Upper Limit (b)', unit: 'x-coord', defaultVal: 3, min: 1, max: 8 },
    ],
    contentBody: 'Interactive mathematical sandbox allows manipulating coefficients in real-time to observe the accumulation function F(x) = ∫ f(t) dt.',
    tags: ['Simulation', 'Visual Math', 'Kinesthetic Lab', 'Sandbox'],
  },

  // Biology Curated Item
  {
    id: 'cur-bio-1',
    title: 'Visual Chemiosmosis: The Mitochondrial Proton Gradient',
    subject: 'ap-bio',
    topic: 'Cellular Respiration & ATP Synthase',
    modality: 'article',
    difficulty: 'intermediate',
    estimatedTime: '8 min read',
    source: 'Campbell Biology & Apex BioCore',
    summary: 'Understand how complexes I, III, and IV pump protons into the intermembrane space, creating the proton motive force powering ATP synthase.',
    matchReason: 'Identified as a critical high-yield topic based on AP Biology Unit 3 scoring rubrics.',
    xpReward: 85,
    keyTakeaways: [
      'Proton gradient is both chemical (pH difference) and electrical (voltage difference).',
      'Electrons flow from lower to higher electronegativity (ending at Oxygen).',
      'Cyanide blocks Complex IV, halting the entire ETC and ATP synthesis.',
    ],
    contentBody: 'Detailed biological breakdown explaining the rotary motor mechanism of ATP synthase F0 and F1 subunits.',
    tags: ['Biology', 'Cellular Energetics', 'ATP Synthase'],
  },

  // Physics Curated Item
  {
    id: 'cur-phys-1',
    title: 'Rotational Dynamics: Parallel Axis Theorem Made Simple',
    subject: 'ap-physics',
    topic: 'Moment of Inertia',
    modality: 'video',
    difficulty: 'intermediate',
    estimatedTime: '10 min video',
    source: 'Apex Physics Lab',
    summary: 'Derive I = I_cm + M·d² from first principles and solve classic compound pendulum problems with zero memorization.',
    matchReason: 'Flagged from physics diagnostic where pivot points off the center-of-mass were tested.',
    xpReward: 95,
    videoDuration: '09:30',
    videoTimestamps: [
      { label: 'Center of Mass vs Off-Axis Pivot', time: '00:45' },
      { label: 'Derivation using Integral ∫ r² dm', time: '03:10' },
      { label: 'Example: Rod pivoted at L/4', time: '06:00' },
    ],
    keyTakeaways: [
      'Distance d is strictly measured between the center of mass axis and the parallel axis.',
      'I_cm is always the minimum possible moment of inertia for any given orientation.',
    ],
    contentBody: 'Physics video demonstration showing real physical pendulums oscillating at varying pivot distances.',
    tags: ['Physics C', 'Rotational Mechanics', 'Parallel Axis Theorem'],
  },
];

export const INITIAL_CURATED_ITEMS = INITIAL_CURATED_CONTENT;

