import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { Zap, Loader2, RotateCcw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOTP, resendOTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as any)?.email || '';

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newOtp.every((d) => d !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      handleVerify(pasted);
    }
  };

  const handleVerify = async (otpString: string) => {
    setIsLoading(true);
    try {
      await verifyOTP(email, otpString);
      toast.success('Email verified successfully! 🎉');
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid OTP';
      toast.error(msg);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);
      toast.success('New OTP sent to your email!');
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-primary-950/30 dark:via-surface-dark dark:to-accent-950/20">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="p-8 rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 shadow-2xl text-center">
          {/* Header */}
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-bg-accent flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">AI Hustle</span>
          </Link>

          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify your email</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            We've sent a 6-digit code to <span className="font-medium text-gray-900 dark:text-white">{email}</span>
          </p>

          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                disabled={isLoading}
              />
            ))}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-sm text-primary-600 mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </div>
          )}

          {/* Resend */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {canResend ? (
              <button
                onClick={handleResend}
                className="inline-flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Resend Code
              </button>
            ) : (
              <p>Resend code in <span className="font-semibold text-primary-600">{countdown}s</span></p>
            )}
          </div>


        </div>
      </motion.div>
    </div>
  );
}
