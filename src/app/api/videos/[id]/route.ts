import { NextRequest, NextResponse } from 'next/server';
import { MOCK_VIDEOS } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const video = MOCK_VIDEOS.find(v => v.id === params.id);
  
  if (!video) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }

  return NextResponse.json(video);
}