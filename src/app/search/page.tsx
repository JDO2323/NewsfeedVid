'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Video } from '@/types';
import { VideoGrid } from '@/components/VideoGrid';
import { FiltersBar } from '@/components/FiltersBar';
import { EmptyState } from '@/components/EmptyState';
import { useStore } from '@/store/useStore';
import { t } from '@/lib/i18n';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { language } = useStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});

  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'recent';

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          q: query,
          sort,
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
  }, [query, sort, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <Search className="w-8 h-8 text-primary-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {query ? `Search results for "${query}"` : 'Search Videos'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {videos.length} videos found
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FiltersBar 
          activeFilters={filters}
          onFilterChange={setFilters}
        />
      </div>

      {/* Results */}
      {loading ? (
        <VideoGrid videos={[]} loading={true} />
      ) : videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState
          title={t('noResults', language)}
          description="Try adjusting your search terms or filters"
          action={{
            label: 'Clear filters',
            onClick: () => setFilters({})
          }}
        />
      )}
    </div>
  );
}