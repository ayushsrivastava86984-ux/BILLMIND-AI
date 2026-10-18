import React, { useState, useRef, useEffect } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  PlusCircle,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  Receipt,
  Database,
  Sun,
  Moon,
  Laptop,
  Settings,
  ChevronDown,
  Building2,
  Users,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import { Logo } from '../common/Logo';

export const Navbar: React.FC = () => {
  const {
    currentView,
    navigateTo,
    user,
    setIsLogoutConfirmOpen,
    isSampleData,
    loadSampleData,
    clearAllData,
    setIsSupabaseModalOpen,
    themeMode,
    setThemeMode,
    resolvedTheme,
    businessProfile,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataDropdownOpen, setDataDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (view: AppView) => {
    navigateTo(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <Logo size="md" />

          {/* Center Navigation Links (Visible on public landing or tablet) */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-medium">
            {!user ? (
              <>
                <button
                  onClick={() => handleNav('landing')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentView === 'landing'
                      ? 'text-lime-400 bg-slate-800/80 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNav('auth-login')}
                  className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/40"
                >
                  Features
                </button>
                <button
                  onClick={() => handleNav('auth-login')}
                  className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/40"
                >
                  Pricing
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'text-lime-400 bg-slate-800/80 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('invoices')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentView === 'invoices' || currentView === 'view-invoice' || currentView === 'edit-invoice'
                      ? 'text-lime-400 bg-slate-800/80 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Invoices
                </button>
                <button
                  onClick={() => handleNav('customers')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentView === 'customers'
                      ? 'text-lime-400 bg-slate-800/80 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Customers
                </button>
                <button
                  onClick={() => handleNav('assistant')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                    currentView === 'assistant'
                      ? 'text-lime-400 bg-slate-800/80 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                  <span>Ask AI</span>
                </button>
                <button
                  onClick={() => handleNav('insights')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentView === 'insights'
                      ? 'text-lime-400 bg-slate-800/80 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Insights
                </button>
              </>
            )}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Currency & Region Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">₹ INR</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Asia/Kolkata</span>
            </div>

            {/* Sample Data Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDataDropdownOpen(!dataDropdownOpen)}
                className={`text-xs px-2.5 py-1 rounded-md border flex items-center space-x-1 transition ${
                  isSampleData
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
                title="Manage sample dataset"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>{isSampleData ? 'Demo Active' : 'Live Data'}</span>
              </button>

              {dataDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-2 z-50 text-xs"
                  onClick={() => setDataDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-slate-400 text-[11px] border-b border-slate-800 mb-1">
                    Dataset Management
                  </div>
                  <button
                    onClick={loadSampleData}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800/80 flex items-center space-x-2"
                  >
                    <span>🔄 Load Indian Demo Data</span>
                  </button>
                  <button
                    onClick={clearAllData}
                    className="w-full text-left px-3 py-2 text-rose-300 hover:bg-slate-800/80 flex items-center space-x-2"
                  >
                    <span>🗑️ Clear All & Start Fresh</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme 3-way Switcher Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs transition"
                title="Switch Theme"
              >
                {themeMode === 'light' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : themeMode === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                ) : (
                  <Laptop className="w-3.5 h-3.5 text-lime-400" />
                )}
                <span className="text-[11px] capitalize font-medium">{themeMode}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1.5 z-50 text-xs">
                  <button
                    onClick={() => {
                      setThemeMode('light');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 ${
                      themeMode === 'light' ? 'text-lime-400 font-bold bg-slate-800/60' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    onClick={() => {
                      setThemeMode('dark');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 ${
                      themeMode === 'dark' ? 'text-lime-400 font-bold bg-slate-800/60' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-sky-400" />
                    <span>Dark Mode</span>
                  </button>
                  <button
                    onClick={() => {
                      setThemeMode('system');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 ${
                      themeMode === 'system' ? 'text-lime-400 font-bold bg-slate-800/60' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-lime-400" />
                    <span>System Default</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Action: Create Invoice */}
            <button
              onClick={() => handleNav('create-invoice')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-lime-400/10 transition active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Invoice</span>
            </button>

            {/* User Account Avatar & Dropdown Menu */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-800">
                      <p className="font-bold text-white text-xs truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <p className="text-[10px] text-lime-400 font-semibold truncate mt-0.5">{user.businessName}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNav('dashboard')}
                        className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center space-x-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={() => handleNav('settings')}
                        className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center space-x-2"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Profile & Business Details</span>
                      </button>
                      <button
                        onClick={() => handleNav('settings')}
                        className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center space-x-2"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Settings & Themes</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsSupabaseModalOpen(true);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-sky-300 hover:bg-slate-800/70 flex items-center space-x-2"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Database Configuration</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setIsLogoutConfirmOpen(true);
                        }}
                        className="w-full text-left px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNav('auth-login')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log in</span>
                </button>
                <button
                  onClick={() => handleNav('auth-signup')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold transition shadow-sm"
                >
                  <span>Sign up free</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Header Controls */}
          <div className="flex lg:hidden items-center space-x-1.5">
            <button
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : themeMode === 'light' ? 'system' : 'dark')}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
              title="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-sky-400" />
              )}
            </button>

            {user && (
              <button
                onClick={() => handleNav('create-invoice')}
                className="p-1.5 rounded-lg bg-lime-400 text-slate-950 font-bold"
                title="Create Invoice"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
            <span>Currency: ₹ INR (Asia/Kolkata)</span>
            {isSampleData && <span className="text-amber-400 font-semibold">Demo Data Active</span>}
          </div>

          {user ? (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-900 rounded-lg flex items-center space-x-2 font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNav('invoices')}
                className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-900 rounded-lg flex items-center space-x-2 font-medium"
              >
                <FileText className="w-4 h-4" />
                <span>Invoices</span>
              </button>
              <button
                onClick={() => handleNav('create-invoice')}
                className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-900 rounded-lg flex items-center space-x-2 font-medium"
              >
                <PlusCircle className="w-4 h-4 text-lime-400" />
                <span>+ Create Invoice</span>
              </button>
              <button
                onClick={() => handleNav('customers')}
                className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-900 rounded-lg flex items-center space-x-2 font-medium"
              >
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </button>
              <button
                onClick={() => handleNav('receipts')}
                className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-900 rounded-lg flex items-center space-x-2 font-medium"
              >
                <Receipt className="w-4 h-4" />
                <span>Payments & Receipts</span>
              </button>
              <button
                onClick={() => handleNav('assistant')}
                className="w-full text-left py-2 px-3 text-lime-400 hover:bg-slate-900 rounded-lg flex items-center space-x-2 font-medium"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask BillMind AI</span>
              </button>
              <button
                onClick={() => handleNav('insights')}
                className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-900 rounded-lg flex items-center space-x-2 font-medium"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Financial Insights</span>
              </button>
              <button
                onClick={() => handleNav('settings')}
                className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-900 rounded-lg flex items-center space-x-2 font-medium"
              >
                <Settings className="w-4 h-4" />
                <span>Settings & Profile</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('landing')}
                className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-900 rounded-lg"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('auth-login')}
                className="w-full text-left py-2 px-3 text-lime-400 font-bold hover:bg-slate-900 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('auth-signup')}
                className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-900 rounded-lg"
              >
                Create Account
              </button>
            </>
          )}

          {/* Theme Switcher Row in Mobile */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between py-1 px-3 text-slate-400 text-xs">
              <span>Theme Mode</span>
              <div className="flex items-center space-x-1">
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setThemeMode(mode)}
                    className={`px-2 py-1 rounded capitalize text-[10px] font-semibold ${
                      themeMode === mode ? 'bg-lime-400 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Logout / Login Footer in Mobile */}
          {user && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-3">
              <span className="font-semibold text-slate-300">{user.name}</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLogoutConfirmOpen(true);
                }}
                className="text-xs text-rose-400 hover:underline flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
