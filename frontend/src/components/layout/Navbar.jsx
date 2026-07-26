'use client';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-sticky bg-background/85 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-6 flex items-center justify-between h-[72px] gap-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold tracking-tight shrink-0" onClick={closeMobileMenu}>
          <span className="gradient-text">Shop</span>Zone
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-4">
          <li>
            <Link href="/products" className="text-sm font-medium text-text-secondary px-2 py-1 rounded-sm transition-colors duration-150 hover:text-text-primary">
              Products
            </Link>
          </li>
          <li>
            <Link href="/products?isFeatured=true" className="text-sm font-medium text-text-secondary px-2 py-1 rounded-sm transition-colors duration-150 hover:text-text-primary">
              Featured
            </Link>
          </li>
          <li>
            <Link href="/categories" className="text-sm font-medium text-text-secondary px-2 py-1 rounded-sm transition-colors duration-150 hover:text-text-primary">
              Categories
            </Link>
          </li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 rounded-md text-text-secondary transition-all duration-150 hover:bg-background-hover hover:text-text-primary" aria-label="Cart">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <Link href={user?.role === 'ADMIN' ? '/admin' : '/profile'} className="relative flex items-center justify-center w-10 h-10 rounded-md text-text-secondary transition-all duration-150 hover:bg-background-hover hover:text-text-primary" aria-label="Profile">
              <User size={20} />
            </Link>
          ) : (
            <Link href="/login" className="hidden md:block px-5 py-2 bg-gradient-primary text-white rounded-full text-sm font-semibold transition-all duration-150 hover:opacity-90 hover:-translate-y-[1px]">
              Sign In
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="flex md:hidden w-10 h-10 items-center justify-center rounded-md text-text-secondary hover:bg-background-hover hover:text-text-primary"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border py-4 bg-background-secondary animate-fade-in">
          <ul className="flex flex-col gap-[2px]">
            <li>
              <Link href="/products" className="block px-6 py-4 text-base font-medium text-text-secondary hover:bg-background-hover hover:text-text-primary transition-all duration-150" onClick={closeMobileMenu}>
                Products
              </Link>
            </li>
            <li>
              <Link href="/products?isFeatured=true" className="block px-6 py-4 text-base font-medium text-text-secondary hover:bg-background-hover hover:text-text-primary transition-all duration-150" onClick={closeMobileMenu}>
                Featured
              </Link>
            </li>
            <li>
              <Link href="/cart" className="block px-6 py-4 text-base font-medium text-text-secondary hover:bg-background-hover hover:text-text-primary transition-all duration-150" onClick={closeMobileMenu}>
                Cart {itemCount > 0 && `(${itemCount})`}
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
                <Link href="/profile" className="block px-6 py-4 text-base font-medium text-text-secondary hover:bg-background-hover hover:text-text-primary transition-all duration-150" onClick={closeMobileMenu}>
                  My Account
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/login" className="block px-6 py-4 text-base font-medium text-text-secondary hover:bg-background-hover hover:text-text-primary transition-all duration-150" onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="block px-6 py-4 text-base font-medium text-text-secondary hover:bg-background-hover hover:text-text-primary transition-all duration-150" onClick={closeMobileMenu}>
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
