import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Star, ArrowRight, Bookmark, BookmarkCheck, Cpu, Briefcase, BarChart3, Pencil, Code, Palette, Database, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Platform {
  _id: string;
  name: string;
  shortDescription: string;
  category: string;
  earningPotential: string;
  rating: number;
  logo?: string;
  tags?: string[];
}

interface PlatformCardProps {
  platform: Platform;
  index: number;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
}

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

const earningColors: Record<string, string> = {
  '$': 'text-gray-500 bg-gray-100 dark:bg-gray-800',
  '$$': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
  '$$$': 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
  '$$$$': 'text-purple-600 bg-purple-50 dark:bg-purple-950/30',
  '$$$$$': 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
};

export default function PlatformCard({ platform, index, isBookmarked, onBookmark }: PlatformCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const Icon = categoryIcons[platform.category] || HelpCircle;
  const gradient = categoryColors[platform.category] || 'from-gray-500 to-gray-700';
  const earningStyle = earningColors[platform.earningPotential] || earningColors['$'];

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Sign up to save platforms', {
        action: {
          label: 'Sign Up',
          onClick: () => navigate('/register'),
        },
      });
      return;
    }
    onBookmark?.(platform._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 overflow-hidden card-hover"
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {platform.name}
              </h3>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {platform.category}
              </span>
            </div>
          </div>

          {/* Bookmark button — always visible, auth-gated */}
          <button
            onClick={handleBookmark}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-primary-500 fill-primary-500" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {platform.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {platform.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{platform.rating}</span>
            </div>

            {/* Earning potential */}
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${earningStyle}`}>
              {platform.earningPotential}
            </span>
          </div>

          <button
            onClick={() => navigate(`/platform/${platform._id}`)}
            className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition group/btn"
          >
            Details
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
