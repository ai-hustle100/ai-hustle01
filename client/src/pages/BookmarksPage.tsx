import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { platformsAPI } from '@/services/api';
import PlatformCard from '@/components/PlatformCard';
import { Bookmark, Loader2, Inbox, ArrowLeft } from 'lucide-react';
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

export default function BookmarksPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, updateBookmarks } = useAuth();

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const res = await platformsAPI.getBookmarks();
      setPlatforms(res.data.platforms || []);
    } catch {
      toast.error('Failed to load bookmarks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmark = async (platformId: string) => {
    try {
      const res = await platformsAPI.toggleBookmark(platformId);
      toast.success(res.data.message);

      if (!res.data.isBookmarked) {
        // Remove from local list immediately
        setPlatforms((prev) => prev.filter((p) => p._id !== platformId));
      }

      // Update auth context bookmarks
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Bookmarks
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {platforms.length} saved platform{platforms.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No bookmarks yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Explore platforms and bookmark the ones you like to find them here later.
            </p>
            <Link
              to="/dashboard"
              className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl gradient-bg-accent hover:opacity-90 transition inline-block"
            >
              Explore Platforms
            </Link>
          </motion.div>
        ) : (
          /* Bookmarked platforms grid */
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform, index) => (
              <PlatformCard
                key={platform._id}
                platform={platform}
                index={index}
                isBookmarked={true}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
