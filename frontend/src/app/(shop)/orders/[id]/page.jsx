'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useOrder } from '@/hooks/useOrders';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  PackageCheck,
  ChevronLeft,
  MapPin,
  CreditCard,
  AlertCircle,
  ShoppingBag,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Package
} from 'lucide-react';

const getStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return { label: 'Pending', icon: Clock, bg: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'CONFIRMED':
      return { label: 'Confirmed', icon: CheckCircle2, bg: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'PROCESSING':
      return { label: 'Processing', icon: Package, bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    case 'SHIPPED':
      return { label: 'Shipped', icon: Truck, bg: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'DELIVERED':
      return { label: 'Delivered', icon: CheckCircle2, bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'CANCELLED':
      return { label: 'Cancelled', icon: XCircle, bg: 'bg-rose-100 text-rose-800 border-rose-200' };
    default:
      return { label: status || 'Unknown', icon: Clock, bg: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-background">
        <Spinner size="lg" />
        <p className="text-text-secondary font-medium">Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-background">
        <div className="bg-white rounded-2xl shadow-card border border-cloud p-8 text-center max-w-md">
          <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
          <h1 className="font-serif text-2xl font-bold text-charcoal mb-2">Order Not Found</h1>
          <p className="text-text-secondary mb-6 text-sm">
            We couldn't retrieve details for order <span className="font-mono font-semibold text-charcoal">#{id}</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/profile">
              <Button variant="secondary" className="w-full sm:w-auto">
                My Orders
              </Button>
            </Link>
            <Link href="/">
              <Button variant="primary" className="w-full sm:w-auto">
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(order.status);
  const StatusIcon = statusBadge.icon;
  const isPaid = order.paymentStatus === 'PAID';

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        {/* Navigation back bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/profile"
            className="flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Calendar size={14} />
            <span>Placed {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl shadow-card border border-cloud p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cloud pb-6">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
                Order Details
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                #{order.orderNumber}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg}`}
              >
                <StatusIcon size={14} />
                {statusBadge.label}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                <CreditCard size={13} />
                {isPaid ? 'PAID' : 'PAYMENT PENDING'}
              </span>
            </div>
          </div>

          {/* Grid of details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
            {/* Left: Purchased Items */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                <PackageCheck size={20} className="text-primary" />
                Items in Order ({order.items?.length || 0})
              </h2>

              <ul className="divide-y divide-cloud/60">
                {order.items?.map((item) => (
                  <li key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl bg-cream border border-cloud overflow-hidden shrink-0">
                        <Image
                          src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                          alt={item.product?.name || 'Product'}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-charcoal line-clamp-1">
                          {item.product?.name || 'Product'}
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">
                          Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-charcoal">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </li>
                ))}
              </ul>

              {order.notes && (
                <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                  <span className="font-semibold block mb-1">Customer Note:</span>
                  <p>{order.notes}</p>
                </div>
              )}
            </div>

            {/* Right: Payment & Delivery Summary */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-cream/40 rounded-xl p-5 border border-cloud text-sm">
                <h3 className="font-serif font-bold text-charcoal mb-3">Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span className="font-medium text-charcoal">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span className="font-medium text-charcoal">{formatCurrency(order.shippingFee)}</span>
                  </div>
                  <div className="border-t border-cloud pt-2.5 mt-2 flex justify-between font-bold text-base text-charcoal">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-cloud text-xs text-text-muted flex justify-between">
                  <span>Method:</span>
                  <span className="font-medium text-charcoal uppercase">{order.paymentMethod?.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Delivery Address */}
              {order.address && (
                <div className="bg-white rounded-xl p-5 border border-cloud text-sm">
                  <h3 className="font-serif font-bold text-charcoal mb-2 flex items-center gap-1.5">
                    <MapPin size={16} className="text-primary" />
                    Delivery Address
                  </h3>
                  <div className="text-xs text-text-secondary space-y-0.5 leading-relaxed">
                    <p className="font-semibold text-charcoal">{order.user?.name || order.guestName}</p>
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.city}, {order.address.postalCode}
                    </p>
                    <p>{order.address.country}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link href="/category/all">
            <Button variant="primary" className="px-8 h-12 flex items-center gap-2">
              <ShoppingBag size={18} />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
