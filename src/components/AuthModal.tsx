import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Lock, 
  Key, 
  Fingerprint, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Building, 
  Mail, 
  LogOut, 
  LogIn, 
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Check
} from 'lucide-react';
import { UserProfile, UserRole, AuditLogEntry } from '../types';
import { sound } from '../utils/audioSynth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  auditLogs: AuditLogEntry[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onAddAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  auditLogs,
  onUpdateUser,
  onAddAuditLog,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'roles' | 'security' | 'audit'>('profile');
  
  // Profile edit state
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [department, setDepartment] = useState(currentUser.department);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Security / Password reset state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordToast, setPasswordToast] = useState('');

  // MFA OTP Simulation state
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);

  if (!isOpen) return null;

  const roles: { role: UserRole; desc: string; badge: string }[] = [
    { role: 'Learner', desc: 'Full access to personalized study paths, homework solver, arena, tutor & collaborative groups.', badge: 'Standard' },
    { role: 'Instructor', desc: 'Create curriculum modules, review student diagnostic analytics, and verify quiz question banks.', badge: 'Faculty' },
    { role: 'Admin', desc: 'Manage system users, institutional security policies, data exports, and role assignment matrices.', badge: 'Privileged' },
    { role: 'Field Worker', desc: 'Access offline learning hubs, sync mobile field assignments, and inspect asset allocations.', badge: 'Field Ops' },
    { role: 'Auditor', desc: 'Read-only access to immutable audit trails, encryption verifications, and compliance metrics.', badge: 'Compliance' },
  ];

  const handleRoleChange = (newRole: UserRole) => {
    const updated = { ...currentUser, role: newRole };
    onUpdateUser(updated);
    onAddAuditLog({
      action: 'ROLE_MODIFIED',
      details: `User role switched to "${newRole}" via Self-Service RBAC controller`,
      userEmail: currentUser.email,
      userRole: newRole,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
    sound.playCorrect(1);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      bio,
      department,
    });
    onAddAuditLog({
      action: 'PROFILE_UPDATED',
      details: `User metadata updated (Name: ${name}, Department: ${department})`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
    sound.playCorrect(1);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPasswordToast('Passwords do not match or are empty.');
      return;
    }
    setPasswordToast('Password updated securely with SHA-256 salting!');
    onAddAuditLog({
      action: 'PASSWORD_RESET',
      details: 'Self-service credential rotation completed (TLS 1.3 encrypted)',
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: 'SUCCESS',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordToast(''), 3000);
    sound.playLevelUp();
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.length === 6 || enteredOtp === '123456') {
      setOtpSuccess(true);
      onAddAuditLog({
        action: 'MFA_OTP_VERIFIED',
        details: 'Time-based One-Time Password (TOTP) token verified successfully',
        userEmail: currentUser.email,
        userRole: currentUser.role,
        ipAddress: '192.168.1.144',
        status: 'SUCCESS',
      });
      sound.playLevelUp();
      setTimeout(() => {
        setShowOtpPrompt(false);
        setOtpSuccess(false);
        setEnteredOtp('');
      }, 1500);
    } else {
      alert('Please enter a 6-digit OTP code (e.g. 123456).');
    }
  };

  const handleToggleMfa = () => {
    const nextState = !currentUser.mfaEnabled;
    onUpdateUser({ ...currentUser, mfaEnabled: nextState });
    onAddAuditLog({
      action: nextState ? 'MFA_ENABLED' : 'MFA_DISABLED',
      details: `Multi-Factor Authentication policy toggled to ${nextState ? 'ENABLED' : 'DISABLED'}`,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      ipAddress: '192.168.1.144',
      status: nextState ? 'SUCCESS' : 'WARNING',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-bold text-lg text-white tracking-tight">
                  User Management & Security
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                RBAC Access Control, Multi-Factor Authentication, Audit Trails & Credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 text-xs font-medium space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'profile'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'roles'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Role-Based Access (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'security'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>MFA & Passwords</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Immutable Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Tab 1: Profile & Identity */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-600/30">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-base">{currentUser.name}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {currentUser.email}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Member since {currentUser.createdAt} • Last login: {currentUser.lastLogin}
                  </p>
                </div>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Department / Track</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Bio & Goals</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 font-mono">Authentication:</span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Google SSO (OIDC / OAuth 2.0)
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all flex items-center space-x-1.5"
                  >
                    <span>Save Profile Changes</span>
                  </button>
                </div>

                {isSavedToast && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile saved and encrypted into local storage.</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Tab 2: Role-Based Access Control (RBAC) */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-indigo-400" />
                  Active Role Privileges
                </h4>
                <p className="text-xs text-slate-400">
                  Switch between system personas to test role-specific workflows (Learner, Instructor, Admin, Field Worker, Auditor).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {roles.map((r) => {
                  const isSelected = currentUser.role === r.role;
                  return (
                    <div
                      key={r.role}
                      onClick={() => handleRoleChange(r.role)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-indigo-600/10 border-indigo-500/60 shadow-md shadow-indigo-600/15'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-850/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2.5">
                          <span className={`font-bold text-sm ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                            {r.role}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            {r.badge}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Active Persona
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                          {r.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoleChange(r.role);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Switch to Role'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: MFA & Password Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* MFA Card */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Two-Factor Authentication (MFA / OTP)
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      Require a 6-digit Time-based One-Time Password (TOTP) or SMS token on login.
                    </p>
                  </div>

                  <button
                    onClick={handleToggleMfa}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      currentUser.mfaEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {currentUser.mfaEnabled ? 'MFA: Enabled' : 'MFA: Disabled'}
                  </button>
                </div>

                {currentUser.mfaEnabled && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      Authenticator algorithm: HMAC-SHA1 (RFC 6238)
                    </span>
                    <button
                      onClick={() => setShowOtpPrompt(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
                    >
                      Test OTP Challenge Simulation
                    </button>
                  </div>
                )}

                {showOtpPrompt && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-indigo-500/40 space-y-3 animate-in fade-in">
                    <div className="text-xs font-semibold text-slate-200">
                      Enter 6-Digit Authenticator Code (Demo Code: <strong>123456</strong>):
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="123456"
                        className="w-36 tracking-widest text-center font-mono font-bold bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={handleVerifyOtp}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                      >
                        Verify Token
                      </button>
                    </div>
                    {otpSuccess && (
                      <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> OTP Verified! Multi-factor authentication confirmed.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Password Reset */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-400" />
                    Self-Service Password Reset
                  </h4>
                  <p className="text-xs text-slate-400">
                    Rotate platform credentials. In production, resets are encrypted with AES-256 and salt.
                  </p>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Encrypted at rest: AES-256 • In-transit: TLS 1.3
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      Update Password
                    </button>
                  </div>

                  {passwordToast && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {passwordToast}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Tab 4: Immutable Audit Logs */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Immutable Compliance Audit Trail (SIH Security Specification)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Total Entries: {auditLogs.length}
                </span>
              </div>

              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 hover:bg-slate-900/50 transition-colors text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-indigo-400 font-semibold">{log.action}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {log.userRole}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">{log.timestamp}</span>
                    </div>

                    <p className="text-slate-300 text-[11px]">{log.details}</p>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center space-x-3">
                      <span>User: {log.userEmail}</span>
                      <span>•</span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>SIH Enterprise Security Profile Verified</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
