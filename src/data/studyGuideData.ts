import { HighYieldTopic } from '../types';

export const HIGH_YIELD_TOPICS: HighYieldTopic[] = [
  {
    id: 'topic-calc-series',
    subject: 'ap-calc-bc',
    title: 'Infinite Series & Convergence Tests Master Summary',
    unit: 'Unit 10 (High-Yield 17-20% of AP Exam)',
    keyTheorems: [
      {
        name: 'Alternating Series Estimation Theorem (ASET)',
        statement: 'If an alternating series Σ (-1)^n b_n satisfies AST conditions, the remainder |R_n| = |S - S_n| ≤ b_(n+1).',
        importance: 'Tested on almost every Free Response Question #6 on AP Calculus BC.',
      },
      {
        name: 'Ratio Test',
        statement: 'lim_(n→∞) |a_(n+1) / a_n| = L. If L < 1 converges absolutely; if L > 1 diverges; if L = 1 inconclusive.',
        importance: 'Essential for finding radius and interval of convergence of power series.',
      },
      {
        name: 'Taylor Remainder Theorem (Lagrange Bound)',
        statement: '|R_n(x)| ≤ [M / (n+1)!] |x - c|^(n+1), where M is the maximum of |f^(n+1)(t)| between c and x.',
        importance: 'Guarantees accuracy bounds without calculating the exact infinite sum.',
      },
    ],
    commonMistakes: [
      'Forgetting to test endpoints independently when finding Interval of Convergence (IOC).',
      'Assuming that lim a_n = 0 implies convergence (Harmonic series Σ 1/n diverges!).',
      'Using the Ratio Test on p-series or rational functions where L always equals 1.',
    ],
    examTips: [
      'Memorize the 4 canonical Maclaurin series (e^x, sin x, cos x, 1/(1-x)) by heart.',
      'Always justify AST by explicitly writing: (1) terms alternate, (2) terms decrease, (3) limit is zero.',
    ],
    highYieldFormulas: [
      'e^x = 1 + x + x²/2! + x³/3! + ... = Σ x^n / n!',
      'sin(x) = x - x³/3! + x⁵/5! - ... = Σ (-1)^n x^(2n+1) / (2n+1)!',
      'cos(x) = 1 - x²/2! + x⁴/4! - ... = Σ (-1)^n x^(2n) / (2n)!',
      '1 / (1 - x) = 1 + x + x² + x³ + ... = Σ x^n,  |x| < 1',
    ],
  },
  {
    id: 'topic-phys-rotation',
    subject: 'ap-physics',
    title: 'Rotational Dynamics, Torque & Angular Momentum',
    unit: 'Unit 5 & 7 (Mechanics Core)',
    keyTheorems: [
      {
        name: 'Conservation of Angular Momentum',
        statement: 'If net external torque τ_ext = 0, total angular momentum L = I ω is strictly conserved.',
        importance: 'Explains figure skaters spinning faster when pulling arms in, planetary orbits.',
      },
      {
        name: 'Work-Kinetic Energy Theorem for Rolling',
        statement: 'Total kinetic energy K_total = 1/2 M v_cm² + 1/2 I_cm ω².',
        importance: 'Critical for predicting rolling races down inclines without slipping.',
      },
    ],
    commonMistakes: [
      'Confusing static friction f_s (which produces torque for rolling without dissipating mechanical energy) with kinetic friction.',
      'Calculating moment of inertia without using Parallel Axis Theorem when the pivot is not at the center of mass.',
    ],
    examTips: [
      'A hoop always loses a race down an incline compared to a cylinder or sphere because it has the largest fractional rotational inertia (I = MR²).',
      'Check vector cross products: τ⃗ = r⃗ × F⃗, direction determined by right-hand rule.',
    ],
    highYieldFormulas: [
      'τ⃗ = r⃗ × F⃗ = I α⃗',
      'L⃗ = r⃗ × p⃗ = I ω⃗',
      'I = I_cm + M D²',
      'a_cm = α R  (Rolling without slipping condition)',
    ],
  },
  {
    id: 'topic-bio-energetics',
    subject: 'ap-bio',
    title: 'Cellular Respiration & Photosynthetic Chemiosmosis',
    unit: 'Unit 3 (Cellular Energetics)',
    keyTheorems: [
      {
        name: 'Proton-Motive Force & ATP Synthase Coupling',
        statement: 'The movement of electrons through the electron transport chain pumps H⁺ ions into the intermembrane space or thylakoid lumen, generating a proton gradient that drives ATP synthesis.',
        importance: 'Primary mechanism of ATP generation across all aerobic life.',
      },
      {
        name: 'Enzyme Competitive vs Noncompetitive Inhibition',
        statement: 'Competitive inhibitors bind the active site (V_max constant, K_m increases). Noncompetitive inhibitors bind allosteric sites (V_max decreases, K_m constant).',
        importance: 'High-frequency AP Biology experimental design question.',
      },
    ],
    commonMistakes: [
      'Thinking plants only do photosynthesis and not cellular respiration (plants have mitochondria and respire 24/7!).',
      'Stating that oxygen is required for glycolysis (glycolysis is anaerobic and occurs in the cytoplasm).',
    ],
    examTips: [
      'Final electron acceptor of the mitochondrial ETC is Oxygen (O₂), yielding water (H₂O).',
      'Final electron acceptor of the light-dependent photosynthetic reactions is NADP⁺, yielding NADPH.',
    ],
    highYieldFormulas: [
      'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~30-32 ATP',
      'ΔG = ΔH - TΔS',
      'V_0 = (V_max [S]) / (K_m + [S])',
    ],
  },
];
