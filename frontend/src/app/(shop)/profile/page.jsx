'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatCurrency';
import { Package, MapPin, Settings, User } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data.data);
      } catch (error) {
        toast.error('Failed to load order history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; // Prevent flash before redirect

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'PROCESSING': return 'text-blue-600 bg-blue-100';
      case 'SHIPPED': return 'text-purple-600 bg-purple-100';
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <h1 className="font-serif text-4xl font-bold text-charcoal mb-8">My Account</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-28 border border-cloud">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-cloud">
                <div className="w-14 h-14 bg-primary-glow rounded-full flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="font-semibold text-charcoal">{user?.name}</h2>
                  <p className="text-sm text-text-muted">{user?.email}</p>
                </div>
              </div>

              <nav className="flex flex-col gap-2">
                <a href="#orders" className="flex items-center gap-3 px-4 py-3 bg-primary-glow text-primary rounded-xl font-medium transition-colors">
                  <Package size={20} />
                  Order History
                </a>
                <a href="#settings" className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-cream hover:text-charcoal rounded-xl transition-colors">
                  <Settings size={20} />
                  Account Settings
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content (Order History) */}
          <div className="w-full lg:w-3/4" id="orders">
            <div className="bg-white rounded-2xl shadow-card border border-cloud overflow-hidden">
              <div className="p-6 md:p-8 border-b border-cloud">
                <h2 className="font-serif text-2xl font-bold text-charcoal">Order History</h2>
                <p className="text-text-secondary mt-1">Track, manage, and view your recent purchases.</p>
              </div>

              <div className="p-6 md:p-8">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-warm-gray mx-auto mb-4">
                      <Package size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-charcoal mb-2">No orders yet</h3>
                    <p className="text-text-secondary">When you place an order, it will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-cloud rounded-xl overflow-hidden hover:shadow-card transition-shadow">
                        {/* Order Header */}
                        <div className="bg-cream/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-cloud">
                          <div>
                            <p className="text-xs text-text-muted mb-1">Order Placed</p>
                            <p className="font-medium text-charcoal">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-text-muted mb-1">Total Amount</p>
                            <p className="font-medium text-charcoal">{formatCurrency(order.totalAmount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-text-muted mb-1">Order #</p>
                            <p className="font-medium text-charcoal">{order.orderNumber}</p>
                          </div>
                          <div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6">
                          {order.items.map((item, idx) => (
                            <div key={item.id} className={`flex items-center gap-6 ${idx !== order.items.length - 1 ? 'mb-6 pb-6 border-b border-cloud' : ''}`}>
                              <div className="relative w-20 h-20 bg-cream rounded-lg overflow-hidden shrink-0 border border-cloud">
                                <Image 
                                  src={item.product.images?.[0] || 'https://via.placeholder.com/150'} 
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-charcoal line-clamp-1">{item.product.name}</h4>
                                <p className="text-sm text-text-secondary mt-1">Qty: {item.quantity}</p>
                                <p className="text-sm font-medium text-primary mt-1">{formatCurrency(item.unitPrice)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
