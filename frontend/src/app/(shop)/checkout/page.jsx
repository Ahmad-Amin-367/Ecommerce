export const metadata = { title: 'Checkout' };
export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-charcoal mb-8">
        Checkout
      </h1>
      {/* Wire up CheckoutForm and OrderSummary components, usePlaceOrder hook */}
      <p className="text-warm-gray">Checkout form appears here.</p>
    </div>
  );
}
