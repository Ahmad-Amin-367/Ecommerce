'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import useAuth from '@/hooks/useAuth';

const NAV_LINKS = [
  { id: 'overview', label: 'Home', targetId: 'overview' },
  { id: 'services', label: 'Services', targetId: 'services-section' },
  { id: 'creations', label: 'Creations', targetId: 'creations-section' },
  { id: 'process', label: 'Process', targetId: 'process-section' },
  { id: 'why-us', label: 'Why Us', targetId: 'why-us' },
  { id: 'quote', label: 'Request a Quote', targetId: 'quote-section' },
];

export default function B2BNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, isAuthChecked } = useAuthStore();
  const { logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const dropdownRef = useRef(null);
  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Track active storefront as B2B
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hisna_active_storefront', 'b2b');
    }
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Auto-detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const scrollPosition = window.scrollY + 220;
      const sections = [
        { id: 'quote', el: document.getElementById('quote-section') },
        { id: 'why-us', el: document.getElementById('why-us') },
        { id: 'process', el: document.getElementById('process-section') },
        { id: 'creations', el: document.getElementById('creations-section') },
        { id: 'services', el: document.getElementById('services-section') },
        { id: 'overview', el: document.getElementById('overview') },
      ];

      for (const sec of sections) {
        if (sec.el && scrollPosition >= sec.el.offsetTop) {
          setActiveSection(sec.id);
          return;
        }
      }
      setActiveSection('overview');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
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
      const headerOffset = 110;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
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
      <div className="bg-[#325247] text-white text-xs py-2 px-4 font-medium tracking-wide flex items-center justify-between shadow-sm">
        <div className="flex-1 text-center truncate">
          <span className="hidden sm:inline mr-1.5">🏢</span>
          <span>Corporate & Bulk Ordering Division — Serving GTA & Nationwide</span>
          <span className="hidden md:inline text-white/70"> | Dedicated Account Support & Volume Discounts</span>
        </div>
        <Link
          href="/b2c"
          className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-200 hover:text-white font-semibold underline underline-offset-2 ml-4 shrink-0 transition-colors"
        >
          <span>Personal Gifting</span>
          <span>&rarr;</span>
        </Link>
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

          {/* B2B Logo */}
          <Link
            href="/b2b"
            className="flex items-center group shrink-0 py-1"
            onClick={(e) => {
              if (pathname === '/b2b') {
                e.preventDefault();
                scrollToSection('overview', 'overview');
              }
            }}
          >
            <Image
              src="/hisna-logo.jpeg"
              alt="Hisna Gifts Corporate & Bulk Orders"
              width={120}
              height={56}
              priority
              className="h-11 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop B2B Links: Clean, distinct sections */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-2 h-[68px] shrink">
            {NAV_LINKS.map((tab) => {
              const isActive = activeSection === tab.id;

              return (
                <li key={tab.id} className="relative h-full flex items-center">
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, tab)}
                    className={`relative z-10 px-2 xl:px-3.5 py-2 text-xs xl:text-[13px] font-semibold tracking-wide transition-colors duration-200 cursor-pointer h-full flex items-center whitespace-nowrap ${
                      isActive ? 'text-[#325247] font-bold' : 'text-warm-gray hover:text-[#325247]'
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
            {/* WhatsApp Contact Link */}
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
              onClick={() => scrollToSection('quote-section', 'quote')}
              className="hidden sm:inline-flex items-center gap-1 px-3 lg:px-4 xl:px-5 py-2.5 bg-[#325247] text-white rounded-full text-[10px] xl:text-xs font-bold uppercase tracking-wider hover:bg-[#253e35] transition-all cursor-pointer shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <span>Request a Quote</span>
            </button>

            {/* User Profile dropdown / Sign In */}
            {!isAuthChecked ? (
              <div className="w-8 h-8 rounded-full bg-[#e9f0eb] animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-[#e9f0eb] transition-colors border border-[#325247]/20 cursor-pointer"
                  aria-label="Profile menu"
                >
                  <div className="w-7 h-7 rounded-full bg-[#325247] text-white flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : <User size={14} />}
                  </div>
                  <span className="text-xs font-semibold text-charcoal max-w-[100px] truncate hidden sm:inline">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-text-muted" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-cloud rounded-2xl shadow-card py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-cloud mb-1">
                      <p className="text-sm font-semibold text-charcoal truncate">{user?.name}</p>
                      <p className="text-xs text-text-muted truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'ADMIN' ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-background-hover hover:text-[#325247] transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/admin/b2b-quotes"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-background-hover hover:text-[#325247] transition-colors"
                        >
                          B2B Quotes Admin
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-background-hover hover:text-[#325247] transition-colors"
                      >
                        Profile & Orders
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
                className="inline-flex items-center px-4 py-2 bg-[#325247] text-white rounded-full text-xs font-semibold tracking-wide transition-all duration-200 hover:bg-[#253e35] shadow-sm hover:shadow"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Mobile B2B Menu Drawer ─────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-cloud bg-white animate-fade-in shadow-lifted max-h-[calc(100vh-110px)] overflow-y-auto">
          <ul className="flex flex-col py-3 px-4 space-y-1 text-sm font-semibold text-charcoal">
            {NAV_LINKS.map((tab) => {
              const isActive = activeSection === tab.id;

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

            {/* Switch to Personal Gifting */}
            <li className="border-t border-cloud/60 pt-2 mt-2">
              <Link
                href="/b2c"
                className="block px-4 py-2.5 rounded-xl bg-[#FDF3F0] text-[#C67D5C] font-semibold text-xs transition-colors hover:bg-[#faeae5]"
                onClick={closeMobileMenu}
              >
                Switch to Personal Gifting &rarr;
              </Link>
            </li>

            {/* Mobile Auth options */}
            <li className="pt-2">
              {!isAuthChecked ? (
                <div className="w-24 h-4 bg-cloud/60 rounded animate-pulse px-4 py-2"></div>
              ) : isAuthenticated ? (
                <>
                  <div className="px-4 py-1 text-xs text-text-muted">
                    Signed in as <span className="font-semibold text-charcoal">{user?.name}</span>
                  </div>
                  {user?.role === 'ADMIN' ? (
                    <>
                      <Link
                        href="/admin"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-[#e9f0eb] hover:text-[#325247] rounded-xl transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/b2b-quotes"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-[#e9f0eb] hover:text-[#325247] rounded-xl transition-colors"
                      >
                        B2B Quotes Admin
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="block px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-[#e9f0eb] hover:text-[#325247] rounded-xl transition-colors"
                    >
                      Profile & Orders
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-error hover:bg-error/10 font-semibold transition-colors cursor-pointer text-sm mt-1"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="w-full text-center py-2.5 rounded-full bg-[#325247] text-white font-semibold text-xs transition-colors hover:bg-[#253e35]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="w-full text-center py-2.5 rounded-full border border-[#325247] text-[#325247] font-semibold text-xs transition-colors hover:bg-[#e9f0eb]"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
