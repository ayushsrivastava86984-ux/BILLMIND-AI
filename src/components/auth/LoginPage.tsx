import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthSidebar } from './AuthSidebar';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LogIn,
  KeyRound,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentView, authRedirectMessage, setAuthRedirectMessage } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your registered email address and password.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password, rememberMe);
    setIsLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('aarav@nextgendigital.in');
    setPassword('NextGen@2026');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Branding and Value Proposition (Desktop) */}
        <AuthSidebar />

        {/* Right Column: Clean, Compact Login Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Back & Brand Bar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  setAuthRedirectMessage(null);
                  setCurrentView('landing');
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <div className="flex items-center space-x-1.5 lg:hidden">
                <span className="font-extrabold text-sm text-white">BillMind</span>
                <span className="text-[10px] px-1 py-0.5 rounded bg-lime-400/20 text-lime-400 font-bold">
                  AI
                </span>
              </div>
            </div>

            {/* Welcome Heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to your account</h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your business credentials to access your financial dashboard
              </p>
            </div>

            {/* Protected Route Notice */}
            {authRedirectMessage && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authRedirectMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Business Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.in"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCurrentView('auth-forgot')}
                    className="text-xs text-lime-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-lime-400 focus:ring-lime-400/20 bg-slate-950"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm shadow-lg shadow-lime-400/20 transition active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In'}</span>
              </button>

              {/* Quick Demo Pre-fill helper */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-xs text-slate-400 hover:text-lime-400 underline underline-offset-4 flex items-center justify-center space-x-1 mx-auto"
                >
                  <KeyRound className="w-3.5 h-3.5 text-lime-400" />
                  <span>Quick-fill verified demo owner (Aarav Sharma)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Switcher */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Don't have an account yet? </span>
            <button
              onClick={() => {
                setAuthRedirectMessage(null);
                setCurrentView('auth-signup');
              }}
              className="text-lime-400 font-bold hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
