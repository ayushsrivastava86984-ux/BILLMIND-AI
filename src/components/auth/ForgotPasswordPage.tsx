import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthSidebar } from './AuthSidebar';
import { getStoredUsers } from '../../utils/auth';
import {
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { setCurrentView, resetPassword } = useApp();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'verify' | 'completed'>('request');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === trimmed);

    if (!user) {
      setErrorMsg('No registered account was found with this email address. Please verify or create an account.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 600);
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters with numbers and special symbols.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(email.trim().toLowerCase(), newPassword);
    setIsLoading(false);

    if (result.success) {
      setStep('completed');
    } else {
      setErrorMsg(result.error || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <AuthSidebar />

        <div className="p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Back & Brand Bar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentView('auth-login')}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </button>

              <div className="flex items-center space-x-1.5 lg:hidden">
                <span className="font-extrabold text-sm text-white">BillMind</span>
                <span className="text-[10px] px-1 py-0.5 rounded bg-lime-400/20 text-lime-400 font-bold">
                  AI
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">Reset Account Password</h1>
              <p className="text-xs text-slate-400 mt-1">
                {step === 'request'
                  ? 'Enter your registered email address to receive password reset verification.'
                  : step === 'verify'
                  ? `Security link verified for ${email}. Set your new secure password.`
                  : 'Your password has been successfully reset!'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Request Reset */}
            {step === 'request' && (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Registered Business Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aarav@nextgendigital.in"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm shadow-lg shadow-lime-400/20 transition active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying Account...' : 'Send Password Reset Link'}</span>
                </button>
              </form>
            )}

            {/* Step 2: Set New Password */}
            {step === 'verify' && (
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Account confirmed. Create a new strong password below.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    New Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, numbers & symbols"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
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

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm New Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm shadow-lg shadow-lime-400/20 transition active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? 'Updating Password...' : 'Save New Password & Sign In'}
                </button>
              </form>
            )}

            {/* Step 3: Success Screen */}
            {step === 'completed' && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Password Successfully Updated</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    You can now log in to your BillMind AI dashboard using your new credentials.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('auth-login')}
                  className="w-full py-2.5 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20"
                >
                  Go to Sign In
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Remembered your password? </span>
            <button
              onClick={() => setCurrentView('auth-login')}
              className="text-lime-400 font-bold hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
