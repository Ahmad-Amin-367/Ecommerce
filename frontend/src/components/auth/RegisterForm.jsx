'use client';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { registerSchema } from '@/validations/authValidation';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
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
        type={showPassword ? 'text' : 'password'}
        placeholder="Min. 8 characters"
        leftIcon={<Lock size={16} />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none hover:text-primary transition-colors flex items-center cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
        {...formik.getFieldProps('password')}
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
