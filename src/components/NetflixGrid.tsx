'use client';

import { motion } from 'framer-motion';
import { Video } from '@/types';
import { NetflixMovieBlock } from './NetflixMovieBlock';
import { useRouter } from 'next/navigation';

interface NetflixGridProps {
  title: string;
  videos: Video[];
  categorySlug?: string;
  viewAll?: boolean;
}

export function NetflixGrid({ title, videos, categorySlug, viewAll = true }: NetflixGridProps) {
  const router = useRouter();
  
  if (videos.length === 0) return null;

  const featuredVideo = videos[0];
  const gridVideos = videos.slice(1, 5); // 4 videos for 2x2 grid

  const handleViewAll = () => {
    if (categorySlug) {
      router.push(`/category/${categorySlug}`);
    }
  };

  return (
    <section className="mb-16 px-4 md:px-8">
      {/* Section title */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-6"
      >
        {title}
      </motion.h2>

      {/* Netflix-style layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 mb-6">
        {/* Featured large video - 3 columns */}
        <div className="lg:col-span-3">
          <NetflixMovieBlock
            video={featuredVideo}
            size="large"
            showInfo={true}
          />
        </div>

        {/* Grid of 4 smaller videos - 2 columns, arranged as 2x2 */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 md:gap-4">
          {gridVideos.map((video, index) => (
            <NetflixMovieBlock
              key={video.id}
              video={video}
              index={index + 1}
              size="small"
            />
          ))}
        </div>
      </div>

      {/* View all link */}
      {viewAll && categorySlug && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleViewAll}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors text-lg"
          >
            Voir tous les articles vidéos liés
          </button>
        </motion.div>
      )}
    </section>
  );
}