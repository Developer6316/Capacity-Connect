import { useState, useEffect, useCallback, useRef } from 'react';

// Declare Web Speech API interfaces for TypeScript
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export interface VoiceCommandHandlers {
  onNavigateTab?: (tabId: string) => void;
  onSelectSubject?: (subjectId: any) => void;
  onOpenTutorWithTopic?: (topic: string) => void;
  onToggleMute?: () => void;
}

export function useVoiceAssistant(handlers?: VoiceCommandHandlers) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const item = event.results[i];
            if (item.isFinal) {
              finalTranscript += item[0].transcript;
            } else {
              currentInterim += item[0].transcript;
            }
          }

          setInterimTranscript(currentInterim);

          if (finalTranscript) {
            setTranscript(finalTranscript);
            executeVoiceCommand(finalTranscript.toLowerCase().trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[SpeechRecognition error]', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const executeVoiceCommand = (command: string) => {
    const h = handlersRef.current;
    if (!h) return;

    let matched = false;

    // Navigation triggers
    if (command.includes('mock exam') || command.includes('exam simulator') || command.includes('take exam')) {
      h.onNavigateTab?.('exam');
      setLastExecutedCommand('Opened AP Mock Exam Simulator');
      speakFeedback('Opening AP Mock Exam Simulator');
      matched = true;
    } else if (command.includes('scratchpad') || command.includes('math board') || command.includes('draw')) {
      h.onNavigateTab?.('scratchpad');
      setLastExecutedCommand('Opened Digital Math Scratchpad');
      speakFeedback('Opening Digital Math Scratchpad');
      matched = true;
    } else if (command.includes('flashcard') || command.includes('anki') || command.includes('spaced repetition')) {
      h.onNavigateTab?.('flashcards');
      setLastExecutedCommand('Opened Spaced Repetition Flashcards');
      speakFeedback('Opening Spaced Repetition Flashcard Trainer');
      matched = true;
    } else if (command.includes('knowledge graph') || command.includes('mind map') || command.includes('concept map')) {
      h.onNavigateTab?.('knowledge-graph');
      setLastExecutedCommand('Opened Interactive Knowledge Graph');
      speakFeedback('Opening Interdisciplinary Knowledge Graph');
      matched = true;
    } else if (command.includes('study guide') || command.includes('cheat sheet') || command.includes('digest')) {
      h.onNavigateTab?.('study-guide');
      setLastExecutedCommand('Opened Comprehensive Study Guide');
      speakFeedback('Opening High-Yield Study Guide & Digest');
      matched = true;
    } else if (command.includes('socratic') || command.includes('tutor') || command.includes('ask tutor')) {
      h.onNavigateTab?.('tutor');
      setLastExecutedCommand('Opened Socratic Tutor');
      speakFeedback('Opening AI Socratic Tutor');
      matched = true;
    } else if (command.includes('homework') || command.includes('solve problem') || command.includes('scan problem')) {
      h.onNavigateTab?.('homework');
      setLastExecutedCommand('Opened Homework & Diagram Solver');
      speakFeedback('Opening Visual Homework Solver');
      matched = true;
    } else if (command.includes('curation') || command.includes('recommendations')) {
      h.onNavigateTab?.('curation');
      setLastExecutedCommand('Opened AI Content Curation');
      speakFeedback('Opening Curated Resources');
      matched = true;
    } else if (command.includes('progress') || command.includes('analytics')) {
      h.onNavigateTab?.('analytics');
      setLastExecutedCommand('Opened Progress Analytics');
      speakFeedback('Opening Progress Analytics');
      matched = true;
    }

    // Subject switcher triggers
    if (command.includes('calculus') || command.includes('calc')) {
      h.onSelectSubject?.('ap-calc-bc');
      setLastExecutedCommand('Switched to AP Calculus BC');
      speakFeedback('Switched subject to AP Calculus BC');
      matched = true;
    } else if (command.includes('biology') || command.includes('bio')) {
      h.onSelectSubject?.('ap-bio');
      setLastExecutedCommand('Switched to AP Biology');
      speakFeedback('Switched subject to AP Biology');
      matched = true;
    } else if (command.includes('physics')) {
      h.onSelectSubject?.('ap-physics');
      setLastExecutedCommand('Switched to AP Physics C');
      speakFeedback('Switched subject to AP Physics C');
      matched = true;
    } else if (command.includes('chemistry') || command.includes('chem')) {
      h.onSelectSubject?.('ap-chem');
      setLastExecutedCommand('Switched to AP Chemistry');
      speakFeedback('Switched subject to AP Chemistry');
      matched = true;
    }

    if (!matched && command.length > 4) {
      setLastExecutedCommand(`Heard: "${command}"`);
    }
  };

  const speakFeedback = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        // ignore
      }
    }
  };

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Recognition already active or failed to start', e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {
        console.warn('Recognition failed to stop', e);
      }
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    lastExecutedCommand,
    isSpeaking,
    startListening,
    stopListening,
    toggleListening,
    speak: speakFeedback,
  };
}
