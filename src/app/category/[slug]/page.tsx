'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Filter, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Video } from '@/types';
import { VideoGrid } from '@/components/VideoGrid/VideoGrid';
import { CategoryNavigation } from '@/components/Layout/CategoryNavigation';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/lib/mockData';
import clsx from 'clsx';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { language, rememberCategory } = useStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const categorySlug = params.slug as string;
  const category = CATEGORIES.find(cat => cat.slug === categorySlug);

  useEffect(() => {
    if (categorySlug) {
      rememberCategory(categorySlug);
    }
  }, [categorySlug, rememberCategory]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          category: categorySlug,
          includeFrench: 'true',
        });

        const response = await fetch(`/api/videos?${queryParams}`);
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [categorySlug]);

  const getCategoryDisplayName = () => {
    const category = CATEGORIES.find(cat => cat.slug === categorySlug);
    return category ? `${category.icon} ${category.name}` : categorySlug.replace('-', ' ');
  };

  return (
    <div className="min-h-screen bg-google-gray-50 dark:bg-dark-bg">
      {/* Category Navigation */}
      <CategoryNavigation />

      <div className="container-main py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-google-gray-600 dark:text-dark-text-secondary hover:text-google-blue mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Retour à l'accueil</span>
        </motion.button>
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="heading-1 mb-2">
            {getCategoryDisplayName()}
          </h1>
          <p className="text-body text-google-gray-600 dark:text-dark-text-secondary">
            {videos.length} vidéos • Dernière mise à jour: {new Date().toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Videos Grid */}
        <VideoGrid 
          videos={videos} 
          loading={loading}
          showHero={videos.length > 0}
        />
      </div>
    </div>
  );
}