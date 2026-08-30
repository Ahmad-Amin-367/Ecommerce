'use client';

import { useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
let stripePromise = null;
const getStripePromise = () => {
  if (!stripePromise && publishableKey) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

/**
 * StripeContainer wraps child elements in Stripe's <Elements> provider
 * using the server-generated clientSecret and customized brand theme.
 */
export default function StripeContainer({ children, clientSecret }) {
  const stripeInstance = useMemo(() => getStripePromise(), []);
  const options = useMemo(() => {
    if (!clientSecret) return null;

    return {
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#C67D5C', // Hisna Gifts brand primary
          colorBackground: '#FFFFFF',
          colorText: '#2B2B2B',
          colorDanger: '#DC2626',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontSizeBase: '15px',
          borderRadius: '12px',
          spacingUnit: '4px',
        },
        rules: {
          '.Input': {
            borderColor: '#E7DFD5',
            backgroundColor: '#FFFFFF',
            boxShadow: 'none',
            padding: '12px 14px',
          },
          '.Input:focus': {
            borderColor: '#C67D5C',
            boxShadow: '0 0 0 2px rgba(198, 125, 92, 0.2)',
          },
          '.Label': {
            fontWeight: '600',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6B655D',
            marginBottom: '6px',
          },
        },
      },
    };
  }, [clientSecret]);

  if (!publishableKey) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        ⚠️ Stripe configuration missing. Please ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is configured.
      </div>
    );
  }

  if (!clientSecret || !options) {
    return (
      <div className="p-6 bg-cream/60 border border-cloud rounded-xl flex items-center justify-center text-sm text-text-secondary animate-pulse">
        Initializing secure payment gateway...
      </div>
    );
  }

  return (
    <Elements stripe={stripeInstance} options={options}>
      {children}
    </Elements>
  );
}
