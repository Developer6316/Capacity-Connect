import React, { useState } from 'react';
import { 
  GraduationCap, 
  PlusCircle, 
  UploadCloud, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Layers, 
  Users, 
  Award, 
  Sparkles, 
  Search, 
  AlertCircle,
  Edit,
  Trash2,
  Send,
  Check
} from 'lucide-react';
import { TrainingCourse, TrainerAssessmentSubmission, UserProfile } from '../types';

interface TrainerPortalProps {
  currentUser: UserProfile;
  courses: TrainingCourse[];
  submissions: TrainerAssessmentSubmission[];
  onCreateCourse: (course: TrainingCourse) => void;
  onGradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  onUploadMaterial: (courseId: string, materialName: string, materialType: string) => void;
}

export const TrainerPortal: React.FC<TrainerPortalProps> = ({
  currentUser,
  courses,
  submissions,
  onCreateCourse,
  onGradeSubmission,
  onUploadMaterial,
}) => {
  const [activeTab, setActiveTab] = useState<'evaluate' | 'create_course' | 'materials' | 'schedule'>('evaluate');

  // Grading Modal / Active Review state
  const [activeSubmission, setActiveSubmission] = useState<TrainerAssessmentSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [gradingSuccess, setGradingSuccess] = useState<boolean>(false);

  // New Course Builder state
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseCategory, setCourseCategory] = useState<TrainingCourse['category']>('Computer Science');
  const [courseLevel, setCourseLevel] = useState<TrainingCourse['level']>('Intermediate');
  const [courseDuration, setCourseDuration] = useState(40);
  const [courseDesc, setCourseDesc] = useState('');
  const [targetSkillsInput, setTargetSkillsInput] = useState('');
  const [courseCreatedToast, setCourseCreatedToast] = useState(false);

  // Upload material state
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState('Lecture Slide Deck (PDF)');
  const [materialSuccess, setMaterialSuccess] = useState(false);

  // Milestone schedule state
  const [milestones, setMilestones] = useState([
    { id: 'ms-1', title: 'Batch 2026-A Midterm Algorithmic Evaluation', date: '2026-09-15', course: 'CS-101', cohortSize: 45, status: 'Upcoming' },
    { id: 'ms-2', title: 'National NPTEL Mock Proctored Exam Window', date: '2026-09-22', course: 'NPTEL-CS11', cohortSize: 120, status: 'Scheduled' },
    { id: 'ms-3', title: 'UPI 2.0 & India Stack Capstone Defense', date: '2026-09-28', course: 'DPI-INDIA-401', cohortSize: 32, status: 'Scheduled' }
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [newMilestoneCourse, setNewMilestoneCourse] = useState('CS-101');

  const pendingSubmissions = submissions.filter(s => s.status === 'Pending');
  const gradedSubmissions = submissions.filter(s => s.status === 'Graded');

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    onGradeSubmission(activeSubmission.id, scoreInput, feedbackInput.trim());
    setGradingSuccess(true);
    setTimeout(() => {
      setGradingSuccess(false);
      setActiveSubmission(null);
      setFeedbackInput('');
    }, 1200);
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseCode.trim()) return;

    const skills = targetSkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newCourse: TrainingCourse = {
      id: `crs-${Date.now()}`,
      code: courseCode.trim().toUpperCase(),
      title: courseTitle.trim(),
      category: courseCategory,
      description: courseDesc.trim() || 'Comprehensive course engineered for institutional capacity building.',
      instructor: currentUser.name || 'Senior Lead Trainer',
      instructorRole: 'Faculty / Lead Trainer',
      organization: currentUser.department || 'Training Academy',
      durationHours: Number(courseDuration) || 30,
      level: courseLevel,
      rating: 5.0,
      enrollmentCount: 1,
      prerequisites: ['Foundational Domain Knowledge'],
      targetSkills: skills.length > 0 ? skills : ['Core Competency', 'Practical Execution'],
      modules: [
        { id: 'm1', title: 'Module 1: Orientation & Framework Fundamentals', duration: '3h 30m', type: 'video', completed: false },
        { id: 'm2', title: 'Module 2: Practical Lab & Real-World Application', duration: '5h 00m', type: 'hands_on', completed: false },
        { id: 'm3', title: 'Module 3: Benchmark Assessment & Capstone Submission', duration: '4h 00m', type: 'quiz', completed: false }
      ],
      enrolled: false,
      progress: 0,
      certified: false,
      regionBadge: courseCategory === 'India Curricula' ? 'NPTEL / India' : 'Global CS',
      thumbnailGradient: 'from-indigo-600 to-purple-800'
    };

    onCreateCourse(newCourse);
    setCourseCreatedToast(true);
    setTimeout(() => {
      setCourseCreatedToast(false);
      setCourseTitle('');
      setCourseCode('');
      setCourseDesc('');
      setTargetSkillsInput('');
      setActiveTab('materials');
    }, 1500);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim()) return;

    onUploadMaterial(selectedCourseId, materialTitle.trim(), materialType);
    setMaterialSuccess(true);
    setTimeout(() => {
      setMaterialSuccess(false);
      setMaterialTitle('');
    }, 1500);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !newMilestoneDate) return;

    setMilestones(prev => [
      ...prev,
      {
        id: `ms-${Date.now()}`,
        title: newMilestoneTitle.trim(),
        date: newMilestoneDate,
        course: newMilestoneCourse,
        cohortSize: 50,
        status: 'Scheduled'
      }
    ]);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Trainer & Faculty Operations Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Curriculum Authoring, Milestones & Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Welcome, <strong>{currentUser.name}</strong>. Create training programs, upload materials, schedule cohorts, and evaluate trainee submissions against institutional competency benchmarks.
          </p>
        </div>

        {/* Unboxed Quick Stats */}
        <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 shrink-0 text-xs">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 block">{pendingSubmissions.length}</span>
            <span className="text-slate-400 font-mono text-[11px]">Pending Review</span>
          </div>
          <span className="text-slate-700">/</span>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">{gradedSubmissions.length}</span>
            <span className="text-slate-400 font-mono text-[11px]">Graded</span>
          </div>
          <span className="text-slate-700">/</span>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-indigo-400 block">{courses.length}</span>
            <span className="text-slate-400 font-mono text-[11px]">Active Courses</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('evaluate')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'evaluate'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          Evaluate Assessments ({pendingSubmissions.length})
        </button>

        <button
          onClick={() => setActiveTab('create_course')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'create_course'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Author New Course
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'materials'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Upload Materials & Docs
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Milestones & Cohorts
        </button>
      </div>

      {/* TAB 1: EVALUATE ASSESSMENTS */}
      {activeTab === 'evaluate' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Trainee Assessment Submissions Queue
            </h3>
            <span className="text-xs text-slate-500">
              Showing {submissions.length} total assignments
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {submissions.map(sub => (
              <div
                key={sub.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                      sub.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {sub.status}
                    </span>
                    <span className="text-xs text-slate-400">• Submitted: {sub.submittedAt}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{sub.assignmentTitle}</h4>
                  <p className="text-xs text-slate-500">
                    Course: <strong className="text-slate-700">{sub.courseTitle}</strong>
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{sub.submissionText}"
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>Trainee: <strong className="text-slate-700">{sub.traineeName}</strong> ({sub.traineeEmail})</span>
                    {sub.fileAttachment && (
                      <span className="flex items-center gap-1 text-indigo-600 font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        {sub.fileAttachment}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                  {sub.status === 'Graded' ? (
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-emerald-600">{sub.score} / 100</span>
                      <p className="text-[10px] text-slate-400">Feedback dispatched</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveSubmission(sub);
                        setScoreInput(88);
                        setFeedbackInput('');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                    >
                      Grade & Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CREATE COURSE */}
      {activeTab === 'create_course' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl space-y-6">
          <div className="space-y-1 pb-3 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Author New Capacity Building Course</h3>
            <p className="text-xs text-slate-500">
              Publish structured learning programs with modules, target competencies, and capstone milestones.
            </p>
          </div>

          {courseCreatedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Course successfully added to the digital catalog! You can now upload curriculum materials.</span>
            </div>
          )}

          <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Raft in Cloud Infrastructure"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CS-450 or NPTEL-DS01"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Computer Science">Computer Science (General)</option>
                  <option value="India Curricula">India Curricula (NPTEL / GATE / DPI)</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Cybersecurity">Cybersecurity & DPDP Act</option>
                  <option value="Leadership & Compliance">Leadership & Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty Level *</label>
                <select
                  value={courseLevel}
                  onChange={(e) => setCourseLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Practitioner)</option>
                  <option value="Advanced">Advanced (Expert)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Hours)</label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Competencies / Skills (Comma-separated)</label>
              <input
                type="text"
                value={targetSkillsInput}
                onChange={(e) => setTargetSkillsInput(e.target.value)}
                placeholder="e.g. Distributed Systems, Consensus Protocols, High Availability"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Description & Outcomes</label>
              <textarea
                rows={4}
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                placeholder="Describe the learning trajectory, target trainees, and practical lab assignments..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
              >
                Publish Course to Catalog
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: UPLOAD MATERIALS */}
      {activeTab === 'materials' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-2xl space-y-6">
          <div className="space-y-1 pb-3 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Upload Learning Materials & Resources</h3>
            <p className="text-xs text-slate-500">
              Attach slides, practice problem sets, lab guides, or video links to existing courses.
            </p>
          </div>

          {materialSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Material successfully uploaded and attached to the chosen course!</span>
            </div>
          )}

          <form onSubmit={handleAddMaterial} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Target Course *</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    [{c.code}] {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Material / Document Name *</label>
              <input
                type="text"
                required
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                placeholder="e.g. Lecture 4: Inode Structure & Virtual File System (PDF)"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Resource Modality *</label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Lecture Slide Deck (PDF)">Lecture Slide Deck (PDF)</option>
                <option value="Hands-on Code Repository (Git)">Hands-on Code Repository (Git)</option>
                <option value="Interactive Lab Guide">Interactive Lab Guide</option>
                <option value="Diagnostic Practice Quiz">Diagnostic Practice Quiz</option>
                <option value="Reference Whitepaper">Reference Whitepaper</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50">
              <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">
                Click or drag files here to attach to this course module
              </p>
              <p className="text-[11px] text-slate-400">
                Supported formats: PDF, DOCX, ZIP, MP4, IPYNB (Max 250MB)
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
              >
                Attach Resource
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: SCHEDULE MILESTONES */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Learning Milestones & Proctored Windows</h3>
              <p className="text-xs text-slate-500">
                Schedule cohort milestone dates, capstone defenses, and proctored examination windows.
              </p>
            </div>

            <form onSubmit={handleAddMilestone} className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                required
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Milestone title..."
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <input
                type="date"
                required
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <select
                value={newMilestoneCourse}
                onChange={(e) => setNewMilestoneCourse(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              >
                {courses.slice(0, 6).map(c => (
                  <option key={c.id} value={c.code}>{c.code}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500"
              >
                Add Milestone
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {milestones.map(ms => (
              <div key={ms.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase">
                    {ms.course}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {ms.date}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{ms.title}</h4>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {ms.cohortSize} enrolled trainees
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {ms.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grading Review Modal */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-fadeIn space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[11px] font-semibold text-indigo-600 uppercase">Assessment Evaluation</span>
              <h3 className="text-lg font-bold text-slate-900">{activeSubmission.assignmentTitle}</h3>
              <p className="text-xs text-slate-500">
                Trainee: {activeSubmission.traineeName} • {activeSubmission.traineeEmail}
              </p>
            </div>

            {gradingSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Grade and feedback successfully registered! Trainee scorecard updated.</span>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 space-y-1">
              <strong className="block text-slate-600">Trainee Submission Text:</strong>
              <p className="italic">"{activeSubmission.submissionText}"</p>
              {activeSubmission.fileAttachment && (
                <p className="text-indigo-600 font-medium pt-1">
                  Attached file: {activeSubmission.fileAttachment}
                </p>
              )}
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Score (0 to 100) *
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Constructive Feedback & Mentorship Remarks *
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Provide detailed feedback on algorithm complexity, edge cases, and best practices..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubmission(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Submit Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
