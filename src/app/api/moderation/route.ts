import { NextResponse } from 'next/server';
import { moderationFlags } from '@/lib/marketplace-store';

export async function GET() {
  return NextResponse.json(moderationFlags());
}
