import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock,
  Send,
  Building,
  Users,
} from 'lucide-react';
import { BusinessInsight } from '../../types';

export const AiBusinessInsights: React.FC = () => {
  const { businessProfile, invoices, payments, setCurrentView, setSelectedInvoiceId } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [summaryText, setSummaryText] = useState<string>('');

  // Calculate real metrics
  const calculatedContext = useMemo(() => {
    let totalPaid = 0;
    let totalOverdue = 0;
    let totalOutstanding = 0;
    let overdueCount = 0;

    invoices.forEach((inv) => {
      const amt = Number(inv.totalAmount) || 0;
      if (inv.status === 'Paid') totalPaid += amt;
      else if (inv.status === 'Overdue') {
        totalOverdue += amt;
        overdueCount++;
      } else if (inv.status === 'Pending') totalOutstanding += amt;
    });

    return {
      totalPaid,
      totalOverdue,
      totalOutstanding,
      overdueCount,
      totalInvoices: invoices.length,
    };
  }, [invoices]);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/business-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialContext: calculatedContext,
          businessName: businessProfile.name,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate insights');
      const data = await res.json();
      setSummaryText(data.summary || '');
      setInsights(data.insights || []);
    } catch (err) {
      console.error(err);
      // Fallback deterministic insights
      setSummaryText(
        `Business performance is stable with ${formatINR(calculatedContext.totalPaid)} in confirmed revenue. ${
          calculatedContext.overdueCount > 0
            ? `Attention needed on ${calculatedContext.overdueCount} overdue invoice(s) totaling ${formatINR(calculatedContext.totalOverdue)}.`
            : 'All invoices are within approved payment schedules.'
        }`
      );
      setInsights([
        {
          type: calculatedContext.overdueCount > 0 ? 'alert' : 'positive',
          title: calculatedContext.overdueCount > 0 ? 'Overdue Follow-up Priority' : 'Pristine Receivables',
          description:
            calculatedContext.overdueCount > 0
              ? `You have ${formatINR(calculatedContext.totalOverdue)} past due. Sending automated WhatsApp/email reminders typically yields payment within 48 hours.`
              : 'Zero delayed payments across active clients. Maintain this standard with clear upfront terms.',
          metric: formatINR(calculatedContext.totalOverdue),
          actionLabel: calculatedContext.overdueCount > 0 ? 'Send Payment Reminder' : 'View Invoices',
        },
        {
          type: 'tip',
          title: '2% Early Settlement Incentive',
          description: 'Offering clients a 2% early payment discount for settlements within 7 days reduces average days sales outstanding (DSO) by 14 days.',
          metric: '2% incentive',
          actionLabel: 'Adjust Invoice Terms',
        },
        {
          type: 'summary',
          title: 'Quarterly Revenue Velocity',
          description: `Total revenue recognized from settled invoices is ${formatINR(calculatedContext.totalPaid)}. Generating recurring milestone bills on Mondays improves collection speed.`,
          metric: formatINR(calculatedContext.totalPaid),
          actionLabel: 'Create New Invoice',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [calculatedContext.totalPaid, calculatedContext.totalOverdue]);

  const getInsightIcon = (type: BusinessInsight['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'positive':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'tip':
        return <Lightbulb className="w-5 h-5 text-amber-300" />;
      case 'summary':
      default:
        return <TrendingUp className="w-5 h-5 text-lime-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-lime-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Business Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Insights & Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Plain English explanations calculated from your verified Indian billing transactions
          </p>
        </div>

        <button
          onClick={fetchInsights}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-lime-400' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Executive Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-lime-400 uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Executive Financial Summary</span>
        </div>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
          {summaryText || 'Evaluating business health across all active client accounts...'}
        </p>

        {/* Disclaimer label */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>* Predictions are labeled as estimates; recommendations are operational suggestions.</span>
          <span className="text-slate-400">Currency: Indian Rupees (₹)</span>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {getInsightIcon(ins.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{ins.title}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      {ins.type}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-lime-300">
                  {ins.metric}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mt-2">{ins.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-end">
              <button
                onClick={() => {
                  if (ins.actionLabel.includes('Reminder')) {
                    setCurrentView('assistant');
                  } else if (ins.actionLabel.includes('Invoice')) {
                    setCurrentView('create-invoice');
                  } else {
                    setCurrentView('invoices');
                  }
                }}
                className="text-xs text-lime-400 hover:text-lime-300 font-semibold flex items-center space-x-1"
              >
                <span>{ins.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <h4 className="font-bold text-white text-sm">Need custom answers about your cash flow?</h4>
          <p className="text-slate-400 mt-0.5">
            Open "Ask BillMind AI" to query client revenue, project collections, or draft reminders.
          </p>
        </div>
        <button
          onClick={() => setCurrentView('assistant')}
          className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold shrink-0 transition"
        >
          Launch Assistant →
        </button>
      </div>
    </div>
  );
};
