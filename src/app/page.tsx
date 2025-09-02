'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Clock, Star } from 'lucide-react';
import { Video, Category } from '@/types';
import { VideoCard } from '@/components/VideoCard';
import { CategoryChips } from '@/components/CategoryChips';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { language, rememberCategory } = useStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('recent');

  useEffect(() => {
    rememberCategory('pour-vous');
  }, [rememberCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/videos?includeFrench=true&limit=20&sort=${activeFilter}`),
          fetch('/api/categories')
        ]);
        
        const allVideos = await videosResponse.json();
        const allCategories = await categoriesResponse.json();
        
        setVideos(allVideos);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeFilter]);

  const filters = [
    { id: 'recent', label: 'Récent', icon: Clock, description: 'Dernières actualités' },
    { id: 'popular', label: 'Populaire', icon: TrendingUp, description: 'Plus regardées' },
    { id: 'personalized', label: 'Pour vous', icon: Star, description: 'Personnalisé' },
  ];

  const heroVideo = videos[0];
  const gridVideos = videos.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Category Navigation */}
      <CategoryChips categories={categories} activeCategory="pour-vous" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <h1 className="heading-hero mb-6">
              L'actualité mondiale
              <span className="block text-primary-600 dark:text-primary-400">en vidéo</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Découvrez les dernières actualités du monde entier en format vidéo. 
              Une expérience moderne et immersive pour rester informé.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-3 fill-current" />
                Découvrir les vidéos
              </Button>
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                <TrendingUp className="w-5 h-5 mr-3" />
                Tendances
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-main py-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Actualités en vedette
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {videos.length} vidéos • Mise à jour: {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className="flex items-center space-x-2"
                  title={filter.description}
                >
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Hero Video */}
        {heroVideo && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-16"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                À la une
              </h3>
              <div className="w-16 h-1 bg-primary-500 rounded-full"></div>
            </div>
            <VideoCard 
              video={heroVideo} 
              priority={true} 
              variant="hero"
              index={0}
            />
          </motion.div>
        )}

        {/* Videos Grid */}
        {loading ? (
          <div className="grid-responsive">
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="aspect-video skeleton" />
                <div className="p-6 space-y-4">
                  <div className="skeleton h-6 w-full" />
                  <div className="skeleton h-4 w-3/4" />
                  <div className="flex items-center justify-between">
                    <div className="skeleton h-4 w-1/3" />
                    <div className="flex space-x-2">
                      <div className="skeleton w-8 h-8 rounded-full" />
                      <div className="skeleton w-8 h-8 rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Toutes les actualités
              </h3>
              <div className="w-16 h-1 bg-primary-500 rounded-full"></div>
            </div>
            
            <div className="grid-responsive">
              {gridVideos.map((video, index) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  index={index + 1}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Load More */}
        {!loading && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <Button variant="secondary" size="lg" className="px-12 py-4 text-lg">
              Charger plus de vidéos
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}