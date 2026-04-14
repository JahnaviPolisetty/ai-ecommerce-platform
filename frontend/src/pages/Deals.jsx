import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Zap, Clock, Tag, TrendingDown, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';

const DEAL_CATEGORIES = ['All', 'Electronics', 'Home and Kitchen', 'Clothing', 'Sports', 'Beauty'];

export default function Deals() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error("Failed to fetch deals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const dealProducts = products
    .filter((p) => p.originalPrice > p.price)
    .map((p) => ({
      ...p,
      savePct: Math.round((1 - p.price / p.originalPrice) * 100),
      // Randomly assign flash deal status to top 15% discount for UI
      deal: ((1 - p.price / p.originalPrice) * 100) > 15 ? { endTime: new Date(Date.now() + 36000000) } : null,
    }))
    .sort((a, b) => b.savePct - a.savePct);

  const flashDeals = dealProducts.filter((p) => p.deal).slice(0, 3);
  const filtered = activeCategory === 'All'
    ? dealProducts
    : dealProducts.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());

  if (loading) {
     return <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse text-center"><h2 className="text-xl">Loading Live Deals...</h2></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in relative z-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#cc0c39] to-[#ff6600] rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Zap size={28} className="text-yellow-300" />
          <h1 className="text-3xl font-bold">Today's Deals</h1>
        </div>
        <p className="text-white/90 text-sm">Limited time offers — prices may go up anytime!</p>
        <div className="mt-3 flex items-center gap-2">
          <Clock size={16} />
          <CountdownTimer endTime={new Date(Date.now() + 86400000)} />
        </div>
      </div>

      {/* Flash Deals */}
      {flashDeals.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={20} className="text-[#ff9900]" />
            <h2 className="text-xl font-bold text-gray-900">Flash Deals</h2>
            <span className="bg-[#cc0c39] text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">LIVE</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {flashDeals.map((p) => (
              <Link key={p._id || p.id} to={`/product/${p._id || p.id}`}>
                <div className="bg-white border-2 border-[#ff9900] rounded-xl overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="relative">
                    <img src={p.image} alt={p.name} className="w-full h-44 object-contain bg-gray-50 p-3 group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 left-2 bg-[#cc0c39] text-white rounded-lg px-2 py-1">
                      <span className="text-lg font-black">-{p.savePct}%</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm line-clamp-2 mb-2 text-gray-900">{p.name}</p>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-black text-[#cc0c39]">${p.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 mb-1">
                      <div className="bg-[#ff9900] h-2 rounded-full" style={{ width: `${45 + Math.random() * 40}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Claimed</span>
                      {p.deal && <CountdownTimer endTime={p.deal.endTime} />}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter size={16} className="text-gray-500" />
        {DEAL_CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-[#ff9900] text-black border border-[#ff9900]' : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-800'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* All Deals */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown size={20} className="text-green-600" />
        <h2 className="text-xl font-bold text-gray-900">All Deals</h2>
        <span className="text-gray-500 text-sm">({filtered.length} offers)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-8">
        {filtered.map((p) => (
          <div key={p._id || p.id} className="relative">
            <div className="absolute -top-2 -right-2 z-10 bg-[#cc0c39] text-white text-xs font-black w-10 h-10 rounded-full flex items-center justify-center shadow-md">
              -{p.savePct}%
            </div>
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Tag size={50} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">No deals in this category right now.</p>
        </div>
      )}
    </div>
  );
}
