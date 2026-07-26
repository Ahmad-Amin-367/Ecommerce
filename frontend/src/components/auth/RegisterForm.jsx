'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { registerSchema } from '@/validations/authValidation';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterForm() {
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
    } catch {
      // Handled via toast in useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Input
        label="Full Name"
        placeholder="Your name"
        leftIcon={<User size={16} />}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail size={16} />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        leftIcon={<Lock size={16} />}
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Phone (optional)"
        type="tel"
        placeholder="+92 300 1234567"
        leftIcon={<Phone size={16} />}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
        Create Account
      </Button>

      <p className="text-center text-sm text-warm-gray">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-semibold transition-colors duration-200 hover:text-primary-dark hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
