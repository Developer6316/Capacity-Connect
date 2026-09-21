import React, { useState, useRef, useEffect } from 'react';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  User, 
  Bot, 
  HelpCircle, 
  BookOpen, 
  Lightbulb, 
  RefreshCw,
  GraduationCap,
  MessageSquare,
  Mic,
  MicOff,
  Radio
} from 'lucide-react';
import { TutorMessage, SubjectId } from '../types';
import { sound } from '../utils/audioSynth';

interface SocraticTutorProps {
  selectedSubject: SubjectId;
  initialTopic?: string;
  onAddXp: (amount: number) => void;
}

const STARTER_PROMPTS_BY_SUBJECT: Record<SubjectId, string[]> = {
  'ap-calc-bc': [
    'How do I choose between the Disk and Washer methods when revolving around y = -1?',
    'Explain why the ratio test fails when L = 1 with a concrete counterexample.',
    'Walk me through Lagrange Error Bound on Taylor polynomials step-by-step.',
  ],
  'ap-bio': [
    'How does negative feedback maintain homeostatic glucose levels with insulin and glucagon?',
    'Why does the electron transport chain create a proton gradient instead of making ATP directly?',
    'What is the difference between inducible and repressible operons like Lac vs Trp?',
  ],
  'ap-physics': [
    'Explain the parallel axis theorem for moment of inertia with an intuitive analogy.',
    'How do I set up a free-body diagram for a car rounding a banked curve with friction?',
    'Derive the differential equation for an object falling with linear air drag.',
  ],
  'sat-prep': [
    'What is the fastest way to solve a circle equation in standard form on Digital SAT?',
    'How do I spot logical transition traps (e.g., however vs furthermore) in Reading?',
    'Explain the discriminant b² - 4ac rules for quadratic systems with one solution.',
  ],
  'ap-chem': [
    'How do I calculate buffer pH after adding a strong acid using the Henderson-Hasselbalch equation?',
    'Explain hybrid orbitals (sp, sp2, sp3) and their geometric angles.',
  ],
  'ap-ush': [
    'Compare the federalist vs anti-federalist arguments over the Bill of Rights.',
    'What were the economic impacts of the 1920s consumer revolution before the Great Depression?',
  ],
  'ap-cs-a': [
    'Explain polymorphism and method overriding versus overloading in Java.',
    'How does recursive binary search achieve O(log n) time complexity?',
  ]
};

