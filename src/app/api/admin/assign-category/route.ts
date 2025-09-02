import { NextRequest, NextResponse } from 'next/server';
import { MOCK_VIDEOS } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  const { id, category } = await request.json();
  
  const video = MOCK_VIDEOS.find(v => v.id === id);
  
  if (!video) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }

  video.category = category;
  
  return NextResponse.json({ success: true });
}