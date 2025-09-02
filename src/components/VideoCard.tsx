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
  BookmarkCheck,
  ExternalLink
} from 'lucide-react';
import { Video } from '@/types';
import { formatDuration, formatRelativeTime, formatViewCount } from '@/lib/videoUtils';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    }
  };

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className="group"
      >
        <Card className="overflow-hidden p-0 border-0 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="cursor-pointer" onClick={handleClick}>
            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
              {!imageLoaded && (
                <div className="absolute inset-0 skeleton" />
              )}
              <img
                src={video.thumbnail}
                alt={video.title}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                loading={priority ? 'eager' : 'lazy'}
              />
              
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-20 h-20 bg-white/95 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm shadow-2xl"
                >
                  <Play className="w-8 h-8 text-primary-600 fill-current ml-1" />
                </motion.div>
              </div>

              {/* Duration & Live badges */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <span className="px-3 py-1 bg-black/80 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                  {formatDuration(video.durationSec)}
                </span>
              </div>

              {new Date(video.publishedAt).getTime() > Date.now() - 6 * 60 * 60 * 1000 && (
                <div className="absolute top-4 left-4 px-3 py-2 bg-red-600 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                  🔴 EN DIRECT
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                    {video.title}
                  </h2>
                  
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {(video.creator?.name || video.source).charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">
                        {video.creator?.name || video.source.toUpperCase()}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatViewCount(video.views)}</span>
                    </div>
                    <span>•</span>
                    <span>{formatRelativeTime(video.publishedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2 max-w-2xl">
                  {video.description}
                </p>

                <div className="flex items-center space-x-2 ml-6">
                  <Button
                    variant={isSaved ? "default" : "secondary"}
                    size="sm"
                    onClick={handleSave}
                    className="transition-all duration-200"
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
                    {isSaved ? 'Sauvé' : 'Sauver'}
                  </Button>
                  
                  <Button variant="secondary" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group h-full"
    >
      <Card className="overflow-hidden p-0 cursor-pointer h-full flex flex-col" onClick={handleClick}>
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading={priority ? 'eager' : 'lazy'}
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 bg-white/95 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm shadow-xl"
            >
              <Play className="w-5 h-5 text-primary-600 fill-current ml-0.5" />
            </motion.div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded-md backdrop-blur-sm">
            {formatDuration(video.durationSec)}
          </div>

          {/* Live badge */}
          {new Date(video.publishedAt).getTime() > Date.now() - 6 * 60 * 60 * 1000 && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-md animate-pulse">
              🔴 LIVE
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 flex-1">
            {video.title}
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {(video.creator?.name || video.source).charAt(0)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                {video.creator?.name || video.source.toUpperCase()}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatViewCount(video.views)}</span>
                </div>
                <span>•</span>
                <span>{formatRelativeTime(video.publishedAt)}</span>
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  className={`h-8 w-8 ${isSaved ? 'text-primary-500' : ''}`}
                  title={isSaved ? 'Retiré des favoris' : 'Ajouter aux favoris'}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="h-8 w-8"
                  title="Partager"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}