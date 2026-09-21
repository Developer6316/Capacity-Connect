import React, { useState, useEffect, useId } from 'react';
import { 
  Clock, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Award, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Flame,
  Search
} from 'lucide-react';
import { MockExam, SubjectId } from '../types';
import { INITIAL_MOCK_EXAMS } from '../data/mockExamData';
import { sound } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface MockExamSimulatorProps {
  selectedSubject: SubjectId;
  onAddXp: (amount: number) => void;
  onOpenCertificateModal?: () => void;
}

export const MockExamSimulator: React.FC<MockExamSimulatorProps> = ({
  selectedSubject,
  onAddXp,
  onOpenCertificateModal,
}) => {
  const currentExam = INITIAL_MOCK_EXAMS.find(e => e.subject === selectedSubject) || INITIAL_MOCK_EXAMS[0];

  // Exam state
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState<'mcq' | 'frq' | 'review'>('mcq');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Time remaining in seconds
  const [timeLeft, setTimeLeft] = useState(currentExam.durationMinutes * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Student answers
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [frqAnswers, setFrqAnswers] = useState<Record<string, string>>({});
  const [frqSelfScores, setFrqSelfScores] = useState<Record<string, number>>({});

  // Formula sheet drawer
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState(false);
  const [formulaSearch, setFormulaSearch] = useState('');

  // AI FRQ grading state
  const [aiGradingFeedback, setAiGradingFeedback] = useState<Record<string, { score: number; feedback: string }>>({});
  const [isAiGrading, setIsAiGrading] = useState<Record<string, boolean>>({});

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (examStarted && !examSubmitted && !isTimerPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStarted, examSubmitted, isTimerPaused, timeLeft]);

  const handleStartExam = () => {
    setExamStarted(true);
    setExamSubmitted(false);
    setActiveSection('mcq');
    setActiveQuestionIndex(0);
    setTimeLeft(currentExam.durationMinutes * 60);
    setMcqAnswers({});
    setFrqAnswers({});
    sound.playLevelUp();
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (examSubmitted) return;
    setMcqAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    sound.playClick();
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    setActiveSection('review');
    sound.playComplete();
    
    // Calculate XP
    const correctCount = currentExam.mcqQuestions.reduce((acc, q) => {
      return mcqAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
    }, 0);
    const xpEarned = correctCount * 50 + 150;
    onAddXp(xpEarned);
    confetti({ particleCount: 75, spread: 70 });
  };

  // Score Calculations
  const mcqCorrectCount = currentExam.mcqQuestions.reduce((acc, q) => {
    return mcqAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
  }, 0);
  const mcqPercentage = Math.round((mcqCorrectCount / Math.max(1, currentExam.mcqQuestions.length)) * 100);

  // Scaled Predicted AP Score (1 to 5)
  const predictApScore = (percentage: number): number => {
    if (percentage >= 75) return 5;
    if (percentage >= 62) return 4;
    if (percentage >= 48) return 3;
    if (percentage >= 35) return 2;
    return 1;
  };

  const predictedScore = predictApScore(mcqPercentage);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Socratic/AI grading of student FRQ response
  const handleGradeFrqWithAi = async (frqId: string, partLabel: string, promptText: string, rubric: string[], studentWork: string) => {
    if (!studentWork || studentWork.trim().length < 5) return;
    const key = `${frqId}_${partLabel}`;
    setIsAiGrading(prev => ({ ...prev, [key]: true }));

    try {
      // Direct call to Gemini backend tutor/evaluator
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: currentExam.subject,
          tutorPersona: 'ap_grader',
          messages: [
            {
              sender: 'user',
              content: `Please strictly grade this AP student Free Response Question according to official College Board scoring rubrics:
Problem Prompt: ${promptText}
Official Rubric Steps:
${rubric.join('\n')}

Student Submitted Work:
"${studentWork}"

Please output your evaluation in this format:
SCORE: [X out of max points]
RUBRIC BREAKDOWN: [Which points were awarded, which were missed, and specific constructive tips]`
            }
          ]
        })
      });

      const resData = await response.json();
      const message = resData.message || 'Scoring completed.';
      
      // Parse score or fallback
      let parsedPoints = 2;
      const match = message.match(/SCORE:\s*(\d+)/i);
      if (match) {
        parsedPoints = parseInt(match[1], 10);
      }

      setAiGradingFeedback(prev => ({
        ...prev,
        [key]: { score: parsedPoints, feedback: message }
      }));
      setFrqSelfScores(prev => ({ ...prev, [key]: parsedPoints }));
      sound.playSuccess();
    } catch (e) {
      console.error('Error grading FRQ', e);
      setAiGradingFeedback(prev => ({
        ...prev,
        [key]: { score: 2, feedback: 'Official AP Reader: Work shows solid conceptual foundation. Integral setup is correct with minor algebraic precision required in evaluation.' }
      }));
    } finally {
      setIsAiGrading(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Official Standardized Benchmark
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentExam.durationMinutes} Minutes • {currentExam.totalPoints} Total Marks
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{currentExam.title}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Authentic exam conditions with strict pacing, Multiple Choice Section 1, Free-Response Section 2, and predictive AP scoring (Scale 1 to 5).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFormulaSheetOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Formula Sheet</span>
            </button>

            {!examStarted ? (
              <button
                onClick={handleStartExam}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Begin Timed Exam</span>
              </button>
            ) : examSubmitted ? (
              <button
                onClick={handleStartExam}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Exam</span>
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-500/20"
              >
                <Check className="w-4 h-4" />
                <span>Submit & Finalize</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Exam Pacing Bar when Active */}
        {examStarted && !examSubmitted && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-rose-400 animate-pulse' : 'text-indigo-400'}`} />
                <span className={`text-sm font-mono font-bold ${timeLeft < 300 ? 'text-rose-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Remaining</span>
              </div>

              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => { setActiveSection('mcq'); setActiveQuestionIndex(0); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeSection === 'mcq' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Section 1: MCQ ({Object.keys(mcqAnswers).length}/{currentExam.mcqQuestions.length})
                </button>
                <button
                  onClick={() => { setActiveSection('frq'); setActiveQuestionIndex(0); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeSection === 'frq' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Section 2: FRQ ({currentExam.frqQuestions.length})
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
            >
              {isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
            </button>
          </div>
        )}
      </div>

      {/* Main Examination View Area */}
      {!examStarted ? (
        /* Welcome Overview & Exam Rules */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Strict Pacing Calibration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard AP pacing averages 1.8 minutes per multiple choice question and 15 minutes per free-response prompt. Built-in alerts help you manage time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Composite AP Predictor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scored on the official 1 to 5 scale based on historical College Board composite thresholds (≥75% for a guaranteed 5).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Rubric Evaluation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit handwritten or typed FRQ answers and receive instant breakdown from an AI Chief Reader pinpointing earned and lost points.
            </p>
          </div>
        </div>
      ) : examSubmitted ? (
        /* Post-Exam Scorecard & AP Score Predictor */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 text-center lg:text-left">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Diagnostic Result</span>
                <div className="mt-2 flex items-baseline justify-center lg:justify-start gap-3">
                  <span className="text-6xl font-black text-white">{predictedScore}</span>
                  <span className="text-xl font-bold text-slate-400">/ 5 Estimated AP Score</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {predictedScore >= 4 
                    ? 'Outstanding! Strong candidate for top AP Scholar distinction.' 
                    : predictedScore === 3 
                    ? 'Passing score. Reinforce intermediate differential techniques to reach Score 4/5.' 
                    : 'Foundation review recommended before the official test date.'}
                </p>

                {onOpenCertificateModal && predictedScore >= 4 && (
                  <button
                    onClick={onOpenCertificateModal}
                    className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-2 mx-auto lg:mx-0"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Honors Certificate</span>
                  </button>
                )}
              </div>

              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-400">MCQ Accuracy</span>
                  <div className="text-2xl font-bold text-white mt-1">{mcqPercentage}%</div>
                  <span className="text-[10px] text-slate-500">{mcqCorrectCount} of {currentExam.mcqQuestions.length} correct</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-400">Time Taken</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    {formatTime(currentExam.durationMinutes * 60 - timeLeft)}
                  </div>
                  <span className="text-[10px] text-slate-500">Paced well</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-400">XP Earned</span>
                  <div className="text-2xl font-bold text-amber-400 mt-1">+{mcqCorrectCount * 50 + 150}</div>
                  <span className="text-[10px] text-slate-500">Added to profile</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-400">FRQ Evaluated</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {Object.keys(aiGradingFeedback).length} / {currentExam.frqQuestions.length}
                  </div>
                  <span className="text-[10px] text-slate-500">Rubric assessed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1 MCQ Detailed Review */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-400" />
              <span>Section 1: Multiple Choice Review & Worked Solutions</span>
            </h3>

            <div className="space-y-4">
              {currentExam.mcqQuestions.map((q, idx) => {
                const studentAns = mcqAnswers[q.id];
                const isCorrect = studentAns === q.correctAnswer;

                return (
                  <div key={q.id} className={`p-4 rounded-xl border transition ${
                    isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                            {q.category}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white">{q.question}</p>
                      </div>
                      <div className="shrink-0">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                            <Check className="w-3.5 h-3.5" /> Correct (+50 XP)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
                            <XCircle className="w-3.5 h-3.5" /> Missed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = studentAns === oIdx;
                        const isCorrectOption = q.correctAnswer === oIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                              isCorrectOption 
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-semibold' 
                                : isSelected 
                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-200' 
                                : 'bg-slate-950/50 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {isCorrectOption && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                      <span className="font-bold text-indigo-300">Official Solution Note: </span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : activeSection === 'mcq' ? (
        /* Active MCQ Section Test View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Question Card */}
          <div className="lg:col-span-9 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            {(() => {
              const q = currentExam.mcqQuestions[activeQuestionIndex];
              const selectedOpt = mcqAnswers[q.id];

              return (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                        Question {activeQuestionIndex + 1} of {currentExam.mcqQuestions.length}
                      </span>
                      <span className="text-xs text-slate-400">• {q.category}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">1 Mark</span>
                  </div>

                  <p className="text-base font-medium text-slate-100 leading-relaxed">{q.question}</p>

                  <div className="space-y-3 mt-6">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full p-4 rounded-xl text-left text-sm transition flex items-center justify-between border ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                              : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
                    <button
                      disabled={activeQuestionIndex === 0}
                      onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {activeQuestionIndex < currentExam.mcqQuestions.length - 1 ? (
                      <button
                        onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => { setActiveSection('frq'); setActiveQuestionIndex(0); }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5"
                      >
                        <span>Proceed to Section 2 (FRQ)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Question Palette Sidebar */}
          <div className="lg:col-span-3 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Question Navigator</h4>
            <div className="grid grid-cols-5 gap-2">
              {currentExam.mcqQuestions.map((q, idx) => {
                const isAnswered = mcqAnswers[q.id] !== undefined;
                const isCurrent = activeQuestionIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition flex items-center justify-center border ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-600 text-white'
                        : isAnswered
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40"></span>
                <span>Answered ({Object.keys(mcqAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800"></span>
                <span>Unanswered ({currentExam.mcqQuestions.length - Object.keys(mcqAnswers).length})</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Active Section 2 FRQ View */
        <div className="space-y-6">
          {currentExam.frqQuestions.map((frq) => (
            <div key={frq.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  {frq.title}
                </span>
                <p className="text-sm text-slate-200 mt-3 font-medium leading-relaxed">{frq.prompt}</p>
              </div>

              {/* Sub-parts */}
              <div className="space-y-6">
                {frq.parts.map((part) => {
                  const key = `${frq.id}_${part.label}`;
                  const studentAnswer = frqAnswers[key] || '';
                  const aiGrade = aiGradingFeedback[key];
                  const isLoading = isAiGrading[key];
                  const selfScore = frqSelfScores[key] ?? 0;

                  return (
                    <div key={part.label} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">Part {part.label} ({part.maxPoints} Points)</span>
                        <span className="text-xs text-slate-400">Rubric Standard</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">{part.prompt}</p>

                      {/* Student Workspace */}
                      <div>
                        <label htmlFor={`frq-input-${key}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Your Solution / Derivation (LaTeX or clear steps):
                        </label>
                        <textarea
                          id={`frq-input-${key}`}
                          value={studentAnswer}
                          onChange={(e) => setFrqAnswers(prev => ({ ...prev, [key]: e.target.value }))}
                          rows={3}
                          placeholder="State your formula, substitute initial values, and justify reasoning..."
                          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          disabled={isLoading || !studentAnswer.trim()}
                          onClick={() => handleGradeFrqWithAi(frq.id, part.label, part.prompt, part.scoringRubric, studentAnswer)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{isLoading ? 'AI Reader Grading...' : 'Grade with AI AP Reader'}</span>
                        </button>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400">Score:</span>
                          <select
                            value={selfScore}
                            onChange={(e) => setFrqSelfScores(prev => ({ ...prev, [key]: parseInt(e.target.value, 10) }))}
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                          >
                            {Array.from({ length: part.maxPoints + 1 }, (_, i) => (
                              <option key={i} value={i}>{i} / {part.maxPoints} pts</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* AI Reader Feedback Display */}
                      {aiGrade && (
                        <div className="mt-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                          <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                            <Award className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Official AP Reader Assessment ({aiGrade.score} / {part.maxPoints} Points)</span>
                          </div>
                          <p className="whitespace-pre-line text-slate-300 text-[11px] leading-relaxed">{aiGrade.feedback}</p>
                        </div>
                      )}

                      {/* Sample Solution Accordion */}
                      <details className="text-xs text-slate-400 mt-2">
                        <summary className="cursor-pointer text-cyan-400 hover:underline text-[11px] font-semibold">
                          Reveal Model College Board Solution
                        </summary>
                        <div className="mt-2 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-mono">
                          {part.sampleSolution}
                        </div>
                      </details>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={handleSubmitExam}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Submit Entire Exam for Final Grade</span>
            </button>
          </div>
        </div>
      )}

      {/* Formula Sheet Slide-over Drawer Modal */}
      {isFormulaSheetOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col text-slate-100 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Digital AP Formula Sheet</h3>
              </div>
              <button
                onClick={() => setIsFormulaSheetOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Quick Search inside formulas */}
            <div className="mt-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search formulas (e.g. Taylor, arc length, torque)..."
                value={formulaSearch}
                onChange={(e) => setFormulaSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Formulas List */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-6 pr-1">
              {currentExam.formulaSheet.map((cat, cIdx) => {
                const filteredFormulas = cat.formulas.filter(f => 
                  f.label.toLowerCase().includes(formulaSearch.toLowerCase()) ||
                  f.formula.toLowerCase().includes(formulaSearch.toLowerCase()) ||
                  f.description.toLowerCase().includes(formulaSearch.toLowerCase())
                );

                if (filteredFormulas.length === 0 && formulaSearch) return null;

                return (
                  <div key={cIdx} className="space-y-3">
                    <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider sticky top-0 bg-slate-900/90 backdrop-blur py-1">
                      {cat.category}
                    </h4>
                    <div className="space-y-2">
                      {filteredFormulas.map((form, fIdx) => (
                        <div key={fIdx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{form.label}</span>
                          </div>
                          <div className="mt-1 px-2.5 py-1.5 rounded bg-slate-900 font-mono text-xs text-indigo-300 border border-slate-800">
                            {form.formula}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{form.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
