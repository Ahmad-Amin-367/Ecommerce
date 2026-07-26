import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'ShopZone — Premium E-Commerce',
    template: '%s | ShopZone',
  },
  description:
    'Discover thousands of products at unbeatable prices. Shop electronics, fashion, home goods, and more on ShopZone.',
  keywords: ['ecommerce', 'shop', 'online store', 'buy online'],
  openGraph: {
    title: 'ShopZone — Premium E-Commerce',
    description: 'Discover thousands of products at unbeatable prices.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
