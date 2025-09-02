import { NextResponse } from 'next/server';
import { FRENCH_NEWS_SOURCES } from '@/lib/frenchNewsSources';

export async function GET() {
  return NextResponse.json(FRENCH_NEWS_SOURCES);
}

export async function POST(request: Request) {
  const { sourceId, active } = await request.json();
  
  const source = FRENCH_NEWS_SOURCES.find(s => s.id === sourceId);
  if (!source) {
    return NextResponse.json({ error: 'Source not found' }, { status: 404 });
  }

  source.active = active;
  source.lastSync = new Date().toISOString();
  
  return NextResponse.json({ success: true, source });
}