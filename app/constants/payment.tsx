
export type PaymentData = {
  orderId: string;
  payerId: string;
  transactionId: string;
  amount: string;
  currency: string;
  state: string;
  address: string;
  clientName: string;
};

export const EDITOR_PUBLISH_PAYMENT_STORAGE_KEY = 'editorPublishPayment';

export const isPaymentData = (value: unknown): value is PaymentData =>
  typeof value === 'object' &&
  value !== null &&
  'orderId' in value &&
  typeof value.orderId === 'string' &&
  'payerId' in value &&
  typeof value.payerId === 'string' &&
  'transactionId' in value &&
  typeof value.transactionId === 'string' &&
  'amount' in value &&
  typeof value.amount === 'string' &&
  'currency' in value &&
  typeof value.currency === 'string' &&
  'state' in value &&
  typeof value.state === 'string' &&
  'address' in value &&
  typeof value.address === 'string' &&
  'clientName' in value &&
  typeof value.clientName === 'string';
