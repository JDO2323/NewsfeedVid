import { NextRequest, NextResponse } from 'next/server';
import { MOCK_VIDEOS } from '@/lib/mockData';
import { videoAggregator } from '@/lib/videoAggregator';
import { FRENCH_NEWS_SOURCES } from '@/lib/frenchNewsSources';
import { filterVideosByFreshness, ensureMinimumVideos, durationBucket } from '@/lib/videoUtils';
import { Video, DurationBucket, Source } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const sort = searchParams.get('sort') || 'recent';
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  const duration = searchParams.get('duration') as DurationBucket;
  const source = searchParams.get('source') as Source;
  const language = searchParams.get('language');
  const exclude = searchParams.get('exclude');
  const subscriptions = searchParams.get('subscriptions')?.split(',') || [];
  const lastViewed = searchParams.get('lastViewed')?.split(',') || [];
  const includeFrench = searchParams.get('includeFrench') === 'true';

  let freshVideos = filterVideosByFreshness(MOCK_VIDEOS);

  // Intégrer les vidéos françaises si demandé
  if (includeFrench) {
    try {
      const frenchVideos = await videoAggregator.aggregateAllSources();
      const convertedVideos: Video[] = frenchVideos
        .filter(v => v.status === 'approved')
        .map(v => ({
          id: v.id,
          title: v.title,
          description: v.description,
          category: v.tags.includes('politics') ? 'politics' : 
                   v.tags.includes('economy') ? 'economy' : 
                   v.tags.includes('sports') ? 'sports' : 'culture',
          dynamicTags: v.tags,
          source: v.sourceId.includes('youtube') ? 'youtube' as Source : 'rss' as Source,
          url: v.url,
          thumbnail: v.thumbnail,
          durationSec: v.duration,
          publishedAt: v.publishedAt,
          views: Math.floor(Math.random() * 100000) + 1000,
          language: v.language,
          visible: true,
          creator: v.creator ? {
            id: v.creator.channelId || v.sourceId,
            name: v.creator.name,
            subscriberCount: Math.floor(Math.random() * 500000) + 10000,
          } : undefined,
          likes: Math.floor(Math.random() * 5000) + 100,
          comments: Math.floor(Math.random() * 1000) + 50,
        }));
      
      freshVideos = [...convertedVideos, ...freshVideos];
    } catch (error) {
      console.error('Error fetching French videos:', error);
    }
  }

  // Apply filters
  if (category) {
    // Support both old format (politics, economy, etc) and new Google News format
    freshVideos = freshVideos.filter(v => 
      v.category === category || 
      (category === 'politics' && v.category === 'france') ||
      (category === 'economy' && v.category === 'economie') ||
      (category === 'sports' && v.category === 'sport') ||
      (category === 'technology' && v.category === 'technologie') ||
      (category === 'entertainment' && v.category === 'divertissement') ||
      (category === 'health' && v.category === 'sante')
    );
  }

  if (query) {
    const searchLower = query.toLowerCase();
    freshVideos = freshVideos.filter(v => 
      v.title.toLowerCase().includes(searchLower) ||
      v.description.toLowerCase().includes(searchLower) ||
      v.dynamicTags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      v.creator?.name.toLowerCase().includes(searchLower)
    );
  }

  if (duration) {
    freshVideos = freshVideos.filter(v => durationBucket(v.durationSec) === duration);
  }

  if (source) {
    freshVideos = freshVideos.filter(v => v.source === source);
  }

  if (language) {
    freshVideos = freshVideos.filter(v => v.language === language);
  }

  if (exclude) {
    freshVideos = freshVideos.filter(v => v.id !== exclude);
  }

  // Ensure minimum videos for categories (auto-backfill)
  if (category) {
    freshVideos = ensureMinimumVideos(freshVideos, filterVideosByFreshness(MOCK_VIDEOS));
  }

  // Sort videos
  switch (sort) {
    case 'popular':
      freshVideos.sort((a, b) => b.views - a.views);
      break;
    case 'personalized':
      // Mock personalization: prioritize subscribed categories and last viewed
      freshVideos.sort((a, b) => {
        const aScore = (subscriptions.includes(a.category) ? 100 : 0) + 
                      (lastViewed.includes(a.category) ? 50 : 0) + 
                      (a.views / 10000);
        const bScore = (subscriptions.includes(b.category) ? 100 : 0) + 
                      (lastViewed.includes(b.category) ? 50 : 0) + 
                      (b.views / 10000);
        return bScore - aScore;
      });
      break;
    case 'recent':
    default:
      freshVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      break;
  }

  // Apply pagination
  const paginatedVideos = freshVideos.slice(offset, offset + limit);

  return NextResponse.json(paginatedVideos);
}