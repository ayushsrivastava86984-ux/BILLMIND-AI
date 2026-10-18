import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../types';
import { formatINR, formatDateIndian } from '../../utils/formatters';
import {
  Search,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  Download,
  Share2,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Filter,
  ArrowUpDown,
  Sparkles,
  Printer,
} from 'lucide-react';

export const InvoiceList: React.FC = () => {
  const {
    invoices,
    setCurrentView,
    setSelectedInvoiceId,
    deleteInvoice,
    openPublicPaymentPage,
    setIsPayPalModalOpen,
    setActiveCheckoutInvoice,
    showToast,
    setInvoiceToDelete,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | InvoiceStatus>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'due-soon'>('date-desc');

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        const matchesStatus = selectedStatus === 'All' || inv.status === selectedStatus;
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          inv.invoiceNumber.toLowerCase().includes(q) ||
          (inv.customer?.name || '').toLowerCase().includes(q) ||
          inv.items.some((it) => it.description.toLowerCase().includes(q));
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
        }
        if (sortBy === 'amount-desc') {
          return b.totalAmount - a.totalAmount;
        }
        if (sortBy === 'amount-asc') {
          return a.totalAmount - b.totalAmount;
        }
        if (sortBy === 'due-soon') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      });
  }, [invoices, searchTerm, selectedStatus, sortBy]);

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Paid</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Overdue</span>
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <span>Draft</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-500 line-through">
            <span>Cancelled</span>
          </span>
        );
    }
  };

  const statusCounts = useMemo(() => {
    const counts = { All: invoices.length, Draft: 0, Pending: 0, Paid: 0, Overdue: 0, Cancelled: 0 };
    invoices.forEach((inv) => {
      if (counts[inv.status] !== undefined) {
        counts[inv.status]++;
      }
    });
    return counts;
  }, [invoices]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Invoices & Billing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, verify payments, and export compliant GST invoices in Indian Rupees (₹)
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedInvoiceId(null);
            setCurrentView('create-invoice');
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-lime-400/15 transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>+ Create Invoice</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {(['All', 'Paid', 'Pending', 'Overdue', 'Draft', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition ${
                selectedStatus === st
                  ? 'bg-lime-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{st}</span>
              <span className="ml-1.5 text-[11px] opacity-75">
                ({statusCounts[st] || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by customer, invoice #, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-slate-400 flex items-center space-x-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
            >
              <option value="date-desc">Newest Issue Date</option>
              <option value="date-asc">Oldest Issue Date</option>
              <option value="due-soon">Due Date Soonest</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl shadow-black/40">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <p className="font-semibold text-sm text-slate-300">No matching invoices found</p>
            <p>Try adjusting your search filters or create a new invoice with AI.</p>
            <button
              onClick={() => {
                setSelectedInvoiceId(null);
                setCurrentView('create-invoice');
              }}
              className="px-4 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs inline-flex items-center space-x-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Invoice Now</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer Entity</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-sm">{inv.customer?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {inv.items[0]?.description || 'Service details'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {formatDateIndian(inv.issueDate)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {formatDateIndian(inv.dueDate)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                      {formatINR(inv.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* View & Print preview */}
                      <button
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setCurrentView('view-invoice');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                        title="View Invoice Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Direct Print */}
                      <button
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setCurrentView('view-invoice');
                          setTimeout(() => {
                            window.focus();
                            window.print();
                          }, 150);
                        }}
                        className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition"
                        title="Print Invoice directly"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setCurrentView('edit-invoice');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                        title="Edit Invoice"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Public payment page link */}
                      <button
                        onClick={() => openPublicPaymentPage(inv.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 transition"
                        title="Open Customer Payment Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Record payment or PayPal Sandbox verification if unpaid */}
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => {
                            setActiveCheckoutInvoice(inv);
                            setIsPayPalModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-lime-400/20 hover:bg-lime-400/30 text-lime-300 transition"
                          title="Verify Payment (PayPal Sandbox)"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete with Confirmation Modal */}
                      <button
                        onClick={() => setInvoiceToDelete(inv)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
