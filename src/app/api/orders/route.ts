import { NextRequest, NextResponse } from 'next/server';
import { analyticsSummary, createOrder, listOrders, updateOrderStatus } from '@/lib/marketplace-store';

export async function GET(request: NextRequest) {
  const shopId = request.nextUrl.searchParams.get('shopId') || undefined;
  const withAnalytics = request.nextUrl.searchParams.get('analytics');
  if (withAnalytics) {
    return NextResponse.json({ analytics: analyticsSummary(shopId) });
  }
  return NextResponse.json({ orders: listOrders(shopId) });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const order = createOrder({
      shopId: payload.shopId,
      items: payload.items,
      deliveryMethod: payload.deliveryMethod,
      shippingAddress: payload.shippingAddress,
      buyerEmail: payload.buyerEmail,
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to create order' }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json();
    const order = updateOrderStatus(payload.id, {
      status: payload.status,
      shipmentStatus: payload.shipmentStatus,
    });
    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to update order' }, { status: 400 });
  }
}
