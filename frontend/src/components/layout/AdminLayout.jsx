'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
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
  PanelLeftOpen,
  User,
  ExternalLink,
  Globe,
  ChevronDown,
  Briefcase
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/b2b-quotes', label: 'B2B Quotes', icon: Briefcase },
  { href: '/admin/testimonials', label: 'Reviews', icon: Star },
  { href: '/admin/users', label: 'Users', icon: Users },
];


export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Click outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          {/* Full Logo (Links to /admin) */}
          <Link href="/admin" className={clsx("flex items-center gap-2 group cursor-pointer", isDesktopCollapsed && "lg:hidden")}>
            <Gift size={22} className="text-primary transition-transform duration-300 group-hover:rotate-12 shrink-0" />
            <div className="flex flex-col overflow-hidden transition-all duration-300 w-auto opacity-100">
              <span className="font-serif text-xl font-bold tracking-tight text-charcoal leading-tight whitespace-nowrap">
                Hisna <span className="text-primary">Gifts</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary whitespace-nowrap">Admin Panel</span>
            </div>
          </Link>

          {/* Mini Logo (HG) - Links to /admin */}
          {isDesktopCollapsed && (
            <Link href="/admin" className="hidden lg:flex flex-col items-center justify-center group cursor-pointer" title="Hisna Gifts Admin">
              <div className="w-10 h-10 rounded-xl bg-primary-glow border border-primary/20 flex items-center justify-center text-primary font-serif font-bold text-xl transition-transform duration-300 group-hover:scale-110 shadow-sm">
                HG
              </div>
            </Link>
          )}

          {/* Mobile Close Button */}
          <button
            className="lg:hidden p-1 text-text-muted hover:text-charcoal hover:bg-cloud/50 rounded transition-colors cursor-pointer"
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
                  "flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-primary-glow text-primary border border-primary/20 shadow-soft"
                    : "text-text-secondary hover:bg-background-hover hover:text-text-primary hover:translate-x-0.5",
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
              "flex items-center gap-2 text-sm font-medium text-error py-2.5 rounded-xl transition-all duration-200 hover:bg-error/10 cursor-pointer active:scale-95",
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
        <header className="flex items-center justify-between p-4 lg:px-8 border-b border-border bg-background-secondary sticky top-0 z-30 h-[88px] transition-colors duration-300">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:bg-cloud/60 rounded-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Toggle mobile menu"
            >
              <Menu size={22} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              className="hidden lg:flex p-2 text-charcoal hover:bg-cloud/60 rounded-xl transition-all duration-200 items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
              title={isDesktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label="Toggle sidebar collapse"
            >
              {isDesktopCollapsed ? <PanelLeftOpen size={22} /> : <PanelLeftClose size={22} />}
            </button>

            <span className="font-serif text-lg lg:text-xl font-bold text-charcoal lg:ml-2 tracking-tight">Admin Dashboard</span>
          </div>

          {/* Top Right Profile & Website Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-charcoal hover:bg-cloud/60 transition-all duration-200 cursor-pointer border border-border/80 shadow-soft"
              aria-label="Admin Profile Menu"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-glow text-primary font-bold flex items-center justify-center text-sm border border-primary/20 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-charcoal leading-tight truncate max-w-[120px]">
                  {user?.name || 'Admin'}
                </span>
                <span className="text-[10px] text-text-muted">Administrator</span>
              </div>
              <ChevronDown
                size={14}
                className={`text-text-muted transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-cloud rounded-2xl shadow-card py-2 animate-fade-in z-50">
                <div className="px-4 py-3 border-b border-cloud mb-1">
                  <p className="text-xs font-semibold text-charcoal truncate">{user?.name}</p>
                  <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-primary-glow text-primary text-[10px] font-semibold rounded-full uppercase tracking-wider">
                    Admin Account
                  </span>
                </div>

                <Link
                  href="/"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-charcoal hover:bg-cream hover:text-primary transition-colors"
                >
                  <Globe size={15} className="text-primary shrink-0" />
                  <span>Go to Website</span>
                  <ExternalLink size={12} className="ml-auto text-text-muted" />
                </Link>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-error hover:bg-error/10 transition-colors border-t border-cloud mt-1 pt-2 cursor-pointer"
                >
                  <LogOut size={15} className="shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-6 lg:p-12 w-full animate-fade-in overflow-x-hidden">
          {mounted ? children : <div className="animate-pulse w-full h-full bg-cloud/20 rounded-2xl min-h-[400px]"></div>}
        </main>
      </div>
    </div>
  );
}
