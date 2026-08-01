import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Gift } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Login' };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-6 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute w-[400px] h-[400px] bg-blush/20 rounded-full blur-[100px] -top-[80px] -right-[80px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -bottom-[60px] -left-[60px] pointer-events-none" />
      
      <div className="bg-white border border-cloud rounded-3xl p-10 sm:p-12 w-full max-w-[440px] relative animate-fade-in shadow-card">
        {/* Brand */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Gift size={22} className="text-primary transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-serif text-xl font-bold tracking-tight text-charcoal">
            Hisna <span className="text-primary">Gifts</span>
          </span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="font-serif text-[28px] font-bold text-charcoal mb-2">Welcome Back</h1>
          <p className="text-sm text-warm-gray">Sign in to your account</p>
        </div>
        <Suspense fallback={<div className="h-48 flex items-center justify-center text-warm-gray text-sm">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
