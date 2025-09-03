'use client';

import { useRouter } from 'next/navigation';
import { Video } from '@/types';
import { formatDuration } from '@/lib/videoUtils';

interface NewsSectionProps {
  title: string;
  videos: Video[];
  categorySlug?: string;
}

export function NewsSection({ title, videos, categorySlug }: NewsSectionProps) {
  const router = useRouter();

  if (videos.length === 0) return null;

  const mainVideo = videos[0];
  const sideVideos = videos.slice(1, 5);

  const handleVideoClick = (video: Video) => {
    router.push(`/watch/${video.id}`);
  };

  const handleViewAll = () => {
    if (categorySlug) {
      router.push(`/category/${categorySlug}`);
    }
  };

  return (
    <section className="mb-16">
      {/* Section Title */}
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {title}
      </h2>

      {/* Asymmetric Layout: Large video left + 2x2 grid right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Video - 2/3 width */}
        <div className="lg:col-span-2">
          <div
            onClick={() => handleVideoClick(mainVideo)}
            className="group cursor-pointer"
          >
            {/* Large Thumbnail */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
              <img
                src={mainVideo.thumbnail}
                alt={mainVideo.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              
              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-semibold backdrop-blur-sm">
                {formatDuration(mainVideo.durationSec)}
              </div>
            </div>

            {/* Main Video Title - BELOW thumbnail */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {mainVideo.title}
            </h3>
          </div>
        </div>

        {/* Side Videos Grid - 1/3 width, 2x2 layout */}
        <div className="grid grid-cols-2 gap-4">
          {sideVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className="group cursor-pointer"
            >
              {/* Small Thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
                  {formatDuration(video.durationSec)}
                </div>
              </div>

              {/* Small Video Title - BELOW thumbnail */}
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {video.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* View More Link */}
      {categorySlug && (
        <div className="text-center">
          <button
            onClick={handleViewAll}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition-colors text-lg"
          >
            Voir tous les articles vidéos liés
          </button>
        </div>
      )}
    </section>
  );
}