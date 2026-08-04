'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Lock, KeyRound } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { forgotPassword, resetPassword } = useAuth();
  const inputRefs = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

  // --- OTP Handlers ---
  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < pastedData.length; i++) {
        if (i + index < 6) newOtp[i + index] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedData.length, 5);
      if (inputRefs.current[nextIndex]) inputRefs.current[nextIndex].focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // --- Submit Handlers ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await forgotPassword({ email });
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ email, otp: otpString, newPassword });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
      if (err.response?.data?.message?.toLowerCase().includes('otp')) {
        setOtp(['', '', '', '', '', '']);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[95vh] w-full">
              <div className="p-6 sm:p-8 flex flex-col items-center relative">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 text-warm-gray hover:text-charcoal transition-colors rounded-full hover:bg-cloud"
                >
                  <X size={20} />
                </button>

                {step === 1 ? (
                  // STEP 1: Email Input
                  <>
                    <div className="w-12 h-12 bg-cloud rounded-full flex items-center justify-center mb-6">
                      <KeyRound className="text-primary" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal mb-2">Forgot Password</h3>
                    <p className="text-warm-gray text-center mb-8">
                      Enter your email address and we&apos;ll send you a 6-digit code to reset your password.
                    </p>

                    <form onSubmit={handleSendOtp} className="w-full">
                      <div className="mb-6">
                        <Input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          leftIcon={<Mail size={16} />}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        isLoading={isSubmitting}
                        disabled={!email}
                        rightIcon={<ArrowRight size={18} />}
                      >
                        Send Reset Code
                      </Button>
                    </form>
                  </>
                ) : (
                  // STEP 2: OTP & New Password
                  <>
                    <div className="w-12 h-12 bg-cloud rounded-full flex items-center justify-center mb-6">
                      <Lock className="text-primary" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal mb-2">Reset Password</h3>
                    <p className="text-warm-gray text-center mb-8">
                      Enter the code sent to <span className="font-semibold text-charcoal">{email}</span> and your new password.
                    </p>

                    <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-5">
                      {/* OTP Inputs */}
                      <div className="flex justify-between gap-1 sm:gap-2 mb-2 w-full max-w-[320px] mx-auto">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            autoComplete="one-time-code"
                            className="w-9 sm:w-12 h-11 sm:h-14 text-center text-lg sm:text-2xl font-bold text-charcoal bg-cloud/50 border border-cloud rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                          />
                        ))}
                      </div>

                      <Input
                        type="password"
                        placeholder="New Password (min 8 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        leftIcon={<Lock size={16} />}
                        required
                        minLength={8}
                        autoComplete="new-password"
                      />

                      <Input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        leftIcon={<Lock size={16} />}
                        required
                        minLength={8}
                        autoComplete="new-password"
                      />

                      <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        isLoading={isSubmitting}
                        disabled={otp.join('').length < 6 || !newPassword || !confirmPassword}
                      >
                        Save New Password
                      </Button>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm font-semibold text-warm-gray hover:text-charcoal mt-2 transition-colors cursor-pointer"
                      >
                        &larr; Back to Email
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
