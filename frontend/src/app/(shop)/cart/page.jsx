export const metadata = { title: 'Shopping Cart' };
export default function CartPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-charcoal mb-8">
        Your Cart
      </h1>
      {/* Wire up useCart hook, CartItem and CartSummary components */}
      <p className="text-warm-gray">Cart items appear here.</p>
    </div>
  );
}
