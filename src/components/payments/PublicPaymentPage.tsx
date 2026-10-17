import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDateIndian, amountInWordsINR } from '../../utils/formatters';
import {
  CreditCard,
  QrCode,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';

export const PublicPaymentPage: React.FC = () => {
  const {
    invoices,
    publicInvoiceId,
    businessProfile,
    setCurrentView,
    setIsPayPalModalOpen,
    setActiveCheckoutInvoice,
    showToast,
    resolvedTheme,
    toggleTheme,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'paypal' | 'upi'>('paypal');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Find invoice safely by publicInvoiceId or default to pending sample
  const invoice = useMemo(() => {
    if (publicInvoiceId) {
      return invoices.find((i) => i.id === publicInvoiceId) || null;
    }
    // Default to the first pending or overdue invoice for customer demo
    return invoices.find((i) => i.status === 'Pending' || i.status === 'Overdue') || invoices[0] || null;
  }, [invoices, publicInvoiceId]);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-center">
        <div className="max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 space-y-4">
          <p className="font-bold text-lg text-white">Invoice Not Found</p>
          <p className="text-xs text-slate-400">
            This invoice link may have expired or is no longer accessible.
          </p>
          <button
            onClick={() => setCurrentView('landing')}
            className="px-4 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs"
          >
            Go to BillMind AI Home
          </button>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === 'Paid';

  const handleCopyUPI = () => {
    const upi = businessProfile.upiId || 'nextgenstudio@okaxis';
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    showToast(`UPI ID ${upi} copied to clipboard!`);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleDownloadInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Brand Banner */}
      <div className="max-w-3xl mx-auto flex items-center justify-between pb-6 mb-6 border-b border-slate-800 text-xs no-print">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold text-sm">
            ₹
          </div>
          <div>
            <span className="font-bold text-sm text-white">BillMind AI</span>
            <span className="text-[10px] text-slate-400 block">Secure Customer Payment Gateway</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs flex items-center space-x-1"
            title={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {resolvedTheme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[11px]">Dark</span>
              </>
            )}
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Merchant Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Payment Container */}
      <div className="max-w-3xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        {/* Status Strip Header */}
        <div
          className={`p-6 text-center border-b ${
            isPaid
              ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-300'
              : invoice.status === 'Overdue'
              ? 'bg-rose-950/40 border-rose-900/50 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-200'
          }`}
        >
          {isPaid ? (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>PAYMENT RECEIVED & VERIFIED</span>
            </div>
          ) : invoice.status === 'Overdue' ? (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>PAYMENT OVERDUE</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
              <Clock className="w-4 h-4" />
              <span>PAYMENT DUE</span>
            </div>
          )}

          <p className="text-xs text-slate-400">Invoice to {invoice.customer.name}</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-mono tracking-tight">
            {formatINR(invoice.totalAmount)}
          </h1>
          <p className="text-[11px] text-slate-400 italic mt-1">
            {amountInWordsINR(invoice.totalAmount)}
          </p>
        </div>

        {/* Invoice Summary Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs">
          {/* Business and Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">From</p>
              <p className="font-bold text-white text-sm mt-0.5">{businessProfile.name}</p>
              <p className="text-slate-400 text-[11px]">{businessProfile.ownerName}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Invoice #</p>
              <p className="font-mono font-bold text-white text-sm mt-0.5">{invoice.invoiceNumber}</p>
              <p className="text-slate-400 text-[11px]">Issued: {formatDateIndian(invoice.issueDate)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Due Date</p>
              <p className="font-bold text-amber-300 text-sm mt-0.5">{formatDateIndian(invoice.dueDate)}</p>
              <p className="text-slate-400 text-[11px]">Asia/Kolkata</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Currency</p>
              <p className="font-bold text-lime-400 text-sm mt-0.5">INR (₹)</p>
              <p className="text-slate-400 text-[11px]">Indian Rupees</p>
            </div>
          </div>

          {/* Service Description & Line Items */}
          <div>
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-3">
              Services & Deliverables
            </h3>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden divide-y divide-slate-800">
              {invoice.items.map((item, idx) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{item.description}</p>
                    <p className="text-slate-500 text-[11px]">Qty: {item.quantity} × {formatINR(item.unitPrice)}</p>
                  </div>
                  <span className="font-mono font-bold text-white">{formatINR(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono text-white">{formatINR(invoice.subtotal)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Discount ({invoice.discountRate}%):</span>
                <span className="font-mono">-{formatINR(invoice.discountAmount)}</span>
              </div>
            )}
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>GST Tax ({invoice.taxRate}%):</span>
                <span className="font-mono text-white">+{formatINR(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
              <span>Total Due:</span>
              <span className="text-lime-400 font-mono">{formatINR(invoice.totalAmount)}</span>
            </div>
          </div>

          {/* Action Zone: Pay Now or Receipt Download */}
          {!isPaid ? (
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Choose Payment Method
              </h3>

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  onClick={() => setActiveTab('paypal')}
                  className={`py-2 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 transition ${
                    activeTab === 'paypal'
                      ? 'bg-lime-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>PayPal Sandbox Checkout</span>
                </button>
                <button
                  onClick={() => setActiveTab('upi')}
                  className={`py-2 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 transition ${
                    activeTab === 'upi'
                      ? 'bg-lime-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Instant UPI QR</span>
                </button>
              </div>

              {activeTab === 'paypal' ? (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#0070BA]/20 text-[#0070BA] flex items-center justify-center mx-auto">
                    <CreditCard className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Pay via PayPal Sandbox</h4>
                    <p className="text-slate-400 text-[11px] mt-1 max-w-sm mx-auto">
                      Checkout seamlessly with server-side capture verification. Invoices are settled in Indian Rupees (₹).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCheckoutInvoice(invoice);
                      setIsPayPalModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold text-xs shadow-lg transition active:scale-95"
                  >
                    Proceed with PayPal ({formatINR(invoice.totalAmount)})
                  </button>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Scan & Pay with any Indian UPI App</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Google Pay, PhonePe, Paytm, CRED, or BHIM
                    </p>
                  </div>

                  {/* QR Simulation Box */}
                  <div className="w-44 h-44 mx-auto p-3 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center">
                    <QrCode className="w-36 h-36 text-slate-950" />
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs">
                      {businessProfile.upiId || 'nextgenstudio@okaxis'}
                    </span>
                    <button
                      onClick={handleCopyUPI}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Once paid, our backend records your reference and dispatches receipt automatically.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Paid state receipt card */
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">This Invoice is Paid</h3>
              <p className="text-slate-400 text-xs">
                Verified on {invoice.paidAt ? formatDateIndian(invoice.paidAt) : 'Recently'}. Reference: {invoice.paymentReference || 'TXN-VERIFIED'}
              </p>
              <button
                onClick={handleDownloadInvoice}
                className="px-6 py-2.5 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs inline-flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Verified Receipt PDF</span>
              </button>
            </div>
          )}

          {/* Download invoice button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 no-print">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>256-Bit SSL Secured Billing Portal</span>
            </span>
            <button
              onClick={handleDownloadInvoice}
              className="text-slate-300 hover:text-white underline flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Invoice Copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
