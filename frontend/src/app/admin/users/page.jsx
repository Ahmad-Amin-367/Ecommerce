'use client';
import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Search, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import ReactPaginate from 'react-paginate';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data: usersData, isLoading } = useUsers({
    page,
    limit: 10,
    role: 'CUSTOMER', // Exclude ADMIN accounts completely
    ...(search && { search }),
    ...(statusFilter !== '' && { isActive: statusFilter === 'true' }),
  });

  const users = usersData?.data || [];
  const meta = usersData?.meta || { totalCount: 0, totalPages: 1 };
  const totalUsers = meta.totalCount ?? meta.total ?? users.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-semibold text-charcoal">
              User Accounts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-glow text-primary border border-primary/20">
              {isLoading ? '...' : `${totalUsers} Total`}
            </span>
          </div>
          <p className="text-sm text-warm-gray mt-1">
            View customer accounts and their details.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-cloud rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-cloud bg-background pl-10 pr-4 py-2 text-sm text-charcoal focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-cloud bg-background px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="true">Active Accounts</option>
            <option value="false">Deactivated</option>
          </select>
        </div>
      </div>


      {/* Users Table */}
      <div className="bg-white border border-cloud rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background-secondary text-warm-gray font-semibold border-b border-cloud">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cloud">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-warm-gray">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-warm-gray">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-background-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-charcoal">{user.name}</span>
                          <span className="text-xs text-text-muted">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-warm-gray font-sans">
                      {user.phone || '—'}
                    </td>

                    <td className="px-6 py-4">
                      {user.role === 'ADMIN' ? (
                        <Badge variant="primary" className="gap-1">
                          <Shield size={12} /> Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Customer</Badge>
                      )}
                    </td>

                    <td className="px-6 py-4 font-medium text-charcoal">
                      {user._count?.orders ?? 0}
                    </td>

                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="error">Deactivated</Badge>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-cloud flex flex-col sm:flex-row items-center justify-between gap-4 bg-background-secondary rounded-b-2xl">
          <div className="text-sm text-text-muted font-medium">
            Showing {totalUsers === 0 ? 0 : (page - 1) * 10 + 1} to {Math.min(page * 10, totalUsers)} of {totalUsers} users
          </div>

          <ReactPaginate
            previousLabel={<ChevronLeft size={16} />}
            nextLabel={<ChevronRight size={16} />}
            breakLabel="..."
            breakClassName="w-8 h-8 flex items-center justify-center text-text-muted"
            pageCount={meta.totalPages}
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
