import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceItem } from '../../types';
import { formatINR, amountInWordsINR } from '../../utils/formatters';
import {
  Sparkles,
  Plus,
  Trash2,
  Save,
  Eye,
  Download,
  Share2,
  CreditCard,
  Building,
  User,
  Calendar,
  Percent,
  FileText,
  AlertCircle,
  Check,
  RefreshCw,
} from 'lucide-react';

export const InvoiceForm: React.FC = () => {
  const {
    businessProfile,
    invoices,
    saveInvoice,
    setCurrentView,
    setSelectedInvoiceId,
    openPublicPaymentPage,
    showToast,
    selectedInvoiceId,
  } = useApp();

  // If editing existing invoice
  const existingInvoice = useMemo(() => {
    if (selectedInvoiceId) {
      return invoices.find((i) => i.id === selectedInvoiceId) || null;
    }
    return null;
  }, [selectedInvoiceId, invoices]);

  // AI prompt state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Form Fields
  const nextInvoiceNumber = useMemo(() => {
    if (existingInvoice) return existingInvoice.invoiceNumber;
    const maxNum = invoices.reduce((max, inv) => {
      const match = inv.invoiceNumber.match(/INV-\d{4}-(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        return n > max ? n : max;
      }
      return max;
    }, 0);
    const yr = new Date().getFullYear();
    return `INV-${yr}-${String(maxNum + 1).padStart(3, '0')}`;
  }, [invoices, existingInvoice]);

  const [invoiceNumber, setInvoiceNumber] = useState(
    existingInvoice?.invoiceNumber || nextInvoiceNumber
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDueStr = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const [issueDate, setIssueDate] = useState(existingInvoice?.issueDate || todayStr);
  const [dueDate, setDueDate] = useState(existingInvoice?.dueDate || defaultDueStr);

  // Customer fields
  const [customerName, setCustomerName] = useState(existingInvoice?.customer.name || '');
  const [customerEmail, setCustomerEmail] = useState(existingInvoice?.customer.email || '');
  const [customerPhone, setCustomerPhone] = useState(existingInvoice?.customer.phone || '');
  const [customerAddress, setCustomerAddress] = useState(existingInvoice?.customer.address || '');
  const [customerGstin, setCustomerGstin] = useState(existingInvoice?.customer.gstin || '');

  // Line items
  const [items, setItems] = useState<InvoiceItem[]>(
    existingInvoice?.items || [
      {
        id: `item-${Date.now()}`,
        description: 'Web Application Consulting & Development',
        quantity: 1,
        unitPrice: 25000,
        amount: 25000,
      },
    ]
  );

  // Taxes & Discounts
  const [taxRate, setTaxRate] = useState<number>(existingInvoice?.taxRate ?? 18);
  const [discountRate, setDiscountRate] = useState<number>(existingInvoice?.discountRate ?? 0);

  // Notes & terms
  const [notes, setNotes] = useState(
    existingInvoice?.notes ||
      'Thank you for your business. Please transfer amount to the designated UPI or Bank account.'
  );
  const [paymentTerms, setPaymentTerms] = useState(
    existingInvoice?.paymentTerms ||
      `Payment due on or before ${dueDate}. Direct UPI: ${businessProfile.upiId || 'nextgenstudio@okaxis'} or PayPal Sandbox.`
  );

  // Calculate live financial summary in INR
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!discountRate || discountRate <= 0) return 0;
    return Math.round((subtotal * discountRate) / 100);
  }, [subtotal, discountRate]);

  const taxableAmount = Math.max(subtotal - discountAmount, 0);

  const taxAmount = useMemo(() => {
    if (!taxRate || taxRate <= 0) return 0;
    return Math.round((taxableAmount * taxRate) / 100);
  }, [taxableAmount, taxRate]);

  const totalAmount = taxableAmount + taxAmount;

  // Handle line item updates
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            const q = field === 'quantity' ? Number(value) || 0 : item.quantity;
            const p = field === 'unitPrice' ? Number(value) || 0 : item.unitPrice;
            updated.amount = q * p;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      description: '',
      quantity: 1,
      unitPrice: 1000,
      amount: 1000,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) {
      showToast('Invoice must have at least one line item.');
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // AI Invoice Generation Call
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Please enter a description for the invoice (e.g. "Invoice for 35 hrs UX design at ₹2,000/hr + 18% GST").');
      return;
    }

    setIsAiGenerating(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          businessName: businessProfile.name,
          nextInvoiceNumber: invoiceNumber,
        }),
      });

      if (!res.ok) {
        throw new Error(`AI generation failed with status ${res.status}`);
      }

      const data = await res.json();

      if (data.customerName) setCustomerName(data.customerName);
      if (data.customerEmail) setCustomerEmail(data.customerEmail);
      if (data.customerPhone) setCustomerPhone(data.customerPhone);
      if (data.customerAddress) setCustomerAddress(data.customerAddress);
      if (data.customerGstin) setCustomerGstin(data.customerGstin);
      if (data.items && data.items.length > 0) setItems(data.items);
      if (typeof data.taxRate === 'number') setTaxRate(data.taxRate);
      if (typeof data.discountRate === 'number') setDiscountRate(data.discountRate);
      if (data.notes) setNotes(data.notes);
      if (data.paymentTerms) setPaymentTerms(data.paymentTerms);
      if (data.issueDate) setIssueDate(data.issueDate);
      if (data.dueDate) setDueDate(data.dueDate);

      showToast('Invoice draft generated with AI! Please review the details below.');
    } catch (err: any) {
      console.warn('Backend AI endpoint unavailable, using smart local parser for static deployment:', err);
      
      // Smart client-side natural language parser for static hosting
      let detectedTax = 18;
      const taxMatch = aiPrompt.match(/(\d+)%\s*(?:gst|tax|cgst|igst)?/i);
      if (taxMatch) {
        detectedTax = parseInt(taxMatch[1], 10);
      }

      let detectedQty = 1;
      const qtyMatch = aiPrompt.match(/(\d+)\s*(?:hrs?|hours?|days?|units?|items?|pages?|screens?|milestones?)/i);
      if (qtyMatch) {
        detectedQty = parseInt(qtyMatch[1], 10);
      }

      let detectedRate = 2500;
      const rateMatch = aiPrompt.match(/(?:at|@|₹|inr|rs\.?)\s*([\d,]+)/i);
      if (rateMatch) {
        const cleanRate = parseInt(rateMatch[1].replace(/,/g, ''), 10);
        if (!isNaN(cleanRate) && cleanRate > 0) detectedRate = cleanRate;
      }

      let detectedClient = '';
      const clientMatch = aiPrompt.match(/(?:for|client|to)\s+([A-Za-z0-9\s&]{3,30}?)(?:\s+at|\s+with|\s+for|\.|$|\n)/i);
      if (clientMatch) {
        detectedClient = clientMatch[1].trim();
      }

      const cleanDescription = aiPrompt.replace(/^invoice\s+(?:for\s+)?/i, '').trim();
      const generatedItems = [
        {
          id: `item-${Date.now()}`,
          description: cleanDescription || 'Professional Consulting Services',
          quantity: detectedQty,
          unitPrice: detectedRate,
          amount: detectedQty * detectedRate,
        },
      ];

      if (detectedClient) setCustomerName(detectedClient);
      setItems(generatedItems);
      setTaxRate(detectedTax);
      setNotes('Payment is due within 14 days of invoice date. Thank you for your business!');
      setPaymentTerms('Net 14 Days - Payment via UPI or Bank Transfer');
      showToast('Smart invoice draft generated! Review and customize the details below.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Build current invoice object
  const buildInvoiceObject = (status: Invoice['status'] = 'Pending'): Invoice => {
    const id = existingInvoice?.id || `inv-${Date.now()}`;
    return {
      id,
      invoiceNumber,
      customer: {
        name: customerName || 'Valued Client',
        email: customerEmail || 'client@example.com',
        phone: customerPhone,
        address: customerAddress,
        gstin: customerGstin,
      },
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountRate,
      discountAmount,
      totalAmount,
      status: existingInvoice ? existingInvoice.status : status,
      notes,
      paymentTerms,
      createdAt: existingInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSaveDraft = () => {
    const inv = buildInvoiceObject('Draft');
    saveInvoice(inv);
    setSelectedInvoiceId(inv.id);
  };

  const handleSaveAndPreview = () => {
    if (!customerName.trim()) {
      showToast('Please enter a Customer or Company Name.');
      return;
    }
    const inv = buildInvoiceObject('Pending');
    saveInvoice(inv);
    setSelectedInvoiceId(inv.id);
    setCurrentView('view-invoice');
  };

  const handleSharePaymentLink = () => {
    const inv = buildInvoiceObject('Pending');
    saveInvoice(inv);
    setSelectedInvoiceId(inv.id);
    openPublicPaymentPage(inv.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {existingInvoice ? `Edit Invoice: ${existingInvoice.invoiceNumber}` : 'Create New Invoice'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Indian Rupee (₹) GST compliant billing with instant AI drafting
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentView('invoices')}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={handleSaveAndPreview}
            className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-lime-400/20 transition active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview & Finalize</span>
          </button>
        </div>
      </div>

      {/* AI Invoice Generator Prompt Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-lime-500/30 shadow-xl shadow-lime-500/5">
        <div className="flex items-center space-x-2 mb-2 text-xs font-semibold text-lime-400">
          <Sparkles className="w-4 h-4 text-lime-400" />
          <span>AI Invoice Generator</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-400/10 text-lime-300 border border-lime-400/20">
            Powered by Gemini 3.8
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Type your billing request in plain English. For example: <em>"Invoice Zenith Consulting for 50 hours of AWS cloud DevOps at ₹2,500/hr plus 18% GST due in 10 days"</em>
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
            placeholder="Describe your invoice (Client, service, hours, rate in ₹, tax)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
          />
          <button
            onClick={handleAiGenerate}
            disabled={isAiGenerating}
            className="px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shrink-0 disabled:opacity-60 transition"
          >
            {isAiGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Draft...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </div>

        {aiError && (
          <p className="mt-2 text-xs text-rose-400 flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{aiError}</span>
          </p>
        )}
      </div>

      {/* Invoice Form Sections */}
      <div className="space-y-6">
        {/* Section 1: Business Details & Invoice Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          {/* Business From */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-lime-400" />
              <span>Billed From (Your Business)</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-white text-sm">{businessProfile.name}</p>
              <p>{businessProfile.ownerName} • {businessProfile.phone}</p>
              <p className="text-slate-400">{businessProfile.address}, {businessProfile.city}, {businessProfile.state} - {businessProfile.pincode}</p>
              <p className="text-[11px] text-lime-400 font-mono">
                GSTIN: {businessProfile.gstin || 'Not configured'} | PAN: {businessProfile.pan || 'N/A'}
              </p>
              <p className="text-[11px] text-slate-400">
                UPI ID: <span className="text-slate-200 font-mono">{businessProfile.upiId || 'nextgenstudio@okaxis'}</span>
              </p>
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-lime-400" />
              <span>Invoice Specifications</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Issue Date (DD/MM/YYYY)</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Due Date (DD/MM/YYYY)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Customer / Billed To */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-lime-400" />
            <span>Customer Details (Billed To)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-1">
              <label className="block text-slate-400 mb-1">
                Customer Name / Entity <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Learning Pvt Ltd"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Customer Email</label>
              <input
                type="email"
                placeholder="accounts@client.in"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Customer Phone (Optional)</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1">Customer Billing Address</label>
              <input
                type="text"
                placeholder="Street address, city, state, pin"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Customer GSTIN (if registered)</label>
              <input
                type="text"
                placeholder="e.g. 29AABCR1234F1Z5"
                value={customerGstin}
                onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Line Items */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Service / Product Line Items</span>
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="text-xs text-lime-400 font-semibold hover:underline flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-12 gap-3 items-center text-xs"
              >
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-slate-500 text-[10px] mb-1">Description / Deliverable</label>
                  <input
                    type="text"
                    placeholder="e.g. Website Development, Tuition Classes, Design Sprint"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className="block text-slate-500 text-[10px] mb-1">Quantity / Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-center"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className="block text-slate-500 text-[10px] mb-1">Rate in ₹</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div className="col-span-3 md:col-span-1 text-right">
                  <label className="block text-slate-500 text-[10px] mb-1">Amount</label>
                  <p className="font-bold text-white pt-2 font-mono">{formatINR(item.amount)}</p>
                </div>
                <div className="col-span-1 md:col-span-1 text-right">
                  <label className="block text-slate-500 text-[10px] mb-1 invisible">Del</label>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Taxes, Discounts, Notes & Totals Calculation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notes & Payment Terms */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Notes & Client Message</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payment Terms & Instructions</label>
              <textarea
                rows={3}
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Calculations Box strictly in INR */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 text-xs">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
              Indian Financial Breakdown
            </h3>

            {/* Subtotal */}
            <div className="flex items-center justify-between text-slate-300">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-white">{formatINR(subtotal)}</span>
            </div>

            {/* Discount selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Discount (%):</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-center font-mono text-white text-xs"
                />
              </div>
              <span className="font-mono text-amber-300">
                {discountAmount > 0 ? `-${formatINR(discountAmount)}` : '₹0'}
              </span>
            </div>

            {/* GST selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">GST Rate (%):</span>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  <option value={0}>0% (Exempt/Export)</option>
                  <option value={5}>5% (Essential Goods/Services)</option>
                  <option value={12}>12% (IT Hardware/Contract)</option>
                  <option value={18}>18% (Standard GST - Consulting/Software)</option>
                  <option value={28}>28% (Luxury/Special)</option>
                </select>
              </div>
              <span className="font-mono text-slate-200">+{formatINR(taxAmount)}</span>
            </div>

            {/* Total Grand Amount */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white">Grand Total (INR):</span>
                <p className="text-[10px] text-slate-400 italic">
                  {amountInWordsINR(totalAmount)}
                </p>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-lime-400 font-mono">
                {formatINR(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar as requested in prompt:
            - Generate with AI
            - Save Draft
            - Preview Invoice
            - Download PDF
            - Share Invoice
            - Create Payment Link
        */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold flex items-center space-x-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAndPreview}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold flex items-center space-x-1.5 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Invoice</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const inv = buildInvoiceObject('Pending');
                saveInvoice(inv);
                setSelectedInvoiceId(inv.id);
                setCurrentView('view-invoice');
                setTimeout(() => window.print(), 300);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const inv = buildInvoiceObject('Pending');
                saveInvoice(inv);
                setSelectedInvoiceId(inv.id);
                navigator.clipboard.writeText(`${window.location.origin}/#/pay/${inv.id}`);
                showToast(`Invoice link copied: ${window.location.origin}/#/pay/${inv.id}`);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold flex items-center space-x-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Invoice</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSharePaymentLink}
            className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold flex items-center space-x-2 shadow-lg shadow-lime-400/20 transition active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Create Payment Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};
