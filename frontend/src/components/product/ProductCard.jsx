'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { formatCurrency, getDiscountPercent } from '@/utils/formatCurrency';
import useCart from '@/hooks/useCart';
import Badge from '@/components/ui/Badge';
import { useAnimationStore } from '@/store/animationStore';

export default function ProductCard({ product }) {
  const { addToCart, isAdding } = useCart();
  const discount = getDiscountPercent(product.price, product.comparePrice);

  const handleAddToCart = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    useAnimationStore.getState().addFlyingItem(product, rect);
    addToCart({ productId: product.id, quantity: 1, product });
  };

  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className="group flex flex-col bg-white border border-cloud rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream/40">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
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
          {product.stock === 0 && (
            <Badge variant="default">Sold Out</Badge>
          )}
          {(product.isBestseller || product._count?.reviews > 5) && (
            <Badge variant="bestseller">⭐ Bestseller</Badge>
          )}
        </div>

        {/* Add to cart overlay */}
        <button
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5 p-2.5 bg-primary text-white text-xs font-semibold font-sans translate-y-full transition-all duration-300 group-hover:translate-y-0 hover:bg-primary-dark disabled:bg-cloud disabled:text-warm-gray disabled:cursor-not-allowed cursor-pointer"
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        {product.category && (
          <p className="text-[10px] text-accent font-semibold uppercase tracking-[0.1em]">
            {product.category.name}
          </p>
        )}
        <h3 className="font-serif text-[13px] font-semibold text-charcoal leading-tight line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        {product._count?.reviews > 0 && (
          <div className="flex items-center gap-1 text-xs text-warning">
            <Star size={12} fill="currentColor" />
            <span>{product._count.reviews} reviews</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-1.5 mt-auto pt-1.5">
          <span className="text-sm font-bold text-charcoal">{formatCurrency(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-[11px] text-text-muted line-through">{formatCurrency(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
