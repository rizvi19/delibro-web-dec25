'use client';

import { useEffect, useState } from 'react';

interface Shop {
  id: string;
  name: string;
  profile: string;
  pickupAddress: string;
  contactEmail: string;
  contactPhone?: string;
  minimumOrderValue?: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  homemadeTag: boolean;
}

export default function ShopfrontPage({ params }: { params: { shopId: string } }) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/shops')
      .then((res) => res.json())
      .then((data) => setShop((data.shops || []).find((s: Shop) => s.id === params.shopId) || null));
    fetch(`/api/products?shopId=${params.shopId}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, [params.shopId]);

  const addToCart = (id: string) => {
    const next = { ...cart, [id]: (cart[id] || 0) + 1 };
    setCart(next);
    localStorage.setItem('market-cart', JSON.stringify(next));
    localStorage.setItem('market-shop', params.shopId);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="rounded border border-dashed bg-amber-50 text-amber-900 p-3 text-sm">
        Homemade only / no companies. We screen products for handmade authenticity and safety.
      </div>
      {shop ? (
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{shop.name}</h1>
          <p className="text-muted-foreground">{shop.profile}</p>
          <div className="text-sm text-slate-700">Pickup: {shop.pickupAddress}</div>
          <div className="text-sm text-slate-700">Contact: {shop.contactEmail}</div>
          {shop.contactPhone && <div className="text-sm text-slate-700">Phone: {shop.contactPhone}</div>}
          {shop.minimumOrderValue ? (
            <div className="text-sm font-semibold">Minimum order: ${shop.minimumOrderValue}</div>
          ) : null}
        </div>
      ) : (
        <div>Loading shop...</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="font-bold">${product.price}</div>
                <div className="text-xs text-muted-foreground">Inventory {product.inventory}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">Homemade</span>
              <button
                disabled={product.inventory === 0}
                className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-60"
                onClick={() => addToCart(product.id)}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
