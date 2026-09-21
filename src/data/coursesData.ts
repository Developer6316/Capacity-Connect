import { TrainingCourse, SkillCompetency, KnowledgeArticle, TrainerAssessmentSubmission, PortalCustomizationSettings } from '../types';

export const DEFAULT_PORTAL_SETTINGS: PortalCustomizationSettings = {
  portalName: 'Capacity Connect',
  portalMotto: 'A centralized, digital ecosystem for organizational training, competency development, and knowledge sharing.',
  organizationName: 'National Capacity Building Consortium & Enterprise Institute',
  primaryAccent: 'indigo',
  geminiApiKey: '',
  isCustomApiKeySet: false,
  activeGeminiModel: 'gemini-3.8-flash',
  rateLimitingEnabled: true,
  allowPublicRegistration: true,
  requireMfa: false,
  enableAuditLogging: true,
  departments: [
    'Computer Science & Engineering',
    'Information Technology & DevOps',
    'Data Science & AI Initiatives',
    'Cybersecurity & Regulatory Compliance',
    'Organizational Leadership & HR'
  ],
  storageUsageMb: 142.8,
  maxStorageMb: 1024,
  customResources: [
    {
      id: 'res-1',
      title: 'Digital Capacity Building Framework & Competency Matrix 2026',
      type: 'PDF Document',
      url: 'https://capacitybuilding.gov.in/guidelines-2026.pdf',
      targetRole: 'All Roles',
      addedBy: 'Admin (System)',
      date: '2026-08-15'
    },
    {
      id: 'res-2',
      title: 'National Digital Public Infrastructure (DPI) Architectural Handbook',
      type: 'Curriculum Guide',
      url: 'https://dpi.gov.in/architecture-spec.pdf',
      targetRole: 'Trainee / Engineer',
      addedBy: 'Lead Trainer (Prof. K. Sharma)',
      date: '2026-08-20'
    },
    {
      id: 'res-3',
      title: 'Enterprise Microservices & REST API Security Standards',
      type: 'API Spec',
      url: 'https://internal.wiki/specs/api-sec-v2',
      targetRole: 'Trainer / Trainee',
      addedBy: 'Admin (System)',
      date: '2026-08-28'
    }
  ]
};

