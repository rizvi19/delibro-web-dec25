'use client';

import { useEffect, useState } from 'react';

interface AnalyticsResponse {
  totalSales: number;
  orderCount: number;
  leaderboard: { productName: string; quantity: number }[];
  suspicious: { productName?: string; id: string }[];
}

export default function MarketplaceAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    fetch('/api/orders?analytics=true')
      .then((res) => res.json())
      .then((data) => setAnalytics(data.analytics));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Maker analytics</h1>
        <p className="text-muted-foreground">Sales, top items, and moderation flags for homemade quality.</p>
      </div>
      {analytics ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded p-3">
              <div className="text-sm text-muted-foreground">Total sales</div>
              <div className="text-2xl font-bold">${analytics.totalSales}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-sm text-muted-foreground">Orders</div>
              <div className="text-2xl font-bold">{analytics.orderCount}</div>
            </div>
          </div>
          <div className="border rounded p-3">
            <h2 className="text-lg font-semibold mb-2">Top homemade items</h2>
            <ul className="space-y-1 text-sm">
              {analytics.leaderboard.map((entry, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{entry.productName}</span>
                  <span>{entry.quantity} sold</span>
                </li>
              ))}
              {analytics.leaderboard.length === 0 && <li className="text-muted-foreground">No sales yet.</li>}
            </ul>
          </div>
          <div className="border rounded p-3 bg-amber-50 border-amber-200">
            <h2 className="text-lg font-semibold mb-2">Flags (homemade only / no companies)</h2>
            {analytics.suspicious.length === 0 && <div className="text-sm">No suspicious items.</div>}
            {analytics.suspicious.map((flag, idx) => (
              <div key={idx} className="text-sm">{flag.productName || 'Unnamed'} flagged for review</div>
            ))}
          </div>
        </div>
      ) : (
        <div>Loading analytics...</div>
      )}
    </div>
  );
}
