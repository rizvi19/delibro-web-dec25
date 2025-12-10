import { NextRequest, NextResponse } from 'next/server';
import { createProduct, listProducts } from '@/lib/marketplace-store';

export async function GET(request: NextRequest) {
  const shopId = request.nextUrl.searchParams.get('shopId') || undefined;
  return NextResponse.json({ products: listProducts(shopId) });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const product = createProduct({
      shopId: payload.shopId,
      name: payload.name,
      description: payload.description,
      price: Number(payload.price),
      inventory: Number(payload.inventory ?? 0),
      homemadeTag: payload.homemadeTag !== false,
      safetyNotes: payload.safetyNotes,
      bannedCompanyMentioned: payload.bannedCompanyMentioned,
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to create product' }, { status: 400 });
  }
}
