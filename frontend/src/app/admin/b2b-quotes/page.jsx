'use client';

import { useState, useEffect } from 'react';
import b2bService from '@/services/b2bService';
import {
  Briefcase,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Building,
  Mail,
  Phone,
  Users,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'REVIEWED', 'QUOTED', 'APPROVED', 'FULFILLED', 'REJECTED'];

const statusBadgeStyles = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
  REVIEWED: 'bg-blue-100 text-blue-800 border-blue-300',
  QUOTED: 'bg-purple-100 text-purple-800 border-purple-300',
  APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  FULFILLED: 'bg-green-100 text-green-800 border-green-300',
  REJECTED: 'bg-red-100 text-red-800 border-red-300',
};

export default function AdminB2BQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  // Modal State
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [editEstimatedAmount, setEditEstimatedAmount] = useState('');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await b2bService.getQuotes({
        status: statusFilter,
        search,
        page,
        limit: 15,
      });
      const data = res.data || res;
      setQuotes(data.quotes || []);
      setPagination(data.pagination || { totalPages: 1, total: 0 });
    } catch (err) {
      console.error('Error fetching B2B quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuotes();
  };

  const openDetailModal = (quote) => {
    setSelectedQuote(quote);
    setEditStatus(quote.status);
    setEditAdminNotes(quote.adminNotes || '');
    setEditEstimatedAmount(quote.estimatedAmount ? String(quote.estimatedAmount) : '');
    setModalOpen(true);
  };

  const handleUpdateQuote = async () => {
    if (!selectedQuote) return;
    setUpdating(true);
    try {
      const updated = await b2bService.updateQuote(selectedQuote.id, {
        status: editStatus,
        adminNotes: editAdminNotes,
        estimatedAmount: editEstimatedAmount ? Number(editEstimatedAmount) : null,
      });
      const quoteData = updated.data || updated;

      // Update local array
      setQuotes((prev) => prev.map((q) => (q.id === quoteData.id ? quoteData : q)));
      setModalOpen(false);
    } catch (err) {
      alert('Failed to update quote status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteQuote = async (id) => {
    if (!confirm('Are you sure you want to delete this B2B quote request?')) return;
    try {
      await b2bService.deleteQuote(id);
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (selectedQuote?.id === id) setModalOpen(false);
    } catch (err) {
      alert('Failed to delete quote');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-cloud shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-glow flex items-center justify-center text-primary">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-charcoal">B2B & Corporate Quote Requests</h1>
            <p className="text-xs text-warm-gray">Manage corporate client inquiries, quote estimations, and event statuses</p>
          </div>
        </div>

        <button
          onClick={fetchQuotes}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cloud text-xs font-semibold text-charcoal hover:bg-background-hover transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-cloud shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background text-warm-gray hover:bg-background-hover hover:text-charcoal'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search company, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-cloud text-xs font-medium text-charcoal focus:outline-none focus:border-primary transition-colors"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" />
        </form>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl border border-cloud shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-warm-gray flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-sm font-medium">Loading B2B quotes...</p>
          </div>
        ) : quotes.length === 0 ? (
          <div className="p-12 text-center text-warm-gray space-y-2">
            <Briefcase size={40} className="mx-auto text-cloud-dark" />
            <p className="text-base font-semibold text-charcoal">No B2B Quotes Found</p>
            <p className="text-xs">There are no corporate inquiries matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background border-b border-cloud text-[11px] font-bold uppercase tracking-wider text-warm-gray">
                  <th className="py-3.5 px-4">Ref & Company</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Service & Event</th>
                  <th className="py-3.5 px-4">Headcount / Budget</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cloud text-xs">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-background-hover/60 transition-colors">
                    {/* Ref & Company */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal">{quote.companyName}</div>
                      <div className="text-[10px] text-primary font-mono font-semibold">{quote.quoteNumber}</div>
                      <div className="text-[10px] text-warm-gray">{new Date(quote.createdAt).toLocaleDateString()}</div>
                    </td>

                    {/* Contact Details */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-charcoal">{quote.contactName}</div>
                      <div className="text-warm-gray">{quote.email}</div>
                      <div className="text-[11px] text-warm-gray">{quote.phone}</div>
                    </td>

                    {/* Service & Event */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-primary">{quote.serviceType}</div>
                      <div className="text-warm-gray">{quote.eventType}</div>
                      {quote.eventDate && (
                        <div className="text-[10px] text-amber-700 font-medium">
                          📅 {new Date(quote.eventDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    {/* Headcount / Budget */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-charcoal">{quote.guestCount}</div>
                      <div className="text-primary font-medium">{quote.budgetRange || 'Flexible'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                          statusBadgeStyles[quote.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openDetailModal(quote)}
                        className="p-1.5 rounded-lg bg-cloud/50 hover:bg-primary hover:text-white text-charcoal transition-colors cursor-pointer"
                        title="View / Edit Quote"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                        title="Delete Quote"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Update Modal */}
      {modalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-cloud shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-primary text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blush">
                  {selectedQuote.quoteNumber}
                </span>
                <h3 className="font-serif text-lg font-bold">{selectedQuote.companyName}</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-charcoal">
              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-background p-4 rounded-2xl border border-cloud">
                <div>
                  <span className="text-[10px] font-bold uppercase text-warm-gray">Contact Name:</span>
                  <p className="font-bold text-sm text-charcoal">{selectedQuote.contactName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-warm-gray">Email:</span>
                  <p className="font-semibold text-primary">{selectedQuote.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-warm-gray">Phone:</span>
                  <p className="font-semibold text-charcoal">{selectedQuote.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-warm-gray">Target Event Date:</span>
                  <p className="font-semibold text-amber-700">
                    {selectedQuote.eventDate ? new Date(selectedQuote.eventDate).toLocaleDateString() : 'Not Specified'}
                  </p>
                </div>
              </div>

              {/* Requirement Details */}
              <div className="space-y-2 bg-white p-4 rounded-2xl border border-cloud">
                <div className="flex justify-between border-b border-cloud pb-2">
                  <span className="font-bold text-warm-gray">Primary Service:</span>
                  <span className="font-bold text-primary text-sm">{selectedQuote.serviceType}</span>
                </div>
                <div className="flex justify-between border-b border-cloud pb-2">
                  <span className="font-bold text-warm-gray">Occasion:</span>
                  <span>{selectedQuote.eventType}</span>
                </div>
                <div className="flex justify-between border-b border-cloud pb-2">
                  <span className="font-bold text-warm-gray">Guest Count / Headcount:</span>
                  <span>{selectedQuote.guestCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-warm-gray">Client Budget Range:</span>
                  <span className="font-bold text-primary">{selectedQuote.budgetRange || 'Flexible'}</span>
                </div>
              </div>

              {/* Client Special Requirements / Notes */}
              {selectedQuote.notes && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <span className="text-[10px] font-bold uppercase text-amber-800">Client Requirements / Notes:</span>
                  <p className="text-xs text-amber-950 mt-1 whitespace-pre-line">{selectedQuote.notes}</p>
                </div>
              )}

              {/* Admin Update Controls */}
              <div className="pt-4 border-t border-cloud space-y-4">
                <h4 className="font-bold uppercase tracking-wider text-xs text-charcoal">Update Quote Status</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-warm-gray mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-cloud text-xs font-semibold bg-white focus:outline-none focus:border-primary"
                    >
                      {STATUS_OPTIONS.filter((s) => s !== 'ALL').map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-warm-gray mb-1">Quoted Amount (CAD $)</label>
                    <input
                      type="number"
                      placeholder="e.g. 850"
                      value={editEstimatedAmount}
                      onChange={(e) => setEditEstimatedAmount(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-cloud text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-warm-gray mb-1">Admin Internal Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Enter internal notes, follow-up logs, or discount agreements..."
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-cloud text-xs focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-background border-t border-cloud flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-cloud text-xs font-bold text-warm-gray hover:bg-background-hover transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateQuote}
                disabled={updating}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors cursor-pointer flex items-center gap-2"
              >
                {updating ? <Loader2 size={14} className="animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
