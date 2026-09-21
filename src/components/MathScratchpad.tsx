import React, { useRef, useState, useEffect } from 'react';
import { 
  PenTool, 
  Eraser, 
  Trash2, 
  Download, 
  Sparkles, 
  Grid, 
  Mic, 
  MicOff, 
  Check, 
  AlertCircle, 
  Maximize2, 
  Type, 
  Palette,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { SubjectId } from '../types';
import { sound } from '../utils/audioSynth';

interface MathScratchpadProps {
  selectedSubject: SubjectId;
  onAddXp: (amount: number) => void;
  onOpenTutorWithTopic?: (topic: string) => void;
}

export const MathScratchpad: React.FC<MathScratchpadProps> = ({
  selectedSubject,
  onAddXp,
  onOpenTutorWithTopic,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [strokeColor, setStrokeColor] = useState('#6366f1');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [gridMode, setGridMode] = useState<'cartesian' | 'dots' | 'blank'>('cartesian');

  // Equation text and notes
  const [typedEquation, setTypedEquation] = useState('');
  const [isDictating, setIsDictating] = useState(false);

  // AI step check response
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // LaTeX quick symbols
  const latexSymbols = [
    { label: '∫ dx', latex: '\\int f(x) dx' },
    { label: 'd/dx', latex: '\\frac{d}{dx}' },
    { label: '∑', latex: '\\sum_{n=1}^{\\infty}' },
    { label: 'lim', latex: '\\lim_{x \\to 0}' },
    { label: '√x', latex: '\\sqrt{x}' },
    { label: '∂/∂x', latex: '\\frac{\\partial}{\\partial x}' },
    { label: '∞', latex: '\\infty' },
    { label: 'π', latex: '\\pi' },
    { label: 'θ', latex: '\\theta' },
    { label: 'Δy/Δx', latex: '\\frac{\\Delta y}{\\Delta x}' },
    { label: 'λ', latex: '\\lambda' },
    { label: '±', latex: '\\pm' },
    { label: 'F⃗', latex: '\\vec{F}' },
  ];

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI resolution
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = 420 * dpr;
    ctx.scale(dpr, dpr);

    drawGridBackground(ctx, rect.width, 420, gridMode);
  }, [gridMode]);

  const drawGridBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, mode: 'cartesian' | 'dots' | 'blank') => {
    // Fill background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    if (mode === 'cartesian') {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      const step = 25;

      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Origin axes
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    } else if (mode === 'dots') {
      ctx.fillStyle = '#334155';
      const step = 24;
      for (let x = 12; x < width; x += step) {
        for (let y = 12; y < height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPos(e);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 4;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    } else if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = strokeColor + '55'; // semi-transparent
      ctx.lineWidth = strokeWidth * 3;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawGridBackground(ctx, rect.width, 420, gridMode);
    sound.playClick();
  };

  const handleInsertSymbol = (symbol: string) => {
    setTypedEquation(prev => (prev ? `${prev} ${symbol}` : symbol));
    sound.playClick();
  };

  // Voice dictation for equations
  const toggleVoiceDictation = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isDictating) {
      setIsDictating(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsDictating(true);
      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTypedEquation(prev => (prev ? `${prev} ${spoken}` : spoken));
        setIsDictating(false);
        sound.playSuccess();
      };
      recognition.onerror = () => setIsDictating(false);
      recognition.onend = () => setIsDictating(false);

      recognition.start();
    } catch {
      setIsDictating(false);
    }
  };

  // Analyze handwritten or typed steps with Gemini
  const handleAnalyzeWork = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAiAnalysisResult(null);
    sound.playClick();

    try {
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.85);

      const response = await fetch('/api/gemini/analyze-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: 'image/jpeg',
          studentPrompt: typedEquation 
            ? `Please inspect my handwritten scratchpad canvas steps and typed equation: "${typedEquation}". Check every algebraic, derivative, and integral step carefully, point out any sign errors or misconceptions, and verify if the result is valid.` 
            : 'Please examine my handwritten math/physics steps on the scratchpad, verify if the intermediate logic is mathematically sound, and identify any errors.',
          subject: selectedSubject,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to inspect handwritten steps.');
      }

      setAiAnalysisResult(data.data);
      onAddXp(60);
      sound.playSuccess();
    } catch (err: any) {
      console.error('Scratchpad analysis error', err);
      setAnalysisError(err.message || 'Unable to analyze scratchpad canvas.');
      sound.playIncorrect();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `scratchpad-${selectedSubject}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    sound.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Interactive Digital Workspace
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Stylus & Mouse Enabled
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Math Scratchpad & Step Checker</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Freely derive equations, sketch geometric figures, and let Gemini verify your intermediate calculus and physics steps for sign errors.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadSnapshot}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Download PNG snapshot"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export</span>
          </button>
          <button
            disabled={isAnalyzing}
            onClick={handleAnalyzeWork}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzing ? 'Inspecting Steps...' : 'Analyze My Work'}</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Tool Selectors */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTool('pen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              tool === 'pen' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Pen</span>
          </button>

          <button
            onClick={() => setTool('highlighter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              tool === 'highlighter' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Highlighter</span>
          </button>

          <button
            onClick={() => setTool('eraser')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              tool === 'eraser' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Eraser</span>
          </button>
        </div>

        {/* Color Palette & Stroke Width */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {['#6366f1', '#38bdf8', '#34d399', '#f59e0b', '#f43f5e', '#ffffff'].map((color) => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                style={{ backgroundColor: color }}
                className={`w-5 h-5 rounded-full border-2 transition ${
                  strokeColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Size:</span>
            <input
              type="range"
              min={1}
              max={12}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
              className="w-16 accent-indigo-500"
            />
          </div>
        </div>

        {/* Grid Background Switcher & Clear Canvas */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setGridMode('cartesian')}
              className={`px-2.5 py-1 rounded-lg ${gridMode === 'cartesian' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
              title="Cartesian Coordinate Grid"
            >
              Grid
            </button>
            <button
              onClick={() => setGridMode('dots')}
              className={`px-2.5 py-1 rounded-lg ${gridMode === 'dots' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
              title="Dot Matrix"
            >
              Dots
            </button>
            <button
              onClick={() => setGridMode('blank')}
              className={`px-2.5 py-1 rounded-lg ${gridMode === 'blank' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
              title="Dark Canvas"
            >
              Plain
            </button>
          </div>

          <button
            onClick={handleClearCanvas}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
            title="Clear all drawings"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HTML5 Canvas Drawing Surface */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[420px] cursor-crosshair touch-none"
        />

        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] text-slate-400 font-mono">
          Canvas: Active • Touch/Stylus Ready
        </div>
      </div>

      {/* LaTeX & Scientific Symbol Quick Insert Drawer */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white">Scientific Formula & Voice Dictation Bar</h4>
          </div>
          <button
            onClick={toggleVoiceDictation}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              isDictating 
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse' 
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Dictate problem statement or formula via voice"
          >
            {isDictating ? <Mic className="w-3.5 h-3.5 text-rose-400" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{isDictating ? 'Speaking Equation...' : 'Voice Dictate'}</span>
          </button>
        </div>

        {/* Input box */}
        <input
          type="text"
          value={typedEquation}
          onChange={(e) => setTypedEquation(e.target.value)}
          placeholder="Type formula (e.g. ∫ x*e^(2x) dx), speak, or click scientific symbols below..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
        />

        {/* Quick symbol chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {latexSymbols.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleInsertSymbol(item.latex)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-indigo-300 hover:text-white transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Step Checker Result Modal / Card */}
      {aiAnalysisResult && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Intermediate Step Verification</h3>
                <p className="text-xs text-slate-400">{aiAnalysisResult.topic || 'Step-by-Step Validation'}</p>
              </div>
            </div>

            {onOpenTutorWithTopic && (
              <button
                onClick={() => onOpenTutorWithTopic(aiAnalysisResult.topic || 'Handwritten Scratchpad Verification')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ask Socratic Tutor</span>
              </button>
            )}
          </div>

          {/* Transcription */}
          {aiAnalysisResult.transcription && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="font-bold text-slate-400">Identified Expression / Steps: </span>
              <span className="font-mono text-indigo-300">{aiAnalysisResult.transcription}</span>
            </div>
          )}

          {/* Step by step review */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Step-by-Step Rigorous Check</h4>
            {aiAnalysisResult.stepByStepSolution?.map((s: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Step {s.stepNumber}: {s.stepTitle}</span>
                </div>
                <p className="text-xs text-slate-300">{s.explanation}</p>
                {s.equationOrCode && (
                  <div className="mt-1 px-2.5 py-1 rounded bg-slate-900 font-mono text-xs text-cyan-300 border border-slate-800">
                    {s.equationOrCode}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pitfalls & Conceptual insight */}
          {aiAnalysisResult.conceptualExplanation && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-indigo-300">Underlying Theorem / Theory:</span>
              <p className="leading-relaxed">{aiAnalysisResult.conceptualExplanation}</p>
            </div>
          )}

          {aiAnalysisResult.commonPitfalls && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200 space-y-1">
              <span className="font-bold text-rose-400">Common Sign / Algebraic Pitfalls to Beware:</span>
              <ul className="list-disc list-inside space-y-1 mt-1 text-slate-300">
                {aiAnalysisResult.commonPitfalls.map((p: string, idx: number) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {analysisError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{analysisError}</span>
        </div>
      )}
    </div>
  );
};
