'use client';
import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { formatCurrency, getDiscountPercent } from '@/utils/formatCurrency';
import useCart from '@/hooks/useCart';
import Badge from '@/components/ui/Badge';
import { useAnimationStore } from '@/store/animationStore';

const ProductCard = memo(function ProductCard({ product, priority = false }) {
  const { addToCart, addingProductId } = useCart();
  const isThisItemAdding = addingProductId === product.id;
  const discount = getDiscountPercent(product.price, product.comparePrice);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isThisItemAdding) return;
    const rect = e.currentTarget.getBoundingClientRect();
    useAnimationStore.getState().addFlyingItem(product, rect);
    addToCart({ productId: product.id, quantity: 1, product });
  };

  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className="group flex flex-col bg-white border border-cloud rounded-sm overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-sm"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream/40">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cloud">
            <ShoppingCart size={32} />
          </div>
        )}

        {/* Badges */}
        {product.isFeatured && (
          <div className="absolute top-0 left-0 bg-[#e31837] text-white text-[10px] font-bold px-2 py-0.5 z-20 whitespace-nowrap">
            Featured
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">

          {(product.isBestseller || product._count?.reviews > 5) && (
            <Badge variant="bestseller">⭐ Bestseller</Badge>
          )}
        </div>

        {/* Add to cart overlay */}
        <button
          type="button"
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5 p-2.5 bg-primary text-white text-xs font-semibold font-sans translate-y-full transition-all duration-300 group-hover:translate-y-0 hover:bg-primary-dark disabled:bg-cloud disabled:text-warm-gray disabled:cursor-not-allowed cursor-pointer"
          onClick={handleAddToCart}
          disabled={isThisItemAdding}
          aria-label={`Add ${product.name} to cart`}
        >
          {isThisItemAdding ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-2 sm:p-5 flex flex-col flex-1">
        {product.category && (
          <p className="text-[11px] text-primary font-semibold uppercase tracking-[0.05em] mb-1">
            {product.category.name}
          </p>
        )}
        <h3 className="font-sans text-[15px] sm:text-[16px] font-bold text-charcoal leading-snug line-clamp-1 mb-4">
          {product.name}
        </h3>

        <div className="flex items-baseline justify-between gap-x-2 mt-auto pt-1">
          {/* Price */}
          <div className="flex items-baseline gap-2 leading-none">
            <span className="text-[14px] sm:text-[15px] font-bold text-charcoal">{formatCurrency(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-[11px] text-text-muted line-through">{formatCurrency(product.comparePrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

export default ProductCard;
