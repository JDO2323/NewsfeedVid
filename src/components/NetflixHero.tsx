'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Plus, Info, Volume2, VolumeX } from 'lucide-react';
import { Video } from '@/types';
import { formatViewCount } from '@/lib/videoUtils';
import { useStore } from '@/store/useStore';

interface NetflixHeroProps {
  video: Video;
}

export function NetflixHero({ video }: NetflixHeroProps) {
  const router = useRouter();
  const { likedVideos, likeVideo } = useStore();
  const [isMuted, setIsMuted] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isLiked = likedVideos.includes(video.id);

  const handlePlay = () => {
    router.push(`/watch/${video.id}`);
  };

  const handleAddToList = () => {
    likeVideo(video.id);
  };

  const handleMoreInfo = () => {
    router.push(`/watch/${video.id}?info=true`);
  };

  return (
    <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-gray-900 to-gray-800 animate-pulse" />
        )}
        
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Netflix-style gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-xl md:max-w-2xl space-y-6">
            {/* Category badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2"
            >
              <div className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded uppercase tracking-wide">
                {video.category.replace('-', ' ')}
              </div>
              <span className="text-white/80 text-sm">
                {formatViewCount(video.views)} vues
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight"
            >
              {video.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-white/90 leading-relaxed max-w-lg"
            >
              {video.description.slice(0, 150)}...
            </motion.p>

            {/* Creator info */}
            {video.creator && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {video.creator.name.charAt(0)}
                  </span>
                </div>
                <span className="text-white font-medium">
                  {video.creator.name}
                </span>
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-4"
            >
              {/* Play button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                className="flex items-center space-x-3 bg-white text-black px-8 py-3 rounded-md font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Lecture</span>
              </motion.button>

              {/* Add to list */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToList}
                className={`flex items-center space-x-3 px-8 py-3 rounded-md font-bold text-lg border-2 transition-colors ${
                  isLiked
                    ? 'bg-white text-black border-white'
                    : 'bg-gray-600/70 text-white border-gray-400 hover:border-white hover:bg-gray-500/70'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>{isLiked ? 'Ajouté' : 'Ma liste'}</span>
              </motion.button>

              {/* More info */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleMoreInfo}
                className="w-12 h-12 bg-gray-600/70 text-white rounded-full flex items-center justify-center hover:bg-gray-500/70 border-2 border-gray-400 hover:border-white transition-colors"
              >
                <Info className="w-5 h-5" />
              </motion.button>

              {/* Mute toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 bg-gray-600/70 text-white rounded-full flex items-center justify-center hover:bg-gray-500/70 border-2 border-gray-400 hover:border-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
    </div>
  );
}