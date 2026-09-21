# Capacity Connect — Feature Catalog & Architecture Overview

Capacity Connect is an AI-powered smart learning platform designed for high school students tackling advanced STEM courses (including AP Calculus BC, AP Physics C, AP Biology, and AP Chemistry).

---

## 1. Core Learning & Study Planning

### 1.1 Adaptive Study Paths & Interactive Skill Roadmap
- **Visual Node Graph**: Interactive skill tree representing prerequisite concepts, active topics, and mastered milestones.
- **Node Inspector**: Deep-dive topic views with key formulas, core competencies, practice tasks, and completion triggers.
- **Adaptive Curriculum Generation**: AI-curated personalized roadmap tailored to the student's current proficiency level.
- **Daily Study Goals**: Target time counters, customized daily quotas, and progress tracking bars.

### 1.2 30-Day Contribution Heatmap & Streak Hub
- **GitHub / LeetCode-Style Matrix**: 5-week by 7-day contribution grid displaying daily study intensity across 5 color-coded tiers (0 to 80+ minutes).
- **30-Day Sequential Timeline View**: Alternate horizontal timeline mode showing day-by-day practice volume.
- **Micro-Tooltips & Day Inspector**: Click or hover any cell to review historical study duration, earned XP, quizzes completed, flashcards reviewed, and specific curriculum topics practiced.
- **Streak Freeze Protection Shield**: Toggleable protection mechanism to preserve hard-earned active streaks on scheduled rest days.
- **Quick-Log Action**: One-click "+15m Study Session" shortcut that dynamically updates today's cell with instant visual confetti and sound effects.

---

## 2. AI Intelligence & Multimodal Tutoring

### 2.1 Visual Multimodal Homework Solver
- **AI Vision Engine**: Powered by Gemini 3.1 Pro Preview multimodal input.
- **Flexible Image Input**: Drag-and-drop file upload, device camera capture, or manual paste for handwritten homework, textbook problems, and equations.
- **Step-by-Step Socratic Guidance**: Structured conceptual breakdown highlighting key mathematical theorems without simply giving away the final answer.
- **Study Circle Sharing**: One-click export of verified solution breakdowns directly to peer study whiteboards.

### 2.2 Socratic AI Tutor
- **Conversational Mentor**: Powered by Gemini 3.8 Flash to guide students through Socratic inquiry.
- **Cross-Component Topic Bridge**: Launch tutoring sessions directly from Analytics, Mind Maps, Homework Solver, or Flashcard decks.
- **Preset Quick Prompts**: Instant starters for concept explanations, derivation walk-throughs, and AP-style trick questions.
- **Audio Feedback**: Contextual Web Audio synth feedback for student milestones.

### 2.3 AI Educational Diagram Generator
- **Generative Image Engine**: Powered by Gemini 3.1 Flash Image Preview (Imagen).
- **Textbook-Quality Visuals**: On-demand generation of biology pathways (e.g., ATP synthesis, signal transduction), physics free-body diagrams, and calculus curves.
- **Flashcard Integration**: Save any generated diagram directly as a visual spaced-repetition flashcard.

---

## 3. Practice, Recall & Examination

### 3.1 Spaced Repetition Flashcard Trainer (SuperMemo SM-2)
- **Algorithmic Review Intervals**: Calculates interval timings and ease factors using standard SM-2 logic.
- **Self-Assessment Rating**: Response buttons (*Again*, *Hard*, *Good*, *Easy*) dynamically adjust future review intervals.
- **Deck Management**: Subject-specific flashcard collections with mastery rate tracking.

### 3.2 Interactive Math Scratchpad
- **Freehand Canvas**: Digital scratchpad with responsive stroke drawing, eraser, and clear tools.
- **LaTeX Math Toolbar**: Quick-insert symbols for integrals, summations, derivatives, matrices, and Greek letters.
- **AI Verification**: One-click mathematical proof and work verification with targeted feedback on calculation errors.

### 3.3 Timed Mock Exam Simulator & FRQ Grader
- **Authentic AP Exam Environment**: Timed multiple-choice sections and Free Response Questions (FRQ).
- **Live Exam Clock**: Real-time countdown timer with question navigation matrix.
- **Rubric-Based AI Grading**: Comprehensive scoring against official AP rubric guidelines.
- **Course Honors Certificate**: Verifiable course completion certificate modal generated upon passing mock exams.

---

## 4. Concept Mapping & Curated Content

### 4.1 Knowledge Graph & Mind Map
- **Interconnected Concept Network**: Visual 2D force-directed node map depicting subject domains and prerequisite links.
- **Node Filtering**: Filter by mastery state (Mastered, In Progress, Needs Review).
- **Direct Socratic Link**: Instant jump from any graph node into a focused tutoring session.

### 4.2 AI Content Curation & High-Yield Digests
- **Curated Educational Resources**: Handpicked collection of video lessons, research papers, and practice sets.
- **Difficulty Badging**: Categorized by Foundation, Intermediate, and Advanced AP levels.
- **High-Yield Formula Digest**: Printable summaries and cheat sheets for last-minute exam review.

---

## 5. Gamification & Collaboration

### 5.1 Gamified Arena & Progression
- **XP & Leveling System**: Earn experience points for studying, solving homework, practicing flashcards, and finishing exams.
- **Dynamic Combo Multipliers**: Boost XP gains through consistent correct answers.
- **Daily Quests**: Rotating daily learning missions with bonus XP rewards.
- **Achievement Badges**: Unlockable trophies celebrating milestones (e.g., Streak Master, Calculus Conqueror).

### 5.2 Collaborative Study Circles
- **Group Study Hubs**: Join or create study groups centered on specific AP subjects.
- **Virtual Whiteboard Notes**: Pinned student notes, homework solver exports, and shared study tips.
- **Shared Group Milestones**: Community goals and group member activity tracking.

---

## 6. Progress Analytics & User Management

### 6.1 Progress & Mastery Analytics
- **Curriculum Domain Breakdown**: Progress bars analyzing strengths and weaknesses across all course subtopics.
- **Study Volume Tracking**: Weekly time distribution bar chart and cumulative study statistics.
- **Integrated Streak Heatmap**: Direct access to 30-day study consistency metrics.

### 6.2 Role-Based Access Control (RBAC) & Audit Logs
- **Multi-Role Simulation**: Switch between Learner, Instructor, Admin, Field Worker, and Auditor roles.
- **Administrative Security Modal**: Manage user profiles, multi-factor authentication preferences, and API statuses.
- **Real-Time Audit Log**: Timestamped record of user actions and security events.

---

## 7. Platform Architecture & Accessibility

### 7.1 Hands-Free Global Voice Navigation
- **Voice Commands**: Web Speech API integration allowing speech-controlled tab navigation (e.g., "open solver", "switch to physics").
- **Voice Dictation**: Hands-free prompt dictation for students working with physical notebooks.

### 7.2 Progressive Web App (PWA) & Offline Mode
- **Offline Reliability**: Service Worker precaching of assets with an in-app Offline Status Banner.
- **PWA Installation**: Custom in-app installation banner and manifest configuration.

### 7.3 Web Audio Sound Engine
- **Synthesizer**: Custom zero-dependency Web Audio API sound generator providing subtle audio feedback for clicks, success events, level-ups, and error states.
