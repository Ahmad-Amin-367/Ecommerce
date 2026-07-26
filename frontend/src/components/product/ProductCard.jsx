'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { formatCurrency, getDiscountPercent } from '@/utils/formatCurrency';
import useCart from '@/hooks/useCart';
import Badge from '@/components/ui/Badge';

export default function ProductCard({ product }) {
  const { addToCart, isAdding } = useCart();
  const discount = getDiscountPercent(product.price, product.comparePrice);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({ productId: product.id, quantity: 1 });
  };

  return (
    <Link href={`/products/${product.slug || product.id}`} className="group flex flex-col bg-gradient-card border border-border rounded-2xl overflow-hidden transition-all duration-250 hover:border-primary hover:-translate-y-1 hover:shadow-glow">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-background-hover">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-400 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <ShoppingCart size={32} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <Badge variant="error">-{discount}%</Badge>
          )}
          {product.isFeatured && (
            <Badge variant="primary">Featured</Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="default">Out of Stock</Badge>
          )}
        </div>

        {/* Add to cart overlay */}
        <button
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 p-3 bg-gradient-primary text-white text-sm font-semibold font-sans translate-y-full transition-transform duration-250 group-hover:translate-y-0 disabled:bg-background-hover disabled:text-text-muted disabled:cursor-not-allowed disabled:bg-none"
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        {product.category && (
          <p className="text-xs text-primary font-semibold uppercase tracking-wider">{product.category.name}</p>
        )}
        <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">
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
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="text-lg font-bold text-text-primary">{formatCurrency(product.price)}</span>
          {discount > 0 && (
            <span className="text-sm text-text-muted line-through">{formatCurrency(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
