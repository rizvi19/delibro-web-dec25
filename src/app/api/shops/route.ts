import { NextRequest, NextResponse } from 'next/server';
import { createShop, listShops } from '@/lib/marketplace-store';

export async function GET() {
  return NextResponse.json({ shops: listShops() });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const shop = createShop({
      name: payload.name,
      sellerType: 'individual',
      craftsmanship: payload.craftsmanship || 'handmade',
      profile: payload.profile || '',
      pickupAddress: payload.pickupAddress || '',
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      minimumOrderValue: payload.minimumOrderValue ? Number(payload.minimumOrderValue) : undefined,
    });
    return NextResponse.json({ shop }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to create shop' }, { status: 400 });
  }
}
