'use client';

import { FormEvent, useState } from 'react';

interface FormState {
  name: string;
  profile: string;
  pickupAddress: string;
  contactEmail: string;
  contactPhone: string;
  minimumOrderValue: number;
}

export default function NewShopPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    profile: '',
    pickupAddress: '',
    contactEmail: '',
    contactPhone: '',
    minimumOrderValue: 0,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const res = await fetch('/api/shops', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        sellerType: 'individual',
        craftsmanship: 'handmade',
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to onboard shop');
    } else {
      setMessage(`Shop created with ID ${data.shop.id}. Homemade/individual policy enforced.`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Onboard your homemade shop</h1>
        <p className="text-muted-foreground mt-2">
          We only accept individual makers selling handmade goods. Provide pickup/contact details so couriers and
          customers can reach you.
        </p>
        <div className="mt-3 rounded-md border border-dashed p-3 text-sm text-yellow-800 bg-yellow-50">
          Homemade only / no companies. Applications mentioning a company will be rejected automatically.
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold">Shop name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Profile (tell us about your craft)</label>
          <textarea
            required
            value={form.profile}
            onChange={(e) => setForm({ ...form, profile: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Pickup address</label>
            <input
              required
              value={form.pickupAddress}
              onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Minimum order (optional)</label>
            <input
              type="number"
              value={form.minimumOrderValue}
              onChange={(e) => setForm({ ...form, minimumOrderValue: Number(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Contact email</label>
            <input
              required
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Contact phone</label>
            <input
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Submit for review
        </button>
      </form>
      {message && <div className="rounded bg-green-50 text-green-800 p-3">{message}</div>}
      {error && <div className="rounded bg-red-50 text-red-800 p-3">{error}</div>}
    </div>
  );
}
