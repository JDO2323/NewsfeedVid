import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rssUrl = searchParams.get('url');

  if (!rssUrl) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
  }

  try {
    // En production, utiliser un vrai parser RSS
    // Pour la démo, retourner des données mockées
    const mockRSSData = {
      title: 'French News Feed',
      items: [
        {
          title: 'Actualité politique: Nouveau gouvernement annoncé',
          description: 'Le Premier ministre a annoncé la composition du nouveau gouvernement...',
          link: 'https://example.com/news/1',
          pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          enclosure: {
            url: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000) + 1000000}/pexels-photo-${Math.floor(Math.random() * 1000000) + 1000000}.jpeg?auto=compress&cs=tinysrgb&w=640&h=360`,
            type: 'image/jpeg'
          }
        },
        {
          title: 'Économie: Les marchés en hausse',
          description: 'Les indices boursiers français affichent une progression...',
          link: 'https://example.com/news/2',
          pubDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          enclosure: {
            url: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000) + 2000000}/pexels-photo-${Math.floor(Math.random() * 1000000) + 2000000}.jpeg?auto=compress&cs=tinysrgb&w=640&h=360`,
            type: 'image/jpeg'
          }
        }
      ]
    };

    return NextResponse.json(mockRSSData);
  } catch (error) {
    console.error('RSS proxy error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch RSS feed',
      message: error.message 
    }, { status: 500 });
  }
}