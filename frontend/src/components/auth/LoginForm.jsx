'use client';
import { useFormik } from 'formik';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { loginSchema } from '@/validations/authValidation';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginForm() {
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        await login(values);
      } catch (err) {
        const message = err.response?.data?.message || 'Login failed';
        if (message.toLowerCase().includes('email') || message.toLowerCase().includes('password') || message.toLowerCase().includes('credentials')) {
          setFieldError('email', message);
          setFieldError('password', message);
        } else {
          setFieldError('email', message);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6" noValidate>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail size={16} />}
        error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
        {...formik.getFieldProps('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock size={16} />}
        error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
        {...formik.getFieldProps('password')}
      />

      <Button type="submit" fullWidth size="lg" isLoading={formik.isSubmitting}>
        Sign In
      </Button>

      <p className="text-center text-sm text-warm-gray">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary font-semibold transition-colors duration-200 hover:text-primary-dark hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
