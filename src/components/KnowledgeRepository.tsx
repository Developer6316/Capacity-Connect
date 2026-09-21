import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Tag, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  FileText, 
  Plus, 
  Share2, 
  Download, 
  Eye, 
  CheckCircle2,
  X,
  Sparkles,
  Filter,
  User,
  ShieldAlert
} from 'lucide-react';
import { KnowledgeArticle, UserProfile } from '../types';

interface KnowledgeRepositoryProps {
  articles: KnowledgeArticle[];
  currentUser: UserProfile;
  onAddArticle: (newArticle: KnowledgeArticle) => void;
  onUpvoteArticle: (articleId: string) => void;
}

export const KnowledgeRepository: React.FC<KnowledgeRepositoryProps> = ({
  articles,
  currentUser,
  onAddArticle,
  onUpvoteArticle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New article form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<KnowledgeArticle['category']>('Engineering SOP');
  const [tagInput, setTagInput] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const categories = [
    'all',
    'Engineering SOP',
    'Architecture RFC',
    'Interview Prep',
    'Exam Guide',
    'Security Protocol',
    'Code Standards'
  ];

  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      art.title.toLowerCase().includes(query) ||
      art.summary.toLowerCase().includes(query) ||
      art.tags.some(t => t.toLowerCase().includes(query)) ||
      art.authorName.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newArt: KnowledgeArticle = {
      id: `k-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      category,
      tags: tags.length > 0 ? tags : ['General', 'Documentation'],
      authorName: currentUser.name || 'Anonymous Contributor',
      authorRole: currentUser.role,
      department: currentUser.department || 'General',
      upvotes: 1,
      hasUpvoted: true,
      createdAt: new Date().toISOString().split('T')[0],
      readTime: `${Math.max(2, Math.ceil(content.split(' ').length / 180))} min`,
      views: 1,
      commentsCount: 0,
      attachments: []
    };

    onAddArticle(newArt);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setIsCreateModalOpen(false);
      setTitle('');
      setSummary('');
      setContent('');
      setTagInput('');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Centralized Knowledge Repository & Peer Wiki
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Peer-to-Peer Knowledge Sharing & Documentation
          </h1>
          <p className="text-sm text-slate-300">
            Eliminate organizational silos. Access internal engineering runbooks, architecture RFCs, certification summaries, and standard operating procedures maintained by peers and trainers.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Share Knowledge / Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search runbooks, tags, RFCs, authors..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Documentation' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map(art => (
          <div
            key={art.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              {/* Category & Read Time */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                  {art.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{art.readTime}</span>
                </div>
              </div>

              {/* Title & Summary */}
              <h3 
                onClick={() => setSelectedArticle(art)}
                className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2"
              >
                {art.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {art.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Author & Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                  {art.authorName.charAt(0)}
                </div>
                <div className="leading-tight">
                  <span className="font-semibold text-slate-800 block text-[11px]">{art.authorName}</span>
                  <span className="text-[10px] text-slate-400">{art.authorRole} • {art.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpvoteArticle(art.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all text-xs font-semibold ${
                    art.hasUpvoted
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{art.upvotes}</span>
                </button>

                <button
                  onClick={() => setSelectedArticle(art)}
                  className="px-3 py-1 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Read Doc
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Documentation Matches Your Search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or publish the first article for this category!
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
          >
            Create Knowledge Entry
          </button>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-800 uppercase tracking-wide">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs text-slate-400">• Published {selectedArticle.createdAt}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedArticle.title}</h2>
                <p className="text-xs text-slate-500">
                  By {selectedArticle.authorName} ({selectedArticle.authorRole}) • {selectedArticle.department}
                </p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-sm leading-relaxed">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
                <strong>Summary:</strong> {selectedArticle.summary}
              </div>

              {/* Content Body */}
              <div className="whitespace-pre-wrap font-sans text-sm text-slate-800 space-y-2">
                {selectedArticle.content}
              </div>

              {/* Attachments if any */}
              {selectedArticle.attachments && selectedArticle.attachments.length > 0 && (
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Attached Artifacts & Code Snippets:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedArticle.attachments.map((att, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-400">({att.size})</span>
                        </div>
                        <button
                          onClick={() => alert(`Simulated downloading: ${att.name}`)}
                          className="p-1 text-slate-500 hover:text-indigo-600 rounded"
                          title="Download artifact"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> {selectedArticle.views + 1} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" /> {selectedArticle.commentsCount} peer comments
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpvoteArticle(selectedArticle.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedArticle.hasUpvoted
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'border-slate-300 text-slate-700 hover:bg-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Upvote ({selectedArticle.upvotes})</span>
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Knowledge Article Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-slate-900">Publish to Knowledge Repository</h3>
                <p className="text-xs text-slate-500">
                  Share runbooks, guidelines, RFCs, or exam prep strategies with all organizational trainees.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {publishSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Knowledge article successfully published to the centralized repository!</span>
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document / Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Production Incident Response SOP for Microservices"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Engineering SOP">Engineering SOP</option>
                    <option value="Architecture RFC">Architecture RFC</option>
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="Exam Guide">Exam Guide</option>
                    <option value="Security Protocol">Security Protocol</option>
                    <option value="Code Standards">Code Standards</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. DevOps, Microservices, Security"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Executive Summary (1-2 sentences)
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief synopsis for quick card previews..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Content Body (Markdown supported) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide comprehensive details, checklists, architectural diagrams, or code instructions..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
                >
                  Publish to Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
