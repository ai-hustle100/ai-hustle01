import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { subscribeAPI } from '@/services/api';
import { ArrowRight, Sparkles, TrendingUp, Users, Zap, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register');
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      const res = await subscribeAPI.subscribe({ email, source: 'hero_form' });
      toast.success(res.data.message);
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient opacity-90" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/6 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-accent-400/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [15, -15, 15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-300/10 rounded-full blur-3xl"
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent-300" />
            <span className="text-sm font-medium text-white/90">The #1 AI Side Hustle Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
          >
            Discover AI-Powered
            <br />
            <span className="bg-gradient-to-r from-accent-300 via-accent-200 to-primary-300 bg-clip-text text-transparent">
              Side Hustles
            </span>
            <br />
            <span className="text-white/90">& Start Earning Today</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Explore curated platforms, AI tools, and remote opportunities that help you earn from anywhere.
            Join thousands of hustlers building their income streams. 🚀
          </motion.p>

          {/* Email Capture Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto mb-4"
          >
            <div className="relative flex-1 w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubscribing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-900 bg-gradient-to-r from-accent-300 to-accent-400 rounded-2xl hover:from-accent-400 hover:to-accent-500 shadow-2xl shadow-accent-500/25 transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
            >
              {isSubscribing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Get Early Access</>
              )}
            </button>
          </motion.form>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm text-white/40 mb-10"
          >
            Join 1,000+ AI hustlers already inside — no spam, ever.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={handleGetStarted}
              className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-primary-900 bg-white rounded-2xl hover:bg-gray-50 shadow-2xl shadow-black/20 hover:shadow-white/20 transition-all duration-300 pulse-glow"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-3 max-w-lg mx-auto gap-8"
          >
            {[
              { icon: Zap, value: '50+', label: 'Platforms' },
              { icon: Users, value: '10K+', label: 'Users' },
              { icon: TrendingUp, value: '$5M+', label: 'Earned' },
            ].map(({ icon: Icon, value, label }, i) => (
              <div key={i} className="text-center">
                <Icon className="w-5 h-5 text-accent-300 mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-white/50">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-surface-dark to-transparent" />
    </section>
  );
}
