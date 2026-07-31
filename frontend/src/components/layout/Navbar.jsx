'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Search, Gift, Cake, Heart, Moon, Sparkles, Briefcase, HandHeart, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import dynamic from 'next/dynamic';
const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false });
import { useState, useRef, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';

const announcements = [
  '🎁 Free gift wrapping on orders above $100',
  '✨ Customized edible arrangements available — order yours today',
  '🚚 Nationwide delivery across Pakistan',
  '💝 Personalize every gift — make it truly special',
];

const megaMenuCategories = [
  { name: 'Birthday Gifts', slug: 'birthday', icon: Cake, color: 'text-[#E88A4D]', bg: 'bg-[#FFF0E6]' },
  { name: 'Anniversary', slug: 'anniversary', icon: Heart, color: 'text-[#D4596A]', bg: 'bg-[#FDE8EC]' },
  { name: 'Eid Special', slug: 'eid-special', icon: Moon, color: 'text-[#3D5A3E]', bg: 'bg-[#E8F0E8]' },
  { name: 'Custom Gifts', slug: 'custom', icon: Sparkles, color: 'text-[#8B5CA8]', bg: 'bg-[#F0E8F5]' },
  { name: 'Corporate', slug: 'corporate', icon: Briefcase, color: 'text-[#5A6B8C]', bg: 'bg-[#E8EDF5]' },
  { name: 'Thank You', slug: 'thank-you', icon: HandHeart, color: 'text-[#C67D5C]', bg: 'bg-[#FBF0E4]' },
];

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, isAuthChecked } = useAuthStore();
  const { logout } = useAuth();
  const { itemCount, isCartOpen, openCart, closeCart } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const shopMenuRef = useRef(null);
  const shopMenuTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchToggleButtonRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target) &&
        (!searchToggleButtonRef.current || !searchToggleButtonRef.current.contains(event.target))
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Block body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleShopMenuEnter = () => {
    if (shopMenuTimeoutRef.current) clearTimeout(shopMenuTimeoutRef.current);
    setIsShopMenuOpen(true);
  };

  const handleShopMenuLeave = () => {
    shopMenuTimeoutRef.current = setTimeout(() => {
      setIsShopMenuOpen(false);
    }, 200);
  };

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
      <nav className="relative z-50 bg-white/95 backdrop-blur-md border-b border-cloud">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-between h-[68px] gap-0 sm:gap-4">
          {/* Mobile menu toggle */}
          <button
            className="flex lg:hidden w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-lg text-charcoal hover:bg-background-hover hover:text-primary transition-colors duration-200 cursor-pointer"
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
            className="absolute left-[42%] sm:left-[45%] md:left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center gap-1.5 sm:gap-2 shrink-0 group"
            onClick={closeMobileMenu}
          >
            <Gift size={22} className="hidden sm:block text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-charcoal">
              Hisna <span className="text-primary">Gifts</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts, occasions…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-background border border-cloud text-sm text-charcoal placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-glow transition-all duration-200"
              />
            </div>
          </form>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-0.5 shrink-0">
            <li>
              <Link
                href="/"
                className="px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-warm-gray rounded-lg transition-all duration-200 hover:text-primary hover:bg-primary-glow"
              >
                Home
              </Link>
            </li>
            {/* Shop with Mega Menu */}
            <li
              className="relative"
              ref={shopMenuRef}
              onMouseEnter={handleShopMenuEnter}
              onMouseLeave={handleShopMenuLeave}
            >
              <Link
                href="/category/all"
                className="inline-flex items-center gap-1 px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-warm-gray rounded-lg transition-all duration-200 hover:text-primary hover:bg-primary-glow"
              >
                Shop
                <ChevronDown size={14} className={`transition-transform duration-200 ${isShopMenuOpen ? 'rotate-180' : ''}`} />
              </Link>

              {/* Mega Menu Dropdown */}
              {isShopMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[520px] bg-white border border-cloud rounded-2xl shadow-lifted p-6 animate-fade-in z-50">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-cloud">
                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-charcoal">Shop by Occasion</h3>
                    <Link
                      href="/category/all"
                      className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                      onClick={() => setIsShopMenuOpen(false)}
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {megaMenuCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setIsShopMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-background-hover group"
                      >
                        <div className={`w-9 h-9 rounded-lg ${cat.bg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                          <cat.icon size={18} className={cat.color} strokeWidth={1.5} />
                        </div>
                        <span className="text-sm font-medium text-charcoal group-hover:text-primary transition-colors">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                  {/* Price Filter Link */}
                  <div className="mt-4 pt-3 border-t border-cloud">
                    <Link
                      href="/category/all?maxPrice=50"
                      onClick={() => setIsShopMenuOpen(false)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      🏷️ Under $50
                    </Link>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link
                href="/category/birthday"
                className="px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-warm-gray rounded-lg transition-all duration-200 hover:text-primary hover:bg-primary-glow"
              >
                Birthday
              </Link>
            </li>
            <li>
              <Link
                href="/category/eid-special"
                className="px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-warm-gray rounded-lg transition-all duration-200 hover:text-primary hover:bg-primary-glow"
              >
                Eid Special
              </Link>
            </li>
            <li>
              <Link
                href="/category/all?maxPrice=50"
                className="px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-primary rounded-lg transition-all duration-200 hover:bg-primary-glow"
              >
                Under $50
              </Link>
            </li>
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-0 sm:gap-1 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              ref={searchToggleButtonRef}
              className="flex lg:hidden items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-warm-gray transition-colors duration-200 hover:bg-background-hover hover:text-primary cursor-pointer"
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-warm-gray transition-colors duration-200 hover:bg-background-hover hover:text-primary cursor-pointer"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {!isAuthChecked ? (
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-[90px] md:h-[40px] bg-cloud/60 rounded-lg md:rounded-full animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-warm-gray transition-colors duration-200 hover:bg-background-hover hover:text-primary cursor-pointer"
                  aria-label="Profile"
                >
                  <User size={20} className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-cloud rounded-xl shadow-card py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-cloud mb-2">
                      <p className="text-sm font-semibold text-charcoal truncate">{user?.name}</p>
                      <p className="text-xs text-text-muted truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'ADMIN' ? (
                      <Link
                        href="/admin"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-cream hover:text-primary transition-colors"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-cream hover:text-primary transition-colors"
                      >
                        Profile
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors mt-1 border-t border-cloud pt-2 cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
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

        {/* ─── Mobile Search Bar ─────────────────────────────────────────── */}
        {isSearchOpen && (
          <div ref={searchContainerRef} className="lg:hidden absolute top-full left-0 right-0 border-b border-cloud px-4 py-3 bg-white shadow-sm animate-fade-in z-40">
            <form onSubmit={handleSearch} className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts, occasions…"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-background border border-cloud text-sm text-charcoal placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-glow transition-all duration-200"
              />
            </form>
          </div>
        )}
      </nav>

      {/* ─── Mobile Menu ──────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden border-t border-cloud bg-white animate-fade-in shadow-lifted overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar"
        >
          <ul className="flex flex-col py-2">
            {[
              { label: 'Home', href: '/' },
              { label: 'Shop All', href: '/category/all' },
              { label: 'Birthday Gifts', href: '/category/birthday' },
              { label: 'Anniversary', href: '/category/anniversary' },
              { label: 'Eid Special', href: '/category/eid-special' },
              { label: 'Custom Gifts', href: '/category/custom' },
              { label: 'Corporate Gifts', href: '/category/corporate' },
              { label: 'Thank You Gifts', href: '/category/thank-you' },
              { label: '🏷️ Under $50', href: '/category/all?maxPrice=50' },
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
              <button
                onClick={() => {
                  closeMobileMenu();
                  openCart();
                }}
                className="w-full text-left block px-6 py-3.5 text-sm font-medium text-warm-gray hover:bg-background-hover hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                Cart {itemCount > 0 && `(${itemCount})`}
              </button>
            </li>
            {!isAuthChecked ? (
              <li className="px-6 py-4 flex flex-col gap-4">
                <div className="w-24 h-4 bg-cloud/60 rounded animate-pulse"></div>
                <div className="w-32 h-4 bg-cloud/60 rounded animate-pulse"></div>
              </li>
            ) : isAuthenticated ? (
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

      {/* ─── Cart Drawer ──────────────────────────────────────────────── */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </header>
  );
}
