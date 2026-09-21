import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Award,
  RefreshCw,
  Plus,
  BarChart2,
  Check
} from 'lucide-react';
import { SkillCompetency, TrainingCourse } from '../types';

interface SkillGapTrackerProps {
  competencies: SkillCompetency[];
  allCourses: TrainingCourse[];
  targetJobRole: string;
  onUpdateCompetencies: (updated: SkillCompetency[]) => void;
  onEnrollCourse: (courseId: string) => void;
  onViewCourseDetails: (course: TrainingCourse) => void;
}

export const SkillGapTracker: React.FC<SkillGapTrackerProps> = ({
  competencies,
  allCourses,
  targetJobRole,
  onUpdateCompetencies,
  onEnrollCourse,
  onViewCourseDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [newSelfRating, setNewSelfRating] = useState<number>(3);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState<boolean>(false);
  const [diagnosticToast, setDiagnosticToast] = useState<string>('');

  const categories = ['all', 'Core CS', 'Cloud & Infra', 'Data & AI', 'Security & Law', 'System Architecture'];

  const filteredCompetencies = selectedCategory === 'all'
    ? competencies
    : competencies.filter(c => c.category === selectedCategory);

  // Aggregated analytics
  const criticalGapsCount = competencies.filter(c => c.gapScore >= 2).length;
  const moderateGapsCount = competencies.filter(c => c.gapScore === 1).length;
  const proficientCount = competencies.filter(c => c.gapScore <= 0).length;

  const totalRequiredPoints = competencies.reduce((acc, c) => acc + c.targetLevel, 0);
  const currentTotalPoints = competencies.reduce((acc, c) => acc + Math.min(c.currentLevel, c.targetLevel), 0);
  const organizationalReadiness = Math.round((currentTotalPoints / (totalRequiredPoints || 1)) * 100);

  const handleUpdateRating = (id: string, newLevel: number) => {
    const updated = competencies.map(c => {
      if (c.id === id) {
        const gap = Math.max(0, c.targetLevel - newLevel);
        const priority: 'Critical' | 'Moderate' | 'Proficient' = 
          gap >= 2 ? 'Critical' : gap === 1 ? 'Moderate' : 'Proficient';
        return {
          ...c,
          currentLevel: newLevel,
          gapScore: gap,
          priority,
          assessedDate: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    });
    onUpdateCompetencies(updated);
    setEditingSkillId(null);
  };

  const handleRunAiDiagnostic = () => {
    setIsDiagnosticRunning(true);
    setTimeout(() => {
      // Simulate calibrated skill test results
      const calibrated = competencies.map(c => {
        const adjustedCurrent = Math.min(5, Math.max(1, c.currentLevel + (Math.random() > 0.6 ? 1 : 0)));
        const gap = Math.max(0, c.targetLevel - adjustedCurrent);
        return {
          ...c,
          currentLevel: adjustedCurrent,
          gapScore: gap,
          priority: (gap >= 2 ? 'Critical' : gap === 1 ? 'Moderate' : 'Proficient') as 'Critical' | 'Moderate' | 'Proficient',
          assessedDate: new Date().toISOString().split('T')[0]
        };
      });
      onUpdateCompetencies(calibrated);
      setIsDiagnosticRunning(false);
      setDiagnosticToast('Diagnostic assessment completed! Competency radar calibrated with latest organizational benchmarks.');
      setTimeout(() => setDiagnosticToast(''), 4500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header & Motto Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <Target className="w-3.5 h-3.5" />
              Dynamic Skill Gap Identification & Mapping Engine
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Target Role: <span className="text-indigo-400">{targetJobRole || 'Senior Cloud & Systems Architect'}</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our automated competency diagnostic maps your current proficiency against national and enterprise role benchmarks.
              Identified skill gaps directly pair with verified modules to accelerate your training progression.
            </p>
          </div>

          {/* Readiness Dial Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${organizationalReadiness}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold text-white">{organizationalReadiness}%</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Readiness</span>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-slate-300 font-medium">Critical Gaps: <strong className="text-white">{criticalGapsCount}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-slate-300 font-medium">Moderate: <strong className="text-white">{moderateGapsCount}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-medium">Proficient: <strong className="text-white">{proficientCount}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Aligned with National Occupational Standards (NOS) & Enterprise Competency Matrix</span>
          </div>
          <button
            onClick={handleRunAiDiagnostic}
            disabled={isDiagnosticRunning}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
            {isDiagnosticRunning ? 'Calibrating Competency Baseline...' : 'Re-Run Diagnostic Assessment'}
          </button>
        </div>
      </div>

      {diagnosticToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{diagnosticToast}</span>
        </div>
      )}

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Competency Domain:</span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Competencies' : cat}
          </button>
        ))}
      </div>

      {/* Competency Gap Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCompetencies.map(comp => {
          // Find matching recommended courses
          const matchingCourses = allCourses.filter(c => comp.recommendedCourseIds.includes(c.id));

          return (
            <div 
              key={comp.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Badge & Category */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                      {comp.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {comp.name}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    comp.priority === 'Critical'
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : comp.priority === 'Moderate'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}>
                    {comp.priority === 'Critical' ? 'Critical Gap (-' + comp.gapScore + ')' :
                     comp.priority === 'Moderate' ? 'Moderate Gap (-' + comp.gapScore + ')' : 'Proficient'}
                  </span>
                </div>

                {/* Level Comparison Meter */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">
                      Current Proficiency: <strong className="text-slate-900">Level {comp.currentLevel} / 5</strong>
                    </span>
                    <span className="text-slate-600 font-medium">
                      Role Benchmark: <strong className="text-indigo-600">Level {comp.targetLevel} / 5</strong>
                    </span>
                  </div>

                  {/* Dual Bar visualization */}
                  <div className="relative h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                    {/* Target marker */}
                    <div 
                      className="absolute top-0 bottom-0 bg-indigo-200 rounded-full"
                      style={{ width: `${(comp.targetLevel / 5) * 100}%` }}
                    />
                    {/* Current level */}
                    <div 
                      className={`absolute top-0 bottom-0 rounded-full transition-all duration-500 ${
                        comp.priority === 'Critical' ? 'bg-rose-500' :
                        comp.priority === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(comp.currentLevel / 5) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Assessed: {comp.assessedDate}</span>
                    <button
                      onClick={() => {
                        setEditingSkillId(editingSkillId === comp.id ? null : comp.id);
                        setNewSelfRating(comp.currentLevel);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                    >
                      {editingSkillId === comp.id ? 'Cancel' : 'Update Self-Rating'}
                    </button>
                  </div>

                  {/* Inline self-rating editor */}
                  {editingSkillId === comp.id && (
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3 animate-fadeIn">
                      <span className="text-xs font-medium text-slate-700">Select Proficiency:</span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => setNewSelfRating(lvl)}
                            className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                              newSelfRating === lvl 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleUpdateRating(comp.id, newSelfRating)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Automated Course Recommendation */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Recommended Modules to Close This Gap:</span>
                </div>

                <div className="space-y-2">
                  {matchingCourses.map(course => (
                    <div 
                      key={course.id}
                      className="p-2.5 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 rounded-lg flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 rounded text-slate-700 font-semibold">
                            {course.code}
                          </span>
                          <span className="text-xs font-medium text-slate-900 truncate">
                            {course.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {course.durationHours}h • {course.level} • by {course.instructor}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {course.enrolled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-medium">
                            <Check className="w-3 h-3" />
                            {course.progress}%
                          </span>
                        ) : (
                          <button
                            onClick={() => onEnrollCourse(course.id)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all"
                          >
                            Enroll to Close Gap
                          </button>
                        )}
                        <button
                          onClick={() => onViewCourseDetails(course)}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                          title="View Syllabus & Modules"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
