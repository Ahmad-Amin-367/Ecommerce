'use client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';
const stripePromise = loadStripe(stripePublishableKey);

export default function StripeProvider({ clientSecret, children }) {
  if (!clientSecret) return null;

  const options = {
    clientSecret,
    appearance: {
      theme: 'flat',
      variables: {
        colorPrimary: '#8B5CF6', // Purple primary theme to match design system
        colorBackground: '#FFFFFF',
        colorText: '#1F2937',
        colorDanger: '#EF4444',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        borderRadius: '12px',
        spacingUnit: '4px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
