import { NextResponse } from 'next/server';
import { listNotifications } from '@/lib/marketplace-store';

export async function GET() {
  return NextResponse.json({ notifications: listNotifications() });
}
