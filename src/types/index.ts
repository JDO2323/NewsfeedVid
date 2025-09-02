export type Source = 'youtube' | 'vimeo' | 'dailymotion' | 'rss' | 'creator';
export type DurationBucket = 'short' | 'medium' | 'long';
export type Language = 'en' | 'fr';

export interface Creator {
  id: string;
  name: string;
  avatar?: string;
  subscriberCount?: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  dynamicTags: string[];
  source: Source;
  url: string;
  thumbnail: string;
  durationSec: number;
  publishedAt: string;
  views: number;
  language: Language;
  visible: boolean;
  creator?: Creator;
  likes?: number;
  comments?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  isDynamic: boolean;
  icon?: string;
}

export interface UserPreferences {
  language: Language;
  theme: 'light' | 'dark' | 'system';
  subscriptions: string[];
  lastViewedCategories: string[];
  likedVideos: string[];
}

export interface SearchFilters {
  query: string;
  category?: string;
  duration?: DurationBucket;
  source?: Source;
  language?: Language;
  dateRange?: 'today' | 'week' | 'month';
}