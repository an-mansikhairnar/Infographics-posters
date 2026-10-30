'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CheckoutComponent from '../../component/CheckoutComponent/CheckoutComponent';
import { EDITOR_PUBLISH_PAYMENT_STORAGE_KEY, type PaymentData } from '@/app/constants/payment';

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const isPaypalConfigured = Boolean(paypalClientId);

const initialOptions = {
  clientId: paypalClientId!,
  currency: 'USD',
  intent: 'capture',
  'disable-funding': 'card',
};

export default function PaymentStep({
  initialImageUrl,
  onClose,
}: Readonly<{ initialImageUrl?: string; onClose?: () => void }>) {
  const router = useRouter();

  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePaymentSuccess = (payment: PaymentData) => {
    try {
      sessionStorage.setItem(EDITOR_PUBLISH_PAYMENT_STORAGE_KEY, JSON.stringify(payment));
    } catch (error) {
      console.error('Payment completed, but its details could not be saved:', error);
      alert('Payment completed, but we could not save the payment details for your submission. Please contact support.');
      return;
    }

    const params = new URLSearchParams();
    if (initialImageUrl) params.set('temp_image', initialImageUrl);
    const query = params.toString();
    router.push(query ? `/submit-infographics/editor-submission?${query}` : '/submit-infographics/editor-submission');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="infographic-payment-title"
        className="relative my-auto w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment dialog"
            className="absolute right-4 top-4 rounded-md p-2 text-xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            ×
          </button>
        )}
        <h1 id="infographic-payment-title" className="pr-10 text-2xl font-bold text-slate-900">
          Complete your payment
        </h1>
        {/* <p className="mt-2 text-sm leading-6 text-slate-600">
          Pay the one-time $30 fee to publish your infographic. After payment, you’ll continue to the submission details form.
        </p> */}

        <div className="mt-6 rounded-lg border border-slate-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Infographic publication</span>
            <span className="text-lg font-bold text-slate-900">$30.00 USD</span>
          </div>

          {isPaypalConfigured ? (
            <PayPalScriptProvider options={initialOptions}>
              <CheckoutComponent amount="30.00" onPaymentSuccess={handlePaymentSuccess} />
            </PayPalScriptProvider>
          ) : (
            <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              PayPal checkout is unavailable until a valid PayPal client ID is configured.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
