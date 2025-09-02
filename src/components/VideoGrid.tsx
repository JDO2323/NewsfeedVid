'use client';

import { Video } from '@/types';
import { VideoCard } from './VideoCard';
import clsx from 'clsx';

interface VideoGridProps {
  videos: Video[];
  loading?: boolean;
  className?: string;
}

export function VideoGrid({ videos, loading, className }: VideoGridProps) {
  if (loading) {
    return (
      <div className={clsx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="aspect-video skeleton rounded-lg" />
            <div className="space-y-2">
              <div className="skeleton h-5 w-full" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl">📺</span>
        </div>
        <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          Aucune vidéo disponible
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          Nous préparons du contenu frais pour cette section.
        </p>
      </div>
    );
  }

  return (
    <div className={clsx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
      {videos.map((video, index) => (
        <div 
          key={video.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
}