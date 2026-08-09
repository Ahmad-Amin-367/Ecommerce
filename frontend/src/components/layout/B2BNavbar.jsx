'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Gift,
  Briefcase,
  ShoppingBag,
  Menu,
  X,
  Send,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import useAuth from '@/hooks/useAuth';

const NAV_SECTIONS = [
  { id: 'overview', targetId: 'overview', label: 'Overview' },
  { id: 'b2b-offerings', targetId: 'b2b-offerings', label: 'Offerings' },
  { id: 'quote-section', targetId: 'quote-section', label: 'Estimator & Form' },
];

export default function B2BNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, isAuthChecked } = useAuthStore();
  const { logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Auto-detect active section on scroll (ignored during click-initiated smooth scroll)
  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const offeringsEl = document.getElementById('b2b-offerings');
      const quoteEl = document.getElementById('quote-section');

      const scrollPosition = window.scrollY + 250;

      if (quoteEl && scrollPosition >= quoteEl.offsetTop) {
        setActiveSection('quote-section');
      } else if (offeringsEl && scrollPosition >= offeringsEl.offsetTop) {
        setActiveSection('b2b-offerings');
      } else {
        setActiveSection('overview');
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

  return (
    <header className="fixed top-0 left-0 right-0 z-sticky" suppressHydrationWarning>
      {/* ─── B2B Announcement Bar ───────────────────────────────────────── */}
      <div className="bg-primary text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <span className="hidden sm:inline">🏢</span>
        <span>Corporate & Bulk Ordering Division — Serving GTA & Nationwide</span>
        <span className="hidden md:inline text-white/70">| Dedicated Account Support & Volume Discounts</span>
      </div>

      {/* ─── B2B Main Navigation Bar ────────────────────────────────────── */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-cloud shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[68px] gap-4">
          {/* Mobile menu toggle */}
          <button
            className="flex lg:hidden w-10 h-10 items-center justify-center rounded-lg text-charcoal hover:bg-background-hover hover:text-primary transition-colors cursor-pointer"
            onClick={toggleMobileMenu}
            aria-label="Toggle B2B menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* B2B Logo & Badge */}
          <Link
            href="/b2b"
            className="flex items-center gap-2 group shrink-0"
            onClick={(e) => {
              if (pathname === '/b2b') {
                e.preventDefault();
                scrollToSection('overview', 'overview');
              }
            }}
          >
            <Gift size={24} className="text-primary transition-transform duration-300 group-hover:rotate-12" />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal leading-none">
                Hisna <span className="text-primary">Gifts</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 mt-0.5">
                <Briefcase size={10} /> Corporate & B2B
              </span>
            </div>
          </Link>

          {/* Desktop B2B Links with Jerk-Free Framer Motion Sliding Active Pill */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_SECTIONS.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <li key={tab.id} className="relative">
                  <button
                    type="button"
                    onClick={() => scrollToSection(tab.targetId, tab.id)}
                    className={`relative z-10 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-primary' : 'text-warm-gray hover:text-primary'
                    }`}
                  >
                    {tab.label}
                  </button>

                  {isActive && (
                    <motion.div
                      layoutId="activeB2BPill"
                      className="absolute inset-0 bg-primary-glow rounded-xl z-0"
                      transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.5 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Switch to B2C Retail Store Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-warm-gray hover:text-charcoal bg-background hover:bg-cloud/60 rounded-full border border-cloud transition-colors"
              title="Return to B2C Retail Store"
            >
              <ShoppingBag size={14} className="text-primary" />
              <span className="hidden sm:inline">Retail Shop</span>
            </Link>

            {/* Request Quote Primary Action Button */}
            <button
              type="button"
              onClick={() => scrollToSection('b2b-quote-form', 'quote-section')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-glow hover:bg-primary-dark hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Send size={13} />
              <span>Get Quote</span>
            </button>

            {/* User Profile dropdown if authenticated */}
            {isAuthChecked && isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-primary-glow border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer ml-1"
                  aria-label="Profile"
                >
                  <User size={18} />
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
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-background-hover hover:text-primary transition-colors"
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
            {NAV_SECTIONS.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(tab.targetId, tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      isActive ? 'bg-primary-glow text-primary font-bold' : 'hover:bg-primary-glow hover:text-primary'
                    }`}
                  >
                    {tab.id === 'overview' && '🏢 '}
                    {tab.id === 'b2b-offerings' && '🍓 '}
                    {tab.id === 'quote-section' && '🧮 '}
                    {tab.label}
                  </button>
                </li>
              );
            })}

            <li className="pt-2 border-t border-cloud">
              <Link
                href="/"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-background text-charcoal border border-cloud hover:bg-cloud/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span className="flex items-center gap-2 text-xs font-bold uppercase">
                  <ShoppingBag size={16} className="text-primary" /> Switch to Retail B2C Shop
                </span>
                <ChevronRight size={16} />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
