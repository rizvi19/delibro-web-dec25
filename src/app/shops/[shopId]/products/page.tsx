'use client';

import { useEffect, useState } from 'react';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  inventory: number;
  safetyNotes: string;
  homemadeTag: boolean;
  bannedCompanyMentioned: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  homemadeTag: boolean;
  safetyNotes?: string;
  bannedCompanyMentioned?: boolean;
}

export default function ShopProductsPage({ params }: { params: { shopId: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    inventory: 0,
    safetyNotes: '',
    homemadeTag: true,
    bannedCompanyMentioned: false,
  });

  const refresh = async () => {
    const res = await fetch(`/api/products?shopId=${params.shopId}`);
    const data = await res.json();
    setProducts(data.products || []);
  };

  useEffect(() => {
    refresh();
  }, []);

  const submit = async () => {
    setError(null);
    const res = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify({ ...form, shopId: params.shopId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to add product');
    } else {
      setForm({ name: '', description: '', price: 0, inventory: 0, safetyNotes: '', homemadeTag: true, bannedCompanyMentioned: false });
      refresh();
    }
  };

  const markHomemade = (id: string) =>
    fetch(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify({ homemadeTag: true }) }).then(refresh);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage products</h1>
          <p className="text-muted-foreground">All items must be marked homemade. Company tags are blocked.</p>
        </div>
        <div className="rounded bg-slate-100 px-3 py-1 text-sm">Shop ID: {params.shopId}</div>
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <h2 className="text-xl font-semibold">Add a homemade item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Name"
            className="border rounded px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            className="border rounded px-3 py-2"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
          <textarea
            placeholder="Description"
            className="border rounded px-3 py-2 col-span-1 md:col-span-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Inventory"
            type="number"
            className="border rounded px-3 py-2"
            value={form.inventory}
            onChange={(e) => setForm({ ...form, inventory: Number(e.target.value) })}
          />
          <input
            placeholder="Safety notes"
            className="border rounded px-3 py-2"
            value={form.safetyNotes}
            onChange={(e) => setForm({ ...form, safetyNotes: e.target.value })}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.homemadeTag}
              onChange={(e) => setForm({ ...form, homemadeTag: e.target.checked })}
            />
            <span>Homemade confirmation (required)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.bannedCompanyMentioned}
              onChange={(e) => setForm({ ...form, bannedCompanyMentioned: e.target.checked })}
            />
            <span>Contains company branding? (must stay unchecked)</span>
          </label>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={submit}>
          Save product
        </button>
        {error && <div className="rounded bg-red-50 text-red-800 p-3">{error}</div>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="font-bold">${product.price}</div>
                <div className="text-xs text-muted-foreground">Inventory: {product.inventory}</div>
              </div>
            </div>
            <div className="text-xs">Safety: {product.safetyNotes || 'n/a'}</div>
            {!product.homemadeTag && (
              <div className="text-yellow-800 bg-yellow-50 border border-yellow-200 rounded px-2 py-1 text-xs inline-block">
                Needs homemade tag <button className="underline" onClick={() => markHomemade(product.id)}>Fix now</button>
              </div>
            )}
            {product.bannedCompanyMentioned && (
              <div className="text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1 text-xs">
                Company branding detected. Remove immediately.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
