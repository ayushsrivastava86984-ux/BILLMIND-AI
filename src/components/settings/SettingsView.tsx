import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeMode, BusinessProfile } from '../../types';
import {
  Settings,
  Building,
  User,
  Sun,
  Moon,
  Laptop,
  Lock,
  Save,
  CheckCircle2,
  Database,
  LogOut,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    businessProfile,
    updateBusinessProfile,
    themeMode,
    setThemeMode,
    user,
    resetPassword,
    setIsLogoutConfirmOpen,
    setIsSupabaseModalOpen,
    clearAllData,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'security'>('profile');

  // Business profile form fields
  const [profileForm, setProfileForm] = useState<BusinessProfile>({ ...businessProfile });

  // Change password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(profileForm);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (!newPassword || newPassword.length < 8) {
      setPwError('New password must have at least 8 characters with numbers and symbols.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match. Please verify your entries.');
      return;
    }

    if (!user) return;

    const result = await resetPassword(user.email, newPassword);
    if (result.success) {
      setPwSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully.');
    } else {
      setPwError(result.error || 'Password update failed.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <Settings className="w-6 h-6 text-lime-400" />
            <span>Settings & Preferences</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your Indian business profile, appearance themes, and security settings
          </p>
        </div>

        <button
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-rose-300 text-xs font-semibold transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 ${
            activeTab === 'profile'
              ? 'bg-lime-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Business Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 ${
            activeTab === 'appearance'
              ? 'bg-lime-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Theme & Appearance</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 ${
            activeTab === 'security'
              ? 'bg-lime-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Account & Security</span>
        </button>
      </div>

      {/* Tab 1: Business Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Business Identity & Invoicing Details</h2>
            <p className="text-slate-400">
              These details appear on your generated Indian GST invoices and official receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Business Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Owner / Signatory Name</label>
              <input
                type="text"
                value={profileForm.ownerName}
                onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Business Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Registered Street Address</label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">City</label>
              <input
                type="text"
                value={profileForm.city}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">State & Pincode</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Karnataka"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
                />
                <input
                  type="text"
                  placeholder="560034"
                  value={profileForm.pincode}
                  onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Indian Tax & Banking Records
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">GSTIN</label>
                <input
                  type="text"
                  value={profileForm.gstin || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, gstin: e.target.value.toUpperCase() })}
                  placeholder="29AABCN1234F1Z8"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Business PAN</label>
                <input
                  type="text"
                  value={profileForm.pan || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, pan: e.target.value.toUpperCase() })}
                  placeholder="AABCN1234F"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Instant UPI ID</label>
                <input
                  type="text"
                  value={profileForm.upiId || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, upiId: e.target.value })}
                  placeholder="yourbusiness@okaxis"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Bank Name</label>
                <input
                  type="text"
                  value={profileForm.bankName || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, bankName: e.target.value })}
                  placeholder="HDFC Bank"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={profileForm.accountNumber || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, accountNumber: e.target.value })}
                  placeholder="50200012345678"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={profileForm.ifscCode || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, ifscCode: e.target.value.toUpperCase() })}
                  placeholder="HDFC0001234"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 flex items-center space-x-1.5 transition active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Business Details</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Theme & Appearance (3 options: Light Mode, Dark Mode, System Default) */}
      {activeTab === 'appearance' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Appearance & Color Theme</h2>
            <p className="text-slate-400">
              Choose your visual style. Preferences are automatically persisted across sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Light Mode Card */}
            <div
              onClick={() => setThemeMode('light')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                themeMode === 'light'
                  ? 'border-lime-400 bg-slate-950 ring-2 ring-lime-400/30'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="h-24 rounded-xl bg-[#F8FAFC] border border-slate-200 p-2.5 flex flex-col justify-between mb-3 shadow-inner">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-12 h-2 bg-slate-900 rounded"></div>
                  <div className="w-20 h-1.5 bg-slate-400 rounded"></div>
                </div>
                <div className="w-10 h-3 bg-lime-500 rounded text-[6px] text-white flex items-center justify-center font-bold">
                  ₹ INR
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white text-sm">Light Mode</span>
                </div>
                {themeMode === 'light' && <CheckCircle2 className="w-4 h-4 text-lime-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Crisp off-white background with high-contrast text and clean borders.
              </p>
            </div>

            {/* 2. Dark Mode Card */}
            <div
              onClick={() => setThemeMode('dark')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                themeMode === 'dark'
                  ? 'border-lime-400 bg-slate-950 ring-2 ring-lime-400/30'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="h-24 rounded-xl bg-[#080D1A] border border-slate-800 p-2.5 flex flex-col justify-between mb-3 shadow-inner">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-12 h-2 bg-white rounded"></div>
                  <div className="w-20 h-1.5 bg-slate-600 rounded"></div>
                </div>
                <div className="w-10 h-3 bg-lime-400 rounded text-[6px] text-slate-950 flex items-center justify-center font-bold">
                  ₹ INR
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-white text-sm">Dark Mode</span>
                </div>
                {themeMode === 'dark' && <CheckCircle2 className="w-4 h-4 text-lime-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Deep navy & charcoal fintech background with vibrant lime accents.
              </p>
            </div>

            {/* 3. System Default Card */}
            <div
              onClick={() => setThemeMode('system')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                themeMode === 'system'
                  ? 'border-lime-400 bg-slate-950 ring-2 ring-lime-400/30'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="h-24 rounded-xl bg-gradient-to-r from-[#F8FAFC] to-[#080D1A] border border-slate-700 p-2.5 flex flex-col justify-between mb-3 shadow-inner">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-16 h-2 bg-lime-400 rounded mx-auto"></div>
                </div>
                <div className="text-[9px] font-mono text-center text-slate-400">
                  Auto-Detect OS
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Laptop className="w-4 h-4 text-slate-300" />
                  <span className="font-bold text-white text-sm">System Default</span>
                </div>
                {themeMode === 'system' && <CheckCircle2 className="w-4 h-4 text-lime-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dynamically syncs with your device's operating system preferences.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Account & Security */}
      {activeTab === 'security' && (
        <div className="space-y-6 text-xs">
          {/* Active Session Info */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Active Authenticated Session</h2>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-300">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Account Email</span>
                <p className="font-semibold text-white mt-0.5">{user?.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Security Standard</span>
                <p className="font-semibold text-emerald-400 mt-0.5 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SHA-256 Verified Session</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Database Adapter</span>
                <button
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className="font-semibold text-sky-400 hover:underline mt-0.5 flex items-center space-x-1"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Supabase Ready</span>
                </button>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordChange} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Update Account Password</h2>
              <p className="text-slate-400 mt-0.5">
                Ensure your account uses a strong password with letters, numbers, and symbols.
              </p>
            </div>

            {pwError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{pwError}</span>
              </div>
            )}

            {pwSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Password changed successfully.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs"
              >
                Change Password
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="p-6 rounded-2xl bg-rose-950/10 border border-rose-900/30 space-y-3">
            <h2 className="text-base font-bold text-rose-300">Session & Data Management</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <p className="font-semibold text-white">Log out of this device</p>
                <p className="text-slate-400 text-[11px]">
                  End your authenticated session and return to the login screen.
                </p>
              </div>
              <button
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shrink-0 flex items-center space-x-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
