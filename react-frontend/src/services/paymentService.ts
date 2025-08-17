import axios from 'axios';
import { API_CONFIG } from '../config/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CompetitionPayment {
  name: string;
  mobile: string;
  competitionId: string;
  amount: number;
  paymentId: string;
}

class PaymentService {
  private baseURL = `${API_CONFIG.BASE_URL}/payment`;

  // Create payment order
  async createOrder(amount: number, receipt: string, notes?: any): Promise<PaymentOrder> {
    try {
      const response = await axios.post(`${this.baseURL}/create-order`, {
        amount,
        currency: 'INR',
        receipt,
        notes
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create payment order');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error creating payment order');
    }
  }

  // Verify payment
  async verifyPayment(verificationData: PaymentVerification): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/verify`, verificationData);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Payment verification failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error verifying payment');
    }
  }

  // Process competition payment
  async processCompetitionPayment(paymentData: CompetitionPayment): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/competition`, paymentData);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Payment processing failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error processing payment');
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/status/${paymentId}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get payment status');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error fetching payment status');
    }
  }

  // Initialize Razorpay payment
  async initializeRazorpayPayment(
    orderId: string,
    amount: number,
    currency: string = 'INR',
    name: string = 'TypingHub',
    description: string = 'Competition Registration',
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    },
    notes?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount * 100, // Convert to paise
        currency,
        name,
        description,
        order_id: orderId,
        prefill: prefill || {},
        notes: notes || {},
        theme: {
          color: '#1976d2'
        },
        handler: (response: any) => {
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled'));
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  }

  // Load Razorpay SDK
  loadRazorpaySDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.head.appendChild(script);
    });
  }
}

export default new PaymentService();

