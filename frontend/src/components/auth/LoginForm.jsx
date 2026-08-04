'use client';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginSchema } from '@/validations/authValidation';
import useAuth from '@/hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';

export default function LoginForm() {
  const { login, googleLogin } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams ? searchParams.get('redirect') : null;
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        await login(values, redirect);
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
    <>
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
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
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

        <div className="flex justify-end -mt-3">
          <button
            type="button"
            onClick={() => setIsForgotModalOpen(true)}
            className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={formik.isSubmitting}>
          Sign In
        </Button>

        <div className="flex items-center gap-3">
          <hr className="flex-1 border-cloud" />
          <span className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Or continue with</span>
          <hr className="flex-1 border-cloud" />
        </div>

        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                await googleLogin({ credential: credentialResponse.credential }, redirect);
              } catch (err) {
                toast.error(err.response?.data?.message || 'Google Login failed');
              }
            }}
            onError={() => {
              toast.error('Google Login failed');
            }}
            useOneTap
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </div>

        <p className="text-center text-sm text-warm-gray">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-semibold transition-colors duration-200 hover:text-primary-dark hover:underline">
            Create Account
          </Link>
        </p>
      </form>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </>
  );
}
