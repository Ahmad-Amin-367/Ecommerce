export const metadata = { title: 'Checkout' };
export default function CheckoutPage() {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>
        Checkout
      </h1>
      {/* Wire up CheckoutForm and OrderSummary components, usePlaceOrder hook */}
      <p style={{ color: 'var(--color-text-secondary)' }}>Checkout form appears here.</p>
    </div>
  );
}
