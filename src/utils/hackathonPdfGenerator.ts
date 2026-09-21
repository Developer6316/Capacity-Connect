import { jsPDF } from 'jspdf';

export interface HackathonPitchOptions {
  teamName?: string;
  projectName?: string;
  tagline?: string;
  trackName?: string;
  presenterName?: string;
}

/**
 * Generates a clean, high-impact, 2-page A4 PDF designed for a strict 3-minute hackathon pitch & judging round.
 * Page 1: 3-Minute Minute-by-Minute Pitch Script & Slide Flow (0:00 -> 3:00)
 * Page 2: Hackathon Quick-Sheet (Problem, Solution, Tech Stack, Competitive Moat & Live Demo Checklist)
 */
export function generateHackathonPitchPDF(options: HackathonPitchOptions = {}): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2;

  const projectName = options.projectName || 'Capacity Connect';
  const tagline = options.tagline || 'Cognitive-First Learning Experience & Knowledge Sharing Ecosystem';
  const track = options.trackName || 'EdTech / AI for Good / Enterprise Training';
  const presenter = options.presenterName || 'Alex Rivera & Team';

  // ==========================================
  // PAGE 1: 3-MINUTE PITCH TIMELINE & VERBATIM SCRIPT
  // ==========================================

  // Dark Institutional Top Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Gradient accent strip
  doc.setFillColor(99, 102, 241); // indigo-500
  doc.rect(0, 36, pageWidth, 2, 'F');
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(pageWidth - 70, 36, 70, 2, 'F');

  // Header Titles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(165, 180, 252); // indigo-200
  doc.text('OFFICIAL HACKATHON PITCH SHEET  •  3-MINUTE EXECUTIVE WALKTHROUGH', marginX, 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(projectName.toUpperCase() + ' — 3-MINUTE JUDGES PITCH', marginX, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`${tagline}  |  Track: ${track}`, marginX, 27);
  doc.text(`Team: ${presenter}  |  Target Pitch Duration: 180 Seconds (3:00 Max)`, marginX, 32);

  // Time Badge Right Top
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - marginX - 38, 7, 38, 22, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11); // amber
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth - marginX - 38, 7, 38, 22, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(251, 191, 36);
  doc.text('PITCH BUDGET', pageWidth - marginX - 19, 13, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('3:00 MIN', pageWidth - marginX - 19, 20, { align: 'center' });
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text('60s Hook • 60s Demo • 60s ROI', pageWidth - marginX - 19, 25, { align: 'center' });

  // Strategic Intro Card
  const introY = 42;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, introY, contentWidth, 18, 2, 2, 'FD');

  doc.setFillColor(79, 70, 229);
  doc.roundedRect(marginX, introY, 3, 18, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('HOW TO DELIVER THIS 3-MINUTE PITCH TO WIN JUDGES:', marginX + 6, introY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  const advice = `Hackathon judges evaluate 3 things: (1) Is the problem real? (2) Does the prototype actually work? (3) Can this scale? Speak with confidence, keep the live screen active, and follow the 3 sequential 60-second milestones below.`;
  const splitAdvice = doc.splitTextToSize(advice, contentWidth - 10);
  doc.text(splitAdvice, marginX + 6, introY + 11.5);

  // 3-Minute Minute-by-Minute Breakdown Cards
  const timeline = [
    {
      minute: 'MINUTE 1 (0:00 - 1:00)',
      phase: 'THE HOOK & THE PAIN POINT',
      goal: 'Grab attention immediately with a relatable, quantified pain point.',
      script: `"Judges, organizational learning and high school STEM preparation are broken. Students and enterprise trainees drown in passive video libraries, siloed PDFs, and 70% knowledge decay within 48 hours. When someone gets stuck, there is no real-time Socratic feedback, no verified competency trail, and no centralized way to capture tacit peer knowledge. We built Capacity Connect: a cognitive-first digital learning ecosystem that turns passive reading into active, verified mastery through real-time AI tutors, visual problem solvers, and cryptographic competency certification."`,
      keyAction: 'Slide 1 & 2 on screen. Keep eye contact. Do not touch mouse yet.',
      accentColor: [225, 29, 72], // rose-600
      bgBox: [255, 241, 242],
    },
    {
      minute: 'MINUTE 2 (1:00 - 2:00)',
      phase: 'THE LIVE PRODUCT DEMO',
      goal: 'Prove that the solution is real, reactive, and technically impressive.',
      script: `"Let me show you live. Here is our Curriculum Hub. A learner opens AP Calculus or Cloud Engineering. Rather than giving away answers, our Socratic AI Tutor analyzes their exact reasoning gap and guides them step-by-step. If they submit a handwritten equation or complex circuit, our Multimodal Visual Homework Solver breaks it down into interactive vector diagrams. Every quiz, flashcard review, and peer study group session feeds into our Skill Gap Radar, generating instant diagnostic reports and verifiable audit logs."`,
      keyAction: 'Click Curriculum Tab -> Launch Socratic Tutor -> Show Visual Homework Solver.',
      accentColor: [79, 70, 229], // indigo-600
      bgBox: [238, 242, 255],
    },
    {
      minute: 'MINUTE 3 (2:00 - 3:00)',
      phase: 'ARCHITECTURE, ROLES & WHY WE WIN',
      goal: 'Close with institutional scalability, security, and market viability.',
      script: `"Under the hood, Capacity Connect is production-grade. We have 3-tier Role-Based Access Control: Trainees learn, Trainers evaluate peer articles and publish curricula, and Admins monitor organizational readiness via cryptographic SHA-256 transcripts. We run offline-first with PWA service workers and client-side audio telemetry. While traditional LMS tools charge $40/user for static video hosting, Capacity Connect delivers active adaptive mastery at near-zero marginal inference cost. Thank you, and we welcome your questions!"`,
      keyAction: 'Open Admin/Audit View -> Show PDF Progress Export -> Invite Q&A.',
      accentColor: [5, 150, 105], // emerald-600
      bgBox: [236, 253, 245],
    },
  ];

  let cardY = 64;
  const cardHeight = 63;

  timeline.forEach((step, idx) => {
    // Card Container
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.roundedRect(marginX, cardY, contentWidth, cardHeight, 2, 2, 'FD');

    // Accent Pill Top Left
    doc.setFillColor(step.accentColor[0], step.accentColor[1], step.accentColor[2]);
    doc.roundedRect(marginX, cardY, 3, cardHeight, 1, 1, 'F');

    // Minute Badge
    doc.setFillColor(step.bgBox[0], step.bgBox[1], step.bgBox[2]);
    doc.roundedRect(marginX + 6, cardY + 4, 48, 5.5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(step.accentColor[0], step.accentColor[1], step.accentColor[2]);
    doc.text(step.minute, marginX + 8, cardY + 8);

    // Phase Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(step.phase, marginX + 58, cardY + 8);

    // Objective
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Key Objective: ${step.goal}`, marginX + 6, cardY + 14);

    // Verbatim Pitch Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.roundedRect(marginX + 6, cardY + 16, contentWidth - 12, 34, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text('SAY THIS (VERBATIM SCRIPT):', marginX + 8, cardY + 20);

    doc.setFont('times', 'italic');
    doc.setFontSize(7.2);
    doc.setTextColor(30, 41, 59);
    const splitScript = doc.splitTextToSize(step.script, contentWidth - 16);
    doc.text(splitScript, marginX + 8, cardY + 24.5);

    // Key Live Action Cue
    doc.setFillColor(step.accentColor[0], step.accentColor[1], step.accentColor[2]);
    doc.circle(marginX + 9, cardY + 56, 1.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text('LIVE SCREEN ACTION: ', marginX + 13, cardY + 57);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(step.accentColor[0], step.accentColor[1], step.accentColor[2]);
    doc.text(step.keyAction, marginX + 41, cardY + 57);

    cardY += cardHeight + 4;
  });

  // Page 1 Footer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(marginX, pageHeight - 12, marginX + contentWidth, pageHeight - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Capacity Connect Hackathon Pitch Kit  •  Designed for 3-Minute Competitive Evaluation`, marginX, pageHeight - 7);
  doc.text(`Page 1 of 2`, marginX + contentWidth, pageHeight - 7, { align: 'right' });

  // ==========================================
  // PAGE 2: HACKATHON 1-PAGER QUICK SHEET
  // ==========================================
  doc.addPage('a4', 'portrait');

  // Top Dark Header Page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(6, 182, 212); // cyan
  doc.rect(0, 28, pageWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(165, 180, 252);
  doc.text('JUDGES ONE-PAGER SUMMARY  •  PROJECT ARCHITECTURE & VALUE PROPOSITION', marginX, 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('CAPACITY CONNECT: THE COMPLETE HACKATHON BRIEF', marginX, 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Everything judges need to know in under 60 seconds of review', marginX, 24);

  // Section 1: Problem vs. Solution Matrix
  const p1Y = 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('1. THE PROBLEM VS. OUR SOLUTION', marginX, p1Y);

  const colW = (contentWidth - 4) / 2;

  // Problem Box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, p1Y + 3, colW, 40, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(185, 28, 28);
  doc.text('REAL-WORLD PROBLEMS IDENTIFIED', marginX + 4, p1Y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(127, 29, 29);
  const problemPoints = [
    '• 70% Skill Decay: Trainees lose theoretical concepts without active recall.',
    '• Fragmented Tools: Video lectures, quizzes, and notes scattered across apps.',
    '• Black-Box Grading: Multiple-choice tests fail to diagnose why students fail.',
    '• Lost Tacit Knowledge: Senior staff and top students rarely document insights.',
    '• Lack of Verification: Certificates lack cryptographic proof of competence.',
  ];
  problemPoints.forEach((pt, i) => {
    doc.text(pt, marginX + 4, p1Y + 13 + i * 5.5);
  });

  // Solution Box
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX + colW + 4, p1Y + 3, colW, 40, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(4, 120, 87);
  doc.text('HOW CAPACITY CONNECT SOLVES THIS', marginX + colW + 8, p1Y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(6, 78, 59);
  const solutionPoints = [
    '• Socratic Remediation: Step-by-step guidance rather than spoon-fed answers.',
    '• Unified Hub: Curricula, Flashcards, Math Scratchpad & Peer Circles in one UI.',
    '• AI Diagnostic Gap Matrix: Pinpoints exact sub-topic failure points automatically.',
    '• Peer Knowledge Repository: Markdown articles with upvotes and moderation.',
    '• SHA-256 Verifiable PDF: Institutional transcripts suitable for audit.',
  ];
  solutionPoints.forEach((pt, i) => {
    doc.text(pt, marginX + colW + 8, p1Y + 13 + i * 5.5);
  });

  // Section 2: Core Feature Suite (Bento 4-card grid)
  const fY = 82;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('2. TECHNICAL ARCHITECTURE & WORKING CAPABILITIES', marginX, fY);

  const cardW = (contentWidth - 6) / 3;
  const cardH = 34;

  const features = [
    {
      title: 'Multimodal AI Solver',
      tag: 'Computer Vision & LLM',
      desc: 'Takes handwritten equations or diagrams and outputs step-by-step visual proofs and vector graphs.',
      color: [79, 70, 229],
      bg: [238, 242, 255],
    },
    {
      title: 'Spaced Repetition & SRS',
      tag: 'Leitner 5-Box Engine',
      desc: 'Optimized retention algorithms ensure difficult formulas are reviewed right before memory extinction.',
      color: [8, 145, 178],
      bg: [236, 254, 255],
    },
    {
      title: 'Audit-Proof RBAC System',
      tag: 'Trainee, Trainer & Admin',
      desc: 'Role-based views allow trainers to grade assessments while admins track compliance and export audits.',
      color: [217, 119, 6],
      bg: [254, 243, 199],
    },
    {
      title: 'Offline PWA Readiness',
      tag: 'Service Worker & Cache',
      desc: 'Full offline operability with background sync for low-bandwidth rural schools or secure environments.',
      color: [5, 150, 105],
      bg: [236, 253, 245],
    },
    {
      title: 'Audio Synthesizer Engine',
      tag: 'Web Audio API',
      desc: 'Zero-latency binaural focus feedback and interactive earcons built natively without heavy audio assets.',
      color: [147, 51, 234],
      bg: [250, 245, 255],
    },
    {
      title: 'Cryptographic PDF Engine',
      tag: 'Vector jsPDF Subsystem',
      desc: 'Generates sub-millimeter A4 reports with cryptographic hashes, QR-ready metadata, and cohort metrics.',
      color: [225, 29, 72],
      bg: [255, 241, 242],
    },
  ];

  features.forEach((feat, idx) => {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const fx = marginX + col * (cardW + 3);
    const fy = fY + 4 + row * (cardH + 3);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(fx, fy, cardW, cardH, 2, 2, 'FD');

    doc.setFillColor(feat.color[0], feat.color[1], feat.color[2]);
    doc.roundedRect(fx, fy, cardW, 1.8, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(feat.title, fx + 3, fy + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(feat.color[0], feat.color[1], feat.color[2]);
    doc.text(feat.tag.toUpperCase(), fx + 3, fy + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(feat.desc, cardW - 6);
    doc.text(splitDesc, fx + 3, fy + 16);
  });

  // Section 3: Live Demo Checklist for the Presenter (What to show judges)
  const demoY = 162;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('3. 60-SECOND LIVE DEMO RUNWAY (WHAT TO CLICK ON STAGE)', marginX, demoY);

  const runwayBoxH = 34;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, demoY + 3, contentWidth, runwayBoxH, 2, 2, 'FD');

  const steps = [
    { num: '1', title: 'Start at Curriculum Tab', note: 'Show AP Calculus or Cloud course progress & interactive syllabus tree.' },
    { num: '2', title: 'Open Socratic Tutor', note: 'Show an AI tutor conversation asking guiding questions without giving answers.' },
    { num: '3', title: 'Demonstrate Visual Solver', note: 'Show equation breakdown into step-by-step vector mathematical diagrams.' },
    { num: '4', title: 'Click "Export Progress PDF"', note: 'Show the instant, official 2-page A4 certified transcript downloaded live.' },
    { num: '5', title: 'Switch to Trainer/Admin Portal', note: 'Demonstrate RBAC role switching and compliance audit trail.' },
  ];

  steps.forEach((st, idx) => {
    const sx = marginX + 3 + idx * ((contentWidth - 6) / 5);
    const sw = (contentWidth - 6) / 5 - 2;

    doc.setFillColor(79, 70, 229);
    doc.circle(sx + 5, demoY + 10, 3.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(st.num, sx + 5, demoY + 11.2, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    const splitTitle = doc.splitTextToSize(st.title, sw - 2);
    doc.text(splitTitle, sx + 10, demoY + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139);
    const splitNote = doc.splitTextToSize(st.note, sw);
    doc.text(splitNote, sx + 2, demoY + 19);
  });

  // Section 4: Anticipated Judges Q&A (Bulletproof Answers)
  const qaY = 205;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('4. BULLETPROOF ANSWERS TO TOP JUDGES QUESTIONS', marginX, qaY);

  const qas = [
    {
      q: 'Q1: "How is this different from Khan Academy or standard ChatGPT?"',
      a: 'A: ChatGPT hallucinates full answers without pedagogical scaffolding. Capacity Connect implements Socratic constraints, spaced retrieval scheduling, and an institutional RBAC structure where teachers monitor actual competency rather than answers copied from AI.',
    },
    {
      q: 'Q2: "What is your business model and target customer?"',
      a: 'A: B2B SaaS for High Schools, STEM Academies, and Enterprise Training departments ($4–$12/user/month). Institutions save 60% on instructor grading hours and gain audit compliance.',
    },
    {
      q: 'Q3: "How does the platform handle low connectivity or security?"',
      a: 'A: Fully offline-capable via Service Workers and client-side IndexedDB caching. Sensitive learner metrics are cryptographically sealed with SHA-256 integrity checks.',
    },
  ];

  let currentQaY = qaY + 4;
  qas.forEach((item) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, currentQaY, contentWidth, 18, 1.5, 1.5, 'FD');

    doc.setFillColor(79, 70, 229);
    doc.roundedRect(marginX, currentQaY, 2.5, 18, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(67, 56, 202);
    doc.text(item.q, marginX + 5, currentQaY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(51, 65, 85);
    const splitA = doc.splitTextToSize(item.a, contentWidth - 10);
    doc.text(splitA, marginX + 5, currentQaY + 9.5);

    currentQaY += 21;
  });

  // Page 2 Footer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(marginX, pageHeight - 12, marginX + contentWidth, pageHeight - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Capacity Connect  •  Judges Cheat Sheet & 3-Minute Elevator Pitch  •  Author: Developer6316`, marginX, pageHeight - 7);
  doc.text(`Page 2 of 2`, marginX + contentWidth, pageHeight - 7, { align: 'right' });

  return doc;
}

/**
 * Download helper function for Hackathon Pitch PDF
 */
export function downloadHackathonPitchPDF(options: HackathonPitchOptions = {}): void {
  const doc = generateHackathonPitchPDF(options);
  const filename = 'CapacityConnect_Hackathon_3Min_Pitch.pdf';

  try {
    doc.save(filename);
  } catch (err) {
    console.warn('Standard doc.save failed, trying blob anchor fallback:', err);
    try {
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (fallbackErr) {
      console.error('Download fallback failed:', fallbackErr);
    }
  }
}
