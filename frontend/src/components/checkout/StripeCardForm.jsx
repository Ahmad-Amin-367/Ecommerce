'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';

const StripeCardForm = forwardRef(function StripeCardForm(
  { onReady, onError },
  ref
) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [isElementLoaded, setIsElementLoaded] = useState(false);

  // Expose payment confirmation method to parent checkout form
  useImperativeHandle(ref, () => ({
    confirm: async (orderId) => {
      if (!stripe || !elements) {
        throw new Error('Payment gateway is still initializing. Please wait a moment.');
      }

      setErrorMessage('');

      // Submit elements to validate form fields client-side first
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || 'Please verify your card details.');
        throw new Error(submitError.message || 'Please verify your card details.');
      }

      const returnUrl = `${window.location.origin}/checkout/confirmation?orderId=${orderId}`;

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        redirect: 'if_required', // Prevents unnecessary page redirects unless 3DS authentication requires it
      });

      if (result.error) {
        let msg = result.error.message || 'Payment processing failed.';
        if (result.error.type === 'card_error') {
          if (result.error.code === 'card_declined') {
            msg = 'Your card was declined. Please try another card or contact your bank.';
          } else if (result.error.code === 'insufficient_funds') {
            msg = 'Insufficient funds on card.';
          } else if (result.error.code === 'expired_card') {
            msg = 'Your card has expired. Please use a valid card.';
          }
        }
        setErrorMessage(msg);
        onError?.(msg);
        throw new Error(msg);
      }

      return {
        success: true,
        paymentIntent: result.paymentIntent,
      };
    },
  }));

  return (
    <div className="space-y-4">
      <div className="bg-[#FAF8F5] border border-cloud rounded-2xl p-5 md:p-6 shadow-sm">
        {/* Header with Security Badge */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-cloud/70">
          <div className="flex items-center gap-2 text-charcoal font-medium text-sm">
            <Lock size={16} className="text-primary" />
            <span>Credit / Debit Card</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium border border-emerald-200">
            <ShieldCheck size={14} />
            <span>Stripe Encrypted (PCI-DSS)</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Stripe Payment Element configured strictly for Card only */}
        <div className="min-h-[140px]">
          <PaymentElement
            onReady={() => {
              setIsElementLoaded(true);
              onReady?.();
            }}
            onChange={(e) => {
              if (e.complete) {
                setErrorMessage('');
              }
            }}
            options={{
              wallets: {
                applePay: 'never',
                googlePay: 'never',
              },
              layout: {
                type: 'tabs',
                defaultCollapsed: false,
              },
            }}
          />
        </div>

        {/* Card Networks Footer */}
        <div className="mt-5 pt-3 border-t border-cloud/60 flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Lock size={12} />
            End-to-End 256-bit Encryption
          </span>
          <span className="font-medium text-warm-gray">Visa • Mastercard • Amex • Discover</span>
        </div>
      </div>
    </div>
  );
});

export default StripeCardForm;
