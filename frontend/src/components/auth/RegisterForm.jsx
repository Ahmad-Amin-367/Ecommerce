'use client';
import { useFormik } from 'formik';
import Link from 'next/link';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { registerSchema } from '@/validations/authValidation';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterForm() {
  const { register: registerUser } = useAuth();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', phone: '' },
    validationSchema: registerSchema,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        await registerUser(values);
      } catch (err) {
        const message = err.response?.data?.message || 'Registration failed';
        if (message.toLowerCase().includes('email')) {
          setFieldError('email', message);
        } else {
          setFieldError('email', message); // Fallback to email field
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6" noValidate>
      <Input
        label="Full Name"
        placeholder="Your name"
        leftIcon={<User size={16} />}
        error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
        {...formik.getFieldProps('name')}
      />

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
        placeholder="Min. 8 characters"
        leftIcon={<Lock size={16} />}
        error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
        {...formik.getFieldProps('password')}
      />

      <Input
        label="Phone (optional)"
        type="tel"
        placeholder="+92 300 1234567"
        leftIcon={<Phone size={16} />}
        error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ''}
        {...formik.getFieldProps('phone')}
      />

      <Button type="submit" fullWidth size="lg" isLoading={formik.isSubmitting}>
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
