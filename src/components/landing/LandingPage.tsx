import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  CreditCard,
  TrendingUp,
  Receipt,
  HelpCircle,
  QrCode,
  Zap,
  Clock,
  ChevronDown,
  Building2,
  IndianRupee,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo, user, openPublicPaymentPage } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does BillMind AI support Indian GST invoicing and HSN/SAC codes?',
      a: 'Yes. BillMind AI natively supports standard Indian GST rates (0%, 5%, 12%, 18%, 28%), client GSTIN records, state of supply tagging, and generates compliant invoice PDFs with rupee symbol (₹) and totals in words.',
    },
    {
      q: 'How does the PayPal Sandbox payment integration work?',
      a: 'For international and domestic clients, BillMind AI creates a secure PayPal payment order on the server. Customers complete the checkout, and our backend verifies the payment capture before marking the bill as paid and generating an instant receipt.',
    },
    {
      q: 'Can clients pay using Indian UPI and Bank Transfer?',
      a: 'Yes! Every invoice includes your business UPI ID and QR code, along with Bank Account/IFSC details. Clients can scan and pay instantly with Google Pay, PhonePe, Paytm, or BHIM.',
    },
    {
      q: 'How does "Ask BillMind AI" understand my business data?',
      a: 'The AI assistant securely analyzes only your authenticated invoices, verified receipts, and payment cycles. It calculates revenue, spots overdue bills, and drafts courteous payment reminders without exposing your data.',
    },
    {
      q: 'Is BillMind AI suitable for freelancers, tutors, and agencies?',
      a: 'Absolutely. It is tailored specifically for solo freelancers, tuition coaches, design studios, software agencies, and independent consultants who need clean billing without complicated accounting software.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-slate-900">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Tagline Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-lime-400"></span>
            <span className="font-medium text-slate-200">Create Bills. Get Paid. Grow Smarter.</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Your Business Billing, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-lime-200">
              Made Smarter.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Create invoices, collect payments and understand your business finances — all in one simple platform.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => navigateTo(user ? 'dashboard' : 'auth-signup')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-semibold text-base shadow-lg shadow-lime-400/20 transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('features-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-base transition-all"
            >
              Explore Features
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
              <span>100% Indian Rupee (₹) Native</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
              <span>PayPal Sandbox & UPI Ready</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
              <span>No Accounting Knowledge Needed</span>
            </span>
          </div>

          {/* Realistic Dashboard Preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 p-3 sm:p-5 shadow-2xl shadow-black/80 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4 px-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-xs font-mono text-slate-400">app.billmind.ai/dashboard</span>
              </div>
              <div className="text-xs text-slate-400 hidden sm:flex items-center space-x-3">
                <span className="px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 font-medium">Demo Business: NextGen Digital Studio</span>
                <span>Active Financials (₹ INR)</span>
              </div>
            </div>

            {/* Dashboard Snapshot Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-xs text-slate-400">Total Received</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{formatINR(200000)}</p>
                <span className="text-[11px] text-lime-400 font-medium">3 verified payments</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-xs text-slate-400">Outstanding Invoices</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-300 mt-1">{formatINR(75000)}</p>
                <span className="text-[11px] text-slate-400">1 active invoice</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-xs text-slate-400">Total Invoices</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">6 Bills</p>
                <span className="text-[11px] text-slate-400">₹5,62,600 total volume</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-900/40 bg-rose-950/10">
                <p className="text-xs text-rose-300 font-medium">Overdue Payments</p>
                <p className="text-xl sm:text-2xl font-bold text-rose-400 mt-1">{formatINR(28000)}</p>
                <span className="text-[11px] text-rose-400/80 font-medium">1 bill needs attention</span>
              </div>
            </div>

            {/* Realistic Invoices Snapshot */}
            <div className="rounded-xl bg-slate-950/90 border border-slate-800/90 overflow-hidden">
              <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Recent Customer Invoices</span>
                <span className="text-slate-400 text-[11px]">Calculated with Asia/Kolkata timezone</span>
              </div>
              <div className="divide-y divide-slate-800/60 text-xs">
                <div className="p-3 flex items-center justify-between hover:bg-slate-900/40 transition">
                  <div>
                    <p className="font-semibold text-slate-200">Apex Edutech Pvt Ltd</p>
                    <p className="text-[11px] text-slate-400">INV-2026-001 • LMS Portal Dev</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{formatINR(145000)}</p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Paid via PayPal
                    </span>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between hover:bg-slate-900/40 transition">
                  <div>
                    <p className="font-semibold text-slate-200">Dr. Aditi Verma Clinic</p>
                    <p className="text-[11px] text-slate-400">INV-2026-003 • Booking System & SEO</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-200">{formatINR(28000)}</p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      Overdue (Due 05/10/2026)
                    </span>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between hover:bg-slate-900/40 transition">
                  <div>
                    <p className="font-semibold text-slate-200">UrbanCraft Interiors LLP</p>
                    <p className="text-[11px] text-slate-400">INV-2026-004 • Portfolio Website 3D</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-200">{formatINR(75000)}</p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      Pending (Due 24/10/2026)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick interactive test banner */}
            <div className="mt-3.5 p-3 rounded-xl bg-lime-400/10 border border-lime-400/20 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-2 text-lime-300">
                <Sparkles className="w-4 h-4 text-lime-400 shrink-0" />
                <span>
                  <strong>Interactive Demo:</strong> Test the public client payment page or launch the AI assistant right now.
                </span>
              </div>
              <button
                onClick={() => openPublicPaymentPage('inv-104')}
                className="px-3 py-1.5 rounded-lg bg-lime-400 text-slate-950 font-semibold hover:bg-lime-300 shrink-0"
              >
                View Sample Client Payment Page
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Steps Section */}
      <section className="py-16 md:py-24 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-lime-400 uppercase tracking-widest">
              Simple 3-Step Workflow
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Billing designed for real human productivity
            </p>
            <p className="mt-3 text-slate-400 text-base">
              Say goodbye to complicated spreadsheets, lost WhatsApp receipts, and delayed payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center text-lime-400 font-bold text-lg mb-5">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create an Invoice</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Describe the work in plain language or use the standard form. BillMind AI auto-calculates GST, subtotal, and totals in ₹ with complete line items.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>AI prompt to invoice in 3 seconds</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Indian GST & HSN calculation</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center text-lime-400 font-bold text-lg mb-5">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Get Paid</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Send a private payment link. Clients can pay directly via PayPal Sandbox or scan your Indian UPI QR. Payments are verified on the server.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>PayPal checkout with server verification</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Instant UPI QR code support</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center text-lime-400 font-bold text-lg mb-5">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Grow Smarter</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ask BillMind AI about monthly collections, overdue accounts, or client history. Get automated reminder drafts that politely speed up payments.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>"Ask BillMind AI" conversational assistant</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Actionable cash flow insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features-section" className="py-16 md:py-24 bg-slate-900/40 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-lime-400 uppercase tracking-widest">
              Core Capabilities
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Built for Indian Freelancers & Small Businesses
            </p>
            <p className="mt-3 text-slate-400 text-base">
              Everything you need to run invoicing smoothly, with zero unnecessary complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Invoice Generator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Turn a short description like <em>"40 hours of React consulting at ₹2,500/hr + 18% GST"</em> into a clean, editable invoice ready for client review.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs text-lime-400 font-medium">
                Saves ~20 minutes per bill →
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-4">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Verified Payment Tracking</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bills are marked <strong>Paid</strong> only after verified server capture. Automatically generates downloadable receipts with unique transaction references.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs text-lime-400 font-medium">
                Zero fake confirmations →
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Financial Assistant</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ask conversational questions in plain English: <em>"Which invoices are overdue?"</em> or <em>"Write a polite payment reminder for Dr. Aditi."</em>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs text-lime-400 font-medium">
                Uses real data context only →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Pricing Section */}
      <section className="py-16 md:py-24 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-lime-400 uppercase tracking-widest">
              Simple Pricing
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Transparent, honest plans in Indian Rupees
            </p>
            <p className="mt-3 text-slate-400 text-base">
              No hidden gateway commissions or surprise charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Starter */}
            <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For solo freelancers and tutors</p>
                <div className="mt-5 mb-5">
                  <span className="text-3xl font-extrabold text-white">₹0</span>
                  <span className="text-xs text-slate-400 ml-1">/ forever free</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Up to 15 invoices / month</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Indian GST & Rupee calculation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>UPI QR Code on Invoices</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>PDF invoice & receipt export</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigateTo(user ? 'dashboard' : 'auth-signup')}
                className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Start Free
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="p-7 rounded-2xl bg-slate-900 border-2 border-lime-400 relative flex flex-col justify-between shadow-xl shadow-lime-400/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-lime-400 text-slate-950 font-bold text-[10px] tracking-wide uppercase">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Professional</h3>
                <p className="text-xs text-slate-400 mt-1">For growing consultants and studios</p>
                <div className="mt-5 mb-5">
                  <span className="text-3xl font-extrabold text-white">₹999</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Unlimited Invoices & Clients</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>AI Invoice Generation & Drafting</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>PayPal Sandbox & Live Checkout</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Ask BillMind AI Financial Assistant</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Automated Payment Reminders</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigateTo(user ? 'dashboard' : 'auth-signup')}
                className="mt-8 w-full py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold transition shadow-md shadow-lime-400/20"
              >
                Get Started with Pro
              </button>
            </div>

            {/* Agency Plan */}
            <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Agency & Business</h3>
                <p className="text-xs text-slate-400 mt-1">For multi-member firms and teams</p>
                <div className="mt-5 mb-5">
                  <span className="text-3xl font-extrabold text-white">₹2,499</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Custom domain & branded payment portal</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Multi-GSTIN business profiles</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Supabase Cloud SQL database sync</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigateTo('auth-signup')}
                className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 md:py-24 bg-slate-900/30 border-b border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-semibold text-lime-400 uppercase tracking-widest">
              Got Questions?
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white">Frequently Asked Questions</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-lime-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base text-white">BillMind AI</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-400 font-semibold">
                  INR Edition
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                AI-powered billing, invoice management, payment tracking and financial insights for Indian businesses.
              </p>
              <p className="text-[11px] text-slate-500">
                Operating strictly in Indian Rupees (₹) • Asia/Kolkata
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Product</p>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={() => navigateTo('dashboard')} className="hover:text-lime-400">Dashboard</button></li>
                <li><button onClick={() => navigateTo('create-invoice')} className="hover:text-lime-400">AI Invoice Generator</button></li>
                <li><button onClick={() => navigateTo('assistant')} className="hover:text-lime-400">Ask BillMind AI</button></li>
                <li><button onClick={() => navigateTo('insights')} className="hover:text-lime-400">Business Insights</button></li>
                <li><button onClick={() => navigateTo('receipts')} className="hover:text-lime-400">Payment Receipts</button></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Integrations</p>
              <ul className="space-y-2 text-[11px]">
                <li><span>PayPal Sandbox (Server Verified)</span></li>
                <li><span>Unified Payments Interface (UPI QR)</span></li>
                <li><span>Supabase PostgreSQL Schema</span></li>
                <li><span>Google Gemini AI Engine</span></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Legal & Compliance</p>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#terms" className="hover:text-slate-200">Terms of Service</a></li>
                <li><a href="#privacy" className="hover:text-slate-200">Privacy Policy</a></li>
                <li><a href="#security" className="hover:text-slate-200">Security & Data Privacy</a></li>
                <li><span className="text-slate-500">GST Compliance Notice</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} BillMind AI. Built with precision for Indian enterprises & freelancers.</p>
            <p className="mt-2 sm:mt-0">Create Bills. Get Paid. Grow Smarter.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
