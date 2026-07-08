'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';

type CheckoutComponentProps = {
  amount: string;
};

export default function CheckoutComponent({ amount }: CheckoutComponentProps) {
  return (
    <PayPalButtons
      style={{
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        height: 45,
        label: 'checkout',
        tagline: false,
      }}
      createOrder={(_, actions) =>
        actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                value: amount,
                currency_code: 'USD',
              },
            },
          ],
        })
      }
      onApprove={async (_, actions) => {
        const details = await actions.order?.capture();
        alert(`Payment of $${amount} completed successfully!`);
      }}
      onCancel={(data) => {
        alert('Payment was cancelled.');
      }}
      onError={(err) => {
        console.error('PayPal Error:', err);
        alert('An error occurred while processing the payment.');
      }}
    />
  );
}
