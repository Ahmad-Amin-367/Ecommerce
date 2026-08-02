'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Eye, Filter, CheckCircle, Package, Truck, XCircle, X, User, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleOpenDetails = async (orderId) => {
    setIsDetailModalOpen(true);
    setIsLoadingDetail(true);
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setSelectedOrder(data.data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.guestName || order.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modalContent = isDetailModalOpen && mounted ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl sm:max-w-3xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border border-cloud">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-cloud bg-cream/40 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-charcoal">
                Order {selectedOrder?.orderNumber || 'Details'}
              </h2>
              {selectedOrder?.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              )}
            </div>
            {selectedOrder?.createdAt && (
              <p className="text-xs text-text-muted mt-1">
                Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-PK', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            )}
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-xl text-text-muted hover:text-charcoal hover:bg-cloud/60 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoadingDetail || !selectedOrder ? (
            <div className="py-12 text-center text-warm-gray space-y-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-medium">Loading order details...</p>
            </div>
          ) : (
            <>
              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Box */}
                <div className="bg-cream/30 p-4 rounded-2xl border border-cloud/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                    <User size={14} />
                    <span>Customer Information</span>
                  </div>
                  <p className="text-sm font-semibold text-charcoal">
                    {selectedOrder.guestName || selectedOrder.user?.name || selectedOrder.address?.fullName || 'N/A'}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {selectedOrder.guestEmail || selectedOrder.user?.email || 'No email provided'}
                  </p>
                  {(selectedOrder.guestPhone || selectedOrder.address?.phone) && (
                    <p className="text-xs text-text-secondary">
                      Phone: {selectedOrder.guestPhone || selectedOrder.address?.phone}
                    </p>
                  )}
                </div>

                {/* Delivery Address Box */}
                <div className="bg-cream/30 p-4 rounded-2xl border border-cloud/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                    <MapPin size={14} />
                    <span>Delivery Address</span>
                  </div>
                  {selectedOrder.address ? (
                    <div className="text-xs text-text-secondary space-y-0.5">
                      <p className="font-semibold text-charcoal">{selectedOrder.address.fullName}</p>
                      <p>{selectedOrder.address.streetAddress}</p>
                      <p>
                        {selectedOrder.address.city}, {selectedOrder.address.state || ''} {selectedOrder.address.postalCode || ''}
                      </p>
                      <p className="font-medium text-charcoal">{selectedOrder.address.country}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">No specific delivery address recorded.</p>
                  )}
                </div>
              </div>

              {/* Payment & Order Status Control Box */}
              <div className="bg-cream/30 p-4 rounded-2xl border border-cloud/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                    Payment Details
                  </span>
                  <p className="text-xs font-semibold text-charcoal">
                    Method: <span className="text-primary font-bold">{selectedOrder.paymentMethod || 'COD'}</span>
                  </p>
                  <p className="text-xs text-text-secondary">
                    Status: <span className="font-semibold text-forest">{selectedOrder.paymentStatus || 'PENDING'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-charcoal whitespace-nowrap">Update Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      handleStatusChange(selectedOrder.id, e.target.value);
                      setSelectedOrder({ ...selectedOrder, status: e.target.value });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer ${getStatusColor(selectedOrder.status)}`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                  Order Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="border border-cloud rounded-2xl overflow-hidden divide-y divide-cloud">
                  {selectedOrder.items?.map((item) => {
                    const unitPrice = Number(item.unitPrice ?? item.price ?? item.product?.price ?? 0);
                    const itemTotal = Number(item.totalPrice ?? (unitPrice * item.quantity));
                    return (
                      <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-cream/20 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-cloud shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-cloud/50 flex items-center justify-center text-text-muted text-xs font-bold shrink-0">
                              HG
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-charcoal truncate">
                              {item.product?.name || 'Product Item'}
                            </p>
                            <p className="text-xs text-text-muted">
                              Qty: {item.quantity} × {formatCurrency(unitPrice)}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-bold text-primary shrink-0">
                          {formatCurrency(itemTotal)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-cream/40 p-4 rounded-2xl border border-cloud/60 space-y-2 text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal">
                    {formatCurrency(selectedOrder.subtotal || selectedOrder.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-charcoal">
                    {Number(selectedOrder.shippingFee || 0) > 0
                      ? formatCurrency(selectedOrder.shippingFee)
                      : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-cloud/80">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-cloud bg-cream/20 flex justify-end shrink-0">
          <Button onClick={handleCloseModal} variant="outline" className="px-6 rounded-xl">
            Close
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 lg:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal">Orders</h1>
            <p className="text-text-secondary mt-1">Manage and track customer orders</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2 bg-white">
              <Filter size={18} />
              Filter
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-primary' },
            { label: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, icon: CheckCircle, color: 'text-yellow-600' },
            { label: 'Shipped', value: orders.filter(o => o.status === 'SHIPPED').length, icon: Truck, color: 'text-purple-600' },
            { label: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, icon: CheckCircle, color: 'text-green-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-card border border-cloud flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-cloud/50 flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-warm-gray">{stat.label}</p>
                <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-t-2xl border border-cloud border-b-0 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
            <input 
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-cream border border-cloud rounded-xl outline-none text-charcoal text-sm focus:border-primary focus:ring-2 focus:ring-primary-glow transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-cloud rounded-b-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-cream/50 text-warm-gray font-medium border-b border-cloud">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cloud text-charcoal">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-warm-gray">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-warm-gray">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary">
                        #{order.orderNumber.split('-')[1] || order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-charcoal">{order.guestName || order.user?.name || 'Guest User'}</div>
                        <div className="text-xs text-text-muted">{order.guestEmail || order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border outline-none cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenDetails(order.id)}
                          className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary-glow/10 inline-flex cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Render Modal via Portal on document.body */}
      {modalContent && createPortal(modalContent, document.body)}
    </div>
  );
}
