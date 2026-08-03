'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import useAuth from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Clock,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Users,
  Star,
  CheckCircle2,
  Truck,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  DollarSign,
  Store
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ordersRes, productsRes] = await Promise.allSettled([
        api.get('/orders'),
        api.get('/products'),
      ]);

      if (ordersRes.status === 'fulfilled') {
        const orderData = Array.isArray(ordersRes.value.data?.data)
          ? ordersRes.value.data.data
          : [];
        setOrders(orderData);
      }

      if (productsRes.status === 'fulfilled') {
        const productData = Array.isArray(productsRes.value.data?.data)
          ? productsRes.value.data.data
          : [];
        setProducts(productData);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      setError('Failed to fetch dashboard analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute metrics
  const stats = useMemo(() => {
    const totalOrdersCount = orders.length;

    const totalRevenue = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    const pendingOrdersCount = orders.filter((o) =>
      ['PENDING', 'PROCESSING'].includes(o.status)
    ).length;

    const deliveredOrdersCount = orders.filter((o) => o.status === 'DELIVERED').length;

    const totalProductsCount = products.length;
    const lowStockProductsCount = products.filter((p) => Number(p.stock || 0) < 5).length;

    return {
      totalRevenue,
      totalOrdersCount,
      pendingOrdersCount,
      deliveredOrdersCount,
      totalProductsCount,
      lowStockProductsCount,
    };
  }, [orders, products]);

  // Format today's date
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'SHIPPED':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Executive Welcome */}
      <div className="bg-gradient-card rounded-3xl p-6 lg:p-8 border border-border shadow-card relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-glow rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <span>{todayFormatted}</span>
            </div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-charcoal">
              Welcome back, {user?.name || 'Admin'}
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Here is what is happening with your store today.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all duration-200 shadow-soft hover:shadow-lifted cursor-pointer transform hover:-translate-y-0.5"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-charcoal rounded-xl text-sm font-medium hover:bg-cream/60 transition-all duration-200 cursor-pointer shadow-soft hover:shadow-lifted"
            >
              <Store size={15} className="text-primary" />
              <span>Visit Front Store</span>
            </Link>

            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-white border border-border text-text-secondary hover:text-charcoal rounded-xl transition-all duration-200 cursor-pointer hover:bg-cream/60 shadow-soft"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-soft hover:shadow-lifted transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-charcoal mt-3">
            {formatCurrency(stats.totalRevenue)}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-emerald-600 font-medium">
            <TrendingUp size={14} />
            <span>Valid Store Sales</span>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-soft hover:shadow-lifted transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-primary-glow text-primary flex items-center justify-center border border-primary/20">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-charcoal mt-3">
            {stats.totalOrdersCount}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary font-medium">
            <span className="text-forest font-semibold">{stats.deliveredOrdersCount} Completed</span>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-soft hover:shadow-lifted transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Needs Action</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-amber-600 mt-3">
            {stats.pendingOrdersCount}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-amber-700 font-medium">
            <span>Pending or Processing</span>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-soft hover:shadow-lifted transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Product Catalog</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Package size={20} />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-charcoal mt-3">
            {stats.totalProductsCount}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary font-medium">
            {stats.lowStockProductsCount > 0 ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle size={13} /> {stats.lowStockProductsCount} Low Stock
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} /> All Stock Healthy
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="font-serif text-lg font-bold text-charcoal mb-4">Quick Management</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/products"
            className="bg-white p-5 rounded-2xl border border-border shadow-soft hover:shadow-card hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-charcoal group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Package size={20} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-charcoal text-sm">Products</p>
                <p className="text-xs text-text-secondary mt-0.5">Manage inventory</p>
              </div>
              <ChevronRight size={18} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white p-5 rounded-2xl border border-border shadow-soft hover:shadow-card hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-charcoal group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <ShoppingBag size={20} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-charcoal text-sm">Orders</p>
                <p className="text-xs text-text-secondary mt-0.5">Fulfill purchases</p>
              </div>
              <ChevronRight size={18} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </Link>

          <Link
            href="/admin/testimonials"
            className="bg-white p-5 rounded-2xl border border-border shadow-soft hover:shadow-card hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-charcoal group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Star size={20} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-charcoal text-sm">Reviews</p>
                <p className="text-xs text-text-secondary mt-0.5">Customer feedback</p>
              </div>
              <ChevronRight size={18} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white p-5 rounded-2xl border border-border shadow-soft hover:shadow-card hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-charcoal group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Users size={20} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-charcoal text-sm">Users</p>
                <p className="text-xs text-text-secondary mt-0.5">Accounts & roles</p>
              </div>
              <ChevronRight size={18} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Split Grid: Recent Orders & Fulfillment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Columns): Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-border shadow-card p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">Recent Orders</h3>
              <p className="text-xs text-text-secondary mt-0.5">Latest customer transactions</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-cream/40 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-10 text-text-muted text-sm">
              No orders recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-cloud text-[11px] uppercase tracking-wider text-text-muted">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cloud/60 text-xs sm:text-sm">
                  {recentOrders.map((order) => {
                    const customerName =
                      order.user?.name || order.guestName || order.address?.fullName || 'Customer';
                    return (
                      <tr key={order.id} className="hover:bg-cream/20 transition-colors">
                        <td className="py-3.5 px-3 font-semibold font-mono text-charcoal">
                          {order.orderNumber || order.id?.substring(0, 8)}
                        </td>
                        <td className="py-3.5 px-3 font-medium text-charcoal truncate max-w-[140px]">
                          {customerName}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-primary">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Link
                            href="/admin/orders"
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right (1 Column): Fulfillment Distribution & Store Summary */}
        <div className="bg-white rounded-3xl border border-border shadow-card p-6 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal mb-1">Store Performance</h3>
            <p className="text-xs text-text-secondary mb-6">Fulfillment breakdown across orders</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-charcoal mb-1.5">
                  <span>Delivered Orders</span>
                  <span>
                    {orders.length > 0
                      ? Math.round((stats.deliveredOrdersCount / orders.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-cream rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-forest h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        orders.length > 0
                          ? (stats.deliveredOrdersCount / orders.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-charcoal mb-1.5">
                  <span>Pending / Processing</span>
                  <span>
                    {orders.length > 0
                      ? Math.round((stats.pendingOrdersCount / orders.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-cream rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        orders.length > 0
                          ? (stats.pendingOrdersCount / orders.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cream/40 p-4 rounded-2xl border border-cloud/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">System Operational</p>
                <p className="text-[11px] text-text-secondary">All services running smoothly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
