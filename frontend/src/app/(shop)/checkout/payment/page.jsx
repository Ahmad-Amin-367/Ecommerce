'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import useCart from '@/hooks/useCart';
import orderService from '@/services/orderService';
import StripeContainer from '@/components/checkout/StripeContainer';
import StripeCardForm from '@/components/checkout/StripeCardForm';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatCurrency } from '@/utils/formatCurrency';
import { Lock, ShieldCheck, ChevronLeft, PackageCheck, AlertCircle, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const stripeRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [initError, setInitError] = useState('');

  // 1. Fetch Order and initialize PaymentIntent
  const fetchOrderAndPayment = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      setInitError('No order ID provided');
      return;
    }

    try {
      setLoading(true);
      setInitError('');

      // Fetch Order Details
      const orderRes = await orderService.getOrder(orderId);
      const orderData = orderRes.data?.data;

      if (!orderData) {
        throw new Error('Order not found');
      }

      setOrder(orderData);

      // If already paid, send directly to confirmation
      if (orderData.paymentStatus === 'PAID') {
        router.replace(`/checkout/confirmation?orderId=${orderId}`);
        return;
      }

      // Initialize Stripe PaymentIntent specifically for this order
      const intentRes = await orderService.createPaymentIntent({
        orderId: orderData.id,
        email: orderData.guestEmail || orderData.user?.email,
      });

      if (intentRes.data?.data?.clientSecret) {
        setClientSecret(intentRes.data.data.clientSecret);
      } else {
        throw new Error('Failed to retrieve payment configuration from server');
      }
    } catch (err) {
      console.error('Payment initialization error:', err);
      setInitError(err.response?.data?.message || err.message || 'Could not load order for payment');
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrderAndPayment();
  }, [fetchOrderAndPayment]);


  // 2. Handle Payment Submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!stripeRef.current) {
      toast.error('Payment gateway is still initializing. Please wait a moment.');
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm card payment with Stripe
      const paymentResult = await stripeRef.current.confirm(order.id);

      if (paymentResult?.success && paymentResult?.paymentIntent?.id) {
        // Record payment confirmation on backend database
        await orderService.confirmPayment({
          orderId: order.id,
          paymentIntentId: paymentResult.paymentIntent.id,
        });

        // Clear cart only after payment is successfully processed and confirmed
        clearCart();

        toast.success('Payment confirmed! Your order has been placed.');
        router.push(`/checkout/confirmation?orderId=${order.id}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err.message || 'Payment processing failed. Please check your card.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-text-secondary font-medium">Preparing your secure payment page...</p>
      </div>
    );
  }

  if (initError || !order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
        <h1 className="font-serif text-2xl font-bold text-charcoal mb-2">Order Payment Error</h1>
        <p className="text-text-secondary mb-6">{initError || 'We could not load your order details.'}</p>
        <Link href="/">
          <Button variant="primary">Return to Homepage</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Top bar navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/cart"
            className="flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Cancel & Return
          </Link>
          <div className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium border border-emerald-200">
            <ShieldCheck size={16} />
            256-Bit SSL Encrypted Payment
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-12">
          {/* Left Column: Stripe Card Payment Form */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 border border-cloud">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-cloud">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-charcoal">Payment Details</h1>
                  <p className="text-sm text-text-secondary mt-0.5">
                    Order <span className="font-mono font-bold text-primary">{order.orderNumber}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-muted uppercase block font-medium">Amount Due</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                {/* Embedded Stripe Elements Form */}
                <div className="mb-6">
                  <StripeContainer clientSecret={clientSecret}>
                    <StripeCardForm ref={stripeRef} />
                  </StripeContainer>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  rounded="none"
                  className="w-full h-14 text-base font-bold uppercase tracking-widest shadow-sm cursor-pointer flex items-center justify-center gap-2 rounded-none transition-transform active:scale-[0.99] hover:bg-primary-dark"
                  isLoading={isProcessing}
                  disabled={isProcessing || !clientSecret}
                >
                  <Lock size={18} />
                  <span>Pay Now ({formatCurrency(order.totalAmount)})</span>
                </Button>


                <div className="mt-4 text-center">
                  <p className="text-xs text-text-muted flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    Your card details are securely tokenized directly with Stripe. No card info is saved on our servers.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-cream/50 rounded-2xl border border-cloud p-6 sticky top-28 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-cloud">
                <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                  <PackageCheck size={20} className="text-primary" />
                  Order Summary
                </h2>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Pending Payment
                </span>
              </div>

              {/* Items List */}
              <ul className="divide-y divide-cloud/60 mb-6 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                {order.items?.map((item) => (
                  <li key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg bg-white border border-cloud overflow-hidden shrink-0">
                        <Image
                          src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                          alt={item.product?.name || 'Product'}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm font-mono font-bold">
                          {item.quantity}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-charcoal line-clamp-1">
                          {item.product?.name || 'Item'}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatCurrency(item.unitPrice)} each
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-charcoal">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Totals Breakdown */}
              <div className="border-t border-cloud pt-4 flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span className="font-medium text-charcoal">{formatCurrency(order.shippingFee)}</span>
                </div>
                <div className="border-t border-cloud mt-2 pt-3 flex justify-between items-center">
                  <span className="font-serif text-lg font-bold text-charcoal">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              {/* Delivery Address Preview */}
              {order.address && (
                <div className="mt-6 pt-4 border-t border-cloud text-xs text-text-secondary">
                  <p className="font-semibold text-charcoal mb-1">Delivering to:</p>
                  <p>{order.guestName || order.user?.name}</p>
                  <p>{order.address.street}, {order.address.city}, {order.address.postalCode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DedicatedPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
