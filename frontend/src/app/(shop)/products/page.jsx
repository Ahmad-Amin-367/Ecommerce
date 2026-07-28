'use client';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { Gift } from 'lucide-react';
import { Suspense, useState, useEffect } from 'react';

function ProductsContent() {
  const searchParams = useSearchParams();
  
  const search = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');
  
  const { data, isLoading } = useProducts({
    ...(search && { search }),
    ...(categoryParam && { category: categoryParam }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder })
  });

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* ─── Generic Header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-cloud pt-20 pb-12 mb-8 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-glow text-primary mb-4">
            <Gift size={24} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
            Our Collection
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal mb-4">
            {search ? `Search Results for "${search}"` : 'All Gifts'}
          </h1>
          <p className="text-warm-gray max-w-xl mx-auto">
            {search 
              ? 'Find exactly what you are looking for among our premium selection.'
              : 'Browse our full collection of handpicked gifts for every occasion. Curated with love and delivered fresh.'}
          </p>
        </div>
      </div>

      {/* ─── Main Content Grid (Filters + Products) ─────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-text-secondary">
            {isLoading ? 'Loading products...' : `Showing ${data?.data?.length || 0} products`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Filters */}
          <ProductFilters activeCategoryName={search ? `Search: ${search}` : categoryParam ? `Category: ${categoryParam}` : ''} />

          {/* Product Grid */}
          <div>
            <ProductGrid 
              products={data?.data} 
              isLoading={isLoading} 
              emptyMessage={search ? `No products found for "${search}".` : "No products available at the moment."} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center pb-20">
        <p className="text-text-secondary">Loading products...</p>
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className="bg-background min-h-screen flex items-center justify-center pb-20">
          <p className="text-text-secondary">Loading products...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
