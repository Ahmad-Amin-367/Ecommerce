import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata = { title: 'Admin Panel' };

export default function AdminRootLayout({ children }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
