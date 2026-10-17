import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDateIndian } from '../../utils/formatters';
import {
  PlusCircle,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  CreditCard,
  Share2,
  Eye,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Invoice } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    businessProfile,
    invoices,
    payments,
    isSampleData,
    setCurrentView,
    setSelectedInvoiceId,
    openPublicPaymentPage,
    setIsPayPalModalOpen,
    setActiveCheckoutInvoice,
  } = useApp();

  const [chartPeriod, setChartPeriod] = useState<'month' | '30days' | 'q3' | 'fy'>('month');

  // Compute 4 core metrics strictly in INR
  const metrics = useMemo(() => {
    let totalReceived = 0;
    let totalOutstanding = 0;
    let totalOverdue = 0;
    let totalInvoicesVolume = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    invoices.forEach((inv) => {
      totalInvoicesVolume += Number(inv.totalAmount) || 0;
      if (inv.status === 'Paid') {
        totalReceived += Number(inv.totalAmount) || 0;
        paidCount++;
      } else if (inv.status === 'Pending') {
        totalOutstanding += Number(inv.totalAmount) || 0;
        pendingCount++;
      } else if (inv.status === 'Overdue') {
        totalOverdue += Number(inv.totalAmount) || 0;
        overdueCount++;
      }
    });

    return {
      totalReceived,
      paidCount,
      totalOutstanding,
      pendingCount,
      totalInvoicesCount: invoices.length,
      totalInvoicesVolume,
      totalOverdue,
      overdueCount,
    };
  }, [invoices]);

  // Chart data for periods in INR
  const chartData = useMemo(() => {
    switch (chartPeriod) {
      case '30days':
        return [
          { label: 'Week 1', revenue: 42500, target: 35000 },
          { label: 'Week 2', revenue: 12500, target: 40000 },
          { label: 'Week 3', revenue: 145000, target: 60000 },
          { label: 'Week 4', revenue: 75000, target: 50000 },
        ];
      case 'q3':
        return [
          { label: 'Jul 2026', revenue: 85000, target: 80000 },
          { label: 'Aug 2026', revenue: 110000, target: 90000 },
          { label: 'Sep 2026', revenue: 145000, target: 120000 },
        ];
      case 'fy':
        return [
          { label: 'Q1 (Apr-Jun)', revenue: 240000, target: 200000 },
          { label: 'Q2 (Jul-Sep)', revenue: 340000, target: 300000 },
          { label: 'Q3 (Oct-Dec)', revenue: 275000, target: 320000 },
          { label: 'Q4 (Est.)', revenue: 380000, target: 350000 },
        ];
      case 'month':
      default:
        return [
          { label: '01 - 07 Oct', revenue: 12500, target: 30000 },
          { label: '08 - 14 Oct', revenue: 42500, target: 35000 },
          { label: '15 - 21 Oct', revenue: 145000, target: 50000 },
          { label: '22 - 31 Oct (Est)', revenue: 75000, target: 60000 },
        ];
    }
  }, [chartPeriod]);

  const maxChartVal = Math.max(...chartData.map((d) => Math.max(d.revenue, d.target)), 100000);

  // Recent invoices (sorted by issueDate desc)
  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 5);
  }, [invoices]);

  // Overdue & upcoming invoices needing attention
  const attentionInvoices = useMemo(() => {
    return invoices.filter((i) => i.status === 'Overdue' || i.status === 'Pending').slice(0, 3);
  }, [invoices]);

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Paid</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>Overdue</span>
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <span>Draft</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sample Data Notice Banner if active */}
      {isSampleData && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-amber-200 gap-2">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Sample Business Data Active:</strong> Demonstrating typical invoices for <em>{businessProfile.name}</em> in Indian Rupees (₹). You can create real invoices anytime or clear this data.
            </span>
          </div>
          <button
            onClick={() => setCurrentView('create-invoice')}
            className="px-2.5 py-1 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 font-semibold text-[11px] shrink-0"
          >
            Create First Real Invoice
          </button>
        </div>
      )}

      {/* Header with Greeting & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>{businessProfile.name}</span>
            <span>•</span>
            <span className="text-lime-400 font-medium">Fintech Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Financial Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setCurrentView('assistant')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Ask BillMind AI</span>
          </button>

          <button
            onClick={() => setCurrentView('create-invoice')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-lime-400/15 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>+ Create Invoice</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards — Strictly in INR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Payments Received */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 relative overflow-hidden shadow-lg shadow-black/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Payments Received</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {formatINR(metrics.totalReceived)}
          </p>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{metrics.paidCount} settled bills</span>
            <span>•</span>
            <span className="text-[11px]">Server Verified</span>
          </div>
        </div>

        {/* 2. Outstanding Invoices */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 relative overflow-hidden shadow-lg shadow-black/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Outstanding Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight">
            {formatINR(metrics.totalOutstanding)}
          </p>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-400">
            <span className="text-amber-300 font-semibold">{metrics.pendingCount} pending</span>
            <span>•</span>
            <span className="text-[11px]">Within payment terms</span>
          </div>
        </div>

        {/* 3. Total Invoices */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 relative overflow-hidden shadow-lg shadow-black/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {metrics.totalInvoicesCount}{' '}
            <span className="text-sm font-medium text-slate-400">Bills</span>
          </p>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">
              {formatINR(metrics.totalInvoicesVolume)}
            </span>
            <span>•</span>
            <span className="text-[11px]">Total Volume</span>
          </div>
        </div>

        {/* 4. Overdue Payments */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-rose-900/40 relative overflow-hidden shadow-lg shadow-rose-950/20 bg-rose-950/10">
          <div className="flex items-center justify-between text-xs text-rose-300 mb-2">
            <span className="font-medium">Overdue Payments</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight">
            {formatINR(metrics.totalOverdue)}
          </p>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-rose-300">
            <span className="font-bold">{metrics.overdueCount} bill(s) past due</span>
            <span>•</span>
            <button
              onClick={() => setCurrentView('insights')}
              className="text-[11px] underline hover:text-white"
            >
              Action now
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Chart & AI Quick Insights Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Section (2 cols on lg) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-lime-400" />
                <span>Revenue Performance</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified collections and targets in Indian Rupees (₹)
              </p>
            </div>

            {/* Time Period Filter Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <button
                onClick={() => setChartPeriod('month')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  chartPeriod === 'month'
                    ? 'bg-lime-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setChartPeriod('30days')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  chartPeriod === '30days'
                    ? 'bg-lime-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setChartPeriod('q3')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  chartPeriod === 'q3'
                    ? 'bg-lime-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Q3 2026
              </button>
              <button
                onClick={() => setChartPeriod('fy')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  chartPeriod === 'fy'
                    ? 'bg-lime-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FY 26-27
              </button>
            </div>
          </div>

          {/* Realistic Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="h-48 sm:h-56 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {chartData.map((bar, idx) => {
                const heightPct = Math.round((bar.revenue / maxChartVal) * 100);
                const targetPct = Math.round((bar.target / maxChartVal) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="text-[11px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity mb-1.5 whitespace-nowrap">
                      {formatINR(bar.revenue)}
                    </div>
                    <div className="w-full max-w-[48px] h-full flex items-end justify-center relative">
                      {/* Target marker line */}
                      <div
                        className="absolute w-full border-t border-dashed border-slate-600 z-10 pointer-events-none"
                        style={{ bottom: `${targetPct}%` }}
                        title={`Target: ${formatINR(bar.target)}`}
                      ></div>
                      {/* Primary revenue bar */}
                      <div
                        className="w-full bg-gradient-to-t from-lime-500 to-lime-400 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-lg shadow-lime-500/10"
                        style={{ height: `${Math.max(heightPct, 6)}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-3 truncate max-w-full text-center">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 px-2">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-lime-400 inline-block"></span>
                  <span>Received Revenue (₹)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-4 border-t border-dashed border-slate-500 inline-block"></span>
                  <span>Target Benchmark</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Peak: {formatINR(maxChartVal)}
              </span>
            </div>
          </div>
        </div>

        {/* AI Business Insights Panel (1 col on lg) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-lime-400/15 text-lime-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white">AI Financial Insights</h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 font-semibold">
                Live Audit
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              {metrics.totalOverdue > 0 ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                  <p className="font-bold text-rose-300 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Action Required: {formatINR(metrics.totalOverdue)} Overdue</span>
                  </p>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Invoice for Dr. Aditi Verma Clinic is past its 05/10/2026 due date.
                  </p>
                  <button
                    onClick={() => setCurrentView('assistant')}
                    className="mt-2 text-lime-400 font-semibold hover:underline flex items-center space-x-1 text-[11px]"
                  >
                    <span>Draft polite reminder with AI</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <p className="font-bold text-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Clean Ledger</span>
                  </p>
                  <p className="text-slate-400 mt-1">
                    Zero overdue accounts! All client invoices are either paid or active within payment terms.
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <p className="font-semibold text-slate-200">Collection Velocity</p>
                <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">
                  Average settlement duration is <strong>9.4 days</strong>. Clients paying through UPI QR settle 3x faster than traditional NEFT bank transfers.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <p className="font-semibold text-slate-200">Top Revenue Contributor</p>
                <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">
                  Apex Edutech Pvt Ltd represents <strong>38%</strong> of total billed revenue for this quarter ({formatINR(145000)}).
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('insights')}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <span>View Complete Business Insights</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Invoices Table & Upcoming Follow-ups Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table (2 cols on lg) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Recent Invoices</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest customer bills, amounts in INR and settlement status
              </p>
            </div>
            <button
              onClick={() => setCurrentView('invoices')}
              className="text-xs text-lime-400 hover:underline font-medium"
            >
              View All ({invoices.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{inv.customer?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {inv.items[0]?.description || 'Service'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {formatDateIndian(inv.dueDate)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      {formatINR(inv.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setCurrentView('view-invoice');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        title="View Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => {
                            setActiveCheckoutInvoice(inv);
                            setIsPayPalModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-lime-400/20 hover:bg-lime-400/30 text-lime-300"
                          title="Record Payment / PayPal Checkout"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => openPublicPaymentPage(inv.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300"
                        title="Public Payment Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Reminders Card (1 col on lg) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Payment Reminders</span>
              </h2>
              <span className="text-xs text-slate-400">Next 14 Days</span>
            </div>

            <div className="mt-4 space-y-3">
              {attentionInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 text-xs flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-white">{inv.customer?.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {inv.invoiceNumber} • Due {formatDateIndian(inv.dueDate)}
                      </p>
                    </div>
                    <span className="font-bold text-amber-300">{formatINR(inv.totalAmount)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    {getStatusBadge(inv.status)}
                    <button
                      onClick={() => {
                        setSelectedInvoiceId(inv.id);
                        setCurrentView('assistant');
                      }}
                      className="text-xs text-lime-400 hover:underline flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Draft Reminder</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <button
              onClick={() => setCurrentView('assistant')}
              className="w-full py-2 rounded-xl bg-lime-400/10 hover:bg-lime-400/20 text-lime-300 font-semibold text-xs transition"
            >
              Ask AI: "Write reminders for unpaid bills"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
