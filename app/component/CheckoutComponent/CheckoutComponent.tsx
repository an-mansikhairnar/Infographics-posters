'use client';

import { PaymentData } from '@/app/constants/payment';
import { PayPalButtons } from '@paypal/react-paypal-js';

type CheckoutComponentProps = {
  amount: string;
  onPaymentSuccess?: (payment: PaymentData) => void;
};

export default function CheckoutComponent({ amount, onPaymentSuccess }: CheckoutComponentProps) {
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
      onApprove={async (data, actions) => {
        try {
          const details = await actions.order?.capture();

          if (!details) {
            throw new Error('Unable to capture PayPal payment.');
          }

          const payer = details.payer;
          const clientName = [payer?.name?.given_name, payer?.name?.surname].filter(Boolean).join(' ');
          const purchaseUnit = details.purchase_units?.[0];
          const capture = purchaseUnit?.payments?.captures?.[0];
          const paypalAddress = payer?.address;

          const addressParts = [
            paypalAddress?.address_line_1,
            paypalAddress?.address_line_2,
            paypalAddress?.admin_area_2,
            paypalAddress?.admin_area_1,
            paypalAddress?.postal_code,
            paypalAddress?.country_code,
          ].filter(Boolean);

          const address = addressParts.join(', ');
          const payment: PaymentData = {
            // PayPal order ID
            orderId: data.orderID || details.id || '',
            // PayPal payer ID
            payerId: payer?.payer_id || '',
            // PayPal capture transaction ID
            transactionId: capture?.id || '',
            // Amount
            amount: capture?.amount?.value || purchaseUnit?.amount?.value || amount,
            // Currency
            currency: capture?.amount?.currency_code || purchaseUnit?.amount?.currency_code || 'USD',
            // DO NOT use details.status here
            state: payer?.payer_id || '',
            // Combined PayPal address
            address,
            clientName,
          };

          onPaymentSuccess?.(payment);
        } catch (error) {
          console.error('Payment capture failed:', error);

          alert('Payment capture failed. Please try again.');
        }
      }}
      onCancel={() => {
        alert('Payment was cancelled.');
      }}
      onError={(err) => {
        console.error('PayPal Error:', err);

        alert('An error occurred while processing the payment.');
      }}
    />
  );
}
