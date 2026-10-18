import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDateIndian, formatDateTimeIndian, amountInWordsINR } from '../../utils/formatters';
import {
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Clock,
  Sparkles,
  Send,
  Building,
  User,
} from 'lucide-react';
import { PaymentRecord, Invoice } from '../../types';

export const ReceiptsView: React.FC = () => {
  const { payments, invoices, businessProfile, showToast, setCurrentView, setSelectedInvoiceId } =
    useApp();

  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(payments[0] || null);

  // Reminder generator state
  const [selectedReminderInvoiceId, setSelectedReminderInvoiceId] = useState<string>(
    invoices.find((i) => i.status === 'Overdue' || i.status === 'Pending')?.id || invoices[0]?.id || ''
  );
  const [reminderTone, setReminderTone] = useState<'friendly' | 'formal' | 'urgent'>('friendly');
  const [reminderSubject, setReminderSubject] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [isDraftingReminder, setIsDraftingReminder] = useState(false);
  const [copiedReminder, setCopiedReminder] = useState(false);

  const selectedReminderInvoice = invoices.find((i) => i.id === selectedReminderInvoiceId);

  // Generate reminder draft via server API
  const handleDraftReminder = async () => {
    if (!selectedReminderInvoice) return;
    setIsDraftingReminder(true);

    try {
      const res = await fetch('/api/ai/draft-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice: selectedReminderInvoice,
          tone: reminderTone,
          businessName: businessProfile.name,
        }),
      });

      if (!res.ok) throw new Error('Failed to draft reminder');
      const data = await res.json();
      setReminderSubject(data.subject);
      setReminderMessage(data.message);
      showToast('Payment reminder drafted!');
    } catch (err) {
      // Deterministic polite draft fallback
      const subj = `Friendly Payment Reminder: Invoice ${selectedReminderInvoice.invoiceNumber} for ${formatINR(selectedReminderInvoice.totalAmount)}`;
      const msg = `Dear ${selectedReminderInvoice.customer.name},\n\nI hope this email finds you well.\n\nThis is a gentle reminder that payment for Invoice ${selectedReminderInvoice.invoiceNumber} (${formatINR(selectedReminderInvoice.totalAmount)}) was due on ${formatDateIndian(selectedReminderInvoice.dueDate)}.\n\nYou can review your invoice and make payment securely here:\n${window.location.origin}/#/pay/${selectedReminderInvoice.id}\n\nAccepted methods: Instant UPI (${businessProfile.upiId || 'nextgenstudio@okaxis'}) or PayPal Sandbox.\n\nThank you for your prompt support!\n\nWarm regards,\n${businessProfile.ownerName}\n${businessProfile.name}`;
      setReminderSubject(subj);
      setReminderMessage(msg);
    } finally {
      setIsDraftingReminder(false);
    }
  };

  const handleCopyReminder = () => {
    const fullText = `Subject: ${reminderSubject}\n\n${reminderMessage}`;
    navigator.clipboard.writeText(fullText);
    setCopiedReminder(true);
    showToast('Reminder copied to clipboard! Paste directly into email or WhatsApp.');
    setTimeout(() => setCopiedReminder(false), 2500);
  };

  const handlePrintReceipt = () => {
    try {
      window.focus();
      window.print();
    } catch (err) {
      console.error('Failed to trigger native print dialog:', err);
      window.print();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Receipts & Payment Reminders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verified settlement records, official downloadable vouchers, and automated follow-ups
          </p>
        </div>
      </div>

      {/* Split view: Verified Receipts list & Active Receipt Voucher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Receipts list (5 cols on lg) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-lime-400" />
              <span>Verified Payment Receipts ({payments.length})</span>
            </h2>
          </div>

          {payments.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No payments captured yet. Settle an invoice via PayPal or UPI to generate receipts.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {payments.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedReceipt(p)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-xs ${
                    selectedReceipt?.id === p.id
                      ? 'bg-slate-950 border-lime-400/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-white">{p.customerName}</p>
                      <p className="text-[11px] font-mono text-slate-400">
                        {p.invoiceNumber} • {p.receiptNumber}
                      </p>
                    </div>
                    <span className="font-bold text-emerald-400 font-mono text-sm">
                      {formatINR(p.amount)}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{formatDateTimeIndian(p.date)}</span>
                    <span className="text-emerald-400 font-medium">Verified Capture</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Printable Official Payment Voucher (7 cols on lg) */}
        <div className="lg:col-span-7">
          {selectedReceipt ? (
            <div className="space-y-3">
              <div className="no-print flex items-center justify-between px-1">
                <span className="text-xs text-slate-400">Official Settlement Voucher</span>
                <button
                  onClick={handlePrintReceipt}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-600/20 active:scale-95 transition"
                  title="Print or Save Receipt Voucher to PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>

              {/* Printable Voucher Paper */}
              <div
                className="print-container invoice-paper bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200"
                style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
              >
                <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                  <div>
                    <span className="font-extrabold text-xl text-slate-950">{businessProfile.name}</span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {businessProfile.address}, {businessProfile.city}, {businessProfile.state}
                    </p>
                    {businessProfile.gstin && (
                      <p className="text-xs font-mono text-slate-700">GSTIN: {businessProfile.gstin}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                      OFFICIAL RECEIPT
                    </span>
                    <p className="font-mono text-xs font-bold text-slate-900 mt-1">
                      {selectedReceipt.receiptNumber}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Date: {formatDateTimeIndian(selectedReceipt.date)}
                    </p>
                  </div>
                </div>

                <div className="py-5 space-y-3 text-xs border-b border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Received With Thanks From:</span>
                    <span className="font-bold text-slate-900">{selectedReceipt.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Towards Invoice:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedReceipt.invoiceNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Gateway / Method:</span>
                    <span className="font-medium text-slate-800">{selectedReceipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transaction Reference:</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {selectedReceipt.transactionRef}
                    </span>
                  </div>
                </div>

                <div className="py-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Amount Received:
                    </span>
                    <p className="text-xs text-slate-500 italic">
                      {amountInWordsINR(selectedReceipt.amount)}
                    </p>
                  </div>
                  <span className="text-2xl font-extrabold text-slate-950 font-mono">
                    {formatINR(selectedReceipt.amount)}
                  </span>
                </div>

                <div className="pt-6 flex justify-between items-end text-xs">
                  <div className="text-slate-500 text-[11px]">
                    <p>Computer-generated verifiable receipt.</p>
                    <p>Authenticated on BillMind AI Platform.</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block border-t border-slate-400 pt-1 text-[11px] text-slate-600 font-medium">
                      Accounts Department • {businessProfile.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
              Select a receipt on the left to view and print.
            </div>
          )}
        </div>
      </div>

      {/* Polite Payment Reminder Generator Section */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-lime-400/15 text-lime-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Payment Reminder Generator</h2>
              <p className="text-xs text-slate-400">
                Draft polite, professional reminder messages with direct invoice payment links
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Tone:</span>
            {(['friendly', 'formal', 'urgent'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setReminderTone(t)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  reminderTone === t
                    ? 'bg-lime-400 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice picker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-slate-400 mb-1">Select Invoice for Follow-up:</label>
            <select
              value={selectedReminderInvoiceId}
              onChange={(e) => setSelectedReminderInvoiceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.customer?.name} ({formatINR(inv.totalAmount)}) — [
                  {inv.status}]
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleDraftReminder}
              disabled={isDraftingReminder || !selectedReminderInvoice}
              className="w-full py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isDraftingReminder ? 'Drafting...' : 'Draft Reminder with AI'}</span>
            </button>
          </div>
        </div>

        {/* Output Box */}
        {(reminderSubject || reminderMessage) && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div>
              <span className="text-slate-500 font-bold">Email Subject:</span>
              <p className="font-semibold text-white mt-0.5">{reminderSubject}</p>
            </div>
            <div>
              <span className="text-slate-500 font-bold">Message Content:</span>
              <p className="whitespace-pre-wrap text-slate-300 mt-1 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
                {reminderMessage}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-[11px] text-slate-500">
                Notice: Delivery requires copying into your email or messaging client.
              </span>
              <button
                onClick={handleCopyReminder}
                className="px-4 py-1.5 rounded-lg bg-lime-400 text-slate-950 font-bold flex items-center space-x-1.5 text-xs"
              >
                {copiedReminder ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReminder ? 'Copied!' : 'Copy Reminder Text'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
