'use client';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import useCart from '@/hooks/useCart';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import clsx from 'clsx';
import { useEffect } from 'react';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateItem, removeItem, isLoading } = useCart();
  const localCartItems = useCartStore(s => s.items);
  const localSubtotal = useCartStore(s => s.subtotal);

  // Use server cart if available, fallback to local
  const items = cart?.items || localCartItems;
  const subtotal = cart?.subtotal || localSubtotal;

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 z-[100] bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={clsx(
          "fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between">
            <h2 className="font-serif text-2xl font-bold text-charcoal">
              Shopping Cart
            </h2>
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                className="relative -m-2 p-2 text-text-muted hover:text-charcoal transition-colors cursor-pointer"
                onClick={onClose}
              >
                <span className="sr-only">Close panel</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flow-root">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                  <ShoppingBag size={48} className="text-cloud mb-4" />
                  <h3 className="font-serif text-lg text-charcoal font-medium">Your cart is empty</h3>
                  <p className="text-text-secondary mt-1 mb-6">Looks like you haven't added anything yet.</p>
                  <Button variant="primary" onClick={onClose}>Start Shopping</Button>
                </div>
              ) : (
                <ul role="list" className="-my-6 divide-y divide-cloud">
                  {items.map((item) => (
                    <li key={item.product.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-cloud bg-cream">
                        <Image
                          src={item.product.images?.[0] || 'https://via.placeholder.com/150'}
                          alt={item.product.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-charcoal">
                            <h3 className="line-clamp-2 pr-4 leading-snug">
                              <Link href={`/products/${item.product.slug}`} onClick={onClose}>
                                {item.product.name}
                              </Link>
                            </h3>
                            <p className="ml-4 whitespace-nowrap">{formatCurrency(item.product.price)}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm mt-4">
                          <div className="flex items-center border border-cloud rounded-lg">
                            <button 
                              onClick={() => updateItem({ productId: item.product.id, quantity: item.quantity - 1 })}
                              disabled={item.quantity <= 1 || isLoading}
                              className="p-1 text-text-muted hover:text-charcoal hover:bg-cloud transition-colors rounded-l-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-medium text-charcoal">{item.quantity}</span>
                            <button 
                              onClick={() => updateItem({ productId: item.product.id, quantity: item.quantity + 1 })}
                              disabled={isLoading}
                              className="p-1 text-text-muted hover:text-charcoal hover:bg-cloud transition-colors rounded-r-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            className="font-medium text-error hover:text-error/80 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <div className="border-t border-cloud px-4 py-6 sm:px-6 bg-background">
            <div className="flex justify-between text-base font-bold text-charcoal">
              <p>Subtotal</p>
              <p>{formatCurrency(subtotal)}</p>
            </div>
            <p className="mt-1 text-sm text-text-secondary">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <Link href="/checkout" onClick={onClose}>
                <Button variant="primary" className="w-full text-lg h-14">
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
