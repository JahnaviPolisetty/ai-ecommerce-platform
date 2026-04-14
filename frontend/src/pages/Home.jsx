import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Zap, Star, TrendingUp, Package } from 'lucide-react';
import { categories, banners, deals } from '../data/products';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import { useStore } from '../store/useStore';
import axios from 'axios';

/* ── Hero Carousel ── */
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const reset = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % banners.length), 5000);
  };

  useEffect(() => {
    reset();
    return () => clearInterval(timerRef.current);
  }, []);

  const go = (dir) => { setCurrent((p) => (p + dir + banners.length) % banners.length); reset(); };

  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ height: 360 }}>
      {banners.map((ban, i) => (
        <div
          key={ban.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={ban.image} alt={ban.title} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${ban.bg} opacity-60`} />
          <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 max-w-lg leading-tight">{ban.title}</h1>
            <p className="text-lg mb-6 text-white/90">{ban.subtitle}</p>
            <button
              onClick={() => navigate(`/products?category=${ban.category}`)}
              className="bg-[#ff9900] hover:bg-[#e88a00] text-black font-bold px-8 py-3 rounded-full text-lg transition-colors w-fit"
            >
              {ban.cta}
            </button>
          </div>
        </div>
      ))}
      {/* Arrows */}
      <button onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10">
        <ChevronLeft size={20} />
      </button>
      <button onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10">
        <ChevronRight size={20} />
      </button>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <button key={i} onClick={() => { setCurrent(i); reset(); }}
            className={`rounded-full transition-all ${i === current ? 'w-6 h-2.5 bg-[#ff9900]' : 'w-2.5 h-2.5 bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Category Grid ── */
function CategoryGrid() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Shop by Category</h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((cat) => (
          <Link key={cat.id} to={`/products?category=${cat.id}`}>
            <div className="bg-white rounded-xl p-3 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 cursor-pointer group">
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center group-hover:text-[#ff9900]">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Deals of the Day ── */
function DealsSection({ products }) {
  if (!products.length) return null;
  const dealProducts = deals.map((d) => ({ ...products.find((p) => String(p.id) === String(d.productId)) || products[0], deal: d }));
  return (
    <div className="bg-white rounded-lg p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Zap size={22} className="text-[#ff9900]" />
          <h2 className="text-xl font-bold text-gray-900">Today's Deals</h2>
          <CountdownTimer endTime={deals[0].endTime} />
        </div>
        <Link to="/products" className="text-[#007185] hover:text-[#c7511f] text-sm font-medium">See all deals →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {dealProducts.map((dp, i) => (
          <Link key={i} to={`/product/${dp._id || dp.id}`}>
            <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all group">
              <div className="relative">
                <img src={dp.image} alt={dp.name} className="w-full h-40 object-contain bg-gray-50 rounded group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 bg-[#cc0c39] text-white text-xs font-bold px-2 py-0.5 rounded">
                  -{dp.deal.discount}%
                </span>
              </div>
              <p className="text-sm font-medium mt-2 line-clamp-2 text-black">{dp.name}</p>
              <p className="text-lg font-bold text-gray-900">${(dp.price * (1 - dp.deal.discount / 100)).toFixed(2)}</p>
              <p className="text-xs text-gray-400 line-through">${dp.price?.toFixed(2)}</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff9900] rounded-full" style={{ width: `${60 + Math.random() * 30}%` }} />
              </div>
              <p className="text-xs text-[#cc0c39] font-medium mt-1">Limited time offer</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Product Row ── */
function ProductRow({ title, icon: Icon, products: prods, viewAllLink }) {
  const rowRef = useRef(null);
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });

  if (!prods || prods.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-100 scale-in-center">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={20} className="text-[#ff9900]" />}
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-black"><ChevronLeft size={16} /></button>
          <button onClick={() => scroll(1)} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-black"><ChevronRight size={16} /></button>
          {viewAllLink && <Link to={viewAllLink} className="text-[#007185] hover:text-[#c7511f] text-sm font-medium whitespace-nowrap">See all →</Link>}
        </div>
      </div>
      <div ref={rowRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {prods.map((p, i) => (
          <div key={p._id || i} className="flex-none w-48">
            <ProductCard product={p} compact />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── AI Recommendation Banner ── */
function AIBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white my-6 slide-in-top">
      <div className="absolute top-0 left-0 w-full h-full opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ff9900 0%, transparent 50%), radial-gradient(circle at 80% 50%, #6366f1 0%, transparent 50%)' }}
      />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={24} className="text-[#ff9900]" />
            <span className="text-[#ff9900] font-bold text-sm uppercase tracking-wider">AI-Powered</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Personalized Picks Just for You</h2>
          <p className="text-gray-300 text-sm max-w-md">
            Our AI analyzes your browsing history, purchase patterns, and preferences to recommend products you'll love.
          </p>
        </div>
        <Link to="/products">
          <button className="bg-[#ff9900] hover:bg-[#e88a00] text-black font-bold px-8 py-3 rounded-full text-lg transition-all hover:scale-105 pulse-ring flex items-center gap-2 whitespace-nowrap">
            <Sparkles size={18} />
            See My AI Picks
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ── Prime Banner ── */
function PrimeBanner() {
  return (
    <div className="bg-gradient-to-r from-[#00a8e1] to-[#0066c0] rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 my-6">
      <div className="flex items-center gap-4">
        <Package size={40} className="opacity-80" />
        <div>
          <p className="text-sm font-semibold opacity-80">Amazon</p>
          <p className="text-2xl font-bold italic">prime</p>
          <p className="text-sm opacity-90">Fast delivery · Exclusive deals · Prime Video</p>
        </div>
      </div>
      <button className="bg-white text-[#0066c0] font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
        Try Prime Free
      </button>
    </div>
  );
}

/* ── Main Home Page ── */
export default function Home() {
  const { recentlyViewed } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const bestsellers = products.filter((p) => p.badge?.includes('Best') || p.rating > 4.6).slice(0, 10);
  const topCategories = products.filter((p) => p.category === 'smartphones' || p.category === 'laptops' || p.category === 'electronics').slice(0, 10);
  const newArrivals = [...products].sort((a, b) => b.id - a.id).slice(0, 10);
  const topDeals = products.filter((p) => p.badge === 'Top Deal').slice(0, 10);

  return (
    <div className="max-w-[1500px] w-full mx-auto px-4 py-4 space-y-6 text-gray-900 bg-gray-50 min-h-screen font-sans slide-in-top">
      <HeroCarousel />
      <CategoryGrid />
      <AIBanner />
      {!loading && <DealsSection products={products} />}
      {!loading ? (
        <>
          <ProductRow title="Best Sellers" icon={TrendingUp} products={bestsellers} viewAllLink="/products?sort=bestseller" />
          <ProductRow title="Top Deals in Tech" products={topCategories} viewAllLink="/products" />
          <PrimeBanner />
          <ProductRow title="New Arrivals" icon={Star} products={newArrivals} viewAllLink="/products?sort=new" />
          <ProductRow title="Top Rated Choices" products={topDeals} viewAllLink="/products" />
          {recentlyViewed && recentlyViewed.length > 0 && (
            <ProductRow title="Recently Viewed" products={recentlyViewed} />
          )}
        </>
      ) : (
        <div className="py-20 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-xl font-bold text-gray-700">Loading amazing products...</p>
        </div>
      )}
    </div>
  );
}
