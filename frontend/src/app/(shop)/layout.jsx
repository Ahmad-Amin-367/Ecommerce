import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ShopLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 140px)', paddingTop: '80px' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
