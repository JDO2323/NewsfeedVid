'use client';

import { useState, useEffect } from 'react';
import { Video, Category } from '@/types';
import { CategoryNavigation } from '@/components/CategoryNavigation';
import { NewsSection } from '@/components/NewsSection';
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CategoryNavigation />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="space-y-20">
            {/* Loading skeletons */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-8">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mt-4 w-3/4 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j}>
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-3 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CategoryNavigation />
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-20">
          {sections.map((section, index) => (
            section.videos.length > 0 && (
              <NewsSection
                key={section.title}
                title={section.title}
                videos={section.videos}
                categorySlug={section.categorySlug}
              />
            )
          ))}
        </div>
      </main>
    </div>
  );
}