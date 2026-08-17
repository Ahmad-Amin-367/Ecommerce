'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift, Mail, Phone, MapPin } from 'lucide-react';
import B2BFooter from './B2BFooter';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/b2b')) {
    return <B2BFooter />;
  }

  return (
    <footer className="bg-charcoal text-cloud mt-0">
      {/* Main Footer */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <Gift size={22} className="text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-serif text-xl font-bold tracking-tight text-white">
              Hisna <span className="text-primary">Gifts</span>
            </span>
          </Link>
          <p className="text-sm text-cloud/70 leading-relaxed max-w-[280px] mb-6">
            A perfect gift for your perfect occasion. Customize your edible fruit arrangements or personalize your gift the way you want.
          </p>
          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/hisna.gifts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-cloud/70 transition-all duration-200 hover:bg-primary hover:text-white"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="mailto:hello@hisnagifts.com"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-cloud/70 transition-all duration-200 hover:bg-primary hover:text-white"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
            <a
              href="tel:+92000000000"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-cloud/70 transition-all duration-200 hover:bg-primary hover:text-white"
              aria-label="Phone"
            >
              <Phone size={16} />
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-5">Shop</h3>
          <ul className="flex flex-col gap-3">
            <li><Link href="/category/all" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">All Gifts</Link></li>
            <li><Link href="/category/birthday" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Birthday Gifts</Link></li>
            <li><Link href="/category/anniversary" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Anniversary</Link></li>
            <li><Link href="/category/eid-special" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Eid Special</Link></li>
            <li><Link href="/category/custom" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Custom Arrangements</Link></li>
            <li><Link href="/category/corporate" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Corporate Gifts</Link></li>
          </ul>
        </div>

        {/* Account links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-5">Account</h3>
          <ul className="flex flex-col gap-3">
            <li><Link href="/login" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Sign In</Link></li>
            <li><Link href="/register" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Register</Link></li>
            <li><Link href="/orders" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">My Orders</Link></li>
            <li><button onClick={() => document.dispatchEvent(new CustomEvent('open-cart'))} className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200 cursor-pointer">Shopping Cart</button></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-5">Help</h3>
          <ul className="flex flex-col gap-3">
            <li><Link href="#" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">FAQ</Link></li>
            <li><Link href="#" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Contact Us</Link></li>
            <li><Link href="#" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Shipping & Delivery</Link></li>
            <li><Link href="#" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Return Policy</Link></li>
            <li><Link href="#" className="text-sm text-cloud/70 hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between py-5 text-xs text-cloud/50 gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Hisna Gifts. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} />
            <span>Pakistan — Delivering nationwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
