export const metadata = { title: 'Admin Dashboard' };

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>
        Dashboard
      </h1>
      {/* Wire up stats cards, recent orders table, etc. */}
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Admin dashboard — wire up stats and recent orders here.
      </p>
    </div>
  );
}
