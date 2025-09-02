import { Video, Source } from '@/types';
import { VideoImport, NewsSource, SourceMetrics } from '@/types/sources';
import { FRENCH_NEWS_SOURCES } from './frenchNewsSources';

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      medium: { url: string };
      high: { url: string };
    };
    channelTitle: string;
    channelId: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
  };
}

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  enclosure?: {
    url: string;
    type: string;
  };
}

export class VideoAggregator {
  private apiKeys: Map<string, string> = new Map();
  private metrics: Map<string, SourceMetrics> = new Map();

  constructor() {
    // En production, ces clés seraient dans les variables d'environnement
    this.apiKeys.set('youtube', process.env.YOUTUBE_API_KEY || 'demo-key');
  }

  // 📺 YouTube Data API Integration
  async fetchFromYouTube(source: NewsSource, maxResults = 25): Promise<VideoImport[]> {
    if (!source.channelId) {
      throw new Error(`No channel ID configured for ${source.name}`);
    }

    const apiKey = this.apiKeys.get('youtube');
    if (!apiKey || apiKey === 'demo-key') {
      // Mode démo avec données simulées
      return this.generateMockVideosForSource(source, maxResults);
    }

    try {
      // Récupération des vidéos récentes (7 derniers jours)
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
        `key=${apiKey}&channelId=${source.channelId}&part=snippet&order=date&type=video&` +
        `maxResults=${maxResults}&publishedAfter=${this.getSevenDaysAgo()}`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData.items) {
        throw new Error(`No videos found for ${source.name}`);
      }

      // Récupération des détails des vidéos
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
        `key=${apiKey}&id=${videoIds}&part=snippet,contentDetails,statistics`;

      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      return detailsData.items.map((video: YouTubeVideo) => this.mapYouTubeVideo(video, source));
    } catch (error) {
      console.error(`Error fetching from YouTube for ${source.name}:`, error);
      this.updateMetrics(source.id, { successRate: 0, lastError: error.message });
      return [];
    }
  }

  // 📡 RSS Feed Integration
  async fetchFromRSS(source: NewsSource, maxResults = 15): Promise<VideoImport[]> {
    if (!source.rssUrl) {
      throw new Error(`No RSS URL configured for ${source.name}`);
    }

    try {
      // En production, utiliser un proxy CORS ou un service backend
      const response = await fetch(`/api/rss-proxy?url=${encodeURIComponent(source.rssUrl)}`);
      const rssData = await response.json();

      return rssData.items
        .slice(0, maxResults)
        .filter((item: RSSItem) => this.isRecentArticle(item.pubDate))
        .map((item: RSSItem) => this.mapRSSItem(item, source));
    } catch (error) {
      console.error(`Error fetching RSS for ${source.name}:`, error);
      return this.generateMockVideosForSource(source, Math.min(maxResults, 5));
    }
  }

  // 🔄 Aggregation complète
  async aggregateAllSources(): Promise<VideoImport[]> {
    const allVideos: VideoImport[] = [];
    const activeSource = FRENCH_NEWS_SOURCES.filter(s => s.active);

    const promises = activeSource.map(async (source) => {
      try {
        let videos: VideoImport[] = [];
        
        switch (source.type) {
          case 'youtube':
            videos = await this.fetchFromYouTube(source);
            break;
          case 'rss':
            videos = await this.fetchFromRSS(source);
            break;
          default:
            videos = this.generateMockVideosForSource(source, 10);
        }

        // Mise à jour des métriques
        this.updateMetrics(source.id, {
          videosToday: videos.filter(v => this.isToday(v.publishedAt)).length,
          videosWeek: videos.length,
          successRate: videos.length > 0 ? 100 : 0,
        });

        return videos;
      } catch (error) {
        console.error(`Error aggregating from ${source.name}:`, error);
        this.updateMetrics(source.id, { 
          successRate: 0, 
          lastError: error.message,
          videosToday: 0,
          videosWeek: 0
        });
        return [];
      }
    });

    const results = await Promise.allSettled(promises);
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allVideos.push(...result.value);
      }
    });

    return allVideos;
  }

  // 🛠️ Utility Methods
  private mapYouTubeVideo(video: YouTubeVideo, source: NewsSource): VideoImport {
    return {
      id: `yt_${video.id.videoId}`,
      sourceId: source.id,
      originalId: video.id.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url,
      duration: this.parseDuration(video.contentDetails.duration),
      publishedAt: video.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      tags: [],
      status: 'pending',
      language: source.language,
      creator: {
        name: video.snippet.channelTitle,
        channelId: video.snippet.channelId,
      },
    };
  }

  private mapRSSItem(item: RSSItem, source: NewsSource): VideoImport {
    return {
      id: `rss_${source.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sourceId: source.id,
      originalId: item.link,
      title: item.title,
      description: item.description,
      thumbnail: item.enclosure?.url || `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000) + 1000000}/pexels-photo-${Math.floor(Math.random() * 1000000) + 1000000}.jpeg?auto=compress&cs=tinysrgb&w=640&h=360`,
      duration: Math.floor(Math.random() * 600) + 120, // 2-12 minutes
      publishedAt: new Date(item.pubDate).toISOString(),
      url: item.link,
      tags: [],
      status: 'pending',
      language: source.language,
      creator: {
        name: source.name,
      },
    };
  }

  private parseDuration(duration: string): number {
    // Parse ISO 8601 duration (PT4M13S -> 253 seconds)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  private getSevenDaysAgo(): string {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString();
  }

  private isRecentArticle(pubDate: string): boolean {
    const articleDate = new Date(pubDate);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return articleDate >= sevenDaysAgo;
  }

  private isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private updateMetrics(sourceId: string, updates: Partial<SourceMetrics>) {
    const existing = this.metrics.get(sourceId) || {
      sourceId,
      videosToday: 0,
      videosWeek: 0,
      totalViews: 0,
      avgViews: 0,
      successRate: 100,
      uptime: 100
    };

    this.metrics.set(sourceId, { ...existing, ...updates });
  }

  public getMetrics(sourceId: string): SourceMetrics | undefined {
    return this.metrics.get(sourceId);
  }

  public getAllMetrics(): SourceMetrics[] {
    return Array.from(this.metrics.values());
  }

  // 🎯 Mock data pour la démo
  private generateMockVideosForSource(source: NewsSource, count: number): VideoImport[] {
    const titles = {
      politics: [
        'Débat à l\'Assemblée: Nouvelle loi sur le climat',
        'Interview exclusive: Le ministre répond aux critiques',
        'Manifestations: Les syndicats mobilisés',
        'Élections européennes: Analyse des résultats',
        'Réforme des retraites: Les dernières négociations'
      ],
      economy: [
        'CAC 40: Forte hausse des valeurs tech',
        'Inflation: Impact sur le pouvoir d\'achat',
        'Start-up françaises: Levées de fonds record',
        'Commerce international: Nouveaux accords',
        'Immobilier: Évolution des prix en région'
      ],
      sports: [
        'Roland Garros: Résultats des quarts de finale',
        'Équipe de France: Préparation pour l\'Euro',
        'Ligue 1: Classement après la 30e journée',
        'JO 2024: Préparatifs des athlètes français',
        'Rugby: Victoire du XV de France'
      ],
      culture: [
        'Festival de Cannes: Palme d\'or 2024',
        'Théâtre: Nouvelle pièce de succès',
        'Musique: Album surprise d\'un artiste français',
        'Patrimoine: Restauration de monument historique',
        'Art contemporain: Exposition majeure au Louvre'
      ],
      science: [
        'Recherche française: Découverte majeure en médecine',
        'Climat: Nouvelles données scientifiques',
        'Espace: Mission française vers Mars',
        'Innovation: Nouvelle technologie révolutionnaire',
        'Santé: Avancée dans le traitement du cancer'
      ]
    };

    const categoryTitles = titles[source.category as keyof typeof titles] || titles.politics;
    const results: VideoImport[] = [];

    for (let i = 0; i < count; i++) {
      const title = categoryTitles[i % categoryTitles.length];
      const hoursAgo = Math.floor(Math.random() * 168); // 7 jours
      const publishedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

      results.push({
        id: `mock_${source.id}_${i}`,
        sourceId: source.id,
        originalId: `original_${i}`,
        title: `${title} - ${source.name}`,
        description: `Reportage exclusif de ${source.name} sur ${title.toLowerCase()}. Analysis approfondie avec des experts et témoignages directs.`,
        thumbnail: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000) + 1000000}/pexels-photo-${Math.floor(Math.random() * 1000000) + 1000000}.jpeg?auto=compress&cs=tinysrgb&w=640&h=360`,
        duration: Math.floor(Math.random() * 900) + 180, // 3-18 minutes
        publishedAt: publishedAt.toISOString(),
        url: source.type === 'youtube' ? `https://www.youtube.com/watch?v=demo_${i}` : source.url,
        tags: [source.category, 'france', 'actualité'],
        status: 'approved',
        language: 'fr',
        creator: {
          name: source.name,
          channelId: source.channelId,
        },
      });
    }

    return results;
  }
}

// Instance globale
export const videoAggregator = new VideoAggregator();