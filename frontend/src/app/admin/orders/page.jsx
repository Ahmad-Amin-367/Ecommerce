export const metadata = { title: 'Manage Orders | Admin' };
export default function AdminOrdersPage() {
  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>
        Manage Orders
      </h1>
      {/* Wire up getAllOrders hook, status update mutations + orders table */}
      <p style={{ color: 'var(--color-text-secondary)' }}>Orders management table goes here.</p>
    </div>
  );
}
