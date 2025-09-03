'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Plus, ThumbsUp, ChevronDown, Info } from 'lucide-react';
import { Video } from '@/types';
import { formatDuration, formatViewCount } from '@/lib/videoUtils';
import { useStore } from '@/store/useStore';

interface NetflixMovieBlockProps {
  video: Video;
  index?: number;
  size?: 'small' | 'medium' | 'large';
  showInfo?: boolean;
}

export function NetflixMovieBlock({ 
  video, 
  index = 0, 
  size = 'medium',
  showInfo = false 
}: NetflixMovieBlockProps) {
  const router = useRouter();
  const { likedVideos, likeVideo } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isLiked = likedVideos.includes(video.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/watch/${video.id}`);
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeVideo(video.id);
  };

  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/watch/${video.id}?info=true`);
  };

  const sizeClasses = {
    small: 'aspect-[16/9] max-w-[200px]',
    medium: 'aspect-[16/9] max-w-[300px]',
    large: 'aspect-[16/9] max-w-[400px]',
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/watch/${video.id}`)}
    >
      {/* Main thumbnail */}
      <div className={`relative ${sizeClasses[size]} w-full rounded-lg overflow-hidden bg-gray-900`}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-gray-900 to-gray-800 animate-pulse" />
        )}
        
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } group-hover:scale-110`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Netflix gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Duration badge - Netflix style */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
          {formatDuration(video.durationSec)}
        </div>

        {/* Live/Fresh indicator */}
        {new Date(video.publishedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            NOUVEAU
          </div>
        )}

        {/* Hover overlay with actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4"
        >
          {/* Top area - Action buttons */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors shadow-lg"
            >
              <Play className="w-6 h-6 fill-current ml-1" />
            </motion.button>
          </div>

          {/* Bottom area - Title and meta */}
          <div className="space-y-3">
            <h3 className={`font-bold text-white leading-tight line-clamp-2 ${textSizes[size]}`}>
              {video.title}
            </h3>

            {showInfo && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-white/80 text-xs">
                  <span>{formatViewCount(video.views)} vues</span>
                  <span>•</span>
                  <span className="font-semibold">{video.creator?.name || video.source.toUpperCase()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddToList}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isLiked 
                        ? 'bg-white text-black border-white' 
                        : 'border-white/60 text-white hover:border-white hover:bg-white hover:text-black'
                    }`}
                  >
                    {isLiked ? (
                      <ThumbsUp className="w-4 h-4 fill-current" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleMoreInfo}
                    className="w-8 h-8 rounded-full border-2 border-white/60 text-white hover:border-white hover:bg-white hover:text-black flex items-center justify-center transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Title below thumbnail for non-hover state */}
      {!showInfo && (
        <div className="mt-3 space-y-1">
          <h3 className={`font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-red-600 transition-colors duration-200 ${textSizes[size]}`}>
            {video.title}
          </h3>
          
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">{video.creator?.name || video.source.toUpperCase()}</span>
            <span>•</span>
            <span>{formatViewCount(video.views)} vues</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}