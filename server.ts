import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// High payload limit for handling image uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// -------------------------------------------------------------
// Directory Storage Configuration (Local File-System Persistence)
// -------------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), 'data');
const CREDENTIALS_FILE = path.join(DATA_DIR, 'credentials.json');
const STORE_FILE = path.join(DATA_DIR, 'portal_state.json');

function ensureDataStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log(`[Storage] Initialized data directory at ${DATA_DIR}`);
    }

    if (!fs.existsSync(CREDENTIALS_FILE)) {
      const defaultPinHash = bcrypt.hashSync('6316', 10);
      const defaultCredentials = [
        {
          id: 'admin-developer6316',
          name: 'Developer6316',
          username: 'Developer6316',
          email: 'developer6316@capacityconnect.local',
          pin: defaultPinHash,
          password: defaultPinHash,
          role: 'Admin',
          department: 'Platform Administration & System Governance',
          bio: 'Lead System Architect and Super Administrator.',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          loginMethod: 'pin',
          mfaEnabled: true,
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: 'Ready (PIN: 6316)',
        },
      ];
      fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(defaultCredentials, null, 2), 'utf-8');
      console.log(`[Storage] Created default credentials file with Admin Developer6316 (PIN: 6316)`);
    } else {
      // Ensure Developer6316 with PIN 6316 is always present and up-to-date
      try {
        const raw = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
        const creds = JSON.parse(raw);
        const existingIdx = creds.findIndex(
          (c: any) => c.name?.toLowerCase() === 'developer6316' || c.username?.toLowerCase() === 'developer6316'
        );
        if (existingIdx === -1) {
          const defaultPinHash = bcrypt.hashSync('6316', 10);
          creds.unshift({
            id: 'admin-developer6316',
            name: 'Developer6316',
            username: 'Developer6316',
            email: 'developer6316@capacityconnect.local',
            pin: defaultPinHash,
            password: defaultPinHash,
            role: 'Admin',
            department: 'Platform Administration & System Governance',
            bio: 'Lead System Architect and Super Administrator.',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            loginMethod: 'pin',
            mfaEnabled: true,
            createdAt: new Date().toISOString().split('T')[0],
            lastLogin: 'Ready (PIN: 6316)',
          });
          fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), 'utf-8');
        } else {
          // Always ensure PIN is 6316 and role is Admin
          let needsUpdate = false;
          if (creds[existingIdx].role !== 'Admin') {
            creds[existingIdx].role = 'Admin';
            needsUpdate = true;
          }
          // Only re-hash if it's not a bcrypt hash or if we need to force it to 6316
          const isBcryptHash = typeof creds[existingIdx].pin === 'string' && creds[existingIdx].pin.startsWith('$2');
          if (!isBcryptHash) {
            const defaultPinHash = bcrypt.hashSync('6316', 10);
            creds[existingIdx].pin = defaultPinHash;
            creds[existingIdx].password = defaultPinHash;
            needsUpdate = true;
          }
          
          if (needsUpdate) {
            fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), 'utf-8');
          }
        }
      } catch (err) {
        console.error('[Storage] Error reading credentials file:', err);
      }
    }
  } catch (err) {
    console.error('[Storage] Failed to initialize storage:', err);
  }
}

// Initialize directory storage on boot
ensureDataStorage();

// Read credentials from file
function readCredentials(): any[] {
  try {
    ensureDataStorage();
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[Storage] Failed to read credentials:', err);
  }
  return [];
}

// Write credentials to file
function writeCredentials(creds: any[]): boolean {
  try {
    ensureDataStorage();
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Storage] Failed to write credentials:', err);
    return false;
  }
}

// Read portal state from file
function readPortalState(): any | null {
  try {
    ensureDataStorage();
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[Storage] Failed to read portal state:', err);
  }
  return null;
}

// Write portal state to file
function writePortalState(state: any): boolean {
  try {
    ensureDataStorage();
    fs.writeFileSync(STORE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Storage] Failed to write portal state:', err);
    return false;
  }
}

// Lazy getter for Google GenAI client
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined in environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to call NVIDIA NIM (OpenAI-compatible chat completions endpoint)
// Default recommended model: google/gemma-4-31b-it (NVIDIA H100 with Thinking support)
const DEFAULT_NVIDIA_KEY = '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';

