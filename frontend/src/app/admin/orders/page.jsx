export const metadata = { title: 'Manage Orders | Admin' };
export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal mb-6">
        Manage Orders
      </h1>
      {/* Wire up getAllOrders hook, status update mutations + orders table */}
      <p className="text-warm-gray">Orders management table goes here.</p>
    </div>
  );
}
