import { Video, DurationBucket } from '@/types';

export const isFresh = (iso: string): boolean => {
  const pub = new Date(iso).getTime();
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - pub <= sevenDays;
};

export const durationBucket = (sec: number): DurationBucket => {
  if (sec < 300) return 'short';
  if (sec <= 1200) return 'medium';
  return 'long';
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatRelativeTime = (iso: string): string => {
  const now = new Date();
  const published = new Date(iso);
  const diffMs = now.getTime() - published.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

export const filterVideosByFreshness = (videos: Video[]): Video[] => {
  return videos.filter(video => isFresh(video.publishedAt) && video.visible);
};

export const ensureMinimumVideos = (videos: Video[], allVideos: Video[], minCount = 12): Video[] => {
  if (videos.length >= minCount) return videos;
  
  const additionalVideos = allVideos
    .filter(v => !videos.find(existing => existing.id === v.id))
    .sort((a, b) => b.views - a.views)
    .slice(0, minCount - videos.length);
    
  return [...videos, ...additionalVideos];
};

export const formatViewCount = (views: number): string => {
  if (views < 1000) return views.toString();
  if (views < 1000000) return `${Math.floor(views / 1000)}K`;
  return `${Math.floor(views / 1000000)}M`;
};