import { MockExam } from '../types';

export const INITIAL_MOCK_EXAMS: MockExam[] = [
  {
    id: 'exam-calc-bc-2025',
    subject: 'ap-calc-bc',
    title: 'AP Calculus BC Full Diagnostic & Mock Benchmark',
    durationMinutes: 45,
    totalPoints: 50,
    formulaSheet: [
      {
        category: 'Differential Calculus & Derivatives',
        formulas: [
          { label: 'Product Rule', formula: '(u · v)\' = u\'v + uv\'', description: 'Derivative of two multiplying differentiable functions' },
          { label: 'Quotient Rule', formula: '(u / v)\' = (u\'v - uv\') / v²', description: 'Derivative of rational expressions' },
          { label: 'Chain Rule', formula: 'd/dx [f(g(x))] = f\'(g(x)) · g\'(x)', description: 'Derivative of composite nested functions' },
          { label: 'Parametric 1st Derivative', formula: 'dy/dx = (dy/dt) / (dx/dt)', description: 'Slope of tangent line on parametric curve' },
          { label: 'Parametric 2nd Derivative', formula: 'd²y/dx² = [d/dt (dy/dx)] / (dx/dt)', description: 'Concavity of parametric curve' },
        ],
      },
      {
        category: 'Integration & Area/Volume',
        formulas: [
          { label: 'Integration by Parts', formula: '∫ u dv = uv - ∫ v du', description: 'LIATE rule selection order' },
          { label: 'Arc Length (Cartesian)', formula: 'L = ∫ √(1 + [f\'(x)]²) dx', description: 'Rectifiable curve length' },
          { label: 'Arc Length (Parametric)', formula: 'L = ∫ √((dx/dt)² + (dy/dt)²) dt', description: 'Distance traveled by particle' },
          { label: 'Polar Area', formula: 'A = 1/2 ∫ [r(θ)]² dθ', description: 'Area swept by ray from origin' },
        ],
      },
      {
        category: 'Sequences & Taylor Series',
        formulas: [
          { label: 'Taylor Polynomial', formula: 'P_n(x) = Σ [f^(k)(c)/k!] · (x - c)^k', description: 'Polynomial approximation centered at c' },
          { label: 'Maclaurin e^x', formula: 'e^x = 1 + x + x²/2! + x³/3! + ... = Σ x^n/n!', description: 'Radius of convergence R = ∞' },
          { label: 'Maclaurin sin(x)', formula: 'sin(x) = x - x³/3! + x⁵/5! - ...', description: 'Odd powers only, R = ∞' },
          { label: 'Maclaurin cos(x)', formula: 'cos(x) = 1 - x²/2! + x⁴/4! - ...', description: 'Even powers only, R = ∞' },
          { label: 'Geometric Series', formula: 'Σ ar^n = a / (1 - r),  |r| < 1', description: 'Sum of infinite convergent geometric series' },
          { label: 'Lagrange Error Bound', formula: '|R_n(x)| ≤ [M / (n+1)!] · |x - c|^(n+1)', description: 'M is max of |f^(n+1)(t)| between x and c' },
        ],
      },
    ],
    mcqQuestions: [
      {
        id: 'calc-mcq-1',
        questionNumber: 1,
        question: 'What is the sum of the infinite series Σ_(n=1)^∞ [ 3 / (4^n) ]?',
        options: ['1/3', '1', '4/3', '3/4'],
        correctAnswer: 1,
        explanation: 'This is a geometric series with first term a = 3/4 (when n=1) and common ratio r = 1/4. Since |r| < 1, the sum is S = a / (1 - r) = (3/4) / (1 - 1/4) = (3/4) / (3/4) = 1.',
        category: 'Infinite Series',
      },
      {
        id: 'calc-mcq-2',
        questionNumber: 2,
        question: 'A particle moves in the xy-plane with parametric equations x(t) = t³ - 3t and y(t) = 2t² + 1. At what time t > 0 is the velocity vector horizontal?',
        options: ['t = 0', 't = 1', 't = √3', 'The velocity vector is never horizontal for t > 0'],
        correctAnswer: 3,
        explanation: 'The velocity vector is horizontal when dy/dt = 0 while dx/dt ≠ 0. Here, dy/dt = 4t. Setting dy/dt = 0 yields t = 0. For any t > 0, dy/dt = 4t > 0, so the velocity vector is never purely horizontal.',
        category: 'Parametric & Vectors',
      },
      {
        id: 'calc-mcq-3',
        questionNumber: 3,
        question: 'Evaluate the improper integral ∫_(1)^∞ [ 1 / (x^(3/2)) ] dx.',
        options: ['Diverges', '1', '2', '3/2'],
        correctAnswer: 2,
        explanation: 'By the p-series integral test, with p = 3/2 > 1, the integral converges: lim_(b→∞) [-2 x^(-1/2)]_1^b = 0 - (-2 · 1) = 2.',
        category: 'Improper Integrals',
      },
      {
        id: 'calc-mcq-4',
        questionNumber: 4,
        question: 'Which of the following tests establishes that the series Σ_(n=1)^∞ [ (-1)^n / √(n) ] is conditionally convergent?',
        options: [
          'Ratio Test and Comparison Test',
          'Alternating Series Test and p-series Test',
          'Integral Test and Root Test',
          'Divergence Test and Limit Comparison Test'
        ],
        correctAnswer: 1,
        explanation: 'By the Alternating Series Test (AST), 1/√n > 0, is strictly decreasing, and lim 1/√n = 0, so the series converges. For absolute convergence, Σ 1/n^(1/2) is a p-series with p = 1/2 ≤ 1, which diverges. Therefore, it converges conditionally.',
        category: 'Infinite Series',
      },
      {
        id: 'calc-mcq-5',
        questionNumber: 5,
        question: 'Find the third-degree Taylor polynomial for f(x) = ln(1 + 2x) centered at x = 0.',
        options: [
          'P_3(x) = 2x - 2x² + (8/3)x³',
          'P_3(x) = 2x - 4x² + 8x³',
          'P_3(x) = x - x²/2 + x³/3',
          'P_3(x) = 2x + 2x² + (8/3)x³'
        ],
        correctAnswer: 0,
        explanation: 'Standard Maclaurin series for ln(1 + u) = u - u²/2 + u³/3 - ... Substituting u = 2x gives (2x) - (2x)²/2 + (2x)³/3 = 2x - 4x²/2 + 8x³/3 = 2x - 2x² + (8/3)x³.',
        category: 'Taylor & Maclaurin Series',
      },
    ],
    frqQuestions: [
      {
        id: 'calc-frq-1',
        frqNumber: 1,
        title: 'FRQ 1: Differential Equations & Logistic Slope Fields',
        prompt: 'Consider the differential equation dy/dt = (1/5) y (1 - y/200), modeling the population of trout y(t) in an alpine conservation lake, where t is measured in months.',
        parts: [
          {
            label: '(a)',
            prompt: 'Identify the carrying capacity of the lake and write the value of y for which the population growth rate dy/dt is maximized.',
            maxPoints: 3,
            scoringRubric: [
              '1 point for identifying carrying capacity K = 200 trout.',
              '1 point for determining that growth rate is maximum at half carrying capacity K/2 = 100 trout.',
              '1 point for justification using symmetry or setting d²y/dt² = 0.',
            ],
            sampleSolution: 'The standard logistic differential equation is dy/dt = k y (1 - y/K). Here, carrying capacity K = 200 trout. The growth rate dy/dt is a quadratic parabola in y opening downward with roots at y = 0 and y = 200. Its vertex occurs at y = 200 / 2 = 100 trout.',
          },
          {
            label: '(b)',
            prompt: 'Given initial condition y(0) = 40 trout, use Euler\'s Method with step size Δt = 2 to approximate the population y(4) after 4 months.',
            maxPoints: 4,
            scoringRubric: [
              '1 point for computing dy/dt|_(t=0) = (1/5)(40)(1 - 40/200) = 8(0.8) = 6.4.',
              '1 point for first step y(2) ≈ 40 + 6.4(2) = 52.8.',
              '1 point for slope evaluation at t=2: dy/dt ≈ (1/5)(52.8)(1 - 52.8/200) ≈ 7.77.',
              '1 point for second step y(4) ≈ 52.8 + 7.77(2) ≈ 68.34 trout.',
            ],
            sampleSolution: 'Step 1: At (t=0, y=40), dy/dt = 0.2 · 40 · (1 - 0.2) = 8 · 0.8 = 6.4. y(2) = 40 + (6.4)(2) = 52.8. Step 2: At (t=2, y=52.8), dy/dt = 0.2 · 52.8 · (1 - 52.8/200) = 10.56 · 0.736 ≈ 7.772. y(4) ≈ 52.8 + (7.772)(2) ≈ 68.34 trout.',
          },
        ],
      },
    ],
  },
  {
    id: 'exam-physics-c-2025',
    subject: 'ap-physics',
    title: 'AP Physics C Mechanics Mastery Benchmark',
    durationMinutes: 45,
    totalPoints: 45,
    formulaSheet: [
      {
        category: 'Kinematics & Newton\'s Laws',
        formulas: [
          { label: 'Kinematic 1', formula: 'v = v_0 + at', description: 'Constant linear acceleration' },
          { label: 'Kinematic 2', formula: 'x = x_0 + v_0 t + 1/2 a t²', description: 'Position with constant acceleration' },
          { label: 'Newton\'s Second Law', formula: 'ΣF = ma = dp/dt', description: 'Net external force equals time derivative of momentum' },
          { label: 'Hooke\'s Law', formula: 'F_s = -k x', description: 'Restoring force of ideal linear spring' },
        ],
      },
      {
        category: 'Rotational Dynamics & Momentum',
        formulas: [
          { label: 'Torque', formula: 'τ = r × F = I α', description: 'Rotational analog of force' },
          { label: 'Moment of Inertia', formula: 'I = ∫ r² dm', description: 'Rotational mass distribution' },
          { label: 'Angular Momentum', formula: 'L = r × p = I ω', description: 'Conserved when net external torque is zero' },
          { label: 'Parallel Axis Theorem', formula: 'I = I_cm + M D²', description: 'Shift of rotational axis by distance D' },
        ],
      },
    ],
    mcqQuestions: [
      {
        id: 'phys-mcq-1',
        questionNumber: 1,
        question: 'A uniform solid cylinder of mass M and radius R rolls without slipping down an incline of angle θ. What is the acceleration of its center of mass?',
        options: ['g sin(θ)', '(2/3) g sin(θ)', '(1/2) g sin(θ)', '(3/4) g sin(θ)'],
        correctAnswer: 1,
        explanation: 'For a solid cylinder, I_cm = (1/2) M R². For rolling without slipping, a_cm = α R. Newton\'s laws: Mg sin(θ) - f_s = M a_cm, and τ = f_s R = I α = (1/2 M R²)(a_cm / R) → f_s = 1/2 M a_cm. Substituting: Mg sin(θ) = M a_cm + 1/2 M a_cm = 3/2 M a_cm → a_cm = (2/3) g sin(θ).',
        category: 'Rotational Dynamics',
      },
      {
        id: 'phys-mcq-2',
        questionNumber: 2,
        question: 'A particle moves along the x-axis subject to a potential energy function U(x) = 4x² - x⁴. At what points is the particle in stable equilibrium?',
        options: ['x = 0 only', 'x = ±√2 only', 'x = 0 and x = ±√2', 'There are no stable equilibria'],
        correctAnswer: 1,
        explanation: 'Equilibrium occurs when dU/dx = 8x - 4x³ = 4x(2 - x²) = 0 → x = 0, x = ±√2. Stability requires d²U/dx² > 0. d²U/dx² = 8 - 12x². At x = 0: 8 - 0 = +8 > 0 (Local minimum → STABLE). Wait! Let\'s recheck: at x=±√2, d²U/dx² = 8 - 12(2) = 8 - 24 = -16 < 0 (Unstable local maximum). At x = 0, d²U/dx² = 8 > 0 (Stable). Therefore, x = 0 is the stable equilibrium!',
        category: 'Potential Energy & Oscillations',
      },
    ],
    frqQuestions: [
      {
        id: 'phys-frq-1',
        frqNumber: 1,
        title: 'FRQ 1: Non-Constant Drag Force & Terminal Velocity',
        prompt: 'A small sphere of mass m is released from rest in a viscous fluid and experiences a downward gravitational force mg and an upward velocity-dependent resistive drag force F_d = -b v, where b is a positive constant.',
        parts: [
          {
            label: '(a)',
            prompt: 'Write a differential equation in terms of m, g, b, and v for the motion of the sphere, and determine its terminal velocity v_t.',
            maxPoints: 3,
            scoringRubric: [
              '1 point for correct Newton\'s second law setup: m (dv/dt) = mg - bv.',
              '1 point for setting dv/dt = 0 for terminal velocity condition.',
              '1 point for finding terminal velocity v_t = mg / b.',
            ],
            sampleSolution: 'Applying Newton\'s Second Law taking downward as positive: m(dv/dt) = mg - bv. Terminal velocity is attained when acceleration dv/dt = 0, meaning drag balances weight: mg - bv_t = 0 → v_t = mg / b.',
          },
        ],
      },
    ],
  },
  {
    id: 'exam-bio-2025',
    subject: 'ap-bio',
    title: 'AP Biology Cell Energetics & Genetics Diagnostic',
    durationMinutes: 40,
    totalPoints: 40,
    formulaSheet: [
      {
        category: 'Biochemical Energetics & Probability',
        formulas: [
          { label: 'Gibbs Free Energy', formula: 'ΔG = ΔH - TΔS', description: 'Spontaneous reaction when ΔG < 0' },
          { label: 'Hardy-Weinberg Equation', formula: 'p² + 2pq + q² = 1;  p + q = 1', description: 'Allele and genotype frequencies in equilibrium' },
          { label: 'Chi-Square Test', formula: 'χ² = Σ (O - E)² / E', description: 'Goodness of fit between observed and expected' },
        ],
      },
    ],
    mcqQuestions: [
      {
        id: 'bio-mcq-1',
        questionNumber: 1,
        question: 'Dinitrophenol (DNP) uncouples the mitochondrial electron transport chain by making the inner membrane permeable to protons (H⁺). What direct metabolic effect will this have on cellular respiration in human cells?',
        options: [
          'ATP synthesis will halt while oxygen consumption and heat production increase',
          'Glycolysis will completely cease due to substrate-level phosphorylation inhibition',
          'NADH cannot be oxidized back to NAD⁺',
          'The citric acid cycle will run in reverse'
        ],
        correctAnswer: 0,
        explanation: 'DNP dissipates the proton motive force (chemiosmotic gradient) across the inner mitochondrial membrane without inhibiting the electron transport chain itself. Consequently, electrons continue flowing to oxygen, releasing free energy as heat, while ATP synthase lacks the proton gradient needed to generate ATP.',
        category: 'Cell Energetics & Mitochondria',
      },
    ],
    frqQuestions: [
      {
        id: 'bio-frq-1',
        frqNumber: 1,
        title: 'FRQ 1: Enzyme Catalysis & Competitive Inhibition',
        prompt: 'Researchers investigate the reaction rate of lactase as a function of substrate concentration [S] in the presence and absence of a competitive inhibitor galactitol.',
        parts: [
          {
            label: '(a)',
            prompt: 'Explain how a competitive inhibitor affects the maximum reaction velocity V_max and the Michaelis constant K_m of an enzymatic reaction.',
            maxPoints: 3,
            scoringRubric: [
              '1 point for stating that V_max remains unchanged because high substrate concentration can overcome competitive binding.',
              '1 point for stating that apparent K_m increases.',
              '1 point for biochemical explanation that inhibitor competes directly for active site affinity.',
            ],
            sampleSolution: 'A competitive inhibitor binds reversibly to the enzyme active site, directly competing with the substrate. At sufficiently high substrate concentrations, the substrate outcompetes the inhibitor, allowing the enzyme to achieve its original maximum velocity V_max. However, a higher concentration of substrate is required to reach half V_max, meaning the apparent Michaelis constant K_m increases.',
          },
        ],
      },
    ],
  },
];
