export interface BusinessProfile {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  pan?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  gstin?: string;
  totalBilled?: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // in INR (₹)
  amount: number;    // in INR (₹)
}

export type InvoiceStatus = 'Draft' | 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    gstin?: string;
  };
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;      // GST % e.g. 18
  taxAmount: number;
  discountRate: number; // % e.g. 5
  discountAmount: number;
  totalAmount: number;  // in INR (₹)
  status: InvoiceStatus;
  notes: string;
  paymentTerms: string;
  paymentReference?: string;
  paidAt?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number; // in INR (₹)
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  transactionRef: string;
  receiptNumber: string;
  paymentMethod: string;
  notes?: string;
}

export interface BusinessInsight {
  type: 'alert' | 'positive' | 'tip' | 'summary';
  title: string;
  description: string;
  metric: string;
  actionLabel: string;
  actionRoute?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface RegisteredUser {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}