async function callNvidiaNIM(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string,
  temperature = 0.7,
  maxTokens = 2048,
  requestedModel?: string
): Promise<{ text: string; model: string }> {
  const apiKey = process.env.NVIDIA_API_KEY || DEFAULT_NVIDIA_KEY;
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY is not configured in environment.');
  }

  const model = requestedModel || process.env.NVIDIA_MODEL || 'google/gemma-4-31b-it';
  const formattedMessages: Array<{ role: string; content: string }> = [];

  if (systemPrompt) {
    formattedMessages.push({ role: 'system', content: systemPrompt });
  }

  for (const m of messages) {
    formattedMessages.push({
      role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content || '',
    });
  }

  const controller = new AbortController();
  // 18-second timeout for NVIDIA NIM inference/cold-starts before graceful failover
  const timeoutId = setTimeout(() => controller.abort(), 18000);

  try {
    const requestBody: any = {
      model,
      messages: formattedMessages,
      temperature,
      max_tokens: maxTokens,
    };

    if (model.includes('gemma-4') || model.includes('thinking')) {
      requestBody.chat_template_kwargs = {
        enable_thinking: true,
      };
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify(requestBody),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`NVIDIA NIM API error [${response.status}]: ${errText}`);
    }

    const data: any = await response.json();
    const replyText = data.choices?.[0]?.message?.content || '';
    return {
      text: replyText,
      model: `NVIDIA NIM (${model})`,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// 1. Health check & AI Provider status
app.get('/api/health', (req: Request, res: Response) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const activeNvidiaKey = process.env.NVIDIA_API_KEY || DEFAULT_NVIDIA_KEY;
  const hasNvidia = Boolean(activeNvidiaKey);
  const nvidiaModel = process.env.NVIDIA_MODEL || 'google/gemma-4-31b-it';

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Capacity Connect Core API',
    aiEngines: {
      gemini: {
        available: hasGemini,
        model: 'gemini-3.8-flash',
      },
      nvidia: {
        available: hasNvidia,
        model: nvidiaModel,
        endpoint: 'https://integrate.api.nvidia.com/v1',
      },
      activeProvider: hasNvidia ? `NVIDIA NIM (${nvidiaModel})` : hasGemini ? 'Google Gemini (gemini-3.8-flash)' : 'Fallback Rules Engine',
    },
    hasApiKey: hasGemini || hasNvidia,
  });
});

// -------------------------------------------------------------
// Local Directory Storage API Endpoints
// -------------------------------------------------------------

// Directory status & storage diagnostics
app.get('/api/data/status', (req: Request, res: Response) => {
  ensureDataStorage();
  const credentials = readCredentials();
  const portalState = readPortalState();
  const credsStat = fs.existsSync(CREDENTIALS_FILE) ? fs.statSync(CREDENTIALS_FILE) : null;
  const storeStat = fs.existsSync(STORE_FILE) ? fs.statSync(STORE_FILE) : null;

  res.json({
    success: true,
    dataDirectory: DATA_DIR,
    credentialsFile: CREDENTIALS_FILE,
    portalStateFile: STORE_FILE,
    credentialsCount: credentials.length,
    credentialsSizeKb: credsStat ? (credsStat.size / 1024).toFixed(2) : 0,
    portalStateSizeKb: storeStat ? (storeStat.size / 1024).toFixed(2) : 0,
    adminAccount: {
      name: 'Developer6316',
      pin: '6316',
      role: 'Admin',
      status: 'Configured and active',
    },
    isStoreInitialized: Boolean(portalState),
  });
});

// Get all users from local directory credentials file
app.get('/api/data/users', (req: Request, res: Response) => {
  const credentials = readCredentials();
  // Return sanitized user profiles
  const users = credentials.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    bio: u.bio,
    avatarUrl: u.avatarUrl,
    loginMethod: u.loginMethod,
    mfaEnabled: u.mfaEnabled,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin,
  }));
  res.json({ success: true, users });
});

