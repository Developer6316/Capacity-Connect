import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Sparkles, 
  PlayCircle, 
  FileCode, 
  Check, 
  X,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Globe2,
  Building2,
  GraduationCap,
  Plus
} from 'lucide-react';
import { TrainingCourse, CourseModuleItem } from '../types';

interface CourseCatalogViewProps {
  courses: TrainingCourse[];
  onEnroll: (courseId: string) => void;
  onNptelEnroll: (title: string) => void;
  onToggleModuleCompletion: (courseId: string, moduleId: string) => void;
  onOpenCertificateModal: (course: TrainingCourse) => void;
}

export const CourseCatalogView: React.FC<CourseCatalogViewProps> = ({
  courses,
  onEnroll,
  onNptelEnroll,
  onToggleModuleCompletion,
  onOpenCertificateModal,
}) => {
  const [activeTab, setActiveTab] = useState<'internal' | 'nptel'>('internal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [activeCourseModal, setActiveCourseModal] = useState<TrainingCourse | null>(null);

  const categories = [
    'all',
    'Computer Science',
    'India Curricula',
    'AI & Data Science',
    'Cloud & DevOps',
    'Cybersecurity',
    'Leadership & Compliance'
  ];

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      course.title.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query) ||
      course.targetSkills.some(s => s.toLowerCase().includes(query));
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const nptelMockCourses = [
    {
      id: 'nptel-cs101',
      title: 'Programming in Java',
      institution: 'IIT Kharagpur',
      duration: '12 Weeks',
      link: 'https://onlinecourses.nptel.ac.in/noc23_cs74/preview',
      enrollmentEnds: 'Jan 25, 2027',
      level: 'Undergraduate',
      image: 'bg-orange-600',
      description: 'A comprehensive guide to object-oriented programming with Java, covering core concepts, exception handling, and multithreading.'
    },
    {
      id: 'nptel-cs201',
      title: 'Data Structures and Algorithms using Python',
      institution: 'IIT Madras',
      duration: '8 Weeks',
      link: 'https://onlinecourses.nptel.ac.in/noc23_cs95/preview',
      enrollmentEnds: 'Jan 30, 2027',
      level: 'Undergraduate/Postgraduate',
      image: 'bg-indigo-600',
      description: 'Master time and space complexity, trees, graphs, and dynamic programming directly using Python standard libraries.'
    },
    {
      id: 'nptel-cs305',
      title: 'Introduction to Machine Learning',
      institution: 'IIT Kharagpur',
      duration: '12 Weeks',
      link: 'https://onlinecourses.nptel.ac.in/noc23_cs98/preview',
      enrollmentEnds: 'Feb 15, 2027',
      level: 'Postgraduate',
      image: 'bg-emerald-600',
      description: 'A rigorous mathematical foundation for ML, covering regression, SVMs, decision trees, neural networks, and clustering algorithms.'
    },
    {
      id: 'nptel-cs401',
      title: 'Cloud Computing and Distributed Systems',
      institution: 'IIT Kanpur',
      duration: '8 Weeks',
      link: 'https://onlinecourses.nptel.ac.in/noc23_cs87/preview',
      enrollmentEnds: 'Jan 28, 2027',
      level: 'Undergraduate',
      image: 'bg-blue-600',
      description: 'Architecture of distributed systems, MapReduce, virtualization, Docker, and AWS/Azure cloud fundamentals.'
    },
    {
      id: 'nptel-ee105',
      title: 'Digital Electronic Circuits',
      institution: 'IIT Kharagpur',
      duration: '12 Weeks',
      link: 'https://onlinecourses.nptel.ac.in/noc23_ee55/preview',
      enrollmentEnds: 'Feb 10, 2027',
      level: 'Undergraduate',
      image: 'bg-slate-700',
      description: 'Boolean algebra, combinational & sequential logic, and finite state machines essential for hardware engineering.'
    },
    {
      id: 'nptel-cs501',
      title: 'Deep Learning',
      institution: 'IIT Ropar',
      duration: '12 Weeks',
      link: 'https://onlinecourses.nptel.ac.in/noc23_cs76/preview',
      enrollmentEnds: 'Jan 30, 2027',
      level: 'Advanced',
      image: 'bg-rose-600',
      description: 'Comprehensive coverage of CNNs, RNNs, Autoencoders, GANs, and backpropagation optimization.'
    }
  ];

  // If a modal course is open, find the fresh version from courses state
  const currentModalCourse = activeCourseModal 
    ? courses.find(c => c.id === activeCourseModal.id) || activeCourseModal 
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Curriculum & National Frameworks</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Course Catalog & Skill Benchmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Explore programs across Core Computer Science, India Stack (UPI, Aadhaar, ONDC), Data Protection, and access the official NPTEL/SWAYAM technical curriculum.
          </p>
        </div>

        {/* Unboxed Stats */}
        <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 shrink-0 text-xs">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-white block">{courses.length}</span>
            <span className="text-slate-400 font-mono text-[11px]">Curricula</span>
          </div>
          <span className="text-slate-700">/</span>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">
              {courses.filter(c => c.enrolled).length}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Enrolled</span>
          </div>
          <span className="text-slate-700">/</span>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 block">
              {nptelMockCourses.length}+
            </span>
            <span className="text-slate-400 font-mono text-[11px]">NPTEL Tracks</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('internal')}
            className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'internal' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Internal Curricula
          </button>
          <button
            onClick={() => setActiveTab('nptel')}
            className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'nptel' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Official NPTEL Catalog
          </button>
        </div>
      </div>

      {activeTab === 'internal' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filters and Search Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, code (e.g. CS-101), or skill..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Level:</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  {cat === 'all' ? 'All Curricula' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header Gradient / Banner */}
                  <div className={`h-24 bg-gradient-to-r ${course.thumbnailGradient || 'from-indigo-600 to-slate-800'} p-4 flex flex-col justify-between text-white relative`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/30 backdrop-blur-sm uppercase tracking-wider font-mono">
                        {course.code}
                      </span>
                      {course.regionBadge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900 font-mono">
                          {course.regionBadge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-white/90">
                      <span>{course.category}</span>
                      <span>{course.level}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <h3 
                      onClick={() => setActiveCourseModal(course)}
                      className="font-bold text-white text-sm hover:text-indigo-400 cursor-pointer line-clamp-2 transition-colors leading-snug"
                    >
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Target Skills Tags */}
                    <div className="flex flex-wrap gap-1">
                      {course.targetSkills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 rounded text-[10px] font-mono">
                          {skill}
                        </span>
                      ))}
                      {course.targetSkills.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-500 font-mono">
                          +{course.targetSkills.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Instructor & Duration */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{course.durationHours} hrs</span>
                      </div>
                    </div>

                    {/* Progression Bar if Enrolled */}
                    {course.enrolled && (
                      <div className="pt-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-indigo-400 font-medium">Trainee Progress</span>
                          <span className="font-bold font-mono text-white">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => setActiveCourseModal(course)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    Syllabus & Modules
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {course.enrolled ? (
                    course.progress === 100 ? (
                      <button
                        onClick={() => onOpenCertificateModal(course)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Certificate
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Enrolled
                      </span>
                    )
                  ) : (
                    <button
                      onClick={() => onEnroll(course.id)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Courses Match Your Filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria or explore our general Computer Science curricula.
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedLevel('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'nptel' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex items-start gap-4">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-lg shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-orange-900">National Programme on Technology Enhanced Learning (NPTEL)</h3>
              <p className="text-xs text-orange-800 mt-1 leading-relaxed">
                NPTEL is a project of MHRD initiated by seven Indian Institutes of Technology (Bombay, Delhi, Kanpur, Kharagpur, Madras, Guwahati and Roorkee) along with the Indian Institute of Science, Bangalore. Explore the official SWAYAM portal for certification courses.
              </p>
              <div className="mt-3">
                <a 
                  href="https://nptel.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-200 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-colors"
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  Visit Official NPTEL Portal
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Featured Upcoming NPTEL Courses</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Redirects to SWAYAM Enrollment
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {nptelMockCourses.map(course => (
              <div
                key={course.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className={`h-20 ${course.image} p-4 flex flex-col justify-between text-white relative`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/30 backdrop-blur-sm uppercase tracking-wider font-mono">
                        NPTEL SWAYAM
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-white text-sm leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Institution:</span>
                        <span className="text-slate-300 font-medium">{course.institution}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Duration:</span>
                        <span className="text-slate-300 font-mono">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Level:</span>
                        <span className="text-slate-300 font-medium">{course.level}</span>
                      </div>
                      <div className="flex items-center justify-between text-amber-400 font-mono">
                        <span className="text-slate-500">Enrollment Ends:</span>
                        <span>{course.enrollmentEnds}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-800/80">
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onNptelEnroll(course.title)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold border border-slate-800 transition-colors"
                  >
                    <span>Enroll on SWAYAM</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Detail & Interactive Syllabus Modal (Internal Courses) */}
      {currentModalCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className={`p-5 sm:p-6 bg-gradient-to-r ${currentModalCourse.thumbnailGradient || 'from-indigo-900 to-slate-900'} text-white flex items-start justify-between gap-4`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/40 backdrop-blur-sm uppercase tracking-wider font-mono">
                    {currentModalCourse.code}
                  </span>
                  <span className="text-xs text-indigo-200 font-mono">
                    {currentModalCourse.category} · {currentModalCourse.level}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold">{currentModalCourse.title}</h2>
                <p className="text-xs text-slate-200">
                  Led by {currentModalCourse.instructor} ({currentModalCourse.instructorRole}) · {currentModalCourse.organization}
                </p>
              </div>
              <button
                onClick={() => setActiveCourseModal(null)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg shrink-0 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-300 text-xs leading-relaxed">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Program Overview & Learning Outcomes
                </h4>
                <p className="text-slate-300">{currentModalCourse.description}</p>
              </div>

              {/* Target Skills */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Competencies Acquired
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentModalCourse.targetSkills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-indigo-300 rounded text-xs font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Modules Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Modules & Interactive Syllabus ({currentModalCourse.modules.length})
                  </h4>
                  {currentModalCourse.enrolled && (
                    <span className="text-xs font-mono text-indigo-400">
                      Progress: {currentModalCourse.progress}% Completed
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {currentModalCourse.modules.map(mod => (
                    <div
                      key={mod.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                        mod.completed ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          disabled={!currentModalCourse.enrolled}
                          onClick={() => onToggleModuleCompletion(currentModalCourse.id, mod.id)}
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            mod.completed 
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                              : 'border-slate-700 bg-slate-900 hover:border-indigo-500'
                          } ${!currentModalCourse.enrolled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {mod.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{mod.title}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase font-mono">
                              {mod.type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">Duration: {mod.duration}</p>
                        </div>
                      </div>

                      <div>
                        {mod.completed ? (
                          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">
                            {currentModalCourse.enrolled ? 'Mark Complete' : 'Enroll to Access'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                {!currentModalCourse.enrolled && (
                  <span className="text-xs text-slate-400">
                    Free institutional enrollment for all verified trainees.
                  </span>
                )}
                {currentModalCourse.enrolled && currentModalCourse.progress === 100 && (
                  <span className="text-xs font-mono text-emerald-400">
                    All modules completed! Certified ready for issue.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setActiveCourseModal(null)}
                  className="px-4 py-2 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Close
                </button>

                {currentModalCourse.enrolled ? (
                  currentModalCourse.progress === 100 ? (
                    <button
                      onClick={() => {
                        onOpenCertificateModal(currentModalCourse);
                        setActiveCourseModal(null);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      View Certificate
                    </button>
                  ) : (
                    <span className="px-3.5 py-1.5 bg-indigo-950/40 text-indigo-300 rounded-lg text-xs font-mono border border-indigo-800/50">
                      Enrolled ({currentModalCourse.progress}%)
                    </span>
                  )
                ) : (
                  <button
                    onClick={() => {
                      onEnroll(currentModalCourse.id);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Enroll in Course
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
