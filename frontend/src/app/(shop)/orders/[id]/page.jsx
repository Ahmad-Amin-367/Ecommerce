export const metadata = { title: 'Order Detail' };
export default function OrderDetailPage({ params }) {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-lg)' }}>
        Order Detail
      </h1>
      {/* Wire up useOrder(params.id) hook */}
      <p style={{ color: 'var(--color-text-secondary)' }}>Order ID: {params.id}</p>
    </div>
  );
}