// Direct Login & PIN verification from local credentials directory
app.post('/api/data/login', (req: Request, res: Response) => {
  try {
    const { identifier, pin, password } = req.body;
    const inputIdentifier = (identifier || '').trim();
    const inputPin = (pin || password || '').trim();

    const credentials = readCredentials();

    // Standard credential matching against local directory
    const matchedUser = credentials.find((u) => {
      const matchEmail = u.email?.toLowerCase() === inputIdentifier.toLowerCase();
      const matchName = u.name?.toLowerCase() === inputIdentifier.toLowerCase();
      const matchUser = u.username?.toLowerCase() === inputIdentifier.toLowerCase();
      
      const isIdentifierMatch = (!inputIdentifier && inputPin === '6316' && u.name === 'Developer6316') || matchEmail || matchName || matchUser;
      
      if (!isIdentifierMatch) return false;

      // Ensure we verify against the hashed password/pin
      const isBcryptPassword = typeof u.password === 'string' && u.password.startsWith('$2');
      const isBcryptPin = typeof u.pin === 'string' && u.pin.startsWith('$2');
      
      const matchPassword = isBcryptPassword ? bcrypt.compareSync(inputPin, u.password) : u.password === inputPin;
      const matchPin = isBcryptPin ? bcrypt.compareSync(inputPin, u.pin) : u.pin === inputPin;
      
      return matchPassword || matchPin;
    });

    if (matchedUser) {
      matchedUser.lastLogin = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      writeCredentials(credentials);

      return res.json({
        success: true,
        message: `Welcome back, ${matchedUser.name}!`,
        user: {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          department: matchedUser.department,
          bio: matchedUser.bio,
          avatarUrl: matchedUser.avatarUrl,
          loginMethod: matchedUser.loginMethod,
          mfaEnabled: matchedUser.mfaEnabled,
          createdAt: matchedUser.createdAt,
          lastLogin: matchedUser.lastLogin,
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid credentials. For Admin access, use Name: Developer6316 with PIN: 6316.',
    });
  } catch (err: any) {
    console.error('[Storage Login Error]', err);
    res.status(500).json({ success: false, error: 'Internal login error' });
  }
});

// Register new user and save to local directory credentials file
app.post('/api/data/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, pin, role = 'Trainee', department = 'General Engineering' } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }

    const credentials = readCredentials();
    const existing = credentials.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());

    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }
    
    const rawPassword = password || pin || '1234';
    const rawPin = pin || '1234';

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      username: name.trim().toLowerCase().replace(/\s+/g, ''),
      email: email.trim(),
      password: bcrypt.hashSync(rawPassword, 10),
      pin: bcrypt.hashSync(rawPin, 10),
      role,
      department,
      bio: 'Enrolled organizational learner.',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      loginMethod: 'password',
      mfaEnabled: false,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Just registered',
    };

    credentials.push(newUser);
    writeCredentials(credentials);

    res.json({
      success: true,
      message: 'Account created and saved to local directory storage!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        bio: newUser.bio,
        avatarUrl: newUser.avatarUrl,
        loginMethod: newUser.loginMethod,
        mfaEnabled: newUser.mfaEnabled,
        createdAt: newUser.createdAt,
        lastLogin: newUser.lastLogin,
      },
    });
  } catch (err: any) {
    console.error('[Storage Register Error]', err);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// Retrieve persistent portal state (courses, articles, competencies, settings)
app.get('/api/data/store', (req: Request, res: Response) => {
  const portalState = readPortalState();
  if (portalState) {
    res.json({ success: true, state: portalState });
  } else {
    res.json({ success: false, message: 'No stored state file found. Using defaults.' });
  }
});

// Save persistent portal state to local directory (portal_state.json)
app.post('/api/data/store', (req: Request, res: Response) => {
  try {
    const state = req.body;
    const ok = writePortalState({
      ...state,
      lastSaved: new Date().toISOString(),
    });
    if (ok) {
      res.json({ success: true, message: 'Portal state saved to data/portal_state.json' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to write portal state file' });
    }
  } catch (err: any) {
    console.error('[Storage Save Error]', err);
    res.status(500).json({ success: false, error: 'Failed to save portal state' });
  }
});

// 2. Multimodal Homework & Visual Problem Analyzer (model: gemini-3.1-pro-preview)
app.post('/api/gemini/analyze-homework', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', studentPrompt, subject } = req.body;

    if (!imageBase64 && !studentPrompt) {
      return res.status(400).json({ error: 'Please provide an image or problem prompt.' });
    }

    const ai = getGenAIClient();
    const systemPrompt = `You are an elite High School STEM & Humanities Socratic Master Tutor.
A student has uploaded a picture of their textbook problem, handwritten equation, exam question, or graph for the subject: "${subject || 'General High School Studies'}".
Analyze the image or problem thoroughly.

Your output MUST be valid JSON conforming exactly to this structure:
{
  "subject": "Identified Subject / Course",
  "topic": "Specific Topic (e.g., Integration by Parts, Stoichiometry, Newton's 2nd Law)",
  "transcription": "Verbatim transcript of the problem from the image or text",
  "stepByStepSolution": [
    {
      "stepNumber": 1,
      "stepTitle": "Short title of step",
      "explanation": "Clear, intuitive explanation of the logical step",
      "equationOrCode": "Formula or mathematical representation if applicable"
    }
  ],
  "conceptualExplanation": "Deep-dive explanation of the underlying theory, why this method works, and intuitive mental model",
  "commonPitfalls": [
    "Common student mistake 1 to beware of",
    "Common student mistake 2"
  ],
  "keyFormulas": [
    "Formula 1",
    "Formula 2"
  ],
  "practiceFollowUp": {
    "question": "A closely related follow-up challenge problem to test their newfound understanding",
    "answerHint": "Brief hint to verify their independent work"
  }
}

Student Notes / Specific Question: "${studentPrompt || 'Please explain how to solve this step-by-step and provide conceptual insight.'}"
Return ONLY the raw JSON object, without markdown fences or additional text outside the JSON.`;

    const contents: any[] = [];
    const parts: any[] = [];

    if (imageBase64) {
      // Remove data URL prefix if present
      const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    parts.push({
      text: systemPrompt,
    });

    contents.push({ parts });

    // Using model gemini-3.1-pro-preview as mandated, with fallback to gemini-3.8-flash on 503/demand spikes
    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
    } catch (primaryErr: any) {
      console.warn('gemini-3.1-pro-preview unavailable, trying gemini-3.8-flash:', primaryErr.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
    }

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Fallback clean extraction if fences were wrapped
      const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error analyzing homework:', err);
    res.status(500).json({
      error: 'Failed to analyze homework image',
      details: err?.message || String(err),
    });
  }
});

// 3. Educational Diagram & Visual Concept Generator (model: gemini-3.1-flash-image-preview)
app.post('/api/gemini/generate-diagram', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '4:3', referenceImageBase64, mimeType = 'image/png' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    const ai = getGenAIClient();
    const parts: any[] = [];

    // Optional reference image for image-editing workflows
    if (referenceImageBase64) {
      const cleanBase64 = referenceImageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: cleanBase64,
        },
      });
    }

    const enhancedPrompt = `High-resolution educational textbook diagram, high contrast, clean vector style, annotated clearly for high school science and math. Topic: ${prompt}. Clean white or dark slate background, professional academic illustration.`;
    parts.push({ text: enhancedPrompt });

    // Mandated model: gemini-3.1-flash-image-preview
    // With fallback to gemini-3.1-flash-image if preview alias is redirected
    let generatedImageData: string | null = null;
    let modelUsed = 'gemini-3.1-flash-image-preview';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content?.parts || []) {
          if (part.inlineData?.data) {
            generatedImageData = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (primaryErr: any) {
      console.warn('Primary image model encountered an issue, trying gemini-3.1-flash-image:', primaryErr.message);
      modelUsed = 'gemini-3.1-flash-image';
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      const candidates = fallbackResponse.candidates;
      if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content?.parts || []) {
          if (part.inlineData?.data) {
            generatedImageData = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    }

    res.json({
      success: true,
      model: modelUsed,
      imageUrl: generatedImageData,
      prompt,
      caption: `Visual Educational Schematic for "${prompt}"`,
    });
  } catch (err: any) {
    console.error('Error generating diagram:', err);
    res.status(500).json({
      error: 'Failed to generate visual concept diagram',
      details: err?.message || String(err),
    });
  }
});

