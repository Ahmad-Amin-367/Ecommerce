export const metadata = { title: 'Cart' };
export default function CartPage() {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>
        Your Cart
      </h1>
      {/* Wire up useCart hook, CartItem and CartSummary components */}
      <p style={{ color: 'var(--color-text-secondary)' }}>Cart items appear here.</p>
    </div>
  );
}
