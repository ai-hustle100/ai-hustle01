import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { platformsAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft, ExternalLink, Star, Bookmark, BookmarkCheck,
  CheckCircle, XCircle, Loader2, AlertTriangle,
  Cpu, Briefcase, BarChart3, Pencil, Code, Palette, Database, HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const categoryIcons: Record<string, typeof Cpu> = {
  'AI Tools': Cpu,
  'Freelancing': Briefcase,
  'Surveys': BarChart3,
  'Micro Tasks': Pencil,
  'Content Creation': Pencil,
  'Teaching': Pencil,
  'Development': Code,
  'Design': Palette,
  'Data Labeling': Database,
};

const categoryColors: Record<string, string> = {
  'AI Tools': 'from-violet-500 to-purple-600',
  'Freelancing': 'from-blue-500 to-indigo-600',
  'Surveys': 'from-emerald-500 to-teal-600',
  'Micro Tasks': 'from-orange-500 to-amber-600',
  'Content Creation': 'from-pink-500 to-rose-600',
  'Teaching': 'from-cyan-500 to-blue-600',
  'Development': 'from-gray-700 to-gray-900',
  'Design': 'from-fuchsia-500 to-purple-600',
  'Data Labeling': 'from-lime-500 to-green-600',
};

interface PlatformData {
  _id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  earningPotential: string;
  rating: number;
  website: string;
  logo?: string;
  tags?: string[];
  steps?: string[];
  pros?: string[];
  cons?: string[];
  isBookmarked?: boolean;
}

export default function PlatformDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateBookmarks } = useAuth();
  const [platform, setPlatform] = useState<PlatformData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlatform = async () => {
      if (!id) return;
      try {
        const res = await platformsAPI.getById(id);
        setPlatform(res.data.platform);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setError(e.response?.data?.message || 'Failed to load platform');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlatform();
  }, [id]);

  const handleBookmark = async () => {
    if (!id) return;
    if (!isAuthenticated) {
      toast.info('Sign up to save platforms', {
        action: {
          label: 'Sign Up',
          onClick: () => navigate('/register'),
        },
      });
      return;
    }
    try {
      const res = await platformsAPI.toggleBookmark(id);
      toast.success(res.data.message);
      setPlatform(prev => prev ? { ...prev, isBookmarked: res.data.isBookmarked } : null);
      if (user) {
        const newBookmarks = res.data.isBookmarked
          ? [...(user.bookmarks || []), id]
          : (user.bookmarks || []).filter((bid: string) => bid !== id);
        updateBookmarks(newBookmarks);
      }
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-surface-dark pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 animate-pulse">
            <div className="h-8 w-48 rounded-lg skeleton" />
            <div className="h-64 rounded-2xl skeleton" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48 rounded-2xl skeleton" />
              <div className="h-48 rounded-2xl skeleton" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !platform) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-surface-dark pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Platform Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'This platform could not be loaded.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 text-sm font-semibold text-white rounded-xl gradient-bg-accent"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[platform.category] || HelpCircle;
  const gradient = categoryColors[platform.category] || 'from-gray-500 to-gray-700';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </motion.button>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 overflow-hidden mb-6"
        >
          <div className={`h-2 bg-gradient-to-r ${gradient}`} />
          <div className="p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl shrink-0`}>
                <Icon className="w-10 h-10 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {platform.name}
                    </h1>
                    <p className="text-sm font-medium text-primary-500 mt-1">{platform.category}</p>
                  </div>
                  <button
                    onClick={handleBookmark}
                    className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    {platform.isBookmarked ? (
                      <BookmarkCheck className="w-6 h-6 text-primary-500 fill-primary-500" />
                    ) : (
                      <Bookmark className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{platform.rating}</span>
                    <span className="text-sm text-gray-400">/5</span>
                  </div>
                  <span className="px-3 py-1.5 text-sm font-bold rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                    Earning: {platform.earningPotential}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {platform.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 p-8 mb-6"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About This Platform</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{platform.fullDescription}</p>
        </motion.div>

        {/* Steps */}
        {platform.steps && platform.steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 p-8 mb-6"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">How to Get Started</h2>
            <div className="space-y-4">
              {platform.steps.map((step: string, index: number) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{index + 1}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pros & Cons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* Pros */}
          <div className="rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" /> Pros
            </h2>
            <ul className="space-y-3">
              {platform.pros?.map((pro: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" /> Cons
            </h2>
            <ul className="space-y-3">
              {platform.cons?.map((con: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl gradient-bg-accent p-8 text-center"
        >
          <h2 className="text-xl font-bold text-white mb-3">Ready to Start Earning?</h2>
          <p className="text-white/70 mb-6">Visit {platform.name} and begin your side hustle journey today.</p>
          <a
            href={platform.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 shadow-2xl transition"
          >
            Visit {platform.name} <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
