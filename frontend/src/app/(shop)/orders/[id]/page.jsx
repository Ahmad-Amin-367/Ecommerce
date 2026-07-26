export const metadata = { title: 'Order Detail' };
export default function OrderDetailPage({ params }) {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-serif text-2xl font-semibold text-charcoal mb-6">
        Order Detail
      </h1>
      {/* Wire up useOrder(params.id) hook */}
      <p className="text-warm-gray">Order ID: <strong className="text-charcoal">{params.id}</strong></p>
    </div>
  );
}
