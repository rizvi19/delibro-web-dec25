'use client';

import { useEffect, useState } from 'react';

type Status = 'placed' | 'accepted' | 'rejected' | 'shipped' | 'delivered';

interface Order {
  id: string;
  shopId: string;
  buyerEmail: string;
  deliveryMethod: string;
  status: Status;
  shipmentStatus: string;
  trackingNumber: string;
  total: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data.orders || []);
  };

  useEffect(() => {
    refresh();
  }, []);

  const updateStatus = async (id: string, status: Status) => {
    setError(null);
    const res = await fetch('/api/orders', { method: 'PATCH', body: JSON.stringify({ id, status }) });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to update');
    } else {
      refresh();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders & tracking</h1>
          <p className="text-muted-foreground">Buyers see status; sellers can accept, reject, or mark shipped.</p>
        </div>
        <div className="rounded bg-slate-100 px-3 py-2 text-sm">Shipment status stored and exposed via API.</div>
      </div>
      {error && <div className="rounded bg-red-50 text-red-800 p-3">{error}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Order {order.id}</div>
                <div className="text-xs text-muted-foreground">Buyer: {order.buyerEmail}</div>
                <div className="text-xs text-muted-foreground">Shop: {order.shopId}</div>
              </div>
              <div className="text-right text-sm">
                <div className="font-bold">${order.total}</div>
                <div className="text-xs">Tracking: {order.trackingNumber}</div>
              </div>
            </div>
            <div className="text-sm">Delivery: {order.deliveryMethod}</div>
            <div className="text-sm">Status: {order.status}</div>
            <div className="text-xs text-muted-foreground">Shipment state: {order.shipmentStatus}</div>
            <div className="flex gap-2 text-xs">
              <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => updateStatus(order.id, 'accepted')}>
                Accept
              </button>
              <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => updateStatus(order.id, 'rejected')}>
                Reject
              </button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => updateStatus(order.id, 'shipped')}>
                Mark shipped
              </button>
              <button className="px-3 py-1 rounded bg-slate-700 text-white" onClick={() => updateStatus(order.id, 'delivered')}>
                Mark delivered
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
