export const metadata = { title: 'Manage Products | Admin' };
export default function AdminProductsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>
        Manage Products
      </h1>
      {/* Wire up useProducts, useCreateProduct, useDeleteProduct hooks + data table */}
      <p style={{ color: 'var(--color-text-secondary)' }}>Products management table goes here.</p>
    </div>
  );
}
