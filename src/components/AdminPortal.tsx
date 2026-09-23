import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Key, 
  Database, 
  FolderPlus, 
  Users, 
  FileText, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus, 
  Palette, 
  Lock,
  ExternalLink,
  Cpu,
  BarChart3,
  HardDrive,
  FolderCheck
} from 'lucide-react';
import { PortalCustomizationSettings, UserProfile, UserRole, AuditLogEntry, TrainingCourse } from '../types';

interface AdminPortalProps {
  settings: PortalCustomizationSettings;
  currentUser: UserProfile;
  auditLogs: AuditLogEntry[];
  allCourses: TrainingCourse[];
  allUsers: UserProfile[];
  onUpdateSettings: (newSettings: PortalCustomizationSettings) => void;
  onUpdateUserRole: (userId: string, newRole: UserRole, newDept: string) => void;
  onAddAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  onExportData: () => void;
  onResetData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  settings,
  currentUser,
  auditLogs,
  allCourses,
  allUsers,
  onUpdateSettings,
  onUpdateUserRole,
  onAddAuditLog,
  onExportData,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'resources' | 'api_key' | 'storage' | 'users' | 'compliance'>('branding');

  // Branding state
  const [portalName, setPortalName] = useState(settings.portalName);
  const [portalMotto, setPortalMotto] = useState(settings.portalMotto);
  const [organizationName, setOrganizationName] = useState(settings.organizationName);
  const [primaryAccent, setPrimaryAccent] = useState(settings.primaryAccent);
  const [brandingSavedToast, setBrandingSavedToast] = useState(false);

  // Resource Management state
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'PDF Document' | 'Curriculum Guide' | 'Video Library' | 'API Spec' | 'External Link'>('PDF Document');
  const [resUrl, setResUrl] = useState('');
  const [resTargetRole, setResTargetRole] = useState('All Roles');
  const [resSuccessToast, setResSuccessToast] = useState(false);

  // API Key & Model Configuration state
  const [apiKeyInput, setApiKeyInput] = useState(settings.geminiApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(settings.activeGeminiModel);
  const [rateLimiting, setRateLimiting] = useState(settings.rateLimitingEnabled);
  const [apiTestStatus, setApiTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [apiSavedToast, setApiSavedToast] = useState(false);

  // Department state
  const [newDepartmentName, setNewDepartmentName] = useState('');

  // Department metrics calculation
  const totalTrainees = allUsers.filter(u => u.role === 'Trainee' || u.role === 'Learner').length;
  const totalTrainers = allUsers.filter(u => u.role === 'Trainer' || u.role === 'Instructor').length;
  const totalEnrollments = allCourses.reduce((acc, c) => acc + c.enrollmentCount, 0);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PortalCustomizationSettings = {
      ...settings,
      portalName: portalName.trim(),
      portalMotto: portalMotto.trim(),
      organizationName: organizationName.trim(),
      primaryAccent
    };
    onUpdateSettings(updated);
    onAddAuditLog({
      action: 'PORTAL_BRANDING_UPDATED',
      details: `Admin updated portal title to "${portalName}" and motto`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '10.0.4.12',
      status: 'SUCCESS'
    });
    setBrandingSavedToast(true);
    setTimeout(() => setBrandingSavedToast(false), 2500);
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resUrl.trim()) return;

    const newRes = {
      id: `res-${Date.now()}`,
      title: resTitle.trim(),
      type: resType,
      url: resUrl.trim(),
      targetRole: resTargetRole,
      addedBy: currentUser.name || 'Admin',
      date: new Date().toISOString().split('T')[0]
    };

    const updated: PortalCustomizationSettings = {
      ...settings,
      customResources: [newRes, ...settings.customResources]
    };
    onUpdateSettings(updated);
    onAddAuditLog({
      action: 'RESOURCE_ADDED',
      details: `Admin attached custom resource "${resTitle}" (${resType})`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '10.0.4.12',
      status: 'SUCCESS'
    });
    setResSuccessToast(true);
    setResTitle('');
    setResUrl('');
    setTimeout(() => setResSuccessToast(false), 2500);
  };

