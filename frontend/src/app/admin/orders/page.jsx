'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Filter, CheckCircle, Package, Truck, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import ReactPaginate from 'react-paginate';
import DateRangePickerButton from '@/components/ui/DateRangePickerButton';
import OrderDetailsModal from '@/components/ui/OrderDetailsModal';

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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
    setPage(1);
  }, [status, paymentStatus, paymentMethod, dateRange]);

  const { data, isLoading, refetch } = useAdminOrders({
    page,
    limit,
    search: debouncedSearch,
    status,
    paymentStatus,
    paymentMethod,
    startDate: dateRange.from,
    endDate: dateRange.to
  });

  const orders = data?.data || [];
  const meta = data?.meta || { totalCount: 0, totalPages: 0 };
  const totalCount = meta.totalCount || 0;
  const totalPages = meta.totalPages || 0;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      refetch();
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

  return (
    <div className="flex-1 overflow-y-auto bg-background animate-fade-in">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal">Orders</h1>
            <p className="text-text-secondary mt-1">Manage and track customer orders</p>
          </div>
        </div>

        {/* Toolbar (Search & Basic Filters) */}
        <div className={`relative z-30 bg-white p-4 ${showAdvancedFilters ? 'rounded-t-2xl' : 'rounded-t-2xl'} border border-cloud border-b-0 flex flex-col lg:flex-row gap-4 justify-between items-center`}>
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
            <input
              type="text"
              placeholder="Search by Order ID, Name, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-cream border border-cloud rounded-xl outline-none text-charcoal text-sm focus:border-primary focus:ring-2 focus:ring-primary-glow transition-all"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-cream border border-cloud rounded-xl outline-none text-charcoal text-sm focus:border-primary transition-colors cursor-pointer min-w-[140px]"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {(() => {
              const activeFiltersCount = (paymentStatus ? 1 : 0) + (paymentMethod ? 1 : 0) + (dateRange.from ? 1 : 0);
              return (
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 transition-colors ${showAdvancedFilters || activeFiltersCount > 0 ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-primary' : 'bg-white'}`}
                >
                  <Filter size={18} />
                  Filter
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              );
            })()}
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: filterOverflow }}
              onAnimationStart={() => setFilterOverflow('hidden')}
              onAnimationComplete={() => { if (showAdvancedFilters) setFilterOverflow('visible'); }}
              className="relative z-20"
            >
              <div className="p-4 border-l border-r border-cloud bg-background-secondary flex flex-wrap gap-4 items-center border-t">

                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <span className="text-xs font-medium text-text-muted px-1">Payment Status</span>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-cloud rounded-lg text-sm bg-white focus:outline-none focus:border-primary text-charcoal"
                  >
                    <option value="">Any Payment Status</option>
                    <option value="PAID">Paid</option>
                    <option value="UNPAID">Unpaid</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <span className="text-xs font-medium text-text-muted px-1">Payment Method</span>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-cloud rounded-lg text-sm bg-white focus:outline-none focus:border-primary text-charcoal"
                  >
                    <option value="">Any Payment Method</option>
                    <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <span className="text-xs font-medium text-text-muted px-1">Date Range</span>
                  <DateRangePickerButton
                    dateRange={dateRange}
                    onApply={setDateRange}
                    align="center"
                  />
                </div>

                {(paymentStatus || paymentMethod || dateRange.from) && (
                  <button
                    onClick={() => {
                      setPaymentStatus('');
                      setPaymentMethod('');
                      setDateRange({ from: '', to: '' });
                    }}
                    className="text-sm text-primary hover:text-primary-dark font-medium px-2 cursor-pointer mt-5"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="bg-white border border-cloud border-b-0 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-cream/50 text-warm-gray font-medium border-b border-t border-cloud">
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
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-warm-gray">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
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
                      <td className="px-6 py-4 font-medium flex flex-col">
                        <span>{formatCurrency(order.totalAmount)}</span>
                        {order.paymentStatus === 'PAID' ? (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded w-max mt-1">PAID</span>
                        ) : (
                          <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded w-max mt-1">{order.paymentStatus}</span>
                        )}
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
                        <button className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary-glow/10 inline-flex" title="View Details">
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

        {/* Table Footer with Pagination */}
        <div className="p-4 border border-cloud border-t-0 flex flex-col sm:flex-row items-center justify-between gap-4 bg-background-secondary rounded-b-2xl shadow-card">
          <div className="text-sm text-text-muted font-medium">
            Showing {totalCount === 0 ? 0 : (page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} records
          </div>

          <ReactPaginate
            previousLabel={<ChevronLeft size={16} />}
            nextLabel={<ChevronRight size={16} />}
            breakLabel="..."
            breakClassName="w-8 h-8 flex items-center justify-center text-text-muted"
            pageCount={totalPages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            forcePage={page > 0 ? page - 1 : 0}
            onPageChange={({ selected }) => setPage(selected + 1)}
            containerClassName="flex items-center gap-1.5"
            activeClassName="!bg-primary !text-white !border-primary hover:!bg-primary-dark"
            pageClassName="w-8 h-8 flex items-center justify-center border border-cloud rounded text-sm text-charcoal hover:bg-cloud transition-colors cursor-pointer bg-white"
            previousClassName="w-8 h-8 flex items-center justify-center border border-cloud rounded text-sm text-charcoal hover:bg-cloud transition-colors cursor-pointer bg-white"
            nextClassName="w-8 h-8 flex items-center justify-center border border-cloud rounded text-sm text-charcoal hover:bg-cloud transition-colors cursor-pointer bg-white"
            disabledClassName="!opacity-30 !cursor-not-allowed hover:!bg-white"
            disabledLinkClassName="!cursor-not-allowed"
            pageLinkClassName="w-full h-full flex items-center justify-center"
            previousLinkClassName="w-full h-full flex items-center justify-center"
            nextLinkClassName="w-full h-full flex items-center justify-center"
          />
        </div>

      </div>
    </div>
  );
}
