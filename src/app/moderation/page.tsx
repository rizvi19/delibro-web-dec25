'use client';

import { useEffect, useState } from 'react';

interface ModerationResponse {
  suspiciousProducts: { id: string }[];
  suspiciousOrders: { id: string }[];
}

export default function ModerationPage() {
  const [data, setData] = useState<ModerationResponse | null>(null);

  useEffect(() => {
    fetch('/api/moderation')
      .then((res) => res.json())
      .then((payload) => setData(payload));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="rounded border border-dashed bg-amber-50 text-amber-900 p-3 text-sm">
        Moderation & reporting: Homemade only / no companies. Flagged items appear here for admin review.
      </div>
      {data ? (
        <div className="space-y-3">
          <div className="border rounded p-3">
            <h2 className="font-semibold">Suspicious products</h2>
            {data.suspiciousProducts.length === 0 && <div className="text-sm text-muted-foreground">No reports.</div>}
            {data.suspiciousProducts.map((product) => (
              <div key={product.id} className="text-sm">Product {product.id}</div>
            ))}
          </div>
          <div className="border rounded p-3">
            <h2 className="font-semibold">Non-compliant delivery</h2>
            {data.suspiciousOrders.length === 0 && <div className="text-sm text-muted-foreground">All clear.</div>}
            {data.suspiciousOrders.map((order) => (
              <div key={order.id} className="text-sm">Order {order.id} needs review</div>
            ))}
          </div>
        </div>
      ) : (
        <div>Loading moderation signals...</div>
      )}
    </div>
  );
}