export const INITIAL_COURSES: TrainingCourse[] = [
  // 1. Core CS: Data Structures & Algorithms
  {
    id: 'cs-dsa-101',
    code: 'CS-101',
    title: 'Data Structures & Algorithms: Enterprise Problem Solving',
    category: 'Computer Science',
    description: 'Master time and space complexity, asymptotic notation, trees, graphs, dynamic programming, and scalable algorithmic design for high-performance enterprise systems.',
    instructor: 'Dr. Arvind Ramanujan',
    instructorRole: 'Principal Algorithms Architect',
    organization: 'Computer Science Division',
    durationHours: 48,
    level: 'Intermediate',
    rating: 4.9,
    enrollmentCount: 1420,
    prerequisites: ['Basic Programming in C++, Java, or Python'],
    targetSkills: ['Algorithm Analysis', 'Data Structure Optimization', 'Dynamic Programming', 'Graph Theory'],
    enrolled: true,
    progress: 65,
    certified: false,
    regionBadge: 'Global CS',
    featured: true,
    thumbnailGradient: 'from-blue-600 to-indigo-800',
    modules: [
      { id: 'm1', title: 'Asymptotic Analysis & Big-O in Distributed Systems', duration: '3h 30m', type: 'video', completed: true },
      { id: 'm2', title: 'Self-Balancing Trees (AVL, Red-Black) & B-Trees', duration: '4h 15m', type: 'video', completed: true },
      { id: 'm3', title: 'Graph Algorithms: Dijkstra, Bellman-Ford, TopoSort', duration: '5h 00m', type: 'hands_on', completed: true },
      { id: 'm4', title: 'Dynamic Programming: Memoization & Tabulation Patterns', duration: '6h 30m', type: 'quiz', completed: false },
      { id: 'm5', title: 'Capstone Coding Assessment: Distributed Cache LRU', duration: '4h 00m', type: 'hands_on', completed: false }
    ]
  },

  // 2. Core CS: Full-Stack Web Architecture
  {
    id: 'cs-fullstack-201',
    code: 'CS-201',
    title: 'Modern Full-Stack Engineering (React, Node.js & PostgreSQL)',
    category: 'Computer Science',
    description: 'End-to-end modern web architecture. Learn state management, RESTful & GraphQL APIs, database indexing, caching strategies, and JWT/OAuth authentication.',
    instructor: 'Priya Sundaram',
    instructorRole: 'Senior Staff Full-Stack Lead',
    organization: 'Web Platforms Group',
    durationHours: 52,
    level: 'Intermediate',
    rating: 4.8,
    enrollmentCount: 2180,
    prerequisites: ['HTML/CSS', 'Modern JavaScript (ES6+)'],
    targetSkills: ['React 18 & State', 'Node.js Express Backend', 'PostgreSQL Schema & Indexing', 'API Security'],
    enrolled: true,
    progress: 40,
    certified: false,
    regionBadge: 'Global CS',
    featured: true,
    thumbnailGradient: 'from-emerald-600 to-teal-800',
    modules: [
      { id: 'm1', title: 'Component Architecture & Custom React Hooks', duration: '4h 00m', type: 'video', completed: true },
      { id: 'm2', title: 'Express.js Middleware & Clean Architecture Patterns', duration: '5h 30m', type: 'article', completed: true },
      { id: 'm3', title: 'Relational Database Modeling with Drizzle ORM & Postgres', duration: '6h 00m', type: 'hands_on', completed: false },
      { id: 'm4', title: 'State Synchronization & WebSockets for Real-Time Apps', duration: '4h 45m', type: 'video', completed: false },
      { id: 'm5', title: 'End-to-End Capstone: High-Throughput E-Commerce API', duration: '8h 00m', type: 'hands_on', completed: false }
    ]
  },

  // 3. Core CS: Operating Systems & Low-Level Concurrency
  {
    id: 'cs-os-301',
    code: 'CS-301',
    title: 'Operating Systems, Concurrency & Linux Kernel Internals',
    category: 'Computer Science',
    description: 'Understand process scheduling, virtual memory, paging, POSIX threads, mutexes, condition variables, file systems, and kernel-space I/O.',
    instructor: 'Prof. Rajeshwar Sen',
    instructorRole: 'Systems Software Fellow',
    organization: 'Department of Computing',
    durationHours: 42,
    level: 'Advanced',
    rating: 4.9,
    enrollmentCount: 940,
    prerequisites: ['C Programming', 'Computer Architecture Basics'],
    targetSkills: ['Process Synchronization', 'Memory Management', 'POSIX Multithreading', 'Kernel Syscalls'],
    enrolled: false,
    progress: 0,
    certified: false,
    regionBadge: 'Global CS',
    thumbnailGradient: 'from-amber-600 to-orange-800',
    modules: [
      { id: 'm1', title: 'Processes, Threads, and CPU Scheduling Mechanisms', duration: '4h 10m', type: 'video' },
      { id: 'm2', title: 'Deadlock Detection, Mutex Locks & Semaphores in C', duration: '5h 00m', type: 'hands_on' },
      { id: 'm3', title: 'Virtual Memory, TLB, Page Fault Handling & Segmentation', duration: '5h 30m', type: 'article' },
      { id: 'm4', title: 'Linux VFS, Inodes, and Ext4 File System Architecture', duration: '4h 45m', type: 'video' }
    ]
  },

  // 4. Core CS: Distributed Systems & Microservices
  {
    id: 'cs-dist-401',
    code: 'CS-401',
    title: 'Distributed Systems & Cloud-Native Microservices Design',
    category: 'Cloud & DevOps',
    description: 'CAP theorem, distributed consensus (Raft/Paxos), event-driven architectures with Apache Kafka, service meshes, and fault-tolerant resilient topologies.',
    instructor: 'Vikramaditya Rao',
    instructorRole: 'Chief Cloud Architect',
    organization: 'Enterprise Infra Institute',
    durationHours: 60,
    level: 'Advanced',
    rating: 4.95,
    enrollmentCount: 1650,
    prerequisites: ['Networking Fundamentals', 'Container Basics (Docker)'],
    targetSkills: ['Distributed Consensus', 'Event Sourcing & Kafka', 'Service Mesh (Istio)', 'Resilience Patterns'],
    enrolled: false,
    progress: 0,
    certified: false,
    regionBadge: 'Global CS',
    thumbnailGradient: 'from-purple-600 to-indigo-900',
    modules: [
      { id: 'm1', title: 'CAP, PACELC & Consistency Models in Distributed Stores', duration: '4h 00m', type: 'video' },
      { id: 'm2', title: 'Event-Driven Systems: Kafka Partitions, Offsets & CQRS', duration: '6h 15m', type: 'hands_on' },
      { id: 'm3', title: 'Circuit Breakers, Bulkheads & Retry Policies in Go/Java', duration: '4h 30m', type: 'article' },
      { id: 'm4', title: 'Kubernetes Pod Scheduling, Ingress & Operators', duration: '7h 00m', type: 'hands_on' }
    ]
  },

  // 5. India Curricula: NPTEL / SWAYAM - Python Data Structures (IIT Madras)
  {
    id: 'in-nptel-py-101',
    code: 'NPTEL-CS11',
    title: 'NPTEL / SWAYAM: Programming & Data Structures using Python',
    category: 'India Curricula',
    description: 'Official curriculum standard based on IIT Madras NPTEL course. Covers Python idioms, inductive reasoning, recursive structures, sorting algorithms, and standard search trees.',
    instructor: 'Prof. Madhavan Mukund',
    instructorRole: 'Professor & Director, CMI / NPTEL Coordinator',
    organization: 'IIT Madras / SWAYAM Govt. of India',
    durationHours: 36,
    level: 'Beginner',
    rating: 4.88,
    enrollmentCount: 5400,
    prerequisites: ['High School Mathematics (Class XII)'],
    targetSkills: ['Pythonic Programming', 'Recursive Algorithms', 'Sorting & Searching', 'Algorithmic Correctness'],
    enrolled: true,
    progress: 90,
    certified: true,
    regionBadge: 'NPTEL / India',
    featured: true,
    thumbnailGradient: 'from-orange-600 to-amber-700',
    modules: [
      { id: 'm1', title: 'Python Basics, Lists, Tuples, Dictionaries & Functions', duration: '3h 00m', type: 'video', completed: true },
      { id: 'm2', title: 'Induction, Recursion and Quicksort / Mergesort Complexity', duration: '4h 30m', type: 'video', completed: true },
      { id: 'm3', title: 'Binary Search Trees & Priority Queues (Heaps)', duration: '5h 15m', type: 'quiz', completed: true },
      { id: 'm4', title: 'Final Proctored Examination Simulator (NPTEL Pattern)', duration: '3h 00m', type: 'quiz', completed: true }
    ]
  },

  // 6. India Curricula: GATE Computer Science & Information Technology
  {
    id: 'in-gate-cs-2026',
    code: 'GATE-CSIT',
    title: 'GATE CS & IT: Complete Subject-Wise Rigor & Mock Test Series',
    category: 'India Curricula',
    description: 'Comprehensive preparation for Graduate Aptitude Test in Engineering (GATE CS/IT). Theory of Computation, Compiler Design, DBMS, Computer Networks, and Discrete Mathematics.',
    instructor: 'Dr. Suresh Babu & Expert GATE Faculty Panel',
    instructorRole: 'Senior GATE CS Master Trainer',
    organization: 'All-India Technical Education Forum',
    durationHours: 120,
    level: 'Advanced',
    rating: 4.92,
    enrollmentCount: 3890,
    prerequisites: ['B.Tech / B.E. in CS, IT, or related Engineering'],
    targetSkills: ['Automata & Formal Languages', 'Compiler Syntax & Semantic Analysis', 'Relational Algebra & Normalization', 'IPv4/IPv6 Subnetting'],
    enrolled: false,
    progress: 0,
    certified: false,
    regionBadge: 'GATE CS',
    featured: true,
    thumbnailGradient: 'from-red-600 to-rose-900',
    modules: [
      { id: 'm1', title: 'Discrete Mathematics: Propositional Logic, Combinatorics & Sets', duration: '12h 00m', type: 'video' },
      { id: 'm2', title: 'Theory of Computation: DFA/NFA, Pushdown Automata & Turing Machines', duration: '14h 30m', type: 'hands_on' },
      { id: 'm3', title: 'Compiler Design: Lexical Analysis, LL(1)/LR(1) Parsing & Code Gen', duration: '10h 00m', type: 'article' },
      { id: 'm4', title: 'Computer Organization: Pipelining, Cache Mapping & Hazards', duration: '12h 30m', type: 'video' },
      { id: 'm5', title: 'All-India National Mock Simulation Exam (65 Questions)', duration: '3h 00m', type: 'quiz' }
    ]
  },

  // 7. India Enterprise: Corporate Tech Onboarding (TCS / Infosys / Wipro Standard)
  {
    id: 'in-corp-onboard-301',
    code: 'CORP-IND-01',
    title: 'Indian IT Enterprise Onboarding: Spring Boot, Microservices & Agile Delivery',
    category: 'India Curricula',
    description: 'Modeled after flagship corporate training academies (TCS ILP, Infosys Mysore DC, Wipro Elite). Enterprise Java, Spring Cloud, JUnit 5 mock testing, and CI/CD pipelines.',
    instructor: 'Ananya Deshmukh',
    instructorRole: 'Head of Learning & Talent Enablement',
    organization: 'Enterprise IT Capability Centre',
    durationHours: 70,
    level: 'Intermediate',
    rating: 4.85,
    enrollmentCount: 4200,
    prerequisites: ['Core Java / OOP Concept Proficiency'],
    targetSkills: ['Spring Boot 3 & Hibernate JPA', 'Enterprise Security & Microservices', 'Agile Scrum Ceremonies', 'SonarQube Quality Gates'],
    enrolled: true,
    progress: 25,
    certified: false,
    regionBadge: 'Enterprise Track',
    thumbnailGradient: 'from-cyan-600 to-blue-800',
    modules: [
      { id: 'm1', title: 'Core Java 21 LTS Features & Functional Streams', duration: '6h 00m', type: 'video', completed: true },
      { id: 'm2', title: 'Spring Boot RESTful APIs with Validation & Exception Handling', duration: '8h 30m', type: 'hands_on', completed: false },
      { id: 'm3', title: 'Spring Security with JWT & Role-Based Authorization (RBAC)', duration: '7h 00m', type: 'article', completed: false },
      { id: 'm4', title: 'Enterprise Project Delivery: Banking Ledger Microservice', duration: '12h 00m', type: 'hands_on', completed: false }
    ]
  },

  // 8. India National DPI: UPI, Aadhaar & Digital Public Infrastructure Architecture
  {
    id: 'in-dpi-gov-401',
    code: 'DPI-INDIA-401',
    title: 'Digital Public Infrastructure (DPI): Architecture of UPI, ONDC & India Stack',
    category: 'India Curricula',
    description: 'Learn the architectural blueprints powering India Stack: open APIs, NPCI Unified Payments Interface (UPI), Open Network for Digital Commerce (ONDC), and consent artifacts.',
    instructor: 'Shri R. Venkatraman, IAS (Retd.) & Tech Taskforce',
    instructorRole: 'Advisor, Digital Governance Architecture',
    organization: 'National Capacity Building Commission (CBC)',
    durationHours: 30,
    level: 'Intermediate',
    rating: 4.96,
    enrollmentCount: 2600,
    prerequisites: ['Software Architecture or Public Policy Foundation'],
    targetSkills: ['Open API Ecosystems', 'Zero-Trust Consent Artefacts', 'High-Volume Transaction Switching', 'DPI Governance'],
    enrolled: false,
    progress: 0,
    certified: false,
    regionBadge: 'NPTEL / India',
    thumbnailGradient: 'from-amber-700 to-emerald-800',
    modules: [
      { id: 'm1', title: 'Identity Layer: Aadhaar Auth, e-Sign & Digital Locker Specs', duration: '4h 00m', type: 'video' },
      { id: 'm2', title: 'Payment Layer: UPI 2.0 Real-Time Settlement & Virtual Payment Address', duration: '6h 00m', type: 'hands_on' },
      { id: 'm3', title: 'Commerce & Credit: ONDC Open Protocols & Account Aggregator (AA)', duration: '5h 30m', type: 'article' },
      { id: 'm4', title: 'Case Study: Handling 15+ Billion Monthly Transactions Resiliently', duration: '4h 00m', type: 'video' }
    ]
  },

  // 9. AI & Data Science: Deep Learning & Generative AI Architectures
  {
    id: 'ai-genai-501',
    code: 'AI-501',
    title: 'Generative AI, LLM Fine-Tuning & Transformer Architectures',
    category: 'AI & Data Science',
    description: 'Build production-ready AI applications. Understand Attention Mechanisms, Transformer decoders/encoders, LoRA/PEFT fine-tuning, RAG pipelines, and Vector Databases.',
    instructor: 'Dr. Siddharth Mukherjee',
    instructorRole: 'Principal AI Research Fellow',
    organization: 'Applied Machine Intelligence Lab',
    durationHours: 45,
    level: 'Advanced',
    rating: 4.94,
    enrollmentCount: 3120,
    prerequisites: ['Python', 'Linear Algebra & Calculus', 'Basic PyTorch'],
    targetSkills: ['Transformer Architecture', 'RAG & Vector Embeddings', 'LoRA / QLoRA Fine-Tuning', 'Prompt Engineering'],
    enrolled: false,
    progress: 0,
    certified: false,
    regionBadge: 'Global CS',
    featured: true,
    thumbnailGradient: 'from-violet-600 to-fuchsia-900',
    modules: [
      { id: 'm1', title: 'Self-Attention, Multi-Head Attention & Positional Encodings', duration: '5h 00m', type: 'video' },
      { id: 'm2', title: 'Retrieval Augmented Generation (RAG) with ChromaDB & LangChain', duration: '6h 30m', type: 'hands_on' },
      { id: 'm3', title: 'Efficient Fine-Tuning with PEFT, LoRA & Quantization (BitsAndBytes)', duration: '7h 00m', type: 'hands_on' },
      { id: 'm4', title: 'Evaluations & Guardrails: hallucination mitigation in production', duration: '4h 30m', type: 'quiz' }
    ]
  },

  // 10. Cybersecurity: Information Security & Digital Personal Data Protection (DPDP) Act 2023
  {
    id: 'sec-dpdp-601',
    code: 'SEC-DPDP-23',
    title: 'Enterprise Cyber Defense & Indian DPDP Act 2023 Compliance',
    category: 'Cybersecurity',
    description: 'Practical organizational cybersecurity merged with India\'s Digital Personal Data Protection (DPDP) Act 2023. Threat modeling, pen-testing basics, SOC operations, and regulatory audit compliance.',
    instructor: 'Meenakshi Iyer, CISA, CISSP',
    instructorRole: 'Chief Information Security Officer & Cyber Law Specialist',
    organization: 'National Cyber Security Training Cell',
    durationHours: 35,
    level: 'Intermediate',
    rating: 4.89,
    enrollmentCount: 1850,
    prerequisites: ['Basic Information Systems Understanding'],
    targetSkills: ['DPDP Act 2023 Compliance', 'Data Principal Rights', 'SOC Incident Response', 'Vulnerability Assessment'],
    enrolled: false,
    progress: 0,
    certified: false,
    regionBadge: 'NPTEL / India',
    thumbnailGradient: 'from-slate-700 to-cyan-900',
    modules: [
      { id: 'm1', title: 'Foundations of DPDP Act 2023: Data Fiduciary obligations & penalties', duration: '4h 00m', type: 'video' },
      { id: 'm2', title: 'Enterprise Threat Modeling: STRIDE & OWASP Top 10 API vulnerabilities', duration: '5h 30m', type: 'hands_on' },
      { id: 'm3', title: 'Cryptographic Protocols: TLS 1.3, AES-GCM & Key Management Services', duration: '5h 00m', type: 'article' },
      { id: 'm4', title: 'Incident Response SOP: CERT-In 6-hour breach reporting guidelines', duration: '4h 00m', type: 'quiz' }
    ]
  },

  // 11. India Curricula: NPTEL - AI: Search Methods for Problem Solving (IIT Kharagpur)
  {
    id: 'in-nptel-ai-701',
    code: 'NPTEL-AI02',
    title: 'NPTEL: Artificial Intelligence - Search Methods for Problem Solving',
    category: 'India Curricula',
    description: 'Classic algorithmic AI based on IIT Kharagpur curriculum. State space graphs, Heuristic search (A*, IDA*), Adversarial Minimax search with Alpha-Beta pruning, and Constraint Satisfaction.',
    instructor: 'Prof. Deepak Khemani',
    instructorRole: 'Professor of Computer Science, IIT Madras',
    organization: 'IIT Kharagpur / SWAYAM Govt. of India',
    durationHours: 40,
    level: 'Intermediate',
    rating: 4.87,
    enrollmentCount: 3100,
    prerequisites: ['Data Structures & Discrete Mathematics'],
    targetSkills: ['Heuristic A* Search', 'Alpha-Beta Pruning', 'Constraint Satisfaction (CSP)', 'Game Playing Algorithms'],
    enrolled: false,
    progress: 0,
    certified: false,
    regionBadge: 'NPTEL / India',
    thumbnailGradient: 'from-teal-700 to-emerald-900',
    modules: [
      { id: 'm1', title: 'State Space Representation, BFS, DFS & Iterative Deepening', duration: '4h 00m', type: 'video' },
      { id: 'm2', title: 'Heuristic Search: Greedy Best-First & Admissible A* with Proofs', duration: '6h 00m', type: 'hands_on' },
      { id: 'm3', title: 'Adversarial Search: Minimax Algorithm & Alpha-Beta Cutoffs', duration: '5h 00m', type: 'video' },
      { id: 'm4', title: 'Constraint Satisfaction: Arc Consistency (AC-3) & Backtracking', duration: '5h 30m', type: 'quiz' }
    ]
  },

  // 12. Leadership & Capacity: Civil Services & Corporate Governance
  {
    id: 'mgmt-gov-801',
    code: 'CAP-LEAD-01',
    title: 'Strategic Leadership, Mission Karmayogi & Organizational Capacity',
    category: 'Leadership & Compliance',
    description: 'Framework for competency development, performance metrics, department-wide OKRs, institutional change management, and ethical decision-making.',
    instructor: 'Dr. Alok Verma',
    instructorRole: 'Dean of Public Policy & Executive Education',
    organization: 'National Governance Institute',
    durationHours: 25,
    level: 'Beginner',
    rating: 4.91,
    enrollmentCount: 1540,
    prerequisites: ['None - Open to all professionals and trainees'],
    targetSkills: ['Capacity Frameworks', 'Competency Mapping', 'Public Policy Impact', 'Ethical Governance'],
    enrolled: false,
    progress: 0,
    certified: false,
    regionBadge: 'Enterprise Track',
    thumbnailGradient: 'from-amber-700 to-rose-800',
    modules: [
      { id: 'm1', title: 'The 3 Pillars of Organizational Capacity: People, Process, Policy', duration: '3h 30m', type: 'video' },
      { id: 'm2', title: 'Role-Based Competency Dictionary & Dynamic Skill Gap Diagnostics', duration: '4h 00m', type: 'article' },
      { id: 'm3', title: 'Citizen-Centric & Stakeholder-First Service Delivery Systems', duration: '3h 30m', type: 'video' },
      { id: 'm4', title: 'Governance Ethics, Accountability & Audit-Trail Transparency', duration: '4h 00m', type: 'quiz' }
    ]
  }
];

