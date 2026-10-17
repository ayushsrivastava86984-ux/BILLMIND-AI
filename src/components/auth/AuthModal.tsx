import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  User as UserIcon,
  Building,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Database,
  ArrowLeft,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { login, signup, setCurrentView, setIsSupabaseModalOpen } = useApp();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (isSignup) {
      if (!fullName.trim() || !businessName.trim()) {
        setErrorMsg('Please enter your full name and business name.');
        return;
      }
      signup(fullName.trim(), businessName.trim(), email.trim(), password);
    } else {
      login(email.trim(), password);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address for password reset.');
      return;
    }
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/80">
        {/* Top Back button */}
        <button
          onClick={() => setCurrentView('landing')}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-400 items-center justify-center font-bold text-xl mb-3">
            ₹
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isSignup ? 'Create your BillMind AI account' : 'Welcome back to BillMind AI'}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            {isSignup
              ? 'Start generating compliant GST invoices in minutes'
              : 'Enter your credentials to access your financial dashboard'}
          </p>
        </div>

        {/* Supabase connection transparency status */}
        <div className="mb-5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] text-slate-300">
              Supabase Auth Engine • Active Local Session
            </span>
          </div>
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="text-[11px] text-lime-400 hover:underline flex items-center space-x-1"
          >
            <Database className="w-3 h-3" />
            <span>Config</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!forgotPasswordOpen ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Business / Studio Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. NextGen Digital Studio"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="billing@yourdomain.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Password <span className="text-rose-400">*</span>
                </label>
                {!isSignup && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordOpen(true);
                      setForgotEmail(email);
                    }}
                    className="text-[11px] text-lime-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm shadow-lg shadow-lime-400/15 transition active:scale-98"
            >
              {isSignup ? 'Create Account' : 'Sign In to Dashboard'}
            </button>

            {/* Quick Demo Login Preset */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmail('aarav@nextgendigital.in');
                  setPassword('nextgen2026');
                  setFullName('Aarav Sharma');
                  setBusinessName('NextGen Digital Studio');
                  login('aarav@nextgendigital.in', 'NextGen@2026');
                }}
                className="text-xs text-slate-400 hover:text-lime-300 underline underline-offset-4"
              >
                ⚡ Quick fill demo owner account (Aarav Sharma)
              </button>
            </div>
          </form>
        ) : (
          /* Forgot Password View */
          <div className="space-y-4">
            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-semibold text-sm">Reset link dispatched</p>
                <p className="text-slate-400">
                  We sent instructions to <strong>{forgotEmail}</strong>. In production this triggers a Supabase recovery token.
                </p>
                <button
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setForgotSuccess(false);
                  }}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-slate-400">
                  Enter your registered business email address and we will provide reset instructions.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@domain.in"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs"
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Toggle between Login and Signup */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {isSignup ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(false);
                  setErrorMsg('');
                }}
                className="text-lime-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(true);
                  setErrorMsg('');
                }}
                className="text-lime-400 font-semibold hover:underline"
              >
                Sign Up Free
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
