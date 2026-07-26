'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[220px] lg:w-[260px] shrink-0 bg-background-secondary border-r border-border flex flex-col fixed top-0 left-0 bottom-0 z-sticky">
        <div className="p-6 lg:p-8 border-b border-border">
          <Link href="/" className="text-xl font-extrabold tracking-tight block mb-1">
            <span className="gradient-text">Shop</span>Zone
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-4 px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-primary-glow text-primary-light border border-primary/20"
                    : "text-text-secondary hover:bg-background-hover hover:text-text-primary"
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 lg:p-8 border-t border-border">
          <p className="text-sm font-semibold text-text-primary mb-[2px]">{user?.name}</p>
          <p className="text-xs text-text-muted mb-4 overflow-hidden text-ellipsis whitespace-nowrap">{user?.email}</p>
          <button
            className="flex items-center gap-2 text-sm font-medium text-error py-2 px-4 rounded-md w-full transition-colors duration-150 hover:bg-error/10"
            onClick={logout}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-[220px] lg:ml-[260px] min-h-screen bg-background">
        <main className="p-12 max-w-7xl animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
