'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import orderService from '@/services/orderService';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatCurrency } from '@/utils/formatCurrency';
import { CheckCircle2, PackageCheck, ArrowRight, ShoppingBag, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const redirectStatus = searchParams.get('redirect_status');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrder(orderId);
        setOrder(res.data.data);
      } catch (err) {
        toast.error('Could not load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-text-secondary font-medium">Verifying payment & loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
        <h1 className="font-serif text-2xl font-bold text-charcoal mb-2">Order Not Found</h1>
        <p className="text-text-secondary mb-6">We couldn't retrieve the details for this order.</p>
        <Link href="/">
          <Button variant="primary">Return to Homepage</Button>
        </Link>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'PAID' || redirectStatus === 'succeeded';

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header Banner */}
        <div className="bg-white rounded-2xl shadow-card p-8 text-center mb-8 border border-cloud">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal mb-2">Thank You for Your Order!</h1>
          <p className="text-text-secondary text-base max-w-md mx-auto mb-4">
            {isPaid
              ? 'Your payment was confirmed successfully! We are preparing your gift package now.'
              : 'Your order has been placed. We will notify you when it ships.'}
          </p>

          <div className="inline-flex items-center gap-2 bg-cream px-4 py-2 rounded-xl border border-cloud text-sm">
            <span className="text-text-muted">Order Number:</span>
            <span className="font-mono font-bold text-primary">{order.orderNumber}</span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 border border-cloud mb-8">
          <div className="flex items-center justify-between border-b border-cloud pb-4 mb-6">
            <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
              <PackageCheck size={22} className="text-primary" />
              Order Summary
            </h2>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
              }`}>
                {isPaid ? 'PAID via Card' : order.paymentMethod === 'CASH_ON_DELIVERY' ? 'COD (Pay on Delivery)' : order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Items List */}
          <ul className="divide-y divide-cloud/60 mb-6">
            {order.items?.map((item) => (
              <li key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg bg-cream border border-cloud overflow-hidden shrink-0">
                    <Image
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal line-clamp-1">{item.product?.name || 'Item'}</p>
                    <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-charcoal">{formatCurrency(item.totalPrice)}</span>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="bg-cream/40 rounded-xl p-4 space-y-2 border border-cloud/60 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Shipping</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-charcoal pt-2 border-t border-cloud">
              <span>Total Paid</span>
              <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="mt-6 pt-4 border-t border-cloud text-sm">
              <h3 className="font-medium text-charcoal mb-1">Shipping Address</h3>
              <p className="text-text-secondary">{order.address.street}, {order.address.city}, {order.address.postalCode}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/profile">
            <Button variant="secondary" className="w-full sm:w-auto h-12 px-6">
              View Order History
            </Button>
          </Link>
          <Link href="/">
            <Button variant="primary" className="w-full sm:w-auto h-12 px-6 flex items-center justify-center gap-2">
              <ShoppingBag size={18} />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
