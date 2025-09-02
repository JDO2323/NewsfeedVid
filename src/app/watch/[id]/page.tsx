'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Share, MessageCircle, Eye, Clock, ArrowLeft, Play } from 'lucide-react';
import { Video } from '@/types';
import { SuggestionsRail } from '@/components/SuggestionsRail';
import { SubscribeButton } from '@/components/SubscribeButton';
import { useStore } from '@/store/useStore';
import { formatViewCount, formatRelativeTime } from '@/lib/videoUtils';
import clsx from 'clsx';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { language, likedVideos, likeVideo } = useStore();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const videoId = params.id as string;
  const isLiked = video ? likedVideos.includes(video.id) : false;

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const [videoResponse, relatedResponse] = await Promise.all([
          fetch(`/api/videos/${videoId}`),
          fetch(`/api/videos?limit=15&exclude=${videoId}&includeFrench=true`)
        ]);

        const videoData = await videoResponse.json();
        const relatedData = await relatedResponse.json();

        setVideo(videoData);
        setRelatedVideos(relatedData);
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-12 py-8">
          <div className="animate-pulse space-y-6">
            <div className="aspect-video bg-gray-800 rounded-xl shimmer-netflix" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-800 rounded w-3/4 shimmer-netflix" />
              <div className="h-4 bg-gray-800 rounded w-1/2 shimmer-netflix" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Vidéo introuvable</h1>
          <button
            onClick={() => router.push('/')}
            className="btn-netflix"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Retour</span>
            </button>

            {/* Video player */}
            <div className="relative aspect-video bg-netflix-charcoal rounded-xl overflow-hidden shadow-netflix-lg">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-netflix-black hover:scale-110 transition-transform duration-300 shadow-netflix-lg">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
              </div>
            </div>

            {/* Video details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-4">
                  {video.title}
                </h1>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatViewCount(video.views)} vues</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatRelativeTime(video.publishedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => likeVideo(video.id)}
                      className={clsx(
                        'flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300',
                        isLiked
                          ? 'bg-news-urgent text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      )}
                    >
                      <Heart className={clsx('w-4 h-4', isLiked && 'fill-current')} />
                      <span>{video.likes ? formatViewCount(video.likes) : 0}</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 hover:text-white transition-all duration-300">
                      <Share className="w-4 h-4" />
                      <span>Partager</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Creator info */}
              {video.creator && (
                <div className="flex items-center justify-between p-6 glass-netflix rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-news-primary to-news-urgent rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {video.creator.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {video.creator.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {video.creator.subscriberCount ? formatViewCount(video.creator.subscriberCount) : '0'} abonnés
                      </p>
                    </div>
                  </div>
                  <SubscribeButton targetId={video.creator.id} />
                </div>
              )}

              {/* Description */}
              <div className="glass-netflix rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed">
                  {video.description}
                </p>
              </div>

              {/* Tags */}
              {video.dynamicTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.dynamicTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => router.push(`/search?q=${tag}`)}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full hover:bg-gray-600 hover:text-white transition-colors duration-200"
                    >
                      #{tag.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar with related videos */}
          <div className="lg:col-span-1">
            <SuggestionsRail 
              videos={relatedVideos}
              title="Vidéos similaires"
            />
          </div>
        </div>
      </div>
    </div>
  );
}