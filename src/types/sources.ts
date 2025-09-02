export interface NewsSource {
  id: string;
  name: string;
  type: 'rss' | 'youtube' | 'website' | 'api';
  url: string;
  category: string;
  language: 'fr' | 'en';
  verified: boolean;
  active: boolean;
  lastSync?: string;
  videosCount?: number;
  icon?: string;
  description?: string;
  apiKey?: string;
  channelId?: string;
  rssUrl?: string;
}

export interface SourceMetrics {
  sourceId: string;
  videosToday: number;
  videosWeek: number;
  totalViews: number;
  avgViews: number;
  successRate: number;
  lastError?: string;
  uptime: number;
}

export interface VideoImport {
  id: string;
  sourceId: string;
  originalId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  publishedAt: string;
  url: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  language: 'fr' | 'en';
  creator?: {
    name: string;
    channelId?: string;
  };
}