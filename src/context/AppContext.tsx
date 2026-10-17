import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessProfile, Customer, Invoice, PaymentRecord, ThemeMode } from '../types';
import {
  sampleBusinessProfile,
  sampleCustomers,
  sampleInvoices,
  samplePayments,
} from '../utils/sampleData';
import { isInvoiceOverdue } from '../utils/formatters';
import { authenticateUser, registerUser, resetUserPassword } from '../utils/auth';

export type AppView =
  | 'landing'
  | 'auth'
  | 'auth-login'
  | 'auth-signup'
  | 'auth-forgot'
  | 'dashboard'
  | 'invoices'
  | 'create-invoice'
  | 'view-invoice'
  | 'edit-invoice'
  | 'assistant'
  | 'insights'
  | 'receipts'
  | 'pay-public'
  | 'customers'
  | 'settings';

export interface UserSession {
  email: string;
  name: string;
  businessName: string;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  navigateTo: (view: AppView) => void;
  user: UserSession | null;
  businessProfile: BusinessProfile;
  invoices: Invoice[];
  customers: Customer[];
  payments: PaymentRecord[];
  isSampleData: boolean;
  selectedInvoiceId: string | null;
  setSelectedInvoiceId: (id: string | null) => void;
  publicInvoiceId: string | null;
  setPublicInvoiceId: (id: string | null) => void;
  authRedirectMessage: string | null;
  setAuthRedirectMessage: (msg: string | null) => void;
  // Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, businessName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  saveInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  markInvoicePaid: (invoiceId: string, paymentData: {
    amount: number;
    transactionRef: string;
    receiptNumber: string;
    paymentMethod: string;
    notes?: string;
  }) => void;
  saveCustomer: (customer: Customer) => void;
  updateBusinessProfile: (profile: BusinessProfile) => void;
  loadSampleData: () => void;
  clearAllData: () => void;
  openPublicPaymentPage: (invoiceId: string) => void;
  // Modal controllers
  isPayPalModalOpen: boolean;
  setIsPayPalModalOpen: (open: boolean) => void;
  activeCheckoutInvoice: Invoice | null;
  setActiveCheckoutInvoice: (inv: Invoice | null) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  isLogoutConfirmOpen: boolean;
  setIsLogoutConfirmOpen: (open: boolean) => void;
  invoiceToDelete: Invoice | null;
  setInvoiceToDelete: (inv: Invoice | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Theme state: 'light' | 'dark' | 'system'
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'billmind_user',
  BUSINESS: 'billmind_business',
  INVOICES: 'billmind_invoices',
  CUSTOMERS: 'billmind_customers',
  PAYMENTS: 'billmind_payments',
  IS_SAMPLE: 'billmind_is_sample',
  THEME_MODE: 'billmind_theme_mode',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & routing
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [publicInvoiceId, setPublicInvoiceId] = useState<string | null>(null);
  const [authRedirectMessage, setAuthRedirectMessage] = useState<string | null>(null);

  // Modals & confirmation dialogs
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
  const [activeCheckoutInvoice, setActiveCheckoutInvoice] = useState<Invoice | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme mode: 'light' | 'dark' | 'system'
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
      return 'system';
    } catch {
      return 'system';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Calculate and apply resolved theme
  useEffect(() => {
    const updateResolvedTheme = () => {
      let active: 'light' | 'dark';
      if (themeMode === 'system') {
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        active = isDark ? 'dark' : 'light';
      } else {
        active = themeMode;
      }
      setResolvedTheme(active);

      const root = document.documentElement;
      const body = document.body;

      if (active === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
        body.classList.remove('dark');
        body.classList.add('light');
        body.setAttribute('data-theme', 'light');
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        body.classList.remove('light');
        body.classList.add('dark');
        body.setAttribute('data-theme', 'dark');
      }
    };

    updateResolvedTheme();

    // Listen to OS theme changes if on system default
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeMode === 'system') {
        updateResolvedTheme();
      }
    };

    try {
      mediaQuery.addEventListener('change', handleChange);
    } catch {
      mediaQuery.addListener(handleChange);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode);
    } catch (e) {
      console.warn('Theme storage error:', e);
    }

    return () => {
      try {
        mediaQuery.removeEventListener('change', handleChange);
      } catch {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    showToast(`Theme updated to ${mode === 'system' ? 'System Default' : mode === 'light' ? 'Light Mode' : 'Dark Mode'}.`);
  };

  const toggleTheme = () => {
    setThemeModeState((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark';
    });
  };

  // User session state
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUSINESS);
      return saved ? JSON.parse(saved) : sampleBusinessProfile;
    } catch {
      return sampleBusinessProfile;
    }
  });

  const [isSampleData, setIsSampleData] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IS_SAMPLE);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (saved) return JSON.parse(saved);
      return sampleInvoices;
    } catch {
      return sampleInvoices;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (saved) return JSON.parse(saved);
      return sampleCustomers;
    } catch {
      return sampleCustomers;
    }
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (saved) return JSON.parse(saved);
      return samplePayments;
    } catch {
      return samplePayments;
    }
  });

  // Handle URL hash changes for direct deep linking e.g. /#/pay/inv-101
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/pay/')) {
        const invId = hash.replace('#/pay/', '');
        if (invId) {
          setPublicInvoiceId(invId);
          setCurrentView('pay-public');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check and update overdue status dynamically
  useEffect(() => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.status !== 'Paid' && inv.status !== 'Cancelled' && inv.status !== 'Draft') {
          if (isInvoiceOverdue(inv.dueDate, inv.status) && inv.status !== 'Overdue') {
            return { ...inv, status: 'Overdue' };
          }
        }
        return inv;
      })
    );
  }, []);

  // Protected route navigation guard
  const navigateTo = (view: AppView) => {
    const protectedViews: AppView[] = [
      'dashboard',
      'invoices',
      'create-invoice',
      'edit-invoice',
      'view-invoice',
      'assistant',
      'insights',
      'receipts',
      'customers',
      'settings',
    ];

    if (protectedViews.includes(view) && !user) {
      setAuthRedirectMessage('Please sign in to access your business records and financial dashboard.');
      setCurrentView('auth-login');
      return;
    }

    setAuthRedirectMessage(null);
    setCurrentView(view);
  };

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(businessProfile));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [businessProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.IS_SAMPLE, JSON.stringify(isSampleData));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [isSampleData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  // Real authenticated login
  const login = async (email: string, password: string, rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    const res = await authenticateUser(email, password);
    if (!res.success || !res.user) {
      return { success: false, error: res.error || 'Authentication failed' };
    }

    const sessionUser: UserSession = {
      email: res.user.email,
      name: res.user.fullName,
      businessName: res.user.businessName,
    };

    setUser(sessionUser);

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));
    } else {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));
      localStorage.removeItem(STORAGE_KEYS.USER);
    }

    setBusinessProfile((prev) => ({
      ...prev,
      name: res.user!.businessName || prev.name,
      ownerName: res.user!.fullName || prev.ownerName,
      email: res.user!.email || prev.email,
    }));

    setAuthRedirectMessage(null);
    setCurrentView('dashboard');
    showToast(`Welcome back, ${sessionUser.name}!`);
    return { success: true };
  };

  // Real registration
  const signup = async (
    fullName: string,
    businessName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await registerUser(fullName, businessName, email, password);
    if (!res.success || !res.user) {
      return { success: false, error: res.error || 'Account creation failed' };
    }

    const sessionUser: UserSession = {
      email: res.user.email,
      name: res.user.fullName,
      businessName: res.user.businessName,
    };

    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));

    setBusinessProfile((prev) => ({
      ...prev,
      name: businessName,
      ownerName: fullName,
      email: email,
    }));

    setAuthRedirectMessage(null);
    setCurrentView('dashboard');
    showToast(`Account successfully created for ${businessName}!`);
    return { success: true };
  };

  // Real password reset
  const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const res = await resetUserPassword(email, newPassword);
    if (!res.success) {
      return { success: false, error: res.error || 'Password reset failed' };
    }
    showToast('Password updated! Please log in with your new credentials.');
    return { success: true };
  };

  // Secure logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    setIsLogoutConfirmOpen(false);
    setCurrentView('auth-login');
    showToast('You have been logged out securely.');
  };

  const saveInvoice = (invoice: Invoice) => {
    setInvoices((prev) => {
      const idx = prev.findIndex((i) => i.id === invoice.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...invoice, updatedAt: new Date().toISOString() };
        return updated;
      }
      return [invoice, ...prev];
    });

    if (invoice.customer && invoice.customer.name) {
      setCustomers((prev) => {
        const existing = prev.find(
          (c) => c.name.toLowerCase() === invoice.customer.name.toLowerCase()
        );
        if (!existing) {
          const newCust: Customer = {
            id: `cust-${Date.now()}`,
            name: invoice.customer.name,
            email: invoice.customer.email || '',
            phone: invoice.customer.phone || '',
            address: invoice.customer.address || '',
            city: invoice.customer.city || '',
            state: invoice.customer.state || '',
            gstin: invoice.customer.gstin || '',
            totalBilled: invoice.totalAmount,
          };
          return [newCust, ...prev];
        }
        return prev;
      });
    }

    setIsSampleData(false);
    showToast(`Invoice ${invoice.invoiceNumber} saved successfully.`);
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    setInvoiceToDelete(null);
    showToast('Invoice deleted successfully.');
  };

  const markInvoicePaid = (
    invoiceId: string,
    paymentData: {
      amount: number;
      transactionRef: string;
      receiptNumber: string;
      paymentMethod: string;
      notes?: string;
    }
  ) => {
    const nowISO = new Date().toISOString();
    let paidInvoiceNumber = '';
    let customerName = '';

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          paidInvoiceNumber = inv.invoiceNumber;
          customerName = inv.customer?.name || 'Customer';
          return {
            ...inv,
            status: 'Paid',
            paidAt: nowISO,
            paymentReference: paymentData.transactionRef,
            paymentMethod: paymentData.paymentMethod,
            receiptNumber: paymentData.receiptNumber,
            updatedAt: nowISO,
          };
        }
        return inv;
      })
    );

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      invoiceId,
      invoiceNumber: paidInvoiceNumber || invoiceId,
      customerName,
      amount: paymentData.amount,
      date: nowISO,
      status: 'Completed',
      transactionRef: paymentData.transactionRef,
      receiptNumber: paymentData.receiptNumber,
      paymentMethod: paymentData.paymentMethod,
      notes: paymentData.notes,
    };

    setPayments((prev) => [newPayment, ...prev]);
    showToast(`Payment of ₹${paymentData.amount.toLocaleString('en-IN')} verified for ${paidInvoiceNumber}!`);
  };

  const saveCustomer = (customer: Customer) => {
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.id === customer.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = customer;
        return updated;
      }
      return [customer, ...prev];
    });
    showToast(`Customer ${customer.name} saved.`);
  };

  const updateBusinessProfile = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
    showToast('Business details updated.');
  };

  const loadSampleData = () => {
    setInvoices(sampleInvoices);
    setCustomers(sampleCustomers);
    setPayments(samplePayments);
    setBusinessProfile(sampleBusinessProfile);
    setIsSampleData(true);
    showToast('Realistic Indian sample business data loaded.');
  };

  const clearAllData = () => {
    setInvoices([]);
    setCustomers([]);
    setPayments([]);
    setIsSampleData(false);
    showToast('All transaction records cleared.');
  };

  const openPublicPaymentPage = (invoiceId: string) => {
    setPublicInvoiceId(invoiceId);
    window.location.hash = `#/pay/${invoiceId}`;
    setCurrentView('pay-public');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigateTo,
        user,
        businessProfile,
        invoices,
        customers,
        payments,
        isSampleData,
        selectedInvoiceId,
        setSelectedInvoiceId,
        publicInvoiceId,
        setPublicInvoiceId,
        authRedirectMessage,
        setAuthRedirectMessage,
        login,
        signup,
        resetPassword,
        logout,
        saveInvoice,
        deleteInvoice,
        markInvoicePaid,
        saveCustomer,
        updateBusinessProfile,
        loadSampleData,
        clearAllData,
        openPublicPaymentPage,
        isPayPalModalOpen,
        setIsPayPalModalOpen,
        activeCheckoutInvoice,
        setActiveCheckoutInvoice,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        isLogoutConfirmOpen,
        setIsLogoutConfirmOpen,
        invoiceToDelete,
        setInvoiceToDelete,
        toastMessage,
        showToast,
        themeMode,
        resolvedTheme,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
