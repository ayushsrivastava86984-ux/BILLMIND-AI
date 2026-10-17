import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthSidebar } from './AuthSidebar';
import { validatePasswordRules } from '../../utils/auth';
import {
  Lock,
  Mail,
  User,
  Building,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { signup, setCurrentView } = useApp();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Live password validation checklist
  const passwordRules = useMemo(() => {
    return validatePasswordRules(password);
  }, [password]);

  const isPasswordMatch = useMemo(() => {
    return confirmPassword.length > 0 && password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !businessName.trim()) {
      setErrorMsg('Please enter your full name and business/studio name.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please provide a valid business email address.');
      return;
    }

    if (!passwordRules.isValid) {
      setErrorMsg('Password does not meet the security criteria. Please follow the checklist below.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    const result = await signup(fullName.trim(), businessName.trim(), email.trim(), password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Account creation failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Value Prop */}
        <AuthSidebar />

        {/* Right Column: Sign Up Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Back & Brand Bar */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => setCurrentView('landing')}
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

            {/* Title */}
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-white tracking-tight">Create your business account</h1>
              <p className="text-xs text-slate-400 mt-1">
                Start creating GST-compliant rupee invoices in under 2 minutes
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name & Business Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Priya Nair"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Business Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Studio or Agency"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="billing@yourdomain.in"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Create Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 number & 1 special"
                    required
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Live Password Validation Checklist */}
              {password.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] grid grid-cols-2 gap-1.5 text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    {passwordRules.hasMinLength ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-slate-600" />
                    )}
                    <span className={passwordRules.hasMinLength ? 'text-slate-200' : ''}>
                      8+ characters
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {passwordRules.hasNumber ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-slate-600" />
                    )}
                    <span className={passwordRules.hasNumber ? 'text-slate-200' : ''}>
                      At least 1 number
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {passwordRules.hasSpecial ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-slate-600" />
                    )}
                    <span className={passwordRules.hasSpecial ? 'text-slate-200' : ''}>
                      1 special symbol (!@#)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {isPasswordMatch ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-slate-600" />
                    )}
                    <span className={isPasswordMatch ? 'text-emerald-300 font-medium' : ''}>
                      Passwords match
                    </span>
                  </div>
                </div>
              )}

              {/* Terms and Privacy Checkbox */}
              <div className="pt-1">
                <label className="flex items-start space-x-2 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="w-4 h-4 rounded border-slate-700 text-lime-400 focus:ring-lime-400/20 bg-slate-950 mt-0.5"
                  />
                  <span>
                    I agree to the <strong className="text-slate-200">Terms of Service</strong> and{' '}
                    <strong className="text-slate-200">Privacy Policy</strong> for Indian financial data.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-lg shadow-lime-400/20 transition active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
              </button>
            </form>
          </div>

          {/* Bottom Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <button
              onClick={() => setCurrentView('auth-login')}
              className="text-lime-400 font-bold hover:underline"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
