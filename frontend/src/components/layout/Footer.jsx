'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border mt-16">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
        {/* Brand */}
        <div className="lg:col-span-2">
          <p className="text-xl font-extrabold tracking-tight mb-2">
            <span className="gradient-text">Shop</span>Zone
          </p>
          <p className="text-sm text-text-secondary leading-relaxed max-w-[280px]">
            Your premium destination for quality products. Shop with confidence.
          </p>
        </div>

        {/* Shop links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Shop</h3>
          <ul className="flex flex-col gap-2">
            <li><Link href="/products" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">All Products</Link></li>
            <li><Link href="/products?isFeatured=true" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">Featured</Link></li>
            <li><Link href="/categories" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">Categories</Link></li>
          </ul>
        </div>

        {/* Account links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Account</h3>
          <ul className="flex flex-col gap-2">
            <li><Link href="/login" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">Sign In</Link></li>
            <li><Link href="/register" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">Register</Link></li>
            <li><Link href="/orders" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">My Orders</Link></li>
            <li><Link href="/profile" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">Profile</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Help</h3>
          <ul className="flex flex-col gap-2">
            <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">FAQ</Link></li>
            <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">Contact Us</Link></li>
            <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">Privacy Policy</Link></li>
            <li><Link href="#" className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-150">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between py-6 border-t border-border text-sm text-text-muted gap-2 text-center md:text-left">
        <p>© {new Date().getFullYear()} ShopZone. All rights reserved.</p>
        <p>Built with ❤️ using Next.js & Node.js</p>
      </div>
    </footer>
  );
}
