'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cloud shrink-0">
          <div className="flex items-center gap-3">
            {isDestructive && (
              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                <AlertTriangle size={20} />
              </div>
            )}
            <h2 className="font-serif text-xl font-semibold text-charcoal">{title}</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-charcoal transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-charcoal text-sm leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-cloud flex justify-end gap-3 shrink-0 bg-background-secondary rounded-b-2xl">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm} 
            isLoading={isLoading} 
            className={isDestructive ? 'bg-error hover:bg-error/90 text-white border-error shadow-error/20' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
