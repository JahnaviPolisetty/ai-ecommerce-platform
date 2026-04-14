import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import useDebounce from '../hooks/useDebounce';
import { Filter, Search, ChevronDown } from 'lucide-react';

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('rating');
  const [loading, setLoading] = useState(true);
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearchTerm(searchParams.get('keyword') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/products', {
          params: { keyword: debouncedSearch, category }
        });
        
        if (!Array.isArray(data)) {
           throw new Error("Invalid format");
        }
        
        // Manual sorting since our dummy DB might not
        let sorted = [...data];
        if (sort === 'priceLowHigh') sorted.sort((a, b) => a.price - b.price);
        else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
        else if (sort === 'popularity') sorted.sort((a, b) => b.numReviews - a.numReviews);
        
        setProducts(sorted);
      } catch (error) {
        console.error(error);
        // Fallback for mockup if DB down
        setProducts([
          { _id: '1', name: 'Premium Wireless Headphones X1', category: 'Electronics', price: 299.99, rating: 4.8, numReviews: 120, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
          { _id: '2', name: 'Mechanical Keyboard Pro', category: 'Accessories', price: 149.50, rating: 4.9, numReviews: 85, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [debouncedSearch, category, sort]);

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-fade-in relative z-10">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-6">
        <div className="card p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" /> Filters
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 font-medium mb-2 block">Search Products</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Macbook, iPhone..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#ff9900] outline-none"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium mb-2 block">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 appearance-none focus:ring-2 focus:ring-[#ff9900] outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Sports">Sports</option>
                  <option value="Beauty">Beauty</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium mb-2 block">Sort By</label>
              <div className="relative">
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 appearance-none focus:ring-2 focus:ring-[#ff9900] outline-none"
                >
                  <option value="rating">Top Rated</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="popularity">Most Popular</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <button 
              onClick={() => { setSearchTerm(''); setCategory(''); setSort('rating'); }}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors mt-4"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Main Grid */}
      <main className="flex-1 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Discover Products</h1>
          <span className="text-[#007185] bg-blue-50 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
            {products.length} Results
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="card h-[400px] animate-pulse bg-slate-800/50"></div>)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 card">
            <h2 className="text-2xl font-bold text-slate-300">No products found</h2>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductListing;
