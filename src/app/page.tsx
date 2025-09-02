'use client';

import { useState, useEffect } from 'react';
import { Video, Category } from '@/types';
import { CategorySection } from '@/components/CategorySection';
import { CategoryChips } from '@/components/CategoryChips';
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { useStore } from '@/store/useStore';

export default function HomePage() {
  const { language } = useStore();
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [categorizedVideos, setCategorizedVideos] = useState<Record<string, Video[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, videosResponse] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/videos?includeFrench=true&limit=100')
        ]);

        const categories = await categoriesResponse.json();
        const allVideos = await videosResponse.json();

        // Group videos by category
        const grouped = categories.reduce((acc: Record<string, Video[]>, category: Category) => {
          const categoryVideos = allVideos.filter((video: Video) => video.category === category.slug);
          if (categoryVideos.length > 0) {
            acc[category.slug] = categoryVideos;
          }
          return acc;
        }, {});

        setCategoriesData(categories.filter((cat: Category) => !cat.isDynamic));
        setCategorizedVideos(grouped);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Loading categories */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <div className="news-layout">
            <div className="flex space-x-2 py-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Loading content */}
        <div className="news-layout py-8">
          <div className="space-y-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="news-section space-y-6">
                <div className="flex items-center justify-between">
                  <div className="skeleton h-6 w-32" />
                  <div className="skeleton h-4 w-24" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="skeleton aspect-video rounded-lg" />
                    <div className="skeleton h-6 w-full" />
                    <div className="skeleton h-4 w-3/4" />
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex items-start space-x-3">
                        <div className="skeleton w-16 h-12 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="skeleton h-5 w-full" />
                          <div className="skeleton h-4 w-2/3" />
                        </div>
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

  return (
    <div className="min-h-screen">
      {/* Categories Navigation - Google News style */}
      <CategoryChips 
        categories={categoriesData}
        activeCategory="pour-vous"
      />

      {/* Content - Google News layout */}
      <div className="news-layout py-8">
        <Breadcrumbs />
        <div className="space-y-8">
          {/* Pour vous section */}
          {categorizedVideos['pour-vous'] && (
            <CategorySection
              title="Pour vous"
              videos={categorizedVideos['pour-vous']}
              categorySlug="pour-vous"
              icon="⭐"
            />
          )}

          {/* Actualité locale */}
          {categorizedVideos['actualite-locale'] && (
            <CategorySection
              title="Actualité locale"
              videos={categorizedVideos['actualite-locale']}
              categorySlug="actualite-locale"
              icon="📍"
            />
          )}

          {/* France */}
          {categorizedVideos['france'] && (
            <CategorySection
              title="France"
              videos={categorizedVideos['france']}
              categorySlug="france"
              icon="🇫🇷"
            />
          )}

          {/* Monde */}
          {categorizedVideos['monde'] && (
            <CategorySection
              title="Monde"
              videos={categorizedVideos['monde']}
              categorySlug="monde"
              icon="🌍"
            />
          )}

          {/* Économie */}
          {categorizedVideos['economie'] && (
            <CategorySection
              title="Économie"
              videos={categorizedVideos['economie']}
              categorySlug="economie"
              icon="💼"
            />
          )}

          {/* Science */}
          {categorizedVideos['science'] && (
            <CategorySection
              title="Science"
              videos={categorizedVideos['science']}
              categorySlug="science"
              icon="🔬"
            />
          )}

          {/* Santé */}
          {categorizedVideos['sante'] && (
            <CategorySection
              title="Santé"
              videos={categorizedVideos['sante']}
              categorySlug="sante"
              icon="🏥"
            />
          )}

          {/* Technologie */}
          {categorizedVideos['technologie'] && (
            <CategorySection
              title="Technologie"
              videos={categorizedVideos['technologie']}
              categorySlug="technologie"
              icon="💻"
            />
          )}

          {/* Culture */}
          {categorizedVideos['culture'] && (
            <CategorySection
              title="Culture"
              videos={categorizedVideos['culture']}
              categorySlug="culture"
              icon="🎭"
            />
          )}

          {/* Sport */}
          {categorizedVideos['sport'] && (
            <CategorySection
              title="Sport"
              videos={categorizedVideos['sport']}
              categorySlug="sport"
              icon="⚽"
            />
          )}

          {/* Divertissement */}
          {categorizedVideos['divertissement'] && (
            <CategorySection
              title="Divertissement"
              videos={categorizedVideos['divertissement']}
              categorySlug="divertissement"
              icon="🎬"
            />
          )}
        </div>
      </div>
    </div>
  );
}