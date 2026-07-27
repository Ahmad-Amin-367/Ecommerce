'use client';
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function FeaturedProductsInner() {
  const { data: productsData, isLoading, isError } = useProducts({ 
    isFeatured: true, 
    limit: 4 
  });
  
  const products = productsData?.data || [];

  if (isError) {
    return (
      <div className="text-center py-8 text-error">
        <p>Failed to load featured products. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)
        }
      </div>

      <div className="sm:hidden text-center mt-8">
        <Link
          href="/products?isFeatured=true"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-200"
        >
          View All Gifts <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}

export default function FeaturedProducts() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    );
  }

  return <FeaturedProductsInner />;
}
