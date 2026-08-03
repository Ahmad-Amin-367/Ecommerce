'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, CreditCard, User, Tag, Clock } from 'lucide-react';
import { useOrder } from '@/hooks/useOrders';
import Spinner from './Spinner';

// Helper formatting functions
const formatCurrency = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-700';
    case 'CONFIRMED': return 'bg-blue-100 text-blue-700';
    case 'PROCESSING': return 'bg-orange-100 text-orange-700';
    case 'SHIPPED': return 'bg-purple-100 text-purple-700';
    case 'DELIVERED': return 'bg-green-100 text-green-700';
    case 'CANCELLED': return 'bg-red-100 text-red-700';
    case 'REFUNDED': return 'bg-gray-200 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getPaymentColor = (status) => {
  switch (status) {
    case 'PAID': return 'bg-green-100 text-green-700';
    case 'UNPAID': return 'bg-yellow-100 text-yellow-700';
    case 'FAILED': return 'bg-red-100 text-red-700';
    case 'REFUNDED': return 'bg-gray-200 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function OrderDetailsModal({ isOpen, onClose, orderId }) {
  const { data: order, isLoading, isError } = useOrder(isOpen ? orderId : null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-cloud flex justify-between items-start bg-background sticky top-0 z-10">
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal">
                Order Details
              </h2>
              {orderId && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-2 text-sm text-text-secondary">
                  <span className="font-medium text-charcoal">#{order?.orderNumber || 'Loading...'}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{order ? new Date(order.createdAt).toLocaleString() : ''}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-charcoal hover:bg-cloud/50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 bg-background-secondary">
            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center text-text-muted gap-4">
                <Spinner size="lg" />
                <p>Loading order data...</p>
              </div>
            ) : isError || !order ? (
              <div className="h-64 flex items-center justify-center text-red-500">
                Failed to load order details.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Items & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Order Items */}
                  <div className="bg-white rounded-xl border border-cloud p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Package size={16} className="text-primary" />
                      Order Items ({order.items?.length || 0})
                    </h3>
                    
                    <div className="space-y-4">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-3 rounded-lg border border-cloud/50 bg-cream items-center sm:items-stretch text-center sm:text-left">
                          <div className="w-20 h-20 sm:w-16 sm:h-16 bg-white rounded-md border border-cloud overflow-hidden shrink-0 flex items-center justify-center">
                            {item.product?.images?.[0] ? (
                              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={24} className="text-cloud" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center w-full">
                            <h4 className="font-medium text-charcoal truncate">{item.product?.name || 'Unknown Product'}</h4>
                            <div className="text-xs text-text-secondary mt-1">
                              Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                            </div>
                          </div>
                          <div className="sm:text-right flex flex-col justify-center w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-cloud/50">
                            <span className="font-semibold text-charcoal">{formatCurrency(item.totalPrice)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Notes */}
                  {order.notes && (
                    <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-5 shadow-sm">
                      <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Tag size={16} />
                        Customer Notes
                      </h3>
                      <p className="text-sm text-yellow-700">{order.notes}</p>
                    </div>
                  )}

                </div>

                {/* Right Column: Customer & Financials */}
                <div className="space-y-6">
                  
                  {/* Status & Summary */}
                  <div className="bg-white rounded-xl border border-cloud p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CreditCard size={16} className="text-primary" />
                      Summary
                    </h3>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-text-secondary">Order Status</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-sm text-text-secondary">Payment</span>
                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase block w-max ml-auto ${getPaymentColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] text-text-muted mt-1 uppercase block">{order.paymentMethod.replace(/_/g, ' ')}</span>
                      </div>
                    </div>

                    <div className="border-t border-cloud pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Subtotal</span>
                        <span className="text-charcoal font-medium">{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Shipping</span>
                        <span className="text-charcoal font-medium">{formatCurrency(order.shippingFee)}</span>
                      </div>
                      {Number(order.discount) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Discount</span>
                          <span className="text-red-500 font-medium">-{formatCurrency(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t border-cloud mt-2 pt-3">
                        <span className="text-charcoal">Total</span>
                        <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-white rounded-xl border border-cloud p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      Customer
                    </h3>
                    <div className="text-sm space-y-1 mb-4">
                      <p className="font-medium text-charcoal">{order.user?.name || order.guestName}</p>
                      <p className="text-text-secondary">{order.user?.email || order.guestEmail}</p>
                      {(order.user?.phone || order.guestPhone) && (
                        <p className="text-text-secondary">{order.user?.phone || order.guestPhone}</p>
                      )}
                      {!order.user && (
                        <span className="inline-block mt-1 bg-warm-gray/10 text-warm-gray text-[10px] px-2 py-0.5 rounded-sm">GUEST ORDER</span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3 flex items-center gap-2 border-t border-cloud pt-4">
                      <MapPin size={16} className="text-primary" />
                      Shipping Address
                    </h3>
                    {order.address ? (
                      <div className="text-sm text-text-secondary leading-relaxed">
                        <p>{order.address.street}</p>
                        <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                        <p>{order.address.country}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-text-muted italic">No shipping address provided.</p>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
