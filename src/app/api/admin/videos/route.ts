import { NextResponse } from 'next/server';
import { MOCK_VIDEOS } from '@/lib/mockData';

export async function GET() {
  // Return all videos including hidden ones for admin
  return NextResponse.json(MOCK_VIDEOS);
}