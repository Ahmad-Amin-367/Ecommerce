import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = { title: 'Create Account' };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute w-[500px] h-[500px] bg-primary-glow rounded-full blur-[120px] -top-[100px] -right-[100px] pointer-events-none" />
      
      <div className="bg-gradient-card border border-border rounded-3xl p-12 w-full max-w-[440px] relative animate-fade-in shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-extrabold text-text-primary mb-2">Create Account</h1>
          <p className="text-base text-text-secondary">Join ShopZone today</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
