export const metadata = { title: 'My Orders' };
export default function OrdersPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-charcoal mb-8">
        My Orders
      </h1>
      {/* Wire up useMyOrders hook */}
      <p className="text-warm-gray">Your order history appears here.</p>
    </div>
  );
}