// Initial Skill Competencies for Dynamic Skill-Gap Tracking
export const DEFAULT_SKILL_COMPETENCIES: SkillCompetency[] = [
  {
    id: 'sk-dsa',
    name: 'Algorithms & Computational Problem Solving',
    category: 'Core CS',
    currentLevel: 3,
    targetLevel: 5,
    gapScore: 2,
    priority: 'Critical',
    recommendedCourseIds: ['cs-dsa-101', 'in-nptel-py-101'],
    assessedDate: '2026-08-28'
  },
  {
    id: 'sk-fullstack',
    name: 'Full-Stack Architecture (React, Node, DB)',
    category: 'Core CS',
    currentLevel: 4,
    targetLevel: 4,
    gapScore: 0,
    priority: 'Proficient',
    recommendedCourseIds: ['cs-fullstack-201'],
    assessedDate: '2026-09-01'
  },
  {
    id: 'sk-distrib',
    name: 'Distributed Systems & Cloud Concurrency',
    category: 'Cloud & Infra',
    currentLevel: 2,
    targetLevel: 5,
    gapScore: 3,
    priority: 'Critical',
    recommendedCourseIds: ['cs-dist-401', 'cs-os-301'],
    assessedDate: '2026-08-25'
  },
  {
    id: 'sk-dpi',
    name: 'India Stack & Digital Public Infrastructure (UPI/ONDC)',
    category: 'System Architecture',
    currentLevel: 2,
    targetLevel: 4,
    gapScore: 2,
    priority: 'Moderate',
    recommendedCourseIds: ['in-dpi-gov-401'],
    assessedDate: '2026-08-30'
  },
  {
    id: 'sk-cyber',
    name: 'Cybersecurity & DPDP Act 2023 Compliance',
    category: 'Security & Law',
    currentLevel: 2,
    targetLevel: 4,
    gapScore: 2,
    priority: 'Moderate',
    recommendedCourseIds: ['sec-dpdp-601'],
    assessedDate: '2026-08-20'
  },
  {
    id: 'sk-ai',
    name: 'Generative AI, Transformers & RAG Pipelines',
    category: 'Data & AI',
    currentLevel: 1,
    targetLevel: 4,
    gapScore: 3,
    priority: 'Critical',
    recommendedCourseIds: ['ai-genai-501', 'in-nptel-ai-701'],
    assessedDate: '2026-09-02'
  }
];

