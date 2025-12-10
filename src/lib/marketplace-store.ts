export type SellerType = 'individual';
export type Craftsmanship = 'handmade' | 'homemade';
export type DeliveryMethod = 'pickup' | 'courier' | 'passenger';

export interface ShopProfile {
  id: string;
  name: string;
  sellerType: SellerType;
  craftsmanship: Craftsmanship;
  profile: string;
  pickupAddress: string;
  contactEmail: string;
  contactPhone?: string;
  minimumOrderValue?: number;
  createdAt: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  homemadeTag: boolean;
  safetyNotes?: string;
  bannedCompanyMentioned?: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  shopId: string;
  buyerEmail: string;
  items: OrderItem[];
  deliveryMethod: DeliveryMethod;
  shippingAddress?: string;
  status: 'placed' | 'accepted' | 'rejected' | 'shipped' | 'delivered';
  shipmentStatus: 'label_pending' | 'in_transit' | 'delivered';
  total: number;
  fee: number;
  payout: number;
  trackingNumber: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  fees: number;
  settlementStatus: 'pending' | 'scheduled' | 'paid';
  payoutDate: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  orderId: string;
  type: 'order_placed' | 'order_shipped' | 'order_delivered';
  recipient: string;
  createdAt: string;
}

const shops: ShopProfile[] = [];
const products: Product[] = [];
const orders: Order[] = [];
const transactions: Transaction[] = [];
const notifications: Notification[] = [];

function now() {
  return new Date().toISOString();
}

function calculateFees(total: number) {
  const platformFee = total * 0.07;
  const payout = total - platformFee;
  return { platformFee, payout };
}

function ensureIndividualSeller(payload: Partial<ShopProfile>) {
  if (payload.sellerType && payload.sellerType !== 'individual') {
    throw new Error('Only individual sellers are allowed.');
  }
  if (payload.craftsmanship && !['handmade', 'homemade'].includes(payload.craftsmanship)) {
    throw new Error('Craftsmanship must be handmade or homemade.');
  }
}

export function createShop(payload: Omit<ShopProfile, 'id' | 'createdAt'>) {
  ensureIndividualSeller(payload);
  const id = crypto.randomUUID();
  const shop: ShopProfile = { ...payload, id, createdAt: now() };
  shops.push(shop);
  return shop;
}

export function listShops() {
  return shops;
}

export function getShop(id: string) {
  return shops.find((shop) => shop.id === id) || null;
}

export function createProduct(payload: Omit<Product, 'id' | 'createdAt'>) {
  const shop = getShop(payload.shopId);
  if (!shop) throw new Error('Shop not found');
  ensureIndividualSeller(shop);
  if (!payload.homemadeTag) {
    throw new Error('Products must be marked as homemade.');
  }
  if (payload.bannedCompanyMentioned) {
    throw new Error('Company involvement is not allowed.');
  }
  if (payload.inventory < 0) {
    throw new Error('Inventory must be positive.');
  }
  const id = crypto.randomUUID();
  const product: Product = { ...payload, id, createdAt: now() };
  products.push(product);
  return product;
}

export function listProducts(shopId?: string) {
  return shopId ? products.filter((p) => p.shopId === shopId) : products;
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const existing = products.find((p) => p.id === id);
  if (!existing) throw new Error('Product not found');
  if (updates.bannedCompanyMentioned) {
    throw new Error('Company involvement is not allowed.');
  }
  if (updates.homemadeTag === false) {
    throw new Error('Products must remain homemade.');
  }
  Object.assign(existing, updates);
  return existing;
}

export function removeProduct(id: string) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Product not found');
  products.splice(index, 1);
}

