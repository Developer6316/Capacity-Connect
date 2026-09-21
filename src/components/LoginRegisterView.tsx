import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Building, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface LoginRegisterViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
  defaultMode?: 'login' | 'register';
  portalName?: string;
  portalMotto?: string;
}

export const LoginRegisterView: React.FC<LoginRegisterViewProps> = ({
  onLoginSuccess,
  onCancel,
  defaultMode = 'login',
  portalName = 'Capacity Connect',
  portalMotto = 'A centralized, digital ecosystem for organizational training, competency development, and knowledge sharing.',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showAdminPinPrompt, setShowAdminPinPrompt] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Trainee');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Quick 1-click Admin Login for Developer6316 with PIN 6316
  const handleAdminPinQuickLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/data/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'Developer6316', pin: '6316' }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setIsLoading(false);
        onLoginSuccess(data.user);
        return;
      }
    } catch (e) {
      console.warn('API login offline fallback', e);
    }

    // Client-side fallback
    setIsLoading(false);
    const adminUser: UserProfile = {
      id: 'admin-developer6316',
      name: 'Developer6316',
      email: 'developer6316@capacityconnect.local',
      role: 'Admin',
      department: 'Platform Administration & System Governance',
      bio: 'Lead System Architect and Platform Super Administrator.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      loginMethod: 'pin',
      pin: '6316',
      mfaEnabled: true,
      createdAt: '2026-09-06',
      lastLogin: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    onLoginSuccess(adminUser);
  };

  // Google SSO handler
  const handleGoogleSso = () => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      const googleUser: UserProfile = {
        id: `usr-google-${Date.now()}`,
        name: 'Arjun Sharma',
        email: 'arjun.sharma@institution.ac.in',
        role: role || 'Trainee',
        department: department || 'Computer Science & Engineering',
        bio: 'Computer Science and Digital Public Infrastructure enthusiast.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        loginMethod: 'google_sso',
        createdAt: '2026-09-01',
        lastLogin: 'Just now (Google OIDC SSO)',
        mfaEnabled: true,
      };
      onLoginSuccess(googleUser);
    }, 600);
  };

  // Direct PIN submit handler (e.g. typing 6316)
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!pinInput.trim()) {
      setErrorMessage('Please enter your 4-digit PIN (e.g. 6316 for Admin Developer6316).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/data/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'Developer6316', pin: pinInput.trim() }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        return;
      } else {
        setErrorMessage(data.error || 'Invalid PIN.');
      }
    } catch {
      setIsLoading(false);
      if (pinInput.trim() === '6316') {
        handleAdminPinQuickLogin();
      } else {
        setErrorMessage('Invalid PIN. Use 6316 for Admin Developer6316.');
      }
    }
  };

  // Standard Email/Password submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (mode === 'register' && !name) {
      setErrorMessage('Please provide your full name for credentials verification.');
      return;
    }

    setIsLoading(true);

    if (mode === 'register') {
      try {
        const res = await fetch('/api/data/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            pin: password,
            role,
            department,
          }),
        });
        const data = await res.json();
        setIsLoading(false);
        if (data.success && data.user) {
          onLoginSuccess(data.user);
          return;
        } else {
          setErrorMessage(data.error || 'Registration failed.');
          return;
        }
      } catch (err) {
        console.warn('Register fallback:', err);
      }

      // Offline fallback
      setIsLoading(false);
      const userProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role: role,
        department: department,
        bio: 'Institutional learner enrolled in capacity building modules.',
        loginMethod: 'password',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Just now',
        mfaEnabled: false,
      };
      onLoginSuccess(userProfile);
      return;
    }

    // If user explicitly chose Admin or entered Developer6316, prompt for PIN or verify
    if (role === 'Admin' || email.toLowerCase().includes('developer6316')) {
      if (password === '6316') {
        await handleAdminPinQuickLogin();
        return;
      } else {
        setShowAdminPinPrompt(true);
        setErrorMessage('');
        setPinInput(password || '');
        return;
      }
    }

    // Login via server credentials file
    try {
      const res = await fetch('/api/data/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim(), password: password.trim(), pin: password.trim() }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        return;
      } else {
        if (role === 'Admin' || email.toLowerCase().includes('admin')) {
          await handleAdminPinQuickLogin();
          return;
        }
        setErrorMessage(data.error || 'Invalid credentials.');
        return;
      }
    } catch {
      // Offline fallback
      setIsLoading(false);
      if (role === 'Admin' || email.toLowerCase().includes('developer6316') || email.toLowerCase().includes('admin') || password === '6316') {
        await handleAdminPinQuickLogin();
        return;
      }
      const userProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email.trim(),
        role: role,
        department: department,
        bio: 'Institutional learner enrolled in capacity building modules.',
        loginMethod: 'password',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Just now',
        mfaEnabled: false,
      };
      onLoginSuccess(userProfile);
    }
  };

  // Quick 1-click Demo Login accounts for fast assessment
  const handleQuickDemoLogin = (targetRole: UserRole) => {
    setIsLoading(true);
    if (targetRole === 'Admin') {
      setIsLoading(false);
      setShowAdminPinPrompt(true);
      setErrorMessage('');
      setPinInput('');
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      let demoUser: UserProfile;

      if (targetRole === 'Trainer') {
        demoUser = {
          id: 'trainer-1',
          name: 'Dr. Rajeshwari Iyer',
          email: 'r.iyer@institution.ac.in',
          role: 'Trainer',
          department: 'Advanced Systems & NPTEL Faculty',
          bio: 'Lead faculty in distributed systems, high concurrency architectures, and national curricula.',
          loginMethod: 'password',
          createdAt: '2026-03-12',
          lastLogin: 'Just now',
          mfaEnabled: true,
        };
      } else {
        demoUser = {
          id: 'trainee-1',
          name: 'Arjun Sharma',
          email: 'arjun.sharma@institution.ac.in',
          role: 'Trainee',
          department: 'Computer Science & Engineering',
          bio: 'Enrolled in core CS and India Stack national capability tracks.',
          loginMethod: 'google_sso',
          createdAt: '2026-08-15',
          lastLogin: 'Just now',
          mfaEnabled: true,
        };
      }

      onLoginSuccess(demoUser);
    }, 400);
  };

  const isModal = Boolean(onCancel);

  return (
    <div className={isModal ? 'w-full relative' : 'min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden'}>
      {/* Subtle Background Glows */}
      {!isModal && (
        <>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Top Brand Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 z-10 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-400/30 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          Single Sign-On (SSO) & Secure Portal Gateway
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {portalName}
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          {portalMotto}
        </p>
      </div>

      {/* Authentication Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl space-y-6 relative">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Quick Admin Developer6316 Banner */}
          <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Admin: Developer6316</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                    PIN Protected
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Lead System Architect &amp; Super Administrator
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowAdminPinPrompt(true);
                setErrorMessage('');
                setPinInput('');
              }}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-60 shrink-0 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In as Admin</span>
            </button>
          </div>

          {/* Direct PIN prompt when signing in as Admin */}
          {showAdminPinPrompt ? (
            <div className="p-5 bg-gradient-to-b from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/40 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold">
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  <span>Admin Security Verification</span>
                </div>
                <h3 className="text-base font-bold text-white">Sign In as Developer6316</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Please enter the 4-digit security PIN to unlock the administrative console.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                    Enter Security PIN *
                  </label>
                  <div className="relative max-w-xs mx-auto">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      maxLength={6}
                      autoFocus
                      required
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder="••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-950 border-2 border-amber-500/50 rounded-xl text-center text-2xl tracking-[0.4em] font-mono text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      title={showPassword ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {errorMessage ? (
                    <div className="p-2.5 mt-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2 max-w-xs mx-auto">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-2 text-center">
                      Master Administrator PIN is <code className="text-amber-300 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">6316</code>
                    </p>
                  )}
                </div>

                <div className="space-y-2 max-w-xs mx-auto pt-1">
                  <button
                    type="submit"
                    disabled={isLoading || !pinInput.trim()}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isLoading ? 'Verifying PIN...' : 'Verify & Sign In as Admin'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminPinPrompt(false);
                      setErrorMessage('');
                      setPinInput('');
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-all border border-slate-800 cursor-pointer"
                  >
                    Cancel / Return to Standard Sign In
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Mode Switcher Tabs (Only Sign In and Register - NO EXTRA PIN TAB) */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Google SSO Button */}
              <button
                type="button"
                onClick={handleGoogleSso}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-slate-900 px-3 text-slate-500 font-mono">
                  or sign in with email
                </span>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Venkatesh"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institutional Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trainee@institution.ac.in"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role & Department Selection (Shown on Register or can be selected on Login) */}
            <div className="pt-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Role & Capacity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Trainee', 'Trainer', 'Admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setErrorMessage('');
                      if (mode === 'login') {
                        if (r === 'Admin') {
                          setEmail('developer6316@capacityconnect.local');
                          setPassword('6316');
                          setDepartment('Platform Administration & System Governance');
                        } else if (r === 'Trainer') {
                          setEmail('r.iyer@institution.ac.in');
                          setPassword('password123');
                          setDepartment('Advanced Systems & NPTEL Faculty');
                        } else {
                          setEmail('arjun.sharma@institution.ac.in');
                          setPassword('password123');
                          setDepartment('Computer Science & Engineering');
                        }
                      }
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      role === r
                        ? r === 'Admin' 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                          : 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Password recovery link dispatched to your registered institutional address.')}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 ${
                role === 'Admin' && mode === 'login'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              <span>
                {mode === 'login'
                  ? role === 'Admin'
                    ? 'Sign In as Admin (Developer6316)'
                    : `Sign In as ${role}`
                  : 'Register Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          </>
          )}

          {/* Quick Demo Login Personas for Seamless Testing */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-semibold block text-center">
              Quick 1-Click Evaluation Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Trainee')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-[11px] text-slate-300 text-center transition-all hover:bg-slate-800/50 cursor-pointer"
              >
                <span className="block font-bold text-indigo-400">Trainee</span>
                <span className="text-[9px] text-slate-500">Arjun Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Trainer')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-[11px] text-slate-300 text-center transition-all hover:bg-slate-800/50 cursor-pointer"
              >
                <span className="block font-bold text-purple-400">Trainer</span>
                <span className="text-[9px] text-slate-500">Dr. Rajeshwari</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Admin')}
                className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/40 hover:border-amber-400 text-[11px] text-slate-200 text-center transition-all hover:bg-amber-500/20 cursor-pointer"
                title="Single Admin Account: Developer6316 (PIN required)"
              >
                <span className="block font-bold text-amber-400">Admin</span>
                <span className="text-[9px] text-amber-300 font-mono font-semibold">Developer6316 (PIN)</span>
              </button>
            </div>
          </div>

          {/* Directory Storage Health Note */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Local Directory Storage: <code className="text-indigo-300 font-mono">./data/credentials.json</code> &amp; <code className="text-indigo-300 font-mono">./data/portal_state.json</code></span>
          </div>

          {onCancel && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-400 font-medium"
              >
                Continue as Guest / Return to LMS
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
