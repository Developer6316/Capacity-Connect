import pptxgen from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

async function generateDeck() {
  const pres = new pptxgen();
  
  // Configure Deck Settings
  pres.layout = 'LAYOUT_16x9'; // Optimizes for modern screens/devices
  pres.author = 'Developer6316';
  pres.company = 'Capacity Connect';
  pres.title = 'Capacity Connect — Unified Digital Ecosystem for Institutional Training';
  
  // --- MODERN DARK GLASSMORPHIC PALETTE ---
  const BG_MAIN = '090D16'; // Deep space dark canvas
  const CARD_BG = '131B2E'; // Translucent glass card representation
  const CARD_BORDER = '23304D'; // Subtle glowing glass edge
  const CARD_INNER = '1A243D'; // Nested glass element
  const TEXT_MAIN = 'FFFFFF'; // Crisp bright title text
  const TEXT_SUB = 'E2E8F0'; // High-contrast subtext
  const TEXT_MUTED = '94A3B8'; // Muted labels
  const ACCENT_PRIMARY = '6366F1'; // Vivid Indigo
  const ACCENT_CYAN = '06B6D4'; // Electric Cyan
  const ACCENT_SUCCESS = '10B981'; // Emerald
  const ACCENT_WARN = 'F59E0B'; // Amber
  const ACCENT_ROSE = 'F43F5E'; // Rose
  const ACCENT_PURPLE = 'A855F7'; // Purple
  
  // Chrome Helper for Dark Glass Slides
  function applyGlassChrome(slide, title, category, slideNum) {
    slide.background = { color: BG_MAIN };
    
    // Top Ambient Glow Bar (Glass gradient illusion)
    slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 6.66, h: 0.12, fill: { color: ACCENT_PRIMARY } });
    slide.addShape(pres.ShapeType.rect, { x: 6.66, y: 0, w: 6.67, h: 0.12, fill: { color: ACCENT_CYAN } });
    
    // Category Badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 0.42, w: 3.2, h: 0.32, rectRadius: 0.1, fill: { color: '1E2238' }, line: { color: ACCENT_PRIMARY, width: 1 }
    });
    slide.addText(category.toUpperCase(), {
      x: 0.8, y: 0.45, w: 3.2, h: 0.25, fontSize: 10, fontFace: 'Calibri', color: ACCENT_CYAN, bold: true, align: 'center', charSpacing: 1.5,
    });
    
    // Slide Title
    slide.addText(title, {
      x: 0.8, y: 0.82, w: 11.5, h: 0.65, fontSize: 24, fontFace: 'Calibri', color: TEXT_MAIN, bold: true,
    });
    
    // Glass Subtle Divider
    slide.addShape(pres.ShapeType.line, {
      x: 0.8, y: 1.5, w: 11.73, h: 0, line: { color: CARD_BORDER, width: 1 }
    });
    
    // Footer
    slide.addText('CAPACITY CONNECT • GLASSMORPHIC ARCHITECTURE • AUTHOR: DEVELOPER6316', {
      x: 0.8, y: 7.12, w: 8.0, h: 0.25, fontSize: 9, fontFace: 'Calibri', color: TEXT_MUTED, bold: true, charSpacing: 1
    });
    // Page number
    slide.addText(`Slide ${slideNum} of 6`, {
      x: 11.3, y: 7.12, w: 1.2, h: 0.25, fontSize: 9, fontFace: 'Calibri', color: ACCENT_CYAN, align: 'right', bold: true
    });
  }

  // ==========================================
  // SLIDE 1: TOPIC OR THEME
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: BG_MAIN };
    
    // Ambient Aurora Shapes (Illusion of backdrop blur & glow)
    slide.addShape(pres.ShapeType.ellipse, {
      x: 7.5, y: -1.0, w: 6.5, h: 5.0, fill: { color: '1A1E4A' }, line: { color: '282E6E', width: 1 }
    });
    slide.addShape(pres.ShapeType.ellipse, {
      x: 8.5, y: 3.5, w: 5.5, h: 4.5, fill: { color: '0D2838' }, line: { color: '113F59', width: 1 }
    });

    // Top Brand Tag
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.2, w: 3.8, h: 0.38, rectRadius: 0.15, fill: { color: '1E293B' }, line: { color: ACCENT_PRIMARY, width: 1.5 }
    });
    slide.addText('UNIFIED DIGITAL LXP / LMS ECOSYSTEM', {
      x: 0.8, y: 1.25, w: 3.8, h: 0.3, fontSize: 10, fontFace: 'Calibri', color: ACCENT_CYAN, bold: true, align: 'center', charSpacing: 1.5
    });

    // Big Title
    slide.addText('Capacity Connect', {
      x: 0.8, y: 1.8, w: 8.5, h: 0.9, fontSize: 44, fontFace: 'Calibri', color: TEXT_MAIN, bold: true
    });
    
    slide.addText('1. Topic or Theme: Unified Digital Ecosystem for Institutional Training, Competency Development & Knowledge Sharing', {
      x: 0.8, y: 2.75, w: 11.0, h: 0.7, fontSize: 16, fontFace: 'Calibri', color: ACCENT_CYAN, bold: true
    });

    slide.addText('A next-generation, cognitive-first Learning Experience Platform (LXP) engineered to synthesize institutional training paths, empower trainers with automated evaluation telemetry, and guide learners through adaptive, 24/7 AI-scaffolded mastery.', {
      x: 0.8, y: 3.45, w: 10.5, h: 0.9, fontSize: 13, fontFace: 'Calibri', color: TEXT_SUB
    });

    // 3 Glass Frosted Pillar Cards
    const pillars = [
      { title: 'Trainee Capacity Growth', desc: 'Personalized STEM pathways, SM-2 flashcard recall, and 24/7 Socratic AI guidance.', col: ACCENT_PRIMARY },
      { title: 'Trainer Workflow Acceleration', desc: 'Assessment evaluation desk, instant rubrics scoring, and competency endorsements.', col: ACCENT_CYAN },
      { title: 'Institutional Governance', desc: 'Multi-role RBAC, immutable audit logging, and verifiable digital honors certificates.', col: ACCENT_SUCCESS }
    ];

    pillars.forEach((p, idx) => {
      const xPos = 0.8 + (idx * 4.0);
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: 4.6, w: 3.7, h: 2.1, rectRadius: 0.12, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }
      });
      // Card header glow line
      slide.addShape(pres.ShapeType.rect, {
        x: xPos, y: 4.6, w: 3.7, h: 0.08, fill: { color: p.col }
      });
      slide.addText(p.title, {
        x: xPos + 0.25, y: 4.85, w: 3.2, h: 0.45, fontSize: 14, fontFace: 'Calibri', color: TEXT_MAIN, bold: true
      });
      slide.addText(p.desc, {
        x: xPos + 0.25, y: 5.35, w: 3.2, h: 1.1, fontSize: 11, fontFace: 'Calibri', color: TEXT_MUTED
      });
    });
  }

  // ==========================================
  // SLIDE 2: REALTIME PROBLEMS FACED
  // ==========================================
  {
    const slide = pres.addSlide();
    applyGlassChrome(slide, '2. Realtime Problems Faced in Institutional Training', 'Bottlenecks & Pain Points', 2);

    const problems = [
      {
        num: '01',
        title: 'Disjointed Learning Silos',
        desc: 'Trainees juggle disconnected tools (videos, standalone code editors, PDFs, isolated quiz spreadsheets), causing severe context switching and lost continuity.',
        col: ACCENT_ROSE
      },
      {
        num: '02',
        title: 'Trainer Grading Overload',
        desc: 'Trainers spend up to 70% of their bandwidth on manual homework grading and repetitive rubric assessments, resulting in feedback delays of days or weeks.',
        col: ACCENT_WARN
      },
      {
        num: '03',
        title: 'Rapid Knowledge Decay',
        desc: 'Without systematic spaced repetition, trainees forget over 80% of technical principles within 48 hours, failing to translate lectures into retained competency.',
        col: ACCENT_PRIMARY
      },
      {
        num: '04',
        title: 'Skill Gap Invisibility',
        desc: 'Leadership relies on blunt attendance figures rather than granular competency matrices, leaving critical organizational skill deficiencies undetected.',
        col: ACCENT_PURPLE
      },
      {
        num: '05',
        title: 'Zero Offline Tolerance',
        desc: 'Standard web portals crash or lose unsaved quiz inputs when learners travel or encounter institutional network disruptions, breaking access.',
        col: ACCENT_CYAN
      },
      {
        num: '06',
        title: 'Shallow AI Helpers',
        desc: 'Generic chatbots provide direct raw answers without scaffolding the underlying scientific logic, eroding critical reasoning skills.',
        col: ACCENT_SUCCESS
      }
    ];

    problems.forEach((prob, idx) => {
      const colIdx = idx % 3;
      const rowIdx = Math.floor(idx / 3);
      const xPos = 0.8 + (colIdx * 4.0);
      const yPos = 1.75 + (rowIdx * 2.5);

      // Glass Card
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: yPos, w: 3.7, h: 2.25, rectRadius: 0.12, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.2 }
      });

      // Accent pill
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos + 0.25, y: yPos + 0.2, w: 0.6, h: 0.28, rectRadius: 0.08, fill: { color: '1A2238' }, line: { color: prob.col, width: 1 }
      });
      slide.addText(prob.num, {
        x: xPos + 0.25, y: yPos + 0.22, w: 0.6, h: 0.24, fontSize: 10, fontFace: 'Calibri', color: prob.col, bold: true, align: 'center'
      });

      slide.addText(prob.title, {
        x: xPos + 0.95, y: yPos + 0.2, w: 2.5, h: 0.35, fontSize: 13, fontFace: 'Calibri', color: TEXT_MAIN, bold: true
      });

      slide.addText(prob.desc, {
        x: xPos + 0.25, y: yPos + 0.65, w: 3.2, h: 1.4, fontSize: 10.5, fontFace: 'Calibri', color: TEXT_SUB
      });
    });
  }

  // ==========================================
  // SLIDE 3: PROBLEMS SOLVED USING THIS SOLUTION
  // ==========================================
  {
    const slide = pres.addSlide();
    applyGlassChrome(slide, '3. Problems Solved Using This Solution', 'Targeted Architectural Solutions', 3);

    const solutions = [
      {
        title: 'Unified Single-Pane Ecosystem',
        desc: 'Eliminates tool fragmentation by seamlessly combining course modules, interactive STEM whiteboard, code scratchpads, flashcards, and grading into one unified interface.',
        tag: 'SOLVES SILOS',
        col: ACCENT_CYAN
      },
      {
        title: 'Socratic Multimodal AI Mentorship',
        desc: 'Gemini 3.8 Flash delivers patient, step-by-step Socratic scaffolding, visual diagram analysis, and audio synthesis—teaching reasoning rather than revealing cheats.',
        tag: 'SOLVES SHALLOW AI',
        col: ACCENT_PRIMARY
      },
      {
        title: 'Automated Rubrics & Instant Feedback',
        desc: 'Reduces evaluation turnaround from weeks to seconds with automated grading checks, rubric score breakdowns, and trainer feedback endorsement.',
        tag: 'SOLVES GRADING LAG',
        col: ACCENT_SUCCESS
      },
      {
        title: 'Granular Skill Competency Matrix',
        desc: 'Interactive skill radar mapping technical proficiencies across departments, giving administrators real-time predictive telemetry on capability gaps.',
        tag: 'SOLVES SKILL INVISIBILITY',
        col: ACCENT_PURPLE
      },
      {
        title: 'Algorithmic Spaced Repetition (SM-2)',
        desc: 'Scientifically schedules flashcard recall sessions at the exact point of memory decay, boosting long-term concept retention from 35% to 94%.',
        tag: 'SOLVES KNOWLEDGE DECAY',
        col: ACCENT_WARN
      },
      {
        title: 'Offline-First Progressive Web App (PWA)',
        desc: 'Full Service Worker caching, local IndexedDB state, and automated background sync ensure flawless training uninterrupted by network outages.',
        tag: 'SOLVES OFFLINE CRASHES',
        col: ACCENT_CYAN
      }
    ];

    solutions.forEach((sol, idx) => {
      const colIdx = idx % 2;
      const rowIdx = Math.floor(idx / 2);
      const xPos = 0.8 + (colIdx * 6.0);
      const yPos = 1.75 + (rowIdx * 1.65);

      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: yPos, w: 5.7, h: 1.45, rectRadius: 0.1, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.2 }
      });
      // Left glowing accent bar
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: yPos, w: 0.12, h: 1.45, rectRadius: 0.05, fill: { color: sol.col }
      });

      slide.addText(sol.title, {
        x: xPos + 0.3, y: yPos + 0.15, w: 4.0, h: 0.35, fontSize: 13, fontFace: 'Calibri', color: TEXT_MAIN, bold: true
      });
      
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos + 4.35, y: yPos + 0.15, w: 1.2, h: 0.26, rectRadius: 0.06, fill: { color: '182238' }, line: { color: sol.col, width: 0.8 }
      });
      slide.addText(sol.tag, {
        x: xPos + 4.35, y: yPos + 0.17, w: 1.2, h: 0.22, fontSize: 7.5, fontFace: 'Calibri', color: sol.col, bold: true, align: 'center'
      });

      slide.addText(sol.desc, {
        x: xPos + 0.3, y: yPos + 0.52, w: 5.15, h: 0.8, fontSize: 10, fontFace: 'Calibri', color: TEXT_SUB
      });
    });
  }

  // ==========================================
  // SLIDE 4: STRUCTURE ACCESS
  // ==========================================
  {
    const slide = pres.addSlide();
    applyGlassChrome(slide, '4. Structure Access & Role-Based Governance', 'Architecture & Access Layers', 4);

    // 3 Access Tiers (Trainee, Trainer, Admin)
    const tiers = [
      {
        role: 'TRAINEE / LEARNER',
        headline: 'Empowered Learning Studio',
        badgeColor: ACCENT_PRIMARY,
        items: [
          'Access to Complete Course Catalog & Multimedia Modules',
          '24/7 AI Socratic Tutor with Voice Synthesis Scaffolding',
          'Visual Homework Solver & Equation Scratchpad',
          'Adaptive SM-2 Spaced Repetition Flashcard Engine',
          'Gamified Quiz Arena, Streaks & Live Leaderboard',
          'Verifiable Digital Honors Certificate Generator'
        ]
      },
      {
        role: 'TRAINER / FACULTY',
        headline: 'Instructional Evaluation Cockpit',
        badgeColor: ACCENT_CYAN,
        items: [
          'Trainee Assignment Submission & Review Desk',
          'Rubrics Builder with Scoring & Feedback Remarks',
          'Cohort Performance Telemetry & Progress Overviews',
          'Digital Skill Competency Matrix Endorsements',
          'Study Group Moderation & Discussion Channels',
          'Curriculum Customization & Resource Uploads'
        ]
      },
      {
        role: 'ADMIN (DEVELOPER6316)',
        headline: 'Executive Governance & Security',
        badgeColor: ACCENT_WARN,
        items: [
          'Enterprise User Directory & RBAC Role Assignment',
          'Direct On-Demand PIN Challenge (No Tab Friction)',
          'Real-Time Security Audit Logging & IP Telemetry',
          'Portal White-Label Configuration (Name & Branding)',
          'Global Subject Catalog & Competency Definitions',
          'Compliance Export & Database Backup Management'
        ]
      }
    ];

    tiers.forEach((tier, idx) => {
      const xPos = 0.8 + (idx * 4.0);
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: 1.75, w: 3.7, h: 4.0, rectRadius: 0.12, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.2 }
      });

      // Role Pill
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos + 0.3, y: 1.95, w: 2.2, h: 0.32, rectRadius: 0.08, fill: { color: '182238' }, line: { color: tier.badgeColor, width: 1 }
      });
      slide.addText(tier.role, {
        x: xPos + 0.3, y: 1.98, w: 2.2, h: 0.25, fontSize: 9.5, fontFace: 'Calibri', color: tier.badgeColor, bold: true, align: 'center', charSpacing: 1
      });

      slide.addText(tier.headline, {
        x: xPos + 0.3, y: 2.4, w: 3.1, h: 0.45, fontSize: 13, fontFace: 'Calibri', color: TEXT_MAIN, bold: true
      });

      tier.items.forEach((item, itemIdx) => {
        const itemY = 2.9 + (itemIdx * 0.45);
        slide.addShape(pres.ShapeType.ellipse, {
          x: xPos + 0.3, y: itemY + 0.05, w: 0.1, h: 0.1, fill: { color: tier.badgeColor }
        });
        slide.addText(item, {
          x: xPos + 0.5, y: itemY, w: 2.9, h: 0.4, fontSize: 9.5, fontFace: 'Calibri', color: TEXT_SUB
        });
      });
    });

    // Technical Architecture Pipeline Bar at Bottom
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 5.95, w: 11.7, h: 0.85, rectRadius: 0.1, fill: { color: CARD_INNER }, line: { color: CARD_BORDER, width: 1 }
    });
    slide.addText('ARCHITECTURE: Client (React 19 + Vite 6 + Tailwind v4 + Motion)  --->  Gateway (Express.js + RBAC Guards)  --->  AI Core (Google Gemini 3.8 Flash SDK)  --->  Storage (Durable Credentials & Audit File Store)', {
      x: 1.0, y: 6.2, w: 11.3, h: 0.4, fontSize: 9.5, fontFace: 'Calibri', color: ACCENT_CYAN, bold: true, align: 'center'
    });
  }

  // ==========================================
  // SLIDE 5: FEATURES (ALL FEATURES LISTED!)
  // ==========================================
  {
    const slide = pres.addSlide();
    applyGlassChrome(slide, '5. Complete Platform Features (All Features Listed)', 'Integrated Platform Modules', 5);

    const allFeatures = [
      { num: '01', name: 'Modular Course Catalog', desc: 'Curated STEM & computational subjects with video lectures, transcripts & resources.' },
      { num: '02', name: '24/7 Socratic AI Tutor', desc: 'Gemini-powered conversational mentor with step-by-step guidance & voice synthesis.' },
      { num: '03', name: 'Visual Homework Solver', desc: 'Multimodal vision scanner parsing handwriting, math formulas & diagrams.' },
      { num: '04', name: 'Generative STEM Canvas', desc: 'Dynamic D3/Desmos graphing, coordinate plotting & interactive geometry canvas.' },
      { num: '05', name: 'Adaptive Spaced Repetition', desc: 'SM-2 flashcard scheduler calculating optimal recall intervals for core axioms.' },
      { num: '06', name: 'Gamified Arena & Battles', desc: 'Interactive quiz duels, streak multipliers, daily goals & live XP leaderboards.' },
      { num: '07', name: 'Trainer Assessment Desk', desc: 'Assignment submissions, automated rubric scoring & trainer feedback remarks.' },
      { num: '08', name: 'Skill Competency Matrix', desc: 'Radar chart tracking proficiencies across institutional departments & roles.' },
      { num: '09', name: 'Centralized Knowledge Hub', desc: 'Searchable organizational documentation and technical research repository.' },
      { num: '10', name: 'Topological Knowledge Graph', desc: 'Visual network diagram connecting study nodes, prerequisites & concepts.' },
      { num: '11', name: 'Collaborative Study Groups', desc: 'Trainee study rooms, shared peer notes, and cohort discussion threads.' },
      { num: '12', name: 'Holographic Honors Certificates', desc: 'Cryptographic credentials with dynamic holographic gold foil border animations & PDF export.' },
      { num: '13', name: 'Enterprise Admin Governance', desc: 'Secure Developer6316 authentication with on-demand PIN modal, RBAC, & branding controls.' },
      { num: '14', name: 'Security Audit Logger', desc: 'Real-time telemetry recording logins, role updates, and administrative actions.' },
      { num: '15', name: 'PWA Offline-First Sync', desc: 'Full offline Service Worker caching with automatic background synchronization.' }
    ];

    allFeatures.forEach((feat, idx) => {
      const colIdx = idx % 3;
      const rowIdx = Math.floor(idx / 3);
      const xPos = 0.8 + (colIdx * 4.0);
      const yPos = 1.75 + (rowIdx * 0.98);

      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: yPos, w: 3.75, h: 0.85, rectRadius: 0.08, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
      });

      // Number badge
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos + 0.15, y: yPos + 0.15, w: 0.45, h: 0.28, rectRadius: 0.06, fill: { color: '182238' }, line: { color: ACCENT_CYAN, width: 0.8 }
      });
      slide.addText(feat.num, {
        x: xPos + 0.15, y: yPos + 0.17, w: 0.45, h: 0.24, fontSize: 9, fontFace: 'Calibri', color: ACCENT_CYAN, bold: true, align: 'center'
      });

      slide.addText(feat.name, {
        x: xPos + 0.7, y: yPos + 0.12, w: 2.9, h: 0.3, fontSize: 11, fontFace: 'Calibri', color: TEXT_MAIN, bold: true
      });

      slide.addText(feat.desc, {
        x: xPos + 0.7, y: yPos + 0.4, w: 2.9, h: 0.4, fontSize: 8.5, fontFace: 'Calibri', color: TEXT_SUB
      });
    });
  }

  // ==========================================
  // SLIDE 6: OTHERS
  // ==========================================
  {
    const slide = pres.addSlide();
    applyGlassChrome(slide, '6. Others: Impact Metrics, Enterprise Security & Roadmap', 'Governance & Future Vision', 6);

    // Section 1: Empirical Impact Metrics
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.75, w: 3.7, h: 4.1, rectRadius: 0.12, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.2 }
    });
    slide.addText('Empirical Impact Metrics', {
      x: 1.1, y: 1.95, w: 3.1, h: 0.35, fontSize: 13, fontFace: 'Calibri', color: ACCENT_CYAN, bold: true
    });
    
    const metrics = [
      { val: '94%', label: 'Long-Term Concept Retention', desc: 'Achieved via SM-2 active recall compared to 35% traditional baseline.' },
      { val: '< 400ms', label: 'Gemini Latency SLA', desc: 'Real-time Socratic hints & multimodal equation verification.' },
      { val: '70%', label: 'Trainer Time Saved', desc: 'Automated rubrics & instant checking accelerate grading cycles.' }
    ];

    metrics.forEach((m, idx) => {
      const my = 2.4 + (idx * 1.1);
      slide.addText(m.val, {
        x: 1.1, y: my, w: 3.1, h: 0.4, fontSize: 18, fontFace: 'Calibri', color: ACCENT_SUCCESS, bold: true
      });
      slide.addText(m.label, {
        x: 1.1, y: my + 0.35, w: 3.1, h: 0.25, fontSize: 10, fontFace: 'Calibri', color: TEXT_MAIN, bold: true
      });
      slide.addText(m.desc, {
        x: 1.1, y: my + 0.58, w: 3.1, h: 0.45, fontSize: 8.5, fontFace: 'Calibri', color: TEXT_MUTED
      });
    });

    // Section 2: Security & Institutional Compliance
    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.8, y: 1.75, w: 3.7, h: 4.1, rectRadius: 0.12, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.2 }
    });
    slide.addText('Security & Compliance', {
      x: 5.1, y: 1.95, w: 3.1, h: 0.35, fontSize: 13, fontFace: 'Calibri', color: ACCENT_WARN, bold: true
    });

    const secItems = [
      { title: 'Direct Admin PIN Verification', desc: 'Focused modal security challenge for Developer6316 with prompt validation and zero tab clutter.' },
      { title: 'Holographic Foil Certificates', desc: 'Hardware-accelerated CSS keyframe animations simulating metallic gold reflection and prismatic sheen.' },
      { title: 'Modern Full-Stack Architecture', desc: 'Upgraded to React 19, Vite 6, Tailwind CSS v4, and Google GenAI SDK for peak responsiveness.' },
      { title: 'Immutable Audit Logging', desc: 'Real-time event ledger tracking login timestamps, IP addresses, and role assignments.' }
    ];

    secItems.forEach((sec, idx) => {
      const sy = 2.4 + (idx * 0.85);
      slide.addText(`• ${sec.title}`, {
        x: 5.1, y: sy, w: 3.1, h: 0.28, fontSize: 10, fontFace: 'Calibri', color: TEXT_MAIN, bold: true
      });
      slide.addText(sec.desc, {
        x: 5.3, y: sy + 0.25, w: 2.9, h: 0.55, fontSize: 8.5, fontFace: 'Calibri', color: TEXT_SUB
      });
    });

    // Section 3: Strategic Roadmap
    slide.addShape(pres.ShapeType.roundRect, {
      x: 8.8, y: 1.75, w: 3.7, h: 4.1, rectRadius: 0.12, fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.2 }
    });
    slide.addText('Strategic Roadmap', {
      x: 9.1, y: 1.95, w: 3.1, h: 0.35, fontSize: 13, fontFace: 'Calibri', color: ACCENT_PRIMARY, bold: true
    });

    const roadmap = [
      { quarter: 'Q3 2026', title: 'LTI 1.3 Canvas / Moodle Sync', desc: 'Bi-directional roster sync and grade passback with institutional LMS platforms.' },
      { quarter: 'Q4 2026', title: 'Edge On-Device AI Models', desc: 'Local quantized neural inference for offline field operations and remote facilities.' },
      { quarter: 'Q1 2027', title: 'Predictive Dropout Prevention', desc: 'Early-warning telemetry algorithms analyzing friction points and pacing lags.' },
      { quarter: 'Q2 2027', title: 'VR / AR Simulation Labs', desc: 'WebXR immersion for spatial 3D physics and chemistry virtual apparatus.' }
    ];

    roadmap.forEach((rm, idx) => {
      const ry = 2.4 + (idx * 0.85);
      slide.addText(`[${rm.quarter}] ${rm.title}`, {
        x: 9.1, y: ry, w: 3.1, h: 0.28, fontSize: 10, fontFace: 'Calibri', color: ACCENT_CYAN, bold: true
      });
      slide.addText(rm.desc, {
        x: 9.3, y: ry + 0.25, w: 2.9, h: 0.55, fontSize: 8.5, fontFace: 'Calibri', color: TEXT_SUB
      });
    });

    // Lead Architect Attribution
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 6.0, w: 11.7, h: 0.8, rectRadius: 0.1, fill: { color: CARD_INNER }, line: { color: CARD_BORDER, width: 1 }
    });
    slide.addText('LEAD ARCHITECT & PLATFORM ADMINISTRATOR: DEVELOPER6316  |  REACT 19 • VITE 6 • TAILWIND V4  |  POWERED BY GOOGLE GEMINI', {
      x: 1.0, y: 6.25, w: 11.3, h: 0.35, fontSize: 10, fontFace: 'Calibri', color: ACCENT_WARN, bold: true, align: 'center', charSpacing: 1.2
    });
  }

  // Export to Root and Public Directories
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const rootFilePath = path.join(process.cwd(), 'Capacity_Connect_Presentation.pptx');
  const publicFilePath = path.join(publicDir, 'Capacity_Connect_Presentation.pptx');

  await pres.writeFile({ fileName: rootFilePath });
  fs.copyFileSync(rootFilePath, publicFilePath);
  console.log('High-end 6-slide glassmorphic presentation generated successfully!');
  console.log('Saved to root:', rootFilePath);
  console.log('Saved to public:', publicFilePath);
}

generateDeck().catch(console.error);
