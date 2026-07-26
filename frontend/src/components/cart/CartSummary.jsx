'use client';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatCurrency';
import Button from '@/components/ui/Button';

export default function CartSummary({ subtotal = 0, shippingFee = 0 }) {
  const total = subtotal + shippingFee;
  const freeShippingThreshold = 500;
  const remaining = freeShippingThreshold - subtotal;

  return (
    <div className="bg-gradient-card border border-border rounded-2xl p-8 sticky top-[100px]">
      <h2 className="text-lg font-bold mb-6">Order Summary</h2>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between text-sm text-text-secondary">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-text-secondary">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
        </div>
        {remaining > 0 && (
          <p className="text-xs text-success text-center px-2 py-1.5 bg-success/10 rounded-sm">
            Add {formatCurrency(remaining)} more for free shipping!
          </p>
        )}
        <div className="flex justify-between text-base font-bold text-text-primary pt-4 border-t border-border">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <Link href="/checkout">
        <Button fullWidth size="lg">Proceed to Checkout</Button>
      </Link>
      <Link href="/products" className="block mt-2">
        <Button fullWidth variant="ghost" size="md">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}
