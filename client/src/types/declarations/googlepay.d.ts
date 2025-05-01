/**
 * Type definitions for Google Pay API
 */

declare module 'googlepay' {
  export interface GooglePayConfig {
    environment: 'TEST' | 'PRODUCTION';
    merchantId: string;
    merchantName: string;
  }

  export interface GooglePayClient {
    isReadyToPay(request: any): Promise<boolean>;
    createButton(options: any): HTMLElement;
    loadPaymentData(paymentRequest: any): Promise<any>;
  }

  // Add any additional types you need for your Google Pay implementation
}