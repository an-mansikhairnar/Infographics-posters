'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SubmitInfographics from '../SubmitInfographics';
import { EDITOR_PUBLISH_PAYMENT_STORAGE_KEY, isPaymentData, type PaymentData } from '@/app/constants/payment';

type PaymentState = { status: 'loading' } | { status: 'ready'; payment: PaymentData } | { status: 'missing' };

export default function EditorSubmission({ initialImageUrl }: Readonly<{ initialImageUrl?: string }>) {
  const [paymentState, setPaymentState] = useState<PaymentState>({ status: 'loading' });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const storedPayment = sessionStorage.getItem(EDITOR_PUBLISH_PAYMENT_STORAGE_KEY);
        if (!storedPayment) {
          setPaymentState({ status: 'missing' });
          return;
        }

        const parsedPayment: unknown = JSON.parse(storedPayment);
        if (!isPaymentData(parsedPayment)) {
          throw new Error('Stored editor payment data is invalid.');
        }

        sessionStorage.removeItem(EDITOR_PUBLISH_PAYMENT_STORAGE_KEY);
        setPaymentState({ status: 'ready', payment: parsedPayment });
      } catch (error) {
        console.error('Could not restore editor payment details:', error);
        sessionStorage.removeItem(EDITOR_PUBLISH_PAYMENT_STORAGE_KEY);
        setPaymentState({ status: 'missing' });
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (paymentState.status === 'loading') {
    return <main className="p-8 text-center text-slate-600">Loading your submission form…</main>;
  }

  if (paymentState.status === 'missing') {
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Payment details not found</h1>
        <p className="mt-2 text-slate-600">Please return to the infographic editor and complete the payment again.</p>
        <Link href="/infographic-maker" className="mt-4 inline-block text-sky-600 underline">
          Return to infographic editor
        </Link>
      </main>
    );
  }

  return <SubmitInfographics initialImageUrl={initialImageUrl} initialPaymentData={paymentState.payment} />;
}
