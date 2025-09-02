import { NextResponse } from 'next/server';
import { CATEGORIES, getDynamicCategories, MOCK_VIDEOS } from '@/lib/mockData';
import { filterVideosByFreshness } from '@/lib/videoUtils';

export async function GET() {
  const freshVideos = filterVideosByFreshness(MOCK_VIDEOS);
  const dynamicCategories = getDynamicCategories(freshVideos);
  
  const allCategories = [...CATEGORIES, ...dynamicCategories];
  
  return NextResponse.json(allCategories);
}