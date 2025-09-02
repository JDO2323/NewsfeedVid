'use client';

import { motion } from 'framer-motion';
import { Video } from '@/types';
import { VideoCard } from '@/components/VideoCard/VideoCard';
import { SkeletonVideoCard } from '@/components/UI/SkeletonVideoCard';

interface VideoGridProps {
  videos: Video[];
  loading?: boolean;
  className?: string;
  showHero?: boolean;
}

export function VideoGrid({ videos, loading, className = '', showHero = false }: VideoGridProps) {
  if (loading) {
    return (
      <div className={`grid-responsive ${className}`}>
        {Array.from({ length: showHero ? 7 : 12 }).map((_, index) => (
          <SkeletonVideoCard key={index} variant={index === 0 && showHero ? 'hero' : 'default'} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-google-gray-100 dark:bg-dark-surface rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">📺</span>
        </div>
        <h3 className="heading-2 mb-2">Aucune vidéo disponible</h3>
        <p className="text-body max-w-md">
          Nous préparons du contenu frais pour cette section. Revenez bientôt !
        </p>
      </div>
    );
  }

  const heroVideo = showHero ? videos[0] : null;
  const gridVideos = showHero ? videos.slice(1) : videos;

  return (
    <div className={className}>
      {/* Hero Video */}
      {heroVideo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-6">
            <h2 className="heading-1 mb-2">À la une</h2>
            <div className="w-12 h-1 bg-google-blue rounded-full"></div>
          </div>
          <VideoCard 
            video={heroVideo} 
            priority={true} 
            variant="hero"
            index={0}
          />
        </motion.div>
      )}

      {/* Video Grid */}
      <div className="grid-responsive">
        {gridVideos.map((video, index) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            index={showHero ? index + 1 : index}
          />
        ))}
      </div>
    </div>
  );
}