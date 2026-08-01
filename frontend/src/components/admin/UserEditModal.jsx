'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Phone, Calendar, ShoppingBag, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAdminUpdateUser } from '@/hooks/useUsers';

export default function UserEditModal({ isOpen, onClose, user = null }) {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState('CUSTOMER');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMutation = useAdminUpdateUser();

  useEffect(() => {
    if (user && isOpen) {
      setRole(user.role || 'CUSTOMER');
      setIsActive(user.isActive !== undefined ? user.isActive : true);
    }
  }, [user, isOpen]);

  if (!isOpen || !mounted || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync({
      userId: user.id,
      data: { role, isActive },
    });
    onClose();
  };

  const isSubmitting = updateMutation.isPending;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cloud">
          <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
            <User size={20} className="text-primary" />
            Manage User Account
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-text-muted hover:text-charcoal hover:bg-cloud/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* User Details Summary Box */}
          <div className="bg-background-secondary rounded-xl p-4 space-y-3 border border-cloud">
            <div className="flex items-center justify-between">
              <span className="font-bold text-charcoal text-base">{user.name}</span>
              <Badge variant={user.role === 'ADMIN' ? 'primary' : 'secondary'}>
                {user.role}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-warm-gray">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-text-muted shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={14} className="text-text-muted shrink-0" />
                <span>{user.phone || 'No phone number provided'}</span>
              </div>

              <div className="flex items-center gap-2">
                <ShoppingBag size={14} className="text-text-muted shrink-0" />
                <span>Total Orders: <strong className="text-charcoal">{user._count?.orders ?? 0}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-text-muted shrink-0" />
                <span>Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2 flex items-center gap-1.5">
              <Shield size={16} className="text-primary" />
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-cloud bg-white px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          {/* Account Status Switch */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Account Status
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl border border-cloud bg-white">
              <div>
                <p className="text-sm font-medium text-charcoal">
                  {isActive ? 'Account Active' : 'Account Deactivated'}
                </p>
                <p className="text-xs text-text-muted">
                  {isActive ? 'User can log in and place orders' : 'User is blocked from accessing the site'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? 'bg-success' : 'bg-cloud'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-cloud">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
