'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Category } from '@/types';
import { VideoGrid } from '@/components/VideoGrid/VideoGrid';
import { CategoryNavigation } from '@/components/Layout/CategoryNavigation';
import { useStore } from '@/store/useStore';

export default function HomePage() {
  const { language, rememberCategory } = useStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('recent');

  useEffect(() => {
    rememberCategory('pour-vous');
  }, [rememberCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/videos?includeFrench=true&limit=20&sort=${activeFilter}`);
        const allVideos = await response.json();
        setVideos(allVideos);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeFilter]);

  const filters = [
    { id: 'recent', label: 'Récent', description: 'Les dernières actualités' },
    { id: 'popular', label: 'Populaire', description: 'Le plus regardé' },
    { id: 'personalized', label: 'Pour vous', description: 'Personnalisé' },
  ];

  return (
    <div className="min-h-screen bg-google-gray-50 dark:bg-dark-bg">
      {/* Category Navigation */}
      <CategoryNavigation />

      <div className="container-main py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="heading-1 mb-2">Actualités en vidéo</h1>
          <p className="text-body text-google-gray-600 dark:text-dark-text-secondary">
            Découvrez les dernières actualités du monde entier en format vidéo
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-1 p-1 bg-google-gray-100 dark:bg-dark-surface rounded-lg w-fit">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-white dark:bg-google-gray-700 text-google-blue shadow-sm'
                    : 'text-google-gray-600 dark:text-dark-text-secondary hover:text-google-gray-900 dark:hover:text-dark-text-primary'
                }`}
                title={filter.description}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Videos Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <VideoGrid 
            videos={videos} 
            loading={loading}
            showHero={true}
          />
        </motion.div>

        {/* Infinite scroll trigger could go here */}
        {!loading && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 py-8"
          >
            <button className="btn-secondary">
              Charger plus de vidéos
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}