// Peer-to-Peer Knowledge Repository Articles
export const INITIAL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'k-1',
    title: 'Engineering SOP: Zero-Downtime Database Migration on PostgreSQL',
    summary: 'Step-by-step runbook for modifying high-traffic database schemas, creating concurrent indexes, and handling replication lag without locking production tables.',
    content: `### Objective
Provide standard operating procedures for executing schema migrations on high-throughput OLTP databases with zero user downtime.

### Pre-Migration Checklist
1. **Validate Lock Timeouts**: Always set \`SET lock_timeout = '2s';\` prior to altering table structures.
2. **Concurrent Indexing**: Never run \`CREATE INDEX\` on live tables. Always use \`CREATE INDEX CONCURRENTLY\`.
3. **Additive Columns Only**: When adding columns, always allow \`NULL\` or specify a default without rewrite (PostgreSQL 11+ supports instant defaults).

### Rollback Strategy
Maintain an automated revert script pre-tested in the staging replication replica. Verify WAL replay metrics before and after the release window.`,
    category: 'Engineering SOP',
    tags: ['PostgreSQL', 'Database Migration', 'High Availability', 'DevOps'],
    authorName: 'Vikramaditya Rao',
    authorRole: 'Trainer',
    department: 'Information Technology & DevOps',
    upvotes: 42,
    hasUpvoted: false,
    createdAt: '2026-08-24',
    readTime: '6 min',
    views: 380,
    commentsCount: 9,
    attachments: [
      { name: 'postgres_migration_checklist.pdf', size: '1.2 MB', type: 'PDF' },
      { name: 'alter_table_script.sql', size: '4 KB', type: 'SQL' }
    ]
  },
  {
    id: 'k-2',
    title: 'RFC: Adopting India Stack UPI 2.0 Mandates for Recurring Corporate Disbursals',
    summary: 'Proposal to integrate NPCI AutoPay recurring mandates for automated vendor payments and capacity building stipend disbursals across public institutions.',
    content: `### Executive Summary
This RFC outlines the architectural integration between our internal organizational enterprise ERP and the NPCI UPI 2.0 Recurring Mandates specification.

### Technical Architecture
- **Consent Creation**: Initiated via Virtual Payment Address (VPA) with pre-specified maximum debit threshold and frequency enum.
- **Webhook Handlers**: Idempotent event consumer validating HMAC-SHA256 signature headers from the sponsor banking gateway.
- **Error Handling**: Graceful exponential backoff for code \`U30\` (insufficient balance) with notifications dispatched to Trainee profiles.

### Security Implications
Ensures compliance with RBI circular on processing of e-mandates with Additional Factor of Authentication (AFA) during initial mandate registration.`,
    category: 'Architecture RFC',
    tags: ['UPI 2.0', 'FinTech', 'India Stack', 'Architecture', 'NPCI'],
    authorName: 'Dr. Arvind Ramanujan',
    authorRole: 'Trainer',
    department: 'Computer Science & Engineering',
    upvotes: 56,
    hasUpvoted: true,
    createdAt: '2026-08-29',
    readTime: '8 min',
    views: 520,
    commentsCount: 14,
    attachments: [
      { name: 'upi_mandate_flowchart.png', size: '640 KB', type: 'Image' }
    ]
  },
  {
    id: 'k-3',
    title: 'DPDP Act 2023: Developer Cheat Sheet on Data Principal Consent & Privacy by Design',
    summary: 'A developer-friendly implementation guide covering consent notice requirements, purpose limitation, data minimization, and statutory right to erasure.',
    content: `### Developer Guidelines under DPDP Act 2023
Section 6 of the DPDP Act mandates that every request for consent must be accompanied by or preceded by an itemized notice in clear and plain language.

### Core Principles for Engineers
1. **Notice Specification**: Must state the personal data being collected and the explicit processing purpose.
2. **Multi-lingual Support**: The notice must be accessible in English or any of the 22 languages specified in the 8th Schedule to the Constitution of India.
3. **Withdrawal of Consent**: As easy as giving consent. If consent was given in 1 click, revocation must not require more than 1 click.
4. **Data Erasure Job**: When purpose is satisfied or consent withdrawn, automated cron must soft-delete and purge PII across cold storage within 72 hours.`,
    category: 'Security Protocol',
    tags: ['DPDP Act', 'Cyber Law', 'Compliance', 'Privacy by Design', 'India'],
    authorName: 'Meenakshi Iyer',
    authorRole: 'Admin',
    department: 'Cybersecurity & Regulatory Compliance',
    upvotes: 89,
    hasUpvoted: false,
    createdAt: '2026-09-02',
    readTime: '5 min',
    views: 740,
    commentsCount: 22,
    attachments: [
      { name: 'dpdp_compliance_matrix.pdf', size: '2.1 MB', type: 'PDF' }
    ]
  },
  {
    id: 'k-4',
    title: 'GATE CS & IT: High-Scoring Strategies for Theory of Computation & Discrete Math',
    summary: 'Written by top AIR rankers: proven shortcuts for regular expression equivalence, closure properties table, and counting principles in combinatorics.',
    content: `### High-Yield Tips for GATE CS/IT
Theory of Computation and Discrete Mathematics account for 20-25 marks in the GATE exam. These are 100% deterministic marks if concepts are crisp.

### Memorize the Closure Table
- Regular languages are closed under ALL operations (Union, Intersection, Complement, Kleene, Reversal, Homomorphism).
- CFLs are NOT closed under Intersection and Complement.
- DCFLs are closed under Complement, but NOT under Union and Intersection.

### Decidability Matrix
- Emptiness and Finiteness for Regular Languages: Decidable.
- Emptiness for CFL: Decidable (using generating symbols).
- Equivalence for CFL: Undecidable.`,
    category: 'Exam Guide',
    tags: ['GATE CS', 'Automata', 'NPTEL', 'Algorithms', 'Competitive Exams'],
    authorName: 'Rohan Deshpande',
    authorRole: 'Trainee',
    department: 'Computer Science & Engineering',
    upvotes: 68,
    hasUpvoted: false,
    createdAt: '2026-09-04',
    readTime: '7 min',
    views: 610,
    commentsCount: 18
  }
];

