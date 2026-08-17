'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import useAuth from '@/hooks/useAuth';

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '/b2b' },
  { id: 'weddings', label: 'Weddings & Events', targetId: 'services-section' },
  { id: 'corporate', label: 'Corporate Gifts', targetId: 'services-section' },
  { id: 'fruit-tables', label: 'Fruit Tables', targetId: 'services-section' },
  { id: 'dessert-displays', label: 'Dessert Displays', targetId: 'services-section' },
  { id: 'custom-orders', label: 'Custom Orders', targetId: 'b2b-quote-form' },
  { id: 'contact', label: 'Contact', targetId: 'b2b-quote-form' },
];

export default function B2BNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, isAuthChecked } = useAuthStore();
  const { logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('weddings');

  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Auto-detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const servicesEl = document.getElementById('services-section');
      const quoteEl = document.getElementById('b2b-quote-form');

      const scrollPosition = window.scrollY + 250;

      if (quoteEl && scrollPosition >= quoteEl.offsetTop) {
        setActiveSection('contact');
      } else if (servicesEl && scrollPosition >= servicesEl.offsetTop) {
        setActiveSection('weddings');
      } else {
        setActiveSection('weddings');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
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

  const scrollToSection = (id, sectionKey) => {
    closeMobileMenu();
    setActiveSection(sectionKey);
    isClickScrolling.current = true;

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);

    if (id === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (e, tab) => {
    if (tab.href) return;

    e.preventDefault();
    if (pathname === '/b2b') {
      scrollToSection(tab.targetId, tab.id);
    } else {
      window.location.href = `/b2b#${tab.targetId}`;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-sticky" suppressHydrationWarning>
      {/* ─── B2B Announcement Bar ───────────────────────────────────────── */}
      <div className="bg-[#325247] text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <span className="hidden sm:inline">🏢</span>
        <span>Corporate & Bulk Ordering Division — Serving GTA & Nationwide</span>
        <span className="hidden md:inline text-white/70">| Dedicated Account Support & Volume Discounts</span>
      </div>

      {/* ─── B2B Main Navigation Bar ────────────────────────────────────── */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-cloud shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[68px] gap-2">
          {/* Mobile menu toggle */}
          <button
            className="flex lg:hidden w-10 h-10 items-center justify-center rounded-lg text-charcoal hover:bg-background-hover hover:text-[#325247] transition-colors cursor-pointer"
            onClick={toggleMobileMenu}
            aria-label="Toggle B2B menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* B2B Logo & Tagline */}
          <Link
            href="/b2b"
            className="flex items-center group shrink-0"
            onClick={(e) => {
              if (pathname === '/b2b') {
                e.preventDefault();
                scrollToSection('overview', 'overview');
              }
            }}
          >
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-charcoal leading-none">
                Hisna <span className="text-[#325247]">Gifts</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-medium text-warm-gray mt-0.5 leading-none font-sans whitespace-nowrap">
                Crafted With Love, Made To Impress
              </span>
            </div>
          </Link>

          {/* Desktop B2B Links with smaller text & gap to avoid wrapping */}
          <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 h-[68px] shrink">
            {NAV_LINKS.map((tab) => {
              const isActive = activeSection === tab.id;

              if (tab.href) {
                return (
                  <li key={tab.id} className="relative h-full flex items-center">
                    <Link
                      href={tab.href}
                      className="px-1.5 xl:px-3 py-2 text-[10px] xl:text-[11px] font-bold uppercase tracking-wide text-warm-gray hover:text-[#325247] transition-colors whitespace-nowrap"
                    >
                      {tab.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={tab.id} className="relative h-full flex items-center">
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, tab)}
                    className={`relative z-10 px-1.5 xl:px-3 py-2 text-[10px] xl:text-[11px] font-bold uppercase tracking-wide transition-colors duration-200 cursor-pointer h-full flex items-center whitespace-nowrap ${
                      isActive ? 'text-[#325247]' : 'text-warm-gray hover:text-[#325247]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeB2BUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#325247]"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 xl:gap-3 shrink-0">
            {/* WhatsApp Contact Link (solid green circle with white lucide-react MessageCircle icon inside) */}
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 shrink-0 cursor-pointer"
              title="Contact on WhatsApp"
            >
              <svg viewBox="0 0 32 32" width="18" height="18" fill="white">
                <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.13 6.742 3.052 9.374L1.056 31.58l6.402-2.046A15.91 15.91 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.302 22.602c-.392 1.104-1.93 2.022-3.168 2.29-.848.18-1.956.322-5.684-1.222-4.77-1.974-7.838-6.812-8.074-7.126-.228-.314-1.91-2.544-1.91-4.854 0-2.31 1.21-3.448 1.638-3.918.392-.43 1.036-.606 1.65-.606.196 0 .374.01.532.018.47.02.706.048 1.016.788.392.94 1.346 3.282 1.462 3.52.118.238.236.55.078.862-.15.32-.282.462-.52.73-.236.27-.462.476-.698.766-.216.254-.46.524-.196.992.264.462 1.176 1.938 2.524 3.14 1.734 1.544 3.194 2.024 3.65 2.25.392.196.628.164.862-.098.24-.268 1.03-1.2 1.306-1.612.268-.412.54-.344.91-.206.372.136 2.36 1.114 2.764 1.316.404.204.672.304.77.47.098.168.098.95-.294 2.054z"/>
              </svg>
            </a>

            {/* Request Quote Button */}
            <button
              type="button"
              onClick={() => scrollToSection('b2b-quote-form', 'contact')}
              className="hidden sm:inline-flex items-center gap-1 px-3 lg:px-4 xl:px-5 py-2.5 bg-[#325247] text-white rounded-full text-[10px] xl:text-xs font-bold uppercase tracking-wider hover:bg-[#253e35] transition-all cursor-pointer shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <span>Request a Quote</span>
            </button>

            {/* User Profile dropdown */}
            {isAuthChecked && isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-[#e9f0eb] border border-[#325247]/20 flex items-center justify-center text-[#325247] hover:bg-[#325247] hover:text-white transition-colors cursor-pointer ml-1"
                  aria-label="Profile"
                >
                  <User size={16} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-cloud rounded-xl shadow-card py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-cloud mb-2">
                      <p className="text-sm font-semibold text-charcoal truncate">{user?.name}</p>
                      <p className="text-xs text-text-muted truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin/b2b-quotes"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-background-hover hover:text-[#325247] transition-colors"
                      >
                        B2B Quotes Admin
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
            )}
          </div>
        </div>
      </nav>

      {/* ─── Mobile B2B Menu Drawer ─────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-cloud bg-white animate-fade-in shadow-lifted">
          <ul className="flex flex-col py-3 px-4 space-y-1 text-sm font-semibold text-charcoal">
            {NAV_LINKS.map((tab) => {
              const isActive = activeSection === tab.id;

              if (tab.href) {
                return (
                  <li key={tab.id}>
                    <Link
                      href={tab.href}
                      className="block px-4 py-3 rounded-xl hover:bg-[#e9f0eb] hover:text-[#325247] transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {tab.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, tab)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      isActive ? 'bg-[#e9f0eb] text-[#325247] font-bold' : 'hover:bg-[#e9f0eb] hover:text-[#325247]'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
