'use client';

import { Video } from '@/types';
import { VideoCard } from './VideoCard';

interface SuggestionsRailProps {
  videos: Video[];
  title?: string;
  className?: string;
}

export function SuggestionsRail({ videos, title, className }: SuggestionsRailProps) {
  if (videos.length === 0) return null;

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-bold text-white mb-6">
          {title}
        </h3>
      )}
      
      <div className="space-y-4">
        {videos.slice(0, 10).map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}