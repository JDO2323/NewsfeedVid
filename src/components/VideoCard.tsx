'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, Eye } from 'lucide-react';
import { Video } from '@/types';
import { formatDuration, formatRelativeTime, formatViewCount } from '@/lib/videoUtils';

interface VideoCardProps {
  video: Video;
  priority?: boolean;
}

export function VideoCard({ video, priority = false }: VideoCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    router.push(`/watch/${video.id}`);
  };

  return (
    <div 
      className="card-google video-card-hover cursor-pointer p-4"
      onClick={handleClick}
    >
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 group">
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
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Play className="w-5 h-5 text-neutral-900 fill-current ml-0.5" />
            </div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
            {formatDuration(video.durationSec)}
          </div>

          {/* Live badge for recent content */}
          {new Date(video.publishedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-google-red text-white text-xs font-medium rounded">
              EN DIRECT
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-google-subhead font-medium line-clamp-2 leading-tight hover:text-google-blue transition-colors duration-200">
            {video.title}
          </h3>
          
          <div className="space-y-1">
            <p className="text-google-body font-medium text-neutral-700 dark:text-neutral-300">
              {video.creator?.name || video.source.toUpperCase()}
            </p>
            
            <div className="flex items-center space-x-2 text-google-caption text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{formatViewCount(video.views)}</span>
              </div>
              <span>•</span>
              <span>{formatRelativeTime(video.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}