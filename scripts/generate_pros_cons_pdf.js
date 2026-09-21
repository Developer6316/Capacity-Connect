import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

function generateProsConsPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Visual Palette
  const darkNavy = [15, 23, 42];      // #0f172a
  const slateText = [51, 65, 85];      // #334155
  const mutedText = [100, 116, 139];   // #64748b
  const primaryBlue = [37, 99, 235];   // #2563eb
  const accentIndigo = [79, 70, 229];  // #4f46e5
  const accentEmerald = [16, 185, 129];// #10b981
  const darkEmerald = [5, 150, 105];   // #059669
  const accentRose = [225, 29, 72];    // #e11d48
  const darkRose = [190, 18, 60];      // #be123c
  const accentAmber = [217, 119, 6];   // #d97706
  const bgCard = [248, 250, 252];      // #f8fafc
  const cardBorder = [226, 232, 240];  // #e2e8f0

  function addHeaderFooter(pageNum, sectionTitle) {
    // Header bar
    doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.rect(0, 0, pageWidth, 16, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text('CAPACITY CONNECT  |  EXECUTIVE BRIEF & BALANCED PROS/CONS', margin, 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(sectionTitle.toUpperCase(), pageWidth - margin, 10.5, { align: 'right' });

    // Footer rule & text
    doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text('Capacity Connect • Enterprise Capacity Building Ecosystem (React 19 • Vite 6 • Tailwind v4 • Gemini 3.8 Flash)', margin, pageHeight - 6.5);
    doc.text(`Page ${pageNum} of 2`, pageWidth - margin, pageHeight - 6.5, { align: 'right' });
  }

  // ========================================================
  // PAGE 1: CLEAR, SIMPLE EXPLANATION (EVERYONE UNDERSTANDS)
  // ========================================================
  addHeaderFooter(1, 'Simple Explanation & Core Concepts');

  let y = 22;

  // Title Banner Card
  doc.setFillColor(bgCard[0], bgCard[1], bgCard[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.roundedRect(margin, y, contentWidth, 34, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
  doc.text('What is Capacity Connect? (In Simple Words)', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  const introText = doc.splitTextToSize(
    'Capacity Connect is an all-in-one smart digital academy in a web browser. Traditional employee and government training relies on boring 200-page static PDFs and passive video recordings where learners quickly forget what they studied. Capacity Connect replaces this with an interactive, AI-guided learning experience that tests your knowledge in real time and issues verifiable digital honors certificates.',
    contentWidth - 12
  );
  doc.text(introText, margin + 6, y + 15);

  y += 40;

  // High-Impact "In One Sentence" Callout Box
  doc.setFillColor(238, 242, 255); // Indigo tint
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
  doc.text('THE CORE SUMMARY IN ONE SENTENCE:', margin + 5, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('"It transforms passive, forgotten training into an active, AI-mentored academy with fraud-proof digital degrees."', margin + 5, y + 12);

  y += 22;

  // Section Header: The 4 Key Components
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('How It Works: The 4 Pillars Anyone Can Understand', margin, y);
  y += 5;

  const fourPillars = [
    {
      badge: 'PILLAR 1',
      title: '24/7 AI Personal Mentor (Google Gemini 3.8)',
      desc: 'Instead of waiting days for an instructor, trainees can ask questions anytime. The AI tutor explains complex ideas step-by-step, tests trainee code in a sandbox, and provides instant guidance tailored to their pace.'
    },
    {
      badge: 'PILLAR 2',
      title: 'Visual Interactive Knowledge Map',
      desc: 'Instead of confusing file folders, trainees see an interactive roadmap of nodes and connections showing exactly what topics to study first, what skills they unlock, and how far they have progressed.'
    },
    {
      badge: 'PILLAR 3',
      title: 'Tamper-Proof Holographic Honors Credentials',
      desc: 'When trainees complete their subjects, the system issues a digital honors certificate with dynamic holographic gold-foil animations and a cryptographic hash code that stops certificate forging in its tracks.'
    },
    {
      badge: 'PILLAR 4',
      title: 'Role-Based Governance & Rapid Admin Security',
      desc: 'Trainees only see learning tools, instructors manage courses, and administrators (Developer6316) have a direct, on-demand PIN security challenge to manage users, white-label branding, and real-time audit logs.'
    }
  ];

  fourPillars.forEach((p) => {
    doc.setFillColor(bgCard[0], bgCard[1], bgCard[2]);
    doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
    doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

    // Badge
    doc.setFillColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
    doc.roundedRect(margin + 4, y + 3.5, 17, 5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(p.badge, margin + 12.5, y + 7.2, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(p.title, margin + 24, y + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    const pLines = doc.splitTextToSize(p.desc, contentWidth - 10);
    doc.text(pLines, margin + 5, y + 13.5);

    y += 26.5;
  });

  // Bottom Box: Who Benefits
  y += 1;
  doc.setFillColor(240, 253, 244); // Soft emerald
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(darkEmerald[0], darkEmerald[1], darkEmerald[2]);
  doc.text('WHO BENEFITS FROM THIS PLATFORM?', margin + 5, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('• Trainees: Learn faster with instant feedback, zero wait times, and genuine skill retention.', margin + 5, y + 10.5);
  doc.text('• Trainers: Automated quiz evaluations, cohort diagnostics, and curriculum management in one place.', margin + 5, y + 14.5);
  doc.text('• Institutions & Gov: Lower training costs, 100% auditable digital credentials, and zero vendor lock-in.', margin + 5, y + 18.5);

  // ========================================================
  // PAGE 2: HONEST, BALANCED PROS & CONS ANALYSIS
  // ========================================================
  doc.addPage();
  addHeaderFooter(2, 'Balanced Pros & Cons Analysis');

  y = 22;

  // Title Card
  doc.setFillColor(bgCard[0], bgCard[1], bgCard[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.roundedRect(margin, y, contentWidth, 18, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Balanced Pros & Cons (Strengths vs. Real-World Trade-Offs)', margin + 6, y + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('Demonstrating technical and operational maturity by analyzing key advantages alongside mitigations.', margin + 6, y + 13.5);

  y += 23;

  // ================== SECTION: PROS ==================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkEmerald[0], darkEmerald[1], darkEmerald[2]);
  doc.text('PROS: Key Strengths & Institutional Advantages', margin, y);
  y += 4.5;

  const prosList = [
    {
      title: 'Active Socratic Learning (Up to 94% Retention)',
      desc: 'Trainees solve interactive problems, write live code, and receive instant explanations rather than passively skimming videos or static PDFs.'
    },
    {
      title: 'Zero Software Installation (PWA Browser-Based)',
      desc: 'Works immediately on any computer, tablet, or phone without app store approvals; includes Service Worker caching for offline study.'
    },
    {
      title: 'Fraud-Proof Cryptographic Certification',
      desc: 'Each certificate includes a tamper-evident hash signature and dynamic holographic border sheen that employers can verify in seconds.'
    },
    {
      title: 'Enterprise Server-Side Security & Audit Logs',
      desc: 'Gemini API keys stay protected on the server (zero browser leakage). Complete audit ledger records user logins, role updates, and IP telemetry.'
    },
    {
      title: 'Government & Cloud-Agnostic Portability',
      desc: 'Built on standard Node.js & React 19. Can be hosted on NIC, MeghRaj / GI Cloud, AWS GovCloud, or on-premise air-gapped data centers.'
    }
  ];

  prosList.forEach((item) => {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, y, contentWidth, 13.5, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(darkEmerald[0], darkEmerald[1], darkEmerald[2]);
    doc.text(`+  ${item.title}`, margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    const dLines = doc.splitTextToSize(item.desc, contentWidth - 8);
    doc.text(dLines, margin + 4, y + 9);

    y += 15.5;
  });

  y += 3;

  // ================== SECTION: CONS & MITIGATIONS ==================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkRose[0], darkRose[1], darkRose[2]);
  doc.text('CONS: Real-World Considerations & How We Mitigate Them', margin, y);
  y += 4.5;

  const consList = [
    {
      title: 'Internet Dependency for Generative AI',
      tradeoff: 'Real-time Gemini queries require an active internet connection to contact the model.',
      mitigation: 'Mitigation: PWA caches all courses, notes, and study modules offline; for air-gapped gov setups, local offline models (e.g. Gemma 2) can be plugged in without changing frontend code.'
    },
    {
      title: 'API Costs at Extreme Scale (100,000+ Trainees)',
      tradeoff: 'High query volumes could generate recurring cloud API costs if unmanaged.',
      mitigation: 'Mitigation: Uses Google Gemini 3.8 Flash (ultra-cost-effective) paired with server-side response caching for identical curriculum queries.'
    },
    {
      title: 'Database Scaling for High Concurrency',
      tradeoff: 'The default filesystem store is optimized for quick setup, not massive enterprise concurrency.',
      mitigation: 'Mitigation: Clean modular backend allows switching the persistence layer to PostgreSQL, Oracle, or Cloud SQL in minutes without touching UI components.'
    },
    {
      title: 'Digital Literacy Curve for Trainees',
      tradeoff: 'First-time users might be unfamiliar with interacting with an AI tutor or knowledge graph.',
      mitigation: 'Mitigation: Includes pre-filled prompt chips, intuitive search bars, and clear one-click navigation requiring zero technical expertise.'
    }
  ];

  consList.forEach((item) => {
    doc.setFillColor(255, 241, 242);
    doc.setDrawColor(254, 205, 211);
    doc.roundedRect(margin, y, contentWidth, 17, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(darkRose[0], darkRose[1], darkRose[2]);
    doc.text(`-  ${item.title}: `, margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    const tLines = doc.splitTextToSize(item.tradeoff, contentWidth - 8);
    doc.text(tLines, margin + 4, y + 8.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    const mLines = doc.splitTextToSize(item.mitigation, contentWidth - 8);
    doc.text(mLines, margin + 4, y + 12.5);

    y += 19;
  });

  // ================== BOTTOM 30-SECOND PITCH SCRIPT ==================
  y += 2;
  doc.setFillColor(254, 243, 199); // Amber
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, y, contentWidth, 21, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(accentAmber[0], accentAmber[1], accentAmber[2]);
  doc.text('30-SECOND VERBAL SCRIPT FOR YOUR PANEL OR JUDGES:', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const pitchText = doc.splitTextToSize(
    '"Judges, traditional employee training is broken because people forget 64% of what they read in static PDFs. Capacity Connect solves this with an always-available AI tutor, interactive knowledge graphs, and fraud-proof holographic certificates. While full AI requires internet, our offline PWA caching, low-cost Gemini Flash core, and air-gapped readiness make it an ideal, cost-effective upgrade for institutional scale."',
    contentWidth - 8
  );
  doc.text(pitchText, margin + 4, y + 10);

  // Write out to root and public directories
  const rootPdfPath = path.join(process.cwd(), 'Capacity_Connect_Explanation_Pros_Cons.pdf');
  const publicPdfPath = path.join(process.cwd(), 'public', 'Capacity_Connect_Explanation_Pros_Cons.pdf');

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(rootPdfPath, pdfBuffer);
  fs.writeFileSync(publicPdfPath, pdfBuffer);

  console.log('Pros & Cons Explanation PDF generated successfully!');
  console.log('Root:', rootPdfPath);
  console.log('Public:', publicPdfPath);
}

generateProsConsPDF();
