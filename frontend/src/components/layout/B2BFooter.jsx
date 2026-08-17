'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift, Mail, Phone, MapPin, Briefcase, ShoppingBag, ArrowRight } from 'lucide-react';

export default function B2BFooter() {
  const pathname = usePathname();

  const handleScroll = (id) => {
    if (pathname === '/b2b') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.location.href = `/b2b#${id}`;
  };

  return (
    <footer className="bg-[#325247] text-emerald-100 border-t border-[#40695c] mt-0">
      {/* Main Footer */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
        {/* Brand & Tagline */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4 group">
            <Gift size={22} className="text-emerald-300 transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-serif text-xl font-bold tracking-tight text-white">
              Hisna <span className="text-emerald-300">Gifts</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-emerald-900/50 border border-[#40695c] text-emerald-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4">
            <Briefcase size={10} /> Corporate & B2B Division
          </span>
          <p className="text-xs text-emerald-100/70 leading-relaxed max-w-[280px] mb-6">
            Handcrafted fresh fruit arrangements, premium chocolate towers, and custom corporate gifts. Crafted to impress your clients, guests, and teams across the GTA.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/hisna.gifts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-emerald-100/70 transition-all duration-200 hover:bg-emerald-500 hover:text-white"
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
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-emerald-100/70 transition-all duration-200 hover:bg-emerald-500 hover:text-white"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
            <a
              href="tel:+92000000000"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-emerald-100/70 transition-all duration-200 hover:bg-emerald-500 hover:text-white"
              aria-label="Phone"
            >
              <Phone size={16} />
            </a>
          </div>
        </div>

        {/* B2B Navigation */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-5">Corporate Nav</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <button
                onClick={() => handleScroll('overview')}
                className="text-emerald-100/70 hover:text-white transition-colors duration-200 cursor-pointer text-left"
              >
                Overview & Hero
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScroll('b2b-offerings')}
                className="text-emerald-100/70 hover:text-white transition-colors duration-200 cursor-pointer text-left"
              >
                B2B Signature Services
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScroll('why-us')}
                className="text-emerald-100/70 hover:text-white transition-colors duration-200 cursor-pointer text-left"
              >
                Why Choose Us
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScroll('quote-section')}
                className="text-emerald-100/70 hover:text-white transition-colors duration-200 cursor-pointer text-left"
              >
                Interactive Estimator
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScroll('b2b-quote-form')}
                className="text-emerald-100/70 hover:text-white transition-colors duration-200 cursor-pointer text-left"
              >
                Request a Custom Quote
              </button>
            </li>
          </ul>
        </div>

        {/* Corporate Offerings */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-5">Signature Offerings</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <span className="text-emerald-100/70 block">Weddings & Engagements</span>
            </li>
            <li>
              <span className="text-emerald-100/70 block">Corporate Logo Platters</span>
            </li>
            <li>
              <span className="text-emerald-100/70 block">Live Chocolate Fountains</span>
            </li>
            <li>
              <span className="text-emerald-100/70 block">Interactive Dessert Bars</span>
            </li>
            <li>
              <span className="text-emerald-100/70 block">Executive Fruit Platters</span>
            </li>
          </ul>
        </div>

        {/* Retail Shop Link Card */}
        <div className="bg-[#273f36] border border-[#40695c] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 mb-2">
              <ShoppingBag size={14} /> Retail Store
            </h4>
            <p className="text-xs text-emerald-100/70 leading-relaxed mb-4">
              Looking to order individual gifts, birthday bouquets, or customized chocolate trays? Visit our standard retail shop.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>Go to Retail Shop</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#40695c]/60">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between py-5 text-xs text-emerald-100/40 gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Hisna Gifts B2B. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-emerald-400" />
            <span>Serving Greater Toronto Area & Nationwide Canada</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