// Initial Trainer Submissions for Evaluation Portal
export const INITIAL_TRAINER_SUBMISSIONS: TrainerAssessmentSubmission[] = [
  {
    id: 'sub-1',
    courseId: 'cs-dsa-101',
    courseTitle: 'Data Structures & Algorithms: Enterprise Problem Solving',
    traineeId: 'usr-101',
    traineeName: 'Aarav Sharma',
    traineeEmail: 'aarav.sharma@enterprise.org',
    assignmentTitle: 'Module 3: Graph Traversal & Topological Sort Implementation',
    submittedAt: '2026-09-05 14:30',
    status: 'Pending',
    submissionText: `Implemented Kahn's algorithm for topological sorting and cycle detection in dependency resolution trees. Included unit tests with 10,000 synthetic directed acyclic graph nodes showing O(V + E) runtime scaling.`,
    fileAttachment: 'topological_sort_kahn.ts'
  },
  {
    id: 'sub-2',
    courseId: 'cs-fullstack-201',
    courseTitle: 'Modern Full-Stack Engineering (React, Node.js & PostgreSQL)',
    traineeId: 'usr-102',
    traineeName: 'Divya Nair',
    traineeEmail: 'divya.nair@enterprise.org',
    assignmentTitle: 'Module 2: JWT RBAC Authentication & Middleware Pipeline',
    submittedAt: '2026-09-04 18:15',
    status: 'Graded',
    score: 95,
    feedback: 'Exceptional defense against timing attacks and immaculate role check middleware. Excellent work on refreshing tokens securely.',
    submissionText: `Engineered express middleware verifying RS256 JWT signatures and validating dynamic permission scopes against user session claims in Redis.`
  },
  {
    id: 'sub-3',
    courseId: 'in-dpi-gov-401',
    courseTitle: 'Digital Public Infrastructure (DPI): Architecture of UPI & India Stack',
    traineeId: 'usr-103',
    traineeName: 'Kavita Sundar',
    traineeEmail: 'kavita.sundar@capacitybuilding.gov.in',
    assignmentTitle: 'Capstone: Designing High-Volume UPI Settlement Fallback',
    submittedAt: '2026-09-05 09:40',
    status: 'Pending',
    submissionText: `Authored architecture paper proposing a store-and-forward queue with Dead Letter Queues (DLQ) for NPCI clearing house timeout edge conditions during peak festive load.`,
    fileAttachment: 'upi_dlq_fallback_paper.pdf'
  }
];
