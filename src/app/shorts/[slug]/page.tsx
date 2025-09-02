'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Video } from '@/types';
import { ShortsViewer } from '@/components/ShortsViewer';

export default function ShortsPage() {
  const params = useParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const categorySlug = params.slug as string;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`/api/videos?category=${categorySlug}&sort=recent`);
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading shorts...</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-lg">No videos found</div>
      </div>
    );
  }

  return (
    <ShortsViewer 
      videos={videos} 
      categorySlug={categorySlug}
    />
  );
}