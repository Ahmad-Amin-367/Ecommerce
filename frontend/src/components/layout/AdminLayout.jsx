'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  ChevronRight,
  LogOut,
  Gift,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/testimonials', label: 'Reviews', icon: Star },
  { href: '/admin/users', label: 'Users', icon: Users },
];


export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Close mobile sidebar on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed top-0 left-0 bottom-0 z-50 bg-background-secondary border-r border-border flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isDesktopCollapsed ? "w-[260px] lg:w-[80px]" : "w-[260px]"
        )}
      >
        <div className={clsx("p-6 border-b border-border flex items-center shrink-0 h-[88px]", isDesktopCollapsed ? "justify-center lg:px-4" : "justify-between")}>
          {/* Full Logo (Hidden when collapsed on desktop) */}
          <Link href="/" className={clsx("flex items-center gap-2 group", isDesktopCollapsed && "lg:hidden")}>
            <Gift size={22} className="text-primary transition-transform duration-300 group-hover:rotate-12 shrink-0" />
            <div className="flex flex-col overflow-hidden transition-all duration-300 w-auto opacity-100">
              <span className="font-serif text-xl font-bold tracking-tight text-charcoal leading-tight whitespace-nowrap">
                Hisna <span className="text-primary">Gifts</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary whitespace-nowrap">Admin Panel</span>
            </div>
          </Link>
          
          {/* Mini Logo (HG) - Only visible when collapsed on desktop */}
          {isDesktopCollapsed && (
            <Link href="/" className="hidden lg:flex flex-col items-center justify-center group" title="Hisna Gifts">
              <div className="w-10 h-10 rounded-xl bg-primary-glow border border-primary/20 flex items-center justify-center text-primary font-serif font-bold text-xl transition-transform duration-300 group-hover:scale-110 shadow-sm">
                HG
              </div>
            </Link>
          )}

          {/* Mobile Close Button */}
          <button 
            className="lg:hidden p-1 text-text-muted hover:text-charcoal hover:bg-cloud/50 rounded transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                title={isDesktopCollapsed ? label : undefined}
                className={clsx(
                  "flex items-center gap-4 px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-primary-glow text-primary border border-primary/20"
                    : "text-text-secondary hover:bg-background-hover hover:text-text-primary",
                  isDesktopCollapsed && "lg:justify-center lg:px-0"
                )}
              >
                <Icon size={18} className="shrink-0" />
                <span className={clsx("whitespace-nowrap transition-all duration-300", isDesktopCollapsed ? "lg:hidden" : "block")}>
                  {label}
                </span>
                {isActive && !isDesktopCollapsed && <ChevronRight size={16} className="ml-auto shrink-0 lg:block hidden" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border shrink-0 flex flex-col gap-4">
          <div className={clsx("transition-all duration-300 overflow-hidden", isDesktopCollapsed ? "lg:h-0 lg:opacity-0" : "h-auto opacity-100")}>
            <p className="text-sm font-semibold text-text-primary mb-[2px] truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
          
          <button
            className={clsx(
              "flex items-center gap-2 text-sm font-medium text-error py-2 rounded-md transition-colors duration-200 hover:bg-error/10",
              isDesktopCollapsed ? "lg:justify-center px-0" : "px-4 w-full"
            )}
            onClick={logout}
            title={isDesktopCollapsed ? "Sign Out" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={clsx("whitespace-nowrap", isDesktopCollapsed ? "lg:hidden" : "block")}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div 
        className={clsx(
          "flex-1 min-h-screen flex flex-col w-full min-w-0 transition-all duration-300 ease-in-out",
          isDesktopCollapsed ? "lg:ml-[80px]" : "lg:ml-[260px]"
        )}
      >
        {/* Navbar / Header */}
        <header className="flex items-center justify-between p-4 lg:px-8 border-b border-cloud bg-white sticky top-0 z-30 h-[88px]">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:bg-cloud/50 rounded-md transition-colors"
            >
              <Menu size={24} />
            </button>
            
            {/* Desktop Sidebar Toggle */}
            <button 
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              className="hidden lg:flex p-2 text-charcoal hover:bg-cloud/50 rounded-md transition-colors items-center justify-center"
              title={isDesktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isDesktopCollapsed ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />}
            </button>

            <span className="font-serif text-lg lg:text-xl font-bold text-charcoal lg:ml-2">Admin Dashboard</span>
          </div>
        </header>

        <main className="p-6 lg:p-12 w-full max-w-[100vw] lg:max-w-7xl animate-fade-in overflow-x-hidden">
          {mounted ? children : <div className="animate-pulse w-full h-full bg-cloud/20 rounded-2xl min-h-[400px]"></div>}
        </main>
      </div>
    </div>
  );
}
