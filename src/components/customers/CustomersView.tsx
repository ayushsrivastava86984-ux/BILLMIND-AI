import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  Users,
  Plus,
  Mail,
  Phone,
  Building,
  MapPin,
  FileText,
  Search,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, saveCustomer, invoices, setSelectedInvoiceId, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New customer form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      address: address.trim(),
      gstin: gstin.trim(),
      totalBilled: 0,
    };

    saveCustomer(newCust);
    setIsAdding(false);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setAddress('');
    setGstin('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain verified client entities, GSTIN records, and historical billings
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{isAdding ? 'Close Form' : 'Add New Customer'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="font-bold text-white text-sm">Register New Client Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Customer / Entity Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Tech Solutions"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="finance@acme.in"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Company / Trade Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Global Inc"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Client GSTIN (if applicable)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="29AABCA1234F1Z8"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">City & State</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Bengaluru, Karnataka"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-lime-400 text-slate-950 font-bold"
            >
              Save Customer
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search client directory..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-lime-400"
        />
      </div>

      {/* Grid of customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          // Calculate total billed for this customer from invoices
          const customerInvoices = invoices.filter(
            (i) => i.customer?.name.toLowerCase() === cust.name.toLowerCase()
          );
          const totalCustomerBilled = customerInvoices.reduce(
            (sum, inv) => sum + (Number(inv.totalAmount) || 0),
            0
          );

          return (
            <div
              key={cust.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between text-xs space-y-3 hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{cust.name}</h3>
                    {cust.company && (
                      <p className="text-slate-400 text-[11px]">{cust.company}</p>
                    )}
                  </div>
                  <span className="font-bold text-lime-400 font-mono">
                    {formatINR(totalCustomerBilled)}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-slate-400 text-[11px]">
                  {cust.email && (
                    <div className="flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cust.email}</span>
                    </div>
                  )}
                  {cust.phone && (
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cust.phone}</span>
                    </div>
                  )}
                  {cust.gstin && (
                    <div className="flex items-center space-x-1.5 font-mono text-[10px] text-slate-400">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>GSTIN: {cust.gstin}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {customerInvoices.length} bill(s) issued
                </span>
                <button
                  onClick={() => {
                    setCurrentView('create-invoice');
                  }}
                  className="text-xs text-lime-400 font-semibold hover:underline"
                >
                  + Create Invoice
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
