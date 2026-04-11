import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { platformsAPI } from '@/services/api';
import PlatformCard from '@/components/PlatformCard';
import { Search, LayoutGrid, List, Loader2, Inbox, X, UserPlus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  'All', 'AI Tools', 'Freelancing', 'Surveys', 'Micro Tasks',
  'Content Creation', 'Teaching', 'Development', 'Design', 'Data Labeling',
];

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

export default function DashboardPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('');
  const { user, isAuthenticated, updateBookmarks } = useAuth();

  const fetchPlatforms = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      if (sort) params.sort = sort;
      const res = await platformsAPI.getAll(params);
      setPlatforms(res.data.platforms);
    } catch {
      toast.error('Failed to load platforms');
    } finally {
      setIsLoading(false);
    }
  }, [category, search, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchPlatforms, 300);
    return () => clearTimeout(timer);
  }, [fetchPlatforms]);

  const handleBookmark = async (platformId: string) => {
    try {
      const res = await platformsAPI.toggleBookmark(platformId);
      toast.success(res.data.message);
      // Update local bookmarks
      if (user) {
        const newBookmarks = res.data.isBookmarked
          ? [...(user.bookmarks || []), platformId]
          : (user.bookmarks || []).filter((id: string) => id !== platformId);
        updateBookmarks(newBookmarks);
      }
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Non-authenticated user banner */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-200 dark:border-primary-800/30 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <UserPlus className="w-5 h-5 text-primary-500 shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Sign up for personalized recommendations</span> and bookmark your favorite platforms
              </p>
            </div>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-semibold text-white rounded-xl gradient-bg-accent hover:opacity-90 transition whitespace-nowrap"
            >
              Sign Up Free
            </Link>
          </motion.div>
        )}

        {/* Profile completion banner */}
        {isAuthenticated && user && user.profileCompletionPercentage < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-200 dark:border-primary-800/30"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Complete your profile to get personalized AI opportunities
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-xs">
                      <div
                        className="h-full gradient-bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${user.profileCompletionPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                      {user.profileCompletionPercentage}%
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/complete-profile"
                className="px-5 py-2 text-sm font-semibold text-white rounded-xl gradient-bg-accent hover:opacity-90 transition whitespace-nowrap"
              >
                Complete Now
              </Link>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Platforms
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Discover {platforms.length}+ opportunities to earn with AI
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search platforms..."
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white dark:bg-surface-card-dark border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white dark:bg-surface-card-dark border border-gray-200 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Latest</option>
              <option value="rating">Top Rated</option>
              <option value="name">A-Z</option>
              <option value="earning">Highest Earning</option>
            </select>

            {/* View toggle */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-surface-card-dark border border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white dark:bg-surface-card-dark text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading skeletons */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="h-1.5 skeleton" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl skeleton" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded skeleton" />
                      <div className="h-3 w-20 rounded skeleton" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded skeleton" />
                    <div className="h-3 w-3/4 rounded skeleton" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded skeleton" />
                    <div className="h-6 w-16 rounded skeleton" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : platforms.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No platforms found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {search ? `No results for "${search}"` : 'No platforms in this category yet'}
            </p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="px-6 py-2.5 text-sm font-semibold text-primary-600 border border-primary-300 dark:border-primary-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/30 transition"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          /* Platform grid/list */
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-3xl'}`}>
            {platforms.map((platform, index) => (
              <PlatformCard
                key={platform._id}
                platform={platform}
                index={index}
                isBookmarked={user?.bookmarks?.includes(platform._id)}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
