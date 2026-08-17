'use client';
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Button from '@/components/ui/Button';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StripeCardForm({ orderId, totalAmount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Payment gateway is still loading. Please wait...');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const returnUrl = `${window.location.origin}/checkout/confirmation?orderId=${orderId}`;

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
      });

      // This point will only be reached if there is an immediate error confirming payment (e.g. card declined).
      // Otherwise, customer is redirected to return_url.
      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unexpected error occurred while processing your payment. Please try again.');
        }
        toast.error(error.message || 'Payment failed');
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error during payment confirmation');
      toast.error('Connection error. Don\'t worry, check your orders or try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-cream/40 border border-cloud rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-cloud/60">
          <div className="flex items-center gap-2 text-charcoal font-medium">
            <Lock size={18} className="text-primary" />
            <span>Credit / Debit Card</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck size={14} />
            <span>256-bit Encrypted</span>
          </div>
        </div>

        {/* Stripe Payment Element */}
        <div className="py-2">
          <PaymentElement 
            options={{
              layout: 'tabs',
            }} 
          />
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full sm:w-1/3 py-3 px-4 border border-cloud rounded-xl font-medium text-text-secondary hover:bg-cream/50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Change Method
          </button>
        )}
        
        <Button
          type="submit"
          variant="primary"
          className="w-full h-14 text-base font-semibold shadow-md cursor-pointer flex-1"
          isLoading={isProcessing}
          disabled={!stripe || !elements || isProcessing}
        >
          {isProcessing ? 'Processing Payment...' : `Pay ${totalAmount} Now`}
        </Button>
      </div>

      <p className="text-xs text-center text-text-muted flex items-center justify-center gap-1">
        <Lock size={12} />
        Your card details are safely processed directly by Stripe.
      </p>
    </form>
  );
}
