'use client';
import { useState, useEffect } from 'react';
import { Search, Eye, Filter, CheckCircle, Package, Truck, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatCurrency } from '@/utils/formatCurrency';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
                        #{order.orderNumber.split('-')[1]}
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

      </div>
    </div>
  );
}
