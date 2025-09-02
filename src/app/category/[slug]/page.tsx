'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Grid3X3, List, Filter, ChevronRight } from 'lucide-react';
import { Video } from '@/types';
import { VideoGrid } from '@/components/VideoGrid';
import { CategorySection } from '@/components/CategorySection';
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { FiltersBar } from '@/components/FiltersBar';
import { useStore } from '@/store/useStore';
import { MOCK_VIDEOS, CATEGORIES } from '@/lib/mockData';
import clsx from 'clsx';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { language, rememberCategory } = useStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showFullCoverage, setShowFullCoverage] = useState(false);

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
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
          ),
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
  }, [categorySlug, filters]);

  // Get category display name
  const getCategoryDisplayName = () => {
    const category = CATEGORIES.find(cat => cat.slug === categorySlug);
    return category ? `${category.icon} ${category.name}` : categorySlug.replace('-', ' ');
  };

  const getCategoryGradient = () => {
    const gradients = {
      'pour-vous': 'from-purple-600 via-purple-700 to-gray-900',
      'actualite-locale': 'from-indigo-600 via-indigo-700 to-gray-900',
      'france': 'from-blue-600 via-blue-700 to-gray-900',
      'monde': 'from-green-600 via-green-700 to-gray-900',
      'economie': 'from-orange-600 via-orange-700 to-gray-900',
      'science': 'from-cyan-600 via-cyan-700 to-gray-900',
      'sante': 'from-emerald-600 via-emerald-700 to-gray-900',
      'technologie': 'from-purple-600 via-purple-700 to-gray-900',
      'culture': 'from-pink-600 via-pink-700 to-gray-900',
      'sport': 'from-green-600 via-green-700 to-gray-900',
      'divertissement': 'from-yellow-600 via-orange-600 to-gray-900',
      politics: 'from-news-primary via-blue-800 to-netflix-charcoal',
      economy: 'from-news-economy via-orange-700 to-netflix-charcoal',
      sports: 'from-green-600 via-green-700 to-netflix-charcoal',
      technology: 'from-purple-600 via-purple-700 to-netflix-charcoal',
      culture: 'from-pink-600 via-pink-700 to-netflix-charcoal',
      entertainment: 'from-yellow-600 via-orange-600 to-netflix-charcoal',
      health: 'from-emerald-600 via-emerald-700 to-netflix-charcoal',
      science: 'from-cyan-600 via-cyan-700 to-netflix-charcoal',
      environment: 'from-green-700 via-green-800 to-netflix-charcoal',
    };
    
    return gradients[categorySlug as keyof typeof gradients] || 'from-gray-700 via-gray-800 to-netflix-charcoal';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Netflix-style hero header */}
      <div className="relative h-96 overflow-hidden">
        <div className={clsx("absolute inset-0 bg-gradient-to-br", getCategoryGradient())} />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent" />
        
        <div className="relative h-full flex items-center">
          <div className="max-w-[1920px] mx-auto px-4 lg:px-12 w-full">
            <div className="flex items-center justify-between">
              <div className="space-y-6">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Retour</span>
                </button>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                        {getCategoryDisplayName()}
                      </h1>
                      <p className="text-lg text-gray-300 mt-2">
                        Actualités fraîches des 7 derniers jours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-news-live rounded-full animate-pulse" />
                      <span className="font-medium">Contenu vérifié</span>
                    </div>
                    <span>•</span>
                    <span>{videos.length} vidéos disponibles</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex flex-col space-y-4">
                <button
                  onClick={() => router.push(`/shorts/${categorySlug}`)}
                  className="btn-netflix flex items-center space-x-3"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Mode Immersif</span>
                </button>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-netflix-secondary flex items-center space-x-3"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filtres</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Breadcrumbs />
        {/* Controls */}
        <div className="relative -mt-16 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 z-10 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setShowFullCoverage(!showFullCoverage)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  <span>{showFullCoverage ? 'Vue par défaut' : 'Couverture complète'}</span>
                  <ChevronRight className={clsx('w-4 h-4 transition-transform', showFullCoverage && 'rotate-90')} />
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={clsx(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 border',
                    showFilters
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  )}
                >
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filtres</span>
                </button>

                {!showFullCoverage && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={clsx(
                        'p-2 rounded-md transition-all duration-200',
                        viewMode === 'grid' 
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={clsx(
                        'p-2 rounded-md transition-all duration-200',
                        viewMode === 'list' 
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-4">
              <span>Dernière mise à jour: {new Date().toLocaleTimeString()}</span>
              <span>•</span>
              <span>{videos.length} vidéos disponibles</span>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-12 animate-slide-up">
            <FiltersBar 
              activeFilters={filters}
              onFilterChange={setFilters}
            />
          </div>
        )}

        {/* Videos */}
        {showFullCoverage ? (
          <VideoGrid 
            videos={videos} 
            loading={loading} 
            variant="default"
            size={viewMode === 'list' ? 'sm' : 'md'}
            showFeatured={true}
          />
        ) : (
          <CategorySection
            title={getCategoryDisplayName()}
            videos={videos}
            categorySlug={categorySlug}
            showAll={true}
          />
        )}
      </div>
    </div>
  );
}