import AdminLayout from '@/components/layout/AdminLayout';

export const metadata = { title: 'Admin Panel' };

export default function AdminRootLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
