export const metadata = { title: 'My Orders' };
export default function OrdersPage() {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>
        My Orders
      </h1>
      {/* Wire up useMyOrders hook */}
      <p style={{ color: 'var(--color-text-secondary)' }}>Your order history appears here.</p>
    </div>
  );
}
