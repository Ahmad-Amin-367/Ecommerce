'use client';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Search, Gift } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';

const announcements = [
  '🎁 Free gift wrapping on orders above Rs.2,000',
  '✨ Customized edible arrangements available — order yours today',
  '🚚 Nationwide delivery across Pakistan',
  '💝 Personalize every gift — make it truly special',
];

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-sticky">
      {/* ─── Announcement Bar ─────────────────────────────────────────── */}
      <div className="bg-primary text-text-inverse overflow-hidden">
        <div className="marquee-track py-2">
          {[...announcements, ...announcements].map((msg, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-3 px-8 text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap"
            >
              <span>{msg}</span>
              <span className="text-primary-light" aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── Main Navigation ──────────────────────────────────────────── */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-cloud">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-[68px] gap-6">
          {/* Mobile menu toggle */}
          <button
            className="flex lg:hidden w-10 h-10 items-center justify-center rounded-lg text-charcoal hover:bg-background-hover hover:text-primary transition-colors duration-200"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-controls="mobile-nav-menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center gap-2 shrink-0 group"
            onClick={closeMobileMenu}
          >
            <Gift size={22} className="text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal">
              Hisna <span className="text-primary">Gifts</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center justify-center flex-1 gap-1">
            {[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/products' },
              { label: 'Birthday', href: '/products?category=birthday' },
              { label: 'Anniversary', href: '/products?category=anniversary' },
              { label: 'Eid Special', href: '/products?category=eid-special' },
              { label: 'Custom Gifts', href: '/products?category=custom' },
            ].map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  className="px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-warm-gray rounded-lg transition-all duration-200 hover:text-primary hover:bg-primary-glow"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg text-warm-gray transition-colors duration-200 hover:bg-background-hover hover:text-primary"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-warm-gray transition-colors duration-200 hover:bg-background-hover hover:text-primary"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <Link
                href={user?.role === 'ADMIN' ? '/admin' : '/profile'}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-warm-gray transition-colors duration-200 hover:bg-background-hover hover:text-primary"
                aria-label="Profile"
              >
                <User size={20} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-primary-dark hover:shadow-glow hover:-translate-y-[1px]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Mobile Menu ──────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden border-t border-cloud bg-white animate-fade-in shadow-lifted"
        >
          <ul className="flex flex-col py-2">
            {[
              { label: 'Home', href: '/' },
              { label: 'Shop All', href: '/products' },
              { label: 'Birthday Gifts', href: '/products?category=birthday' },
              { label: 'Anniversary', href: '/products?category=anniversary' },
              { label: 'Eid Special', href: '/products?category=eid-special' },
              { label: 'Custom Gifts', href: '/products?category=custom' },
              { label: 'Corporate Gifts', href: '/products?category=corporate' },
              { label: 'Thank You Gifts', href: '/products?category=thank-you' },
            ].map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  className="block px-6 py-3.5 text-sm font-medium text-warm-gray hover:bg-background-hover hover:text-primary transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-cloud mt-2 pt-2">
              <Link
                href="/cart"
                className="block px-6 py-3.5 text-sm font-medium text-warm-gray hover:bg-background-hover hover:text-primary transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Cart {itemCount > 0 && `(${itemCount})`}
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
                <Link
                  href="/profile"
                  className="block px-6 py-3.5 text-sm font-medium text-warm-gray hover:bg-background-hover hover:text-primary transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  My Account
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="block px-6 py-3.5 text-sm font-medium text-warm-gray hover:bg-background-hover hover:text-primary transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="block px-6 py-3.5 text-sm font-medium text-warm-gray hover:bg-background-hover hover:text-primary transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Create Account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
