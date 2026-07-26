'use client';
import { Trash2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatCurrency';
import useCart from '@/hooks/useCart';

export default function CartItem({ item }) {
  const { removeItem, updateItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-background-hover shrink-0">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-background-hover" />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <Link href={`/products/${product.slug || product.id}`} className="text-sm font-semibold text-text-primary leading-snug transition-colors duration-150 hover:text-primary-light">
          {product.name}
        </Link>
        <p className="text-sm text-text-secondary">{formatCurrency(product.price)}</p>

        <div className="flex items-center gap-2 mt-auto">
          <button
            className="w-7 h-7 rounded-sm border border-border flex items-center justify-center text-text-secondary bg-background-secondary transition-colors duration-150 hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => updateItem({ productId: product.id, quantity: quantity - 1 })}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-[24px] text-center text-sm font-semibold">{quantity}</span>
          <button
            className="w-7 h-7 rounded-sm border border-border flex items-center justify-center text-text-secondary bg-background-secondary transition-colors duration-150 hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => updateItem({ productId: product.id, quantity: quantity + 1 })}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className="text-base font-bold text-text-primary">{formatCurrency(Number(product.price) * quantity)}</p>
        <button
          className="text-text-muted transition-colors duration-150 flex items-center hover:text-error"
          onClick={() => removeItem(product.id)}
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
