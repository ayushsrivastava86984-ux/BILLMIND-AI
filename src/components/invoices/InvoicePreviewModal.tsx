import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDateIndian, amountInWordsINR } from '../../utils/formatters';
import {
  Printer,
  Share2,
  CreditCard,
  ArrowLeft,
  Edit2,
  CheckCircle2,
  QrCode,
  Download,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const InvoicePreviewModal: React.FC = () => {
  const {
    invoices,
    selectedInvoiceId,
    businessProfile,
    setCurrentView,
    setSelectedInvoiceId,
    openPublicPaymentPage,
    setIsPayPalModalOpen,
    setActiveCheckoutInvoice,
    showToast,
  } = useApp();

  const invoice = useMemo(() => {
    return invoices.find((i) => i.id === selectedInvoiceId) || invoices[0] || null;
  }, [invoices, selectedInvoiceId]);

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        <p>No invoice selected.</p>
        <button
          onClick={() => setCurrentView('invoices')}
          className="mt-4 px-4 py-2 bg-slate-800 rounded-xl text-white text-xs"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/#/pay/${invoice.id}`;
    navigator.clipboard.writeText(link);
    showToast(`Payment link copied to clipboard: ${link}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top action bar (hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <button
          onClick={() => setCurrentView('invoices')}
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Invoices</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSelectedInvoiceId(invoice.id);
              setCurrentView('edit-invoice');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium flex items-center space-x-1"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-300 text-xs font-medium flex items-center space-x-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Payment Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          {invoice.status !== 'Paid' && (
            <button
              onClick={() => {
                setActiveCheckoutInvoice(invoice);
                setIsPayPalModalOpen(true);
              }}
              className="px-4 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-lime-400/20 active:scale-95 transition"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>PayPal Checkout</span>
            </button>
          )}
        </div>
      </div>

      {/* Invoice Paper Card (designed for pristine on-screen preview & pixel-perfect print) */}
      <div className="print-container bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-200/80">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl text-slate-950 tracking-tight">
                {businessProfile.name}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                Tax Invoice
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{businessProfile.ownerName}</p>
            <p className="text-xs text-slate-600">
              {businessProfile.address}, {businessProfile.city}, {businessProfile.state} - {businessProfile.pincode}
            </p>
            <p className="text-xs text-slate-600">
              Phone: {businessProfile.phone} | Email: {businessProfile.email}
            </p>
            {businessProfile.gstin && (
              <p className="text-xs font-semibold text-slate-800 mt-1">
                GSTIN: <span className="font-mono">{businessProfile.gstin}</span> | PAN: <span className="font-mono">{businessProfile.pan || 'N/A'}</span>
              </p>
            )}
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-sm">
              {invoice.invoiceNumber}
            </div>
            <p className="text-xs text-slate-500">
              Invoice Date: <strong className="text-slate-800">{formatDateIndian(invoice.issueDate)}</strong>
            </p>
            <p className="text-xs text-slate-500">
              Payment Due: <strong className="text-slate-800">{formatDateIndian(invoice.dueDate)}</strong>
            </p>
            {invoice.status === 'Paid' ? (
              <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>PAID IN FULL</span>
              </div>
            ) : invoice.status === 'Overdue' ? (
              <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded-md bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold">
                <span>PAYMENT OVERDUE</span>
              </div>
            ) : (
              <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold">
                <span>PAYMENT DUE</span>
              </div>
            )}
          </div>
        </div>

        {/* Billed To Section */}
        <div className="py-6 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Billed To (Client / Customer):
            </p>
            <p className="font-bold text-base text-slate-900">{invoice.customer.name}</p>
            {invoice.customer.address && (
              <p className="text-slate-600 mt-0.5">{invoice.customer.address}</p>
            )}
            <p className="text-slate-600">
              {invoice.customer.city && `${invoice.customer.city}, `}{invoice.customer.state}
            </p>
            <p className="text-slate-600">
              {invoice.customer.email && `Email: ${invoice.customer.email}`}{' '}
              {invoice.customer.phone && `| Phone: ${invoice.customer.phone}`}
            </p>
            {invoice.customer.gstin && (
              <p className="font-semibold text-slate-800 mt-1">
                Client GSTIN: <span className="font-mono">{invoice.customer.gstin}</span>
              </p>
            )}
          </div>

          <div className="sm:text-right space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Place of Supply & Currency:
            </p>
            <p className="font-semibold text-slate-800">
              State: {invoice.customer.state || businessProfile.state} (India)
            </p>
            <p className="text-slate-600">
              Currency: <strong>Indian Rupees (₹ / INR)</strong>
            </p>
            {invoice.paymentReference && (
              <p className="text-[11px] text-emerald-700 font-mono mt-1">
                Transaction Ref: {invoice.paymentReference}
              </p>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-800 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">Service / Item Description</th>
                <th className="py-2.5 px-2 text-center">Qty</th>
                <th className="py-2.5 px-2 text-right">Rate in ₹</th>
                <th className="py-2.5 px-2 text-right">Amount in ₹</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="py-3 px-2 text-slate-500 font-mono">{idx + 1}</td>
                  <td className="py-3 px-2 font-medium text-slate-900">{item.description}</td>
                  <td className="py-3 px-2 text-center text-slate-700">{item.quantity}</td>
                  <td className="py-3 px-2 text-right font-mono text-slate-800">
                    {formatINR(item.unitPrice)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-slate-950">
                    {formatINR(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Amount in Words */}
        <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-6 text-xs">
          <div className="max-w-md space-y-3">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Amount in Words:
              </p>
              <p className="font-semibold text-slate-900 italic mt-0.5">
                {amountInWordsINR(invoice.totalAmount)}
              </p>
            </div>

            {/* Payment Remittance Details */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
              <p className="font-bold text-slate-800">Payment & Bank Remittance:</p>
              <p className="text-slate-700">
                UPI ID: <strong className="font-mono">{businessProfile.upiId || 'nextgenstudio@okaxis'}</strong>
              </p>
              <p className="text-slate-700">
                Bank: {businessProfile.bankName} | A/C: {businessProfile.accountNumber}
              </p>
              <p className="text-slate-700">
                IFSC: <span className="font-mono font-bold">{businessProfile.ifscCode}</span>
              </p>
            </div>
          </div>

          {/* Breakdown box */}
          <div className="w-full sm:w-72 space-y-2 border-t sm:border-t-0 pt-2 sm:pt-0">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-slate-900">{formatINR(invoice.subtotal)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Discount ({invoice.discountRate}%):</span>
                <span className="font-mono">-{formatINR(invoice.discountAmount)}</span>
              </div>
            )}
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-slate-700">
                <span>GST ({invoice.taxRate}%):</span>
                <span className="font-mono">+{formatINR(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-center text-sm font-extrabold text-slate-950">
              <span>Total Payable:</span>
              <span className="text-lg font-mono text-slate-950">{formatINR(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Notes & Authorized Signatory */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
              Notes & Terms:
            </p>
            <p className="text-slate-600 leading-relaxed">{invoice.notes}</p>
            <p className="text-slate-600 mt-1 italic">{invoice.paymentTerms}</p>
          </div>

          <div className="sm:text-right space-y-8">
            <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              For {businessProfile.name}
            </p>
            <div className="pt-8">
              <span className="inline-block border-t border-slate-400 pt-1 text-[11px] text-slate-500 font-medium">
                Authorized Signatory
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
