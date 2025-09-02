import { NextRequest, NextResponse } from 'next/server';
import { videoAggregator } from '@/lib/videoAggregator';
import { FRENCH_NEWS_SOURCES } from '@/lib/frenchNewsSources';

export async function POST(request: NextRequest) {
  const { sourceId } = await request.json();

  try {
    if (sourceId) {
      // Synchronisation d'une source spécifique
      const source = FRENCH_NEWS_SOURCES.find(s => s.id === sourceId);
      if (!source) {
        return NextResponse.json({ error: 'Source not found' }, { status: 404 });
      }

      let videos = [];
      switch (source.type) {
        case 'youtube':
          videos = await videoAggregator.fetchFromYouTube(source);
          break;
        case 'rss':
          videos = await videoAggregator.fetchFromRSS(source);
          break;
      }

      return NextResponse.json({ 
        success: true, 
        source: source.name,
        videosImported: videos.length,
        videos 
      });
    } else {
      // Synchronisation de toutes les sources
      const allVideos = await videoAggregator.aggregateAllSources();
      
      return NextResponse.json({ 
        success: true,
        totalSources: FRENCH_NEWS_SOURCES.filter(s => s.active).length,
        totalVideos: allVideos.length,
        metrics: videoAggregator.getAllMetrics()
      });
    }
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ 
      error: 'Sync failed',
      message: error.message 
    }, { status: 500 });
  }
}