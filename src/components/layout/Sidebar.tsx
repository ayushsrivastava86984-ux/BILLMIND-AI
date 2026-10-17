import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Receipt,
  Sparkles,
  TrendingUp,
  Settings,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    navigateTo,
    user,
    setIsLogoutConfirmOpen,
    themeMode,
    setThemeMode,
    businessProfile,
    isSampleData,
  } = useApp();

  const navItems = [
    {
      id: 'dashboard' as AppView,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'invoices' as AppView,
      label: 'Invoices',
      icon: FileText,
      activeMatches: ['invoices', 'view-invoice', 'edit-invoice'],
    },
    {
      id: 'create-invoice' as AppView,
      label: 'Create Invoice',
      icon: PlusCircle,
    },
    {
      id: 'customers' as AppView,
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'receipts' as AppView,
      label: 'Payments & Receipts',
      icon: Receipt,
    },
    {
      id: 'assistant' as AppView,
      label: 'Ask BillMind AI',
      icon: Sparkles,
      badge: 'AI',
    },
    {
      id: 'insights' as AppView,
      label: 'Financial Insights',
      icon: TrendingUp,
    },
    {
      id: 'settings' as AppView,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const isCurrentActive = (item: typeof navItems[0]) => {
    if (item.activeMatches) {
      return item.activeMatches.includes(currentView);
    }
    return currentView === item.id;
  };

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 bg-slate-900 border-r border-slate-800 p-4 h-[calc(100vh-4rem)] sticky top-16 no-print shrink-0">
      <div>
        {/* Business Header Chip */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 mb-5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold text-xs shrink-0">
              {businessProfile.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white truncate text-xs">{businessProfile.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{businessProfile.ownerName}</p>
            </div>
          </div>
          {isSampleData && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shrink-0">
              Demo
            </span>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item);

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/15 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      active
                        ? 'bg-slate-950 text-lime-400'
                        : 'bg-lime-400/15 text-lime-400 border border-lime-400/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Theme Segmented Controls */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        {/* Theme mode 3-way toggle (Light, Dark, System) */}
        <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-1 text-[11px]">
          <button
            onClick={() => setThemeMode('light')}
            className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 font-medium transition ${
              themeMode === 'light'
                ? 'bg-lime-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Light Theme (White Mode)"
          >
            <Sun className="w-3 h-3" />
            <span className="text-[10px]">Light</span>
          </button>

          <button
            onClick={() => setThemeMode('dark')}
            className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 font-medium transition ${
              themeMode === 'dark'
                ? 'bg-lime-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Dark Theme"
          >
            <Moon className="w-3 h-3" />
            <span className="text-[10px]">Dark</span>
          </button>

          <button
            onClick={() => setThemeMode('system')}
            className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 font-medium transition ${
              themeMode === 'system'
                ? 'bg-lime-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="System Default Appearance"
          >
            <Laptop className="w-3 h-3" />
            <span className="text-[10px]">Auto</span>
          </button>
        </div>

        {/* User Card with Logout Trigger */}
        {user && (
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div
              className="flex items-center space-x-2 min-w-0 cursor-pointer"
              onClick={() => navigateTo('settings')}
              title="Open Settings"
            >
              <div className="w-7 h-7 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-bold text-white truncate max-w-[100px]">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => setIsLogoutConfirmOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
