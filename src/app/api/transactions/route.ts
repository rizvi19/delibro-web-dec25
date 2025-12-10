import { NextRequest, NextResponse } from 'next/server';
import { listTransactions } from '@/lib/marketplace-store';

export async function GET(request: NextRequest) {
  const shopId = request.nextUrl.searchParams.get('shopId') || undefined;
  return NextResponse.json({ transactions: listTransactions(shopId) });
}
