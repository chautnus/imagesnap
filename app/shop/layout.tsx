import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { CartProvider } from './lib/cart';
import ShopHeader from './components/ShopHeader';
import ShopFooter from './components/ShopFooter';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.orangeshome.ca'),
  title: {
    default: 'OrangesHome — Rare Hoya & Tropical Plants | British Columbia, Canada',
    template: '%s | OrangesHome',
  },
  description:
    'Shop rare and uncommon Hoya plants grown in our small greenhouse in BC, Canada. Hand-propagated, lovingly cared for, shipped Canada-wide.',
  keywords: ['hoya plants', 'rare plants canada', 'hoya for sale', 'tropical plants bc', 'orangeshome', 'buy hoya online canada'],
  openGraph: {
    type: 'website',
    siteName: 'OrangesHome',
    url: 'https://www.orangeshome.ca/shop',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${dmSans.variable} font-[family-name:var(--font-dm-sans)] bg-[#FDFAF5] min-h-screen`}>
      <CartProvider>
        <ShopHeader />
        <main>{children}</main>
        <ShopFooter />
      </CartProvider>
    </div>
  );
}
