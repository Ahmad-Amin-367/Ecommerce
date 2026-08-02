'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Search,
  MapPin,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'ALL', label: 'All Orders' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'PROCESSING', label: 'Processing' },
  { id: 'SHIPPED', label: 'Shipped' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

const getStatusDetails = (status) => {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Pending',
        bgClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dotClass: 'bg-amber-500',
        Icon: Clock,
      };
    case 'PROCESSING':
      return {
        label: 'Processing',
        bgClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
        dotClass: 'bg-blue-500',
        Icon: Package,
      };
    case 'SHIPPED':
      return {
        label: 'Shipped',
        bgClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
        dotClass: 'bg-purple-500',
        Icon: Truck,
      };
    case 'DELIVERED':
      return {
        label: 'Delivered',
        bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotClass: 'bg-emerald-500',
        Icon: CheckCircle2,
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        bgClass: 'bg-rose-50 text-rose-700 border-rose-200/60',
        dotClass: 'bg-rose-500',
        Icon: XCircle,
      };
    default:
      return {
        label: status || 'Unknown',
        bgClass: 'bg-gray-50 text-gray-700 border-gray-200',
        dotClass: 'bg-gray-400',
        Icon: Package,
      };
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isAuthChecked } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/orders/my-orders');
      const orderList = Array.isArray(data?.data) ? data.data : [];
      setOrders(orderList);
      // Accordions closed by default
      setExpandedOrderId(null);
    } catch (err) {
      console.error('Error fetching my-orders:', err);
      const errMsg = err.response?.data?.message || 'Failed to load order history.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push('/login?redirect=/profile');
      return;
    }

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, isAuthChecked, router]);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  // Metrics summary calculation
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
    const activeOrders = orders.filter((o) =>
      ['PENDING', 'PROCESSING', 'SHIPPED'].includes(o.status)
    ).length;
    const completedOrders = orders.filter((o) => o.status === 'DELIVERED').length;

    return { totalOrders, pendingOrders, activeOrders, completedOrders };
  }, [orders]);

  // Status counters
  const statusCounts = useMemo(() => {
    const counts = { ALL: orders.length };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Filtered orders list based on status & search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        selectedStatus === 'ALL' || order.status === selectedStatus;

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        (order.orderNumber && order.orderNumber.toLowerCase().includes(q)) ||
        order.items?.some((item) =>
          item.product?.name?.toLowerCase().includes(q)
        );

      return matchesStatus && matchesQuery;
    });
  }, [orders, selectedStatus, searchQuery]);

  if (!isAuthChecked || (isLoading && orders.length === 0 && !error)) {
    return <ProfileSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen py-6 sm:py-10 md:py-12">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-6xl">
        {/* User Account Banner */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-card border border-cloud p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-glow rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-charcoal truncate">
                {user?.name || 'Valued Customer'}
              </h1>
              <p className="text-text-secondary text-xs sm:text-sm md:text-base mt-0.5 truncate">
                {user?.email}
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-cloud text-text-secondary hover:text-charcoal hover:bg-cream/60 transition-all text-xs sm:text-sm font-medium shrink-0"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh Orders</span>
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-cloud">
            <div className="bg-cream/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-cloud/60 text-center sm:text-left">
              <p className="text-[10px] sm:text-xs text-text-secondary font-medium uppercase tracking-wider">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-charcoal mt-0.5 sm:mt-1">{metrics.totalOrders}</p>
            </div>
            <div className="bg-cream/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-cloud/60 text-center sm:text-left">
              <p className="text-[10px] sm:text-xs text-text-secondary font-medium uppercase tracking-wider">Active Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-primary mt-0.5 sm:mt-1">{metrics.activeOrders}</p>
            </div>
            <div className="bg-cream/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-cloud/60 text-center sm:text-left">
              <p className="text-[10px] sm:text-xs text-text-secondary font-medium uppercase tracking-wider">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-forest mt-0.5 sm:mt-1">{metrics.completedOrders}</p>
            </div>
            <div className="bg-cream/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-cloud/60 text-center sm:text-left">
              <p className="text-[10px] sm:text-xs text-text-secondary font-medium uppercase tracking-wider">Pending Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-0.5 sm:mt-1">{metrics.pendingOrders}</p>
            </div>
          </div>
        </div>

        {/* Order History Main Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-card border border-cloud overflow-hidden">
          {/* Header & Controls Bar */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-cloud space-y-4 sm:space-y-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal flex items-center gap-2">
                <Package className="text-primary" size={22} />
                Order History
              </h2>
              <p className="text-text-secondary text-xs sm:text-sm mt-0.5 sm:mt-1">
                Track and manage all purchases associated with your account.
              </p>
            </div>

            {/* Search and Filters Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search by Order # or Product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-14 py-2.5 text-xs sm:text-sm bg-cream/30 border border-cloud rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-charcoal placeholder:text-text-muted"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-text-muted hover:text-charcoal bg-cloud/60 px-1.5 py-0.5 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative shrink-0 w-full sm:w-56">
                <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full appearance-none pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-cream/30 border border-cloud rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-charcoal cursor-pointer font-medium"
                >
                  {STATUS_TABS.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Orders Content Area */}
          <div className="p-4 sm:p-6 md:p-8">
            {error ? (
              <div className="text-center py-10 px-4 max-w-md mx-auto">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-3 border border-rose-100">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-base font-bold text-charcoal mb-1">Failed to load order history</h3>
                <p className="text-text-secondary text-xs sm:text-sm mb-5">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-colors shadow-soft"
                >
                  Try Again
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4 max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cream rounded-full flex items-center justify-center text-warm-gray mx-auto mb-4 border border-cloud shadow-inner">
                  <ShoppingBag size={32} className="text-primary/70 sm:hidden" />
                  <ShoppingBag size={38} className="text-primary/70 hidden sm:block" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-charcoal mb-1.5">
                  {orders.length === 0 ? 'No orders placed yet' : 'No matching orders found'}
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm mb-6 leading-relaxed">
                  {orders.length === 0
                    ? 'When you purchase items from our catalog, your order details will appear right here.'
                    : 'Try clearing your search query or switching status filters to view other orders.'}
                </p>
                {orders.length === 0 ? (
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-primary text-white font-medium text-xs sm:text-sm rounded-xl hover:shadow-lifted transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Explore Products</span>
                    <ArrowRight size={15} />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedStatus('ALL');
                      setSearchQuery('');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 border border-cloud rounded-xl text-xs sm:text-sm font-medium text-text-secondary hover:text-charcoal hover:bg-cream/60 transition-colors"
                  >
                    <RotateCcw size={15} />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusDetails(order.status);
                  const StatusIcon = statusInfo.Icon;
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="border border-cloud rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary/40 transition-all bg-white shadow-soft"
                    >
                      {/* Accordion Header Bar: Order Number, Status, and Arrow ONLY */}
                      <div
                        onClick={() => toggleOrderExpand(order.id)}
                        className="bg-cream/40 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-2.5 sm:gap-4 border-b border-cloud/60 cursor-pointer select-none hover:bg-cream/70 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                          <span className="text-[11px] sm:text-xs text-text-muted font-semibold uppercase tracking-wider shrink-0">
                            Order #
                          </span>
                          <span className="font-semibold text-charcoal text-xs sm:text-sm md:text-base font-mono truncate">
                            {order.orderNumber || order.id?.substring(0, 8)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${statusInfo.bgClass}`}
                          >
                            <StatusIcon size={12} className="shrink-0 sm:w-3.5 sm:h-3.5" />
                            <span>{statusInfo.label}</span>
                          </span>

                          {/* Arrow Toggle Icon */}
                          <div
                            className="p-1 text-text-secondary hover:text-charcoal rounded-lg transition-colors"
                            aria-label={isExpanded ? 'Collapse order' : 'Expand order'}
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-300 ease-in-out shrink-0 ${
                                isExpanded ? 'rotate-180' : 'rotate-0'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Smooth CSS Grid Expandable Accordion Container */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                            {/* Inside Meta Summary Bar: Date Placed, Total Amount & Item Count */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 p-3.5 sm:p-4 bg-cream/30 rounded-xl sm:rounded-2xl border border-cloud/60 text-xs sm:text-sm">
                              <div>
                                <p className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Date Placed</p>
                                <p className="font-semibold text-charcoal mt-0.5 sm:mt-1">
                                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Total Amount</p>
                                <p className="font-bold text-primary mt-0.5 sm:mt-1">
                                  {formatCurrency(order.totalAmount)}
                                </p>
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <p className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Items</p>
                                <p className="font-semibold text-charcoal mt-0.5 sm:mt-1">
                                  {order.items?.length || 0} Item(s)
                                </p>
                              </div>
                            </div>

                            {/* Purchased Items List */}
                            <div>
                              <h4 className="text-[11px] sm:text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 sm:mb-4">
                                Purchased Items ({order.items?.length || 0})
                              </h4>
                              <div className="divide-y divide-cloud/60 border border-cloud/60 rounded-xl sm:rounded-2xl overflow-hidden">
                                {order.items?.map((item) => (
                                  <div
                                    key={item.id}
                                    className="p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:bg-cream/20 transition-colors"
                                  >
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-cream rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-cloud">
                                        <Image
                                          src={
                                            item.product?.images?.[0] ||
                                            'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=300'
                                          }
                                          alt={item.product?.name || 'Product Image'}
                                          fill
                                          className="object-cover"
                                          sizes="64px"
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <Link
                                          href={`/products`}
                                          className="font-medium text-charcoal hover:text-primary transition-colors text-xs sm:text-sm md:text-base line-clamp-1"
                                        >
                                          {item.product?.name || 'Gift Item'}
                                        </Link>
                                        <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5">
                                          Qty: <span className="font-semibold text-charcoal">{item.quantity}</span> × {formatCurrency(item.unitPrice)}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                      <p className="text-[10px] sm:text-xs text-text-muted">Subtotal</p>
                                      <p className="text-xs sm:text-sm font-bold text-charcoal">
                                        {formatCurrency(Number(item.unitPrice) * Number(item.quantity))}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Shipping Details & Payment Footer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
                              {/* Shipping Info */}
                              {order.address && (
                                <div className="bg-cream/30 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-cloud/60 text-xs">
                                  <p className="font-semibold text-charcoal flex items-center gap-1.5 mb-2">
                                    <MapPin size={14} className="text-primary shrink-0" /> Delivery Address
                                  </p>
                                  <p className="text-text-secondary font-medium">
                                    {order.address.fullName || user?.name}
                                  </p>
                                  <p className="text-text-muted mt-0.5 leading-relaxed">
                                    {order.address.street || order.address.addressLine1}
                                    {order.address.city ? `, ${order.address.city}` : ''}
                                    {order.address.postalCode ? ` ${order.address.postalCode}` : ''}
                                  </p>
                                  {order.address.phone && (
                                    <p className="text-text-muted mt-1">Phone: {order.address.phone}</p>
                                  )}
                                </div>
                              )}

                              {/* Payment Summary */}
                              <div className="bg-cream/30 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-cloud/60 text-xs flex flex-col justify-between">
                                <div>
                                  <p className="font-semibold text-charcoal flex items-center gap-1.5 mb-2">
                                    <CreditCard size={14} className="text-primary shrink-0" /> Payment Summary
                                  </p>
                                  <div className="flex justify-between py-1 text-text-secondary">
                                    <span>Payment Method:</span>
                                    <span className="font-medium text-charcoal uppercase">
                                      {order.paymentMethod || 'Cash on Delivery'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between py-1 text-text-secondary">
                                    <span>Payment Status:</span>
                                    <span className="font-semibold text-forest">
                                      {order.paymentStatus || 'Paid'}
                                    </span>
                                  </div>
                                </div>

                                <div className="pt-2 mt-2 border-t border-cloud/60 flex justify-between items-center">
                                  <span className="font-semibold text-charcoal">Grand Total:</span>
                                  <span className="text-sm sm:text-base font-bold text-primary">
                                    {formatCurrency(order.totalAmount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton component during profile and order loading
function ProfileSkeleton() {
  return (
    <div className="bg-background min-h-screen py-8 md:py-12 animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
        {/* Banner Skeleton */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cloud">
          <div className="space-y-3">
            <div className="w-48 h-6 bg-cloud rounded-md" />
            <div className="w-64 h-4 bg-cloud/60 rounded-md" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-cloud">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-cream/60 rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Order Cards Skeleton */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cloud space-y-6">
          <div className="w-36 h-6 bg-cloud rounded-md" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-cream/40 rounded-2xl border border-cloud" />
          ))}
        </div>
      </div>
    </div>
  );
}
