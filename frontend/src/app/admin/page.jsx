export const metadata = { title: 'Admin Dashboard' };

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal mb-6">
        Dashboard
      </h1>
      {/* Wire up stats cards, recent orders table, etc. */}
      <p className="text-warm-gray">
        Admin dashboard — wire up stats and recent orders here.
      </p>
    </div>
  );
}
