'use client';

import { useEffect, useMemo, useState } from 'react';

type DeliveryMethod = 'pickup' | 'courier' | 'passenger';

interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
}

interface Shop {
  id: string;
  name: string;
  minimumOrderValue?: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [shopId, setShopId] = useState<string | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('courier');
  const [shippingAddress, setShippingAddress] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('market-cart');
    const storedShop = localStorage.getItem('market-shop');
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedShop) setShopId(storedShop);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
    fetch('/api/shops')
      .then((res) => res.json())
      .then((data) => setShops(data.shops || []));
  }, []);

  const items = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      return product ? { ...product, quantity: qty } : null;
    }).filter(Boolean) as (Product & { quantity: number })[];
  }, [cart, products]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currentShop = shopId ? shops.find((s) => s.id === shopId) : undefined;

  const checkout = async () => {
    setMessage(null);
    setError(null);
    if (!shopId) {
      setError('Select a shop before checkout.');
      return;
    }
    if (deliveryMethod === 'courier' && !shippingAddress) {
      setError('Courier deliveries require an address.');
      return;
    }
    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        shopId,
        buyerEmail: email || 'buyer@example.com',
        deliveryMethod,
        shippingAddress,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to place order');
    } else {
      setMessage(`Order ${data.order.id} placed. Tracking ${data.order.trackingNumber}.`);
      setCart({});
      localStorage.removeItem('market-cart');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cart & checkout</h1>
          <p className="text-muted-foreground">Supports pickup or courier delivery with tracking placeholder.</p>
        </div>
        <div className="text-sm bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded">
          Delivery is abstracted to support courier today and passenger later.
        </div>
      </div>

      <div className="rounded border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Delivery method</div>
          <select
            className="border rounded px-3 py-2"
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
          >
            <option value="pickup">Pickup</option>
            <option value="courier">Courier (tracking placeholder)</option>
            <option value="passenger">Passenger (coming soon)</option>
          </select>
        </div>
        {deliveryMethod === 'courier' && (
          <input
            placeholder="Shipping address for courier"
            className="border rounded px-3 py-2 w-full"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        )}
      </div>

      <div className="rounded border p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold">Buyer email</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Shop</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={shopId || ''}
              onChange={(e) => setShopId(e.target.value)}
            >
              <option value="">Select shop</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
            {currentShop?.minimumOrderValue ? (
              <div className="text-xs text-slate-700 mt-1">Minimum order ${currentShop.minimumOrderValue}</div>
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-muted-foreground">Qty {item.quantity}</div>
              </div>
              <div>${item.price * item.quantity}</div>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-muted-foreground">Your cart is empty.</div>}
        </div>
        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>${total}</span>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={checkout} disabled={items.length === 0}>
          Place order
        </button>
        {message && <div className="rounded bg-green-50 text-green-800 p-3">{message}</div>}
        {error && <div className="rounded bg-red-50 text-red-800 p-3">{error}</div>}
      </div>
    </div>
  );
}