export const SocraticTutor: React.FC<SocraticTutorProps> = ({
  selectedSubject,
  initialTopic,
  onAddXp,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      content: `Hello! I am your Socratic AI Academic Mentor for ${selectedSubject.replace('-', ' ').toUpperCase()}. Instead of just handing you solutions, I guide your thinking so you truly master the underlying principles for your exams. What topic or problem would you like to explore together?`,
      timestamp: 'Just now',
      suggestedPrompts: STARTER_PROMPTS_BY_SUBJECT[selectedSubject] || STARTER_PROMPTS_BY_SUBJECT['ap-calc-bc'],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [tutorPersona, setTutorPersona] = useState<'socratic' | 'peer' | 'ap_grader'>('socratic');
  const [explanationLevel, setExplanationLevel] = useState<'intuitive' | 'high_school' | 'college'>('high_school');
  const [enginePreference, setEnginePreference] = useState<'auto' | 'gemini'>('auto');
  const [activeEngine, setActiveEngine] = useState<string>('NVIDIA NIM / Gemini 3.8 Flash');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Fetch active AI provider status on mount
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data?.aiEngines?.activeProvider) {
          setActiveEngine(data.aiEngines.activeProvider);
        }
      })
      .catch(() => {});
  }, []);

  // Initialize and clean up Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputPrompt(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setSpeechError(`Voice input: ${event.error}. Please ensure microphone permission is granted.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or a Web Speech-compatible browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        setSpeechError(null);
        recognitionRef.current?.start();
      } catch (err: any) {
        console.warn('Error starting speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialTopic) {
      handleSendMessage(`Can you explain the core conceptual breakdown and intuition for: "${initialTopic}"?`);
    }
  }, [initialTopic]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = textToSend || inputPrompt;
    if (!messageContent.trim() || isLoading) return;

    const userMsg: TutorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: messageContent.trim(),
      timestamp: 'Just now',
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          subject: selectedSubject,
          tutorPersona,
          explanationLevel,
          enginePreference,
        }),
      });

      const data = await response.json();
      if (data.success && data.message) {
        if (data.engine) {
          setActiveEngine(data.engine);
        }
        const assistantMsg: TutorMessage = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          content: data.message,
          timestamp: 'Just now',
          suggestedPrompts: data.suggestedPrompts,
          engine: data.engine,
        };
        setMessages([...newHistory, assistantMsg]);
        onAddXp(30);
        sound.playCorrect(1);
      } else {
        alert('Tutor connection error: ' + (data.error || 'Please retry.'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error communicating with AI Tutor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert('Speech synthesis is not supported in this browser.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-black/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-mono uppercase tracking-wider">24/7 AI Mentor • {activeEngine}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Interactive Socratic Mentor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Engage in socratic dialogue with custom depth tuning, formula derivation guidance, exam grading perspective, and voice narration.
          </p>
        </div>

        {/* Persona and Depth Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Persona selector */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-1 flex text-xs">
            <button
              onClick={() => setTutorPersona('socratic')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                tutorPersona === 'socratic' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Socratic Guide
            </button>
            <button
              onClick={() => setTutorPersona('peer')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                tutorPersona === 'peer' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Peer Buddy
            </button>
            <button
              onClick={() => setTutorPersona('ap_grader')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                tutorPersona === 'ap_grader' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AP Exam Grader
            </button>
          </div>

          {/* Depth selector */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-1 flex text-xs">
            <button
              onClick={() => setExplanationLevel('intuitive')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                explanationLevel === 'intuitive' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Intuitive
            </button>
            <button
              onClick={() => setExplanationLevel('high_school')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                explanationLevel === 'high_school' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AP Standard
            </button>
            <button
              onClick={() => setExplanationLevel('college')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                explanationLevel === 'college' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rigorous Proof
            </button>
          </div>

          {/* Engine Model selector */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-1 flex text-xs">
            <button
              onClick={() => setEnginePreference('auto')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 ${
                enginePreference === 'auto' ? 'bg-emerald-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Prioritizes NVIDIA NIM with google/gemma-4-31b-it (enable_thinking), auto-failover to Gemini"
            >
              <span>⚡ NVIDIA NIM (Gemma 4 31B)</span>
            </button>
            <button
              onClick={() => setEnginePreference('gemini')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 ${
                enginePreference === 'gemini' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Uses Google Gemini 3.8 Flash directly"
            >
              <span>✨ Gemini 3.8 Flash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col h-[600px] shadow-xl overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {!isUser && (
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 pl-1">
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="flex items-center space-x-1 hover:text-cyan-300 transition-colors"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
                      </button>
                      {msg.engine && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                          ⚡ {msg.engine}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Suggested Follow-up Question Chips */}
                  {!isUser && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-indigo-500/50 transition-all"
                        >
                          💬 {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3 text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60 text-slate-400">
                <span>Formulating Socratic guidance...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2">
          {/* Active Speech Recognition Banner */}
          {isListening && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-pulse">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-rose-400 animate-spin" />
                <span className="font-semibold">Web Speech Active:</span>
                <span>Listening to your voice... Speak your question clearly</span>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-200 underline"
              >
                Done Speaking
              </button>
            </div>
          )}

          {speechError && (
            <div className="text-[11px] text-amber-400 px-2">
              {speechError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={isListening ? "Listening... your spoken words will appear here" : "Ask a question or speak your reasoning for feedback..."}
              className={`flex-1 bg-slate-800 border rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all ${
                isListening ? 'border-rose-500/60 ring-1 ring-rose-500/30' : 'border-slate-700 focus:border-indigo-500'
              }`}
            />

            {/* Web Speech API Microphone Toggle Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? "Stop voice listening" : "Ask question with voice (Web Speech API)"}
              className={`p-3 rounded-xl border transition-all flex items-center justify-center relative ${
                isListening 
                  ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" />
                </>
              ) : (
                <Mic className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Submit Question */}
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Inquire</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
