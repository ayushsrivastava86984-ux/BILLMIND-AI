import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, TrendingUp, IndianRupee } from 'lucide-react';
import { Logo } from '../common/Logo';

export const AuthSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 bg-slate-900 border-r border-slate-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand */}
      <div>
        <div className="mb-8">
          <Logo size="lg" />
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
          Create Bills. Get Paid. <br />
          <span className="text-lime-400">Grow Smarter.</span>
        </h2>
        <p className="text-xs text-slate-400 mt-2.5 leading-relaxed max-w-sm">
          The all-in-one financial and invoicing platform built specifically for Indian freelancers, tutors, studios, and small business owners.
        </p>

        {/* Feature Highlights */}
        <div className="mt-8 space-y-4 text-xs">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-white">100% Indian Rupee (₹) Native</p>
              <p className="text-slate-400 text-[11px]">
                Built-in GST rates, Lakhs & Crores grouping, and amount in words.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-white">AI Invoice Drafting & Assistant</p>
              <p className="text-slate-400 text-[11px]">
                Turn short service descriptions into complete, editable tax bills.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white">Server-Verified Payment Capture</p>
              <p className="text-slate-400 text-[11px]">
                PayPal Sandbox and Indian UPI QR with automated payment receipts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security Badge */}
      <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SHA-256 Encrypted Credential Security</span>
        </span>
        <span className="font-mono text-slate-500">Asia/Kolkata</span>
      </div>
    </div>
  );
};
