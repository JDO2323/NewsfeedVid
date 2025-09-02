'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  MessageCircle, 
  UserPlus, 
  ChevronUp, 
  ChevronDown,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Pause,
  Play
} from 'lucide-react';
import { Video } from '@/types';
import { useStore } from '@/store/useStore';
import { formatViewCount, formatRelativeTime } from '@/lib/videoUtils';
import clsx from 'clsx';

interface ShortsViewerProps {
  videos: Video[];
  categorySlug: string;
  initialIndex?: number;
}

export function ShortsViewer({ videos, categorySlug, initialIndex = 0 }: ShortsViewerProps) {
  const router = useRouter();
  const { language, likedVideos, likeVideo, subscriptions, toggleSubscribe } = useStore();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentVideo = videos[currentIndex];
  const isLiked = currentVideo ? likedVideos.includes(currentVideo.id) : false;
  const isSubscribed = currentVideo?.creator ? subscriptions.includes(currentVideo.creator.id) : false;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  }, [videos.length]);

  useEffect(() => {
    if (!showControls) return;
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [showControls]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          goToPrev();
          break;
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          router.push(`/category/${categorySlug}`);
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          setShowControls(true);
          break;
        case 'm':
          e.preventDefault();
          setIsMuted(!isMuted);
          setShowControls(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, categorySlug, router, isPlaying, isMuted]);

  if (!currentVideo) return null;

  return (
    <div className="fixed inset-0 bg-netflix-black z-50 overflow-hidden">
      {/* Video Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full max-w-md mx-auto">
          <img
            src={currentVideo.thumbnail}
            alt={currentVideo.title}
            className="w-full h-full object-cover"
          />
          
          {/* Netflix gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
          
          {/* Play/Pause overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={() => setShowControls(!showControls)}
          >
            {!isPlaying && showControls && (
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-netflix-lg backdrop-blur-sm animate-scale-in">
                <Play className="w-8 h-8 text-netflix-black fill-current ml-1" />
              </div>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={clsx(
            "absolute left-6 top-1/2 transform -translate-y-1/2 p-3 rounded-full backdrop-blur-md transition-all duration-300",
            currentIndex === 0 
              ? "bg-gray-900/30 text-gray-600 cursor-not-allowed" 
              : "bg-black/70 text-white hover:bg-black/90 hover:scale-110"
          )}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        
        <button
          onClick={goToNext}
          disabled={currentIndex === videos.length - 1}
          className={clsx(
            "absolute right-6 top-1/2 transform -translate-y-1/2 p-3 rounded-full backdrop-blur-md transition-all duration-300",
            currentIndex === videos.length - 1
              ? "bg-gray-900/30 text-gray-600 cursor-not-allowed"
              : "bg-black/70 text-white hover:bg-black/90 hover:scale-110"
          )}
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        {/* Header Controls */}
        <div className={clsx(
          "absolute top-0 left-0 right-0 p-6 transition-all duration-300",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        )}>
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button
              onClick={() => router.push(`/category/${categorySlug}`)}
              className="flex items-center space-x-2 px-4 py-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-all duration-300 backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Retour</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-black/70 text-white rounded-full backdrop-blur-md">
                <span className="text-sm font-medium">
                  {currentIndex + 1} / {videos.length}
                </span>
              </div>
              
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-all duration-300 backdrop-blur-md"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Video Info Overlay */}
        <div className={clsx(
          "absolute bottom-0 left-0 right-0 p-6 transition-all duration-300",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="flex justify-between items-end max-w-md mx-auto">
            {/* Video info */}
            <div className="flex-1 mr-6 space-y-4">
              <div className="space-y-2">
                <h2 className="text-white font-bold text-lg leading-tight">
                  {currentVideo.title}
                </h2>
                
                {currentVideo.creator && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-news-primary to-news-urgent rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {currentVideo.creator.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-white font-medium">
                      {currentVideo.creator.name}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-4 text-white/80 text-sm">
                  <span>{formatViewCount(currentVideo.views)} vues</span>
                  <span>•</span>
                  <span>{formatRelativeTime(currentVideo.publishedAt)}</span>
                </div>

                {/* Tags */}
                {currentVideo.dynamicTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentVideo.dynamicTags.slice(0, 2).map(tag => (
                      <button
                        key={tag}
                        onClick={() => router.push(`/search?q=${tag}`)}
                        className="px-3 py-1 bg-white/20 text-white text-xs rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
                      >
                        #{tag.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => likeVideo(currentVideo.id)}
                className={clsx(
                  'p-3 rounded-full backdrop-blur-md transition-all duration-300',
                  isLiked 
                    ? 'bg-news-urgent text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                )}
              >
                <Heart className={clsx('w-5 h-5', isLiked && 'fill-current')} />
              </button>

              <button className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all duration-300">
                <MessageCircle className="w-5 h-5" />
              </button>

              <button className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all duration-300">
                <Share className="w-5 h-5" />
              </button>

              {currentVideo.creator && (
                <button
                  onClick={() => toggleSubscribe(currentVideo.creator!.id)}
                  className={clsx(
                    'p-3 rounded-full backdrop-blur-md transition-all duration-300',
                    isSubscribed
                      ? 'bg-gray-600 text-white'
                      : 'bg-news-primary text-white hover:bg-news-primary-dark'
                  )}
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              )}

              <button className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all duration-300">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={clsx(
                'rounded-full transition-all duration-300',
                index === currentIndex 
                  ? 'w-1 h-12 bg-white' 
                  : 'w-1 h-6 bg-white/40 hover:bg-white/70'
              )}
            />
          ))}
        </div>

        {/* Keyboard shortcuts */}
        <div className={clsx(
          "absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center space-x-4 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full text-white/80 text-xs">
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↑↓</kbd>
              <span>Naviguer</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Espace</kbd>
              <span>Pause</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">ESC</kbd>
              <span>Quitter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}