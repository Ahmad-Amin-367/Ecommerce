'use client';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, isLoading, emptyMessage = 'No products found.' }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-[360px] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="col-span-full text-center py-16 text-text-muted text-lg">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
