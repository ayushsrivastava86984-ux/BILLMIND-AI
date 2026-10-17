import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import {
  Sparkles,
  Send,
  User,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ChatMessage } from '../../types';

export const AiFinancialAssistant: React.FC = () => {
  const { businessProfile, invoices, payments, setCurrentView, setSelectedInvoiceId, showToast } =
    useApp();

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Compile real business financial context
  const financialContext = useMemo(() => {
    let totalPaid = 0;
    let totalOverdue = 0;
    let totalOutstanding = 0;
    let overdueInvoices: any[] = [];
    let pendingInvoices: any[] = [];
    const customerTotals: Record<string, number> = {};

    invoices.forEach((inv) => {
      const amt = Number(inv.totalAmount) || 0;
      const custName = inv.customer?.name || 'Unknown';
      customerTotals[custName] = (customerTotals[custName] || 0) + amt;

      if (inv.status === 'Paid') {
        totalPaid += amt;
      } else if (inv.status === 'Overdue') {
        totalOverdue += amt;
        overdueInvoices.push({
          invoiceNumber: inv.invoiceNumber,
          customer: custName,
          amount: amt,
          dueDate: inv.dueDate,
        });
      } else if (inv.status === 'Pending') {
        totalOutstanding += amt;
        pendingInvoices.push({
          invoiceNumber: inv.invoiceNumber,
          customer: custName,
          amount: amt,
          dueDate: inv.dueDate,
        });
      }
    });

    const topCustomers = Object.entries(customerTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      businessName: businessProfile.name,
      totalInvoices: invoices.length,
      totalPaid,
      totalOverdue,
      totalOutstanding,
      overdueCount: overdueInvoices.length,
      overdueInvoices,
      pendingCount: pendingInvoices.length,
      pendingInvoices,
      topCustomers,
      recentPaymentsCount: payments.length,
    };
  }, [invoices, payments, businessProfile]);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Namaste! I am **BillMind AI**, your financial assistant for **${businessProfile.name}**.\n\nI have reviewed your verified accounts. You have **${formatINR(financialContext.totalPaid)}** in collected revenue and **${formatINR(financialContext.totalOverdue)}** in overdue bills.\n\nHow can I help you today? You can choose one of the questions below or ask me anything.`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'How much money have I received this month?',
    'Which invoices are overdue?',
    'Show my top customers by revenue.',
    'Write a polite reminder for a customer who has not paid.',
    'Summarize my business performance this month.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/ask-financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          financialContext,
          businessName: businessProfile.name,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch assistant response.');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'I could not retrieve an answer at this moment.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      // Fallback response with verified numbers
      const fallbackMsg: ChatMessage = {
        id: `msg-ai-fallback-${Date.now()}`,
        role: 'assistant',
        content: `Based on your verified records for **${businessProfile.name}**:\n\n• **Total Collections:** ${formatINR(financialContext.totalPaid)}\n• **Outstanding Amount:** ${formatINR(financialContext.totalOutstanding)}\n• **Overdue Amount:** ${formatINR(financialContext.totalOverdue)}\n\n${financialContext.totalOverdue > 0 ? `⚠️ You have ${financialContext.overdueCount} overdue bill(s). Consider drafting a payment reminder.` : '✅ All accounts are within credit terms!'}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied text to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-lime-400/15 border border-lime-400/30 text-lime-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Ask BillMind AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 font-semibold border border-lime-400/30">
                INR Financial Intelligence
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Conversational assistant using verified data for {businessProfile.name}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'msg-welcome-reset',
                role: 'assistant',
                content: `Chat cleared. Ask me anything about your invoices, collections, or clients in Indian Rupees (₹).`,
                timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }}
          className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-lime-400 text-slate-950 font-medium shadow-md shadow-lime-400/10 rounded-br-none'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none shadow-lg'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              <div
                className={`mt-2 flex items-center justify-between pt-1 text-[10px] ${
                  msg.role === 'user' ? 'text-slate-800' : 'text-slate-500 border-t border-slate-800/80'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="hover:text-slate-300 flex items-center space-x-1 ml-4"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-lime-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copy</span>
                  </button>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 pl-11">
            <RefreshCw className="w-4 h-4 animate-spin text-lime-400" />
            <span>Analyzing financial context & drafting response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="pt-2 pb-3">
        <p className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center space-x-1">
          <HelpCircle className="w-3 h-3 text-lime-400" />
          <span>Recommended questions:</span>
        </p>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input Box */}
      <div className="pt-2 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask about revenue, overdue invoices, reminders, or client totals..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="px-4 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition active:scale-95"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 mt-1 text-center">
          BillMind AI evaluates your authentic data without sharing private financials.
        </p>
      </div>
    </div>
  );
};
