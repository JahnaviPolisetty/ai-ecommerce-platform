import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Brain, TrendingUp, Heart, ShoppingBag, Zap } from 'lucide-react';
import { products } from '../data/products';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

// SDK removed to prevent Vite crash; AI Insight will gracefully fallback or route to your MERN Backend ML.

function AIInsightCard({ icon: Icon, title, content, color }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
        <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}

export default function AIRecommendations() {
  const { recentlyViewed, wishlist, cart, addToCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [streamedText, setStreamedText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [activePersona, setActivePersona] = useState('general');
  const [hasGenerated, setHasGenerated] = useState(false);

  const personas = [
    { id: 'general', label: 'General', icon: Sparkles },
    { id: 'tech', label: 'Tech Lover', icon: Brain },
    { id: 'budget', label: 'Budget Savvy', icon: TrendingUp },
    { id: 'gifter', label: 'Gift Finder', icon: Heart },
  ];

  const getPersonaPrompt = (persona) => {
    const viewed = recentlyViewed.map((p) => p.name).join(', ') || 'various products';
    const wished = wishlist.map((p) => p.name).join(', ') || 'no items';
    const carted = cart.map((p) => p.name).join(', ') || 'no items';

    const baseContext = `User's recently viewed: ${viewed}. Wishlist: ${wished}. Cart: ${carted}.`;

    const personas = {
      general: `${baseContext} Provide personalized shopping recommendations and a brief shopping insight. Be friendly and conversational.`,
      tech: `${baseContext} The user loves technology. Recommend cutting-edge tech products and explain why they'd love them based on the latest trends.`,
      budget: `${baseContext} The user is budget-conscious. Recommend the best value products and highlight savings opportunities.`,
      gifter: `${baseContext} The user might be shopping for gifts. Suggest great gift ideas and explain who they'd be perfect for.`,
    };

    return personas[persona];
  };

  const computeRecommendations = (persona) => {
    let scored = products.map((p) => {
      let score = Math.random() * 0.3;
      if (recentlyViewed.find((r) => r.category === p.category)) score += 0.4;
      if (wishlist.find((w) => w.category === p.category)) score += 0.2;
      if (persona === 'tech' && p.category === 'electronics') score += 0.5;
      if (persona === 'budget' && p.price < 100) score += 0.5;
      if (persona === 'gifter') score += p.rating / 5 * 0.3;
      score += p.rating / 5 * 0.1;
      return { ...p, score };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, 8);
  };

  const generateAIInsight = async (persona) => {
    setLoading(true);
    setStreamedText('');
    setHasGenerated(false);
    const recs = computeRecommendations(persona);
    setRecommendations(recs);

    try {
      // Simulating AI delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fallbackMsg = `Based on your ${persona} profile, we've curated a personalized selection of top-rated products that match your interests. These recommendations are dynamically updated!`;
      setStreamedText(fallbackMsg);
      setAiInsight(fallbackMsg);
      setHasGenerated(true);
    } catch (err) {
      const fallback = "Based on your browsing, we've curated a personalized selection of top-rated products that match your interests and budget. These recommendations are updated in real-time as you explore more.";
      setStreamedText(fallback);
      setAiInsight(fallback);
      setHasGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const recs = computeRecommendations(activePersona);
    setRecommendations(recs);
  }, []);

  const displayText = streamedText || (hasGenerated ? aiInsight : '');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-8 p-8"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ff9900 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)' }} />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={24} className="text-[#ff9900]" />
              <span className="text-[#ff9900] font-bold text-sm uppercase tracking-widest">Powered by Claude AI</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Your AI Shopping Assistant</h1>
            <p className="text-gray-300 text-sm max-w-lg">
              Our AI analyzes your preferences, browsing history, and the latest trends to find exactly what you'll love.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            {personas.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActivePersona(id); generateAIInsight(id); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activePersona === id ? 'bg-[#ff9900] text-black' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="bg-white border border-[#ff9900]/30 rounded-xl p-5 mb-8 shadow-sm ai-glow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff9900] to-[#ff6600] rounded-full flex items-center justify-center shrink-0 pulse-ring">
              <Brain size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-gray-900">AI Insight</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Claude AI</span>
              </div>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-[#ff9900] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">Generating personalized insight...</span>
                </div>
              ) : displayText ? (
                <p className="text-sm text-gray-700 leading-relaxed">{displayText}{!hasGenerated && <span className="animate-pulse">▍</span>}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">Click a persona button above or "Generate" to get your AI-powered shopping insight.</p>
              )}
            </div>
          </div>
          <button
            onClick={() => generateAIInsight(activePersona)}
            disabled={loading}
            className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e88a00] text-black text-sm font-bold px-4 py-2 rounded-full transition-all disabled:opacity-60 shrink-0"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Generate
          </button>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AIInsightCard icon={TrendingUp} title="Trending Now" color="bg-blue-500"
          content={`${products.filter((p) => p.reviews > 10000).length} products trending in your area this week.`} />
        <AIInsightCard icon={Zap} title="Flash Deals" color="bg-[#ff9900]"
          content="3 items in your wishlist are on sale today. Act fast before prices go back up!" />
        <AIInsightCard icon={ShoppingBag} title="Smart Bundles" color="bg-purple-500"
          content="Save up to 22% by buying frequently purchased together items as a bundle." />
      </div>

      {/* Recommendations Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={20} className="text-[#ff9900]" />
            Recommended for You
          </h2>
          <button onClick={() => { const recs = computeRecommendations(activePersona); setRecommendations(recs); }}
            className="text-sm text-[#007185] hover:text-[#c7511f] flex items-center gap-1">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recommendations.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Why These Recs */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Brain size={18} className="text-[#ff9900]" /> Why these recommendations?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-[#ff9900] font-bold">01</span>
            <p>Based on your browsing history and recently viewed {recentlyViewed.length > 0 ? `(${recentlyViewed.length} items)` : 'items'}.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#ff9900] font-bold">02</span>
            <p>Cross-referenced with trending products in your location and similar buyer profiles.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#ff9900] font-bold">03</span>
            <p>Refined using top ratings, verified reviews, and real-time inventory availability.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
