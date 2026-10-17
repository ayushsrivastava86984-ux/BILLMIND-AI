import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, X, AlertTriangle, ShieldAlert } from 'lucide-react';

export const LogoutConfirmModal: React.FC = () => {
  const { isLogoutConfirmOpen, setIsLogoutConfirmOpen, logout, user } = useApp();

  if (!isLogoutConfirmOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm no-print">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-xs">
        <button
          onClick={() => setIsLogoutConfirmOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Confirm Log Out</h2>
            <p className="text-slate-400 text-[11px]">End active authenticated session</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-5 space-y-1.5 text-slate-300">
          <p>
            Are you sure you want to log out of <strong>{user?.businessName || 'BillMind AI'}</strong>?
          </p>
          <p className="text-slate-400 text-[11px]">
            Protected business records, pending bills, and financial insights will be safely locked until you sign in again.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsLogoutConfirmOpen(false)}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={logout}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
