import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  X,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  ExternalLink,
  Info,
} from 'lucide-react';

export const SupabaseSetupModal: React.FC = () => {
  const { isSupabaseModalOpen, setIsSupabaseModalOpen, showToast } = useApp();
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isSupabaseModalOpen) return null;

  const sqlSchema = `-- ========================================================
-- BillMind AI - Supabase PostgreSQL Schema & Security Rules
-- ========================================================

-- 1. Businesses Table
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users on delete cascade,
  name text not null,
  owner_name text not null,
  email text not null,
  phone text,
  address text,
  city text,
  state text,
  pincode text,
  gstin text,
  pan text,
  upi_id text,
  created_at timestamp with time zone default now()
);

-- 2. Customers Table
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  address text,
  gstin text,
  created_at timestamp with time zone default now()
);

-- 3. Invoices Table (INR Native)
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  customer_id uuid references customers(id),
  invoice_number text not null,
  issue_date date not null,
  due_date date not null,
  subtotal numeric(12, 2) not null,
  tax_rate numeric(5, 2) default 18.00,
  tax_amount numeric(12, 2) default 0.00,
  discount_rate numeric(5, 2) default 0.00,
  discount_amount numeric(12, 2) default 0.00,
  total_amount numeric(12, 2) not null,
  currency text default 'INR',
  status text not null check (status in ('Draft', 'Pending', 'Paid', 'Overdue', 'Cancelled')),
  notes text,
  payment_terms text,
  payment_reference text,
  created_at timestamp with time zone default now()
);

-- 4. Line Items Table
create table if not exists invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(12, 2) not null,
  amount numeric(12, 2) not null
);

-- 5. Payments & Verified Transactions Table
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id) on delete cascade,
  amount numeric(12, 2) not null,
  currency text default 'INR',
  payment_method text not null,
  transaction_ref text not null,
  receipt_number text not null,
  captured_at timestamp with time zone default now()
);

-- Row Level Security (RLS) Policies
alter table businesses enable row level security;
alter table customers enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table payments enable row level security;

create policy "Users manage their own businesses"
  on businesses for all
  using (auth.uid() = owner_id);

create policy "Businesses manage their own customers"
  on customers for all
  using (business_id in (select id from businesses where owner_id = auth.uid()));

create policy "Businesses manage their own invoices"
  on invoices for all
  using (business_id in (select id from businesses where owner_id = auth.uid()));

create policy "Customers can view public shared invoices"
  on invoices for select
  using (true);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    showToast('Supabase SQL Schema copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm no-print">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setIsSupabaseModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Database & Supabase Integration</h2>
            <p className="text-xs text-slate-400">PostgreSQL Schema, Auth & Row Level Security</p>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Active Mode Notice */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Current Status: Active High-Performance Storage</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              BillMind AI is running in standalone verified mode with synchronized browser persistence, strict server verification for payments, and sample datasets.
            </p>
          </div>

          {/* Setup steps for external Supabase */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              To connect your own external Supabase Project:
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li>
                Create a project at <strong className="text-white">supabase.com</strong>
              </li>
              <li>Open the SQL Editor and run the prepared schema below (creates all 5 tables and RLS policies).</li>
              <li>Add your <code className="text-lime-300 font-mono">SUPABASE_URL</code> and <code className="text-lime-300 font-mono">SUPABASE_ANON_KEY</code> in project configuration.</li>
            </ol>
          </div>

          {/* SQL Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">
                PostgreSQL Schema with Row Level Security (RLS)
              </span>
              <button
                onClick={handleCopySql}
                className="text-lime-400 hover:underline flex items-center space-x-1 text-[11px]"
              >
                {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copied' : 'Copy Schema SQL'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-mono overflow-x-auto max-h-56">
              {sqlSchema}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsSupabaseModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
