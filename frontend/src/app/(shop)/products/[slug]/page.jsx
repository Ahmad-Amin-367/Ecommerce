'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useProduct } from '@/hooks/useProducts';
import useCart from '@/hooks/useCart';
import { ChevronRight, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useProduct(slug);
  const { addToCart, isAdding } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="animate-pulse flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 aspect-square bg-cloud rounded-2xl" />
          <div className="w-full md:w-1/2 flex flex-col gap-6 pt-4">
            <div className="h-10 bg-cloud rounded-md w-3/4" />
            <div className="h-6 bg-cloud rounded-md w-1/4" />
            <div className="h-24 bg-cloud rounded-md w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-charcoal mb-4">Product Not Found</h1>
        <p className="text-text-secondary mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link href="/">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  // Fallback image if product has no images
  const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/800x800?text=No+Image'];

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(q => q + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddToCart = () => {
    addToCart({ productId: product.id, quantity });
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-16 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight size={14} />
        <span className="text-charcoal font-medium truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left: Images */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cloud border border-border">
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-6">
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-charcoal leading-tight mb-3">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex text-primary">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-text-secondary">({product._count?.reviews || 0} Reviews)</span>
            </div>

            <div className="flex items-end gap-3">
              <span className="font-serif text-3xl font-bold text-primary">Rs. {Number(product.price).toLocaleString()}</span>
              {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                <span className="text-lg text-text-muted line-through mb-1">
                  Rs. {Number(product.comparePrice).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="prose prose-sm text-text-secondary mb-8">
            <p>{product.description || 'No description available for this product.'}</p>
          </div>

          {/* Action Area */}
          <div className="border-t border-border pt-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-medium text-charcoal">Quantity</span>
              {product.stock > 0 ? (
                <span className="text-sm text-success bg-success/10 px-3 py-1 rounded-full">In Stock ({product.stock})</span>
              ) : (
                <span className="text-sm text-error bg-error/10 px-3 py-1 rounded-full">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center bg-background border border-border rounded-xl p-1 h-12">
                <button 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-full flex items-center justify-center text-text-secondary hover:text-charcoal hover:bg-cloud rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium text-charcoal">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="w-10 h-full flex items-center justify-center text-text-secondary hover:text-charcoal hover:bg-cloud rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button 
                variant="primary" 
                className="flex-1 h-12 text-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                isLoading={isAdding}
              >
                <ShoppingCart size={20} className="mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              <button className="h-12 w-12 flex shrink-0 items-center justify-center border border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary/50 transition-colors">
                <Heart size={24} />
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-border flex flex-col gap-3 text-sm text-text-secondary">
            <div className="flex">
              <span className="w-32 font-medium text-charcoal">Category:</span>
              <span>{product.category?.name || 'Uncategorized'}</span>
            </div>
            {product.sku && (
              <div className="flex">
                <span className="w-32 font-medium text-charcoal">SKU:</span>
                <span>{product.sku}</span>
              </div>
            )}
            {product.tags?.length > 0 && (
              <div className="flex">
                <span className="w-32 font-medium text-charcoal">Tags:</span>
                <span>{product.tags.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
