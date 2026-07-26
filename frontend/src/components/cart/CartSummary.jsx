'use client';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatCurrency';
import Button from '@/components/ui/Button';

export default function CartSummary({ subtotal = 0, shippingFee = 0 }) {
  const total = subtotal + shippingFee;
  const freeShippingThreshold = 2000;
  const remaining = freeShippingThreshold - subtotal;

  return (
    <div className="bg-white border border-cloud rounded-2xl p-8 sticky top-[120px] shadow-soft">
      <h2 className="font-serif text-lg font-bold text-charcoal mb-6">Order Summary</h2>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between text-sm text-warm-gray">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-warm-gray">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
        </div>
        {remaining > 0 && (
          <p className="text-xs text-accent text-center px-3 py-2 bg-accent/10 rounded-lg">
            🎁 Add {formatCurrency(remaining)} more for free shipping!
          </p>
        )}
        <div className="flex justify-between text-base font-bold text-charcoal pt-4 border-t border-cloud">
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