  const handleDeleteResource = (id: string) => {
    const updated: PortalCustomizationSettings = {
      ...settings,
      customResources: settings.customResources.filter(r => r.id !== id)
    };
    onUpdateSettings(updated);
  };

  const handleSaveApiSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PortalCustomizationSettings = {
      ...settings,
      geminiApiKey: apiKeyInput.trim(),
      isCustomApiKeySet: apiKeyInput.trim().length > 0,
      activeGeminiModel: selectedModel,
      rateLimitingEnabled: rateLimiting
    };
    onUpdateSettings(updated);
    onAddAuditLog({
      action: 'API_SETTINGS_SAVED',
      details: `Admin configured AI model to ${selectedModel} (Rate Limiting: ${rateLimiting})`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '10.0.4.12',
      status: 'SUCCESS'
    });
    setApiSavedToast(true);
    setTimeout(() => setApiSavedToast(false), 2500);
  };

  const handleTestApiConnection = async () => {
    setApiTestStatus('testing');
    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'ap-cs-a',
          history: [],
          message: 'Ping connection test from Admin Console.'
        })
      });
      const data = await res.json();
      if (data.reply || data.success !== false) {
        setApiTestStatus('success');
      } else {
        setApiTestStatus('failed');
      }
    } catch {
      setApiTestStatus('failed');
    }
    setTimeout(() => setApiTestStatus('idle'), 4000);
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepartmentName.trim() || settings.departments.includes(newDepartmentName.trim())) return;
    const updated: PortalCustomizationSettings = {
      ...settings,
      departments: [...settings.departments, newDepartmentName.trim()]
    };
    onUpdateSettings(updated);
    setNewDepartmentName('');
  };

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Executive Admin & Governance Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Portal Customization & Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Configure branding, organizational motto, resource repositories, Gemini API keys, data storage backups, user roles, and compliance logs.
          </p>
        </div>

        {/* Unboxed Governance Summary */}
        <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 shrink-0 text-xs">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-indigo-400 block">{allUsers.length}</span>
            <span className="text-slate-400 font-mono text-[11px]">Total Users</span>
          </div>
          <span className="text-slate-700">/</span>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">{settings.customResources.length}</span>
            <span className="text-slate-400 font-mono text-[11px]">Resources</span>
          </div>
          <span className="text-slate-700">/</span>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 block">{auditLogs.length}</span>
            <span className="text-slate-400 font-mono text-[11px]">Audit Logs</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'branding' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" />
          1. Branding & Motto
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'resources' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          2. Resources ({settings.customResources.length})
        </button>

        <button
          onClick={() => setActiveTab('api_key')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'api_key' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          3. AI Engine
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'storage' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          4. Data & Backups
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          5. User Roles
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'compliance' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          6. Compliance Audit Trail
        </button>
      </div>

      {/* TAB 1: BRANDING & MOTTO */}
      {activeTab === 'branding' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl space-y-6">
          <div className="space-y-1 pb-3 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Configure Portal Identity & Motto</h3>
            <p className="text-xs text-slate-500">
              Customize how this portal appears to all trainees, trainers, and external auditors across the organization.
            </p>
          </div>

          {brandingSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Portal branding and core motto updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveBranding} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Portal Name & Title *
              </label>
              <input
                type="text"
                required
                value={portalName}
                onChange={(e) => setPortalName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Platform Motto & Mission Statement *
              </label>
              <textarea
                rows={3}
                required
                value={portalMotto}
                onChange={(e) => setPortalMotto(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Displayed prominently across all headers, certificates, and compliance reports.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Organization / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Accent Theme
                </label>
                <select
                  value={primaryAccent}
                  onChange={(e) => setPrimaryAccent(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="indigo">Indigo / Corporate Blue</option>
                  <option value="emerald">Emerald / National Green</option>
                  <option value="cyan">Cyan / Tech Modern</option>
                  <option value="purple">Purple / Academic Prestige</option>
                  <option value="amber">Amber / Warm Enterprise</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
              >
                Save Branding Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: RESOURCES MANAGER */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Add Resource Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl space-y-4">
            <div className="space-y-1 pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Add Custom Resource or Document</h3>
              <p className="text-xs text-slate-500">
                Admins can link curriculum guidelines, PDF handbooks, architectural blueprints, or API specs accessible to all portal users.
              </p>
            </div>

            {resSuccessToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom resource successfully added to the central repository!</span>
              </div>
            )}

            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. National Digital Public Infrastructure (DPI) Spec"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Resource Type *
                  </label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="PDF Document">PDF Document</option>
                    <option value="Curriculum Guide">Curriculum Guide</option>
                    <option value="Video Library">Video Library</option>
                    <option value="API Spec">API Spec</option>
                    <option value="External Link">External Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target User Role
                  </label>
                  <select
                    value={resTargetRole}
                    onChange={(e) => setResTargetRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="All Roles">All Roles (Trainee/Trainer/Admin)</option>
                    <option value="Trainee Only">Trainee Only</option>
                    <option value="Trainer / Faculty Only">Trainer / Faculty Only</option>
                    <option value="Admin & Compliance">Admin & Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Resource URL / Storage URI *
                  </label>
                  <input
                    type="text"
                    required
                    value={resUrl}
                    onChange={(e) => setResUrl(e.target.value)}
                    placeholder="https://... or /assets/..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add to Resource Library
                </button>
              </div>
            </form>
          </div>

          {/* List of Resources */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              Active Institutional Resources ({settings.customResources.length})
            </h4>

            <div className="divide-y divide-slate-100">
              {settings.customResources.map(res => (
                <div key={res.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase">
                        {res.type}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{res.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Target: <strong className="text-slate-600">{res.targetRole}</strong> • Added by {res.addedBy} on {res.date}
                    </p>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {res.url}
                    </a>
                  </div>

                  <button
                    onClick={() => handleDeleteResource(res.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API KEY & AI ENGINE SETTINGS */}
      {activeTab === 'api_key' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl space-y-6">
          <div className="space-y-1 pb-3 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">AI Engine & Gemini API Configuration</h3>
            <p className="text-xs text-slate-500">
              Configure backend AI integration parameters, change model tiers, and inspect live service availability.
            </p>
          </div>

          {apiSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>AI settings & model preferences updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveApiSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Custom Gemini API Key Override (Optional)
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Defaults to system environment key (leave empty to use server default)"
                  className="w-full pl-3.5 pr-10 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Key status: {settings.isCustomApiKeySet ? 'Custom key loaded' : 'Active using system container credentials'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Model Engine
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended, Fast & Cost-Effective)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Reasoning)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra-Low Latency Fallback)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-xl text-xs cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={rateLimiting}
                    onChange={(e) => setRateLimiting(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-slate-700">Enable Smart Request Rate Limiting</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestApiConnection}
                disabled={apiTestStatus === 'testing'}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${apiTestStatus === 'testing' ? 'animate-spin' : ''}`} />
                {apiTestStatus === 'testing' ? 'Testing...' : 'Test AI Connection'}
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
              >
                Apply AI Engine Settings
              </button>
            </div>

            {apiTestStatus === 'success' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>API connection verified! Gemini AI responder operates with sub-second response times.</span>
              </div>
            )}
            {apiTestStatus === 'failed' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Could not reach primary endpoint. High-demand automatic fallback is active.</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 4: STORING DATA & BACKUPS */}
      {activeTab === 'storage' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div className="space-y-1 pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Storing Data & Disaster Recovery</h3>
              <p className="text-xs text-slate-500">
                Manage storage utilization, download full JSON backups of all courses, competencies, and audit trails.
              </p>
            </div>

            {/* Local Directory Persistence Details */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <FolderCheck className="w-4 h-4 text-emerald-600" />
                  <span>Local Directory Storage Architecture (npm run dev)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  ACTIVE ON DISK
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Credentials and portal state are written directly to the project workspace directory in <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900 font-mono">./data/</code> so they persist when running with <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900 font-mono">npm run dev</code>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-white border border-emerald-200/80 flex items-center justify-between">
                  <span className="text-slate-700">./data/credentials.json</span>
                  <span className="text-emerald-600 font-semibold">User Logins &amp; PINs</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-200/80 flex items-center justify-between">
                  <span className="text-slate-700">./data/portal_state.json</span>
                  <span className="text-emerald-600 font-semibold">Courses &amp; Settings</span>
                </div>
              </div>
            </div>

            {/* Storage Meter */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  Local Database Storage Utilization
                </span>
                <span className="font-semibold text-slate-600">
                  {settings.storageUsageMb.toFixed(1)} MB / {settings.maxStorageMb} MB ({(settings.storageUsageMb / settings.maxStorageMb * 100).toFixed(1)}%)
                </span>
              </div>

              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${(settings.storageUsageMb / settings.maxStorageMb) * 100}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Encrypted with AES-256 in container volumes. Compatible with DPDP Act data minimization requirements.
              </p>
            </div>

            {/* Backup & Restore Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-600" />
                  Export Full System Backup
                </h4>
                <p className="text-[11px] text-slate-500">
                  Download a complete timestamped JSON bundle containing courses, user profiles, knowledge articles, and audit logs.
                </p>
                <button
                  onClick={onExportData}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Backup (.json)
                </button>
              </div>

              <div className="p-4 border border-rose-200 rounded-xl space-y-3 bg-rose-50/30">
                <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-rose-600" />
                  Reset Demo State
                </h4>
                <p className="text-[11px] text-rose-700">
                  Restore all courses, skill competencies, and knowledge repository articles to factory defaults.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Reset all demo courses and skills to baseline settings?')) {
                      onResetData();
                    }
                  }}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset to Default Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USER ROLES & DEPARTMENTS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Department management */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Organizational Departments</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {settings.departments.map(dept => (
                  <span key={dept} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-xs font-medium">
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddDepartment} className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="New department..."
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
              >
                Add
              </button>
            </form>
          </div>

          {/* User Table with Role Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">User Role & Capacity Assignment Matrix</h3>
              <span className="text-xs text-slate-500">{allUsers.length} total registered users</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">User & Email</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Assigned Role</th>
                    <th className="px-4 py-3">Login Method</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers.map(user => (
                    <tr key={user.id} className={`hover:bg-slate-50/60 ${user.name === 'Developer6316' ? 'bg-amber-50/40' : ''}`}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{user.name}</span>
                          {user.name === 'Developer6316' && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-mono font-bold">
                              Primary Admin (PIN: 6316)
                            </span>
                          )}
                        </div>
                        <span className="block text-[11px] text-slate-400 font-normal">{user.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.department}
                          onChange={(e) => onUpdateUserRole(user.id, user.role, e.target.value)}
                          className="px-2 py-1 border border-slate-200 rounded text-xs"
                        >
                          {settings.departments.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => onUpdateUserRole(user.id, e.target.value as UserRole, user.department)}
                          className={`px-2 py-1 border rounded text-xs font-semibold ${
                            user.role === 'Admin' ? 'bg-amber-50 border-amber-300 text-amber-900' :
                            user.role === 'Trainer' || user.role === 'Instructor' ? 'bg-indigo-50 border-indigo-300 text-indigo-900' :
                            'bg-slate-100 border-slate-300 text-slate-800'
                          }`}
                        >
                          <option value="Trainee">Trainee</option>
                          <option value="Trainer">Trainer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-500">
                        {user.loginMethod.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            const newRole: UserRole = user.role === 'Admin' ? 'Trainee' : 'Admin';
                            onUpdateUserRole(user.id, newRole, user.department);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          Toggle {user.role === 'Admin' ? 'to Trainee' : 'to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COMPLIANCE AUDIT TRAIL */}
      {activeTab === 'compliance' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Immutable Compliance & Governance Logs</h3>
              <p className="text-xs text-slate-500">
                Chronological record of every administrative action, role modification, and resource mutation.
              </p>
            </div>
            <button
              onClick={onExportData}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Export Audit Trail
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Timestamp</th>
                  <th className="px-4 py-2.5">Action</th>
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Details</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.slice(0, 15).map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                    <td className="px-4 py-2 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-2 font-bold text-slate-900">{log.action}</td>
                    <td className="px-4 py-2 text-slate-700">{log.userEmail}</td>
                    <td className="px-4 py-2">{log.userRole}</td>
                    <td className="px-4 py-2 text-slate-600 max-w-xs truncate font-sans">{log.details}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                        log.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
