'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Eye, 
  Bookmark, 
  Share2,
  MoreHorizontal,
  BookmarkCheck
} from 'lucide-react';
import { Video } from '@/types';
import { formatDuration, formatRelativeTime, formatViewCount } from '@/lib/videoUtils';
import { useStore } from '@/store/useStore';

interface VideoCardProps {
  video: Video;
  priority?: boolean;
  variant?: 'default' | 'hero' | 'compact';
  index?: number;
}

export function VideoCard({ video, priority = false, variant = 'default', index = 0 }: VideoCardProps) {
  const router = useRouter();
  const { likedVideos, likeVideo } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const isSaved = likedVideos.includes(video.id);

  const handleClick = () => {
    router.push(`/watch/${video.id}`);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeVideo(video.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: video.title,
        url: `${window.location.origin}/watch/${video.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/watch/${video.id}`);
      // Show toast notification here
    }
  };

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="video-card group p-0 overflow-hidden"
        onClick={handleClick}
      >
        <div className="relative aspect-video bg-google-gray-200 dark:bg-google-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading={priority ? 'eager' : 'lazy'}
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm"
            >
              <Play className="w-6 h-6 text-google-gray-900 fill-current ml-1" />
            </motion.div>
          </div>

          {/* Duration & Live badges */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <span className="px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded backdrop-blur-sm">
              {formatDuration(video.durationSec)}
            </span>
          </div>

          {new Date(video.publishedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
              🔴 EN DIRECT
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className="heading-2 line-clamp-2 mb-3 group-hover:text-google-blue transition-colors duration-200">
            {video.title}
          </h2>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-google-gray-800 dark:text-dark-text-primary">
                  {video.creator?.name || video.source.toUpperCase()}
                </span>
                {video.creator && (
                  <div className="w-1 h-1 bg-google-gray-400 rounded-full"></div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-caption">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatViewCount(video.views)}</span>
                </div>
                <span>{formatRelativeTime(video.publishedAt)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                className={`p-2 rounded-full transition-colors ${
                  isSaved 
                    ? 'bg-google-blue text-white' 
                    : 'bg-google-gray-100 dark:bg-dark-surface hover:bg-google-gray-200 dark:hover:bg-google-gray-700'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 bg-google-gray-100 dark:bg-dark-surface hover:bg-google-gray-200 dark:hover:bg-google-gray-700 rounded-full transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="video-card group"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-google-gray-200 dark:bg-google-gray-700 rounded-t-lg overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading={priority ? 'eager' : 'lazy'}
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-4 h-4 text-google-gray-900 fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded backdrop-blur-sm">
          {formatDuration(video.durationSec)}
        </div>

        {/* Live badge */}
        {new Date(video.publishedAt).getTime() > Date.now() - 6 * 60 * 60 * 1000 && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
            🔴 LIVE
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-google-gray-900 dark:text-dark-text-primary line-clamp-2 leading-tight mb-2 group-hover:text-google-blue transition-colors duration-200">
          {video.title}
        </h3>
        
        <div className="space-y-2">
          <p className="text-body font-medium text-google-gray-700 dark:text-dark-text-secondary">
            {video.creator?.name || video.source.toUpperCase()}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-caption">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{formatViewCount(video.views)}</span>
              </div>
              <span>•</span>
              <span>{formatRelativeTime(video.publishedAt)}</span>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                className={`p-1.5 rounded-full transition-colors ${
                  isSaved 
                    ? 'bg-google-blue text-white' 
                    : 'bg-google-gray-100 dark:bg-dark-surface hover:bg-google-gray-200 dark:hover:bg-google-gray-700'
                }`}
                title={isSaved ? 'Retiré des favoris' : 'Ajouter aux favoris'}
              >
                {isSaved ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-1.5 bg-google-gray-100 dark:bg-dark-surface hover:bg-google-gray-200 dark:hover:bg-google-gray-700 rounded-full transition-colors"
                title="Partager"
              >
                <Share2 className="w-3 h-3" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}