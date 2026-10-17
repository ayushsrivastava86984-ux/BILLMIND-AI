/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { InvoiceList } from './components/invoices/InvoiceList';
import { InvoiceForm } from './components/invoices/InvoiceForm';
import { InvoicePreviewModal } from './components/invoices/InvoicePreviewModal';
import { DeleteInvoiceConfirmModal } from './components/invoices/DeleteInvoiceConfirmModal';
import { PublicPaymentPage } from './components/payments/PublicPaymentPage';
import { PayPalModal } from './components/payments/PayPalModal';
import { AiFinancialAssistant } from './components/assistant/AiFinancialAssistant';
import { AiBusinessInsights } from './components/insights/AiBusinessInsights';
import { ReceiptsView } from './components/receipts/ReceiptsView';
import { CustomersView } from './components/customers/CustomersView';
import { SettingsView } from './components/settings/SettingsView';
import { SupabaseSetupModal } from './components/supabase/SupabaseSetupModal';

const AppContent: React.FC = () => {
  const { currentView, toastMessage, resolvedTheme } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
      case 'auth-login':
        return <LoginPage />;
      case 'auth-signup':
        return <SignUpPage />;
      case 'auth-forgot':
        return <ForgotPasswordPage />;
      case 'dashboard':
        return <DashboardView />;
      case 'invoices':
        return <InvoiceList />;
      case 'create-invoice':
      case 'edit-invoice':
        return <InvoiceForm />;
      case 'view-invoice':
        return <InvoicePreviewModal />;
      case 'pay-public':
        return <PublicPaymentPage />;
      case 'assistant':
        return <AiFinancialAssistant />;
      case 'insights':
        return <AiBusinessInsights />;
      case 'receipts':
        return <ReceiptsView />;
      case 'customers':
        return <CustomersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        resolvedTheme === 'light' ? 'light bg-[#F8FAFC] text-slate-900' : 'dark bg-[#080D1A] text-slate-100'
      } flex flex-col font-sans selection:bg-lime-400 selection:text-slate-950 transition-colors duration-200`}
      data-theme={resolvedTheme}
    >
      {/* Hide navbar on public payment link if viewing as customer */}
      {currentView !== 'pay-public' && <Navbar />}

      <main className="flex-1">{renderView()}</main>

      {/* Global Modals & Confirmation Dialogs */}
      <PayPalModal />
      <SupabaseSetupModal />
      <LogoutConfirmModal />
      <DeleteInvoiceConfirmModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short no-print">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 shadow-2xl flex items-center space-x-2.5 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-lime-400"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
