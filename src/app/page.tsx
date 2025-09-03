'use client';

import { useState, useEffect } from 'react';
import { Video, Category } from '@/types';
import { CategoryNavigation } from '@/components/CategoryNavigation';
import { NetflixHero } from '@/components/NetflixHero';
import { NetflixGrid } from '@/components/NetflixGrid';
import { NetflixRow } from '@/components/NetflixRow';
import { useStore } from '@/store/useStore';

export default function HomePage() {
  const { language } = useStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosResponse, categoriesResponse] = await Promise.all([
          fetch('/api/videos?includeFrench=true&limit=50'),
          fetch('/api/categories')
        ]);
        
        if (videosResponse.ok && categoriesResponse.ok) {
          const allVideos = await videosResponse.json();
          const allCategories = await categoriesResponse.json();
          
          setVideos(allVideos);
          setCategories(allCategories);
        } else {
          console.error('API response not ok');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group videos by category
  const videosByCategory = videos.reduce((acc, video) => {
    if (!acc[video.category]) {
      acc[video.category] = [];
    }
    acc[video.category].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  // Get videos for each section
  const getVideosForCategory = (categorySlug: string, fallback: string = '') => {
    return videosByCategory[categorySlug] || videosByCategory[fallback] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <CategoryNavigation />
        <div className="px-4 md:px-8 py-8">
          {/* Hero skeleton */}
          <div className="h-[60vh] md:h-[70vh] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 rounded-lg animate-pulse mb-12" />
          
          {/* Row skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-12">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6 animate-pulse" />
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3 aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const heroVideo = videos.find(v => v.views > 500000) || videos[0];
  
  const sections = [
    {
      title: 'À la une',
      videos: getVideosForCategory('pour-vous', 'france'),
      categorySlug: 'pour-vous'
    },
    {
      title: 'Finale Coupe du Monde Féminine',
      videos: getVideosForCategory('sport', 'sports'),
      categorySlug: 'sport'
    },
    {
      title: 'Le nouveau iPhone',
      videos: getVideosForCategory('technologie', 'technology'),
      categorySlug: 'technologie'
    },
    {
      title: 'Politique française',
      videos: getVideosForCategory('france', 'politics'),
      categorySlug: 'france'
    },
    {
      title: 'Économie mondiale',
      videos: getVideosForCategory('economie', 'economy'),
      categorySlug: 'economie'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <CategoryNavigation />
      
      {/* Netflix Hero Banner */}
      {heroVideo && (
        <NetflixHero video={heroVideo} />
      )}
      
      {/* Content sections */}
      <main className="relative z-10 -mt-32 pt-32">
        <div className="space-y-8 md:space-y-12">
          {/* Main content grids */}
          {sections.map((section, index) => 
            section.videos.length > 0 && (
              <NetflixGrid
                key={section.title}
                title={section.title}
                videos={section.videos}
                categorySlug={section.categorySlug}
              />
            )
          )}

          {/* Additional trending rows */}
          <NetflixRow
            title="Tendances aujourd'hui"
            videos={videos.filter(v => v.views > 100000).slice(0, 8)}
            size="medium"
            viewAllLink="/trending"
          />

          <NetflixRow
            title="Continuer à regarder"
            videos={videos.slice(10, 18)}
            size="small"
          />
        </div>
      </main>
    </div>
  );
}