'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  fees: number;
  settlementStatus: string;
  payoutDate: string;
}

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions || []));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Payments & fees</h1>
        <p className="text-muted-foreground">Transparent platform fees and payout schedule for makers.</p>
      </div>
      <div className="rounded border border-dashed bg-blue-50 text-blue-900 p-3 text-sm">
        Platform fee: 7% per order. Payouts scheduled weekly. Passenger delivery remains future-ready.
      </div>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div key={tx.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">Order {tx.orderId}</div>
              <div className="text-xs text-muted-foreground">Settlement: {tx.settlementStatus}</div>
            </div>
            <div className="text-right text-sm">
              <div>Gross ${tx.amount}</div>
              <div>Fees ${tx.fees}</div>
              <div className="text-xs">Payout {new Date(tx.payoutDate).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
        {transactions.length === 0 && <div className="text-sm text-muted-foreground">No transactions yet.</div>}
      </div>
    </div>
  );
}
