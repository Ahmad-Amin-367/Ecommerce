export const metadata = {
  title: 'Products',
  description: 'Browse our full collection of premium products.',
};

export default function ProductsPage() {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>
        All Products
      </h1>
      {/* ProductGrid and ProductFilters components go here */}
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Products listing — wire up ProductGrid and ProductFilters components here.
      </p>
    </div>
  );
}
