import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import { Trash2, X, AlertTriangle } from 'lucide-react';

export const DeleteInvoiceConfirmModal: React.FC = () => {
  const { invoiceToDelete, setInvoiceToDelete, deleteInvoice } = useApp();

  if (!invoiceToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm no-print">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-xs">
        <button
          onClick={() => setInvoiceToDelete(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Delete Invoice Record</h2>
            <p className="text-slate-400 text-[11px]">Confirm deletion of invoice</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-5 space-y-2 text-slate-300">
          <div className="flex justify-between font-mono">
            <span>Invoice Number:</span>
            <span className="font-bold text-white">{invoiceToDelete.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span className="font-semibold text-white">{invoiceToDelete.customer?.name}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800">
            <span>Invoice Total:</span>
            <span className="font-bold text-rose-400 font-mono">
              {formatINR(invoiceToDelete.totalAmount)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            This action cannot be undone. All line items and payment metadata associated with this bill will be removed.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setInvoiceToDelete(null)}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteInvoice(invoiceToDelete.id)}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
