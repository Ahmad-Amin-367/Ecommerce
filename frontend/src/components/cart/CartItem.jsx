'use client';
import { Trash2, Minus, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatCurrency';
import useCart from '@/hooks/useCart';
import clsx from 'clsx';

export default function CartItem({ item }) {
  const { removeItem, updateItem, isItemUpdating, isItemRemoving, isItemBusy } = useCart();
  const { product, quantity } = item;
  const productId = product?.id || item.productId || item.id;

  const isBusy = isItemBusy(productId);
  const isDecreasing = isItemUpdating(productId, 'decrease');
  const isIncreasing = isItemUpdating(productId, 'increase');
  const isRemoving = isItemRemoving(productId);

  return (
    <div className={clsx(
      "flex gap-4 py-5 border-b border-cloud transition-opacity duration-200",
      isRemoving && "opacity-50 pointer-events-none"
    )}>
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream/40 shrink-0">
        {product?.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name || 'Product'} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="w-full h-full bg-cream/40" />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <Link href={`/products/${product?.slug || productId}`} className="font-serif text-sm font-semibold text-charcoal leading-snug transition-colors duration-200 hover:text-primary">
          {product?.name}
        </Link>
        <p className="text-sm text-warm-gray">{formatCurrency(product?.price || 0)}</p>

        <div className="flex items-center gap-2 mt-auto">
          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-cloud flex items-center justify-center text-warm-gray bg-white transition-all duration-200 hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            onClick={() => updateItem({ productId, quantity: quantity - 1 })}
            disabled={quantity <= 1 || isBusy}
            aria-label="Decrease quantity"
          >
            {isDecreasing ? (
              <Loader2 size={13} className="animate-spin text-primary" />
            ) : (
              <Minus size={14} />
            )}
          </button>
          <span className="min-w-[24px] text-center text-sm font-semibold text-charcoal">{quantity}</span>
          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-cloud flex items-center justify-center text-warm-gray bg-white transition-all duration-200 hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            onClick={() => updateItem({ productId, quantity: quantity + 1 })}
            disabled={isBusy}
            aria-label="Increase quantity"
          >
            {isIncreasing ? (
              <Loader2 size={13} className="animate-spin text-primary" />
            ) : (
              <Plus size={14} />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className="text-base font-bold text-charcoal">{formatCurrency(Number(product?.price || 0) * quantity)}</p>
        <button
          type="button"
          className="text-text-muted transition-colors duration-200 flex items-center hover:text-error disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer p-1"
          onClick={() => removeItem(productId)}
          disabled={isBusy}
          aria-label="Remove item"
        >
          {isRemoving ? (
            <Loader2 size={16} className="animate-spin text-error" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