export function createOrder(payload: {
  shopId: string;
  items: OrderItem[];
  deliveryMethod: DeliveryMethod;
  shippingAddress?: string;
  buyerEmail: string;
}) {
  const shop = getShop(payload.shopId);
  if (!shop) throw new Error('Shop not found');
  const shopProducts = listProducts(payload.shopId);
  const orderItems = payload.items.map((item) => {
    const product = shopProducts.find((p) => p.id === item.productId);
    if (!product) throw new Error('Product not found');
    if (product.inventory < item.quantity) {
      throw new Error(`Not enough inventory for ${product.name}`);
    }
    product.inventory -= item.quantity;
    return item;
  });
  const total = orderItems.reduce((acc, item) => {
    const product = shopProducts.find((p) => p.id === item.productId)!;
    return acc + product.price * item.quantity;
  }, 0);
  const minimum = shop.minimumOrderValue || 0;
  if (total < minimum) {
    throw new Error(`Minimum order value is ${minimum}`);
  }
  if (payload.deliveryMethod === 'courier' && !payload.shippingAddress) {
    throw new Error('Courier deliveries need an address.');
  }
  const { platformFee, payout } = calculateFees(total);
  const order: Order = {
    id: crypto.randomUUID(),
    shopId: payload.shopId,
    buyerEmail: payload.buyerEmail,
    items: orderItems,
    deliveryMethod: payload.deliveryMethod,
    shippingAddress: payload.shippingAddress,
    status: 'placed',
    shipmentStatus: payload.deliveryMethod === 'courier' ? 'label_pending' : 'delivered',
    total,
    fee: platformFee,
    payout,
    trackingNumber: `TRACK-${Math.floor(Math.random() * 100000)}`,
    createdAt: now(),
  };
  orders.push(order);
  const tx: Transaction = {
    id: crypto.randomUUID(),
    orderId: order.id,
    amount: total,
    fees: platformFee,
    settlementStatus: 'scheduled',
    payoutDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    createdAt: now(),
  };
  transactions.push(tx);
  notifications.push({
    id: crypto.randomUUID(),
    orderId: order.id,
    type: 'order_placed',
    recipient: payload.buyerEmail,
    createdAt: now(),
  });
  return order;
}

export function listOrders(shopId?: string) {
  return shopId ? orders.filter((o) => o.shopId === shopId) : orders;
}

export function updateOrderStatus(id: string, updates: Partial<Order>) {
  const existing = orders.find((o) => o.id === id);
  if (!existing) throw new Error('Order not found');
  Object.assign(existing, updates);
  if (updates.status === 'shipped') {
    existing.shipmentStatus = 'in_transit';
    notifications.push({
      id: crypto.randomUUID(),
      orderId: existing.id,
      type: 'order_shipped',
      recipient: existing.buyerEmail,
      createdAt: now(),
    });
  }
  if (updates.status === 'delivered') {
    existing.shipmentStatus = 'delivered';
    notifications.push({
      id: crypto.randomUUID(),
      orderId: existing.id,
      type: 'order_delivered',
      recipient: existing.buyerEmail,
      createdAt: now(),
    });
  }
  return existing;
}

export function listTransactions(shopId?: string) {
  if (!shopId) return transactions;
  const shopOrders = listOrders(shopId).map((o) => o.id);
  return transactions.filter((tx) => shopOrders.includes(tx.orderId));
}

export function analyticsSummary(shopId?: string) {
  const shopOrders = shopId ? listOrders(shopId) : orders;
  const totalSales = shopOrders.reduce((sum, order) => sum + order.total, 0);
  const topItems: Record<string, number> = {};
  shopOrders.forEach((order) => {
    order.items.forEach((item) => {
      topItems[item.productId] = (topItems[item.productId] || 0) + item.quantity;
    });
  });
  const leaderboard = Object.entries(topItems)
    .map(([productId, qty]) => {
      const product = products.find((p) => p.id === productId);
      return { productName: product?.name || 'Unknown', quantity: qty };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
  const suspicious = products.filter((p) => p.bannedCompanyMentioned || !p.homemadeTag);
  return { totalSales, orderCount: shopOrders.length, leaderboard, suspicious };
}

export function moderationFlags() {
  return {
    suspiciousProducts: products.filter((p) => p.bannedCompanyMentioned),
    suspiciousOrders: orders.filter((o) => o.deliveryMethod === 'passenger'),
  };
}

export function listNotifications() {
  return notifications;
}
