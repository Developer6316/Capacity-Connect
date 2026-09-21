import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, Compass, ChevronRight } from 'lucide-react';

interface GlobalVoiceBarProps {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  lastCommand: string | null;
  isSpeaking: boolean;
  onToggleListening: () => void;
  onSpeakSample: (text: string) => void;
}

export const GlobalVoiceBar: React.FC<GlobalVoiceBarProps> = ({
  isListening,
  isSupported,
  transcript,
  interimTranscript,
  lastCommand,
  isSpeaking,
  onToggleListening,
  onSpeakSample,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isSupported) {
    return null; // Gracefully hidden if browser doesn't have Web Speech API
  }

  return (
    <>
      {/* Mini Toggle Pill in Header / Floating */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleListening}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition border shadow-sm ${
            isListening
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse shadow-rose-500/20'
              : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title={isListening ? 'Voice Assistant Active — Click to pause listening' : 'Enable Voice Command Mode'}
        >
          {isListening ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Mic className="w-3.5 h-3.5 text-rose-400" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <MicOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Voice Mode</span>
            </>
          )}
        </button>

        {/* Quick Voice Command Cheat-Sheet Launcher */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-indigo-300 border border-slate-700/60 transition"
          title="View Voice Commands Guide"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Active Voice Feedback Toast when speaking or listening */}
      {(isListening || lastCommand || isSpeaking) && (
        <aside aria-label="Voice Command Status" className="fixed top-20 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl backdrop-blur-xl text-slate-100">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isListening ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                  {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Voice Command Active</h4>
                  <p className="text-[10px] text-slate-400">
                    {isSpeaking ? 'AI Speaking...' : isListening ? 'Say "Open exam", "Draw", "Switch to Biology"...' : 'Standby'}
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleListening}
                className="text-slate-400 hover:text-white p-1"
                title="Dismiss or pause"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Transcript Readout */}
            {(transcript || interimTranscript) && (
              <div className="mt-2.5 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <p className="text-slate-200 font-mono">
                  {transcript} <span className="text-indigo-400 italic">{interimTranscript}</span>
                </p>
              </div>
            )}

            {/* Last feedback status */}
            {lastCommand && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <ChevronRight className="w-3 h-3 shrink-0" />
                <span>{lastCommand}</span>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Voice Guide Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Voice Navigation & Dictation Guide</h3>
                  <p className="text-xs text-slate-400">Control the entire platform completely hands-free</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Navigation Commands</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-indigo-300">"Mock Exam" / "Take Test"</span>
                    <span className="text-slate-400">Opens AP Exam Simulator</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-indigo-300">"Scratchpad" / "Math Board"</span>
                    <span className="text-slate-400">Opens Digital Equation Canvas</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-indigo-300">"Flashcards" / "Anki"</span>
                    <span className="text-slate-400">Opens Spaced Repetition</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-indigo-300">"Mind Map" / "Knowledge Graph"</span>
                    <span className="text-slate-400">Opens Concept Cross-Links</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-indigo-300">"Study Guide" / "Digest"</span>
                    <span className="text-slate-400">Opens High-Yield Cheat Sheets</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-indigo-300">"Socratic Tutor"</span>
                    <span className="text-slate-400">Opens Dialogue AI Assistant</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Subject Switching Commands</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-indigo-300">"Calculus" / "AP Calc"</span>
                    <span className="text-slate-400">Selects AP Calculus BC</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-indigo-300">"Biology" / "AP Bio"</span>
                    <span className="text-slate-400">Selects AP Biology</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-indigo-300">"Physics"</span>
                    <span className="text-slate-400">Selects AP Physics C Mechanics</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-indigo-300">"Chemistry"</span>
                    <span className="text-slate-400">Selects AP Chemistry</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  onToggleListening();
                  setIsExpanded(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>{isListening ? 'Stop Listening' : 'Start Voice Listening Now'}</span>
              </button>
              <button
                onClick={() => onSpeakSample("Voice assistant is online and ready for commands.")}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>Test Audio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