// 4. Personalized AI Study Path Generator (model: gemini-3.8-flash)
app.post('/api/gemini/study-path', async (req: Request, res: Response) => {
  try {
    const { subject, gradeLevel, targetExam, targetScore, weakAreas, availableHoursPerWeek } = req.body;

    const ai = getGenAIClient();
    const prompt = `You are an expert high school academic advisor.
Create a personalized, adaptive curriculum study roadmap for a student with the following profile:
- Subject: ${subject || 'AP Calculus BC'}
- Current Grade: ${gradeLevel || 'Grade 11'}
- Target Exam: ${targetExam || 'AP Exam'}
- Target Score: ${targetScore || 'Score 5 / 1550+'}
- Identified Weak Spots: ${weakAreas || 'Integration techniques and series convergence'}
- Time Commitment: ${availableHoursPerWeek || 5} hours per week

Generate a structured JSON response with exactly:
{
  "title": "Custom Study Path Name",
  "subject": "${subject || 'ap-calc-bc'}",
  "gradeLevel": "${gradeLevel || 'Grade 11'}",
  "targetExam": "${targetExam || 'AP Exam'}",
  "targetScore": "${targetScore || 'Score 5'}",
  "totalUnits": 6,
  "weeklyGoalHours": ${Number(availableHoursPerWeek) || 5},
  "aiNotes": "Executive summary of diagnostic strengths, pacing strategy, and high-yield topics to prioritize.",
  "nodes": [
    {
      "id": "node-gen-1",
      "title": "Module Title",
      "subject": "${subject || 'ap-calc-bc'}",
      "unit": "Unit 1",
      "description": "Key mastery goals and problem types",
      "status": "available",
      "masteryPercent": 0,
      "estimatedMinutes": 60,
      "xpReward": 250,
      "type": "concept",
      "keyConcepts": ["Concept A", "Concept B", "Concept C"]
    }
  ]
}

Ensure 5 to 6 balanced milestone nodes spanning from foundation diagnostics to deep-dive practice and a capstone boss exam. Return ONLY valid raw JSON.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });
    } catch (primaryErr: any) {
      console.warn('gemini-3.8-flash unavailable for path generation, falling back to gemini-3.1-flash-lite:', primaryErr.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });
    }

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    res.json({ success: true, path: parsedData });
  } catch (err: any) {
    console.error('Error creating study path:', err);
    res.status(500).json({
      error: 'Failed to generate personalized study path',
      details: err?.message || String(err),
    });
  }
});

// 5. Interactive Socratic Tutor Chat (Dual Engine: NVIDIA NIM meta/llama-3.3-70b-instruct + Google Gemini 3.8 Flash)
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  try {
    const { messages, subject, tutorPersona = 'socratic', explanationLevel = 'high_school', enginePreference, customModel } = req.body;

    let personaInstruction = 'You are a warm, highly encouraging, and rigorous Socratic High School & Capacity Building Academic Mentor.';
    if (tutorPersona === 'peer') {
      personaInstruction = 'You are a brilliant study-buddy peer who explains things with lively analogies, practical tricks, and clear breakdowns.';
    } else if (tutorPersona === 'ap_grader') {
      personaInstruction = 'You are an official Institutional Evaluation Lead. You focus on precise technical vocabulary, scoring rubrics, and comprehensive accuracy.';
    }

    let depthInstruction = 'Tune your explanation for high school AP/Honors and institutional capacity level.';
    if (explanationLevel === 'intuitive') {
      depthInstruction = 'Explain intuitively using vivid everyday real-world analogies and minimal jargon first, then introduce formal principles.';
    } else if (explanationLevel === 'college') {
      depthInstruction = 'Provide rigorous mathematical proofs and professional-level formal derivations.';
    }

    const systemInstruction = `${personaInstruction}
Subject Context: ${subject || 'General Studies & Technical Capacity'}.
${depthInstruction}

Important Pedagogical Rules:
- Guide the trainee with thoughtful Socratic questions and step-by-step logic rather than merely dumping the answer immediately.
- If formulas, code snippets, or equations are relevant, format them cleanly with clear explanations.
- End your response with 2 to 3 suggested quick follow-up questions the trainee might ask next. Format suggestions at the very bottom as:
SUGGESTED:
- Question 1
- Question 2
- Question 3`;

    let replyText = '';
    let engineUsed = 'Default';
    const activeNvidiaKey = process.env.NVIDIA_API_KEY || DEFAULT_NVIDIA_KEY;

    // Strategy 1: Prioritize NVIDIA NIM (google/gemma-4-31b-it with thinking) unless client explicitly requested Gemini
    if (activeNvidiaKey && enginePreference !== 'gemini') {
      try {
        const nimMessages = (messages || []).map((m: any) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content || '',
        }));
        if (nimMessages.length === 0) {
          nimMessages.push({ role: 'user', content: 'Hello! I need help studying.' });
        }

        const modelToUse = customModel || process.env.NVIDIA_MODEL || 'google/gemma-4-31b-it';
        const nimResult = await callNvidiaNIM(nimMessages, systemInstruction, 0.7, 2048, modelToUse);
        replyText = nimResult.text;
        engineUsed = nimResult.model;
      } catch (nvidiaErr: any) {
        console.warn('[AI Tutor] NVIDIA NIM failed or timed out, gracefully falling back to Gemini 3.8:', nvidiaErr.message);
      }
    }

    // Strategy 2: If replyText is still empty or Gemini was requested, run Google Gemini
    if (!replyText) {
      const ai = getGenAIClient();
      const contents: any[] = (messages || []).map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: 'Hello! I need help studying.' }] });
      }

      let geminiResponse;
      try {
        geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.4,
          },
        });
        engineUsed = 'Google Gemini (gemini-3.8-flash)';
      } catch (primaryErr: any) {
        console.warn('gemini-3.8-flash unavailable for tutor, trying gemini-3.1-flash-lite:', primaryErr.message);
        try {
          geminiResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction,
              temperature: 0.4,
            },
          });
          engineUsed = 'Google Gemini (gemini-3.1-flash-lite)';
        } catch (secErr: any) {
          console.warn('Gemini fallback failed:', secErr.message);
          throw secErr;
        }
      }

      if (!replyText && geminiResponse) {
        replyText = geminiResponse.text || '';
      }
    }

    // Parse out suggested follow-up questions if provided
    let cleanReply = replyText || 'I am ready to help you break down this concept. What specific part would you like to explore first?';
    const suggestedPrompts: string[] = [];
    if (replyText.includes('SUGGESTED:')) {
      const parts = replyText.split('SUGGESTED:');
      cleanReply = parts[0].trim();
      const suggestedLines = parts[1].split('\n').map((s: string) => s.replace(/^[-*•\d.]+\s*/, '').trim()).filter(Boolean);
      suggestedPrompts.push(...suggestedLines.slice(0, 3));
    }

    res.json({
      success: true,
      message: cleanReply,
      engine: engineUsed,
      suggestedPrompts: suggestedPrompts.length > 0 ? suggestedPrompts : [
        'Can you give me an example problem to test this?',
        'Why does this principle work conceptually?',
        'What is the most common pitfall on this topic?'
      ],
    });
  } catch (err: any) {
    console.error('Error in tutor chat:', err);
    res.status(500).json({
      error: 'Failed to communicate with AI Tutor',
      details: err?.message || String(err),
    });
  }
});

// Fallback curriculum questions generator when Gemini encounters temporary high demand (503/429)
function getFallbackQuestions(subject: string = '', topic: string = '', count: number = 5, difficulty: string = 'medium') {
  const normSub = String(subject).toLowerCase();
  
  const calcQuestions = [
    {
      id: 'fb-calc-1',
      question: 'Evaluate the integral ∫ x · e^(2x) dx using integration by parts.',
      options: [
        '(1/2)x·e^(2x) - (1/4)e^(2x) + C',
        '(1/2)x·e^(2x) + (1/4)e^(2x) + C',
        'x·e^(2x) - e^(2x) + C',
        '(1/4)x·e^(2x) - (1/2)e^(2x) + C'
      ],
      correctAnswer: 0,
      explanation: 'Let u = x (so du = dx) and dv = e^(2x) dx (so v = (1/2)e^(2x)). ∫ u dv = u·v - ∫ v du = (1/2)x·e^(2x) - ∫ (1/2)e^(2x) dx = (1/2)x·e^(2x) - (1/4)e^(2x) + C.',
      hint: 'Choose u = x according to LIATE hierarchy, and integrate e^(2x).',
      conceptTag: 'Integration by Parts',
      difficulty: 'medium',
      xp: 50
    },
    {
      id: 'fb-calc-2',
      question: 'What is the sum of the infinite geometric series Σ (2/3)^n from n=1 to ∞?',
      options: ['2', '3', '1/3', 'Diverges'],
      correctAnswer: 0,
      explanation: 'First term a = 2/3 (for n=1), common ratio r = 2/3. Sum S = a / (1 - r) = (2/3) / (1 - 2/3) = (2/3) / (1/3) = 2.',
      hint: 'Notice the summation index starts at n=1, so the first term is (2/3)¹ = 2/3.',
      conceptTag: 'Geometric Series',
      difficulty: 'medium',
      xp: 45
    },
    {
      id: 'fb-calc-3',
      question: 'Which of the following is the coefficient of x⁴ in the Maclaurin series for f(x) = cos(x)?',
      options: ['1/24', '-1/24', '1/6', '-1/6'],
      correctAnswer: 0,
      explanation: 'The Maclaurin series for cos(x) is Σ (-1)^n x^(2n) / (2n)!. For the x⁴ term, n=2, so the coefficient is (-1)² / 4! = 1/24.',
      hint: 'Recall cos(x) = 1 - x²/2! + x⁴/4! - ...',
      conceptTag: 'Taylor / Maclaurin Series',
      difficulty: 'medium',
      xp: 50
    },
    {
      id: 'fb-calc-4',
      question: 'A curve is defined parametrically by x(t) = 3cos(t) and y(t) = 3sin(t). What is dy/dx at t = π/4?',
      options: ['-1', '1', '0', 'Undefined'],
      correctAnswer: 0,
      explanation: 'dy/dx = (dy/dt) / (dx/dt) = (3cos(t)) / (-3sin(t)) = -cot(t). At t = π/4, -cot(π/4) = -1.',
      hint: 'Compute dy/dt and dx/dt separately, then divide (dy/dt)/(dx/dt).',
      conceptTag: 'Parametric Derivatives',
      difficulty: 'easy',
      xp: 40
    },
    {
      id: 'fb-calc-5',
      question: 'What is the carrying capacity K of the population described by dP/dt = 0.04P(1 - P/1200)?',
      options: ['1200', '0.04', '30,000', '48'],
      correctAnswer: 0,
      explanation: 'The standard logistic differential equation is dP/dt = rP(1 - P/K). By inspection, K = 1200.',
      hint: 'The population growth rate dP/dt goes to zero when P reaches K.',
      conceptTag: 'Logistic Growth',
      difficulty: 'easy',
      xp: 40
    }
  ];

  const physicsQuestions = [
    {
      id: 'fb-phys-1',
      question: 'A solid disk (I = 1/2 M R²) rolls without slipping down an incline. What fraction of its total kinetic energy is rotational?',
      options: ['1/3', '2/3', '1/2', '1/4'],
      correctAnswer: 0,
      explanation: 'Translational KE = 1/2 M v². Rotational KE = 1/2 I ω² = 1/2 (1/2 M R²)(v/R)² = 1/4 M v². Total KE = 3/4 M v². Ratio = (1/4)/(3/4) = 1/3.',
      hint: 'Substitute ω = v/R and I = 1/2 M R² into 1/2 I ω².',
      conceptTag: 'Rotational Dynamics',
      difficulty: 'medium',
      xp: 55
    },
    {
      id: 'fb-phys-2',
      question: 'If the length of a simple pendulum is quadrupled, its period of oscillation T will:',
      options: ['Double', 'Halve', 'Quadruple', 'Remain unchanged'],
      correctAnswer: 0,
      explanation: 'The period of a simple pendulum is T = 2π√(L/g). Quadrupling L multiplies T by √4 = 2.',
      hint: 'The period scales with the square root of length L.',
      conceptTag: 'Simple Harmonic Motion',
      difficulty: 'easy',
      xp: 40
    },
    {
      id: 'fb-phys-3',
      question: 'According to Gauss\'s Law, the net electric flux through a closed surface enclosing a dipole (+q and -q) is:',
      options: ['0', '2q / ε₀', 'q / ε₀', '-q / ε₀'],
      correctAnswer: 0,
      explanation: 'Gauss\'s Law states Φ = Q_enclosed / ε₀. For a dipole, Q_enclosed = +q + (-q) = 0, so net flux is zero.',
      hint: 'Sum the net enclosed charge inside the closed surface.',
      conceptTag: 'Gauss\'s Law',
      difficulty: 'easy',
      xp: 45
    },
    {
      id: 'fb-phys-4',
      question: 'A 2 kg block slides 5 m across a surface with friction coefficient μk = 0.3. Taking g = 10 m/s², work done by friction is:',
      options: ['-30 J', '+30 J', '-60 J', '-15 J'],
      correctAnswer: 0,
      explanation: 'Normal force N = mg = 20 N. Friction fk = μk N = 6 N. Work W = -fk · d = -(6 N)(5 m) = -30 J.',
      hint: 'Friction opposes displacement, doing negative work.',
      conceptTag: 'Work-Energy Theorem',
      difficulty: 'medium',
      xp: 50
    },
    {
      id: 'fb-phys-5',
      question: 'In an ideal LC circuit, when the capacitor is completely discharged, where is the energy stored?',
      options: ['Entirely in the magnetic field of the inductor', 'Entirely in the electric field of the capacitor', 'Dissipated as heat', 'Zero total energy'],
      correctAnswer: 0,
      explanation: 'Total energy U = (1/2)Q²/C + (1/2)L I². When Q = 0, all energy resides in the inductor\'s magnetic field.',
      hint: 'Energy sloshes between electric and magnetic fields.',
      conceptTag: 'LC Oscillations',
      difficulty: 'medium',
      xp: 50
    }
  ];

  const bioQuestions = [
    {
      id: 'fb-bio-1',
      question: 'During cellular respiration, where do protons (H⁺) accumulate to form an electrochemical gradient?',
      options: ['Mitochondrial intermembrane space', 'Mitochondrial matrix', 'Outer membrane surface', 'Cytosol'],
      correctAnswer: 0,
      explanation: 'Complexes I, III, and IV pump protons from the matrix into the intermembrane space, powering ATP synthase.',
      hint: 'Protons are pumped outward across the inner membrane.',
      conceptTag: 'Chemiosmosis',
      difficulty: 'medium',
      xp: 50
    },
    {
      id: 'fb-bio-2',
      question: 'Which enzyme seals nicks in the phosphodiester backbone of the lagging DNA strand during replication?',
      options: ['DNA Ligase', 'DNA Polymerase I', 'Helicase', 'Topoisomerase'],
      correctAnswer: 0,
      explanation: 'DNA Ligase forms phosphodiester bonds between Okazaki fragments.',
      hint: 'Ligase connects fragments together.',
      conceptTag: 'DNA Replication',
      difficulty: 'easy',
      xp: 40
    },
    {
      id: 'fb-bio-3',
      question: 'In a population in Hardy-Weinberg equilibrium with 16% recessive phenotype (q² = 0.16), the frequency of heterozygotes (2pq) is:',
      options: ['0.48', '0.36', '0.84', '0.24'],
      correctAnswer: 0,
      explanation: 'q = √0.16 = 0.4. p = 1 - 0.4 = 0.6. Heterozygotes 2pq = 2(0.6)(0.4) = 0.48.',
      hint: 'Solve for q first, then calculate 2 * p * q.',
      conceptTag: 'Hardy-Weinberg Equilibrium',
      difficulty: 'medium',
      xp: 55
    },
    {
      id: 'fb-bio-4',
      question: 'What type of cell signaling involves local diffusion to nearby target cells?',
      options: ['Paracrine signaling', 'Endocrine signaling', 'Autocrine signaling', 'Juxtacrine signaling'],
      correctAnswer: 0,
      explanation: 'Paracrine signaling acts on adjacent local cells.',
      hint: 'Contrast with systemic endocrine hormones.',
      conceptTag: 'Cell Signaling',
      difficulty: 'easy',
      xp: 40
    },
    {
      id: 'fb-bio-5',
      question: 'What is the primary function of the Cas9 enzyme in CRISPR biotechnology?',
      options: ['An RNA-guided endonuclease that cleaves double-stranded DNA', 'A reverse transcriptase', 'A DNA polymerase', 'An RNA ligase'],
      correctAnswer: 0,
      explanation: 'Cas9 is targeted by guide RNA to create precise double-strand breaks at specific DNA sequences.',
      hint: 'Cas9 functions as RNA-guided molecular scissors.',
      conceptTag: 'CRISPR Biotechnology',
      difficulty: 'medium',
      xp: 55
    }
  ];

  const chemQuestions = [
    {
      id: 'fb-chem-1',
      question: 'For an exothermic reaction at equilibrium (ΔH < 0), how does increasing the temperature affect the equilibrium constant K?',
      options: ['K decreases', 'K increases', 'K remains unchanged', 'K oscillates'],
      correctAnswer: 0,
      explanation: 'Heat is a product in exothermic reactions. Increasing temperature shifts equilibrium toward reactants, reducing K.',
      hint: 'Le Chatelier: adding heat shifts away from products.',
      conceptTag: 'Equilibrium & Temperature',
      difficulty: 'medium',
      xp: 50
    },
    {
      id: 'fb-chem-2',
      question: 'What is the pH of an equimolar buffer solution of CH₃COOH and CH₃COONa (pKa = 4.74)?',
      options: ['4.74', '5.74', '3.74', '7.00'],
      correctAnswer: 0,
      explanation: 'When [acid] = [conjugate base], log([base]/[acid]) = 0, so pH = pKa = 4.74.',
      hint: 'Henderson-Hasselbalch equation: pH = pKa + log([A⁻]/[HA]).',
      conceptTag: 'Buffer Solutions',
      difficulty: 'easy',
      xp: 40
    },
    {
      id: 'fb-chem-3',
      question: 'A galvanic cell has standard half-cell potentials: Zn²⁺/Zn = -0.76 V and Cu²⁺/Cu = +0.34 V. What is standard cell potential E°cell?',
      options: ['+1.10 V', '-0.42 V', '+0.42 V', '-1.10 V'],
      correctAnswer: 0,
      explanation: 'E°cell = E°cathode - E°anode = +0.34 V - (-0.76 V) = +1.10 V.',
      hint: 'E°cell = E°cathode - E°anode.',
      conceptTag: 'Electrochemistry',
      difficulty: 'medium',
      xp: 50
    },
    {
      id: 'fb-chem-4',
      question: 'If doubling the concentration of reactant A quadruples the initial rate, what is the reaction order with respect to A?',
      options: ['Second order (2)', 'First order (1)', 'Zero order (0)', 'Third order (3)'],
      correctAnswer: 0,
      explanation: 'Rate ∝ [A]^m. 4 = 2^m ⇒ m = 2.',
      hint: '2 squared equals 4.',
      conceptTag: 'Kinetics',
      difficulty: 'easy',
      xp: 40
    },
    {
      id: 'fb-chem-5',
      question: 'What is the molecular geometry and hybridization of sulfur tetrafluoride (SF₄)?',
      options: ['See-saw geometry, sp³d hybridization', 'Square planar, sp³d²', 'Tetrahedral, sp³', 'Trigonal bipyramidal, sp³d'],
      correctAnswer: 0,
      explanation: 'SF₄ has 4 bonding pairs and 1 lone pair on S (steric number 5 → sp³d, see-saw shape).',
      hint: '5 electron domains with one lone pair.',
      conceptTag: 'VSEPR Theory',
      difficulty: 'medium',
      xp: 55
    }
  ];

  let bank = calcQuestions;
  if (normSub.includes('phys')) bank = physicsQuestions;
  else if (normSub.includes('bio')) bank = bioQuestions;
  else if (normSub.includes('chem')) bank = chemQuestions;

  return bank.slice(0, Math.min(count, bank.length));
}

// 6. Dynamic Quiz Generator for Gamified Arena (with dual model attempt & verified curriculum fallback)
app.post('/api/gemini/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic, subject, count = 5, difficulty = 'medium' } = req.body;

    const ai = getGenAIClient();
    const prompt = `Generate a high-stakes, engaging high school exam practice quiz for:
Subject: ${subject || 'AP Calculus BC'}
Topic: ${topic || 'Integration by Parts'}
Difficulty: ${difficulty}
Count: ${count} questions.

Format the response strictly as valid JSON array:
[
  {
    "id": "q-1",
    "question": "Clear problem question text with math expressions written clearly",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0, // integer index 0, 1, 2, or 3
    "explanation": "Detailed step-by-step reason why this choice is correct and why other choices fail",
    "hint": "Gentle Socratic hint that does not reveal the answer directly",
    "conceptTag": "Specific subconcept (e.g. LIATE Rule)",
    "difficulty": "${difficulty}",
    "xp": 50
  }
]
Return ONLY raw JSON array.`;

    let questions: any[] | null = null;
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const rawText = response.text || '[]';
        try {
          questions = JSON.parse(rawText);
        } catch {
          const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          questions = JSON.parse(cleanJson);
        }

        if (Array.isArray(questions) && questions.length > 0) {
          break;
        }
      } catch (geminiErr: any) {
        console.warn(`Model ${model} unavailable for quiz generation (${geminiErr.message || geminiErr}). Trying fallback...`);
      }
    }

    // If all models encounter temporary high demand (503/429), use verified curriculum bank
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      console.info('Serving verified high-yield curriculum questions fallback due to temporary model demand.');
      questions = getFallbackQuestions(subject, topic, count, difficulty);
    }

    res.json({ success: true, questions });
  } catch (err: any) {
    console.error('Error generating quiz:', err);
    // Even on total unexpected error, provide fallback questions rather than failing
    const fallbackQuestions = getFallbackQuestions(req.body?.subject, req.body?.topic, req.body?.count || 5, req.body?.difficulty || 'medium');
    res.json({
      success: true,
      questions: fallbackQuestions,
      isFallback: true,
    });
  }
});

// 7. AI-Powered Multi-Modal Content Curation System (model: gemini-3.8-flash)
app.post('/api/gemini/curate-content', async (req: Request, res: Response) => {
  try {
    const { subject, weakTopics, quizScore, learningPace = 'Standard', studentGrade = 'Grade 11' } = req.body;

    const ai = getGenAIClient();
    const prompt = `You are an elite AI Curriculum Director and Adaptive Content Curator.
Analyze this high school student's diagnostic profile:
- Subject: ${subject || 'AP Calculus BC'}
- Grade Level: ${studentGrade}
- Identified Weak Spots / Misconceptions: ${weakTopics || 'Techniques of integration and series convergence'}
- Diagnostic Quiz Mastery: ${quizScore || 72}%
- Assessed Learning Pace: ${learningPace}

Recommend 4 highly diverse learning resources covering different learning modalities:
1. One in-depth conceptual article or reading breakdown (modality: "article")
2. One high-yield video lecture with key timestamps (modality: "video")
3. One interactive practice challenge problem with options, correct answer, and hint (modality: "practice_problem")
4. One interactive visual simulation or cheatsheet sandbox (modality: "interactive_simulation")

Return strictly a JSON array conforming to this exact schema:
[
  {
    "id": "cur-gen-1",
    "title": "Clear Title of Resource",
    "subject": "${subject || 'ap-calc-bc'}",
    "topic": "Specific sub-topic",
    "modality": "article", // exactly one of: "article", "video", "practice_problem", "interactive_simulation"
    "difficulty": "intermediate", // "foundational", "intermediate", or "advanced"
    "estimatedTime": "8 min read",
    "source": "Source Name (e.g. Apex Masterclass, MIT OCW, Campbell)",
    "summary": "2-sentence high-impact synopsis of the resource",
    "keyTakeaways": ["Key point 1", "Key point 2", "Key point 3"],
    "matchReason": "Clear diagnostic rationale explaining why this was recommended based on their weak topics and pace",
    "xpReward": 80,
    "contentBody": "Short comprehensive explanation or guide text",
    "videoDuration": "10:30", // if modality == 'video'
    "videoTimestamps": [
      { "label": "Key Concept 1", "time": "02:15" },
      { "label": "Worked Problem", "time": "05:40" }
    ],
    "practiceProblem": { // if modality == 'practice_problem'
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why option A is correct",
      "hint": "Helpful hint"
    },
    "simulationParameters": [ // if modality == 'interactive_simulation'
      { "name": "Parameter Name", "unit": "units", "defaultVal": 2, "min": 1, "max": 10 }
    ]
  }
]
Return ONLY raw JSON array.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });
    } catch (primaryErr: any) {
      console.warn('gemini-3.8-flash unavailable for curation, falling back to gemini-3.1-flash-lite:', primaryErr.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });
    }

    const rawText = response.text || '[]';
    let curatedItems;
    try {
      curatedItems = JSON.parse(rawText);
    } catch {
      const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      curatedItems = JSON.parse(cleanJson);
    }

    res.json({ success: true, items: curatedItems });
  } catch (err: any) {
    console.error('Error curating content:', err);
    res.status(500).json({
      error: 'Failed to curate adaptive content',
      details: err?.message || String(err),
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Capacity Connect server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
