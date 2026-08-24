'use client';
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { CreditCard, Lock, ShieldCheck, AlertCircle, Calendar, Hash, MapPin } from 'lucide-react';

const CloverCardForm = forwardRef(function CloverCardForm(
  { onReady, onError },
  ref
) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const cloverInstanceRef = useRef(null);
  const elementsRef = useRef(null);
  const mountedRef = useRef(false);

  const env = (process.env.NEXT_PUBLIC_CLOVER_ENVIRONMENT || 'sandbox').toLowerCase();
  const pak = process.env.NEXT_PUBLIC_CLOVER_PAK;
  const merchantId = process.env.NEXT_PUBLIC_CLOVER_MERCHANT_ID;

  const scriptSrc =
    env === 'production'
      ? 'https://checkout.clover.com/sdk.js'
      : 'https://checkout.sandbox.dev.clover.com/sdk.js';

  // Load Clover SDK Script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!pak || !merchantId) {
      const configErr = 'Clover configuration missing. Please ensure NEXT_PUBLIC_CLOVER_PAK and NEXT_PUBLIC_CLOVER_MERCHANT_ID are set in frontend/.env.';
      setSdkError(configErr);
      onError?.(configErr);
      return;
    }

    if (window.Clover) {
      setSdkLoaded(true);
      return;
    }

    // Check if script is already present in document
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => setSdkLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => {
      setSdkLoaded(true);
    };
    script.onerror = () => {
      const err = 'Failed to load Clover Payment SDK. Please check your internet connection.';
      setSdkError(err);
      onError?.(err);
    };

    document.head.appendChild(script);
  }, [scriptSrc, pak, merchantId, onError]);

  // Initialize and mount Clover Iframe Elements
  useEffect(() => {
    if (!sdkLoaded || !window.Clover || !pak || !merchantId || mountedRef.current) return;

    try {
      const clover = new window.Clover(pak, {
        merchantId: merchantId,
      });
      cloverInstanceRef.current = clover;

      const elements = clover.elements();
      elementsRef.current = elements;

      const customStyles = {
        'input': {
          'font-family': 'Inter, system-ui, -apple-system, sans-serif',
          'font-size': '15px',
          'color': '#2B2B2B',
          'line-height': '24px',
          'font-weight': '500',
          '::placeholder': {
            'color': '#8C857B',
            'font-weight': '400',
          },
        },
        'input:focus': {
          'color': '#1A1A1A',
        },
        'input.invalid': {
          'color': '#DC2626',
        },
      };

      const cardNumber = elements.create('CARD_NUMBER', customStyles);
      const cardDate = elements.create('CARD_DATE', customStyles);
      const cardCvv = elements.create('CARD_CVV', customStyles);
      const cardPostalCode = elements.create('CARD_POSTAL_CODE', customStyles);

      // Mount into container divs
      cardNumber.mount('#clover-card-number');
      cardDate.mount('#clover-card-date');
      cardCvv.mount('#clover-card-cvv');
      cardPostalCode.mount('#clover-card-postal-code');

      // Real-time validation listeners
      cardNumber.addEventListener('change', (event) => {
        setFieldErrors((prev) => ({
          ...prev,
          cardNumber: event?.CARD_NUMBER?.error || '',
        }));
      });

      cardDate.addEventListener('change', (event) => {
        setFieldErrors((prev) => ({
          ...prev,
          cardDate: event?.CARD_DATE?.error || '',
        }));
      });

      cardCvv.addEventListener('change', (event) => {
        setFieldErrors((prev) => ({
          ...prev,
          cardCvv: event?.CARD_CVV?.error || '',
        }));
      });

      cardPostalCode.addEventListener('change', (event) => {
        setFieldErrors((prev) => ({
          ...prev,
          cardPostalCode: event?.CARD_POSTAL_CODE?.error || '',
        }));
      });

      mountedRef.current = true;
      onReady?.();
    } catch (err) {
      console.error('Failed to initialize Clover elements:', err);
      setSdkError('Could not initialize Clover payment form.');
      onError?.(err.message || 'Initialization failed');
    }

    return () => {
      mountedRef.current = false;
    };
  }, [sdkLoaded, pak, merchantId, onReady, onError]);

  // Expose tokenize function to parent component
  useImperativeHandle(ref, () => ({
    tokenize: async () => {
      if (!cloverInstanceRef.current) {
        throw new Error('Payment gateway is still initializing. Please try again.');
      }

      setFieldErrors({});

      try {
        const result = await cloverInstanceRef.current.createToken();

        if (result.errors) {
          const errorsMap = {};
          let primaryErrorMessage = '';

          Object.entries(result.errors).forEach(([key, msg]) => {
            errorsMap[key] = msg;
            if (!primaryErrorMessage) primaryErrorMessage = msg;
          });

          setFieldErrors(errorsMap);
          throw new Error(primaryErrorMessage || 'Please verify your card details.');
        }

        if (!result.token) {
          throw new Error('Failed to generate secure card token. Please check your details.');
        }

        return result.token;
      } catch (error) {
        throw error;
      }
    },
  }));

  return (
    <div className="space-y-5">
      <div className="bg-[#FAF8F5] border border-cloud rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-cloud/70">
          <div className="flex items-center gap-2 text-charcoal font-medium text-sm">
            <Lock size={16} className="text-primary" />
            <span>Credit / Debit Card</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium border border-emerald-200">
            <ShieldCheck size={14} />
            <span>TD / Clover Secured (SAQ-A)</span>
          </div>
        </div>

        {sdkError && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{sdkError}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warm-gray mb-1.5">
              <CreditCard size={14} className="text-text-muted" />
              Card Number *
            </label>
            <div
              id="clover-card-number"
              className={`w-full min-h-[46px] px-3.5 py-2.5 bg-white border rounded-xl transition-all ${
                fieldErrors.cardNumber || fieldErrors.CARD_NUMBER
                  ? 'border-red-400 ring-1 ring-red-300'
                  : 'border-cloud focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
              }`}
            />
            {(fieldErrors.cardNumber || fieldErrors.CARD_NUMBER) && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {fieldErrors.cardNumber || fieldErrors.CARD_NUMBER}
              </p>
            )}
          </div>

          {/* Expiry, CVV & Postal Code Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Expiry Date */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warm-gray mb-1.5">
                <Calendar size={14} className="text-text-muted" />
                Expiry Date *
              </label>
              <div
                id="clover-card-date"
                className={`w-full min-h-[46px] px-3.5 py-2.5 bg-white border rounded-xl transition-all ${
                  fieldErrors.cardDate || fieldErrors.CARD_DATE
                    ? 'border-red-400 ring-1 ring-red-300'
                    : 'border-cloud focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                }`}
              />
              {(fieldErrors.cardDate || fieldErrors.CARD_DATE) && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {fieldErrors.cardDate || fieldErrors.CARD_DATE}
                </p>
              )}
            </div>

            {/* CVV / Security Code */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warm-gray mb-1.5">
                <Hash size={14} className="text-text-muted" />
                CVV / CVC *
              </label>
              <div
                id="clover-card-cvv"
                className={`w-full min-h-[46px] px-3.5 py-2.5 bg-white border rounded-xl transition-all ${
                  fieldErrors.cardCvv || fieldErrors.CARD_CVV
                    ? 'border-red-400 ring-1 ring-red-300'
                    : 'border-cloud focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                }`}
              />
              {(fieldErrors.cardCvv || fieldErrors.CARD_CVV) && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {fieldErrors.cardCvv || fieldErrors.CARD_CVV}
                </p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warm-gray mb-1.5">
                <MapPin size={14} className="text-text-muted" />
                Postal Code *
              </label>
              <div
                id="clover-card-postal-code"
                className={`w-full min-h-[46px] px-3.5 py-2.5 bg-white border rounded-xl transition-all ${
                  fieldErrors.cardPostalCode || fieldErrors.CARD_POSTAL_CODE
                    ? 'border-red-400 ring-1 ring-red-300'
                    : 'border-cloud focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                }`}
              />
              {(fieldErrors.cardPostalCode || fieldErrors.CARD_POSTAL_CODE) && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {fieldErrors.cardPostalCode || fieldErrors.CARD_POSTAL_CODE}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-cloud/60 flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Lock size={12} />
            Encrypted End-to-End via Clover Tokenizer
          </span>
          <span className="font-medium text-warm-gray">Visa • Mastercard • Amex • Interac</span>
        </div>
      </div>
    </div>
  );
});

export default CloverCardForm;
