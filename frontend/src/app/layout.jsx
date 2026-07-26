import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: {
    default: 'Hisna Gifts — Perfect Gifts for Every Occasion',
    template: '%s | Hisna Gifts',
  },
  description:
    'A perfect gift for your perfect occasion. Customize your edible fruit arrangements or personalize your gift the way you want. Delivery across Pakistan.',
  keywords: ['gifts', 'gift shop', 'edible arrangements', 'custom gifts', 'personalized gifts', 'Pakistan', 'Hisna Gifts'],
  openGraph: {
    title: 'Hisna Gifts — Perfect Gifts for Every Occasion',
    description: 'Customize your edible fruit arrangements or personalize your gift the way you want.',
    type: 'website',
    siteName: 'Hisna Gifts',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
