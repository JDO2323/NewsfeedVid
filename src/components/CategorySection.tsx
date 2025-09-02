'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Play, Clock, Eye } from 'lucide-react';
import { Video } from '@/types';
import { formatDuration, formatRelativeTime, formatViewCount } from '@/lib/videoUtils';
import clsx from 'clsx';

interface CategorySectionProps {
  title: string;
  videos: Video[];
  categorySlug: string;
  showAll?: boolean;
  icon?: string;
}

export function CategorySection({ title, videos, categorySlug, showAll = false, icon }: CategorySectionProps) {
  const router = useRouter();
  const [showFullCoverage, setShowFullCoverage] = useState(showAll);

  if (videos.length === 0) return null;

  const mainVideo = videos[0];
  const relatedVideos = videos.slice(1, showFullCoverage ? videos.length : 4);

  const handleVideoClick = (video: Video) => {
    router.push(`/watch/${video.id}`);
  };

  const handleViewAll = () => {
    if (showFullCoverage) {
      router.push(`/category/${categorySlug}`);
    } else {
      setShowFullCoverage(true);
    }
  };

  return (
    <section className="news-section">
      {/* Section Header - Google News style */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center space-x-2 text-xl font-medium text-neutral-900 dark:text-neutral-100">
          {icon && <span className="text-lg">{icon}</span>}
          <span>{title}</span>
        </h2>
        <button
          onClick={handleViewAll}
          className="flex items-center space-x-1 text-google-blue hover:text-google-blue-hover transition-colors duration-200 text-sm font-medium"
        >
          <span>{showFullCoverage ? 'Voir la page' : 'Couverture complète'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video - Google News main story style */}
        <div className="news-main-story">
          <div 
            className="group cursor-pointer"
            onClick={() => handleVideoClick(mainVideo)}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-neutral-100 dark:bg-neutral-800">
              <img
                src={mainVideo.thumbnail}
                alt={mainVideo.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-5 h-5 text-neutral-900 fill-current ml-0.5" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                {formatDuration(mainVideo.durationSec)}
              </div>

              {/* Live badge for recent content */}
              {new Date(mainVideo.publishedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-google-red text-white text-xs font-medium rounded">
                  EN DIRECT
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-google-headline leading-tight group-hover:text-google-blue transition-colors duration-200">
                {mainVideo.title}
              </h3>
              
              <div className="flex items-center space-x-4 text-google-caption text-neutral-500 dark:text-neutral-400">
                <span className="font-medium">{mainVideo.creator?.name || mainVideo.source.toUpperCase()}</span>
                <span>•</span>
                <span>{formatRelativeTime(mainVideo.publishedAt)}</span>
                <span>•</span>
                <span>{formatViewCount(mainVideo.views)} vues</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Videos - Google News related stories style */}
        <div className="news-secondary-stories">
          {relatedVideos.map((video, index) => (
            <div
              key={video.id}
              className="group cursor-pointer flex items-start space-x-3 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 -mx-3 px-3 rounded-lg transition-colors duration-200"
              onClick={() => handleVideoClick(video)}
            >
              {/* Mini thumbnail */}
              <div className="relative w-16 h-12 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-white text-xs rounded">
                  {Math.floor(video.durationSec / 60)}:{(video.durationSec % 60).toString().padStart(2, '0')}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-google-subhead leading-tight line-clamp-2 group-hover:text-google-blue transition-colors duration-200 mb-1">
                  {video.title}
                </h4>
                
                <div className="flex items-center space-x-2 text-google-caption text-neutral-500 dark:text-neutral-400">
                  <span className="font-medium">{video.creator?.name || video.source.toUpperCase()}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(video.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Show more button if not showing all */}
          {!showFullCoverage && videos.length > 5 && (
            <button
              onClick={handleViewAll}
              className="w-full py-3 text-google-blue hover:text-google-blue-hover font-medium text-sm transition-colors duration-200"
            >
              Voir {videos.length - 4} autres vidéos...
            </button>
          )}
        </div>
      </div>
    </section>
  );
}