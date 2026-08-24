import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingQueueTab from '@/components/ui/FloatingQueueTab';
import FlyingItemLayer from '@/components/ui/FlyingItemLayer';

export default function ShopLayout({ children }) {
  return (
    <>
      <Suspense fallback={<div className="h-[104px] bg-white border-b border-cloud fixed top-0 left-0 right-0 z-[50]" />}>
        <Navbar />
      </Suspense>
      <main style={{ minHeight: 'calc(100vh - 140px)', paddingTop: '104px' }}>
        {children}
      </main>
      <Footer />
      <FloatingQueueTab />
      <FlyingItemLayer />
    </>
  );
}
