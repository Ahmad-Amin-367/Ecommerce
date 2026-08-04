'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Loader2 } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function OtpModal({ isOpen, onClose, email, redirect }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [mounted, setMounted] = useState(false);
  const { verifyOtp, resendOtp } = useAuth();
  const inputRefs = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setResendTimer(60);
      if (inputRefs.current[0]) {
        setTimeout(() => inputRefs.current[0].focus(), 100);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendTimer > 0 && isOpen) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer, isOpen]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow pasting 6 digits
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < pastedData.length; i++) {
        if (i + index < 6) newOtp[i + index] = pastedData[i];
      }
      setOtp(newOtp);
      // focus the next empty input or the last one
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex].focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return;

    setIsSubmitting(true);
    try {
      await verifyOtp({ email, otp: otpString }, redirect);
      onClose(); // Close on success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
      // Clear OTP on error so user can retype easily
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    try {
      setIsResending(true);
      await resendOtp({ email });
      setResendTimer(60); // Reset timer on success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
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
              <div className="p-6 sm:p-8 flex flex-col items-center">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 text-warm-gray hover:text-charcoal transition-colors rounded-full hover:bg-cloud"
                >
                  <X size={20} />
                </button>

                <div className="w-12 h-12 bg-cloud rounded-full flex items-center justify-center mb-6">
                  <Mail className="text-primary" size={24} />
                </div>

                <h3 className="text-2xl font-bold text-charcoal mb-2">Check your email</h3>
                <p className="text-warm-gray text-center mb-8">
                  We sent a verification code to <span className="font-semibold text-charcoal">{email}</span>
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                  <div className="flex justify-between gap-1 sm:gap-2 mb-8 w-full max-w-[320px]">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        autoComplete="one-time-code"
                        className="w-9 sm:w-12 h-11 sm:h-14 text-center text-lg sm:text-2xl font-bold text-charcoal bg-cloud/50 border border-cloud rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={isSubmitting}
                    disabled={otp.join('').length < 6}
                    rightIcon={<ArrowRight size={18} />}
                  >
                    Verify Account
                  </Button>
                </form>

                <div className="mt-8 text-center text-sm">
                  <span className="text-warm-gray">Didn&apos;t receive the code? </span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || isResending}
                    className={`font-semibold transition-colors inline-flex items-center gap-1.5 align-middle ${
                      resendTimer > 0 || isResending
                        ? 'text-warm-gray cursor-not-allowed'
                        : 'text-primary hover:text-primary-dark hover:underline cursor-pointer'
                    }`}
                  >
                    {isResending ? (
                      'Resending...'
                    ) : resendTimer > 0 ? (
                      `Resend code in ${resendTimer}s`
                    ) : (
                      'Resend Code'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
