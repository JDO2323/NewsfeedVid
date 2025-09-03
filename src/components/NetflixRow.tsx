'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Video } from '@/types';
import { NetflixMovieBlock } from './NetflixMovieBlock';

interface NetflixRowProps {
  title: string;
  videos: Video[];
  size?: 'small' | 'medium' | 'large';
  viewAllLink?: string;
}

export function NetflixRow({ title, videos, size = 'medium', viewAllLink }: NetflixRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (videos.length === 0) return null;

  return (
    <section className="relative group/section mb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        
        {viewAllLink && (
          <a 
            href={viewAllLink}
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
          >
            Voir tout
          </a>
        )}
      </div>

      {/* Scrollable row */}
      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 opacity-0 group-hover/section:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 opacity-0 group-hover/section:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}

        {/* Video row */}
        <div
          ref={scrollRef}
          onScroll={checkScrollability}
          className="flex space-x-3 md:space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth px-4 md:px-8 pb-4 scrollbar-hide"
        >
          {videos.map((video, index) => (
            <div key={video.id} className="flex-shrink-0">
              <NetflixMovieBlock
                video={video}
                index={index}
                size={size}
                showInfo={size === 'large'}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}