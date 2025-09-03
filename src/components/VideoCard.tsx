'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  
  const isSaved = likedVideos.includes(video.id);

  const handleClick = () => {
    router.push(`/watch/${video.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading={priority ? 'eager' : 'lazy'}
        />
        
        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2.5 py-1 rounded-lg text-sm font-semibold backdrop-blur-sm">
          {formatDuration(video.durationSec)}
        </div>

        {/* Live Badge for recent videos */}
        {new Date(video.publishedAt).getTime() > Date.now() - 6 * 60 * 60 * 1000 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            🔴 LIVE
          </div>
        )}
      </div>

      {/* Title - BELOW thumbnail */}
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
        {video.title}
      </h3>

      {/* Metadata */}
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <span className="font-medium">
            {video.creator?.name || video.source.toUpperCase()}
          </span>
          <span>•</span>
          <span>{formatViewCount(video.views)} vues</span>
          <span>•</span>
          <span>{formatRelativeTime(video.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}