import { NextRequest, NextResponse } from 'next/server';
import { removeProduct, updateProduct } from '@/lib/marketplace-store';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await request.json();
    const product = updateProduct(params.id, {
      name: payload.name,
      description: payload.description,
      price: payload.price ? Number(payload.price) : undefined,
      inventory: payload.inventory !== undefined ? Number(payload.inventory) : undefined,
      homemadeTag: payload.homemadeTag,
      safetyNotes: payload.safetyNotes,
      bannedCompanyMentioned: payload.bannedCompanyMentioned,
    });
    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to update product' }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    removeProduct(params.id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to delete product' }, { status: 400 });
  }
}
