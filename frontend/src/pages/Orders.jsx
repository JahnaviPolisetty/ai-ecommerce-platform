import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Search, RotateCcw, Star, Truck } from 'lucide-react';
import { useStore } from '../store/useStore';

const STATUS_COLORS = {
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const MOCK_ORDERS = [
  {
    id: 'AMZ-2024-001',
    date: '2024-03-10',
    status: 'Delivered',
    total: 399.97,
    items: [
      { id: 2, name: 'Sony WH-1000XM5 Wireless Headphones', price: 279.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
      { id: 12, name: 'Kindle Paperwhite 11th Gen', price: 109.99, quantity: 1, image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=100' },
    ],
  },
  {
    id: 'AMZ-2024-002',
    date: '2024-03-15',
    status: 'Shipped',
    total: 1099.99,
    items: [
      { id: 10, name: 'iPad Pro 12.9" M2 with Apple Pencil', price: 1099.99, quantity: 1, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100' },
    ],
  },
];

export default function Orders() {
  const { orders, isLoggedIn } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const allOrders = [...orders, ...MOCK_ORDERS];
  const filtered = allOrders.filter((o) => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items?.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all' || o.status.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <Package size={60} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Sign in to see your orders</h2>
        <p className="text-gray-500 mb-6 text-sm">Track, return, or buy things again</p>
        <Link to="/login">
          <button className="bg-[#ff9900] hover:bg-[#e88a00] text-black font-bold px-8 py-2.5 rounded-full">Sign In</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>

      {/* Toolbar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#ff9900]" />
        </div>
        <div className="flex gap-2">
          {['all', 'processing', 'shipped', 'delivered'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-[#ff9900] text-black' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Package size={50} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">No orders found</p>
          <Link to="/products" className="text-[#007185] hover:underline text-sm mt-2 block">Start shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-6 text-xs text-gray-600">
                  <div><span className="font-semibold text-gray-900 uppercase text-xs">Order Placed</span><br />{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div><span className="font-semibold text-gray-900 uppercase text-xs">Total</span><br />${order.total?.toFixed(2)}</div>
                  <div><span className="font-semibold text-gray-900 uppercase text-xs">Order #</span><br />{order.id}</div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex flex-wrap gap-3 flex-1">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded border" />
                        <div>
                          <Link to={`/product/${item.id}`} className="text-sm font-medium hover:text-[#c7511f] line-clamp-2 max-w-xs">{item.name}</Link>
                          <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} · ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {order.status === 'Shipped' && (
                      <button className="flex items-center gap-2 text-sm text-[#007185] hover:text-[#c7511f] border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50">
                        <Truck size={14} /> Track Package
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <button className="flex items-center gap-2 text-sm text-[#007185] hover:text-[#c7511f] border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50">
                        <Star size={14} /> Write a Review
                      </button>
                    )}
                    <button className="flex items-center gap-2 text-sm text-[#007185] hover:text-[#c7511f] border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50">
                      <RotateCcw size={14} /> Return / Replace
                    </button>
                    <Link to={`/product/${order.items?.[0]?.id}`}>
                      <button className="flex items-center gap-2 text-sm text-[#007185] hover:text-[#c7511f] border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 w-full">
                        <Package size={14} /> Buy Again
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
