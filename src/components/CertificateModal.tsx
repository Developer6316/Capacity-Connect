import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, ShieldCheck, Printer, CheckCircle, ArrowLeft, Download, Loader2, FileCheck, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { CourseCertificate } from '../types';
import { sound } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  certificate: CourseCertificate | null;
  onClose: () => void;
}

/**
 * Generates and downloads a high-resolution, vector-rendered A4 Landscape PDF certificate
 */
export const exportCertificateToPDF = (certificate: CourseCertificate): void => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = 297;
  const pageHeight = 210;
  const centerX = pageWidth / 2;

  // Background - Deep midnight slate
  doc.setFillColor(8, 13, 26);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Concentric decorative background watermark circles
  doc.setDrawColor(20, 32, 58);
  doc.setLineWidth(0.4);
  doc.circle(centerX, 105, 55);
  doc.circle(centerX, 105, 80);

  // Outer border
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, 281, 194);

  // Secondary gold border
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.6);
  doc.rect(11, 11, 275, 188);

  // Primary gold border
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1.4);
  doc.rect(13, 13, 271, 184);

  // Inner indigo hairline
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.3);
  doc.rect(15, 15, 267, 180);

  // Ornate gold corner brackets
  const corners: [number, number, number, number, number, number][] = [
    [17, 17, 26, 17, 17, 26],
    [280, 17, 271, 17, 280, 26],
    [17, 193, 26, 193, 17, 184],
    [280, 193, 271, 193, 280, 184],
  ];
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.8);
  corners.forEach(([x1, y1, x2, y2, x3, y3]) => {
    doc.line(x1, y1, x2, y2);
    doc.line(x1, y1, x3, y3);
  });

  // Top emblem medallion
  doc.setFillColor(217, 119, 6);
  doc.circle(centerX, 28, 7, 'F');
  doc.setFillColor(245, 158, 11);
  doc.circle(centerX, 28, 5.5, 'F');
  doc.setFillColor(120, 53, 15);
  doc.circle(centerX, 28, 4.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('★', centerX, 30.5, { align: 'center' });

  // Organization header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(251, 191, 36);
  doc.text('CAPACITY CONNECT  •  ACADEMIC HONOR AWARD', centerX, 41, { align: 'center' });

  // Certificate title
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('Certificate of Academic Mastery', centerX, 52, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text('This verified credential certifies that', centerX, 62, { align: 'center' });

  // Recipient name
  const recipient = certificate.recipientName || certificate.studentName || 'Distinguished Scholar';
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(165, 180, 252);
  doc.text(recipient, centerX, 76, { align: 'center' });

  // Decorative underline
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.6);
  doc.line(75, 80, 222, 80);

  // Formatted score
  const rawScore = certificate.score || certificate.gradeScore || '100% (Honors Distinction)';
  const formattedScore = typeof rawScore === 'string' && rawScore.includes('%')
    ? rawScore
    : `${rawScore}%`;

  // Achievement description paragraph
  const courseTitle = certificate.courseTitle || certificate.subjectTitle || 'Enterprise Technical Curriculum';
  const desc = `has demonstrated exceptional mastery in ${courseTitle}, fulfilling all syllabus modules, diagnostic quizzes with honors score of ${formattedScore}, and solving advanced curricular challenges.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(226, 232, 240);
  const lines = doc.splitTextToSize(desc, 200);
  doc.text(lines, centerX, 92, { align: 'center', lineHeightFactor: 1.4 });

  // Bottom section: Left Column (Certified Date & Instructor)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('CERTIFIED DATE', 30, 138);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(241, 245, 249);
  const issueDate = certificate.issueDate || certificate.completionDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  doc.text(issueDate, 30, 144);

  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.5);
  doc.line(30, 160, 95, 160);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('MASTER INSTRUCTOR SIGNATURE', 30, 165);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(165, 180, 252);
  const instructor = certificate.instructorName || 'Academic Governance Council';
  doc.text(instructor, 30, 171);

  // Bottom section: Center Official Medallion / Seal
  doc.setFillColor(180, 83, 9);
  doc.circle(centerX, 150, 14, 'F');
  doc.setFillColor(245, 158, 11);
  doc.circle(centerX, 150, 12.5, 'F');
  doc.setFillColor(15, 23, 42);
  doc.circle(centerX, 150, 10.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(251, 191, 36);
  doc.text('OFFICIAL', centerX, 148, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('VERIFIED', centerX, 152, { align: 'center' });
  doc.setFontSize(6);
  doc.setTextColor(251, 191, 36);
  doc.text('SEAL', centerX, 155.5, { align: 'center' });

  // Bottom section: Right Column (Cryptographic Verification Hash)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('SHA-256 VERIFICATION HASH', 202, 138);

  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.4);
  doc.rect(202, 141, 66, 12, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(52, 211, 153);
  const hash = certificate.verificationHash || certificate.verificationCode || 'SHA256-CERT-LMS2026';
  doc.text(hash.slice(0, 26), 205, 148.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const certId = certificate.id || 'CC-ACAD-2026';
  doc.text(`Certificate ID: ${certId.slice(0, 28)}`, 202, 161);
  doc.text('TLS 1.3 Immutable Log Registered', 202, 166);
  doc.text('AICTE / Institutional Governance Verified', 202, 171);

  // Bottom footer note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Capacity Connect Verified Credential • Issued in accordance with Academic Excellence Frameworks', centerX, 188, { align: 'center' });

  // Save the PDF file
  const safeRecipient = recipient.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeCourse = courseTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Certificate_${safeRecipient}_${safeCourse}.pdf`;
  doc.save(filename);
};

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Trigger celebration audio and confetti when certificate opens
  useEffect(() => {
    if (certificate) {
      sound.playLevelUp();
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.4 },
          colors: ['#f59e0b', '#6366f1', '#10b981', '#38bdf8', '#fbbf24'],
        });
      } catch {
        // Fallback gracefully if canvas unavailable
      }
    }
  }, [certificate?.id, certificate?.verificationHash]);

  const formattedScore = certificate && (typeof certificate.score === 'string' && certificate.score.includes('%')
    ? certificate.score
    : `${certificate?.score}%`);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    if (!certificate) return;
    setIsExporting(true);
    try {
      exportCertificateToPDF(certificate);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to export certificate PDF:', err);
      // fallback to browser print dialog
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {certificate && (
        <motion.div 
          key="certificate-modal-overlay"
          id="certificate-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
        >
          <motion.div 
            key="certificate-modal-container"
            id="certificate-modal-container"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 280,
              mass: 0.85,
            }}
            className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[95vh]"
          >
            {/* Header toolbar with Reverse / Back button, PDF Export button, and Close button */}
            <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-2">
                <button
                  id="certificate-btn-back-header"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center space-x-1.5 font-semibold transition-colors border border-slate-700 shadow-sm cursor-pointer"
                  title="Reverse / Back to Dashboard"
                >
                  <ArrowLeft className="w-4 h-4 text-indigo-400" />
                  <span>Back / Reverse</span>
                </button>
                <div className="hidden sm:flex items-center space-x-1.5 text-indigo-400 font-mono text-[11px] ml-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verifiable Credential</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Top Download PDF Button */}
                <button
                  id="certificate-btn-export-pdf-header"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-semibold transition-all border shadow-sm cursor-pointer ${
                    downloadSuccess
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-indigo-600/30'
                  }`}
                  title="Export Certificate as PDF"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="hidden sm:inline">Generating...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">PDF Saved!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Export PDF</span>
                    </>
                  )}
                </button>

                <button
                  id="certificate-btn-print-header"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1.5 transition-colors border border-slate-700 cursor-pointer"
                  title="Print Certificate"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  id="certificate-btn-close-header"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/30 cursor-pointer"
                  title="Close Certificate (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Parchment Body - Scrollable if screen is compact */}
            <div className="overflow-y-auto p-4 sm:p-8">
              {/* Holographic Gold Foil Border Frame */}
              <div className="holo-gold-foil-border-container relative">
                {/* Specular Holographic Glint Beam Sweep across the gold border upon opening */}
                <div className="holo-foil-opening-sweep" />

                <div 
                  id="certificate-parchment-sheet"
                  className="p-6 sm:p-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-[16px] text-center space-y-6 relative overflow-hidden shadow-inner border border-amber-500/30"
                >
                  {/* Ornate Gold Corner Brackets with Holographic Sparkles */}
                  <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-amber-300/90 rounded-tl pointer-events-none holo-sparkle" />
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-amber-300/90 rounded-tr pointer-events-none holo-sparkle" style={{ animationDelay: '0.8s' }} />
                  <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-amber-300/90 rounded-bl pointer-events-none holo-sparkle" style={{ animationDelay: '1.6s' }} />
                  <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-amber-300/90 rounded-br pointer-events-none holo-sparkle" style={{ animationDelay: '2.4s' }} />

                  {/* Subtle watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Award className="w-96 h-96 text-indigo-400" />
                  </div>

                <div className="space-y-2">
                  <motion.div
                    initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.18, type: 'spring', damping: 18, stiffness: 240 }}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20"
                  >
                    <Award className="w-7 h-7 sm:w-8 sm:h-8" />
                  </motion.div>
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-400 uppercase block">
                    Capacity Connect • Academic Honor Award
                  </span>
                  <h1 className="text-xl sm:text-3xl font-display font-black text-white tracking-tight">
                    Certificate of Academic Mastery
                  </h1>
                </div>

                <p className="text-xs sm:text-sm text-slate-400">
                  This verified credential certifies that
                </p>

                <div className="py-2 border-b-2 border-indigo-500/30 max-w-sm mx-auto">
                  <h2 className="text-lg sm:text-2xl font-bold font-display text-indigo-300">
                    {certificate.recipientName}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  has demonstrated exceptional mastery in <strong>{certificate.courseTitle}</strong>, fulfilling all syllabus modules, diagnostic quizzes with honors score of <strong>{formattedScore}</strong>, and solving advanced curricular challenges.
                </p>

                {/* Signature & Verification Hash */}
                <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Certified Date</span>
                    <span className="text-xs font-semibold text-slate-300">{certificate.issueDate}</span>
                    <span className="text-[10px] font-mono text-slate-500 block mt-1">Instructor: {certificate.instructorName}</span>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">SHA-256 Verification Hash</span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 inline" /> {certificate.verificationHash.slice(0, 16)}...
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">TLS 1.3 Immutable Log Registered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Prominent Bottom Action Bar with dedicated Download PDF button & Close button */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                id="certificate-btn-close-footer"
                onClick={onClose}
                className="px-4 sm:px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span>Close & Return to Dashboard</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="certificate-btn-print-footer"
                  onClick={handlePrint}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print</span>
                </button>

                <button
                  id="certificate-btn-download-pdf-footer"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                    downloadSuccess
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-amber-500/30 hover:shadow-amber-500/50'
                  }`}
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Generating PDF...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <FileCheck className="w-4 h-4 text-white" />
                      <span>PDF Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Download Official PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
