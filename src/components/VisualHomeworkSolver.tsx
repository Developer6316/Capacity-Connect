import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  RefreshCw, 
  FileText, 
  Copy, 
  Check, 
  Share2, 
  Eye, 
  X,
  Lightbulb,
  Cpu
} from 'lucide-react';
import { HomeworkAnalysisResult, SubjectId } from '../types';
import { PRESET_SAMPLE_PROBLEMS } from '../data/curriculumData';
import { sound } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface VisualHomeworkSolverProps {
  selectedSubject: SubjectId;
  onAddXp: (amount: number) => void;
  onShareToCircle?: (content: string) => void;
}

export const VisualHomeworkSolver: React.FC<VisualHomeworkSolverProps> = ({
  selectedSubject,
  onAddXp,
  onShareToCircle,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [studentPrompt, setStudentPrompt] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<HomeworkAnalysisResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showFollowUpHint, setShowFollowUpHint] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePresetSelect = (preset: typeof PRESET_SAMPLE_PROBLEMS[0]) => {
    setStudentPrompt(preset.prompt);
    // Create an aesthetic canvas representation of the problem equation as imagePreview
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark slate paper background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines like graph paper
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Title & sample problem stamp
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(preset.title, 40, 60);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText('Sample High School Textbook Problem', 40, 95);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '16px monospace';
      
      // Multi-line wrap
      const words = preset.prompt.split(' ');
      let line = '';
      let y = 140;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 540 && n > 0) {
          ctx.fillText(line, 40, y);
          line = words[n] + ' ';
          y += 26;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 40, y);

      const generatedDataUrl = canvas.toDataURL('image/png');
      setImagePreview(generatedDataUrl);
      setMimeType('image/png');
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview && !studentPrompt) {
      alert('Please upload a photo of the problem or select a preset problem.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/analyze-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: mimeType,
          studentPrompt: studentPrompt || 'Solve this step by step and explain the core principle.',
          subject: selectedSubject,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAnalysisResult(data.data);
        onAddXp(180);
        sound.playCorrect(3);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } else {
        alert('Could not complete image analysis: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to analyze image. Please check network connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopySolution = () => {
    if (!analysisResult) return;
    const text = `${analysisResult.topic} (${analysisResult.subject})\n\nProblem:\n${analysisResult.transcription}\n\nSolution Steps:\n${analysisResult.stepByStepSolution.map(s => `${s.stepNumber}. ${s.stepTitle}: ${s.explanation} ${s.equationOrCode || ''}`).join('\n')}\n\nConceptual Reason:\n${analysisResult.conceptualExplanation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-black/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="font-mono uppercase tracking-wider">Multi-Modal Vision • gemini-3.1-pro-preview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Visual Homework & Problem Solver
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Snap or upload a photo of your textbook problem, handwritten equation, or exam prompt. Gemini 3.1 Pro provides step-by-step guidance, conceptual explanations, and common pitfall warnings.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
          <Camera className="w-4 h-4 text-indigo-400" />
          <span>Upload Image or Equation</span>
        </div>
      </div>

      {/* Preset Fast Sample Picker */}
      <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Quick Presets (Test instantly without a camera):
          </span>
          <span className="text-[11px] text-slate-500">Click any card to load</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_SAMPLE_PROBLEMS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset)}
              className="text-left p-3 rounded-lg bg-slate-850/60 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all text-xs group"
            >
              <span className="font-semibold text-slate-200 group-hover:text-indigo-300 block truncate">
                {preset.title}
              </span>
              <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {preset.prompt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone & Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Image Upload & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 min-h-[300px] text-center ${
              imagePreview 
                ? 'border-slate-700 bg-slate-900' 
                : 'border-indigo-500/40 hover:border-indigo-400 bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />

            {imagePreview ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img 
                  src={imagePreview} 
                  alt="Problem preview" 
                  className="max-h-72 w-auto object-contain rounded-lg border border-slate-700 shadow-md"
                />
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setAnalysisResult(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear Image</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to browse or drop homework photo here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports high-res PNG, JPG, screenshots, and handwritten worksheets
                  </p>
                </div>
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700">
                  <Upload className="w-3 h-3" />
                  <span>Choose file</span>
                </div>
              </div>
            )}
          </div>

          {/* Student Question / Focus Prompt */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Specific Student Question / Focus (Optional)
            </label>
            <input
              type="text"
              value={studentPrompt}
              onChange={(e) => setStudentPrompt(e.target.value)}
              placeholder="e.g., Why did they use U-substitution instead of parts? Where did my negative sign go?"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!imagePreview && !studentPrompt)}
            className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all ${
              isAnalyzing || (!imagePreview && !studentPrompt)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
            }`}
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing via gemini-3.1-pro-preview...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Analyze with Gemini 3.1 Pro (+180 XP)</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Analysis Results or Guidance Placeholder */}
        <div className="lg:col-span-7 space-y-4">
          {analysisResult ? (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5 animate-in fade-in duration-300">
              {/* Result Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {analysisResult.subject}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-200">
                      {analysisResult.topic}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white font-display">
                    Step-by-Step Problem Breakdown
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopySolution}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center space-x-1"
                    title="Copy breakdown"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  {onShareToCircle && (
                    <button
                      onClick={() => onShareToCircle(`Solved ${analysisResult.topic}: ${analysisResult.conceptualExplanation}`)}
                      className="p-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs flex items-center space-x-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Post to Circle</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Problem Transcription */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <span className="text-slate-400 font-medium block text-[11px] mb-1">
                  Detected Problem Statement:
                </span>
                <p className="text-slate-200 font-mono italic leading-relaxed">
                  "{analysisResult.transcription}"
                </p>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Step-by-Step Solution Logic</span>
                </h3>

                <div className="space-y-2.5">
                  {analysisResult.stepByStepSolution.map((step) => (
                    <div 
                      key={step.stepNumber}
                      className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-100">
                          {step.stepTitle}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 pl-7 leading-relaxed">
                        {step.explanation}
                      </p>
                      {step.equationOrCode && (
                        <div className="ml-7 p-2 rounded-lg bg-slate-900 font-mono text-xs text-cyan-300 border border-slate-800">
                          {step.equationOrCode}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Conceptual "Why This Works" */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs space-y-1.5">
                <div className="flex items-center space-x-1.5 text-indigo-300 font-semibold">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>The Conceptual "Why" Behind This Method:</span>
                </div>
                <p className="text-slate-300 leading-relaxed pl-5">
                  {analysisResult.conceptualExplanation}
                </p>
              </div>

              {/* Common Pitfalls & Key Formulas in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Pitfalls */}
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/30 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-rose-300 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Watch Out (Common Mistakes):</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
                    {analysisResult.commonPitfalls.map((pitfall, idx) => (
                      <li key={idx}>{pitfall}</li>
                    ))}
                  </ul>
                </div>

                {/* Key Formulas */}
                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-cyan-300 font-semibold">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Essential Formulas Used:</span>
                  </div>
                  <ul className="space-y-1 font-mono text-cyan-200 text-[11px]">
                    {analysisResult.keyFormulas.map((formula, idx) => (
                      <li key={idx} className="bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                        {formula}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Practice Follow-up Challenge */}
              {analysisResult.practiceFollowUp && (
                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-400" />
                      Follow-up Practice Challenge:
                    </span>
                    <button
                      onClick={() => setShowFollowUpHint(!showFollowUpHint)}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      {showFollowUpHint ? 'Hide Hint' : 'Show Answer Hint'}
                    </button>
                  </div>
                  <p className="text-slate-200 italic font-mono pl-5">
                    "{analysisResult.practiceFollowUp.question}"
                  </p>
                  {showFollowUpHint && (
                    <div className="ml-5 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                      💡 <strong>Hint:</strong> {analysisResult.practiceFollowUp.answerHint}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-2xl border border-slate-800 bg-slate-900/40 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300">
                No Problem Analyzed Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Upload a homework image on the left, or pick one of the quick test presets above to witness step-by-step Socratic breakdown with Gemini 3.1 Pro.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
